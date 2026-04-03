import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import problemData from "../../data.json";

const HeroSection = () => {
  const totalLessons = problemData.length;
  const totalProblems = problemData.reduce((sum, l) => sum + l.problems.length, 0);
  const totalTopics = new Set(problemData.flatMap((l) => l.topics)).size;

  return (
    <section className="relative overflow-hidden border-b border-border py-20 md:py-28">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="container relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono font-medium text-green-400">Interview Preparation Platform</span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            <span className="text-white">Master</span>
            <br />
            <span className="text-green-400">Data Structures</span>
            <br />
            <span className="text-white">&amp; Algorithms</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            Interactive video lessons, curated problem sets, and step-by-step solutions to ace your coding interviews.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#4ade80", color: "#0a0e17" }}
            >
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-green-500/40 hover:bg-secondary"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Demo
            </button>
          </div>

          <div className="flex flex-wrap gap-8 border-t border-border pt-6 text-sm">
            <div>
              <p className="text-2xl font-bold text-white">{totalLessons}+</p>
              <p className="mt-0.5 text-muted-foreground">Video Lessons</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalProblems}+</p>
              <p className="mt-0.5 text-muted-foreground">Problems Covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalTopics}+</p>
              <p className="mt-0.5 text-muted-foreground">Topics Covered</p>
            </div>
          </div>
        </div>

        {/* Code window */}
        <div className="relative">
          <div className="rounded-xl border border-border overflow-hidden shadow-2xl" style={{ background: "#0d1117" }}>
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" style={{ background: "#161b22" }}>
              <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
              <span className="ml-3 font-mono text-xs text-muted-foreground">binary-search.js</span>
              <div className="ml-auto rounded border px-2 py-0.5 font-mono text-xs" style={{ borderColor: "rgba(74,222,128,0.3)", background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
                O(log n)
              </div>
            </div>
            <pre className="overflow-x-auto p-5 text-sm leading-7 font-mono text-sm">
<span style={{ color: "#79b8ff" }}>function </span><span style={{ color: "#4ade80" }}>binarySearch</span><span style={{ color: "#e6edf3" }}>(arr, target) {"{"}</span>{"\n"}
<span style={{ color: "#79b8ff" }}>  let </span><span style={{ color: "#e6edf3" }}>left = </span><span style={{ color: "#f97316" }}>0</span><span style={{ color: "#e6edf3" }}>, right = arr.length - </span><span style={{ color: "#f97316" }}>1</span><span style={{ color: "#e6edf3" }}>;</span>{"\n"}
<span style={{ color: "#79b8ff" }}>  while </span><span style={{ color: "#e6edf3" }}>(left {"<="} right) {"{"}</span>{"\n"}
<span style={{ color: "#79b8ff" }}>    const </span><span style={{ color: "#e6edf3" }}>mid = Math.floor((left + right) / </span><span style={{ color: "#f97316" }}>2</span><span style={{ color: "#e6edf3" }}>);</span>{"\n"}
<span style={{ color: "#79b8ff" }}>    if </span><span style={{ color: "#e6edf3" }}>(arr[mid] === target) </span><span style={{ color: "#79b8ff" }}>return </span><span style={{ color: "#e6edf3" }}>mid;</span>{"\n"}
<span style={{ color: "#79b8ff" }}>    if </span><span style={{ color: "#e6edf3" }}>(arr[mid] {"<"} target) left = mid + </span><span style={{ color: "#f97316" }}>1</span><span style={{ color: "#e6edf3" }}>;</span>{"\n"}
<span style={{ color: "#79b8ff" }}>    else </span><span style={{ color: "#e6edf3" }}>right = mid - </span><span style={{ color: "#f97316" }}>1</span><span style={{ color: "#e6edf3" }}>;</span>{"\n"}
<span style={{ color: "#e6edf3" }}>  {"}"}</span>{"\n"}
<span style={{ color: "#79b8ff" }}>  return </span><span style={{ color: "#f97316" }}>-1</span><span style={{ color: "#e6edf3" }}>;</span>{"\n"}
<span style={{ color: "#e6edf3" }}>{"}"}</span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
