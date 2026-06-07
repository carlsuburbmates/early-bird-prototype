import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";

export const Route = createFileRoute("/for-providers")({
  head: () => ({
    meta: [
      { title: "For providers — LeaseMate" },
      { name: "description", content: "Get pre-qualified end-of-lease jobs delivered to your inbox." },
    ],
  }),
  component: ForProviders,
});

function ForProviders() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">For service providers</h1>
        <p className="mt-3 text-muted-foreground">
          Get pre-qualified end-of-lease jobs in your service area. Accept what fits, decline what doesn't,
          and pay a small introduction fee only when you want the customer's details.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          <li className="rounded-lg border border-border/60 bg-card p-4"><strong>Only matched jobs.</strong> We pre-filter by service area, property size, and capability.</li>
          <li className="rounded-lg border border-border/60 bg-card p-4"><strong>Pay per introduction.</strong> No subscriptions. Pay only when you accept a job.</li>
          <li className="rounded-lg border border-border/60 bg-card p-4"><strong>No bidding wars.</strong> The customer's chosen provider gets priority.</li>
        </ul>
        <div className="mt-8 flex gap-3">
          <Link to="/provider" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Open the provider demo
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Prototype only — real provider signup would happen here.</p>
      </section>
    </MarketingShell>
  );
}