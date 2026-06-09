import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { StateBadge } from "@/components/shared/StateBadge";
import { Activity, AlertTriangle, Workflow, Inbox } from "lucide-react";
import { formatDateTime, relativeFromNow } from "@/mock/utils";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/ops/")({
  component: OpsHome,
});

function OpsHome() {
  const requests = useStore((s) => s.requests);
  const cartItems = useStore((s) => s.cartItems);
  const serviceProducts = useStore((s) => s.serviceProducts);
  const automations = useStore((s) => s.automations);
  const exceptions = useStore((s) => s.exceptions);
  const audit = useStore((s) => s.audit);
  const now = useStore((s) => s.demo.virtualNow);

  const active = requests.filter((r) => !["completed", "cancelled"].includes(r.state));
  const activeCartItems = cartItems.filter(
    (item) => !["completed", "cancelled"].includes(item.state),
  );
  const openExc = exceptions.filter((e) => !e.resolvedAt);
  const scheduled = automations.filter((a) => a.status === "scheduled");
  const recent = audit.filter((a) => Date.parse(a.at) > Date.parse(now) - 86400000).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard Icon={Inbox} label="Active Move-Out Carts" value={active.length} />
        <StatCard Icon={Inbox} label="Active cart items" value={activeCartItems.length} />
        <StatCard
          Icon={AlertTriangle}
          label="Open exceptions"
          value={openExc.length}
          tone={openExc.length > 0 ? "warning" : undefined}
        />
        <StatCard Icon={Workflow} label="Scheduled jobs" value={scheduled.length} />
        <StatCard
          Icon={Activity}
          label="Active products"
          value={serviceProducts.filter((product) => product.status === "active").length}
        />
      </div>

      <Panel
        title="Active Move-Out Carts"
        right={
          <Link
            to="/ops/requests"
            className="text-xs text-[color:var(--color-console-accent)] hover:underline"
          >
            View all →
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
              <tr>
                <th className="px-3 py-2">Cart</th>
                <th className="px-3 py-2">Cart items</th>
                <th className="px-3 py-2">State</th>
                <th className="px-3 py-2">Next action</th>
                <th className="px-3 py-2">SLA</th>
              </tr>
            </thead>
            <tbody>
              {active.slice(0, 10).map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-[color:var(--color-console-border)] hover:bg-[color:var(--color-console-muted)]/30"
                >
                  <td className="px-3 py-2 font-mono text-xs">
                    <Link to="/ops/requests/$id" params={{ id: r.id }} className="hover:underline">
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {cartItems.filter((item) => item.requestId === r.id).length}
                  </td>
                  <td className="px-3 py-2">
                    <StateBadge state={r.state} />
                  </td>
                  <td className="px-3 py-2 text-[color:var(--color-console-muted-foreground)]">
                    {r.nextAction ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {r.slaDueAt ? relativeFromNow(r.slaDueAt, now) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Open exceptions">
          {openExc.length === 0 ? (
            <Empty>No open exceptions.</Empty>
          ) : (
            <ul className="divide-y divide-[color:var(--color-console-border)]">
              {openExc.map((e) => (
                <li key={e.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span>
                    <Link
                      to="/ops/requests/$id"
                      params={{ id: e.requestId }}
                      className="font-mono text-xs hover:underline"
                    >
                      {e.requestId}
                    </Link>{" "}
                    · {e.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {relativeFromNow(e.openedAt, now)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Upcoming automations">
          {scheduled.length === 0 ? (
            <Empty>Nothing scheduled.</Empty>
          ) : (
            <ul className="divide-y divide-[color:var(--color-console-border)]">
              {scheduled.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span>
                    {a.type.replace(/_/g, " ")} {a.cartItemId ? `· ${a.cartItemId}` : ""}{" "}
                    <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                      {a.requestId}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(a.scheduledFor)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function StatCard({
  Icon,
  label,
  value,
  tone,
}: {
  Icon: LucideIcon;
  label: string;
  value: number;
  tone?: "warning";
}) {
  return (
    <div className="rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)] p-4">
      <div className="flex items-center gap-2 text-xs text-[color:var(--color-console-muted-foreground)]">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div
        className={
          "mt-2 text-2xl font-semibold " +
          (tone === "warning" ? "text-[color:var(--color-status-critical)]" : "")
        }
      >
        {value}
      </div>
    </div>
  );
}

function Panel({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
      <div className="flex items-center justify-between border-b border-[color:var(--color-console-border)] px-3 py-2 text-sm font-semibold">
        <span>{title}</span>
        {right}
      </div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="p-4 text-sm text-muted-foreground">{children}</div>;
}
