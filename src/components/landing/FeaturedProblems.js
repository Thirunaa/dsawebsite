import problemData from "../../data.json";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const diffColor = { Easy: "#4ade80", Medium: "#fbbf24", Hard: "#f87171" };

const FeaturedProblems = () => {
  const featured = problemData.slice(0, 10);

  return (
    <section id="featured" className="py-16 md:py-20">
      <div className="container">
        <div className="mb-8 space-y-2">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">Featured</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Start with these <span className="text-primary">lessons</span>
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border px-5 py-3" style={{ background: "#0d1117" }}>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Lesson</span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Problems</span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Topics</span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">Open</span>
          </div>

          {featured.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="group grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-secondary/40"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground w-5 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <Link to={`/lesson/${lesson.id}`} className="truncate text-sm font-medium text-foreground hover:text-primary transition-colors">
                    {lesson.title}
                  </Link>
                </div>
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

        <div className="mt-5 text-center">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
          >
            View all {problemData.length} lessons
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProblems;
