import { cn } from "@/lib/utils";
import { REQUEST_STATE_LABELS, type RequestState } from "@/mock/types";

const STATE_TONE: Record<RequestState, string> = {
  submitted: "bg-[color:var(--color-status-info)]/15 text-[color:var(--color-status-info)]",
  matching: "bg-[color:var(--color-status-info)]/15 text-[color:var(--color-status-info)]",
  provider_invited:
    "bg-[color:var(--color-status-progress)]/15 text-[color:var(--color-status-progress)]",
  awaiting_response:
    "bg-[color:var(--color-status-progress)]/15 text-[color:var(--color-status-progress)]",
  accepted: "bg-[color:var(--color-status-success)]/15 text-[color:var(--color-status-success)]",
  awaiting_payment:
    "bg-[color:var(--color-status-warning)]/15 text-[color:var(--color-status-warning)]",
  details_released:
    "bg-[color:var(--color-status-success)]/15 text-[color:var(--color-status-success)]",
  completed: "bg-[color:var(--color-status-success)]/20 text-[color:var(--color-status-success)]",
  declined: "bg-[color:var(--color-status-neutral)]/15 text-[color:var(--color-status-neutral)]",
  expired: "bg-[color:var(--color-status-neutral)]/15 text-[color:var(--color-status-neutral)]",
  escalated: "bg-[color:var(--color-status-critical)]/15 text-[color:var(--color-status-critical)]",
  cancelled: "bg-[color:var(--color-status-neutral)]/15 text-[color:var(--color-status-neutral)]",
};

export function StateBadge({ state, className }: { state: RequestState; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        STATE_TONE[state],
        className,
      )}
    >
      {REQUEST_STATE_LABELS[state]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: "low" | "normal" | "high" | "critical" }) {
  const tone =
    priority === "critical"
      ? "bg-[color:var(--color-status-critical)]/15 text-[color:var(--color-status-critical)]"
      : priority === "high"
        ? "bg-[color:var(--color-status-warning)]/20 text-[color:var(--color-status-warning)]"
        : priority === "normal"
          ? "bg-muted text-muted-foreground"
          : "bg-muted/50 text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        tone,
      )}
    >
      {priority}
    </span>
  );
}

export function FeeBadge({ status }: { status: "pending" | "paid" | "overdue" | "waived" }) {
  const tone =
    status === "paid"
      ? "bg-[color:var(--color-status-success)]/15 text-[color:var(--color-status-success)]"
      : status === "overdue"
        ? "bg-[color:var(--color-status-critical)]/15 text-[color:var(--color-status-critical)]"
        : "bg-[color:var(--color-status-warning)]/15 text-[color:var(--color-status-warning)]";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        tone,
      )}
    >
      {status}
    </span>
  );
}

export function InvitationBadge({
  state,
}: {
  state: "not_sent" | "sent" | "viewed" | "accepted" | "declined" | "expired";
}) {
  const tone: Record<string, string> = {
    not_sent: "bg-muted text-muted-foreground",
    sent: "bg-[color:var(--color-status-info)]/15 text-[color:var(--color-status-info)]",
    viewed: "bg-[color:var(--color-status-info)]/15 text-[color:var(--color-status-info)]",
    accepted: "bg-[color:var(--color-status-success)]/15 text-[color:var(--color-status-success)]",
    declined: "bg-[color:var(--color-status-neutral)]/15 text-[color:var(--color-status-neutral)]",
    expired: "bg-[color:var(--color-status-warning)]/15 text-[color:var(--color-status-warning)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        tone[state],
      )}
    >
      {state.replace("_", " ")}
    </span>
  );
}

export function CartItemBadge({ state }: { state: import("@/mock/types").CartItemState }) {
  const tone: Record<string, string> = {
    not_started: "bg-muted text-muted-foreground",
    preferred_invited:
      "bg-[color:var(--color-status-info)]/15 text-[color:var(--color-status-info)]",
    preferred_declined:
      "bg-[color:var(--color-status-warning)]/15 text-[color:var(--color-status-warning)]",
    preferred_expired:
      "bg-[color:var(--color-status-warning)]/15 text-[color:var(--color-status-warning)]",
    backup_invited:
      "bg-[color:var(--color-status-progress)]/15 text-[color:var(--color-status-progress)]",
    accepted: "bg-[color:var(--color-status-success)]/15 text-[color:var(--color-status-success)]",
    payment_pending:
      "bg-[color:var(--color-status-warning)]/15 text-[color:var(--color-status-warning)]",
    paid: "bg-[color:var(--color-status-success)]/15 text-[color:var(--color-status-success)]",
    released: "bg-[color:var(--color-status-success)]/20 text-[color:var(--color-status-success)]",
    completed: "bg-[color:var(--color-status-success)]/20 text-[color:var(--color-status-success)]",
    unresolved:
      "bg-[color:var(--color-status-critical)]/15 text-[color:var(--color-status-critical)]",
    escalated:
      "bg-[color:var(--color-status-critical)]/15 text-[color:var(--color-status-critical)]",
    cancelled: "bg-[color:var(--color-status-neutral)]/15 text-[color:var(--color-status-neutral)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        tone[state],
      )}
    >
      {state.replace(/_/g, " ")}
    </span>
  );
}

export function ReleaseBadge({ state }: { state: import("@/mock/types").CustomerReleaseState }) {
  const tone: Record<string, string> = {
    not_ready: "bg-muted text-muted-foreground",
    payment_pending:
      "bg-[color:var(--color-status-warning)]/15 text-[color:var(--color-status-warning)]",
    ready_to_release:
      "bg-[color:var(--color-status-info)]/15 text-[color:var(--color-status-info)]",
    released: "bg-[color:var(--color-status-success)]/15 text-[color:var(--color-status-success)]",
    blocked: "bg-[color:var(--color-status-critical)]/15 text-[color:var(--color-status-critical)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        tone[state],
      )}
    >
      {state.replace(/_/g, " ")}
    </span>
  );
}
