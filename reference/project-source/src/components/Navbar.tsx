import { motion } from "framer-motion";
import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const links = ["Topics", "Problems", "Visualizer", "Leaderboard"];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Terminal className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-text-bright">
            algo<span className="text-primary">.dev</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary font-mono text-sm">
            Sign In
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm box-glow">
            Get Started
          </Button>
        </div>

        <button className="md:hidden text-muted-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden border-t border-border bg-background p-4 space-y-3">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm text-muted-foreground hover:text-primary font-mono py-2">
              {l}
            </a>
          ))}
          <Button size="sm" className="w-full bg-primary text-primary-foreground font-mono text-sm mt-2">Get Started</Button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
