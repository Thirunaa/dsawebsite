import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const problems = [
  { title: "Two Sum", difficulty: "Easy", topic: "Arrays", status: "solved", time: "O(n)" },
  { title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Linked Lists", status: "unsolved", time: "O(n log k)" },
  { title: "Longest Palindromic Substring", difficulty: "Medium", topic: "DP", status: "attempted", time: "O(n²)" },
  { title: "Valid Parentheses", difficulty: "Easy", topic: "Stacks", status: "solved", time: "O(n)" },
  { title: "Binary Tree Level Order", difficulty: "Medium", topic: "Trees", status: "unsolved", time: "O(n)" },
  { title: "Trapping Rain Water", difficulty: "Hard", topic: "Arrays", status: "unsolved", time: "O(n)" },
];

const diffColor: Record<string, string> = {
  Easy: "text-primary",
  Medium: "text-warning",
  Hard: "text-destructive",
};

const statusIcon: Record<string, JSX.Element> = {
  solved: <CheckCircle2 className="h-4 w-4 text-primary" />,
  attempted: <Clock className="h-4 w-4 text-warning" />,
  unsolved: <Circle className="h-4 w-4 text-muted-foreground" />,
};

const FeaturedProblems = () => (
  <section id="problems" className="py-24 relative">
    <div className="absolute inset-0 grid-pattern opacity-10" />
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-mono text-primary uppercase tracking-widest">Practice</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-text-bright mt-3">
          Featured <span className="gradient-text">Problems</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-border bg-card overflow-hidden max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 px-6 py-3 border-b border-border text-xs font-mono text-muted-foreground">
          <span>Status</span><span>Problem</span><span>Difficulty</span><span>Topic</span><span className="hidden sm:block">Complexity</span>
        </div>
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-6 items-center px-6 py-4 border-b border-border/50 hover:bg-surface-hover transition-colors cursor-pointer group"
          >
            <span>{statusIcon[p.status]}</span>
            <span className="font-display font-medium text-text-bright group-hover:text-primary transition-colors text-sm">{p.title}</span>
            <span className={`text-xs font-mono ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
            <span className="text-xs font-mono text-muted-foreground hidden sm:block">{p.topic}</span>
            <span className="text-xs font-mono text-muted-foreground hidden sm:block">{p.time}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeaturedProblems;
