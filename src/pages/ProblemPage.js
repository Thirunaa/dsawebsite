import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, ChevronDown, ChevronUp,
  Play, FileText, Key, EyeOff, Eye, Bot, X, Sparkles
} from "lucide-react";
import problemData from "../data.json";
import ApiKeyModal from "../components/ApiKeyModal";
import AIPanel from "../components/AIPanel";
import PythonEditor from "../components/PythonEditor";
import { getStoredKeys } from "../hooks/useApiKeys";

const PUBLIC = process.env.PUBLIC_URL || "";
const diffColor = { Easy: "#4ade80", Medium: "#fbbf24", Hard: "#f87171" };

// ─── Code block with copy ─────────────────────────────────────────────────
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border" style={{ background: "#161b22" }}>
        <span className="font-mono text-xs text-muted-foreground">{language || "Java"}</span>
        <button onClick={copy} className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed" style={{ background: "#0d1117", color: "#e6edf3" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ─── Problem card (collapsible) ───────────────────────────────────────────
function ProblemCard({ problem, index, onOpenAI, onOpenEditor }) {
  const [expanded, setExpanded] = useState(index === 0);
  const [showSolution, setShowSolution] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border overflow-hidden" style={{ background: "#0d1117" }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-mono text-xs text-muted-foreground/60 w-8 shrink-0">#{problem.lcNumber}</span>
        <span className="flex-1 text-sm font-medium text-foreground">{problem.title}</span>
        <span
          className="rounded px-2 py-0.5 font-mono text-xs font-medium shrink-0"
          style={{ color: diffColor[problem.difficulty] || "#4ade80", background: `${diffColor[problem.difficulty] || "#4ade80"}18` }}
        >
          {problem.difficulty}
        </span>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground shrink-0">
          {problem.language}
        </span>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Description */}
          {problem.description && (
            <div className="px-4 pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>
          )}

          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div className="px-4 pt-3 space-y-2">
              {problem.examples.map((ex, i) => (
                <div key={i} className="rounded-md border border-border p-3 text-xs" style={{ background: "#161b22" }}>
                  <p className="font-mono text-muted-foreground/60 uppercase tracking-widest text-[10px] mb-1">Example {i + 1}</p>
                  <p className="font-mono text-foreground"><span className="text-muted-foreground">Input: </span>{ex.input}</p>
                  <p className="font-mono text-foreground"><span className="text-muted-foreground">Output: </span>{ex.output}</p>
                  {ex.explanation && <p className="font-mono text-muted-foreground mt-1">{ex.explanation}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div className="px-4 pt-3">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-1.5">Constraints</p>
              <ul className="space-y-0.5">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="font-mono text-xs text-muted-foreground">• {c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Meta row */}
          <div className="px-4 pt-3 flex flex-wrap gap-3">
            {problem.timeComplexity && (
              <div className="rounded-md border border-border px-3 py-1.5" style={{ background: "#161b22" }}>
                <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mb-0.5">Time</p>
                <p className="font-mono text-xs text-foreground">{problem.timeComplexity}</p>
              </div>
            )}
            {problem.spaceComplexity && (
              <div className="rounded-md border border-border px-3 py-1.5" style={{ background: "#161b22" }}>
                <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mb-0.5">Space</p>
                <p className="font-mono text-xs text-foreground">{problem.spaceComplexity}</p>
              </div>
            )}
            {problem.runtime && (
              <div className="rounded-md border border-border px-3 py-1.5" style={{ background: "#161b22" }}>
                <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mb-0.5">Runtime</p>
                <p className="font-mono text-xs text-foreground">{problem.runtime}</p>
              </div>
            )}
            {problem.url && (
              <a href={problem.url} target="_blank" rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                LeetCode
              </a>
            )}
          </div>

          {/* AI actions */}
          <div className="px-4 pt-3 flex flex-wrap gap-2">
            {[
              { id: "explain", label: "Explain Problem" },
              { id: "hint", label: "Get Hint" },
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => onOpenAI(a.id, problem)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
              >
                <Bot className="h-3 w-3" />
                {a.label}
              </button>
            ))}
            <button
              onClick={() => navigate(`/visualizer/${problem.lcNumber}`)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
            >
              <Sparkles className="h-3 w-3" />
              Visualize
            </button>
            <button
              onClick={() => onOpenEditor(problem)}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-90 ml-auto"
              style={{ background: "#4ade80", color: "#0a0e17" }}
            >
              <Play className="h-3 w-3 fill-current" />
              Solve in Python
            </button>
          </div>

          {/* Idea */}
          {problem.idea && (
            <div className="mx-4 mt-3 rounded-md border border-border p-3" style={{ background: "#161b22" }}>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-1.5">Idea</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{problem.idea}</p>
            </div>
          )}

          {/* Hidden solution toggle */}
          {problem.code && (
            <div className="mx-4 mt-3 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showSolution ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {showSolution ? "Hide Solution" : "Reveal Solution"}
                </button>
                <button
                  onClick={() => onOpenAI("solution", problem)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
                >
                  <Bot className="h-3 w-3" />
                  Explain Solution
                </button>
              </div>
              {showSolution && <CodeBlock code={problem.code} language={problem.language} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function ProblemPage() {
  const { id } = useParams();
  const lesson = problemData.find((l) => String(l.id) === String(id));

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [aiPanel, setAiPanel] = useState(null); // { action, problem }
  const [errorContext, setErrorContext] = useState(null);
  const [testCaseContext, setTestCaseContext] = useState(null);
  const [editorProblem, setEditorProblem] = useState(null);

  const keys = getStoredKeys();
  const hasKey = Object.keys(keys).length > 0;

  const openAI = (action, problem) => {
    if (!hasKey) { setShowKeyModal(true); return; }
    setErrorContext(null);
    setTestCaseContext(null);
    setAiPanel({ action, problem });
  };

  const openEditor = (problem) => {
    setEditorProblem(problem);
  };

  const handleError = (errMsg) => {
    if (!hasKey) return;
    setTestCaseContext(null);
    setErrorContext(errMsg);
    setAiPanel({ action: "error", problem: editorProblem });
  };

  const handleAskAI = ({ tc, result, code }) => {
    if (!hasKey) { setShowKeyModal(true); return; }
    setErrorContext(null);
    setTestCaseContext({ tc, result, code });
    setAiPanel({ action: "testcase", problem: editorProblem });
  };

  const handleAskAIOutput = (output, code) => {
    if (!hasKey) { setShowKeyModal(true); return; }
    setErrorContext(null);
    setTestCaseContext({
      tc: { id: "run", input: null, expected: null },
      result: { status: "error", error: output },
      code,
      isRunOutput: true,
    });
    setAiPanel({ action: "testcase", problem: editorProblem });
  };

  if (!lesson) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#080c14" }}>
        <div className="text-center">
          <p className="font-mono text-4xl text-muted-foreground/20 mb-4">&gt;_</p>
          <h1 className="text-lg font-semibold text-foreground mb-2">Lesson not found</h1>
          <Link to="/library" className="text-sm text-primary hover:underline">Back to library</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#080c14" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border" style={{ background: "rgba(8,12,20,0.95)", backdropFilter: "blur(8px)" }}>
        <div className="container flex items-center justify-between py-3">
          <Link to="/library" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Library
          </Link>
          <Link to="/" className="hover:opacity-85 transition-opacity">
            <img src={`${PUBLIC}/NewHashmapLogo.jpg`} alt="Hashmap" className="h-8 w-auto rounded" />
          </Link>
          <button
            onClick={() => setShowKeyModal(true)}
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-all hover:border-primary/50 hover:text-foreground ${hasKey ? "border-green-500/40 text-green-400" : "border-border text-muted-foreground"}`}
          >
            <Key className="h-3.5 w-3.5" />
            {hasKey ? "API Keys ✓" : "Add API Key"}
          </button>
        </div>
      </header>

      {/* Main layout: left content + right panel */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Left: lesson content */}
        <div className={`min-w-0 flex-1 overflow-y-auto transition-all ${aiPanel || editorProblem ? "hidden lg:block" : ""}`}>
          <div className="container py-6 space-y-6 max-w-4xl">
            {/* Title */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {lesson.topics.map((t) => (
                  <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{lesson.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{lesson.problems.length} problem{lesson.problems.length !== 1 ? "s" : ""} with solutions</p>
            </div>

            {/* Video */}
            {lesson.videoId && (
              <div className="rounded-xl overflow-hidden border border-border" style={{ background: "#0d1117" }}>
                <div className="border-b border-border px-4 py-2.5 flex items-center gap-2" style={{ background: "#161b22" }}>
                  <Play className="h-3.5 w-3.5 text-primary fill-primary" />
                  <span className="font-mono text-xs text-muted-foreground">Video Walkthrough</span>
                </div>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${lesson.videoId}`}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Notes PDF */}
            {lesson.notesUrl && (
              <a
                href={`${PUBLIC}/data/${lesson.notesUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
                style={{ background: "#0d1117" }}
              >
                <FileText className="h-4 w-4 text-primary" />
                Open Lesson Notes (PDF)
              </a>
            )}

            {/* Problems */}
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">Problems &amp; Solutions</h2>
              <div className="space-y-3">
                {lesson.problems.map((problem, i) => (
                  <ProblemCard
                    key={problem.lcNumber}
                    problem={problem}
                    index={i}
                    onOpenAI={openAI}
                    onOpenEditor={openEditor}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* IDE panel */}
        {editorProblem && (
          <div className={`flex flex-col border-l border-border shrink-0 w-full lg:w-[480px] ${aiPanel ? "hidden lg:flex" : "flex"}`}
            style={{ background: "#0d1117" }}>
            {/* Mobile back */}
            <div className="lg:hidden border-b border-border px-3 py-2 shrink-0" style={{ background: "#161b22" }}>
              <button onClick={() => setEditorProblem(null)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />Back to lesson
              </button>
            </div>
            {/* IDE header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 shrink-0" style={{ background: "#161b22" }}>
              <span className="font-mono text-xs text-muted-foreground truncate">
                #{editorProblem.lcNumber} — {editorProblem.title}
              </span>
              <button onClick={() => setEditorProblem(null)}
                className="ml-2 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                title="Close editor">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <PythonEditor
                problem={editorProblem}
                onError={handleError}
                onAskAI={handleAskAI}
                onAskAIOutput={handleAskAIOutput}
              />
            </div>
          </div>
        )}

        {/* AI panel — independent column, sits to the right of IDE */}
        {aiPanel && (
          <div className="flex flex-col border-l border-border shrink-0 w-full lg:w-[400px]"
            style={{ background: "#0d1117" }}>
            {/* Mobile: back to IDE button when editor is also open */}
            {editorProblem && (
              <div className="lg:hidden border-b border-border px-3 py-2 shrink-0" style={{ background: "#161b22" }}>
                <button
                  onClick={() => { setAiPanel(null); setErrorContext(null); setTestCaseContext(null); }}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" />Back to Editor
                </button>
              </div>
            )}
            <AIPanel
              problem={aiPanel.problem}
              code=""
              errorContext={errorContext}
              testCaseContext={testCaseContext}
              onClose={() => { setAiPanel(null); setErrorContext(null); setTestCaseContext(null); }}
            />
          </div>
        )}
      </div>

      {/* API Key Modal */}
      {showKeyModal && <ApiKeyModal onClose={() => setShowKeyModal(false)} />}
    </main>
  );
}
