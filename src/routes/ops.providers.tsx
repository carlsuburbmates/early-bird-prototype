import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { SERVICE_LABELS } from "@/mock/types";

export const Route = createFileRoute("/ops/providers")({
  component: ProvidersPage,
});

function ProvidersPage() {
  const providers = useStore((s) => s.providers);
  const invitations = useStore((s) => s.invitations);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Providers</h1>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Business</th>
              <th className="px-3 py-2">Categories</th>
              <th className="px-3 py-2">Suburbs</th>
              <th className="px-3 py-2">Rating</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Active invites</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => {
              const active = invitations.filter((i) => i.providerId === p.id && (i.state === "sent" || i.state === "accepted")).length;
              return (
                <tr key={p.id} className="border-t border-[color:var(--color-console-border)]">
                  <td className="px-3 py-2">{p.businessName}</td>
                  <td className="px-3 py-2 text-xs">{p.categories.map((c) => SERVICE_LABELS[c]).join(", ")}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{p.serviceAreas.slice(0, 4).join(", ")}{p.serviceAreas.length > 4 ? "…" : ""}</td>
                  <td className="px-3 py-2">★ {p.rating.toFixed(1)}</td>
                  <td className="px-3 py-2 capitalize">{p.status}</td>
                  <td className="px-3 py-2">{active}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}