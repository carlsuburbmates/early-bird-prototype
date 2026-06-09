import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { selectProviderMetrics, selectSupplyGaps } from "@/mock/selectors";
import { SERVICE_LABELS } from "@/mock/types";

export const Route = createFileRoute("/ops/providers")({
  component: ProvidersPage,
});

function ProvidersPage() {
  const providerMetrics = useStore(selectProviderMetrics);
  const supplyGaps = useStore(selectSupplyGaps);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Provider Supply</h1>
        <p className="text-xs text-muted-foreground">
          Directory and coverage intelligence for provider-listed service products.
        </p>
      </div>

      <Panel title="Provider supply and performance">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Categories</th>
              <th className="px-3 py-2">Active products</th>
              <th className="px-3 py-2">Paused products</th>
              <th className="px-3 py-2">Service areas / catchments</th>
              <th className="px-3 py-2">Acceptance rate</th>
              <th className="px-3 py-2">Outstanding fees</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {providerMetrics.map((m) => (
              <tr
                key={m.provider.id}
                className="border-t border-[color:var(--color-console-border)]"
              >
                <td className="px-3 py-2">{m.provider.businessName}</td>
                <td className="px-3 py-2 text-xs">
                  {m.categories.map((c) => SERVICE_LABELS[c]).join(", ")}
                </td>
                <td className="px-3 py-2">{m.activeProducts}</td>
                <td className="px-3 py-2">{m.pausedProducts}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {m.serviceAreas.slice(0, 5).join(", ")}
                  {m.serviceAreas.length > 5 ? "…" : ""}
                </td>
                <td className="px-3 py-2 text-xs">{Math.round(m.acceptanceRate * 100)}%</td>
                <td className="px-3 py-2">{m.feesOutstanding}</td>
                <td className="px-3 py-2 capitalize">{m.provider.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Coverage / supply watchlist">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Suburb / catchment</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Active providers</th>
              <th className="px-3 py-2">Active service products</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Suggested action</th>
            </tr>
          </thead>
          <tbody>
            {supplyGaps.slice(0, 12).map((row) => (
              <tr
                key={`${row.suburb}-${row.category}`}
                className="border-t border-[color:var(--color-console-border)]"
              >
                <td className="px-3 py-2">{row.suburb}</td>
                <td className="px-3 py-2 text-xs">{SERVICE_LABELS[row.category]}</td>
                <td className="px-3 py-2">{row.activeProviders}</td>
                <td className="px-3 py-2">{row.activeServiceProducts}</td>
                <td className="px-3 py-2 capitalize">{row.status}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{row.suggestedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
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
