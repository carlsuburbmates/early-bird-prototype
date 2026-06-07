import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { Button } from "@/components/ui/button";
import { relativeFromNow } from "@/mock/utils";

export const Route = createFileRoute("/ops/exceptions")({
  component: ExceptionsPage,
});

function ExceptionsPage() {
  const exceptions = useStore((s) => s.exceptions);
  const now = useStore((s) => s.demo.virtualNow);
  const resolve = useStore((s) => s.resolveException);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Exceptions</h1>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr><th className="px-3 py-2">Request</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Severity</th><th className="px-3 py-2">Opened</th><th className="px-3 py-2">Status</th><th /></tr>
          </thead>
          <tbody>
            {exceptions.map((e) => (
              <tr key={e.id} className="border-t border-[color:var(--color-console-border)]">
                <td className="px-3 py-2 font-mono text-xs"><Link to="/ops/requests/$id" params={{ id: e.requestId }} className="hover:underline">{e.requestId}</Link></td>
                <td className="px-3 py-2">{e.type.replace(/_/g, " ")}</td>
                <td className="px-3 py-2 capitalize">{e.severity}</td>
                <td className="px-3 py-2 text-xs">{relativeFromNow(e.openedAt, now)}</td>
                <td className="px-3 py-2 text-xs">{e.resolvedAt ? `Resolved ${relativeFromNow(e.resolvedAt, now)}` : "Open"}</td>
                <td className="px-3 py-2">{!e.resolvedAt && <Button size="sm" variant="outline" onClick={() => resolve(e.id)}>Resolve</Button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}