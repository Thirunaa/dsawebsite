import React from "react";
import filterData from "../../filterData.json";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

function FilterProblems({ selected, filterterms }) {
  const selectionChangeHandler = (value) => {
    const nextSelection = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    filterterms(nextSelection);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Topics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          className="w-full justify-between"
          variant={selected.length ? "outline" : "secondary"}
          onClick={() => filterterms([])}
        >
          <span>All topics</span>
          <span className="text-xs text-muted-foreground">{Object.keys(filterData).length}</span>
        </Button>
        {Object.keys(filterData).map((value) => (
          <Button
            key={value}
            className="w-full justify-between"
            variant={selected.includes(value) ? "secondary" : "outline"}
            onClick={() => selectionChangeHandler(value)}
          >
            <span>{value}</span>
            <span className="text-xs text-muted-foreground">{filterData[value].length}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export default FilterProblems;
