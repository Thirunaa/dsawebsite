import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-mono text-lg font-bold text-primary group-hover:opacity-80 transition-opacity">
            &gt;_
          </span>
          <span className="font-mono text-lg font-bold text-foreground tracking-tight">Hashmap</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { to: "/topics", label: "Topics" },
            { to: "/library", label: "Problems" },
            { to: "/library", label: "Library" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/library"
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-green"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
