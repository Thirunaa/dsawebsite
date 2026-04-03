import React from "react";
import filterData from "../../filterData.json";

function FilterProblems({ selected, filterterms }) {
  const toggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter((i) => i !== value)
      : [...selected, value];
    filterterms(next);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="border-b border-border px-4 py-3" style={{ background: "#0d1117" }}>
        <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Filter by Topic</p>
      </div>
      <div className="p-2 space-y-1">
        <button
          onClick={() => filterterms([])}
          className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
            selected.length === 0
              ? "bg-primary/15 text-primary font-medium"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <span>All Topics</span>
          <span className="font-mono text-xs opacity-60">{Object.keys(filterData).length}</span>
        </button>

        {Object.entries(filterData)
          .sort(([, a], [, b]) => b.length - a.length)
          .map(([topic, ids]) => (
            <button
              key={topic}
              onClick={() => toggle(topic)}
              className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                selected.includes(topic)
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span>{topic}</span>
              <span className="font-mono text-xs opacity-60">{ids.length}</span>
            </button>
          ))}
      </div>
    </div>
  );
}

export default FilterProblems;
