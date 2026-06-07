import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { SERVICE_BLURBS, SERVICE_LABELS, type ServiceCategory } from "@/mock/types";
import { ArrowRight, ShieldCheck, Sparkles, Workflow } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeaseMate — Coordinated end-of-lease moves in Melbourne" },
      { name: "description", content: "One intake to line up movers, end-of-lease cleaners, carpet cleaners, storage, and more." },
      { property: "og:title", content: "LeaseMate" },
      { property: "og:description", content: "One intake to line up movers, end-of-lease cleaners, and more." },
    ],
  }),
  component: Index,
});

function Index() {
  const services: ServiceCategory[] = [
    "removalist",
    "eol_cleaning",
    "carpet_cleaning",
    "rubbish_removal",
    "storage",
    "handyman",
  ];
  return (
    <MarketingShell>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Melbourne prototype
        </span>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          One form. Your whole end-of-lease move, sorted.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Tell us about your move once. LeaseMate matches movers, cleaners, carpet,
          rubbish and storage — and only introduces providers who can actually do the job.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/intake"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start your move <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent"
          >
            See how it works
          </Link>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:grid-cols-3">
          {[
            { Icon: Workflow, title: "One intake", body: "Tell us about your move once. We coordinate the rest." },
            { Icon: ShieldCheck, title: "Vetted providers", body: "Insured, police-checked services across Melbourne." },
            { Icon: Sparkles, title: "No noise", body: "Only matched providers see your details — after they accept." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border/60 bg-background p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-medium">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Services we coordinate</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick any combination during your intake.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s} className="rounded-xl border border-border/60 bg-card p-5">
              <div className="text-sm font-semibold">{SERVICE_LABELS[s]}</div>
              <p className="mt-1 text-sm text-muted-foreground">{SERVICE_BLURBS[s]}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
  );
}
