import problemData from "../../data.json";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

const getDifficulty = (index) => {
  const mod = index % 3;
  if (mod === 0) return "Easy";
  if (mod === 1) return "Medium";
  return "Hard";
};

const getStatus = (problem) => {
  if (problem.notes) return "solved";
  if (problem.videoLink) return "in-progress";
  return "not-started";
};

const statusUi = {
  solved: { icon: CheckCircle2, label: "Ready" },
  "in-progress": { icon: Clock3, label: "Learning" },
  "not-started": { icon: Circle, label: "New" },
};

const featuredProblems = problemData.slice(0, 8);

const FeaturedProblems = () => {
  return (
    <section id="featured" className="py-16 md:py-20">
      <div className="container">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium text-primary">Featured</p>
          <h2 className="text-3xl font-semibold tracking-tight">Start with these lessons</h2>
        </div>

        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b bg-secondary/50 px-4 py-3 text-xs font-medium text-muted-foreground">
            <span>Problem</span>
            <span>Status</span>
            <span>Difficulty</span>
            <span>Track</span>
          </div>

          {featuredProblems.map((problem, index) => {
            const difficulty = getDifficulty(index);
            const status = getStatus(problem);
            const StatusIcon = statusUi[status].icon;
            return (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b px-4 py-4 text-sm transition-colors last:border-b-0 hover:bg-secondary/60"
              >
                <span className="font-medium">{problem.title}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <StatusIcon className="h-4 w-4 text-primary" />
                  {statusUi[status].label}
                </span>
                <span className="text-muted-foreground">{difficulty}</span>
                <span className="text-muted-foreground">{problem.videoLink ? "Video" : "Practice"}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProblems;
