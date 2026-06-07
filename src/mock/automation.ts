/**
 * Workflow / state-transition engine.
 *
 * MIGRATION: This file is the in-browser stand-in for the future backend
 * cron/queue worker. Each automation type maps to a worker job. The real
 * implementation should run server-side, write to Postgres in transactions,
 * and send real notifications. The shape of `runDueAutomations` (pure
 * `(state, now) => state`) is intentionally easy to port.
 */
import type {
  AppState,
  AuditEvent,
  AutomationJob,
  CustomerRelease,
  Exception,
  IntroductionFee,
  MoveRequest,
  ProviderInvitation,
  ServiceCategory,
} from "./types";
import { INTRODUCTION_FEES, SLA, addMinutes, isDue, newId } from "./utils";

function audit(
  patch: Partial<AuditEvent> & Pick<AuditEvent, "entityType" | "entityId" | "eventType" | "at">,
): AuditEvent {
  return {
    id: newId("aud"),
    actor: "system",
    ...patch,
  } as AuditEvent;
}

/** Find providers eligible for a category that haven't already been invited on this request. */
function nextEligibleProvider(state: AppState, req: MoveRequest, category: ServiceCategory) {
  const alreadyInvited = new Set(
    state.invitations
      .filter((i) => i.requestId === req.id && i.category === category)
      .map((i) => i.providerId),
  );
  const customer = state.customers.find((c) => c.id === req.customerId);
  const suburb = customer?.fromAddress.split(",")[1]?.trim().split(" ")[0];
  return state.providers.find(
    (p) =>
      p.status === "active" &&
      p.categories.includes(category) &&
      !alreadyInvited.has(p.id) &&
      (suburb ? p.serviceAreas.some((a) => customer!.fromAddress.includes(a)) : true),
  );
}

function updateRequest(state: AppState, id: string, patch: Partial<MoveRequest>): MoveRequest[] {
  return state.requests.map((r) => (r.id === id ? { ...r, ...patch } : r));
}

function updateInvitation(
  state: AppState,
  id: string,
  patch: Partial<ProviderInvitation>,
): ProviderInvitation[] {
  return state.invitations.map((i) => (i.id === id ? { ...i, ...patch } : i));
}

function updateFee(state: AppState, id: string, patch: Partial<IntroductionFee>): IntroductionFee[] {
  return state.fees.map((f) => (f.id === id ? { ...f, ...patch } : f));
}

/** Execute a single automation job. Returns new state. */
export function executeJob(state: AppState, job: AutomationJob): AppState {
  const now = state.demo.virtualNow;
  const req = state.requests.find((r) => r.id === job.requestId);
  if (!req || req.pausedAt) {
    // Skip while paused; mark job done to avoid loop. MIGRATION: pause should hold jobs.
    return {
      ...state,
      automations: state.automations.map((a) =>
        a.id === job.id ? { ...a, status: "cancelled", lastRunAt: now, lastResult: "Paused" } : a,
      ),
    };
  }

  const baseDone = (lastResult: string): Pick<AutomationJob, "status" | "lastRunAt" | "lastResult"> => ({
    status: "done",
    lastRunAt: now,
    lastResult,
  });

  switch (job.type) {
    case "invite_next_provider": {
      // For the first category without an active invitation, create one.
      let newInvitations = [...state.invitations];
      let newAutomations = state.automations.map((a) => (a.id === job.id ? { ...a, ...baseDone("Invited next provider") } : a));
      let newAudit = [...state.audit];
      let invited = false;
      let exhausted = false;
      for (const category of req.services) {
        const activeForCategory = newInvitations.find(
          (i) =>
            i.requestId === req.id &&
            i.category === category &&
            (i.state === "sent" || i.state === "viewed" || i.state === "accepted"),
        );
        if (activeForCategory) continue;
        const preferredId = req.selectedProviderIds[category];
        const alreadyInvitedIds = new Set(
          newInvitations.filter((i) => i.requestId === req.id && i.category === category).map((i) => i.providerId),
        );
        let providerId = preferredId && !alreadyInvitedIds.has(preferredId) ? preferredId : undefined;
        if (!providerId) {
          const fallback = nextEligibleProvider({ ...state, invitations: newInvitations }, req, category);
          providerId = fallback?.id;
        }
        if (!providerId) {
          exhausted = true;
          continue;
        }
        const inv: ProviderInvitation = {
          id: newId("inv"),
          requestId: req.id,
          providerId,
          category,
          state: "sent",
          sentAt: now,
          reminderCount: 0,
          expiresAt: addMinutes(now, SLA.invitationExpiryMins),
        };
        newInvitations.push(inv);
        newAutomations.push({
          id: newId("auto"),
          requestId: req.id,
          invitationId: inv.id,
          type: "send_invite_reminder",
          scheduledFor: addMinutes(now, SLA.invitationReminderMins),
          status: "scheduled",
        });
        newAudit.push(
          audit({
            entityType: "invitation",
            entityId: inv.id,
            eventType: "invitation.sent",
            at: now,
            newState: "sent",
            notes: `Invitation sent for ${category}`,
          }),
        );
        invited = true;
      }
      const newRequests = updateRequest(state, req.id, {
        state: invited ? "awaiting_response" : exhausted ? "escalated" : req.state,
        nextAction: invited ? "Awaiting provider response" : "Operator review",
        slaDueAt: invited ? addMinutes(now, SLA.invitationReminderMins) : req.slaDueAt,
      });
      const newExceptions = exhausted && !invited
        ? [
            ...state.exceptions,
            {
              id: newId("exc"),
              requestId: req.id,
              type: "no_provider_matched" as const,
              openedAt: now,
              severity: "warning" as const,
              note: "Exhausted candidate providers",
            },
          ]
        : state.exceptions;
      return {
        ...state,
        invitations: newInvitations,
        automations: newAutomations,
        requests: newRequests,
        exceptions: newExceptions,
        audit: newAudit,
      };
    }

    case "send_invite_reminder": {
      const inv = state.invitations.find((i) => i.id === job.invitationId);
      if (!inv || inv.state !== "sent") {
        return {
          ...state,
          automations: state.automations.map((a) => (a.id === job.id ? { ...a, ...baseDone("Skipped (invitation resolved)") } : a)),
        };
      }
      const newInvitations = updateInvitation(state, inv.id, { reminderCount: inv.reminderCount + 1 });
      const newAutomations = state.automations
        .map((a) => (a.id === job.id ? { ...a, ...baseDone("Reminder sent (mock)") } : a))
        .concat({
          id: newId("auto"),
          requestId: req.id,
          invitationId: inv.id,
          type: "expire_invitation",
          scheduledFor: inv.expiresAt ?? addMinutes(now, SLA.invitationExpiryMins - SLA.invitationReminderMins),
          status: "scheduled",
        });
      const newAudit = [
        ...state.audit,
        audit({
          entityType: "invitation",
          entityId: inv.id,
          eventType: "invitation.reminder_sent",
          at: now,
          notes: `Reminder #${inv.reminderCount + 1}`,
        }),
      ];
      return { ...state, invitations: newInvitations, automations: newAutomations, audit: newAudit };
    }

    case "expire_invitation": {
      const inv = state.invitations.find((i) => i.id === job.invitationId);
      if (!inv || inv.state !== "sent") {
        return {
          ...state,
          automations: state.automations.map((a) => (a.id === job.id ? { ...a, ...baseDone("Skipped (invitation resolved)") } : a)),
        };
      }
      const newInvitations = updateInvitation(state, inv.id, { state: "expired" });
      const newAutomations = state.automations
        .map((a) => (a.id === job.id ? { ...a, ...baseDone("Invitation expired; routing to next") } : a))
        .concat({
          id: newId("auto"),
          requestId: req.id,
          type: "invite_next_provider",
          scheduledFor: now,
          status: "scheduled",
        });
      const newAudit = [
        ...state.audit,
        audit({
          entityType: "invitation",
          entityId: inv.id,
          eventType: "invitation.expired",
          at: now,
          previousState: "sent",
          newState: "expired",
        }),
      ];
      return { ...state, invitations: newInvitations, automations: newAutomations, audit: newAudit };
    }

    case "send_fee_reminder": {
      const fee = state.fees.find((f) => f.id === job.feeId);
      if (!fee || fee.status !== "pending") {
        return {
          ...state,
          automations: state.automations.map((a) => (a.id === job.id ? { ...a, ...baseDone("Skipped (fee resolved)") } : a)),
        };
      }
      const overdue = isDue(fee.dueAt, now);
      const newFees = updateFee(state, fee.id, {
        reminderCount: fee.reminderCount + 1,
        status: overdue ? "overdue" : "pending",
      });
      const newExceptions: Exception[] = overdue
        ? [
            ...state.exceptions,
            {
              id: newId("exc"),
              requestId: req.id,
              type: "payment_overdue",
              openedAt: now,
              severity: "critical",
            },
          ]
        : state.exceptions;
      const newAutomations = state.automations.map((a) =>
        a.id === job.id ? { ...a, ...baseDone(overdue ? "Fee overdue" : "Fee reminder sent") } : a,
      );
      const newAudit = [
        ...state.audit,
        audit({
          entityType: "fee",
          entityId: fee.id,
          eventType: overdue ? "fee.overdue" : "fee.reminder_sent",
          at: now,
          newState: overdue ? "overdue" : undefined,
        }),
      ];
      return { ...state, fees: newFees, exceptions: newExceptions, automations: newAutomations, audit: newAudit };
    }

    case "expire_fee":
    case "escalate_no_provider":
    default:
      return {
        ...state,
        automations: state.automations.map((a) => (a.id === job.id ? { ...a, ...baseDone("No-op") } : a)),
      };
  }
}

/** Pure: run all jobs whose scheduledFor <= now. */
export function runDueAutomations(state: AppState, now: string): AppState {
  let s = { ...state, demo: { ...state.demo, virtualNow: now } };
  // Run at most 50 jobs per pass to avoid infinite loops on chained schedules.
  for (let i = 0; i < 50; i++) {
    const due = s.automations.find((a) => a.status === "scheduled" && isDue(a.scheduledFor, now));
    if (!due) break;
    s = executeJob(s, due);
  }
  return s;
}

/**
 * Imperative transitions used directly by UI actions.
 * MIGRATION: become server-side endpoints / mutations.
 */

export function submitRequest(state: AppState, req: MoveRequest): AppState {
  const now = state.demo.virtualNow;
  const requests = [...state.requests, { ...req, state: "submitted" as const, createdAt: now }];
  const audit = [
    ...state.audit,
    {
      id: newId("aud"),
      entityType: "request" as const,
      entityId: req.id,
      eventType: "request.submitted",
      at: now,
      newState: "submitted",
      actor: "customer" as const,
    },
  ];
  const automations = [
    ...state.automations,
    {
      id: newId("auto"),
      requestId: req.id,
      type: "invite_next_provider" as const,
      scheduledFor: now,
      status: "scheduled" as const,
    },
  ];
  return { ...state, requests, audit, automations };
}

export function providerRespond(
  state: AppState,
  invitationId: string,
  decision: "accepted" | "declined",
): AppState {
  const now = state.demo.virtualNow;
  const inv = state.invitations.find((i) => i.id === invitationId);
  if (!inv) return state;
  const invitations = updateInvitation(state, invitationId, { state: decision, respondedAt: now });
  const audit = [
    ...state.audit,
    {
      id: newId("aud"),
      entityType: "invitation" as const,
      entityId: inv.id,
      eventType: `invitation.${decision}`,
      at: now,
      previousState: inv.state,
      newState: decision,
      actor: "provider" as const,
    },
  ];

  if (decision === "declined") {
    // Cancel pending reminder/expire jobs for this invitation; schedule next provider.
    const automations = state.automations
      .map((a) =>
        a.invitationId === invitationId && a.status === "scheduled"
          ? { ...a, status: "cancelled" as const, lastRunAt: now, lastResult: "Invitation declined" }
          : a,
      )
      .concat({
        id: newId("auto"),
        requestId: inv.requestId,
        type: "invite_next_provider",
        scheduledFor: now,
        status: "scheduled",
      });
    return { ...state, invitations, audit, automations };
  }

  // accepted → create introduction fee, set request to awaiting_payment
  const fee: IntroductionFee = {
    id: newId("fee"),
    invitationId: inv.id,
    providerId: inv.providerId,
    requestId: inv.requestId,
    category: inv.category,
    amount: INTRODUCTION_FEES[inv.category],
    currency: "AUD",
    status: "pending",
    dueAt: addMinutes(now, SLA.feeExpiryMins),
    reminderCount: 0,
  };
  const automations = state.automations
    .map((a) =>
      a.invitationId === invitationId && a.status === "scheduled"
        ? { ...a, status: "cancelled" as const, lastRunAt: now, lastResult: "Invitation accepted" }
        : a,
    )
    .concat({
      id: newId("auto"),
      requestId: inv.requestId,
      feeId: fee.id,
      type: "send_fee_reminder",
      scheduledFor: addMinutes(now, SLA.feeReminderMins),
      status: "scheduled",
    });
  const requests = updateRequest(state, inv.requestId, {
    state: "awaiting_payment",
    nextAction: "Provider must pay introduction fee",
    slaDueAt: fee.dueAt,
  });
  audit.push({
    id: newId("aud"),
    entityType: "fee",
    entityId: fee.id,
    eventType: "fee.created",
    at: now,
    newState: "pending",
    actor: "system",
  });
  return { ...state, invitations, fees: [...state.fees, fee], audit, automations, requests };
}

/** Mock the provider paying the introduction fee → release customer details. */
export function payIntroductionFee(state: AppState, feeId: string): AppState {
  const now = state.demo.virtualNow;
  const fee = state.fees.find((f) => f.id === feeId);
  if (!fee) return state;
  const customer = state.customers.find(
    (c) => c.id === state.requests.find((r) => r.id === fee.requestId)?.customerId,
  );
  if (!customer) return state;
  const fees = updateFee(state, feeId, { status: "paid", paidAt: now });
  const release: CustomerRelease = {
    id: newId("rel"),
    requestId: fee.requestId,
    providerId: fee.providerId,
    feeId: fee.id,
    category: fee.category,
    releasedAt: now,
    payload: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      preferredContact: "phone",
      moveDate: customer.moveDate,
      fromAddress: customer.fromAddress,
      toAddress: customer.toAddress,
      notes: customer.notes,
    },
  };
  const requests = updateRequest(state, fee.requestId, {
    state: "details_released",
    nextAction: "Provider contacts customer",
    slaDueAt: undefined,
  });
  // Cancel pending fee-related automations
  const automations = state.automations.map((a) =>
    a.feeId === feeId && a.status === "scheduled"
      ? { ...a, status: "cancelled" as const, lastRunAt: now, lastResult: "Fee paid" }
      : a,
  );
  // Resolve payment_overdue exceptions
  const exceptions = state.exceptions.map((e) =>
    e.requestId === fee.requestId && e.type === "payment_overdue" && !e.resolvedAt
      ? { ...e, resolvedAt: now }
      : e,
  );
  const audit = [
    ...state.audit,
    {
      id: newId("aud"),
      entityType: "fee" as const,
      entityId: fee.id,
      eventType: "fee.paid",
      at: now,
      previousState: fee.status,
      newState: "paid",
      actor: "provider" as const,
    },
    {
      id: newId("aud"),
      entityType: "release" as const,
      entityId: release.id,
      eventType: "release.created",
      at: now,
      actor: "system" as const,
      notes: "Customer details released to provider",
    },
  ];
  return { ...state, fees, releases: [...state.releases, release], requests, automations, exceptions, audit };
}
