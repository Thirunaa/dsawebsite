import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import problemData from "../../data.json";
import filterData from "../../filterData.json";
import SearchProblems from "./SearchProblems";
import FilterProblems from "./FilterProblems";
import { getYouTubeThumbnailSet, resolveResourceLink } from "../../utils/content";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

const getProblemTopics = (problemId) => {
  const numericId = Number(problemId);
  return Object.keys(filterData).filter((topic) => filterData[topic].includes(numericId));
};

const LessonThumbnail = ({ title, videoLink }) => {
  const sources = getYouTubeThumbnailSet(videoLink);
  const [currentSource, setCurrentSource] = useState(0);

  if (!sources.length) {
    return (
      <div className="flex aspect-[16/10] h-full min-h-[180px] items-end border-b bg-secondary p-4 md:border-b-0 md:border-r">
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>
    );
  }

  return (
    <div className="h-full border-b bg-muted md:border-b-0 md:border-r">
      <img
        className="h-full w-full object-cover"
        src={sources[currentSource]}
        alt={`${title} lesson thumbnail`}
        loading="lazy"
        onError={() => {
          if (currentSource < sources.length - 1) {
            setCurrentSource((value) => value + 1);
          }
        }}
      />
    </div>
  );
};

const ProblemList = () => {
  const regex = /(<([^>]+)>)/gi;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerms, setFilterTerms] = useState([]);
  const [resourceFilter, setResourceFilter] = useState("all");

  const searchValue = (value) => {
    setSearchTerm(value);
  };

  const filterProblems = (value) => {
    setFilterTerms(value);
  };

  const filteredIds = filterTerms.length
    ? new Set(filterTerms.flatMap((term) => filterData[term] || []))
    : null;

  const visibleProblems = problemData.filter((problem) => {
    const matchesSearch =
      !searchTerm ||
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = !filteredIds || filteredIds.has(Number(problem.id));
    const matchesResourceFilter =
      resourceFilter === "all" ||
      (resourceFilter === "video" && Boolean(problem.videoLink)) ||
      (resourceFilter === "notes" && Boolean(problem.notes));

    return matchesSearch && matchesFilter && matchesResourceFilter;
  });

  const lessonCount = problemData.length;
  const videoCount = problemData.filter((problem) => problem.videoLink).length;
  const notesCount = problemData.filter((problem) => problem.notes).length;
  const activeTopicText = filterTerms.length ? `Filtered by ${filterTerms.join(", ")}` : "All topics";

  return (
    <main className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container flex flex-col gap-3 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Data Structures and Algorithms</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {lessonCount} lessons, {videoCount} video walkthroughs, {notesCount} note packs
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{activeTopicText}</p>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[240px,minmax(0,1fr)]">
          <aside className="space-y-4">
            <FilterProblems selected={filterTerms} filterterms={filterProblems} />
          </aside>

          <section className="space-y-4">
            <SearchProblems
              searchValue={searchValue}
              searchTerm={searchTerm}
              resourceFilter={resourceFilter}
              setResourceFilter={setResourceFilter}
              visibleCount={visibleProblems.length}
              totalCount={lessonCount}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Browse the library by topic, then open a lesson for links, notes, and the best YouTube preview
                available.
              </p>
              {(filterTerms.length > 0 || searchTerm || resourceFilter !== "all") && (
                <button
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-fit")}
                  onClick={() => {
                    setFilterTerms([]);
                    setSearchTerm("");
                    setResourceFilter("all");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="space-y-4">
              {visibleProblems.map((problem) => {
                const topics = getProblemTopics(problem.id);
                const summary = problem.summary
                  ? `${problem.summary.replace(regex, "").substring(0, 180).trim()}...`
                  : "Structured explanation coming soon.";

                return (
                  <Card key={problem.id} className="overflow-hidden">
                    <div className="grid md:grid-cols-[280px,minmax(0,1fr)]">
                      <LessonThumbnail title={problem.title} videoLink={problem.videoLink} />
                      <CardContent className="flex flex-col gap-4 p-5">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>{topics[0] || "General"}</span>
                            <span>{problem.videoLink ? "Video available" : "Reading only"}</span>
                            <span>{problem.notes ? "Notes included" : "No notes attached"}</span>
                          </div>
                          <Link to={`/problem/${problem.id}`}>
                            <h2 className="text-lg font-semibold leading-6 hover:text-primary">{problem.title}</h2>
                          </Link>
                          <p className="text-sm leading-6 text-muted-foreground">{summary}</p>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {topics.slice(0, 4).map((topic) => (
                              <span key={topic}>{topic}</span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {problem.videoLink && (
                              <a
                                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                                href={problem.videoLink}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Watch
                              </a>
                            )}
                            {problem.notes && (
                              <a
                                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                                href={resolveResourceLink(problem.notes)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Notes
                              </a>
                            )}
                            <Link className={cn(buttonVariants({ size: "sm" }))} to={`/problem/${problem.id}`}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open lesson
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}

              {!visibleProblems.length && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-base font-semibold">No lessons match the current filters.</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try a broader search or clear the selected topic and resource filters.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProblemList;
