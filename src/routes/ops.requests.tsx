import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/mock/store";
import { StateBadge, PriorityBadge } from "@/components/shared/StateBadge";
import { Input } from "@/components/ui/input";
import { SERVICE_LABELS } from "@/mock/types";
import { relativeFromNow } from "@/mock/utils";

export const Route = createFileRoute("/ops/requests")({
  component: Requests,
});

function summarize(values: string[]) {
  const clean = values.filter(Boolean);
  return clean.length ? [...new Set(clean)].join(" / ") : "—";
}

function Requests() {
  const requests = useStore((s) => s.requests);
  const customers = useStore((s) => s.customers);
  const cartItems = useStore((s) => s.cartItems);
  const invitations = useStore((s) => s.invitations);
  const fees = useStore((s) => s.fees);
  const releases = useStore((s) => s.releases);
  const exceptions = useStore((s) => s.exceptions);
  const now = useStore((s) => s.demo.virtualNow);
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("active");

  const filtered = requests.filter((r) => {
    const items = cartItems.filter((item) => item.requestId === r.id);
    if (stateFilter === "active" && ["completed", "cancelled"].includes(r.state)) return false;
    if (stateFilter === "closed" && !["completed", "cancelled"].includes(r.state)) return false;
    if (q) {
      const c = customers.find((cc) => cc.id === r.customerId);
      const hay = [
        r.id,
        c?.name,
        c?.fromAddress,
        ...items.map((item) => SERVICE_LABELS[item.category]),
        ...items.map((item) => item.id),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">Submitted Move-Out Carts</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-md border border-[color:var(--color-console-border)] text-xs">
            {[
              ["active", "Active"],
              ["closed", "Closed"],
              ["all", "All"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setStateFilter(v)}
                className={
                  "px-3 py-1.5 " +
                  (stateFilter === v
                    ? "bg-[color:var(--color-sidebar)] text-white"
                    : "bg-[color:var(--color-console-surface)] hover:bg-[color:var(--color-console-muted)]")
                }
              >
                {l}
              </button>
            ))}
          </div>
          <Input
            placeholder="Search carts…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-8 w-56"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Cart</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Routing</th>
              <th className="px-3 py-2">Billing</th>
              <th className="px-3 py-2">Release</th>
              <th className="px-3 py-2">Exception</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">SLA</th>
              <th className="px-3 py-2">Next action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const c = customers.find((cc) => cc.id === r.customerId);
              const items = cartItems.filter((item) => item.requestId === r.id);
              const requestInvitations = invitations.filter((inv) => inv.requestId === r.id);
              const requestFees = fees.filter((fee) => fee.requestId === r.id);
              const requestReleases = releases.filter((rel) => rel.requestId === r.id);
              const requestExceptions = exceptions.filter(
                (ex) => ex.requestId === r.id && !ex.resolvedAt,
              );
              const nextItem = items.find((item) => item.nextAction)?.nextAction;
              return (
                <tr
                  key={r.id}
                  className="border-t border-[color:var(--color-console-border)] hover:bg-[color:var(--color-console-muted)]/30"
                >
                  <td className="px-3 py-2 font-mono text-xs">
                    <Link to="/ops/requests/$id" params={{ id: r.id }} className="hover:underline">
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    {c?.name ?? "—"}
                    <div className="text-xs text-muted-foreground">
                      {c?.fromAddress.split(",")[1]?.trim()}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <div className="font-medium">{items.length} cart items</div>
                    <div className="text-muted-foreground">
                      {items.map((item) => SERVICE_LABELS[item.category]).join(", ")}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {summarize(items.map((item) => item.state.replace(/_/g, " ")))}
                    <div className="text-muted-foreground">
                      {requestInvitations.length} invites ·{" "}
                      {requestInvitations.filter((inv) => inv.position === "backup").length} backup
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {requestFees.length === 0
                      ? "No fees"
                      : summarize(requestFees.map((fee) => fee.status))}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {requestReleases.length}/
                    {requestFees.filter((fee) => fee.status === "paid").length} released
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {requestExceptions.length
                      ? summarize(requestExceptions.map((ex) => ex.severity))
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <StateBadge state={r.state} />
                  </td>
                  <td className="px-3 py-2">
                    <PriorityBadge priority={r.priority} />
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {r.slaDueAt ? relativeFromNow(r.slaDueAt, now) : "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {nextItem ?? r.nextAction ?? "—"}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No matching Move-Out Carts.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
