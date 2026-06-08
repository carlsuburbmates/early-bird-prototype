import { Link } from "@tanstack/react-router";
import { useStore, selectRequest, selectAuditForRequest } from "@/mock/store";
import { StateBadge } from "@/components/shared/StateBadge";
import { SERVICE_LABELS, type RequestState } from "@/mock/types";
import { formatDateTime, formatRange, relativeFromNow } from "@/mock/utils";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { isDemoMode } from "@/mock/demo";

/** High-level customer-facing milestones. The Ops audit log stays the source
 *  of truth — this is a simplified view. */
const MILESTONES: { state: RequestState; label: string }[] = [
  { state: "submitted", label: "Request received" },
  { state: "awaiting_response", label: "Providers invited" },
  { state: "awaiting_payment", label: "Provider accepted" },
  { state: "details_released", label: "Introduced to provider" },
  { state: "completed", label: "Job complete" },
];

const STATE_RANK: Record<RequestState, number> = {
  submitted: 0,
  matching: 0,
  provider_invited: 1,
  awaiting_response: 1,
  accepted: 2,
  awaiting_payment: 2,
  details_released: 3,
  completed: 4,
  declined: 1,
  expired: 1,
  escalated: 1,
  cancelled: 0,
};

function nextExpected(state: RequestState): string {
  switch (state) {
    case "submitted":
    case "matching":
      return "We'll invite a matched provider in the next few minutes.";
    case "provider_invited":
    case "awaiting_response":
      return "Waiting for the provider to accept your job.";
    case "accepted":
    case "awaiting_payment":
      return "Provider is confirming. You'll be introduced once they confirm.";
    case "details_released":
      return "Your provider has your details and will be in touch shortly.";
    case "completed":
      return "All done. Hope the move went smoothly.";
    case "declined":
    case "expired":
      return "We're routing your request to another provider.";
    case "escalated":
      return "Our team is taking a closer look at your request.";
    case "cancelled":
      return "This request has been cancelled.";
  }
}

export function RequestStatus({ id }: { id: string }) {
  const request = useStore(selectRequest(id));
  const audit = useStore(selectAuditForRequest(id));
  const now = useStore((s) => s.demo.virtualNow);

  if (!request) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Request not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">Check the link or start a new request.</p>
        <Link to="/intake" className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">
          Start a new request
        </Link>
      </div>
    );
  }

  const reached = STATE_RANK[request.state];
  const customerAudit = audit.filter((a) =>
    [
      "request.submitted",
      "invitation.sent",
      "invitation.accepted",
      "release.created",
      "request.completed",
      "request.cancelled",
    ].includes(a.eventType),
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{request.id}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Move request</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Submitted {relativeFromNow(request.createdAt, now)}
            </p>
          </div>
          <StateBadge state={request.state} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Services">{request.services.map((s) => SERVICE_LABELS[s]).join(" · ")}</Stat>
          <Stat label="Package estimate">{formatRange(request.packageEstimate)}</Stat>
          <Stat label="Next step">{nextExpected(request.state)}</Stat>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <h2 className="text-lg font-semibold">Progress</h2>
        <ol className="mt-4 space-y-3">
          {MILESTONES.map((m, i) => {
            const done = i <= reached && !["cancelled"].includes(request.state);
            const current = i === reached && !["completed", "cancelled"].includes(request.state);
            return (
              <li key={m.state} className="flex items-start gap-3 text-sm">
                {done && !current ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--color-status-success)]" />
                ) : current ? (
                  <Clock className="mt-0.5 h-4 w-4 text-[color:var(--color-status-progress)]" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <div className={done || current ? "font-medium" : "text-muted-foreground"}>{m.label}</div>
                  {current && (
                    <div className="text-xs text-muted-foreground">{request.nextAction ?? "In progress"}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {customerAudit.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {customerAudit.map((a) => (
              <li key={a.id} className="flex justify-between gap-3 border-b border-border/40 pb-2 last:border-0">
                <span>{a.eventType.replace(/[._]/g, " ")}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(a.at)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-full border border-border bg-card px-5 py-2 text-sm hover:bg-accent">
          Back to home
        </Link>
        {isDemoMode() && (
          <Link
            to="/ops/requests/$id"
            params={{ id }}
            className="rounded-full border border-dashed border-border bg-background px-5 py-2 text-xs text-muted-foreground hover:bg-accent"
          >
            Demo: open in operator view
          </Link>
        )}
      </div>
    </section>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}