import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { OpsSidebar } from "@/components/ops/OpsSidebar";

export const Route = createFileRoute("/ops")({
  head: () => ({ meta: [{ title: "Operations — LeaseMate" }] }),
  component: OpsLayout,
});

function OpsLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="flex min-h-[calc(100vh-2.5rem)] bg-[color:var(--color-console-bg)] text-[color:var(--color-console-foreground)]">
      <OpsSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)] px-4 py-2 text-xs">
          <nav className="flex gap-2 md:hidden">
            <Link to="/ops" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link to="/ops/requests" className="text-muted-foreground hover:text-foreground">Requests</Link>
            <Link to="/ops/exceptions" className="text-muted-foreground hover:text-foreground">Exceptions</Link>
          </nav>
          <span className="ml-auto font-mono text-[color:var(--color-console-muted-foreground)]">{path}</span>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}