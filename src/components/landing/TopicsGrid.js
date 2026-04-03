import filterData from "../../filterData.json";
import { Link } from "react-router-dom";

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

const topicEntries = Object.entries(filterData)
  .map(([name, ids]) => ({ name, count: ids.length }))
  .sort((a, b) => b.count - a.count);

const TopicsGrid = () => {
  return (
    <section id="topics" className="border-b border-border py-16 md:py-20">
      <div className="container">
        <div className="mb-10 space-y-2">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">Explore</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Core <span className="text-primary">Topics</span>
          </h2>
          <p className="text-muted-foreground">Structured learning paths covering every essential data structure and algorithm pattern.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topicEntries.map((topic) => {
            const color = topicColors[topic.name] || "#4ade80";
            const emoji = topicEmojis[topic.name] || "◆";
            return (
              <Link
                to="/library"
                key={topic.name}
                className="group relative flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-[color:var(--tc)] hover:bg-secondary/50"
                style={{ "--tc": color }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-sm font-bold transition-colors"
                  style={{ background: `${color}18`, color }}
                >
                  {emoji}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">{topic.count} lessons</p>
                </div>
                <div
                  className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: color }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopicsGrid;
