import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";

const CTASection = () => (
  <section className="py-24 relative">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-primary/20 bg-card p-12 md:p-16 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/[0.02]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-mono text-primary">Free to start</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-bright mb-4">
            Ready to <span className="gradient-text">level up</span>?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Join thousands of developers mastering DSA with interactive visualizations and guided problem solving.
          </p>

          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono box-glow h-12 px-8 text-sm">
            Start Free Today <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
