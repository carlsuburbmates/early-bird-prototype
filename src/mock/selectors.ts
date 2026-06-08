/**
 * Pure selectors over AppState. Each takes `(s: AppState)` (or returns a
 * curried version) and produces a derived view. UI code should prefer
 * these over inline filters so business logic stays in one place.
 *
 * MIGRATION: each selector becomes a SQL view / API query.
 */
import type {
  AppState,
  Customer,
  Exception,
  IntroductionFee,
  MoveRequest,
  Provider,
  ProviderInvitation,
} from "./types";

/* ---------- Billing ---------- */

export interface BillingRow {
  fee: IntroductionFee;
  request: MoveRequest | undefined;
  provider: Provider | undefined;
  invitation: ProviderInvitation | undefined;
}

/** Every fee that isn't paid/waived yet, sorted by due date (soonest first). */
export function selectBillingQueue(s: AppState): BillingRow[] {
  return s.fees
    .filter((f) => f.status === "pending" || f.status === "overdue")
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .map((fee) => ({
      fee,
      request: s.requests.find((r) => r.id === fee.requestId),
      provider: s.providers.find((p) => p.id === fee.providerId),
      invitation: s.invitations.find((i) => i.id === fee.invitationId),
    }));
}

export function selectOverdueFees(s: AppState): BillingRow[] {
  return selectBillingQueue(s).filter((r) => r.fee.status === "overdue");
}

/* ---------- Exceptions & blocked requests ---------- */

export function selectUnresolvedExceptions(s: AppState): Exception[] {
  return s.exceptions
    .filter((e) => !e.resolvedAt)
    .sort((a, b) => b.openedAt.localeCompare(a.openedAt));
}

/** Requests that need operator attention: paused, escalated, or with open exceptions. */
export function selectBlockedRequests(s: AppState): MoveRequest[] {
  const exReqIds = new Set(selectUnresolvedExceptions(s).map((e) => e.requestId));
  return s.requests.filter(
    (r) =>
      r.pausedAt ||
      r.state === "escalated" ||
      exReqIds.has(r.id),
  );
}

/* ---------- SLA ---------- */

export interface SlaBreach {
  request: MoveRequest;
  overdueMins: number;
}

export function selectSlaBreaches(s: AppState): SlaBreach[] {
  const nowMs = Date.parse(s.demo.virtualNow);
  return s.requests
    .filter(
      (r) =>
        r.slaDueAt &&
        !["completed", "cancelled"].includes(r.state) &&
        Date.parse(r.slaDueAt) < nowMs,
    )
    .map((r) => ({
      request: r,
      overdueMins: Math.round((nowMs - Date.parse(r.slaDueAt!)) / 60000),
    }))
    .sort((a, b) => b.overdueMins - a.overdueMins);
}

/* ---------- Provider response metrics ---------- */

export interface ProviderMetrics {
  provider: Provider;
  invited: number;
  accepted: number;
  declined: number;
  expired: number;
  acceptanceRate: number; // 0..1
  feesPaid: number;
  feesOutstanding: number;
}

export function selectProviderMetrics(s: AppState): ProviderMetrics[] {
  return s.providers
    .map((provider) => {
      const invs = s.invitations.filter((i) => i.providerId === provider.id);
      const accepted = invs.filter((i) => i.state === "accepted").length;
      const declined = invs.filter((i) => i.state === "declined").length;
      const expired = invs.filter((i) => i.state === "expired").length;
      const decided = accepted + declined + expired;
      const fees = s.fees.filter((f) => f.providerId === provider.id);
      return {
        provider,
        invited: invs.length,
        accepted,
        declined,
        expired,
        acceptanceRate: decided === 0 ? 0 : accepted / decided,
        feesPaid: fees.filter((f) => f.status === "paid").length,
        feesOutstanding: fees.filter((f) => f.status !== "paid" && f.status !== "waived").length,
      };
    })
    .sort((a, b) => b.invited - a.invited);
}

/* ---------- System health ---------- */

export interface HealthMetrics {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  openExceptions: number;
  criticalExceptions: number;
  scheduledJobs: number;
  failedJobs: number;
  overdueFees: number;
  slaBreaches: number;
  providersActive: number;
  providersPaused: number;
  releasesTotal: number;
}

export function selectHealthMetrics(s: AppState): HealthMetrics {
  const openExc = s.exceptions.filter((e) => !e.resolvedAt);
  return {
    totalRequests: s.requests.length,
    activeRequests: s.requests.filter(
      (r) => !["completed", "cancelled"].includes(r.state),
    ).length,
    completedRequests: s.requests.filter((r) => r.state === "completed").length,
    cancelledRequests: s.requests.filter((r) => r.state === "cancelled").length,
    openExceptions: openExc.length,
    criticalExceptions: openExc.filter((e) => e.severity === "critical").length,
    scheduledJobs: s.automations.filter((a) => a.status === "scheduled").length,
    failedJobs: s.automations.filter((a) => a.status === "failed").length,
    overdueFees: s.fees.filter((f) => f.status === "overdue").length,
    slaBreaches: selectSlaBreaches(s).length,
    providersActive: s.providers.filter((p) => p.status === "active").length,
    providersPaused: s.providers.filter((p) => p.status === "paused").length,
    releasesTotal: s.releases.length,
  };
}

/* ---------- Directories ---------- */

export interface CustomerRow {
  customer: Customer;
  requestCount: number;
  latestState?: MoveRequest["state"];
  latestRequestAt?: string;
}

export function selectCustomerList(s: AppState): CustomerRow[] {
  return s.customers
    .map((customer) => {
      const reqs = s.requests
        .filter((r) => r.customerId === customer.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return {
        customer,
        requestCount: reqs.length,
        latestState: reqs[0]?.state,
        latestRequestAt: reqs[0]?.createdAt,
      };
    })
    .sort((a, b) =>
      (b.latestRequestAt ?? "").localeCompare(a.latestRequestAt ?? ""),
    );
}

export function selectProviderList(s: AppState): Provider[] {
  return [...s.providers].sort((a, b) => a.businessName.localeCompare(b.businessName));
}