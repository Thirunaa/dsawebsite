import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="border-t border-border py-8" style={{ background: "#080c14" }}>
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
          <img
            src={`${process.env.PUBLIC_URL}/NewHashmapLogo.jpg`}
            alt="Hashmap"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-mono text-sm font-semibold tracking-wide">
            <span className="text-foreground">Hash</span><span className="text-muted-foreground">map</span>
          </span>
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
