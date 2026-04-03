import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const codeSnippet = `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`;

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
    {/* Grid background */}
    <div className="absolute inset-0 grid-pattern opacity-30" />
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

    <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-mono text-primary">1,200+ Problems • 50+ Topics</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] mb-6">
          <span className="text-text-bright">Master</span>
          <br />
          <span className="gradient-text">Data Structures</span>
          <br />
          <span className="text-text-bright">&</span>{" "}
          <span className="gradient-text">Algorithms</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-md mb-10 leading-relaxed">
          Interactive visualizations, curated problem sets, and step-by-step explanations to ace your coding interviews.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono box-glow h-12 px-6 text-sm">
            Start Learning <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="border-border text-muted-foreground hover:text-primary hover:border-primary/50 font-mono h-12 px-6 text-sm">
            <Play className="mr-2 h-4 w-4" /> Watch Demo
          </Button>
        </div>

        <div className="flex items-center gap-6 mt-10">
          {[["50K+", "Students"], ["95%", "Success Rate"], ["4.9★", "Rating"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-xl font-bold text-text-bright font-mono">{val}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="hidden lg:block"
      >
        <div className="relative">
          <div className="rounded-xl border border-border bg-card p-1 box-glow">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-destructive/60" />
                <span className="h-3 w-3 rounded-full bg-warning/60" />
                <span className="h-3 w-3 rounded-full bg-primary/60" />
              </div>
              <span className="text-xs font-mono text-muted-foreground ml-2">binary-search.js</span>
            </div>
            <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto">
              <code>
                {codeSnippet.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-text-dim w-8 select-none text-right mr-4 text-xs leading-6">{i + 1}</span>
                    <span className="text-secondary-foreground leading-6">{highlightSyntax(line)}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {/* Floating complexity badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 rounded-lg border border-primary/30 bg-card px-4 py-2 box-glow"
          >
            <p className="text-xs font-mono text-muted-foreground">Time Complexity</p>
            <p className="text-lg font-bold font-mono text-primary">O(log n)</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

function highlightSyntax(line: string) {
  return line
    .replace(/(function|const|let|return|if|else|while)/g, '<kw>$1</kw>')
    .split(/(<kw>.*?<\/kw>)/)
    .map((part, i) => {
      if (part.startsWith("<kw>")) {
        const word = part.replace(/<\/?kw>/g, "");
        return <span key={i} className="text-primary font-semibold">{word}</span>;
      }
      return <span key={i}>{part}</span>;
    });
}

export default HeroSection;
