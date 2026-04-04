import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bug } from "lucide-react";
import BugReportModal from "../BugReportModal";

const NAV_LINKS = [
  { to: "/topics",   label: "Topics" },
  { to: "/library",  label: "Problems" },
  { to: "/library",  label: "Library" },
  { to: "/features", label: "Features" },
];

const Navbar = () => {
  const [showBugModal, setShowBugModal] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
            <img
              src={`${process.env.PUBLIC_URL}/NewHashmapLogo.jpg`}
              alt="Hashmap"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="font-mono text-sm font-semibold tracking-wide">
              <span className="text-foreground">Hash</span><span className="text-muted-foreground">map</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-sm transition-colors hover:text-foreground ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBugModal(true)}
              title="Report a bug"
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5 transition-all"
            >
              <Bug className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report Bug</span>
            </button>
            <Link
              to="/library"
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-green"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {showBugModal && <BugReportModal onClose={() => setShowBugModal(false)} />}
    </>
  );
};

export default Navbar;
