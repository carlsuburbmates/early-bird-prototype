import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { formatDateTime } from "@/mock/utils";

export const Route = createFileRoute("/ops/audit")({
  component: AuditPage,
});

function AuditPage() {
  const audit = useStore((s) => s.audit).slice().sort((a, b) => b.at.localeCompare(a.at));
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Audit log</h1>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr><th className="px-3 py-2">When</th><th className="px-3 py-2">Entity</th><th className="px-3 py-2">Event</th><th className="px-3 py-2">Actor</th><th className="px-3 py-2">Details</th></tr>
          </thead>
          <tbody>
            {audit.slice(0, 200).map((a) => (
              <tr key={a.id} className="border-t border-[color:var(--color-console-border)]">
                <td className="px-3 py-2 text-xs">{formatDateTime(a.at)}</td>
                <td className="px-3 py-2 text-xs">{a.entityType} · <span className="font-mono">{a.entityId.slice(0, 14)}</span></td>
                <td className="px-3 py-2 text-xs">{a.eventType}</td>
                <td className="px-3 py-2 text-xs">{a.actor}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{a.notes ?? (a.newState ? `→ ${a.newState}` : "—")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Showing the most recent 200 events. <Link to="/ops" className="underline">Back to dashboard</Link></p>
    </div>
  );
}