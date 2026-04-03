import React, { useState, useRef, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  Play, Loader, RotateCcw, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Pencil, Trash2, Plus, Check, X, Bot
} from "lucide-react";

// ─── Pyodide loader (singleton) ───────────────────────────────────────────
let pyodideInstance = null;
let pyodideLoadPromise = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadPromise) return pyodideLoadPromise;
  pyodideLoadPromise = (async () => {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    pyodideInstance = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
    });
    return pyodideInstance;
  })();
  return pyodideLoadPromise;
}

// ─── Python test harness ──────────────────────────────────────────────────
const HARNESS = `
import sys, io, json, traceback, ast, copy

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
    def __repr__(self):
        return f"TreeNode({self.val})"

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Node:
    """N-ary tree node"""
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children or []

class Employee:
    def __init__(self, id, importance, subordinates):
        self.id = id
        self.importance = importance
        self.subordinates = subordinates

def _build_tree(vals):
    if not vals or vals[0] is None:
        return None
    root = TreeNode(vals[0])
    queue = [root]
    i = 1
    while queue and i < len(vals):
        node = queue.pop(0)
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i])
            queue.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i])
            queue.append(node.right)
        i += 1
    return root

def _tree_to_list(root):
    if not root:
        return []
    result, queue = [], [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None:
        result.pop()
    return result

def _build_linked_list(vals):
    if not vals:
        return None
    head = ListNode(vals[0])
    cur = head
    for v in vals[1:]:
        cur.next = ListNode(v)
        cur = cur.next
    return head

def _linked_list_to_list(head):
    result = []
    visited = set()
    cur = head
    while cur and id(cur) not in visited:
        visited.add(id(cur))
        result.append(cur.val)
        cur = cur.next
    return result

def _parse_val(s):
    s = s.strip()
    if not s:
        return None
    try:
        return json.loads(s)
    except Exception:
        try:
            return ast.literal_eval(s)
        except Exception:
            return s

def _normalize(v):
    if isinstance(v, bool):
        return str(v).lower()
    if isinstance(v, list):
        if all(isinstance(x, list) for x in v):
            return sorted([sorted(inner) if isinstance(inner, list) else inner for inner in v])
        return v
    return v

def _fmt(v):
    if isinstance(v, bool):
        return str(v).lower()
    return json.dumps(v, separators=(',', ':')) if not isinstance(v, str) else v

def _run_test(user_code, method_name, param_types, input_str, expected_str):
    buf = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = buf
    result_val = "__NOT_SET__"
    error_msg = None
    try:
        ns = {}
        exec(user_code, ns)
        raw_parts = input_str.strip().split("\\n")
        args = []
        for i, pt in enumerate(param_types):
            raw = raw_parts[i].strip() if i < len(raw_parts) else ""
            if pt in ("intarray", "strarray"):
                args.append(_parse_val(raw))
            elif pt == "int":
                args.append(int(raw))
            elif pt == "str":
                args.append(_parse_val(raw) if raw.startswith('"') else raw)
            elif pt in ("int2darray", "charmatrix"):
                args.append(_parse_val(raw))
            elif pt == "tree":
                args.append(_build_tree(_parse_val(raw) or []))
            elif pt == "linkedlist":
                args.append(_build_linked_list(_parse_val(raw) or []))
            elif pt == "float":
                args.append(float(raw))
            else:
                args.append(_parse_val(raw))

        sol_class = None
        for name, obj in ns.items():
            if isinstance(obj, type) and name in ("Solution", "MinStack", "MyQueue",
                "Trie", "MyHashMap", "MyHashSet"):
                sol_class = obj
                break

        if sol_class is None:
            raise ValueError("No Solution class found. Make sure you define 'class Solution:'")

        sol = sol_class()
        fn = getattr(sol, method_name, None)
        if fn is None:
            raise ValueError(f"Method '{method_name}' not found in your Solution class.")

        result_val = fn(*args)

        if result_val is None and param_types and param_types[0] in ("intarray","int2darray","charmatrix"):
            result_val = args[0]

        if hasattr(result_val, 'val') and hasattr(result_val, 'next'):
            result_val = _linked_list_to_list(result_val)
        elif hasattr(result_val, 'val') and hasattr(result_val, 'left'):
            result_val = _tree_to_list(result_val)

    except Exception as e:
        error_msg = traceback.format_exc()
    finally:
        sys.stdout = old_stdout

    stdout_out = buf.getvalue()

    if error_msg:
        return {"status": "error", "error": error_msg, "stdout": stdout_out}

    expected = _parse_val(expected_str.strip())
    norm_result = _normalize(result_val)
    norm_expected = _normalize(expected)

    passed = norm_result == norm_expected
    return {
        "status": "pass" if passed else "fail",
        "output": _fmt(result_val),
        "expected": _fmt(expected),
        "stdout": stdout_out,
        "error": None
    }
`;

const DESIGN_HARNESS = `
def _run_design_test(user_code, class_name, input_str, expected_str):
    import io, sys, json, traceback, ast
    buf = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = buf
    error_msg = None
    outputs = []
    try:
        ns = {}
        exec(user_code, ns)
        cls = ns.get(class_name)
        if cls is None:
            raise ValueError(f"Class '{class_name}' not found.")

        lines = input_str.strip().split("\\n")
        ops = json.loads(lines[0])
        params = json.loads(lines[1]) if len(lines) > 1 else [[] for _ in ops]

        obj = None
        for op, param in zip(ops, params):
            if op == class_name:
                obj = cls(*param)
                outputs.append(None)
            else:
                fn = getattr(obj, op)
                r = fn(*param)
                outputs.append(r)
    except Exception:
        error_msg = traceback.format_exc()
    finally:
        sys.stdout = old_stdout

    if error_msg:
        return {"status": "error", "error": error_msg, "stdout": buf.getvalue()}

    expected = json.loads(expected_str.strip()) if expected_str.strip() else []
    def norm(v): return None if v is None else v
    out_norm = [norm(o) for o in outputs]
    exp_norm = [norm(e) for e in expected]
    passed = out_norm == exp_norm
    return {
        "status": "pass" if passed else "fail",
        "output": json.dumps(outputs),
        "expected": expected_str.strip(),
        "stdout": buf.getvalue(),
        "error": None
    }
`;

const DESIGN_CLASS = {
  155: "MinStack",
  208: "Trie",
  232: "MyQueue",
  705: "MyHashSet",
  706: "MyHashMap",
};

// ─── Tree Layout (mirrors LeetCode BFS array → tree) ─────────────────────
function buildTreeLayout(vals) {
  if (!Array.isArray(vals) || vals.length === 0 || vals[0] === null || vals[0] === undefined) {
    return { nodes: [], maxX: 0, maxDepth: 0 };
  }

  // Build nodes with BFS (same logic as LeetCode / Python harness)
  const nodes = [{ val: vals[0], id: 0, depth: 0, parent: -1, leftChild: -1, rightChild: -1 }];
  let qi = 0;
  let i = 1;

  while (qi < nodes.length && i < vals.length) {
    const parentId = qi;
    qi++;

    // left child
    if (i < vals.length) {
      if (vals[i] !== null && vals[i] !== undefined) {
        const childId = nodes.length;
        nodes.push({ val: vals[i], id: childId, depth: nodes[parentId].depth + 1, parent: parentId, leftChild: -1, rightChild: -1 });
        nodes[parentId].leftChild = childId;
      }
      i++;
    }
    // right child
    if (i < vals.length) {
      if (vals[i] !== null && vals[i] !== undefined) {
        const childId = nodes.length;
        nodes.push({ val: vals[i], id: childId, depth: nodes[parentId].depth + 1, parent: parentId, leftChild: -1, rightChild: -1 });
        nodes[parentId].rightChild = childId;
      }
      i++;
    }
  }

  // Assign x via in-order traversal (same as LeetCode's visual layout)
  let counter = 0;
  function inorder(id) {
    if (id < 0) return;
    inorder(nodes[id].leftChild);
    nodes[id].x = counter++;
    inorder(nodes[id].rightChild);
  }
  inorder(0);

  const maxX = Math.max(...nodes.map(n => n.x));
  const maxDepth = Math.max(...nodes.map(n => n.depth));
  return { nodes, maxX, maxDepth };
}

// ─── Tree Visualizer ──────────────────────────────────────────────────────
function TreeVisualizer({ arrayStr, label }) {
  let vals;
  try {
    vals = JSON.parse(arrayStr);
    if (!Array.isArray(vals)) return null;
  } catch {
    return null;
  }

  if (vals.length === 0) {
    return (
      <div className="mt-2 rounded border border-border px-3 py-2" style={{ background: "#0d1117" }}>
        <p className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-1">{label || "Tree"} — Empty</p>
      </div>
    );
  }

  const { nodes, maxX, maxDepth } = buildTreeLayout(vals);
  if (nodes.length === 0) return null;

  const NODE_R = 16;
  const H_STEP = Math.max(36, Math.min(52, 380 / (maxX + 2)));
  const V_STEP = 52;
  const PAD_X = NODE_R + 8;
  const PAD_Y = NODE_R + 8;

  const svgW = (maxX + 1) * H_STEP + PAD_X * 2;
  const svgH = (maxDepth + 1) * V_STEP + PAD_Y * 2;

  const cx = (x) => PAD_X + x * H_STEP;
  const cy = (d) => PAD_Y + d * V_STEP;

  return (
    <div className="mt-2">
      <p className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-1.5">
        {label || "Tree"} — Visualization
      </p>
      <div className="overflow-x-auto rounded border border-border" style={{ background: "#060a10" }}>
        <svg width={svgW} height={svgH} style={{ display: "block" }}>
          {/* Edges */}
          {nodes.map(node => {
            const edges = [];
            if (node.leftChild >= 0) {
              const child = nodes[node.leftChild];
              edges.push(
                <line key={`e-l-${node.id}`}
                  x1={cx(node.x)} y1={cy(node.depth)}
                  x2={cx(child.x)} y2={cy(child.depth)}
                  stroke="#334155" strokeWidth="1.5" />
              );
            }
            if (node.rightChild >= 0) {
              const child = nodes[node.rightChild];
              edges.push(
                <line key={`e-r-${node.id}`}
                  x1={cx(node.x)} y1={cy(node.depth)}
                  x2={cx(child.x)} y2={cy(child.depth)}
                  stroke="#334155" strokeWidth="1.5" />
              );
            }
            return edges;
          })}
          {/* Nodes */}
          {nodes.map(node => (
            <g key={`n-${node.id}`}>
              <circle
                cx={cx(node.x)} cy={cy(node.depth)} r={NODE_R}
                fill="#1e293b" stroke="#4ade80" strokeWidth="1.5"
              />
              <text
                x={cx(node.x)} y={cy(node.depth)}
                textAnchor="middle" dominantBaseline="central"
                fontSize="11" fontFamily="monospace" fill="#e2e8f0"
              >
                {String(node.val).length > 3 ? String(node.val).slice(0, 3) : String(node.val)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── TestCaseRow ──────────────────────────────────────────────────────────
function TestCaseRow({ tc, result, paramTypes, onEdit, onDelete, onAskAI }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editInput, setEditInput] = useState(tc.input);
  const [editExpected, setEditExpected] = useState(tc.expected);

  const passed = result?.status === "pass";
  const errored = result?.status === "error";

  useEffect(() => {
    if (result && !passed) setOpen(true);
  }, [result, passed]);

  const saveEdit = () => {
    onEdit(tc.id, editInput, editExpected);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditInput(tc.input);
    setEditExpected(tc.expected);
    setEditing(false);
  };

  // Find tree params to visualize
  const treeVisualizations = [];
  if (paramTypes && !editing) {
    const inputLines = tc.input.split("\n");
    paramTypes.forEach((pt, i) => {
      if (pt === "tree") {
        const raw = (inputLines[i] || "").trim();
        if (raw) {
          const label = paramTypes.length > 1 ? `Param ${i + 1} Tree` : "Tree";
          treeVisualizations.push({ label, raw });
        }
      }
    });
  }

  return (
    <div className="rounded-md border overflow-hidden text-xs"
      style={{ background: "#0d1117", borderColor: result ? (passed ? "#22c55e30" : "#f8717130") : "#30363d" }}>

      {/* Header row */}
      <div className="flex items-center gap-2 px-3 py-2">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 flex-1 text-left hover:opacity-80 transition-opacity">
          {result ? (
            passed
              ? <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
              : <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
          ) : (
            <div className="h-3.5 w-3.5 rounded-full border border-border shrink-0" />
          )}
          <span className="font-mono text-muted-foreground">Test {tc.id}</span>
          {result && (
            <span className={`font-mono font-bold text-[10px] uppercase ${passed ? "text-green-400" : "text-red-400"}`}>
              {passed ? "PASS" : errored ? "ERROR" : "FAIL"}
            </span>
          )}
        </button>
        {result && (
          <button
            onClick={() => onAskAI && onAskAI(tc, result)}
            title="Ask AI why this test case passed/failed"
            className="p-1 text-muted-foreground/50 hover:text-primary transition-colors"
          >
            <Bot className="h-3 w-3" />
          </button>
        )}
        <button
          onClick={() => { setEditing(true); setOpen(true); }}
          title="Edit test case"
          className="p-1 text-muted-foreground/50 hover:text-primary transition-colors"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={() => onDelete(tc.id)}
          title="Delete test case"
          className="p-1 text-muted-foreground/50 hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
        <button onClick={() => setOpen(!open)} className="p-1 text-muted-foreground/50 hover:text-foreground">
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border divide-y divide-border" style={{ background: "#161b22" }}>
          {editing ? (
            /* ── Edit mode ── */
            <div className="px-3 py-3 space-y-3">
              <div>
                <p className="text-muted-foreground/50 uppercase tracking-widest text-[9px] mb-1">Input (one param per line)</p>
                <textarea
                  value={editInput}
                  onChange={e => setEditInput(e.target.value)}
                  rows={Math.max(2, editInput.split("\n").length)}
                  className="w-full rounded border border-border bg-secondary px-2 py-1.5 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none resize-y"
                  style={{ background: "#0d1117" }}
                />
              </div>
              <div>
                <p className="text-muted-foreground/50 uppercase tracking-widest text-[9px] mb-1">Expected Output</p>
                <textarea
                  value={editExpected}
                  onChange={e => setEditExpected(e.target.value)}
                  rows={1}
                  className="w-full rounded border border-border bg-secondary px-2 py-1.5 font-mono text-xs text-foreground focus:border-primary/50 focus:outline-none resize-y"
                  style={{ background: "#0d1117" }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="flex items-center gap-1 rounded px-3 py-1 text-xs font-medium text-black transition-all"
                  style={{ background: "#4ade80" }}
                >
                  <Check className="h-3 w-3" />Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1 rounded border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── View mode ── */
            <>
              <div className="px-3 py-2">
                <p className="text-muted-foreground/50 uppercase tracking-widest text-[9px] mb-1">Input</p>
                <pre className="font-mono text-foreground whitespace-pre-wrap text-xs">{tc.input}</pre>
                {treeVisualizations.map(({ label, raw }) => (
                  <TreeVisualizer key={label} arrayStr={raw} label={label} />
                ))}
              </div>
              <div className="px-3 py-2">
                <p className="text-muted-foreground/50 uppercase tracking-widest text-[9px] mb-1">Expected</p>
                <pre className="font-mono text-green-400 text-xs">{tc.expected}</pre>
              </div>
              {result && !passed && (
                <div className="px-3 py-2">
                  <p className="text-muted-foreground/50 uppercase tracking-widest text-[9px] mb-1">
                    {errored ? "Traceback" : "Your Output"}
                  </p>
                  <pre className="font-mono text-red-400 whitespace-pre-wrap text-xs">
                    {errored ? result.error : result.output}
                  </pre>
                </div>
              )}
              {result?.stdout && (
                <div className="px-3 py-2">
                  <p className="text-muted-foreground/50 uppercase tracking-widest text-[9px] mb-1">Print Output</p>
                  <pre className="font-mono text-yellow-300 whitespace-pre-wrap text-xs">{result.stdout}</pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────
export default function PythonEditor({ problem, onError, onAskAI, onAskAIOutput }) {
  const storageKey = `hashmap_code_${problem.lcNumber}`;
  const tcStorageKey = `hashmap_tc_${problem.lcNumber}`;
  const defaultCode = problem.pythonStarter || `class Solution:\n    pass\n`;

  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved || defaultCode;
  });

  const [testCases, setTestCases] = useState(() => {
    const saved = localStorage.getItem(tcStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return problem.testCases || [];
  });

  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [pyReady, setPyReady] = useState(false);
  const [pyLoading, setPyLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState("output");
  const pyRef = useRef(null);

  useEffect(() => { localStorage.setItem(storageKey, code); }, [code, storageKey]);
  useEffect(() => { localStorage.setItem(tcStorageKey, JSON.stringify(testCases)); }, [testCases, tcStorageKey]);

  const ensurePyodide = useCallback(async () => {
    if (pyRef.current) return pyRef.current;
    setPyLoading(true);
    try {
      const py = await getPyodide();
      pyRef.current = py;
      setPyReady(true);
      return py;
    } finally {
      setPyLoading(false);
    }
  }, []);

  const captureRun = useCallback(async (userCode) => {
    const py = await ensurePyodide();
    try {
      py.runPython(`import sys, io\n_cap = io.StringIO()\nsys.stdout = _cap`);
      py.runPython(userCode);
      const out = py.runPython(`sys.stdout = sys.__stdout__\n_cap.getvalue()`);
      return { output: out || "(no output)", error: null };
    } catch (e) {
      try { py.runPython(`sys.stdout = sys.__stdout__`); } catch {}
      return { output: null, error: String(e) };
    }
  }, [ensurePyodide]);

  const runCode = useCallback(async () => {
    setRunning(true);
    setActiveTab("output");
    setOutput("Running...");
    const { output: out, error } = await captureRun(code);
    setOutput(error || out);
    setRunning(false);
  }, [code, captureRun]);

  const runTests = useCallback(async () => {
    if (testCases.length === 0) {
      setOutput("No test cases available for this problem.");
      setActiveTab("output");
      return;
    }
    setRunning(true);
    setTestResults([]);
    setActiveTab("tests");

    const py = await ensurePyodide();
    const isDesign = DESIGN_CLASS[problem.lcNumber] !== undefined;
    const designClassName = DESIGN_CLASS[problem.lcNumber];

    try { py.runPython(HARNESS + DESIGN_HARNESS); } catch (e) { console.error("Harness error:", e); }

    const results = [];
    for (const tc of testCases) {
      try {
        let pyResult;
        if (isDesign && designClassName) {
          const callCode = `import json as _json\n_res = _run_design_test(${JSON.stringify(code)}, ${JSON.stringify(designClassName)}, ${JSON.stringify(tc.input)}, ${JSON.stringify(tc.expected)})\n_json.dumps(_res)`;
          pyResult = JSON.parse(py.runPython(callCode));
        } else {
          const callCode = `import json as _json\n_res = _run_test(${JSON.stringify(code)}, ${JSON.stringify(problem.methodName || "solve")}, ${JSON.stringify(problem.paramTypes || [])}, ${JSON.stringify(tc.input)}, ${JSON.stringify(tc.expected)})\n_json.dumps(_res)`;
          pyResult = JSON.parse(py.runPython(callCode));
        }
        results.push({ id: tc.id, ...pyResult });
      } catch (e) {
        results.push({ id: tc.id, status: "error", error: String(e), output: "", stdout: "" });
      }
      setTestResults([...results]);
    }
    setRunning(false);
  }, [code, problem, testCases, ensurePyodide]);

  const updateTestCase = (id, newInput, newExpected) => {
    setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, input: newInput, expected: newExpected } : tc));
    setTestResults(prev => prev.filter(r => r.id !== id));
  };

  const deleteTestCase = (id) => {
    setTestCases(prev => prev.filter(tc => tc.id !== id));
    setTestResults(prev => prev.filter(r => r.id !== id));
  };

  const addTestCase = () => {
    const newId = testCases.length > 0 ? Math.max(...testCases.map(tc => tc.id)) + 1 : 1;
    setTestCases(prev => [...prev, { id: newId, input: "", expected: "" }]);
    setActiveTab("tests");
  };

  const reset = () => {
    setCode(defaultCode);
    setOutput("");
    setTestResults([]);
    localStorage.removeItem(storageKey);
  };

  const resetTestCases = () => {
    setTestCases(problem.testCases || []);
    setTestResults([]);
    localStorage.removeItem(tcStorageKey);
  };

  const passCount = testResults.filter(r => r.status === "pass").length;
  const failCount = testResults.filter(r => r.status !== "pass").length;
  const isTreeProblem = (problem.paramTypes || []).includes("tree");

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d1117" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 shrink-0" style={{ background: "#161b22" }}>
        <span className="font-mono text-xs text-muted-foreground">Python 3</span>
        {isTreeProblem && (
          <span className="font-mono text-[10px] text-primary/70 border border-primary/20 rounded px-1.5 py-0.5">tree viz</span>
        )}
        {pyLoading && (
          <span className="font-mono text-xs text-yellow-400 flex items-center gap-1">
            <Loader className="h-3 w-3 animate-spin" />Loading…
          </span>
        )}
        {pyReady && !pyLoading && (
          <span className="font-mono text-xs text-green-400">● Ready</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={reset}
            className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="h-3 w-3" />Reset
          </button>
          <button onClick={runTests} disabled={running}
            className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors disabled:opacity-40">
            Run Tests
          </button>
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: "#4ade80", color: "#0a0e17" }}>
            {running ? <Loader className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-current" />}
            Run
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden min-h-0" style={{ minHeight: "260px", maxHeight: "400px" }}>
        <CodeMirror
          value={code}
          onChange={setCode}
          height="100%"
          extensions={[python()]}
          theme={oneDark}
          style={{ fontSize: "13px", height: "100%" }}
          basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
        />
      </div>

      {/* Output / Tests */}
      <div className="border-t border-border shrink-0 flex flex-col" style={{ minHeight: "160px", maxHeight: "280px" }}>
        {/* Tab bar */}
        <div className="flex items-center border-b border-border shrink-0" style={{ background: "#161b22" }}>
          {["output", "tests"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-mono font-medium transition-colors border-b-2 ${
                activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {tab === "tests"
                ? `Tests${testResults.length
                    ? ` (${passCount}✓${failCount > 0 ? ` ${failCount}✗` : ""}/${testCases.length})`
                    : ` (${testCases.length})`}`
                : "Output"}
            </button>
          ))}
          {activeTab === "tests" && (
            <div className="ml-auto flex items-center gap-1 pr-2">
              {(problem.testCases || []).length > 0 && (
                <button onClick={resetTestCases}
                  title="Reset to default test cases"
                  className="flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  <RotateCcw className="h-2.5 w-2.5" />Reset
                </button>
              )}
              <button onClick={addTestCase}
                className="flex items-center gap-1 rounded border border-primary/40 px-2 py-0.5 text-[10px] text-primary hover:bg-primary/10 transition-colors">
                <Plus className="h-2.5 w-2.5" />Add
              </button>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {activeTab === "output" && (
            <>
              {output && output !== "Running..." && onAskAIOutput && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => onAskAIOutput(output, code)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    <Bot className="h-3 w-3" />
                    Ask AI about this
                  </button>
                </div>
              )}
              <pre className="font-mono text-xs text-foreground whitespace-pre-wrap">
                {output || <span className="text-muted-foreground/40">Run code to see output…</span>}
              </pre>
            </>
          )}
          {activeTab === "tests" && (
            <>
              {testCases.length === 0 && (
                <div className="text-center py-4 space-y-2">
                  <p className="text-xs text-muted-foreground/60">No test cases yet.</p>
                  <button onClick={addTestCase}
                    className="inline-flex items-center gap-1 rounded border border-primary/40 px-3 py-1.5 text-xs text-primary hover:bg-primary/10 transition-colors">
                    <Plus className="h-3 w-3" />Add Test Case
                  </button>
                </div>
              )}
              {testCases.map((tc) => (
                <TestCaseRow
                  key={tc.id}
                  tc={tc}
                  result={testResults.find(r => r.id === tc.id)}
                  paramTypes={problem.paramTypes || []}
                  onEdit={updateTestCase}
                  onDelete={deleteTestCase}
                  onAskAI={onAskAI ? (tc, result) => onAskAI({ tc, result, code }) : null}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
