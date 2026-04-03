import filterData from "../../filterData.json";
import { Binary, BrainCircuit, GitBranch, Layers3, Network, Boxes } from "lucide-react";

const iconMap = {
  Array: Layers3,
  Matrix: Binary,
  "Binary Search": Binary,
  "Two Pointers": Network,
  Dynamic: BrainCircuit,
  Backtracking: GitBranch,
  Stack: Boxes,
  Trie: GitBranch,
};

const topicEntries = Object.entries(filterData)
  .map(([name, ids]) => ({ name, count: ids.length }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 8);

const TopicsGrid = () => {
  return (
    <section id="topics" className="border-b py-16 md:py-20">
      <div className="container">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium text-primary">Topics</p>
          <h2 className="text-3xl font-semibold tracking-tight">Practice by problem pattern</h2>
          <p className="text-muted-foreground">Pick a track and move through lessons with focused repetition.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topicEntries.map((topic) => {
            const iconKey = Object.keys(iconMap).find((key) => topic.name.includes(key));
            const Icon = iconKey ? iconMap[iconKey] : Layers3;

            return (
              <article
                key={topic.name}
                className="rounded-lg border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-secondary/60"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">{topic.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{topic.count} problems</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopicsGrid;
