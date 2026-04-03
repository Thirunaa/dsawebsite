import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Play, Bot, TreePine, BookOpen,
  Search, Zap, Star, ChevronRight, CheckCircle,
  Pencil, Plus, Layers, Terminal
} from "lucide-react";

const PUBLIC = process.env.PUBLIC_URL || "";

// ─── Reusable badge ───────────────────────────────────────────────────────
const Badge = ({ children, color = "#4ade80" }) => (
  <span className="rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest"
    style={{ color, background: color + "18", border: `1px solid ${color}30` }}>
    {children}
  </span>
);

// ─── Fake code block ──────────────────────────────────────────────────────
const FakeCode = ({ lines }) => (
  <div className="rounded-lg overflow-hidden border border-border font-mono text-xs" style={{ background: "#0d1117" }}>
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border" style={{ background: "#161b22" }}>
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#f87171" }} />
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#fbbf24" }} />
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#4ade80" }} />
      <span className="ml-2 text-muted-foreground/50 text-[10px]">Python 3 · Ready</span>
    </div>
    <div className="p-4 space-y-1 leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-4">
          <span className="text-muted-foreground/30 select-none w-4 text-right shrink-0">{i + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </div>
      ))}
    </div>
  </div>
);

// ─── Fake test result ─────────────────────────────────────────────────────
const FakeTestRow = ({ id, status, input, expected, output }) => {
  const [open, setOpen] = useState(status === "fail");
  const pass = status === "pass";
  return (
    <div className="rounded-md border text-xs overflow-hidden"
      style={{ background: "#0d1117", borderColor: pass ? "#22c55e30" : "#f8717130" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5">
        {pass
          ? <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
          : <div className="h-3.5 w-3.5 rounded-full border-2 border-red-400 shrink-0" />}
        <span className="font-mono text-muted-foreground">Test {id}</span>
        <span className={`font-mono font-bold text-[10px] uppercase ${pass ? "text-green-400" : "text-red-400"}`}>
          {pass ? "PASS" : "FAIL"}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Bot className="h-3 w-3 text-muted-foreground/40" />
          <Pencil className="h-3 w-3 text-muted-foreground/40" />
        </div>
      </button>
      {open && (
        <div className="border-t border-border divide-y divide-border" style={{ background: "#161b22" }}>
          <div className="px-3 py-2"><p className="text-[9px] text-muted-foreground/40 uppercase tracking-widest mb-1">Input</p>
            <pre className="font-mono text-foreground">{input}</pre></div>
          <div className="px-3 py-2"><p className="text-[9px] text-muted-foreground/40 uppercase tracking-widest mb-1">Expected</p>
            <pre className="font-mono text-green-400">{expected}</pre></div>
          {!pass && <div className="px-3 py-2"><p className="text-[9px] text-muted-foreground/40 uppercase tracking-widest mb-1">Your Output</p>
            <pre className="font-mono text-red-400">{output}</pre></div>}
        </div>
      )}
    </div>
  );
};

// ─── Fake tree SVG ────────────────────────────────────────────────────────
const FakeTree = () => {
  const nodes = [
    { x: 150, y: 30, val: 4 },
    { x: 75,  y: 90, val: 2 },
    { x: 225, y: 90, val: 7 },
    { x: 37,  y: 150, val: 1 },
    { x: 112, y: 150, val: 3 },
    { x: 187, y: 150, val: 6 },
    { x: 262, y: 150, val: 9 },
  ];
  const edges = [
    [150,30,75,90],[150,30,225,90],
    [75,90,37,150],[75,90,112,150],
    [225,90,187,150],[225,90,262,150],
  ];
  return (
    <div className="rounded-lg border border-border overflow-hidden" style={{ background: "#060a10" }}>
      <div className="px-3 py-2 border-b border-border flex items-center gap-2" style={{ background: "#161b22" }}>
        <TreePine className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-xs text-muted-foreground">Tree Visualization — [4,2,7,1,3,6,9]</span>
      </div>
      <svg width="300" height="190" className="mx-auto block">
        {edges.map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="1.5" />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={16} fill="#1e293b" stroke="#4ade80" strokeWidth="1.5" />
            <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central"
              fontSize="11" fontFamily="monospace" fill="#e2e8f0">{n.val}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─── Fake AI panel ────────────────────────────────────────────────────────
const FakeAIPanel = () => (
  <div className="rounded-lg border border-border overflow-hidden flex flex-col" style={{ background: "#0d1117" }}>
    <div className="flex items-center justify-between px-4 py-3 border-b border-border" style={{ background: "#161b22" }}>
      <span className="font-mono text-xs font-semibold text-primary uppercase tracking-widest">AI Assistant</span>
      <div className="flex gap-1">
        <div className="h-2 w-2 rounded-full bg-green-400" />
        <span className="font-mono text-[10px] text-green-400">Gemini 2.0 Flash</span>
      </div>
    </div>
    <div className="flex gap-2 px-4 py-2.5 border-b border-border flex-wrap" style={{ background: "#161b22" }}>
      {["Explain Problem", "Hint", "Explain Solution"].map(a => (
        <span key={a} className="rounded-md border border-border px-2.5 py-1 text-[10px] font-mono text-muted-foreground">{a}</span>
      ))}
    </div>
    <div className="p-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
      <p className="text-foreground font-medium">The two-sum problem asks you to find two indices such that their values add up to the target.</p>
      <p>The optimal approach uses a <span className="text-primary font-mono">hash map</span> to store each value's index as you iterate. For each number, check if its complement (<span className="font-mono text-yellow-300">target - num</span>) already exists in the map.</p>
      <p>This gives you <span className="text-primary font-mono">O(n)</span> time and <span className="text-primary font-mono">O(n)</span> space.</p>
    </div>
  </div>
);

// ─── Fake model selector ──────────────────────────────────────────────────
const FakeModelSelector = () => {
  const [selected, setSelected] = useState({ openai: 0, claude: 0, gemini: 1 });
  const providers = [
    { id: "openai",  name: "OpenAI",   color: "#10b981", tiers: ["GPT-4o mini", "GPT 5.4 High"] },
    { id: "claude",  name: "Claude",   color: "#f59e0b", tiers: ["Haiku 4.5",   "4.6 Opus"] },
    { id: "gemini",  name: "Gemini",   color: "#3b82f6", tiers: ["2.0 Flash",   "3.1 Pro"] },
  ];
  return (
    <div className="rounded-lg border border-border overflow-hidden" style={{ background: "#0d1117" }}>
      <div className="px-4 py-3 border-b border-border" style={{ background: "#161b22" }}>
        <span className="font-mono text-xs text-muted-foreground">Model Selection</span>
      </div>
      <div className="p-3 space-y-3">
        {providers.map((p) => (
          <div key={p.id}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
              <span className="font-mono text-xs text-foreground">{p.name}</span>
            </div>
            <div className="flex gap-1.5">
              {p.tiers.map((t, i) => (
                <button key={i} onClick={() => setSelected(s => ({ ...s, [p.id]: i }))}
                  className="flex-1 flex items-center gap-1.5 rounded border px-2 py-1.5 text-[10px] font-mono transition-all"
                  style={{
                    borderColor: selected[p.id] === i ? p.color + "60" : "#30363d",
                    background: selected[p.id] === i ? p.color + "12" : "transparent",
                    color: selected[p.id] === i ? p.color : "#6b7280",
                  }}>
                  {i === 0 ? <Zap className="h-2.5 w-2.5 shrink-0" /> : <Star className="h-2.5 w-2.5 shrink-0" />}
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Feature section ──────────────────────────────────────────────────────
function FeatureSection({ tag, title, description, bullets, visual, reverse = false }) {
  return (
    <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}>
      <div className="flex-1 space-y-6">
        <div>
          <Badge>{tag}</Badge>
          <h2 className="mt-3 text-2xl lg:text-3xl font-bold tracking-tight text-foreground leading-tight">{title}</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <ul className="space-y-2.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: b }} />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full">{visual}</div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  return (
    <main className="min-h-screen" style={{ background: "#080c14" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-85 transition-opacity">
            <img src={`${PUBLIC}/NewHashmapLogo.jpg`} alt="Hashmap" className="h-9 w-auto rounded" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {[
              { to: "/topics", label: "Topics" },
              { to: "/library", label: "Problems" },
              { to: "/library", label: "Library" },
              { to: "/features", label: "Features" },
            ].map(link => (
              <Link key={link.label} to={link.to}
                className={`text-sm transition-colors hover:text-foreground ${link.label === "Features" ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <Link to="/library"
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border" style={{ background: "linear-gradient(180deg, #0d1117 0%, #080c14 100%)" }}>
        <div className="container py-20 text-center space-y-6">
          <Badge color="#4ade80">Platform</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Everything you need to<br />
            <span style={{ color: "#4ade80" }}>master DSA</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Hashmap combines a curated problem library, an in-browser Python IDE, and AI-powered tutoring
            into one seamless learning environment — no setup required.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link to="/library"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#4ade80", color: "#0a0e17" }}>
              <Play className="h-4 w-4 fill-current" />Start Practicing
            </Link>
            <Link to="/topics"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground">
              Browse Topics <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Stat bar */}
          <div className="pt-8 flex flex-wrap justify-center gap-8">
            {[
              { val: "75",  label: "Problems with solutions" },
              { val: "39",  label: "Structured lessons" },
              { val: "18",  label: "DSA topics" },
              { val: "3",   label: "AI providers" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-foreground" style={{ color: "#4ade80" }}>{s.val}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <div className="container py-24 space-y-32">

        {/* 1 — Python IDE */}
        <FeatureSection
          tag="In-Browser IDE"
          title="Write and run Python directly in your browser"
          description="Powered by Pyodide — a full Python 3.11 runtime compiled to WebAssembly. No server, no installs, no latency. Your code executes locally with real output and stack traces."
          bullets={[
            "Full Python 3.11 runtime via <span class='text-primary font-mono'>Pyodide</span> — runs entirely client-side",
            "Syntax highlighting, line numbers, and auto-completion via CodeMirror 6",
            "Per-problem code saved to localStorage automatically",
            "Reset to starter template anytime with one click",
            "Full traceback on errors — pinpoints the exact failing line",
          ]}
          visual={
            <FakeCode lines={[
              '<span style="color:#ff7b72">class</span> <span style="color:#79c0ff">Solution</span>:',
              '    <span style="color:#ff7b72">def</span> <span style="color:#d2a8ff">twoSum</span>(<span style="color:#ffa657">self</span>, nums, target):',
              '        seen = {}',
              '        <span style="color:#ff7b72">for</span> i, n <span style="color:#ff7b72">in</span> <span style="color:#79c0ff">enumerate</span>(nums):',
              '            diff = target - n',
              '            <span style="color:#ff7b72">if</span> diff <span style="color:#ff7b72">in</span> seen:',
              '                <span style="color:#ff7b72">return</span> [seen[diff], i]',
              '            seen[n] = i',
            ]} />
          }
        />

        {/* 2 — Test runner */}
        <FeatureSection
          tag="Test Runner"
          title="Run against real test cases, see exactly what failed"
          description="Every problem ships with curated test cases. Run them all with one click. Results update live as each test runs. Failed tests auto-expand to show input, expected, and your actual output side by side."
          bullets={[
            "Incremental live results — watch tests pass/fail as they run",
            "Auto-expands failed cases showing input → expected → your output",
            "Full Python traceback captured and displayed inline",
            "<span class='text-primary font-mono'>Print()</span> output shown separately so you can debug with prints",
            "Test counter in tab: <span class='font-mono text-foreground'>Tests (2✓ 1✗/3)</span>",
          ]}
          reverse
          visual={
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">Tests (2✓ 1✗/3)</span>
                <div className="ml-auto flex gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground border border-border rounded px-2 py-0.5">↺ Reset</span>
                  <span className="font-mono text-[10px] text-primary border border-primary/30 rounded px-2 py-0.5">+ Add</span>
                </div>
              </div>
              <FakeTestRow id={1} status="pass" input="[2,7,11,15]\n9" expected="[0,1]" />
              <FakeTestRow id={2} status="fail" input="[3,2,4]\n6" expected="[1,2]" output="[0,1]" />
              <FakeTestRow id={3} status="pass" input="[3,3]\n6" expected="[0,1]" />
            </div>
          }
        />

        {/* 3 — Editable test cases */}
        <FeatureSection
          tag="Custom Tests"
          title="Edit, add, and delete test cases on the fly"
          description="Test cases are fully editable — tweak an existing input, add your own edge case, or delete ones you don't care about. All changes persist in localStorage per problem."
          bullets={[
            "Inline edit mode with separate textareas for input and expected output",
            "Add completely new test cases to probe edge cases yourself",
            "Delete test cases you don't need",
            "Reset button restores the original problem test cases",
            "Custom test cases saved across sessions in localStorage",
          ]}
          visual={
            <div className="rounded-lg border border-border overflow-hidden text-xs" style={{ background: "#0d1117" }}>
              <div className="px-3 py-2 border-b border-border flex items-center gap-2" style={{ background: "#161b22" }}>
                <span className="font-mono text-muted-foreground">Custom Test Case</span>
                <span className="ml-auto text-[10px] text-primary border border-primary/30 rounded px-2 py-0.5 flex items-center gap-1">
                  <Plus className="h-2.5 w-2.5" />Edit Mode
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-1.5">Input (one param per line)</p>
                  <div className="rounded border border-primary/40 px-3 py-2 font-mono" style={{ background: "#161b22", color: "#e6edf3" }}>
                    [1,5,3,2,4]<br />3
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-1.5">Expected Output</p>
                  <div className="rounded border border-primary/40 px-3 py-2 font-mono text-green-400" style={{ background: "#161b22" }}>
                    4
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 rounded px-3 py-1 text-xs font-semibold" style={{ background: "#4ade80", color: "#0a0e17" }}>
                    <CheckCircle className="h-3 w-3" />Save
                  </button>
                  <button className="flex items-center gap-1 rounded border border-border px-3 py-1 text-xs text-muted-foreground">Cancel</button>
                </div>
              </div>
            </div>
          }
        />

        {/* 4 — Tree visualizer */}
        <FeatureSection
          tag="Tree Visualizer"
          title="See binary trees rendered from LeetCode array format"
          description="For tree problems, the test case input is automatically parsed and drawn as an SVG tree using the exact same BFS level-order logic that LeetCode uses internally."
          bullets={[
            "Parses LeetCode's <span class='font-mono text-primary'>[val, null, val, ...]</span> array format exactly",
            "In-order traversal layout — clean, non-overlapping node placement",
            "Auto-scales to fit the panel width for any tree depth",
            "Shown inline inside each test case when expanded",
            "Works for all 20+ tree problems in the library",
          ]}
          reverse
          visual={<FakeTree />}
        />

        {/* 5 — AI Assistant */}
        <FeatureSection
          tag="AI Assistant"
          title="Streaming AI tutoring — explain, hint, or walk through solutions"
          description="Three AI actions per problem, all streamed in real time. The AI has full context: problem description, constraints, your code, and the hidden solution — but is instructed to teach, not just give answers."
          bullets={[
            "<strong class='text-foreground'>Explain Problem</strong> — clear walkthrough of what's being asked with examples",
            "<strong class='text-foreground'>Hint</strong> — Socratic nudge toward the right approach without spoiling it",
            "<strong class='text-foreground'>Explain Solution</strong> — step-by-step walkthrough of the hidden solution with complexity analysis",
            "Streams token-by-token just like ChatGPT — no waiting for full response",
            "Stop button to cancel mid-stream",
          ]}
          visual={<FakeAIPanel />}
        />

        {/* 6 — AI on test cases */}
        <FeatureSection
          tag="AI Debugging"
          title="Ask AI why a specific test case passed or failed"
          description="Every test case row has a bot button. Click it and the AI receives your exact code, the input, expected output, and actual result — then explains what happened step by step."
          bullets={[
            "Bot icon appears on every test case after running tests",
            "On failure: AI identifies the bug and guides you to fix it without revealing the answer",
            "On pass: AI walks through the code execution to reinforce understanding",
            "<strong class='text-foreground'>Ask AI about this</strong> button in the Output tab for plain Run errors",
            "Full traceback included in context so AI can pinpoint the exact line",
          ]}
          reverse
          visual={
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-4 text-xs space-y-2" style={{ background: "#0d1117" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs font-semibold text-primary uppercase tracking-widest">AI Debugging Context</span>
                </div>
                <div className="rounded border border-border p-2.5 space-y-1 font-mono" style={{ background: "#161b22" }}>
                  <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">Your Code</p>
                  <p className="text-foreground">def twoSum(self, nums, target):</p>
                  <p className="text-foreground pl-4">seen = {"{}"}</p>
                  <p className="text-foreground pl-4"><span style={{ color: "#ff7b72" }}>for</span> i, n <span style={{ color: "#ff7b72" }}>in</span> nums:  <span className="text-red-400/60">← bug</span></p>
                </div>
                <div className="rounded border border-red-500/20 p-2.5 text-red-400/80 font-mono text-[10px]" style={{ background: "#1a0a0a" }}>
                  Result: FAIL · Expected [0,1] · Got [1,0]
                </div>
                <p className="text-muted-foreground leading-relaxed pt-1">
                  The issue is on line 3 — <span className="font-mono text-yellow-300">for i, n in nums</span> unpacks incorrectly.
                  You need <span className="font-mono text-primary">enumerate(nums)</span> to get both index and value…
                </p>
              </div>
            </div>
          }
        />

        {/* 7 — Multi-model */}
        <FeatureSection
          tag="Multi-Provider AI"
          title="Choose your AI provider and model tier"
          description="Bring your own API key for OpenAI, Anthropic Claude, or Google Gemini. Switch between a fast cheap model for quick questions and the latest capable model for deeper explanations — per provider."
          bullets={[
            "Supports <strong class='text-foreground'>OpenAI</strong>, <strong class='text-foreground'>Anthropic Claude</strong>, and <strong class='text-foreground'>Google Gemini</strong>",
            "Fast tier: GPT-4o mini, Claude Haiku 4.5, Gemini 2.0 Flash",
            "Best tier: GPT 5.4 High, Claude 4.6 Opus, Gemini 3.1 Pro",
            "Keys stored only in <span class='font-mono text-primary'>localStorage</span> — never sent to any backend",
            "Priority order: Claude → GPT → Gemini (first active key wins)",
          ]}
          reverse
          visual={<FakeModelSelector />}
        />

        {/* 8 — Library */}
        <FeatureSection
          tag="Problem Library"
          title="75 problems across 39 structured lessons"
          description="Every problem includes a full description, examples, constraints, complexity analysis, and a hidden Java solution. Lessons are grouped by topic and ordered by difficulty — follow the curriculum or jump to any topic."
          bullets={[
            "Search by problem title, number, or topic keyword",
            "Filter by topic — Array, Trees, DP, Graph, and 14 more",
            "Each lesson has a YouTube video walkthrough + PDF notes",
            "Time complexity, space complexity, and LeetCode runtime shown per problem",
            "Solutions hidden behind a toggle — reveal only when ready",
          ]}
          visual={
            <div className="rounded-xl border border-border overflow-hidden" style={{ background: "#0d1117" }}>
              <div className="px-4 py-3 border-b border-border flex items-center gap-3" style={{ background: "#161b22" }}>
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground/50">Search lessons, problems, topics...</span>
              </div>
              <div className="p-3 flex gap-2 border-b border-border overflow-hidden" style={{ background: "#161b22" }}>
                {["All Topics", "Array", "Trees", "Dynamic Programming", "BFS"].map((t, i) => (
                  <span key={t} className="shrink-0 rounded px-2.5 py-1 font-mono text-[10px] transition-colors"
                    style={i === 2 ? { background: "#4ade8020", color: "#4ade80", border: "1px solid #4ade8040" }
                      : { border: "1px solid #30363d", color: "#6b7280" }}>
                    {t}
                  </span>
                ))}
              </div>
              {[
                { num: 98,  title: "Validate Binary Search Tree", diff: "Medium", tag: "Trees" },
                { num: 200, title: "Number of Islands",           diff: "Medium", tag: "BFS" },
                { num: 322, title: "Coin Change",                 diff: "Medium", tag: "Dynamic Programming" },
              ].map(p => (
                <div key={p.num} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-white/5 transition-colors">
                  <span className="font-mono text-xs text-muted-foreground/50 w-8">#{p.num}</span>
                  <span className="flex-1 text-sm text-foreground">{p.title}</span>
                  <span className="font-mono text-[10px] rounded px-2 py-0.5" style={{ color: "#fbbf24", background: "#fbbf2418" }}>{p.diff}</span>
                  <span className="font-mono text-[10px] text-muted-foreground/50">{p.tag}</span>
                </div>
              ))}
            </div>
          }
        />

      </div>

      {/* CTA */}
      <section className="border-t border-border" style={{ background: "#0d1117" }}>
        <div className="container py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1.5 font-mono text-xs text-primary">
            <Zap className="h-3 w-3" />Ready to start
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
            Start solving problems<br /><span style={{ color: "#4ade80" }}>right now</span>
          </h2>
          <p className="max-w-lg mx-auto text-muted-foreground">
            No account. No setup. Just open a problem and start coding.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link to="/library"
              className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "#4ade80", color: "#0a0e17" }}>
              <BookOpen className="h-4 w-4" />Open Problem Library
            </Link>
            <Link to="/topics"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground">
              <Layers className="h-4 w-4" />Browse Topics
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6" style={{ background: "#080c14" }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${PUBLIC}/NewHashmapLogo.jpg`} alt="Hashmap" className="h-7 w-auto rounded" />
            <span className="font-mono text-xs text-muted-foreground">Hashmap</span>
          </div>
          <p className="font-mono text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Hashmap · DSA Practice
          </p>
        </div>
      </footer>
    </main>
  );
}
