import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section id="start" className="border-y border-border py-16 md:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-xl border border-primary/20 px-8 py-12 text-center" style={{ background: "radial-gradient(ellipse at center, rgba(74,222,128,0.07) 0%, transparent 70%)" }}>
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative z-10">
            <p className="mb-3 text-xs font-mono font-semibold uppercase tracking-widest text-primary">Get started</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ready to practice with <span className="text-primary">consistency?</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Use the full library to filter by topic, watch video walkthroughs, and work through solutions at your own pace.
            </p>
            <Link
              to="/library"
              className="mt-7 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#4ade80", color: "#0a0e17" }}
            >
              Open Problem Library
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
