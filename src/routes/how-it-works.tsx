import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — LeaseMate" },
      { name: "description", content: "How LeaseMate matches Melbourne renters with vetted move-related providers." },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { n: 1, title: "Tell us about your move", body: "One short intake: dates, suburb, property size, services you need." },
  { n: 2, title: "We match providers", body: "We invite eligible providers in your area. They accept or decline." },
  { n: 3, title: "Provider confirms", body: "The accepting provider pays a small introduction fee to receive your details." },
  { n: 4, title: "They contact you directly", body: "You deal with the provider as you normally would — we just made the match." },
];

function HowItWorks() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">How LeaseMate works</h1>
        <p className="mt-2 text-muted-foreground">From intake to introduction — without you sending a single email.</p>
        <ol className="mt-10 space-y-6">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4 rounded-xl border border-border/60 bg-card p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{s.n}</div>
              <div>
                <h2 className="font-semibold">{s.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Link to="/intake" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Start your move
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}