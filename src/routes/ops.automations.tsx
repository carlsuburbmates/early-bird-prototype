import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/mock/utils";

export const Route = createFileRoute("/ops/automations")({
  component: AutomationsPage,
});

function AutomationsPage() {
  const automations = useStore((s) => s.automations);
  const runJob = useStore((s) => s.runJobNow);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Automation jobs</h1>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr><th className="px-3 py-2">Type</th><th className="px-3 py-2">Request</th><th className="px-3 py-2">Scheduled</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Last result</th><th /></tr>
          </thead>
          <tbody>
            {automations.slice().sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)).map((a) => (
              <tr key={a.id} className="border-t border-[color:var(--color-console-border)]">
                <td className="px-3 py-2">{a.type.replace(/_/g, " ")}</td>
                <td className="px-3 py-2 font-mono text-xs"><Link to="/ops/requests/$id" params={{ id: a.requestId }} className="hover:underline">{a.requestId}</Link></td>
                <td className="px-3 py-2 text-xs">{formatDateTime(a.scheduledFor)}</td>
                <td className="px-3 py-2 text-xs capitalize">{a.status}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{a.lastResult ?? "—"}</td>
                <td className="px-3 py-2">{a.status === "scheduled" && <Button size="sm" variant="outline" onClick={() => runJob(a.id)}>Run now</Button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}