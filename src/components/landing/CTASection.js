import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const CTASection = () => {
  return (
    <section id="start" className="border-y py-16 md:py-20">
      <div className="container">
        <div className="rounded-lg border bg-card px-6 py-10 text-center md:px-10">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready to practice with consistency?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Use the full library to filter by topic, open notes, and work through lesson walkthroughs in a focused flow.
          </p>
          <Link to="/library" className="mt-6 inline-flex">
            <Button size="lg">
              Go to Problem Library
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
