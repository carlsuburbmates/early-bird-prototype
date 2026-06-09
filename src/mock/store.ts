/**
 * Zustand store + actions. Persists to localStorage so prototype state survives refreshes.
 *
 * MIGRATION:
 * - Replace persisted localStorage with real API queries (TanStack Query / RPC).
 * - Each `action` here should become a server-side mutation.
 * - The virtualNow / advanceTime mechanics disappear — real cron jobs use wall-clock.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, DemoRole, ID, MoveRequest, Priority, RequestState } from "./types";
import { freshSeed } from "./seed";
import {
  payIntroductionFee,
  providerRespond,
  runDueAutomations,
  submitRequest,
} from "./automation";
import { addMinutes, newId } from "./utils";

interface StoreActions {
  resetDemoData: () => void;
  setRole: (role: DemoRole) => void;
  setActiveProvider: (id: ID) => void;
  setActiveCustomer: (id: ID) => void;
  advanceTime: (mins: number) => void;
  runDue: () => void;
  runJobNow: (jobId: ID) => void;

  submitRequest: (req: MoveRequest) => void;
  providerRespond: (invitationId: ID, decision: "accepted" | "declined") => void;
  payIntroductionFee: (feeId: ID) => void;

  // Operator actions
  pauseRequest: (requestId: ID) => void;
  resumeRequest: (requestId: ID) => void;
  cancelRequest: (requestId: ID) => void;
  markRequestCompleted: (requestId: ID) => void;
  reopenRequest: (requestId: ID) => void;
  setPriority: (requestId: ID, priority: Priority) => void;
  resolveException: (exceptionId: ID) => void;
  addNote: (requestId: ID, body: string) => void;
}

type Store = AppState & StoreActions;

const STORAGE_KEY = "leasemate.demo.v1";

function pushAudit(
  state: AppState,
  entry: {
    entityType: AppState["audit"][number]["entityType"];
    entityId: ID;
    eventType: string;
    newState?: string;
    notes?: string;
    actor?: AppState["audit"][number]["actor"];
  },
): AppState["audit"] {
  return [
    ...state.audit,
    {
      id: newId("aud"),
      at: state.demo.virtualNow,
      actor: entry.actor ?? "operator",
      ...entry,
    },
  ];
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...freshSeed(),

      resetDemoData: () => set(() => ({ ...freshSeed() })),

      setRole: (role) => set((s) => ({ demo: { ...s.demo, role } })),
      setActiveProvider: (id) => set((s) => ({ demo: { ...s.demo, activeProviderId: id } })),
      setActiveCustomer: (id) => set((s) => ({ demo: { ...s.demo, activeCustomerId: id } })),

      advanceTime: (mins) =>
        set((s) => {
          const next = addMinutes(s.demo.virtualNow, mins);
          return runDueAutomations(s, next);
        }),

      runDue: () => set((s) => runDueAutomations(s, s.demo.virtualNow)),

      runJobNow: (jobId) =>
        set((s) => {
          const job = s.automations.find((a) => a.id === jobId);
          if (!job) return s;
          // Bring job's scheduled time forward and run.
          const patched: AppState = {
            ...s,
            automations: s.automations.map((a) =>
              a.id === jobId ? { ...a, scheduledFor: s.demo.virtualNow } : a,
            ),
          };
          return runDueAutomations(patched, s.demo.virtualNow);
        }),

      submitRequest: (req) => set((s) => submitRequest(s, req)),
      providerRespond: (id, d) => set((s) => providerRespond(s, id, d)),
      payIntroductionFee: (id) => set((s) => payIntroductionFee(s, id)),

      pauseRequest: (id) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id
              ? { ...r, pausedAt: s.demo.virtualNow, nextAction: "Paused by operator" }
              : r,
          ),
          audit: pushAudit(s, { entityType: "request", entityId: id, eventType: "request.paused" }),
        })),
      resumeRequest: (id) =>
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, pausedAt: undefined } : r)),
          audit: pushAudit(s, {
            entityType: "request",
            entityId: id,
            eventType: "request.resumed",
          }),
        })),
      cancelRequest: (id) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id ? { ...r, state: "cancelled" as RequestState, nextAction: "—" } : r,
          ),
          automations: s.automations.map((a) =>
            a.requestId === id && a.status === "scheduled"
              ? {
                  ...a,
                  status: "cancelled" as const,
                  lastRunAt: s.demo.virtualNow,
                  lastResult: "Request cancelled",
                }
              : a,
          ),
          audit: pushAudit(s, {
            entityType: "request",
            entityId: id,
            eventType: "request.cancelled",
            newState: "cancelled",
          }),
        })),
      markRequestCompleted: (id) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id ? { ...r, state: "completed" as RequestState, nextAction: "—" } : r,
          ),
          audit: pushAudit(s, {
            entityType: "request",
            entityId: id,
            eventType: "request.completed",
            newState: "completed",
          }),
        })),
      reopenRequest: (id) =>
        set((s) => ({
          requests: s.requests.map((r) =>
            r.id === id ? { ...r, state: "matching" as RequestState, nextAction: "Reopened" } : r,
          ),
          audit: pushAudit(s, {
            entityType: "request",
            entityId: id,
            eventType: "request.reopened",
            newState: "matching",
          }),
        })),
      setPriority: (id, priority) =>
        set((s) => ({
          requests: s.requests.map((r) => (r.id === id ? { ...r, priority } : r)),
          audit: pushAudit(s, {
            entityType: "request",
            entityId: id,
            eventType: "request.priority_changed",
            notes: `Priority → ${priority}`,
          }),
        })),
      resolveException: (id) =>
        set((s) => ({
          exceptions: s.exceptions.map((e) =>
            e.id === id ? { ...e, resolvedAt: s.demo.virtualNow } : e,
          ),
          audit: pushAudit(s, {
            entityType: "exception",
            entityId: id,
            eventType: "exception.resolved",
          }),
        })),
      addNote: (requestId, body) =>
        set((s) => ({
          notes: [
            ...s.notes,
            { id: newId("note"), requestId, at: s.demo.virtualNow, author: "operator", body },
          ],
          audit: pushAudit(s, {
            entityType: "request",
            entityId: requestId,
            eventType: "request.note_added",
            notes: body.slice(0, 80),
          }),
        })),
    }),
    {
      name: STORAGE_KEY,
      // Only persist the data slice. Skipping is fine — actions live on the store.
    },
  ),
);

// Selectors / helpers
export const selectRequest = (id: string) => (s: AppState) => s.requests.find((r) => r.id === id);
export const selectCustomer = (id: string) => (s: AppState) => s.customers.find((c) => c.id === id);
export const selectProvider = (id: string) => (s: AppState) => s.providers.find((p) => p.id === id);
export const selectCartItemsForRequest = (id: string) => (s: AppState) =>
  s.cartItems.filter((i) => i.requestId === id);
export const selectInvitationsForRequest = (id: string) => (s: AppState) =>
  s.invitations.filter((i) => i.requestId === id);
export const selectFeesForRequest = (id: string) => (s: AppState) =>
  s.fees.filter((f) => f.requestId === id);
export const selectReleasesForRequest = (id: string) => (s: AppState) =>
  s.releases.filter((r) => r.requestId === id);
export const selectAutomationsForRequest = (id: string) => (s: AppState) =>
  s.automations.filter((a) => a.requestId === id);
export const selectExceptionsForRequest = (id: string) => (s: AppState) =>
  s.exceptions.filter((e) => e.requestId === id);
export const selectNotesForRequest = (id: string) => (s: AppState) =>
  s.notes.filter((n) => n.requestId === id);
export const selectAuditForRequest = (id: string) => (s: AppState) => {
  const cartItemIds = new Set(s.cartItems.filter((i) => i.requestId === id).map((i) => i.id));
  const invIds = new Set(s.invitations.filter((i) => i.requestId === id).map((i) => i.id));
  const serviceProductIds = new Set(
    s.invitations
      .filter((i) => i.requestId === id && i.serviceProductId)
      .map((i) => i.serviceProductId!),
  );
  const feeIds = new Set(s.fees.filter((f) => f.requestId === id).map((f) => f.id));
  const excIds = new Set(s.exceptions.filter((e) => e.requestId === id).map((e) => e.id));
  const relIds = new Set(s.releases.filter((r) => r.requestId === id).map((r) => r.id));
  return s.audit
    .filter(
      (a) =>
        (a.entityType === "request" && a.entityId === id) ||
        (a.entityType === "cart_item" && cartItemIds.has(a.entityId)) ||
        (a.entityType === "service_product" && serviceProductIds.has(a.entityId)) ||
        (a.entityType === "invitation" && invIds.has(a.entityId)) ||
        (a.entityType === "fee" && feeIds.has(a.entityId)) ||
        (a.entityType === "exception" && excIds.has(a.entityId)) ||
        (a.entityType === "release" && relIds.has(a.entityId)),
    )
    .sort((a, b) => a.at.localeCompare(b.at));
};
