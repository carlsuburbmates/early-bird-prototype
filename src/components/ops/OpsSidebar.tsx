import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Inbox, AlertTriangle, Workflow, FileClock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/ops", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { to: "/ops/requests", label: "Requests", Icon: Inbox },
  { to: "/ops/providers", label: "Providers", Icon: Users },
  { to: "/ops/exceptions", label: "Exceptions", Icon: AlertTriangle },
  { to: "/ops/automations", label: "Automations", Icon: Workflow },
  { to: "/ops/audit", label: "Audit log", Icon: FileClock },
] as const;

export function OpsSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="hidden w-56 shrink-0 border-r border-[color:var(--color-console-border)] bg-[color:var(--color-sidebar)] text-[color:var(--color-sidebar-foreground)] md:block">
      <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-white/60">Operations</div>
      <nav className="px-2">
        {NAV.map(({ to, label, Icon, exact }) => {
          const active = exact ? path === to : path === to || path.startsWith(to + "/");
          return (
            <Link key={to} to={to}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-[color:var(--color-sidebar-accent)] text-[color:var(--color-sidebar-accent-foreground)]"
                       : "text-white/80 hover:bg-white/5",
              )}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}