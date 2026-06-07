import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/mock/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvitationBadge, FeeBadge } from "@/components/shared/StateBadge";
import { formatDate, formatDateTime, formatMoney, formatRange, relativeFromNow } from "@/mock/utils";
import { SERVICE_LABELS } from "@/mock/types";
import { Lock, MailCheck, Mail, Phone, MapPin, CalendarDays, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/provider")({
  head: () => ({ meta: [{ title: "Provider dashboard — LeaseMate" }] }),
  component: ProviderDashboard,
});

function ProviderDashboard() {
  const providers = useStore((s) => s.providers);
  const activeId = useStore((s) => s.demo.activeProviderId);
  const setActive = useStore((s) => s.setActiveProvider);
  const invitations = useStore((s) => s.invitations);
  const fees = useStore((s) => s.fees);
  const releases = useStore((s) => s.releases);
  const requests = useStore((s) => s.requests);
  const customers = useStore((s) => s.customers);
  const now = useStore((s) => s.demo.virtualNow);

  const provider = providers.find((p) => p.id === activeId) ?? providers[0];

  const myInvites = useMemo(
    () => invitations.filter((i) => i.providerId === provider?.id),
    [invitations, provider],
  );
  const opportunities = myInvites.filter((i) => i.state === "sent" || i.state === "viewed");
  const acceptedAwaitingFee = myInvites.filter((i) => i.state === "accepted").map((i) => {
    const fee = fees.find((f) => f.invitationId === i.id && f.status !== "paid");
    return { inv: i, fee };
  }).filter((x) => x.fee);
  const released = releases.filter((r) => r.providerId === provider?.id);
  const declined = myInvites.filter((i) => i.state === "declined" || i.state === "expired");

  const respond = useStore((s) => s.providerRespond);
  const pay = useStore((s) => s.payIntroductionFee);

  if (!provider) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{provider.businessName}</h1>
          <p className="text-sm text-muted-foreground">
            {provider.categories.map((c) => SERVICE_LABELS[c]).join(" · ")} · ★ {provider.rating.toFixed(1)}
          </p>
        </div>
        <div className="w-64">
          <Select value={provider.id} onValueChange={setActive}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {providers.map((p) => <SelectItem key={p.id} value={p.id}>{p.businessName}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="mt-1 text-[10px] text-muted-foreground">Switch demo provider</p>
        </div>
      </div>

      <Section title="Opportunities" count={opportunities.length} subtitle="New jobs matched to you. Accept to receive customer details.">
        {opportunities.length === 0 ? <Empty>No new opportunities right now.</Empty> : opportunities.map((inv) => {
          const req = requests.find((r) => r.id === inv.requestId);
          const customer = customers.find((c) => c.id === req?.customerId);
          if (!req || !customer) return null;
          return (
            <Card key={inv.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{SERVICE_LABELS[inv.category]}</span>
                    <InvitationBadge state={inv.state} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {customer.fromAddress.split(",")[1]?.trim() ?? "Melbourne"}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatDate(customer.moveDate)}</span>
                    <span>{customer.propertySize.toUpperCase()}</span>
                    {inv.expiresAt && <span>Expires {relativeFromNow(inv.expiresAt, now)}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => respond(inv.id, "declined")}>Decline</Button>
                  <Button size="sm" onClick={() => respond(inv.id, "accepted")}>Accept</Button>
                </div>
              </div>
              <div className="mt-3 rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <Lock className="mr-1 inline h-3 w-3" /> Customer name and contact details unlock after you accept and pay the introduction fee.
              </div>
            </Card>
          );
        })}
      </Section>

      <Section title="Payment required" count={acceptedAwaitingFee.length} subtitle="Pay the introduction fee to receive customer contact details.">
        {acceptedAwaitingFee.length === 0 ? <Empty>No payments due.</Empty> : acceptedAwaitingFee.map(({ inv, fee }) => {
          if (!fee) return null;
          return (
            <Card key={fee.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{SERVICE_LABELS[inv.category]}</span>
                    <FeeBadge status={fee.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Introduction fee {formatMoney(fee.amount)} · due {formatDateTime(fee.dueAt)}
                  </p>
                </div>
                <Button size="sm" onClick={() => pay(fee.id)}>Pay {formatMoney(fee.amount)} (mock)</Button>
              </div>
            </Card>
          );
        })}
      </Section>

      <Section title="Released customers" count={released.length} subtitle="Customers you've been introduced to.">
        {released.length === 0 ? <Empty>No releases yet.</Empty> : released.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--color-status-success)]" />
                  <span className="font-semibold">{r.payload.name}</span>
                  <span className="text-xs text-muted-foreground">· {SERVICE_LABELS[r.category]}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {r.payload.email}</span>
                  <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {r.payload.phone}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.payload.fromAddress}</span>
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatDate(r.payload.moveDate)}</span>
                </div>
                {r.payload.notes && <p className="text-xs text-muted-foreground">Notes: {r.payload.notes}</p>}
              </div>
              <span className="text-xs text-muted-foreground">Released {relativeFromNow(r.releasedAt, now)}</span>
            </div>
          </Card>
        ))}
      </Section>

      {declined.length > 0 && (
        <Section title="Past invitations" count={declined.length}>
          {declined.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between rounded-md border border-border/60 bg-card p-3 text-sm">
              <span>{SERVICE_LABELS[inv.category]}</span>
              <InvitationBadge state={inv.state} />
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, count, subtitle, children }: { title: string; count?: number; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{title} {count !== undefined && <span className="text-sm font-normal text-muted-foreground">· {count}</span>}</h2>
      </div>
      {subtitle && <p className="mb-3 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{children}</div>;
}