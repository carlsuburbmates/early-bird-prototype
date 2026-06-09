import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useStore,
  selectRequest,
  selectInvitationsForRequest,
  selectFeesForRequest,
  selectReleasesForRequest,
  selectAutomationsForRequest,
  selectExceptionsForRequest,
  selectAuditForRequest,
  selectCustomer,
  selectNotesForRequest,
} from "@/mock/store";
import {
  StateBadge,
  PriorityBadge,
  InvitationBadge,
  FeeBadge,
  CartItemBadge,
  ReleaseBadge,
} from "@/components/shared/StateBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_LABELS, type Priority } from "@/mock/types";
import { selectCartRoutingRowsForRequest } from "@/mock/selectors";
import { formatDateTime, formatMoney, formatRange, relativeFromNow } from "@/mock/utils";
import { useState } from "react";
import { Pause, Play, X, CheckCircle2, RotateCw, Zap } from "lucide-react";

export const Route = createFileRoute("/ops/requests/$id")({
  component: RequestDetail,
});

function RequestDetail() {
  const { id } = Route.useParams();
  const req = useStore(selectRequest(id));
  const customer = useStore((s) => (req ? selectCustomer(req.customerId)(s) : undefined));
  const providers = useStore((s) => s.providers);
  const routingRows = useStore(selectCartRoutingRowsForRequest(id));
  const invitations = useStore(selectInvitationsForRequest(id));
  const fees = useStore(selectFeesForRequest(id));
  const releases = useStore(selectReleasesForRequest(id));
  const automations = useStore(selectAutomationsForRequest(id));
  const exceptions = useStore(selectExceptionsForRequest(id));
  const audit = useStore(selectAuditForRequest(id));
  const notes = useStore(selectNotesForRequest(id));
  const now = useStore((s) => s.demo.virtualNow);

  const pauseRequest = useStore((s) => s.pauseRequest);
  const resumeRequest = useStore((s) => s.resumeRequest);
  const cancelRequest = useStore((s) => s.cancelRequest);
  const markCompleted = useStore((s) => s.markRequestCompleted);
  const reopen = useStore((s) => s.reopenRequest);
  const setPriority = useStore((s) => s.setPriority);
  const resolveException = useStore((s) => s.resolveException);
  const addNote = useStore((s) => s.addNote);
  const pay = useStore((s) => s.payIntroductionFee);
  const respond = useStore((s) => s.providerRespond);
  const runJob = useStore((s) => s.runJobNow);

  const [note, setNote] = useState("");

  if (!req) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Request not found.{" "}
        <Link to="/ops/requests" className="underline">
          Back to requests
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/ops/requests" className="text-xs text-muted-foreground hover:underline">
          ← Requests
        </Link>
        <h1 className="font-mono text-lg">{req.id}</h1>
        <StateBadge state={req.state} />
        <PriorityBadge priority={req.priority} />
        {req.pausedAt && (
          <span className="rounded bg-[color:var(--color-status-warning)]/15 px-2 py-0.5 text-xs text-[color:var(--color-status-warning)]">
            Paused
          </span>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          {req.pausedAt ? (
            <Button size="sm" variant="outline" onClick={() => resumeRequest(req.id)}>
              <Play className="mr-1 h-3 w-3" />
              Resume
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => pauseRequest(req.id)}>
              <Pause className="mr-1 h-3 w-3" />
              Pause
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => markCompleted(req.id)}>
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Complete
          </Button>
          {(req.state === "completed" || req.state === "cancelled") && (
            <Button size="sm" variant="outline" onClick={() => reopen(req.id)}>
              <RotateCw className="mr-1 h-3 w-3" />
              Reopen
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => cancelRequest(req.id)}>
            <X className="mr-1 h-3 w-3" />
            Cancel
          </Button>
        </div>
      </div>

      <Panel title="Cart Routing Matrix">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-console-muted)]/40 text-left text-xs uppercase text-[color:var(--color-console-muted-foreground)]">
            <tr>
              <th className="px-3 py-2">Service</th>
              <th className="px-3 py-2">Cart Item</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Position</th>
              <th className="px-3 py-2">Invitation</th>
              <th className="px-3 py-2">Billing</th>
              <th className="px-3 py-2">Release</th>
              <th className="px-3 py-2">Exception</th>
              <th className="px-3 py-2">SLA</th>
              <th className="px-3 py-2">Next Action</th>
            </tr>
          </thead>
          <tbody>
            {routingRows.map((row) => (
              <tr
                key={row.cartItem.id}
                className="border-t border-[color:var(--color-console-border)] align-top"
              >
                <td className="px-3 py-2 text-xs">{SERVICE_LABELS[row.cartItem.category]}</td>
                <td className="px-3 py-2">
                  <div className="font-mono text-xs">{row.cartItem.id}</div>
                  <CartItemBadge state={row.cartItem.state} />
                </td>
                <td className="px-3 py-2 text-xs">
                  <div className="font-medium">{row.serviceProduct?.title ?? "—"}</div>
                  <div className="text-muted-foreground">
                    {row.serviceProduct ? formatRange(row.serviceProduct.estimatedRange) : ""}
                  </div>
                </td>
                <td className="px-3 py-2 text-xs">{row.provider?.businessName ?? "—"}</td>
                <td className="px-3 py-2 text-xs capitalize">{row.position}</td>
                <td className="px-3 py-2">
                  {row.invitation ? (
                    <InvitationBadge state={row.invitation.state} />
                  ) : (
                    <span className="text-xs text-muted-foreground">Not sent</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {row.billing ? (
                    <FeeBadge status={row.billing.status} />
                  ) : (
                    <span className="text-xs text-muted-foreground">No fee</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <ReleaseBadge
                    state={
                      row.release?.releaseState ??
                      (row.billing?.status === "paid"
                        ? "ready_to_release"
                        : row.billing
                          ? "payment_pending"
                          : "not_ready")
                    }
                  />
                </td>
                <td className="px-3 py-2 text-xs">
                  {row.exception
                    ? `${row.exception.severity}: ${row.exception.type.replace(/_/g, " ")}`
                    : "—"}
                </td>
                <td className="px-3 py-2 text-xs">
                  {row.slaDueAt ? relativeFromNow(row.slaDueAt, now) : "—"}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{row.nextAction ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: Customer + summary */}
        <div className="space-y-4">
          <Panel title="Customer">
            {customer ? (
              <div className="space-y-1 p-3 text-sm">
                <div className="font-medium">{customer.name}</div>
                <div className="text-xs text-muted-foreground">{customer.email}</div>
                <div className="text-xs text-muted-foreground">{customer.phone}</div>
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">From: </span>
                  {customer.fromAddress}
                </div>
                {customer.toAddress && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">To: </span>
                    {customer.toAddress}
                  </div>
                )}
                <div className="text-xs">
                  <span className="text-muted-foreground">Move date: </span>
                  {formatDateTime(customer.moveDate)}
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Property: </span>
                  {customer.propertySize.toUpperCase()} · {customer.urgency} ·{" "}
                  {customer.budgetSensitivity}
                </div>
              </div>
            ) : (
              <div className="p-3 text-sm text-muted-foreground">No customer record.</div>
            )}
          </Panel>

          <Panel title="Services & estimate">
            <div className="space-y-2 p-3 text-sm">
              <div>{req.services.map((s) => SERVICE_LABELS[s]).join(", ")}</div>
              <div className="text-xs text-muted-foreground">
                Package estimate:{" "}
                <span className="font-medium text-foreground">
                  {formatRange(req.packageEstimate)}
                </span>
              </div>
            </div>
          </Panel>

          <Panel title="Priority">
            <div className="p-3">
              <Select
                value={req.priority}
                onValueChange={(v) => setPriority(req.id, v as Priority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["low", "normal", "high", "critical"] as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Panel>

          {exceptions.length > 0 && (
            <Panel title={`Exceptions (${exceptions.filter((e) => !e.resolvedAt).length} open)`}>
              <ul className="divide-y divide-[color:var(--color-console-border)]">
                {exceptions.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                    <div>
                      <div className="font-medium">{e.type.replace(/_/g, " ")}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.note ?? "—"} · opened {relativeFromNow(e.openedAt, now)}
                      </div>
                    </div>
                    {e.resolvedAt ? (
                      <span className="text-xs text-[color:var(--color-status-success)]">
                        resolved
                      </span>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => resolveException(e.id)}>
                        Resolve
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        {/* Middle: Invitations / fees / releases */}
        <div className="space-y-4">
          <Panel title={`Invitations (${invitations.length})`}>
            {invitations.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No invitations yet.</div>
            ) : (
              <ul className="divide-y divide-[color:var(--color-console-border)]">
                {invitations.map((inv) => {
                  const p = providers.find((pp) => pp.id === inv.providerId);
                  return (
                    <li key={inv.id} className="space-y-1 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{p?.businessName}</span>
                        <InvitationBadge state={inv.state} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {SERVICE_LABELS[inv.category]} ·{" "}
                        {inv.sentAt && `sent ${relativeFromNow(inv.sentAt, now)}`}
                      </div>
                      {inv.state === "sent" && (
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => respond(inv.id, "accepted")}
                          >
                            Record provider accepted
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => respond(inv.id, "declined")}
                          >
                            Record provider declined
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title={`Introduction fees (${fees.length})`}>
            {fees.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No fees yet.</div>
            ) : (
              <ul className="divide-y divide-[color:var(--color-console-border)]">
                {fees.map((f) => (
                  <li key={f.id} className="space-y-1 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>
                        {SERVICE_LABELS[f.category]} · {formatMoney(f.amount)}
                      </span>
                      <FeeBadge status={f.status} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due {formatDateTime(f.dueAt)}
                      {f.paidAt ? ` · paid ${formatDateTime(f.paidAt)}` : ""}
                    </div>
                    {f.status !== "paid" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1"
                        onClick={() => pay(f.id)}
                      >
                        Confirm payment received
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {releases.length > 0 && (
            <Panel title={`Customer releases (${releases.length})`}>
              <ul className="divide-y divide-[color:var(--color-console-border)]">
                {releases.map((r) => (
                  <li key={r.id} className="p-3 text-sm">
                    <div className="font-medium">
                      Released to {providers.find((p) => p.id === r.providerId)?.businessName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {SERVICE_LABELS[r.category]} · {formatDateTime(r.releasedAt)}
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        {/* Right: Timeline / Notes */}
        <div className="space-y-4">
          <Panel title="Automations">
            {automations.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No jobs.</div>
            ) : (
              <ul className="divide-y divide-[color:var(--color-console-border)]">
                {automations.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 p-3 text-sm">
                    <div>
                      <div className="font-medium">{automationLabel(a.type)}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.status} · scheduled {formatDateTime(a.scheduledFor)}
                      </div>
                      {a.lastResult && (
                        <div className="text-xs text-muted-foreground">↳ {a.lastResult}</div>
                      )}
                    </div>
                    {a.status === "scheduled" && (
                      <Button size="sm" variant="ghost" onClick={() => runJob(a.id)}>
                        <Zap className="h-3 w-3" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={`Timeline (${audit.length})`}>
            <ul className="max-h-[400px] divide-y divide-[color:var(--color-console-border)] overflow-y-auto">
              {audit.map((a) => (
                <li key={a.id} className="p-3 text-sm">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium">{a.eventType}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(a.at)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {a.actor}
                    {a.newState ? ` → ${a.newState}` : ""}
                    {a.notes ? ` · ${a.notes}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title={`Notes (${notes.length})`}>
            <div className="space-y-2 p-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded border border-[color:var(--color-console-border)] bg-[color:var(--color-console-muted)]/30 p-2 text-xs"
                >
                  <div className="text-muted-foreground">
                    {n.author} · {formatDateTime(n.at)}
                  </div>
                  <div className="mt-1">{n.body}</div>
                </div>
              ))}
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an operator note…"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (note.trim()) {
                    addNote(req.id, note.trim());
                    setNote("");
                  }
                }}
              >
                Add note
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-console-border)] bg-[color:var(--color-console-surface)]">
      <div className="border-b border-[color:var(--color-console-border)] px-3 py-2 text-sm font-semibold">
        {title}
      </div>
      {children}
    </div>
  );
}

function automationLabel(type: string) {
  const labels: Record<string, string> = {
    invite_next_provider: "invite preferred or backup provider",
    invite_preferred_provider: "invite preferred provider",
    send_invite_reminder: "send provider reminder",
    expire_invitation: "expire invitation",
    invite_backup_provider: "invite backup provider",
    send_fee_reminder: "mark payment overdue",
    mark_payment_overdue: "mark payment overdue",
    escalate_no_provider: "escalate cart item",
    escalate_cart_item: "escalate cart item",
    customer_update_required: "customer update required",
    expire_fee: "expire fee",
  };
  return labels[type] ?? type.replace(/_/g, " ");
}
