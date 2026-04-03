import React from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function SearchProblems({ searchValue, searchTerm, resourceFilter, setResourceFilter, visibleCount, totalCount }) {
  const handleChange = (event) => {
    searchValue(event.target.value);
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label className="mb-2 block text-sm font-medium" htmlFor="problem-search">
            Search lessons
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="problem-search"
              autoComplete="off"
              className="pl-9"
              type="text"
              name="searchTerm"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Search by title, pattern, or summary"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={resourceFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setResourceFilter("all")}
          >
            All lessons
          </Button>
          <Button
            variant={resourceFilter === "video" ? "default" : "outline"}
            size="sm"
            onClick={() => setResourceFilter("video")}
          >
            Video lessons
          </Button>
          <Button
            variant={resourceFilter === "notes" ? "default" : "outline"}
            size="sm"
            onClick={() => setResourceFilter("notes")}
          >
            Notes included
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {visibleCount} of {totalCount} lessons
        </p>
      </CardContent>
    </Card>
  );
}

export default SearchProblems;
