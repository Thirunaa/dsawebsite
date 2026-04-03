import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8">
      <div className="container flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2 text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Code2 className="h-4 w-4" />
          </span>
          <span className="font-medium">DSA Academy</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/library" className="hover:text-primary">
            Library
          </Link>
          <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="hover:text-primary">
            LeetCode
          </a>
          <span>(c) {year}</span>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
