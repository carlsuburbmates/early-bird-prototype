import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { SERVICE_BLURBS, SERVICE_LABELS, type ServiceCategory } from "@/mock/types";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — LeaseMate" },
      { name: "description", content: "Services LeaseMate coordinates for end-of-lease moves." },
    ],
  }),
  component: Services,
});

const ALL: ServiceCategory[] = [
  "removalist",
  "eol_cleaning",
  "carpet_cleaning",
  "rubbish_removal",
  "storage",
  "handyman",
  "utilities",
];

function Services() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Services we coordinate</h1>
        <p className="mt-2 text-muted-foreground">Pick any combination during your intake — we'll find the right providers.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {ALL.map((s) => (
            <div key={s} className="rounded-xl border border-border/60 bg-card p-5">
              <div className="text-base font-semibold">{SERVICE_LABELS[s]}</div>
              <p className="mt-1 text-sm text-muted-foreground">{SERVICE_BLURBS[s]}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/intake" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Start your intake
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}