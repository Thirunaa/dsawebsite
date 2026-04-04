import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, RefreshCw, Download, ShieldCheck, ChevronLeft,
  ChevronRight, Sparkles, AlertTriangle, Key, Loader2, X
} from "lucide-react";
import problemData from "../data.json";
import { callAI, extractJSON } from "../hooks/useAIJSON";
import { useStreamingAI } from "../hooks/useStreamingAI";
import { getStoredKeys } from "../hooks/useApiKeys";
import ApiKeyModal from "../components/ApiKeyModal";

// ─── System prompt ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert algorithm visualization tutor. Return ONLY valid JSON, no markdown, no extra text.

You will receive a coding problem and must generate a detailed step-by-step algorithm visualization with two examples: a normal case and an edge case.

Output the following JSON schema exactly:
{
  "problem_summary": {
    "title": "string",
    "goal": "string",
    "pattern": "string (e.g. Hash Map, Two Pointers, DFS, BFS, DP, etc.)"
  },
  "examples": [
    {
      "id": "normal",
      "label": "Normal Case",
      "input_description": "string describing the input",
      "output": "string showing expected output",
      "steps": [
        {
          "step_number": 1,
          "title": "string",
          "narration": "string (2-4 sentences explaining what happens and why)",
          "structures": [
            {
              "name": "variable name",
              "type": "array | hashmap | stack | queue | tree | string | matrix | variable",
              "data": <actual JSON value: array, object, string, or number>,
              "highlights": [<integer indices or string keys>],
              "pointers": {"pointer_name": <integer index>}
            }
          ],
          "why_it_matters": "string",
          "common_mistake": "string or null"
        }
      ]
    },
    {
      "id": "edge",
      "label": "Edge Case",
      "input_description": "string describing a tricky/boundary input",
      "output": "string",
      "steps": [ ... same step schema ... ]
    }
  ],
  "final_understanding": {
    "core_idea": "string",
    "time_complexity": "string",
    "space_complexity": "string",
    "key_takeaway": "string"
  }
}

Rules:
- 6-15 steps per example
- Each step represents one meaningful state change
- Always include concrete JSON values in the data field (arrays, objects, numbers — never strings describing the value)
- highlights is an array of integer indices for arrays/strings/stacks, or string keys for hashmaps
- pointers maps pointer label strings to integer indices
- The edge case should test a genuinely tricky scenario (empty input, duplicates, all same, single element, etc.)`;

// ─── Build user prompt ────────────────────────────────────────────────────
function buildUserPrompt(problem) {
  const examplesText = (problem.examples || [])
    .map((e, i) => `Example ${i + 1}: Input: ${e.input} | Output: ${e.output}${e.explanation ? ` | Explanation: ${e.explanation}` : ""}`)
    .join("\n");
  const constraintsText = (problem.constraints || []).join(", ");

  return `Problem Title: ${problem.title} (LeetCode #${problem.lcNumber})

Description: ${problem.description || "No description provided."}

Examples:
${examplesText || "No examples provided."}

Constraints: ${constraintsText || "No constraints provided."}

Solution Approach / Idea: ${problem.idea || "Use an optimal approach for this problem type."}

Solution Code:
${problem.code || "// No solution code provided"}

Generate the step-by-step visualization JSON now.`;
}

// ─── Safe data parser ─────────────────────────────────────────────────────
function safeData(data) {
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return data; }
  }
  return data;
}

// ─── Color palette ────────────────────────────────────────────────────────
// highlight palette used by structure renderers
export const PALETTE = ["#4ade80", "#fbbf24", "#60a5fa", "#f472b6", "#a78bfa"];

// ─── Array visualizer ─────────────────────────────────────────────────────
function ArrayViz({ name, data, highlights = [], pointers = {} }) {
  const arr = Array.isArray(safeData(data)) ? safeData(data) : [];
  const MAX = 20;
  const truncated = arr.length > MAX;
  const display = arr.slice(0, MAX);

  // Build pointer map: index → [labelNames]
  const ptrMap = {};
  Object.entries(pointers || {}).forEach(([label, idx]) => {
    if (typeof idx === "number") {
      if (!ptrMap[idx]) ptrMap[idx] = [];
      ptrMap[idx].push(label);
    }
  });

  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-widest">{name}</p>
      <div className="relative">
        {/* Pointer labels row */}
        {Object.keys(ptrMap).length > 0 && (
          <div className="flex gap-1 mb-1">
            {display.map((_, i) => (
              <div key={i} className="w-10 shrink-0 text-center">
                {ptrMap[i] ? (
                  <span className="font-mono text-[9px] text-yellow-400 leading-none block">{ptrMap[i].join(",")}</span>
                ) : <span className="block h-3" />}
              </div>
            ))}
          </div>
        )}
        {/* Cells row */}
        <div className="flex gap-1 flex-wrap">
          {display.map((val, i) => {
            const isHighlighted = highlights.includes(i);
            const hasPtr = !!ptrMap[i];
            return (
              <div
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded border font-mono text-xs font-medium shrink-0 transition-colors"
                style={{
                  background: isHighlighted ? "#4ade8025" : hasPtr ? "#fbbf2415" : "#161b22",
                  borderColor: isHighlighted ? "#4ade80" : hasPtr ? "#fbbf24" : "#30363d",
                  color: isHighlighted ? "#4ade80" : hasPtr ? "#fbbf24" : "#e6edf3",
                }}
              >
                {String(val)}
              </div>
            );
          })}
          {truncated && (
            <div className="w-10 h-10 flex items-center justify-center rounded border border-dashed border-border font-mono text-xs text-muted-foreground/40 shrink-0">
              ...
            </div>
          )}
        </div>
        {/* Index labels row */}
        <div className="flex gap-1 mt-1 flex-wrap">
          {display.map((_, i) => (
            <div key={i} className="w-10 text-center font-mono text-[9px] text-muted-foreground/40 shrink-0">{i}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HashMap visualizer ───────────────────────────────────────────────────
function HashMapViz({ name, data, highlights = [] }) {
  const parsed = safeData(data);
  const obj = (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : {};
  const entries = Object.entries(obj);

  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-widest">{name}</p>
      {entries.length === 0 ? (
        <div className="font-mono text-sm text-muted-foreground/40 rounded border border-border px-3 py-2" style={{ background: "#161b22" }}>
          {"{ }"}
        </div>
      ) : (
        <table className="w-full border-collapse rounded overflow-hidden text-xs font-mono" style={{ borderRadius: 8 }}>
          <thead>
            <tr style={{ background: "#1e2938" }}>
              <th className="text-left px-3 py-1.5 text-muted-foreground/60 font-normal border-b border-border text-[10px] uppercase tracking-widest w-1/2">key</th>
              <th className="text-left px-3 py-1.5 text-muted-foreground/60 font-normal border-b border-border text-[10px] uppercase tracking-widest w-1/2">value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([k, v], i) => {
              const isHighlighted = highlights.includes(k) || highlights.includes(parseInt(k));
              return (
                <tr
                  key={k}
                  style={{
                    background: isHighlighted ? "#4ade8015" : i % 2 === 0 ? "#161b22" : "#0d1117",
                    borderLeft: isHighlighted ? "2px solid #4ade80" : "2px solid transparent",
                  }}
                >
                  <td className="px-3 py-1.5" style={{ color: isHighlighted ? "#4ade80" : "#fbbf24" }}>{k}</td>
                  <td className="px-3 py-1.5" style={{ color: isHighlighted ? "#4ade80" : "#e6edf3" }}>{JSON.stringify(v)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Stack visualizer ─────────────────────────────────────────────────────
function StackViz({ name, data, highlights = [], isQueue = false }) {
  const arr = Array.isArray(safeData(data)) ? safeData(data) : [];
  const display = isQueue ? arr : [...arr].reverse();

  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-widest">{name}</p>
      {arr.length === 0 ? (
        <div className="font-mono text-xs text-muted-foreground/40 rounded border border-dashed border-border px-3 py-2 text-center" style={{ background: "#161b22" }}>
          empty
        </div>
      ) : (
        <div className="space-y-1" style={{ maxWidth: 200 }}>
          {display.map((val, i) => {
            const origIdx = isQueue ? i : arr.length - 1 - i;
            const isTop = i === 0;
            const isHighlighted = highlights.includes(origIdx);
            return (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="flex-1 flex items-center justify-center rounded border font-mono text-xs py-1.5 transition-colors"
                  style={{
                    background: isHighlighted ? "#4ade8025" : isTop ? "#1e2938" : "#161b22",
                    borderColor: isHighlighted ? "#4ade80" : isTop ? "#4ade8060" : "#30363d",
                    color: isHighlighted ? "#4ade80" : isTop ? "#e6edf3" : "#9ca3af",
                  }}
                >
                  {String(val)}
                </div>
                {isTop && (
                  <span className="font-mono text-[9px] text-primary/70">
                    {isQueue ? "front →" : "← top"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── String visualizer ────────────────────────────────────────────────────
function StringViz({ name, data, highlights = [], pointers = {} }) {
  const str = typeof safeData(data) === "string" ? safeData(data) : String(data ?? "");
  const chars = str.split("");
  const MAX = 30;
  const truncated = chars.length > MAX;
  const display = chars.slice(0, MAX);

  const windowPtr = pointers?.window;
  const [winL, winR] = Array.isArray(windowPtr) ? windowPtr : [-1, -1];

  const ptrMap = {};
  Object.entries(pointers || {}).forEach(([label, idx]) => {
    if (label !== "window" && typeof idx === "number") {
      if (!ptrMap[idx]) ptrMap[idx] = [];
      ptrMap[idx].push(label);
    }
  });

  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-widest">{name}</p>
      <div className="flex gap-0.5 flex-wrap">
        {display.map((ch, i) => {
          const isHighlighted = highlights.includes(i);
          const inWindow = winL >= 0 && winR >= 0 && i >= winL && i <= winR;
          const hasPtr = !!ptrMap[i];
          return (
            <div key={i} className="flex flex-col items-center">
              {hasPtr && <span className="font-mono text-[9px] text-yellow-400 leading-none mb-0.5">{ptrMap[i].join(",")}</span>}
              <div
                className="w-8 h-8 flex items-center justify-center rounded border font-mono text-xs font-medium transition-colors"
                style={{
                  background: isHighlighted ? "#4ade8025" : inWindow ? "#fbbf2415" : "#161b22",
                  borderColor: isHighlighted ? "#4ade80" : inWindow ? "#fbbf24" : "#30363d",
                  color: isHighlighted ? "#4ade80" : inWindow ? "#fbbf24" : "#e6edf3",
                }}
              >
                {ch === " " ? "·" : ch}
              </div>
              <span className="font-mono text-[8px] text-muted-foreground/30 mt-0.5">{i}</span>
            </div>
          );
        })}
        {truncated && <div className="w-8 h-8 flex items-center justify-center font-mono text-xs text-muted-foreground/40">...</div>}
      </div>
    </div>
  );
}

// ─── Matrix visualizer ────────────────────────────────────────────────────
function MatrixViz({ name, data, highlights = [] }) {
  const parsed = safeData(data);
  const matrix = Array.isArray(parsed) && Array.isArray(parsed[0]) ? parsed : [];

  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-widest">{name}</p>
      {matrix.length === 0 ? (
        <div className="font-mono text-xs text-muted-foreground/40">empty matrix</div>
      ) : (
        <div className="inline-block">
          {matrix.map((row, r) => (
            <div key={r} className="flex gap-0.5 mb-0.5">
              {Array.isArray(row) && row.map((cell, c) => {
                const isHighlighted = highlights.some(h => Array.isArray(h) && h[0] === r && h[1] === c);
                return (
                  <div
                    key={c}
                    className="w-8 h-8 flex items-center justify-center rounded border font-mono text-xs transition-colors"
                    style={{
                      background: isHighlighted ? "#4ade8025" : "#161b22",
                      borderColor: isHighlighted ? "#4ade80" : "#30363d",
                      color: isHighlighted ? "#4ade80" : "#e6edf3",
                    }}
                  >
                    {String(cell)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tree SVG visualizer ──────────────────────────────────────────────────
function TreeSVGViz({ name, data, highlights = [] }) {
  const parsed = safeData(data);
  const arr = Array.isArray(parsed) ? parsed : [];

  if (arr.length === 0) {
    return (
      <div>
        <p className="font-mono text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-widest">{name}</p>
        <div className="font-mono text-xs text-muted-foreground/40">empty tree</div>
      </div>
    );
  }

  // Build tree nodes using BFS (LeetCode array format)
  const nodes = [];
  const queue = [{ idx: 0, depth: 0 }];
  let maxDepth = 0;

  while (queue.length > 0) {
    const { idx, depth } = queue.shift();
    if (idx >= arr.length) continue;
    const val = arr[idx];
    if (val === null || val === undefined) continue;
    nodes.push({ idx, val, depth });
    if (depth > maxDepth) maxDepth = depth;
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;
    if (left < arr.length && arr[left] !== null) queue.push({ idx: left, depth: depth + 1 });
    if (right < arr.length && arr[right] !== null) queue.push({ idx: right, depth: depth + 1 });
  }

  // Assign in-order x positions
  const nodesByDepth = {};
  nodes.forEach(n => {
    if (!nodesByDepth[n.depth]) nodesByDepth[n.depth] = [];
    nodesByDepth[n.depth].push(n);
  });

  const W = 300;
  const H_STEP = 54;
  const PAD = 24;
  const R = 16;
  const svgH = (maxDepth + 1) * H_STEP + PAD * 2;

  const posMap = {};
  nodes.forEach(n => {
    const siblings = nodesByDepth[n.depth] || [];
    const pos = siblings.indexOf(n);
    const count = siblings.length;
    const x = count === 1 ? W / 2 : PAD + R + (pos / (count - 1)) * (W - 2 * (PAD + R));
    const y = PAD + R + n.depth * H_STEP;
    posMap[n.idx] = { x, y };
  });

  // Build edges
  const edges = [];
  nodes.forEach(n => {
    const left = 2 * n.idx + 1;
    const right = 2 * n.idx + 2;
    if (posMap[left]) edges.push([posMap[n.idx], posMap[left]]);
    if (posMap[right]) edges.push([posMap[n.idx], posMap[right]]);
  });

  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-widest">{name}</p>
      <svg width={W} height={svgH} className="block">
        {edges.map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#334155" strokeWidth="1.5" />
        ))}
        {nodes.map(n => {
          const pos = posMap[n.idx];
          const isHighlighted = highlights.includes(n.idx);
          return (
            <g key={n.idx}>
              <circle
                cx={pos.x} cy={pos.y} r={R}
                fill={isHighlighted ? "#4ade8025" : "#1e293b"}
                stroke={isHighlighted ? "#4ade80" : "#475569"}
                strokeWidth="1.5"
              />
              <text
                x={pos.x} y={pos.y}
                textAnchor="middle" dominantBaseline="central"
                fontSize="11" fontFamily="monospace"
                fill={isHighlighted ? "#4ade80" : "#e2e8f0"}
              >
                {String(n.val)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Variable visualizer ──────────────────────────────────────────────────
function VariableViz({ name, data }) {
  const val = safeData(data);
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-muted-foreground/70">{name}</span>
      <span className="font-mono text-lg font-bold rounded-lg px-3 py-1" style={{ color: "#4ade80", background: "#4ade8015", border: "1px solid #4ade8030" }}>
        {JSON.stringify(val)}
      </span>
    </div>
  );
}

// ─── Structure dispatcher ─────────────────────────────────────────────────
function StructureRenderer({ structure }) {
  const { name, type, data, highlights = [], pointers = {} } = structure;
  const safeHighlights = Array.isArray(highlights) ? highlights : [];
  const safePointers = (pointers && typeof pointers === "object") ? pointers : {};

  let inner;
  switch (type) {
    case "array":
      inner = <ArrayViz name={name} data={data} highlights={safeHighlights} pointers={safePointers} />;
      break;
    case "hashmap":
    case "map":
    case "dict":
      inner = <HashMapViz name={name} data={data} highlights={safeHighlights} />;
      break;
    case "stack":
      inner = <StackViz name={name} data={data} highlights={safeHighlights} />;
      break;
    case "queue":
      inner = <StackViz name={name} data={data} highlights={safeHighlights} isQueue />;
      break;
    case "tree":
      inner = <TreeSVGViz name={name} data={data} highlights={safeHighlights} />;
      break;
    case "string":
      inner = <StringViz name={name} data={data} highlights={safeHighlights} pointers={safePointers} />;
      break;
    case "matrix":
    case "grid":
      inner = <MatrixViz name={name} data={data} highlights={safeHighlights} />;
      break;
    case "variable":
    case "number":
    case "int":
    case "bool":
    case "boolean":
      inner = <VariableViz name={name} data={data} />;
      break;
    default:
      inner = <VariableViz name={name} data={data} />;
  }

  return (
    <div className="rounded-xl border border-border p-4" style={{ background: "#0d1117" }}>
      {inner}
    </div>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────
function StepCard({ step, totalSteps }) {
  if (!step) return null;
  const structures = Array.isArray(step.structures) ? step.structures : [];

  return (
    <div className="rounded-xl border border-border overflow-hidden" style={{ background: "#0d1117" }}>
      {/* Step header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border" style={{ background: "#161b22" }}>
        <span className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest">
          Step {step.step_number} / {totalSteps}
        </span>
        <div className="h-px flex-1" style={{ background: "#30363d" }} />
      </div>

      <div className="p-5 space-y-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground leading-snug">{step.title}</h3>

        {/* Narration */}
        <p className="text-muted-foreground leading-7 text-sm">{step.narration}</p>

        {/* Data structures */}
        {structures.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {structures.map((s, i) => (
              <StructureRenderer key={i} structure={s} />
            ))}
          </div>
        )}

        {/* Why it matters */}
        {step.why_it_matters && (
          <div className="rounded-lg border-l-4 border-primary/60 px-4 py-3 text-sm" style={{ background: "#4ade8010", borderColor: "#4ade80" }}>
            <p className="font-mono text-[10px] text-primary/70 uppercase tracking-widest mb-1">Why it matters</p>
            <p className="text-muted-foreground leading-relaxed">{step.why_it_matters}</p>
          </div>
        )}

        {/* Common mistake */}
        {step.common_mistake && (
          <div className="rounded-lg border-l-4 px-4 py-3 text-sm" style={{ background: "#fbbf2410", borderColor: "#fbbf24" }}>
            <p className="font-mono text-[10px] text-yellow-400/70 uppercase tracking-widest mb-1">Common mistake</p>
            <p className="text-muted-foreground leading-relaxed">{step.common_mistake}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Final understanding card ─────────────────────────────────────────────
function FinalCard({ data }) {
  if (!data) return null;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: "#0d1117", borderColor: "#4ade8040" }}>
      <div className="px-5 py-3 border-b" style={{ background: "#4ade8012", borderColor: "#4ade8030" }}>
        <p className="font-mono text-xs text-primary uppercase tracking-widest">Final Understanding</p>
      </div>
      <div className="p-5 space-y-4">
        {data.core_idea && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-foreground font-semibold">Core Idea: </span>{data.core_idea}
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          {data.time_complexity && (
            <div className="rounded-lg border border-border px-4 py-2.5" style={{ background: "#161b22" }}>
              <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest mb-1">Time</p>
              <p className="font-mono text-sm text-primary">{data.time_complexity}</p>
            </div>
          )}
          {data.space_complexity && (
            <div className="rounded-lg border border-border px-4 py-2.5" style={{ background: "#161b22" }}>
              <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest mb-1">Space</p>
              <p className="font-mono text-sm text-primary">{data.space_complexity}</p>
            </div>
          )}
        </div>
        {data.key_takeaway && (
          <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-3">
            {data.key_takeaway}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Download HTML ────────────────────────────────────────────────────────
function buildHTMLDownload(problem, vizData) {
  const examples = vizData?.examples || [];
  const summary = vizData?.problem_summary || {};
  const final = vizData?.final_understanding || {};

  const examplesHTML = examples.map(ex => {
    const stepsHTML = (ex.steps || []).map(step => {
      const structuresHTML = (step.structures || []).map(s =>
        `<div class="struct-card">
          <div class="struct-label">${s.name} <span class="struct-type">(${s.type})</span></div>
          <pre class="struct-data">${JSON.stringify(s.data, null, 2)}</pre>
          ${s.highlights?.length ? `<div class="struct-highlights">Highlights: [${s.highlights.join(", ")}]</div>` : ""}
        </div>`
      ).join("");

      return `
        <div class="step-card">
          <div class="step-header">Step ${step.step_number} / ${ex.steps.length}</div>
          <h3 class="step-title">${step.title || ""}</h3>
          <p class="step-narration">${step.narration || ""}</p>
          ${structuresHTML ? `<div class="structures-grid">${structuresHTML}</div>` : ""}
          ${step.why_it_matters ? `<div class="why-matters"><strong>Why it matters:</strong> ${step.why_it_matters}</div>` : ""}
          ${step.common_mistake ? `<div class="common-mistake"><strong>Common mistake:</strong> ${step.common_mistake}</div>` : ""}
        </div>`;
    }).join("");

    return `
      <section class="example-section">
        <h2 class="example-label">${ex.label || ex.id}</h2>
        <p class="example-io"><strong>Input:</strong> ${ex.input_description || ""}</p>
        <p class="example-io"><strong>Output:</strong> ${ex.output || ""}</p>
        ${stepsHTML}
      </section>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${problem.title} — Algorithm Visualization</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #080c14; color: #e6edf3; padding: 2rem; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
  .pattern-badge { display: inline-block; background: #4ade8018; border: 1px solid #4ade8030; color: #4ade80; font-family: monospace; font-size: 0.7rem; padding: 0.25rem 0.6rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
  .ai-badge { display: inline-block; background: #fbbf2415; border: 1px solid #fbbf2430; color: #fbbf24; font-family: monospace; font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 999px; margin-left: 0.75rem; }
  .example-section { margin-bottom: 3rem; }
  .example-label { font-size: 1.1rem; font-weight: 600; color: #4ade80; border-bottom: 1px solid #30363d; padding-bottom: 0.5rem; margin-bottom: 1rem; }
  .example-io { font-size: 0.85rem; color: #9ca3af; margin-bottom: 0.25rem; font-family: monospace; }
  .step-card { background: #0d1117; border: 1px solid #30363d; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
  .step-header { font-family: monospace; font-size: 0.65rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
  .step-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
  .step-narration { font-size: 0.875rem; color: #9ca3af; line-height: 1.7; margin-bottom: 1rem; }
  .structures-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
  .struct-card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 0.75rem; }
  .struct-label { font-family: monospace; font-size: 0.75rem; color: #e6edf3; margin-bottom: 0.5rem; font-weight: 600; }
  .struct-type { color: #6b7280; font-weight: normal; }
  .struct-data { font-family: monospace; font-size: 0.75rem; color: #4ade80; white-space: pre-wrap; word-break: break-all; }
  .struct-highlights { font-family: monospace; font-size: 0.7rem; color: #fbbf24; margin-top: 0.25rem; }
  .why-matters { background: #4ade8010; border-left: 3px solid #4ade80; padding: 0.5rem 0.75rem; border-radius: 0 6px 6px 0; font-size: 0.8rem; color: #9ca3af; margin-bottom: 0.5rem; }
  .common-mistake { background: #fbbf2410; border-left: 3px solid #fbbf24; padding: 0.5rem 0.75rem; border-radius: 0 6px 6px 0; font-size: 0.8rem; color: #9ca3af; }
  .final-card { background: #0d1117; border: 1px solid #4ade8040; border-radius: 12px; padding: 1.25rem; margin-top: 2rem; }
  .final-title { font-family: monospace; font-size: 0.65rem; color: #4ade80; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
  .complexity-row { display: flex; gap: 1rem; margin: 0.75rem 0; }
  .complexity-box { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 0.5rem 0.75rem; }
  .complexity-label { font-family: monospace; font-size: 0.6rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem; }
  .complexity-value { font-family: monospace; font-size: 0.85rem; color: #4ade80; }
  .footer { margin-top: 3rem; border-top: 1px solid #30363d; padding-top: 1rem; font-family: monospace; font-size: 0.7rem; color: #4b5563; text-align: center; }
</style>
</head>
<body>
<h1>${problem.title} <span style="font-family:monospace;font-size:1rem;color:#6b7280">#${problem.lcNumber}</span></h1>
${summary.pattern ? `<span class="pattern-badge">${summary.pattern}</span>` : ""}
<span class="ai-badge">AI-generated · may contain errors</span>
${summary.goal ? `<p style="color:#9ca3af;margin-bottom:2rem;font-size:0.875rem">${summary.goal}</p>` : ""}

${examplesHTML}

${final.core_idea || final.time_complexity ? `
<div class="final-card">
  <div class="final-title">Final Understanding</div>
  ${final.core_idea ? `<p style="font-size:0.875rem;color:#9ca3af;margin-bottom:0.75rem"><strong style="color:#e6edf3">Core Idea:</strong> ${final.core_idea}</p>` : ""}
  <div class="complexity-row">
    ${final.time_complexity ? `<div class="complexity-box"><div class="complexity-label">Time</div><div class="complexity-value">${final.time_complexity}</div></div>` : ""}
    ${final.space_complexity ? `<div class="complexity-box"><div class="complexity-label">Space</div><div class="complexity-value">${final.space_complexity}</div></div>` : ""}
  </div>
  ${final.key_takeaway ? `<p style="font-size:0.8rem;color:#9ca3af;border-left:2px solid #4ade8060;padding-left:0.75rem;font-style:italic">${final.key_takeaway}</p>` : ""}
</div>` : ""}

<div class="footer">Generated by Hashmap · AI-assisted · ${new Date().toLocaleDateString()}</div>
</body>
</html>`;
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function VisualizerPage() {
  const { lcNumber } = useParams();

  // Find problem across all lessons
  const { problem, lessonId } = (() => {
    for (const lesson of problemData) {
      const found = (lesson.problems || []).find(
        p => String(p.lcNumber) === String(lcNumber)
      );
      if (found) return { problem: found, lessonId: lesson.id };
    }
    return { problem: null, lessonId: null };
  })();

  const [vizData, setVizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeExample, setActiveExample] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [, setValidating] = useState(false);
  const [showValidate, setShowValidate] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const { response: validateResult, isStreaming, stream: streamValidate, setResponse: setValidateResponse } = useStreamingAI();

  const cacheKey = problem ? `hashmap_viz_${problem.lcNumber}` : null;

  // Load from cache on mount
  useEffect(() => {
    if (!cacheKey) return;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.examples?.[0]?.steps?.length) {
          setVizData(parsed);
        }
      }
    } catch {}
  }, [cacheKey]);

  // Reset step when example changes
  useEffect(() => {
    setActiveStep(0);
  }, [activeExample]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!vizData) return;
      const steps = vizData?.examples?.[activeExample]?.steps || [];
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActiveStep(s => Math.min(s + 1, steps.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActiveStep(s => Math.max(s - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [vizData, activeExample]);

  const generate = useCallback(async () => {
    if (!problem) return;
    setLoading(true);
    setError(null);
    setVizData(null);
    try {
      const raw = await callAI(SYSTEM_PROMPT, buildUserPrompt(problem));
      const parsed = extractJSON(raw);
      if (!parsed?.examples?.[0]?.steps?.length) {
        throw new Error("AI returned incomplete visualization data. Try regenerating.");
      }
      setVizData(parsed);
      if (cacheKey) localStorage.setItem(cacheKey, JSON.stringify(parsed));
      setActiveStep(0);
      setActiveExample(0);
    } catch (e) {
      setError(e.message || "Failed to generate visualization.");
    } finally {
      setLoading(false);
    }
  }, [problem, cacheKey]);

  const handleValidate = useCallback(() => {
    if (!vizData || !problem) return;
    setValidateResponse("");
    setShowValidate(true);
    setValidating(true);
    const exText = (vizData.examples || []).map(ex =>
      `${ex.label}:\n` + (ex.steps || []).map(s =>
        `  Step ${s.step_number}: ${s.title}\n  Structures: ${JSON.stringify(s.structures?.map(st => ({ name: st.name, data: st.data })))}`
      ).join("\n")
    ).join("\n\n");

    const prompt = `Review these algorithm visualization steps for "${problem.title}" (LeetCode #${problem.lcNumber}).

Check if the data structure states at each step are mathematically correct for the given inputs. Be specific about any errors or inaccuracies.

${exText}

Provide a concise review with any corrections needed.`;

    streamValidate(prompt, "You are an expert algorithm tutor reviewing visualization steps for correctness.").finally(() => setValidating(false));
  }, [vizData, problem, streamValidate, setValidateResponse]);

  const downloadHTML = useCallback(() => {
    if (!vizData || !problem) return;
    const html = buildHTMLDownload(problem, vizData);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hashmap-viz-${problem.lcNumber}-${(problem.title || "problem").replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [vizData, problem]);

  const keys = getStoredKeys();
  const hasKey = Object.keys(keys).length > 0;

  // ── 404 ─────────────────────────────────────────────────────────────────
  if (!problem) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#080c14" }}>
        <div className="text-center space-y-4">
          <p className="font-mono text-5xl text-muted-foreground/20">404</p>
          <h1 className="text-lg font-semibold text-foreground">Problem #{lcNumber} not found</h1>
          <Link to="/library" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to library
          </Link>
        </div>
      </main>
    );
  }

  const currentExample = vizData?.examples?.[activeExample];
  const steps = currentExample?.steps || [];
  const currentStep = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  const pattern = vizData?.problem_summary?.pattern;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen" style={{ background: "#080c14" }}>
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-border" style={{ background: "rgba(8,12,20,0.96)", backdropFilter: "blur(8px)" }}>
        <div className="container flex items-center gap-3 py-3 flex-wrap">
          <Link to={lessonId ? `/lesson/${lessonId}` : "/library"} className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <ArrowLeft className="h-4 w-4" />Problem
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-mono text-xs text-muted-foreground/50">#{problem.lcNumber}</span>
            <span className="text-sm font-semibold text-foreground truncate">{problem.title}</span>
            {pattern && (
              <span className="shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] text-primary/80 uppercase tracking-widest"
                style={{ borderColor: "#4ade8040", background: "#4ade8010" }}>
                {pattern}
              </span>
            )}
          </div>
          {/* AI disclaimer */}
          <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] text-yellow-400/80 shrink-0"
            style={{ borderColor: "#fbbf2430", background: "#fbbf2410" }}>
            <AlertTriangle className="h-3 w-3" />
            AI-generated · may contain errors
          </span>
          {/* Action buttons */}
          {vizData && (
            <>
              <button
                onClick={generate}
                disabled={loading || !hasKey}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40 shrink-0"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Regenerate
              </button>
              <button
                onClick={handleValidate}
                disabled={isStreaming}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-40 shrink-0"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Validate
              </button>
              <button
                onClick={downloadHTML}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </>
          )}
          {/* API Key button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-all shrink-0"
            style={hasKey
              ? { borderColor: "#4ade8040", background: "#4ade8010", color: "#4ade80" }
              : { borderColor: "#f59e0b40", background: "#f59e0b10", color: "#f59e0b" }}
          >
            <Key className="h-3.5 w-3.5" />
            {hasKey ? "API Keys ✓" : "Add API Key"}
          </button>
        </div>
      </header>
      {showKeyModal && <ApiKeyModal onClose={() => setShowKeyModal(false)} />}

      <div className="container py-8 space-y-6 max-w-5xl">

        {/* ── No vizData + not loading ── */}
        {!vizData && !loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full rounded-2xl border border-border p-8 space-y-5 text-center" style={{ background: "#0d1117" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: "#4ade8015", border: "1px solid #4ade8030" }}>
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">{problem.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description?.slice(0, 120)}{problem.description?.length > 120 ? "…" : ""}
                </p>
              </div>
              {error && (
                <div className="rounded-lg border border-red-500/30 px-4 py-3 text-left" style={{ background: "#1a0a0a" }}>
                  <p className="font-mono text-xs text-red-400">{error}</p>
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={generate}
                  disabled={!hasKey || loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: hasKey ? "#4ade80" : "#4ade8060", color: "#0a0e17" }}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Visualization
                </button>
                {!hasKey && (
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <Key className="h-3.5 w-3.5" />
                    Add an API key in the library to generate
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground/50">
                  Results cached in localStorage · Uses your configured AI provider
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: "#4ade8015", border: "1px solid #4ade8030" }}>
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground mb-1">Generating visualization…</p>
                <p className="text-sm text-muted-foreground">This may take 10–30 seconds</p>
              </div>
              {/* Skeleton steps */}
              <div className="space-y-3 max-w-md mx-auto mt-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-xl border border-border p-4 space-y-2.5 animate-pulse" style={{ background: "#0d1117" }}>
                    <div className="h-3 w-24 rounded" style={{ background: "#161b22" }} />
                    <div className="h-5 w-2/3 rounded" style={{ background: "#161b22" }} />
                    <div className="h-3 w-full rounded" style={{ background: "#161b22" }} />
                    <div className="h-3 w-4/5 rounded" style={{ background: "#161b22" }} />
                    <div className="flex gap-2 mt-1">
                      <div className="h-10 w-28 rounded-lg" style={{ background: "#161b22" }} />
                      <div className="h-10 w-32 rounded-lg" style={{ background: "#161b22" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── vizData loaded ── */}
        {vizData && !loading && (
          <>
            {/* Example tabs */}
            <div className="flex gap-1.5">
              {(vizData.examples || []).map((ex, i) => (
                <button
                  key={ex.id || i}
                  onClick={() => setActiveExample(i)}
                  className="rounded-lg border px-4 py-2 font-mono text-xs transition-all"
                  style={{
                    background: activeExample === i ? "#4ade8015" : "#0d1117",
                    borderColor: activeExample === i ? "#4ade8060" : "#30363d",
                    color: activeExample === i ? "#4ade80" : "#6b7280",
                  }}
                >
                  {ex.label || `Example ${i + 1}`}
                </button>
              ))}
            </div>

            {/* Input / Output summary */}
            {currentExample && (
              <div className="rounded-xl border border-border px-5 py-3 flex flex-wrap gap-x-8 gap-y-1" style={{ background: "#0d1117" }}>
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest mr-2">Input</span>
                  <span className="font-mono text-xs text-muted-foreground">{currentExample.input_description}</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest mr-2">Output</span>
                  <span className="font-mono text-xs text-primary">{currentExample.output}</span>
                </div>
              </div>
            )}

            {/* Step progress dots */}
            {steps.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    title={`Step ${i + 1}`}
                    className="transition-all rounded-full"
                    style={{
                      width: i === activeStep ? 20 : 10,
                      height: 10,
                      background: i === activeStep ? "#4ade80" : i < activeStep ? "#4ade8050" : "#30363d",
                    }}
                  />
                ))}
                <span className="font-mono text-xs text-muted-foreground/50 ml-2">{activeStep + 1} / {steps.length}</span>
                <span className="font-mono text-[10px] text-muted-foreground/30 ml-auto hidden sm:block">← → to navigate</span>
              </div>
            )}

            {/* Step card */}
            {currentStep && <StepCard step={currentStep} totalSteps={steps.length} />}

            {/* Navigation buttons */}
            {steps.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveStep(s => Math.max(s - 1, 0))}
                  disabled={activeStep === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 font-mono text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-30"
                  style={{ background: "#0d1117" }}
                >
                  <ChevronLeft className="h-4 w-4" />Prev
                </button>
                <div className="flex-1 h-px" style={{ background: "#30363d" }} />
                <button
                  onClick={() => setActiveStep(s => Math.min(s + 1, steps.length - 1))}
                  disabled={activeStep === steps.length - 1}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 font-mono text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all disabled:opacity-30"
                  style={{ background: "#0d1117" }}
                >
                  Next<ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Final understanding (when on last step) */}
            {isLastStep && vizData.final_understanding && (
              <FinalCard data={vizData.final_understanding} />
            )}
          </>
        )}

        {/* Error state (when vizData exists but there's an error from regenerate) */}
        {error && vizData && (
          <div className="rounded-xl border border-red-500/30 px-5 py-4 flex items-start gap-3" style={{ background: "#1a0a0a" }}>
            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-red-400 font-medium">Generation failed</p>
              <p className="font-mono text-xs text-red-400/70 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Validate panel */}
      {showValidate && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-border transition-transform"
          style={{ background: "#0d1117", maxHeight: "40vh" }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border" style={{ background: "#161b22" }}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Validation Result</span>
              {isStreaming && <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />}
            </div>
            <button onClick={() => setShowValidate(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(40vh - 52px)" }}>
            {validateResult ? (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{validateResult}</p>
            ) : (
              <p className="text-sm text-muted-foreground/50 italic">
                {isStreaming ? "Analyzing…" : "No result yet."}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
