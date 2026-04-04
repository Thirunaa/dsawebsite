import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, ExternalLink } from "lucide-react";
import Navbar from "../landing/Navbar";
import SiteFooter from "../landing/SiteFooter";
import problemData from "../../data.json";
import filterData from "../../filterData.json";
import SearchProblems from "./SearchProblems";
import FilterProblems from "./FilterProblems";

const diffColor = { Easy: "#4ade80", Medium: "#fbbf24", Hard: "#f87171" };

const LessonCard = ({ lesson }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="group overflow-hidden rounded-xl border border-border transition-all hover:border-primary/30 hover:shadow-lg" style={{ background: "#0d1117" }}>
      <div className="grid md:grid-cols-[260px,1fr]">
        {/* Thumbnail */}
        <div className="relative overflow-hidden border-b border-border md:border-b-0 md:border-r md:border-border" style={{ background: "#161b22" }}>
          {!imgErr ? (
            <img
              src={lesson.thumbnail}
              alt={lesson.title}
              className="h-full w-full object-cover aspect-video md:aspect-auto"
              loading="lazy"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="flex h-full min-h-[140px] items-center justify-center">
              <span className="font-mono text-4xl text-muted-foreground/20">&gt;_</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="rounded-full border border-green-400/50 p-3" style={{ background: "rgba(74,222,128,0.15)" }}>
              <Play className="h-5 w-5 fill-green-400 text-green-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-5">
          <div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {lesson.topics.map((t) => (
                <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
            <Link to={`/lesson/${lesson.id}`}>
              <h2 className="text-base font-semibold text-foreground transition-colors hover:text-primary leading-snug">
                {lesson.title}
              </h2>
            </Link>
          </div>

          {/* Problems list */}
          <div className="space-y-1.5">
            {lesson.problems.map((p) => (
              <div key={p.lcNumber} className="flex items-center gap-2 text-sm">
                <span className="font-mono text-xs text-muted-foreground/60 w-8 shrink-0">#{p.lcNumber}</span>
                <span className="text-muted-foreground flex-1 truncate">{p.title}</span>
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-xs font-medium shrink-0"
                  style={{ color: diffColor[p.difficulty] || "#4ade80", background: `${diffColor[p.difficulty] || "#4ade80"}15` }}
                >
                  {p.difficulty}
                </span>
                <span className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground shrink-0">
                  {p.language}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
            {lesson.videoUrl && (
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
              >
                <Play className="h-3 w-3 fill-current" />
                Watch
              </a>
            )}
            <Link
              to={`/lesson/${lesson.id}`}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-90 ml-auto"
              style={{ background: "#4ade80", color: "#0a0e17" }}
            >
              <ExternalLink className="h-3 w-3" />
              Open Lesson
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProblemList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerms, setFilterTerms] = useState([]);

  const filteredIds = filterTerms.length
    ? new Set(filterTerms.flatMap((t) => filterData[t] || []))
    : null;

  const visible = problemData.filter((lesson) => {
    const matchSearch =
      !searchTerm ||
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.topics.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lesson.problems.some((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFilter = !filteredIds || filteredIds.has(Number(lesson.id));
    return matchSearch && matchFilter;
  });

  const totalProblems = problemData.reduce((s, l) => s + l.problems.length, 0);

  return (
    <main className="min-h-screen" style={{ background: "#080c14" }}>
      <Navbar />
      {/* Page title */}
      <div className="border-b border-border" style={{ background: "#0d1117" }}>
        <div className="container flex flex-col gap-3 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 font-mono text-xs font-semibold uppercase tracking-widest text-primary">&gt;_ Hashmap</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Problem Library</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {problemData.length} lessons · {totalProblems} problems with solutions
            </p>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {filterTerms.length ? `Filtered: ${filterTerms.join(", ")}` : "All topics"}
          </p>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
          {/* Sidebar */}
          <aside>
            <FilterProblems selected={filterTerms} filterterms={setFilterTerms} />
          </aside>

          {/* Main */}
          <section className="space-y-4">
            <SearchProblems
              searchValue={setSearchTerm}
              searchTerm={searchTerm}
              visibleCount={visible.length}
              totalCount={problemData.length}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="text-foreground font-medium">{visible.length}</span> of {problemData.length} lessons
              </p>
              {(filterTerms.length > 0 || searchTerm) && (
                <button
                  onClick={() => { setFilterTerms([]); setSearchTerm(""); }}
                  className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="space-y-3">
              {visible.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}

              {visible.length === 0 && (
                <div className="rounded-xl border border-border p-10 text-center" style={{ background: "#0d1117" }}>
                  <p className="font-mono text-sm text-muted-foreground">No lessons match your search.</p>
                  <button
                    onClick={() => { setFilterTerms([]); setSearchTerm(""); }}
                    className="mt-3 text-sm text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
};

export default ProblemList;
