import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import filterData from "../filterData.json";
import problemData from "../data.json";

const topicColors = {
  "Two Pointers": "#4ade80",
  "Array": "#60a5fa",
  "Binary Search": "#a78bfa",
  "Sliding Window": "#34d399",
  "Hashing": "#fbbf24",
  "Stack": "#f87171",
  "Linked List": "#38bdf8",
  "Trees": "#86efac",
  "BFS": "#6ee7b7",
  "DFS": "#c4b5fd",
  "Graph": "#fb923c",
  "Dynamic Programming": "#e879f9",
  "Backtracking": "#f472b6",
  "Heaps": "#fcd34d",
  "Trie": "#67e8f9",
  "Design": "#94a3b8",
  "Matrix": "#5eead4",
  "String": "#a3e635",
};

const topicEmojis = {
  "Two Pointers": "⇔",
  "Array": "[ ]",
  "Binary Search": "🔍",
  "Sliding Window": "▭",
  "Hashing": "#",
  "Stack": "⬆",
  "Linked List": "→",
  "Trees": "🌲",
  "BFS": "◎",
  "DFS": "↓",
  "Graph": "◈",
  "Dynamic Programming": "⚡",
  "Backtracking": "↩",
  "Heaps": "△",
  "Trie": "T",
  "Design": "⚙",
  "Matrix": "⊞",
  "String": "Aa",
};

const diffColor = { Easy: "#4ade80", Medium: "#fbbf24", Hard: "#f87171" };

const topicEntries = Object.entries(filterData)
  .map(([name, ids]) => ({ name, ids }))
  .sort((a, b) => b.ids.length - a.ids.length);

const TopicsPage = () => {
  const [selected, setSelected] = useState(null);

  const lessons = selected
    ? problemData.filter((l) => (filterData[selected] || []).includes(Number(l.id)))
    : [];

  return (
    <main className="min-h-screen" style={{ background: "#080c14" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border" style={{ background: "rgba(8,12,20,0.95)", backdropFilter: "blur(8px)" }}>
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <Link to="/" className="hover:opacity-85 transition-opacity">
            <img src={`${process.env.PUBLIC_URL}/NewHashmapLogo.jpg`} alt="Hashmap" className="h-8 w-auto rounded" />
          </Link>
        </div>
      </header>

      <div className="container py-8 max-w-6xl">
        {/* Page title */}
        <div className="mb-8">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-primary mb-2">Explore</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Core <span className="text-primary">Topics</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {topicEntries.length} topics · click a topic to browse its lessons
          </p>
        </div>

        {/* Topics grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-10">
          {topicEntries.map((topic) => {
            const color = topicColors[topic.name] || "#4ade80";
            const emoji = topicEmojis[topic.name] || "◆";
            const isActive = selected === topic.name;
            return (
              <button
                key={topic.name}
                onClick={() => setSelected(isActive ? null : topic.name)}
                className="group relative flex items-center gap-3 rounded-lg border p-4 text-left transition-all hover:bg-secondary/50"
                style={{
                  borderColor: isActive ? color : undefined,
                  background: isActive ? `${color}10` : undefined,
                }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-sm font-bold"
                  style={{ background: `${color}18`, color }}
                >
                  {emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">{topic.ids.length} lessons</p>
                </div>
                {isActive && (
                  <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Lessons for selected topic */}
        {selected && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                <span className="text-primary">{selected}</span> — {lessons.length} lessons
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border px-5 py-3" style={{ background: "#0d1117" }}>
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Lesson</span>
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Problems</span>
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Topics</span>
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Open</span>
              </div>

              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="group grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-secondary/40"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground w-5 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Link
                      to={`/lesson/${lesson.id}`}
                      className="truncate text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {lesson.title}
                    </Link>
                  </div>

                  <div className="flex gap-1 flex-wrap justify-end">
                    {lesson.problems.slice(0, 2).map((p) => (
                      <span
                        key={p.lcNumber}
                        className="rounded px-1.5 py-0.5 text-xs font-mono font-medium"
                        style={{ color: diffColor[p.difficulty] || "#4ade80", background: `${diffColor[p.difficulty] || "#4ade80"}15` }}
                      >
                        #{p.lcNumber}
                      </span>
                    ))}
                    {lesson.problems.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{lesson.problems.length - 2}</span>
                    )}
                  </div>

                  <div className="flex gap-1 flex-wrap justify-end max-w-[160px]">
                    {lesson.topics.slice(0, 2).map((t) => (
                      <span key={t} className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/lesson/${lesson.id}`}
                    className="rounded-md border border-border p-1.5 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default TopicsPage;
