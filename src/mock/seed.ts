/**
 * Initial demo state. Seeded to exercise every workflow state visible in the Ops Center.
 * MIGRATION: replace with DB migrations + production seed scripts.
 */
import type {
  AppState,
  AuditEvent,
  Customer,
  CustomerRelease,
  Exception,
  IntroductionFee,
  MoveRequest,
  Provider,
  ProviderInvitation,
  RequestNote,
  AutomationJob,
  ServiceCategory,
} from "./types";
import { INTRODUCTION_FEES, SLA, addHours, addMinutes, newId, sumRanges } from "./utils";

/** Fixed virtual "now" so the seed is deterministic. */
const NOW = "2026-06-07T09:00:00.000Z";

const SUBURBS = [
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
];

function P(min: number, max: number) {
  return { min, max };
}

function provider(
  id: string,
  businessName: string,
  categories: ServiceCategory[],
  areas: string[],
  pricing: Provider["pricingRanges"],
  rating = 4.6,
): Provider {
  return {
    id,
    businessName,
    categories,
    serviceAreas: areas,
    propertyTypes: ["studio", "1br", "2br", "3br", "4br+"],
    jobSizeRange: P(150, 2500),
    pricingRanges: pricing,
    capabilities: ["Insured", "Police-checked", "Weekend availability"],
    rating,
    responseRateMins: 35,
    status: "active",
    createdAt: "2026-01-10T00:00:00.000Z",
  };
}

const PROVIDERS: Provider[] = [
  provider("prov_north_movers", "Northside Movers", ["removalist"], ["Northcote", "Thornbury", "Brunswick", "Preston", "Coburg"], {
    removalist: P(450, 1200),
  }, 4.8),
  provider("prov_yarra_movers", "Yarra Removals", ["removalist"], ["Richmond", "Collingwood", "Fitzroy", "Carlton", "Hawthorn"], {
    removalist: P(500, 1400),
  }, 4.5),
  provider("prov_bayside_movers", "Bayside Move Co.", ["removalist", "storage"], ["St Kilda", "South Yarra", "Hawthorn"], {
    removalist: P(600, 1500),
    storage: P(120, 380),
  }, 4.4),
  provider("prov_sparkle_clean", "Sparkle End-of-Lease", ["eol_cleaning", "carpet_cleaning"], ["Northcote", "Thornbury", "Brunswick", "Fitzroy"], {
    eol_cleaning: P(280, 650),
    carpet_cleaning: P(120, 280),
  }, 4.9),
  provider("prov_bond_clean", "BondBack Cleaners", ["eol_cleaning"], ["Richmond", "South Yarra", "St Kilda", "Hawthorn"], {
    eol_cleaning: P(320, 700),
  }, 4.7),
  provider("prov_west_clean", "Westside Cleaning Co.", ["eol_cleaning", "carpet_cleaning"], ["Footscray", "Brunswick", "Coburg"], {
    eol_cleaning: P(260, 600),
    carpet_cleaning: P(110, 240),
  }, 4.3),
  provider("prov_carpet_pros", "Carpet Pros Melbourne", ["carpet_cleaning"], SUBURBS, {
    carpet_cleaning: P(130, 320),
  }, 4.6),
  provider("prov_haul_away", "Haul Away Rubbish", ["rubbish_removal"], ["Northcote", "Preston", "Coburg", "Brunswick", "Footscray"], {
    rubbish_removal: P(100, 450),
  }, 4.5),
  provider("prov_quick_skips", "Quick Skip Removals", ["rubbish_removal"], ["Richmond", "Collingwood", "Hawthorn"], {
    rubbish_removal: P(120, 500),
  }, 4.2),
  provider("prov_safestore", "SafeStore Self Storage", ["storage"], ["Brunswick", "Preston", "Coburg"], {
    storage: P(95, 320),
  }, 4.7),
  provider("prov_fix_it", "Fix-It Handyman", ["handyman"], SUBURBS, {
    handyman: P(120, 480),
  }, 4.4),
  provider("prov_connectu", "ConnectU Utilities", ["utilities"], SUBURBS, {
    utilities: P(0, 60),
  }, 4.6),
];

// Additional providers to reach 20+ and to cover scenarios where every
// in-suburb option is exhausted (decline / expire / all-declined paths).
PROVIDERS.push(
  provider("prov_inner_movers", "Inner City Removals", ["removalist"], ["Carlton", "Fitzroy", "Collingwood", "Richmond"], {
    removalist: P(520, 1350),
  }, 4.6),
  provider("prov_west_movers", "Westgate Movers", ["removalist"], ["Footscray", "Brunswick"], {
    removalist: P(420, 1150),
  }, 4.2),
  provider("prov_two_guys", "Two Guys & a Truck", ["removalist", "rubbish_removal"], ["Hawthorn", "South Yarra", "St Kilda", "Richmond"], {
    removalist: P(380, 980),
    rubbish_removal: P(140, 420),
  }, 4.1),
  provider("prov_green_clean", "GreenLeaf Cleaning", ["eol_cleaning", "carpet_cleaning"], ["Preston", "Coburg", "Thornbury"], {
    eol_cleaning: P(290, 640),
    carpet_cleaning: P(125, 260),
  }, 4.5),
  provider("prov_southside_clean", "Southside Bond Cleans", ["eol_cleaning"], ["South Yarra", "St Kilda"], {
    eol_cleaning: P(340, 720),
  }, 4.4),
  provider("prov_steamline", "SteamLine Carpets", ["carpet_cleaning"], ["Footscray", "Brunswick", "Coburg", "Preston"], {
    carpet_cleaning: P(115, 280),
  }, 4.3),
  provider("prov_clear_outs", "ClearOuts Rubbish", ["rubbish_removal"], ["South Yarra", "St Kilda", "Hawthorn"], {
    rubbish_removal: P(130, 480),
  }, 4.0),
  provider("prov_lock_n_store", "Lock-n-Store Self Storage", ["storage"], ["Richmond", "Collingwood", "Hawthorn", "South Yarra"], {
    storage: P(110, 360),
  }, 4.5),
  provider("prov_handy_heroes", "Handy Heroes", ["handyman"], ["Northcote", "Thornbury", "Brunswick", "Fitzroy"], {
    handyman: P(140, 520),
  }, 4.6),
  provider("prov_powerline", "PowerLine Connections", ["utilities"], SUBURBS, {
    utilities: P(0, 80),
  }, 4.3),
);

function customer(id: string, name: string, suburb: string, propertySize: Customer["propertySize"]): Customer {
  return {
    id,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@example.com`,
    phone: "+61 4 0000 0000",
    fromAddress: `12 Example St, ${suburb} VIC`,
    toAddress: undefined,
    moveDate: addHours(NOW, 24 * 14),
    propertySize,
    urgency: "standard",
    budgetSensitivity: "medium",
    recommendationMode: "recommend",
    createdAt: "2026-06-01T00:00:00.000Z",
  };
}

const CUSTOMERS: Customer[] = [
  customer("cust_demo", "Alex Renter", "Northcote", "2br"),
  customer("cust_jamie", "Jamie Lee", "Brunswick", "1br"),
  customer("cust_priya", "Priya Shah", "Richmond", "3br"),
  customer("cust_morgan", "Morgan Tan", "St Kilda", "studio"),
  customer("cust_sam", "Sam Wright", "Footscray", "2br"),
  customer("cust_taylor", "Taylor Brown", "Hawthorn", "3br"),
  customer("cust_robin", "Robin Park", "Fitzroy", "1br"),
  customer("cust_kai", "Kai Nguyen", "Preston", "2br"),
  customer("cust_nina", "Nina Roy", "Coburg", "2br"),
  customer("cust_drew", "Drew Carter", "Collingwood", "1br"),
  customer("cust_yuki", "Yuki Sato", "Carlton", "studio"),
];

function audit(
  entityType: AuditEvent["entityType"],
  entityId: string,
  eventType: string,
  at: string,
  newState?: string,
  notes?: string,
  actor: AuditEvent["actor"] = "system",
): AuditEvent {
  return { id: newId("aud"), entityType, entityId, eventType, at, newState, notes, actor };
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function buildSeed(): AppState {
  const requests: MoveRequest[] = [];
  const invitations: ProviderInvitation[] = [];
  const fees: IntroductionFee[] = [];
  const releases: CustomerRelease[] = [];
  const automations: AutomationJob[] = [];
  const exceptions: Exception[] = [];
  const audits: AuditEvent[] = [];
  const notes: RequestNote[] = [];

  const providerById = Object.fromEntries(PROVIDERS.map((p) => [p.id, p]));

  // Helper to compute package estimate for a set of services using picks
  const est = (svcs: ServiceCategory[], picks: Record<string, string>) =>
    sumRanges(
      svcs.map((s) => {
        const p = providerById[picks[s]];
        return p?.pricingRanges[s] ?? { min: 0, max: 0 };
      }),
    );

  // 1) Happy path: submitted, awaiting first invitation
  {
    const r: MoveRequest = {
      id: "req_001",
      customerId: "cust_jamie",
      services: ["removalist", "eol_cleaning"],
      selectedProviderIds: { removalist: "prov_north_movers", eol_cleaning: "prov_sparkle_clean" },
      packageEstimate: est(["removalist", "eol_cleaning"], {
        removalist: "prov_north_movers",
        eol_cleaning: "prov_sparkle_clean",
      }),
      priority: "normal",
      state: "submitted",
      nextAction: "Send first provider invitation",
      createdAt: addMinutes(NOW, -10),
      slaDueAt: addMinutes(NOW, 5),
    };
    requests.push(r);
    automations.push({
      id: newId("auto"),
      requestId: r.id,
      type: "invite_next_provider",
      scheduledFor: addMinutes(NOW, 1),
      status: "scheduled",
    });
    audits.push(audit("request", r.id, "request.submitted", r.createdAt, "submitted", "Intake submitted by customer", "customer"));
  }

  // 2) Awaiting provider response
  {
    const r: MoveRequest = {
      id: "req_002",
      customerId: "cust_priya",
      services: ["removalist", "eol_cleaning", "carpet_cleaning"],
      selectedProviderIds: {
        removalist: "prov_yarra_movers",
        eol_cleaning: "prov_bond_clean",
        carpet_cleaning: "prov_carpet_pros",
      },
      packageEstimate: est(["removalist", "eol_cleaning", "carpet_cleaning"], {
        removalist: "prov_yarra_movers",
        eol_cleaning: "prov_bond_clean",
        carpet_cleaning: "prov_carpet_pros",
      }),
      priority: "high",
      state: "awaiting_response",
      nextAction: "Reminder due in 18h",
      createdAt: addHours(NOW, -6),
      slaDueAt: addHours(NOW, 18),
    };
    requests.push(r);
    const inv: ProviderInvitation = {
      id: "inv_002a",
      requestId: r.id,
      providerId: "prov_yarra_movers",
      category: "removalist",
      state: "sent",
      sentAt: addHours(NOW, -6),
      reminderCount: 0,
      expiresAt: addHours(NOW, 42),
    };
    invitations.push(inv);
    automations.push({
      id: newId("auto"),
      requestId: r.id,
      invitationId: inv.id,
      type: "send_invite_reminder",
      scheduledFor: addHours(NOW, 18),
      status: "scheduled",
    });
    audits.push(audit("request", r.id, "request.submitted", addHours(NOW, -6), "submitted", "", "customer"));
    audits.push(audit("invitation", inv.id, "invitation.sent", addHours(NOW, -6), "sent"));
  }

  // 3) Accepted, awaiting payment
  {
    const r: MoveRequest = {
      id: "req_003",
      customerId: "cust_morgan",
      services: ["eol_cleaning"],
      selectedProviderIds: { eol_cleaning: "prov_sparkle_clean" },
      packageEstimate: providerById["prov_sparkle_clean"].pricingRanges.eol_cleaning!,
      priority: "normal",
      state: "awaiting_payment",
      nextAction: "Provider must pay introduction fee",
      createdAt: addHours(NOW, -20),
      slaDueAt: addHours(NOW, 4),
    };
    requests.push(r);
    const inv: ProviderInvitation = {
      id: "inv_003a",
      requestId: r.id,
      providerId: "prov_sparkle_clean",
      category: "eol_cleaning",
      state: "accepted",
      sentAt: addHours(NOW, -20),
      respondedAt: addHours(NOW, -8),
      reminderCount: 0,
    };
    invitations.push(inv);
    const fee: IntroductionFee = {
      id: "fee_003a",
      invitationId: inv.id,
      providerId: inv.providerId,
      requestId: r.id,
      category: "eol_cleaning",
      amount: INTRODUCTION_FEES.eol_cleaning,
      currency: "AUD",
      status: "pending",
      dueAt: addHours(NOW, 4),
      reminderCount: 0,
    };
    fees.push(fee);
    automations.push({
      id: newId("auto"),
      requestId: r.id,
      feeId: fee.id,
      type: "send_fee_reminder",
      scheduledFor: addHours(NOW, 4),
      status: "scheduled",
    });
    audits.push(audit("request", r.id, "request.submitted", r.createdAt, "submitted", "", "customer"));
    audits.push(audit("invitation", inv.id, "invitation.sent", r.createdAt, "sent"));
    audits.push(audit("invitation", inv.id, "invitation.accepted", inv.respondedAt!, "accepted", "Provider accepted", "provider"));
    audits.push(audit("fee", fee.id, "fee.created", inv.respondedAt!, "pending"));
  }

  // 4) Details released → completed
  {
    const r: MoveRequest = {
      id: "req_004",
      customerId: "cust_taylor",
      services: ["removalist", "handyman"],
      selectedProviderIds: { removalist: "prov_bayside_movers", handyman: "prov_fix_it" },
      packageEstimate: est(["removalist", "handyman"], { removalist: "prov_bayside_movers", handyman: "prov_fix_it" }),
      priority: "normal",
      state: "completed",
      createdAt: addHours(NOW, -72),
      nextAction: "—",
    };
    requests.push(r);
    const inv: ProviderInvitation = {
      id: "inv_004a",
      requestId: r.id,
      providerId: "prov_bayside_movers",
      category: "removalist",
      state: "accepted",
      sentAt: addHours(NOW, -72),
      respondedAt: addHours(NOW, -70),
      reminderCount: 0,
    };
    invitations.push(inv);
    const fee: IntroductionFee = {
      id: "fee_004a",
      invitationId: inv.id,
      providerId: inv.providerId,
      requestId: r.id,
      category: "removalist",
      amount: INTRODUCTION_FEES.removalist,
      currency: "AUD",
      status: "paid",
      dueAt: addHours(NOW, -46),
      paidAt: addHours(NOW, -68),
      reminderCount: 0,
    };
    fees.push(fee);
    const customerEntity = CUSTOMERS.find((c) => c.id === r.customerId)!;
    releases.push({
      id: "rel_004a",
      requestId: r.id,
      providerId: inv.providerId,
      feeId: fee.id,
      category: "removalist",
      releasedAt: addHours(NOW, -68),
      payload: {
        name: customerEntity.name,
        email: customerEntity.email,
        phone: customerEntity.phone,
        preferredContact: "phone",
        moveDate: customerEntity.moveDate,
        fromAddress: customerEntity.fromAddress,
        toAddress: customerEntity.toAddress,
      },
    });
    audits.push(audit("request", r.id, "request.submitted", r.createdAt, "submitted", "", "customer"));
    audits.push(audit("invitation", inv.id, "invitation.accepted", inv.respondedAt!, "accepted", "", "provider"));
    audits.push(audit("fee", fee.id, "fee.paid", fee.paidAt!, "paid", "Provider paid introduction fee", "provider"));
    audits.push(audit("release", "rel_004a", "release.created", fee.paidAt!, undefined, "Customer details released"));
    audits.push(audit("request", r.id, "request.completed", addHours(NOW, -2), "completed", "Operator marked complete", "operator"));
  }

  // 5) Declined → routed to next provider (still awaiting)
  {
    const r: MoveRequest = {
      id: "req_005",
      customerId: "cust_sam",
      services: ["eol_cleaning"],
      selectedProviderIds: { eol_cleaning: "prov_west_clean" },
      packageEstimate: providerById["prov_west_clean"].pricingRanges.eol_cleaning!,
      priority: "normal",
      state: "awaiting_response",
      nextAction: "Awaiting response from Sparkle End-of-Lease",
      createdAt: addHours(NOW, -30),
      slaDueAt: addHours(NOW, 22),
    };
    requests.push(r);
    const inv1: ProviderInvitation = {
      id: "inv_005a",
      requestId: r.id,
      providerId: "prov_west_clean",
      category: "eol_cleaning",
      state: "declined",
      sentAt: addHours(NOW, -30),
      respondedAt: addHours(NOW, -26),
      reminderCount: 0,
    };
    const inv2: ProviderInvitation = {
      id: "inv_005b",
      requestId: r.id,
      providerId: "prov_sparkle_clean",
      category: "eol_cleaning",
      state: "sent",
      sentAt: addHours(NOW, -2),
      reminderCount: 0,
      expiresAt: addHours(NOW, 46),
    };
    invitations.push(inv1, inv2);
    automations.push({
      id: newId("auto"),
      requestId: r.id,
      invitationId: inv2.id,
      type: "send_invite_reminder",
      scheduledFor: addHours(NOW, 22),
      status: "scheduled",
    });
    audits.push(audit("invitation", inv1.id, "invitation.declined", inv1.respondedAt!, "declined", "Out of service area", "provider"));
    audits.push(audit("invitation", inv2.id, "invitation.sent", inv2.sentAt!, "sent", "Routed to next provider"));
  }

  // 6) Expired → escalated (open exception)
  {
    const r: MoveRequest = {
      id: "req_006",
      customerId: "cust_robin",
      services: ["handyman"],
      selectedProviderIds: { handyman: "prov_fix_it" },
      packageEstimate: providerById["prov_fix_it"].pricingRanges.handyman!,
      priority: "high",
      state: "escalated",
      nextAction: "Operator review",
      createdAt: addHours(NOW, -60),
    };
    requests.push(r);
    const inv: ProviderInvitation = {
      id: "inv_006a",
      requestId: r.id,
      providerId: "prov_fix_it",
      category: "handyman",
      state: "expired",
      sentAt: addHours(NOW, -60),
      reminderCount: 2,
      expiresAt: addHours(NOW, -12),
    };
    invitations.push(inv);
    exceptions.push({
      id: "exc_006",
      requestId: r.id,
      type: "invitation_expired",
      openedAt: addHours(NOW, -12),
      severity: "warning",
      note: "No further providers available in suburb",
    });
    audits.push(audit("invitation", inv.id, "invitation.expired", inv.expiresAt!, "expired"));
    audits.push(audit("exception", "exc_006", "exception.opened", addHours(NOW, -12), undefined, "Escalated"));
  }

  // 7) Payment overdue
  {
    const r: MoveRequest = {
      id: "req_007",
      customerId: "cust_kai",
      services: ["rubbish_removal"],
      selectedProviderIds: { rubbish_removal: "prov_haul_away" },
      packageEstimate: providerById["prov_haul_away"].pricingRanges.rubbish_removal!,
      priority: "high",
      state: "awaiting_payment",
      nextAction: "Fee overdue — chase provider",
      createdAt: addHours(NOW, -48),
      slaDueAt: addHours(NOW, -2),
    };
    requests.push(r);
    const inv: ProviderInvitation = {
      id: "inv_007a",
      requestId: r.id,
      providerId: "prov_haul_away",
      category: "rubbish_removal",
      state: "accepted",
      sentAt: addHours(NOW, -48),
      respondedAt: addHours(NOW, -26),
      reminderCount: 0,
    };
    invitations.push(inv);
    const fee: IntroductionFee = {
      id: "fee_007a",
      invitationId: inv.id,
      providerId: inv.providerId,
      requestId: r.id,
      category: "rubbish_removal",
      amount: INTRODUCTION_FEES.rubbish_removal,
      currency: "AUD",
      status: "overdue",
      dueAt: addHours(NOW, -2),
      reminderCount: 1,
    };
    fees.push(fee);
    exceptions.push({
      id: "exc_007",
      requestId: r.id,
      type: "payment_overdue",
      openedAt: addHours(NOW, -2),
      severity: "critical",
    });
    audits.push(audit("fee", fee.id, "fee.overdue", addHours(NOW, -2), "overdue"));
  }

  // 8) No provider matched (operator-paused)
  {
    const r: MoveRequest = {
      id: "req_008",
      customerId: "cust_demo",
      services: ["storage"],
      selectedProviderIds: {},
      packageEstimate: { min: 0, max: 0 },
      priority: "low",
      state: "matching",
      nextAction: "Paused by operator",
      createdAt: addHours(NOW, -3),
      pausedAt: addHours(NOW, -1),
    };
    requests.push(r);
    exceptions.push({
      id: "exc_008",
      requestId: r.id,
      type: "no_provider_matched",
      openedAt: addHours(NOW, -1),
      severity: "warning",
      note: "No storage providers in customer's preferred suburb",
    });
    notes.push({
      id: newId("note"),
      requestId: r.id,
      at: addHours(NOW, -1),
      author: "operator",
      body: "Reaching out to SafeStore manually about extending coverage.",
    });
  }

  return {
    demo: {
      virtualNow: NOW,
      role: "customer",
      activeProviderId: "prov_sparkle_clean",
      activeCustomerId: "cust_demo",
    },
    customers: CUSTOMERS,
    providers: PROVIDERS,
    requests,
    invitations,
    fees,
    releases,
    automations,
    exceptions,
    audit: audits,
    notes,
  };
}

export function freshSeed(): AppState {
  return buildSeed();
}
