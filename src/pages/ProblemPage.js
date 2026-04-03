import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, Play } from "lucide-react";
import problemData from "../data.json";

const diffColor = { Easy: "#4ade80", Medium: "#fbbf24", Hard: "#f87171" };

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
        <button
          onClick={copy}
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed" style={{ background: "#0d1117", color: "#e6edf3" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ProblemCard = ({ problem, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="rounded-xl border border-border overflow-hidden" style={{ background: "#0d1117" }}>
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
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
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
              <a
                href={problem.url}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                LeetCode
              </a>
            )}
          </div>

          {/* Notes */}
          {problem.notes && (
            <div className="rounded-md border border-border p-3" style={{ background: "#161b22" }}>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-1.5">Notes</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{problem.notes}</p>
            </div>
          )}

          {/* Code */}
          {problem.code && <CodeBlock code={problem.code} language={problem.language} />}
        </div>
      )}
    </div>
  );
};

const ProblemPage = () => {
  const { id } = useParams();
  const lesson = problemData.find((l) => String(l.id) === String(id));

  if (!lesson) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#080c14" }}>
        <div className="text-center">
          <p className="font-mono text-4xl text-muted-foreground/20 mb-4">&gt;_</p>
          <h1 className="text-lg font-semibold text-foreground mb-2">Lesson not found</h1>
          <Link to="/library" className="text-sm text-primary hover:underline">
            Back to library
          </Link>
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
          <Link to="/" className="flex items-center gap-1 font-mono text-sm font-bold">
            <span className="text-primary">&gt;_</span>
            <span className="text-foreground">Hashmap</span>
          </Link>
        </div>
      </header>

      <div className="container py-6 space-y-6 max-w-5xl">
        {/* Title + topics */}
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {lesson.topics.map((t) => (
              <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{lesson.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lesson.problems.length} problem{lesson.problems.length !== 1 ? "s" : ""} with solutions
          </p>
        </div>

        {/* Video player */}
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

        {/* Problems */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">
            Problems & Solutions
          </h2>
          <div className="space-y-3">
            {lesson.problems.map((problem, i) => (
              <ProblemCard key={problem.lcNumber} problem={problem} index={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProblemPage;
