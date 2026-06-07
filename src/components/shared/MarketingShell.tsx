import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/services", label: "Services" },
  { to: "/for-providers", label: "For providers" },
  { to: "/faq", label: "FAQ" },
] as const;

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] flex-col bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            LeaseMate
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/intake"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start your move
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 LeaseMate · Melbourne prototype</span>
          <span>Coordinates introductions. Does not provide moving, cleaning, or storage services.</span>
        </div>
      </footer>
    </div>
  );
}
