import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import problemData from "../../data.json";
import { Button } from "../ui/button";

const HeroSection = () => {
  const totalProblems = problemData.length;
  const videoProblems = problemData.filter((problem) => Boolean(problem.videoLink)).length;
  const notesProblems = problemData.filter((problem) => Boolean(problem.notes)).length;

  return (
    <section className="relative border-b py-16 md:py-24">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="container relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-medium text-primary">Interview Preparation Platform</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Learn Data Structures and Algorithms with clear, guided practice.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Structured topics, curated problem sets, notes, and walkthroughs in one place. Start with core patterns
            and build interview confidence step by step.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/library">
              <Button size="lg">
                Open Library
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#featured">
              <Button variant="outline" size="lg">
                <PlayCircle className="mr-2 h-4 w-4" />
                View Featured
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap gap-6 border-t pt-5 text-sm">
            <div>
              <p className="text-2xl font-semibold">{totalProblems}</p>
              <p className="text-muted-foreground">Total lessons</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{videoProblems}</p>
              <p className="text-muted-foreground">Video walkthroughs</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">{notesProblems}</p>
              <p className="text-muted-foreground">Note packs</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <p className="text-sm font-medium">Example Pattern</p>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">Binary Search</span>
          </div>
          <pre className="overflow-x-auto rounded-md bg-secondary p-4 text-xs leading-6 text-foreground/90">
{`function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
