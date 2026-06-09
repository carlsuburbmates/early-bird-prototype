/**
 * Pure selectors over AppState. Each takes `(s: AppState)` (or returns a
 * curried version) and produces a derived view. UI code should prefer
 * these over inline filters so business logic stays in one place.
 *
 * MIGRATION: each selector becomes a SQL view / API query.
 */
import type {
  AppState,
  CartItem,
  Customer,
  CustomerRelease,
  Exception,
  IntroductionFee,
  MoveRequest,
  Provider,
  ProviderInvitation,
  ServiceCategory,
  ServiceProduct,
} from "./types";
import { MELBOURNE_SUBURBS, SERVICE_LABELS } from "./types";

export function selectCartItemsForRequest(requestId: string) {
  return (s: AppState): CartItem[] => s.cartItems.filter((item) => item.requestId === requestId);
}

export interface CartRoutingRow {
  request: MoveRequest | undefined;
  cartItem: CartItem;
  serviceProduct: ServiceProduct | undefined;
  provider: Provider | undefined;
  position: "preferred" | "backup" | "—";
  invitation: ProviderInvitation | undefined;
  billing: IntroductionFee | undefined;
  release: CustomerRelease | undefined;
  exception: Exception | undefined;
  slaDueAt?: string;
  nextAction?: string;
}

export function selectCartRoutingRowsForRequest(requestId: string) {
  return (s: AppState): CartRoutingRow[] =>
    s.cartItems
      .filter((item) => item.requestId === requestId)
      .map((cartItem) => {
        const invitation =
          s.invitations.find(
            (inv) =>
              inv.cartItemId === cartItem.id && ["sent", "viewed", "accepted"].includes(inv.state),
          ) ?? s.invitations.filter((inv) => inv.cartItemId === cartItem.id).at(-1);
        const billing = s.fees.find((fee) => fee.cartItemId === cartItem.id);
        const release = s.releases.find((rel) => rel.cartItemId === cartItem.id);
        const exception = s.exceptions.find(
          (ex) => ex.cartItemId === cartItem.id && !ex.resolvedAt,
        );
        const productId =
          invitation?.serviceProductId ??
          billing?.serviceProductId ??
          release?.serviceProductId ??
          cartItem.activeServiceProductId ??
          cartItem.preferredServiceProductId;
        const serviceProduct = s.serviceProducts.find((product) => product.id === productId);
        const providerId =
          invitation?.providerId ?? serviceProduct?.providerId ?? cartItem.preferredProviderId;
        return {
          request: s.requests.find((request) => request.id === cartItem.requestId),
          cartItem,
          serviceProduct,
          provider: s.providers.find((provider) => provider.id === providerId),
          position: invitation?.position ?? cartItem.positionInProgress ?? "—",
          invitation,
          billing,
          release,
          exception,
          slaDueAt: cartItem.slaDueAt,
          nextAction: cartItem.nextAction,
        };
      });
}

export interface ProviderQueueRow {
  invitation: ProviderInvitation;
  request: MoveRequest | undefined;
  cartItem: CartItem | undefined;
  serviceProduct: ServiceProduct | undefined;
  provider: Provider | undefined;
  fee: IntroductionFee | undefined;
  responseAgeMins: number | undefined;
  nextAction: string;
}

export function selectProviderQueue(s: AppState): ProviderQueueRow[] {
  const nowMs = Date.parse(s.demo.virtualNow);
  return s.invitations
    .filter((inv) => ["sent", "viewed", "accepted"].includes(inv.state))
    .map((invitation) => {
      const cartItem = s.cartItems.find((item) => item.id === invitation.cartItemId);
      const fee = s.fees.find((f) => f.invitationId === invitation.id);
      return {
        invitation,
        request: s.requests.find((request) => request.id === invitation.requestId),
        cartItem,
        serviceProduct: s.serviceProducts.find(
          (product) => product.id === invitation.serviceProductId,
        ),
        provider: s.providers.find((provider) => provider.id === invitation.providerId),
        fee,
        responseAgeMins: invitation.sentAt
          ? Math.max(0, Math.round((nowMs - Date.parse(invitation.sentAt)) / 60000))
          : undefined,
        nextAction:
          invitation.state === "accepted" && !fee
            ? "Create intro fee"
            : invitation.state === "accepted" && fee?.status !== "paid"
              ? "Confirm payment received"
              : "Await provider response",
      };
    })
    .sort((a, b) => (a.invitation.expiresAt ?? "").localeCompare(b.invitation.expiresAt ?? ""));
}

/* ---------- Billing ---------- */

export interface BillingRow {
  fee: IntroductionFee;
  request: MoveRequest | undefined;
  provider: Provider | undefined;
  invitation: ProviderInvitation | undefined;
  cartItem: CartItem | undefined;
  serviceProduct: ServiceProduct | undefined;
  release: CustomerRelease | undefined;
  nextAction: string;
}

/** Every fee that isn't paid/waived yet, sorted by due date (soonest first). */
export function selectBillingQueue(s: AppState): BillingRow[] {
  return s.fees
    .filter((f) => f.status === "pending" || f.status === "overdue")
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .map((fee) => {
      const release = s.releases.find((rel) => rel.feeId === fee.id);
      return {
        fee,
        request: s.requests.find((r) => r.id === fee.requestId),
        provider: s.providers.find((p) => p.id === fee.providerId),
        invitation: s.invitations.find((i) => i.id === fee.invitationId),
        cartItem: s.cartItems.find((item) => item.id === fee.cartItemId),
        serviceProduct: s.serviceProducts.find((product) => product.id === fee.serviceProductId),
        release,
        nextAction: release ? "Released" : "Confirm payment received",
      };
    });
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
  return s.requests.filter((r) => r.pausedAt || r.state === "escalated" || exReqIds.has(r.id));
}

/* ---------- SLA ---------- */

export interface SlaBreach {
  request: MoveRequest;
  cartItem?: CartItem;
  overdueMins: number;
  nextAction?: string;
}

export function selectSlaBreaches(s: AppState): SlaBreach[] {
  const nowMs = Date.parse(s.demo.virtualNow);
  const requestBreaches = s.requests
    .filter(
      (r) =>
        r.slaDueAt &&
        !["completed", "cancelled"].includes(r.state) &&
        Date.parse(r.slaDueAt) < nowMs,
    )
    .map((r) => ({
      request: r,
      overdueMins: Math.round((nowMs - Date.parse(r.slaDueAt!)) / 60000),
      nextAction: r.nextAction,
    }));

  const cartItemBreaches = s.cartItems
    .filter(
      (item) =>
        item.slaDueAt &&
        !["completed", "cancelled", "released"].includes(item.state) &&
        Date.parse(item.slaDueAt) < nowMs,
    )
    .map((cartItem) => ({
      request: s.requests.find((request) => request.id === cartItem.requestId)!,
      cartItem,
      overdueMins: Math.round((nowMs - Date.parse(cartItem.slaDueAt!)) / 60000),
      nextAction: cartItem.nextAction,
    }))
    .filter((row) => row.request);

  return [...cartItemBreaches, ...requestBreaches].sort((a, b) => b.overdueMins - a.overdueMins);
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
  activeProducts: number;
  pausedProducts: number;
  categories: ServiceCategory[];
  serviceAreas: string[];
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
      const products = s.serviceProducts.filter((product) => product.providerId === provider.id);
      return {
        provider,
        invited: invs.length,
        accepted,
        declined,
        expired,
        acceptanceRate: decided === 0 ? 0 : accepted / decided,
        feesPaid: fees.filter((f) => f.status === "paid").length,
        feesOutstanding: fees.filter((f) => f.status !== "paid" && f.status !== "waived").length,
        activeProducts: products.filter((product) => product.status === "active").length,
        pausedProducts: products.filter((product) => product.status === "paused").length,
        categories: [...new Set(products.map((product) => product.category))],
        serviceAreas: [...new Set(products.flatMap((product) => product.serviceAreas))],
      };
    })
    .sort((a, b) => b.invited - a.invited);
}

export function selectServiceProductsByProvider(providerId: string) {
  return (s: AppState): ServiceProduct[] =>
    s.serviceProducts.filter((product) => product.providerId === providerId);
}

export interface CoverageRow {
  suburb: string;
  category: ServiceCategory;
  activeProviders: number;
  activeServiceProducts: number;
  status: "healthy" | "thin" | "gap";
  suggestedAction: string;
}

export function selectCoverageByArea(s: AppState): CoverageRow[] {
  const requestedCategories = [...new Set(s.cartItems.map((item) => item.category))];
  return MELBOURNE_SUBURBS.flatMap((suburb) =>
    requestedCategories.map((category) => {
      const products = s.serviceProducts.filter(
        (product) =>
          product.category === category &&
          product.status === "active" &&
          (product.serviceAreas.includes(suburb) || product.pickupCatchments?.includes(suburb)),
      );
      const activeProviders = new Set(products.map((product) => product.providerId)).size;
      const status = activeProviders >= 2 ? "healthy" : activeProviders === 1 ? "thin" : "gap";
      return {
        suburb,
        category,
        activeProviders,
        activeServiceProducts: products.length,
        status,
        suggestedAction:
          status === "healthy"
            ? "Monitor"
            : status === "thin"
              ? "Recruit backup product"
              : `Add ${SERVICE_LABELS[category].toLowerCase()} supply`,
      };
    }),
  );
}

export function selectSupplyGaps(s: AppState): CoverageRow[] {
  return selectCoverageByArea(s).filter((row) => row.status === "gap" || row.status === "thin");
}

/* ---------- System health ---------- */

export interface HealthMetrics {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  activeCartItems: number;
  blockedCartItems: number;
  activeServiceProducts: number;
  pausedServiceProducts: number;
  coverageGaps: number;
  pendingReleases: number;
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
    activeRequests: s.requests.filter((r) => !["completed", "cancelled"].includes(r.state)).length,
    completedRequests: s.requests.filter((r) => r.state === "completed").length,
    cancelledRequests: s.requests.filter((r) => r.state === "cancelled").length,
    activeCartItems: s.cartItems.filter((item) => !["completed", "cancelled"].includes(item.state))
      .length,
    blockedCartItems: s.cartItems.filter((item) => ["unresolved", "escalated"].includes(item.state))
      .length,
    activeServiceProducts: s.serviceProducts.filter((product) => product.status === "active")
      .length,
    pausedServiceProducts: s.serviceProducts.filter((product) => product.status === "paused")
      .length,
    coverageGaps: selectSupplyGaps(s).filter((row) => row.status === "gap").length,
    pendingReleases: s.fees.filter(
      (fee) => fee.status === "paid" && !s.releases.some((release) => release.feeId === fee.id),
    ).length,
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
    .sort((a, b) => (b.latestRequestAt ?? "").localeCompare(a.latestRequestAt ?? ""));
}

export function selectProviderList(s: AppState): Provider[] {
  return [...s.providers].sort((a, b) => a.businessName.localeCompare(b.businessName));
}
