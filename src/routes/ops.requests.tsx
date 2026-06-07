import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { StateBadge, PriorityBadge } from "@/components/shared/StateBadge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SERVICE_LABELS } from "@/mock/types";
import { relativeFromNow } from "@/mock/utils";

export const Route = createFileRoute("/ops/requests")({
  component: Requests,
});

function Requests() {
  const requests = useStore((s) => s.requests);
  const customers = useStore((s) => s.customers);
  const now = useStore((s) => s.demo.virtualNow);
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("active");

  const filtered = requests.filter((r) => {
    if (stateFilter === "active" && ["completed", "cancelled"].includes(r.state)) return false;
    if (stateFilter === "closed" && !["completed", "cancelled"].includes(r.state)) return false;
    if (q) {
      const c = customers.find((cc) => cc.id === r.customerId);
      const hay = [r.id, c?.name, c?.fromAddress, ...r.services.map((s) => SERVICE_LABELS[s])].join(" ").toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">Requests</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-md border border-[color:var(--color-console-border)] text-xs">
            {[["active", "Active"], ["closed", "Closed"], ["all", "All"]].map(([v, l]) => (
              <button key={v} onClick={() => setStateFilter(v)}
                className={"px-3 py-1.5 " + (stateFilter === v ? "bg-[color:var(--color-sidebar)] text-white" : "bg-[color:var(--color-console-surface)] hover:bg-[color:var(--color-console-muted)]")}>
                {l}
              </button>
            ))}
          </div>
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="h-8 w-56" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Services</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">SLA</th>
              <th className="px-3 py-2">Next action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const c = customers.find((cc) => cc.id === r.customerId);
              return (
                <tr key={r.id} className="border-t border-[color:var(--color-console-border)] hover:bg-[color:var(--color-console-muted)]/30">
                  <td className="px-3 py-2 font-mono text-xs"><Link to="/ops/requests/$id" params={{ id: r.id }} className="hover:underline">{r.id}</Link></td>
                  <td className="px-3 py-2">{c?.name ?? "—"}<div className="text-xs text-muted-foreground">{c?.fromAddress.split(",")[1]?.trim()}</div></td>
                  <td className="px-3 py-2 text-xs">{r.services.map((s) => SERVICE_LABELS[s]).join(", ")}</td>
                  <td className="px-3 py-2"><StateBadge state={r.state} /></td>
                  <td className="px-3 py-2"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-3 py-2 text-xs">{r.slaDueAt ? relativeFromNow(r.slaDueAt, now) : "—"}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{r.nextAction ?? "—"}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-sm text-muted-foreground">No matching requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}