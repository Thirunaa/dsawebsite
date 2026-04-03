import problemData from "../data.json";
import filterData from "../filterData.json";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, PlayCircle } from "lucide-react";
import { getYouTubeThumbnailSet, resolveResourceLink } from "../utils/content";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const getProblemTopics = (problemId) => {
  const numericId = Number(problemId);
  return Object.keys(filterData).filter((topic) => filterData[topic].includes(numericId));
};

const DetailThumbnail = ({ title, videoLink }) => {
  const sources = getYouTubeThumbnailSet(videoLink);
  const [currentSource, setCurrentSource] = useState(0);

  if (!sources.length) {
    return (
      <div className="flex aspect-video items-end bg-secondary p-4">
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>
    );
  }

  return (
    <div className="bg-muted">
      <img
        className="aspect-video w-full object-cover"
        src={sources[currentSource]}
        alt={`${title} video thumbnail`}
        onError={() => {
          if (currentSource < sources.length - 1) {
            setCurrentSource((value) => value + 1);
          }
        }}
      />
    </div>
  );
};

const ProblemPage = () => {
  const { id } = useParams();
  const showData = problemData.find((problem) => String(problem.id) === String(id));
  const topics = getProblemTopics(id);

  if (!showData) {
    return (
      <main className="container py-8">
        <Card>
          <CardContent className="space-y-3 p-6">
            <h1 className="text-lg font-semibold">Lesson not found</h1>
            <p className="text-sm text-muted-foreground">This problem could not be loaded.</p>
            <Link className={cn(buttonVariants({ size: "sm" }), "w-fit")} to="/library">
              Back to library
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const actionLinks = [
    showData.videoLink ? { label: "Watch video lesson", href: showData.videoLink, variant: "primary" } : null,
    showData.notes ? { label: "Open notes", href: resolveResourceLink(showData.notes), variant: "secondary" } : null,
    showData.link ? { label: "View problem", href: showData.link, variant: "secondary" } : null,
    showData.mySolution
      ? { label: "Review solution", href: resolveResourceLink(showData.mySolution), variant: "secondary" }
      : null,
  ].filter(Boolean);

  return (
    <main className="container py-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <Link className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-fit px-0")} to="/library">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to library
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">{showData.title}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{topics.length ? topics.join(" / ") : "General"}</span>
                <span>{showData.videoLink ? "Video available" : "No video linked"}</span>
                <span>{showData.notes ? "Notes available" : "No notes attached"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {actionLinks.map((action) => (
                <a
                  key={action.label}
                  className={cn(
                    buttonVariants({
                      variant: action.variant === "primary" ? "default" : "outline",
                      size: "sm",
                    })
                  )}
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {action.label.includes("Watch") ? <PlayCircle className="mr-2 h-4 w-4" /> : null}
                  {action.label.includes("notes") ? <FileText className="mr-2 h-4 w-4" /> : null}
                  {action.label.includes("View") || action.label.includes("Review") ? (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  ) : null}
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),320px]">
          <Card className="overflow-hidden">
            <DetailThumbnail title={showData.title} videoLink={showData.videoLink} />
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <h2 className="text-base font-semibold">Problem summary</h2>
                <Separator />
                <p className="text-sm leading-7 text-muted-foreground">{showData.summary}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Study assets</CardTitle>
                <CardDescription>Open the linked resources for this lesson.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Video lesson</span>
                  <span className="text-muted-foreground">{showData.videoLink ? "Available" : "Not added"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Notes</span>
                  <span className="text-muted-foreground">{showData.notes ? "Attached" : "Not added"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Custom solution</span>
                  <span className="text-muted-foreground">{showData.mySolution ? "Attached" : "Not added"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.length ? (
                  topics.map((topic) => (
                    <div key={topic} className="rounded-md border px-3 py-2 text-sm">
                      {topic}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No topic metadata has been assigned to this lesson.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProblemPage;
