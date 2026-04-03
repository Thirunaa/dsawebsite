import { motion } from "framer-motion";
import { Binary, GitBranch, Network, Layers, Hash, Workflow, Box, Cpu } from "lucide-react";

const topics = [
  { icon: Layers, name: "Arrays & Strings", count: 180, color: "text-primary" },
  { icon: GitBranch, name: "Trees & Graphs", count: 150, color: "text-accent" },
  { icon: Hash, name: "Hash Tables", count: 95, color: "text-primary" },
  { icon: Workflow, name: "Dynamic Programming", count: 120, color: "text-accent" },
  { icon: Network, name: "Linked Lists", count: 75, color: "text-primary" },
  { icon: Binary, name: "Sorting & Searching", count: 110, color: "text-accent" },
  { icon: Box, name: "Stacks & Queues", count: 65, color: "text-primary" },
  { icon: Cpu, name: "Recursion", count: 85, color: "text-accent" },
];

const TopicsGrid = () => (
  <section id="topics" className="py-24 relative">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-mono text-primary uppercase tracking-widest">Explore</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-text-bright mt-3">
          Core <span className="gradient-text">Topics</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
          Structured learning paths covering every essential data structure and algorithm pattern.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic, i) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:bg-surface-hover transition-all duration-300 cursor-pointer"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${topic.color} mb-4`}>
              <topic.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-text-bright group-hover:text-primary transition-colors">
              {topic.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 font-mono">{topic.count} problems</p>
            <div className="mt-4 h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/60 transition-all duration-500 group-hover:bg-primary"
                style={{ width: `${Math.random() * 60 + 10}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TopicsGrid;
