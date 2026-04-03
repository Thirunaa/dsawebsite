import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <Link to="/" className="flex items-center gap-1.5 font-mono font-bold text-foreground hover:text-primary transition-colors">
          <span className="text-primary">&gt;_</span>
          <span>Hashmap</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/library" className="hover:text-foreground transition-colors">Library</Link>
          <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">LeetCode</a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">YouTube</a>
          <span className="text-muted-foreground/60">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
