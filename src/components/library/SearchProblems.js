import React from "react";
import { Search, X } from "lucide-react";

function SearchProblems({ searchValue, searchTerm, visibleCount, totalCount }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => searchValue(e.target.value)}
        placeholder="Search lessons, problems, topics..."
        className="w-full rounded-lg border border-border bg-secondary pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
      />
      {searchTerm && (
        <button
          onClick={() => searchValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default SearchProblems;
