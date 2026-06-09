import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";

export const Route = createFileRoute("/provider-signup")({
  head: () => ({
    meta: [
      { title: "Provider signup — LeaseMate" },
      { name: "description", content: "Prototype-only provider signup information for LeaseMate." },
    ],
  }),
  component: ProviderSignupPage,
});

function ProviderSignupPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Provider signup</h1>
        <p className="mt-3 text-muted-foreground">
          This local prototype does not collect real provider applications. Review the provider
          proposition, then open the demo dashboard to inspect the mocked acceptance and
          introduction-fee flow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/for-providers"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            View provider overview
          </Link>
          <Link
            to="/provider"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open provider demo
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Demo only — real signup, auth, verification, email, SMS, and payments are intentionally
          not connected.
        </p>
      </section>
    </MarketingShell>
  );
}
