/**
 * LeaseMate — Entity types.
 *
 * MIGRATION: These types mirror the eventual backend schema (PRD §29).
 * Keep field names stable so they map 1:1 to future DB columns / API DTOs.
 */

export type ID = string;

export type ServiceCategory =
  | "removalist"
  | "eol_cleaning"
  | "carpet_cleaning"
  | "rubbish_removal"
  | "storage"
  | "handyman"
  | "utilities";

export const SERVICE_LABELS: Record<ServiceCategory, string> = {
  removalist: "Removalists",
  eol_cleaning: "End-of-lease cleaning",
  carpet_cleaning: "Carpet cleaning",
  rubbish_removal: "Rubbish removal",
  storage: "Storage",
  handyman: "Handyman",
  utilities: "Utility connection",
};

export const SERVICE_BLURBS: Record<ServiceCategory, string> = {
  removalist: "Move your belongings without doing the heavy lifting.",
  eol_cleaning: "Bond-back end-of-lease cleans done to inspection standard.",
  carpet_cleaning: "Professional steam cleaning for carpets and rugs.",
  rubbish_removal: "Same-day pickup of unwanted furniture and clutter.",
  storage: "Short and long-term storage between moves.",
  handyman: "Patch, paint, and fix to pass the final inspection.",
  utilities: "Connect or disconnect power, gas, and internet.",
};

export type PropertySize = "studio" | "1br" | "2br" | "3br" | "4br+";
export type Urgency = "flexible" | "standard" | "urgent";
export type BudgetSensitivity = "low" | "medium" | "high";
export type RecommendationMode = "recommend" | "manual";

export type RoutingPosition = "preferred" | "backup";

export type ProductStatus = "active" | "paused";

export interface ServiceProduct {
  id: ID;
  providerId: ID;
  category: ServiceCategory;
  title: string;
  description: string;
  serviceAreas: string[];
  propertyTypes: PropertySize[];
  pickupCatchments?: string[];
  destinationCatchments?: string[];
  includedServices: string[];
  excludedServices: string[];
  addOns: string[];
  estimatedRange: PriceRange;
  status: ProductStatus;
}

export type CartItemState =
  | "not_started"
  | "preferred_invited"
  | "preferred_declined"
  | "preferred_expired"
  | "backup_invited"
  | "accepted"
  | "payment_pending"
  | "paid"
  | "released"
  | "completed"
  | "unresolved"
  | "escalated"
  | "cancelled";

export type CustomerReleaseState =
  | "not_ready"
  | "payment_pending"
  | "ready_to_release"
  | "released"
  | "blocked";

export interface CartItem {
  id: ID;
  requestId: ID;
  category: ServiceCategory;
  preferredServiceProductId: ID;
  backupServiceProductId?: ID;
  activeServiceProductId?: ID;
  preferredProviderId: ID;
  backupProviderId?: ID;
  positionInProgress?: RoutingPosition;
  state: CartItemState;
  estimatedRange: PriceRange;
  nextAction?: string;
  slaDueAt?: string;
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  fromAddress: string;
  toAddress?: string;
  moveDate: string; // ISO
  propertySize: PropertySize;
  urgency: Urgency;
  budgetSensitivity: BudgetSensitivity;
  recommendationMode: RecommendationMode;
  notes?: string;
  createdAt: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface Provider {
  id: ID;
  businessName: string;
  categories: ServiceCategory[];
  serviceAreas: string[];
  propertyTypes: PropertySize[];
  jobSizeRange: PriceRange;
  pricingRanges: Partial<Record<ServiceCategory, PriceRange>>;
  capabilities: string[];
  rating: number;
  responseRateMins: number;
  status: "active" | "paused";
  createdAt: string;
}

export type RequestState =
  | "submitted"
  | "matching"
  | "provider_invited"
  | "awaiting_response"
  | "accepted"
  | "awaiting_payment"
  | "details_released"
  | "completed"
  | "declined"
  | "expired"
  | "escalated"
  | "cancelled";

export const REQUEST_STATE_LABELS: Record<RequestState, string> = {
  submitted: "Submitted",
  matching: "Matching providers",
  provider_invited: "Provider invited",
  awaiting_response: "Awaiting response",
  accepted: "Accepted",
  awaiting_payment: "Awaiting payment",
  details_released: "Details released",
  completed: "Completed",
  declined: "Declined",
  expired: "Expired",
  escalated: "Escalated",
  cancelled: "Cancelled",
};

export type Priority = "low" | "normal" | "high" | "critical";

export interface MoveRequest {
  id: ID;
  customerId: ID;
  services: ServiceCategory[];
  selectedProviderIds: Partial<Record<ServiceCategory, ID>>;
  packageEstimate: PriceRange;
  priority: Priority;
  state: RequestState;
  nextAction?: string;
  slaDueAt?: string;
  pausedAt?: string;
  createdAt: string;
}

export type InvitationState = "not_sent" | "sent" | "viewed" | "accepted" | "declined" | "expired";

export interface ProviderInvitation {
  id: ID;
  requestId: ID;
  providerId: ID;
  category: ServiceCategory;
  cartItemId?: ID;
  serviceProductId?: ID;
  position?: RoutingPosition;
  state: InvitationState;
  sentAt?: string;
  respondedAt?: string;
  reminderCount: number;
  expiresAt?: string;
}

export type FeeStatus = "pending" | "paid" | "overdue" | "waived";

export interface IntroductionFee {
  id: ID;
  invitationId: ID;
  providerId: ID;
  requestId: ID;
  category: ServiceCategory;
  cartItemId?: ID;
  serviceProductId?: ID;
  position?: RoutingPosition;
  amount: number;
  currency: "AUD";
  status: FeeStatus;
  dueAt: string;
  paidAt?: string;
  reminderCount: number;
}

export interface CustomerRelease {
  id: ID;
  requestId: ID;
  providerId: ID;
  feeId: ID;
  category: ServiceCategory;
  cartItemId?: ID;
  serviceProductId?: ID;
  releaseState?: CustomerReleaseState;
  releasedAt: string;
  payload: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
    preferredContact: "email" | "phone";
    moveDate: string;
    fromAddress: string;
    toAddress?: string;
  };
}

export type AutomationType =
  | "invite_next_provider"
  | "send_invite_reminder"
  | "expire_invitation"
  | "escalate_no_provider"
  | "send_fee_reminder"
  | "expire_fee"
  | "invite_preferred_provider"
  | "invite_backup_provider"
  | "mark_payment_overdue"
  | "escalate_cart_item"
  | "customer_update_required";

export interface AutomationJob {
  id: ID;
  requestId: ID;
  invitationId?: ID;
  feeId?: ID;
  cartItemId?: ID;
  serviceProductId?: ID;
  type: AutomationType;
  scheduledFor: string;
  status: "scheduled" | "running" | "done" | "completed" | "failed" | "paused" | "cancelled";
  lastRunAt?: string;
  lastResult?: string;
}

export type ExceptionType =
  | "no_provider_matched"
  | "all_providers_declined"
  | "invitation_expired"
  | "payment_overdue"
  | "manual_flag";

export interface Exception {
  id: ID;
  requestId: ID;
  type: ExceptionType;
  cartItemId?: ID;
  serviceProductId?: ID;
  openedAt: string;
  resolvedAt?: string;
  note?: string;
  severity: "info" | "warning" | "critical";
}

export interface AuditEvent {
  id: ID;
  entityType:
    | "request"
    | "invitation"
    | "fee"
    | "provider"
    | "customer"
    | "exception"
    | "release"
    | "cart_item"
    | "service_product";
  entityId: ID;
  eventType: string;
  actor: "system" | "operator" | "customer" | "provider";
  at: string;
  previousState?: string;
  newState?: string;
  notes?: string;
}

export interface RequestNote {
  id: ID;
  requestId: ID;
  at: string;
  author: "operator" | "system";
  body: string;
}

export type DemoRole = "customer" | "provider" | "operator";

export interface DemoState {
  virtualNow: string;
  role: DemoRole;
  activeProviderId: ID | null;
  activeCustomerId: ID | null;
}

export interface AppState {
  demo: DemoState;
  customers: Customer[];
  providers: Provider[];
  serviceProducts: ServiceProduct[];
  requests: MoveRequest[];
  cartItems: CartItem[];
  invitations: ProviderInvitation[];
  fees: IntroductionFee[];
  releases: CustomerRelease[];
  automations: AutomationJob[];
  exceptions: Exception[];
  audit: AuditEvent[];
  notes: RequestNote[];
}

export const MELBOURNE_SUBURBS = [
  "Northcote",
  "Thornbury",
  "Brunswick",
  "Preston",
  "Fitzroy",
  "Carlton",
  "Richmond",
  "South Yarra",
  "St Kilda",
  "Footscray",
  "Coburg",
  "Collingwood",
  "Hawthorn",
] as const;
