import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const navLinks = [
  { href: "#topics", label: "Topics" },
  { href: "#featured", label: "Problems" },
  { href: "#start", label: "Start" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Code2 className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">DSA Academy</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/library">
            <Button variant="outline" size="sm">
              Browse Library
            </Button>
          </Link>
          <a href="#start">
            <Button size="sm">Get Started</Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
