import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import {
  selectHealthMetrics,
  selectProviderMetrics,
  selectSlaBreaches,
  selectSupplyGaps,
} from "@/mock/selectors";
import { formatDateTime } from "@/mock/utils";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Inbox,
  Users,
  Workflow,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/ops/health")({
  head: () => ({ meta: [{ title: "System health — LeaseMate Ops" }] }),
  component: HealthPage,
});

function HealthPage() {
  const metrics = useStore(selectHealthMetrics);
  const providerMetrics = useStore(selectProviderMetrics);
  const breaches = useStore(selectSlaBreaches);
  const supplyGaps = useStore(selectSupplyGaps);
  const now = useStore((s) => s.demo.virtualNow);

  const cards: { Icon: LucideIcon; label: string; value: number; tone?: "warning" | "critical" }[] =
    [
      { Icon: Inbox, label: "Active requests", value: metrics.activeRequests },
      { Icon: CheckCircle2, label: "Completed", value: metrics.completedRequests },
      { Icon: Inbox, label: "Active cart items", value: metrics.activeCartItems },
      {
        Icon: AlertTriangle,
        label: "Blocked cart items",
        value: metrics.blockedCartItems,
        tone: metrics.blockedCartItems > 0 ? "warning" : undefined,
      },
      { Icon: XCircle, label: "Cancelled", value: metrics.cancelledRequests },
      {
        Icon: AlertTriangle,
        label: "Open exceptions",
        value: metrics.openExceptions,
        tone: metrics.openExceptions > 0 ? "warning" : undefined,
      },
      {
        Icon: AlertTriangle,
        label: "Critical exceptions",
        value: metrics.criticalExceptions,
        tone: metrics.criticalExceptions > 0 ? "critical" : undefined,
      },
      { Icon: Workflow, label: "Scheduled jobs", value: metrics.scheduledJobs },
      {
        Icon: Workflow,
        label: "Failed jobs",
        value: metrics.failedJobs,
        tone: metrics.failedJobs > 0 ? "critical" : undefined,
      },
      {
        Icon: Clock,
        label: "SLA breaches",
        value: metrics.slaBreaches,
        tone: metrics.slaBreaches > 0 ? "warning" : undefined,
      },
      {
        Icon: Activity,
        label: "Overdue fees",
        value: metrics.overdueFees,
        tone: metrics.overdueFees > 0 ? "critical" : undefined,
      },
      { Icon: Users, label: "Providers active", value: metrics.providersActive },
      { Icon: Users, label: "Providers paused", value: metrics.providersPaused },
      { Icon: Users, label: "Active service products", value: metrics.activeServiceProducts },
      { Icon: Users, label: "Paused service products", value: metrics.pausedServiceProducts },
      {
        Icon: AlertTriangle,
        label: "Coverage gaps",
        value: metrics.coverageGaps,
        tone: metrics.coverageGaps > 0 ? "warning" : undefined,
      },
      {
        Icon: CheckCircle2,
        label: "Pending releases",
        value: metrics.pendingReleases,
        tone: metrics.pendingReleases > 0 ? "warning" : undefined,
      },
      { Icon: CheckCircle2, label: "Releases total", value: metrics.releasesTotal },
    ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">System health</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} {...c} />
        ))}
      </div>

      <Panel title="SLA breaches">
        {breaches.length === 0 ? (
          <Empty>No SLAs currently breached.</Empty>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
              <tr>
                <th className="px-3 py-2">Request</th>
                <th className="px-3 py-2">Cart item</th>
                <th className="px-3 py-2">SLA due</th>
                <th className="px-3 py-2">Overdue</th>
                <th className="px-3 py-2">Next action</th>
              </tr>
            </thead>
            <tbody>
              {breaches.map(({ request, cartItem, overdueMins, nextAction }) => (
                <tr
                  key={request.id}
                  className="border-t border-[color:var(--color-console-border)]"
                >
                  <td className="px-3 py-2 font-mono text-xs">
                    <Link
                      to="/ops/requests/$id"
                      params={{ id: request.id }}
                      className="hover:underline"
                    >
                      {request.id}
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{cartItem?.id ?? "—"}</td>
                  <td className="px-3 py-2 text-xs">
                    {cartItem?.slaDueAt
                      ? formatDateTime(cartItem.slaDueAt)
                      : request.slaDueAt
                        ? formatDateTime(request.slaDueAt)
                        : "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-[color:var(--color-status-critical)]">
                    {Math.round(overdueMins / 60)}h
                  </td>
                  <td className="px-3 py-2 text-xs">{nextAction ?? request.nextAction ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      <Panel title="Coverage gaps and thin supply">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Catchment</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Active providers</th>
              <th className="px-3 py-2">Active products</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Suggested action</th>
            </tr>
          </thead>
          <tbody>
            {supplyGaps.slice(0, 10).map((row) => (
              <tr
                key={`${row.suburb}-${row.category}`}
                className="border-t border-[color:var(--color-console-border)]"
              >
                <td className="px-3 py-2">{row.suburb}</td>
                <td className="px-3 py-2 text-xs">{row.category.replace(/_/g, " ")}</td>
                <td className="px-3 py-2">{row.activeProviders}</td>
                <td className="px-3 py-2">{row.activeServiceProducts}</td>
                <td className="px-3 py-2 capitalize">{row.status}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{row.suggestedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Provider response metrics">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Invited</th>
              <th className="px-3 py-2">Accepted</th>
              <th className="px-3 py-2">Declined</th>
              <th className="px-3 py-2">Expired</th>
              <th className="px-3 py-2">Acceptance</th>
              <th className="px-3 py-2">Fees paid</th>
              <th className="px-3 py-2">Outstanding</th>
              <th className="px-3 py-2">Active products</th>
            </tr>
          </thead>
          <tbody>
            {providerMetrics.map((m) => (
              <tr
                key={m.provider.id}
                className="border-t border-[color:var(--color-console-border)]"
              >
                <td className="px-3 py-2">{m.provider.businessName}</td>
                <td className="px-3 py-2">{m.invited}</td>
                <td className="px-3 py-2">{m.accepted}</td>
                <td className="px-3 py-2">{m.declined}</td>
                <td className="px-3 py-2">{m.expired}</td>
                <td className="px-3 py-2 text-xs">{Math.round(m.acceptanceRate * 100)}%</td>
                <td className="px-3 py-2">{m.feesPaid}</td>
                <td className="px-3 py-2">{m.feesOutstanding}</td>
                <td className="px-3 py-2">{m.activeProducts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <p className="text-xs text-[color:var(--color-console-muted-foreground)]">
        Snapshot at {formatDateTime(now)}
      </p>
    </div>
  );
}

function Card({
  Icon,
  label,
  value,
  tone,
}: {
  Icon: LucideIcon;
  label: string;
  value: number;
  tone?: "warning" | "critical";
}) {
  const toneClass =
    tone === "critical"
      ? "text-[color:var(--color-status-critical)]"
      : tone === "warning"
        ? "text-[color:var(--color-status-warning)]"
        : "";
  return (
    <div className="rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)] p-4">
      <div className="flex items-center gap-2 text-xs text-[color:var(--color-console-muted-foreground)]">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className={"mt-2 text-2xl font-semibold " + toneClass}>{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
      <div className="border-b border-[color:var(--color-console-border)] px-3 py-2 text-sm font-semibold">
        {title}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="p-4 text-sm text-muted-foreground">{children}</div>;
}
