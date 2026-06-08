import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { useStore, selectRequest } from "@/mock/store";
import { StateBadge } from "@/components/shared/StateBadge";
import { CheckCircle2 } from "lucide-react";
import { isDemoMode } from "@/mock/demo";

export const Route = createFileRoute("/submitted/$id")({
  head: () => ({ meta: [{ title: "Request submitted — LeaseMate" }] }),
  component: Submitted,
});

function Submitted() {
  const { id } = Route.useParams();
  const req = useStore(selectRequest(id));

  return (
    <MarketingShell>
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[color:var(--color-status-success)]" />
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Your request is in.</h1>
        <p className="mt-2 text-muted-foreground">
          We're inviting providers now. You'll hear back as soon as one accepts.
        </p>

        {req && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border/60 bg-card p-5 text-left">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{req.id}</span>
              <StateBadge state={req.state} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{req.nextAction}</p>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/request/$id" params={{ id }}
            className="rounded-full border border-border bg-card px-5 py-2 text-sm hover:bg-accent">
            View request status
          </Link>
          <Link to="/" className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90">
            Back to home
          </Link>
        </div>

        {isDemoMode() && (
          <div className="mt-6 text-xs text-muted-foreground">
            <Link to="/ops/requests/$id" params={{ id }} className="underline">
              Demo: open in operator view
            </Link>
          </div>
        )}
      </section>
    </MarketingShell>
  );
}