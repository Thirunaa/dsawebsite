import React, { useEffect, useRef } from "react";
import { X, Square, Loader } from "lucide-react";
import { useStreamingAI } from "../hooks/useStreamingAI";

const ACTIONS = [
  { id: "explain", label: "Explain Problem" },
  { id: "hint", label: "Hint" },
  { id: "solution", label: "Explain Solution" },
];

function buildPrompt(action, problem, code, errorMsg, testCaseCtx) {
  const base = `Problem: ${problem.title} (#${problem.lcNumber})
Description: ${problem.description || ""}
Constraints: ${(problem.constraints || []).join("; ")}
Hidden solution idea: ${problem.idea || ""}
Hidden solution code (${problem.language}): ${problem.code || ""}`;

  if (action === "explain") {
    return `${base}\n\nPlease explain this problem clearly. Describe what is being asked, walk through an example step by step, and clarify the constraints. Do NOT reveal the solution approach yet.`;
  }
  if (action === "hint") {
    return `${base}\n\nThe student is working on this problem. Provide a helpful hint that guides their thinking without giving away the full solution. Be concise and Socratic.`;
  }
  if (action === "solution") {
    return `${base}\n\nExplain the hidden solution step by step. Walk through the algorithm, explain WHY each decision is made, analyze time and space complexity, and highlight common mistakes.`;
  }
  if (action === "error") {
    return `${base}\n\nThe student wrote the following Python code:\n\`\`\`python\n${code}\n\`\`\`\n\nThey encountered this error:\n${errorMsg}\n\nHelp them understand what went wrong and how to fix it. Be educational, not just give the answer.`;
  }
  if (action === "testcase") {
    const { tc, result, isRunOutput } = testCaseCtx;
    if (isRunOutput) {
      return `${base}\n\nStudent's Python code:\n\`\`\`python\n${code}\n\`\`\`\n\nOutput when they ran the code:\n${result.error}\n\nHelp them understand what's happening and how to fix it. Be educational, not just give the answer.`;
    }
    const statusBlock =
      result.status === "pass"
        ? `Result: PASSED\nActual output: ${result.output}`
        : result.status === "error"
        ? `Result: ERROR\nTraceback:\n${result.error}`
        : `Result: FAILED\nExpected: ${tc.expected}\nActual output: ${result.output}`;
    const ask =
      result.status === "pass"
        ? "Explain why this test case passed. Walk through the code step by step for this specific input and explain what the student did correctly."
        : `Explain why this test case ${result.status === "error" ? "errored" : "failed"}. Walk through what the code does with this input, identify the bug, and guide the student toward fixing it without giving the full solution.`;
    return `${base}\n\nStudent's Python code:\n\`\`\`python\n${code}\n\`\`\`\n\nTest case:\nInput:\n${tc.input}\nExpected output: ${tc.expected}\n${statusBlock}\n\n${ask}`;
  }
  return base;
}

export default function AIPanel({ problem, code, errorContext, testCaseContext, onClose }) {
  const { response, isStreaming, error, stream, abort } = useStreamingAI();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (errorContext) {
      stream(buildPrompt("error", problem, code, errorContext),
        "You are an expert programming tutor helping students learn data structures and algorithms.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorContext]);

  useEffect(() => {
    if (testCaseContext) {
      stream(
        buildPrompt("testcase", problem, testCaseContext.code, null, testCaseContext),
        "You are an expert programming tutor helping students learn data structures and algorithms."
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCaseContext]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response]);

  const trigger = (action) => {
    stream(
      buildPrompt(action, problem, code, null, null),
      "You are an expert programming tutor helping students learn data structures and algorithms."
    );
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d1117" }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0" style={{ background: "#161b22" }}>
        <span className="font-mono text-xs font-semibold text-primary uppercase tracking-widest">AI Assistant</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3 shrink-0">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            onClick={() => trigger(a.id)}
            disabled={isStreaming}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground disabled:opacity-40"
          >
            {a.label}
          </button>
        ))}
        {isStreaming && (
          <button
            onClick={abort}
            className="ml-auto flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Square className="h-3 w-3 fill-current" />
            Stop
          </button>
        )}
      </div>

      {/* Response area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        {!response && !isStreaming && !error && (
          <p className="text-xs text-muted-foreground/60 text-center mt-8">
            Choose an action above to get AI assistance.
          </p>
        )}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}
        {(response || isStreaming) && (
          <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {response}
            {isStreaming && (
              <span className="inline-flex items-center gap-1 ml-1 text-primary">
                <Loader className="h-3 w-3 animate-spin" />
              </span>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
