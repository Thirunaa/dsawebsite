import { Terminal } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Terminal className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold text-text-bright">algo<span className="text-primary">.dev</span></span>
      </div>
      <p className="text-sm text-muted-foreground font-mono">© 2026 algo.dev — Master algorithms, ace interviews.</p>
    </div>
  </footer>
);

export default Footer;
