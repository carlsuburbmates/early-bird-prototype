
# LeaseMate — Frontend-Only Prototype (Migration-Ready)

No Supabase, auth, payments, email, SMS, or external APIs. Everything runs on mock data + a virtual clock + simulated state transitions. Designed so a future migration to GitHub / a real backend is a swap, not a rewrite.

## Architecture (migration-first)

```text
src/
  mock/
    types.ts          all entity types (mirrors future DB schema)
    fixtures/         JSON-shaped seed data (customers, providers, suburbs)
    seed.ts           builds initial AppState
    store.ts          Zustand store + actions + localStorage persist
    automation.ts     workflow / state-transition engine (the future backend job runner)
    utils.ts          ids, formatters, virtual-clock helpers
  components/
    shared/           RoleSwitcher, AdvanceTimeMenu, StateBadge, SlaTimer,
                      PriorityBadge, AlertChip, MarketingHeader, MarketingFooter
    customer/         IntakeStepper, MoveDetailsForm, ServiceSelector,
                      ProviderCard, PackageBuilder, PackageSummary,
                      RequestStatusTimeline
    provider/         OpportunityCard, OpportunityDetail, PaymentRequiredPanel,
                      ReleasedCustomerCard, ProviderHistoryTable, ProviderProfileForm
    ops/              OpsSidebar, OpsTopBar, ActiveRequestsTable,
                      RequestDetail3Panel (CustomerSummary, WorkflowTimeline,
                      ActionPanel, …), ProviderQueueTable, BillingQueueTable,
                      ExceptionsQueueTable, AutomationQueueTable,
                      ProviderManagementTable, CustomerManagementTable,
                      AuditLogList, SystemHealthCards, OpsHomeWidgets
README_MIGRATION.md   purpose, routes, data model, workflow states,
                      backend mapping, what to replace at migration
```

**Hard rule:** UI components never mutate state directly. They dispatch actions exposed by `store.ts`; transitions live in `automation.ts`. Every mock that simulates future backend behaviour is tagged with a `MIGRATION:` comment.

## Visual direction

- **Public / customer surfaces** — friendly clean renter brand: soft neutrals, generous spacing, rounded cards, single warm accent.
- **Operations Center** — denser SaaS console: compact tables, status colour system, sticky toolbar, left nav.

Both modes use semantic tokens defined in `src/styles.css`. No hex in components.

## Demo controls (top bar, always visible)

- **Demo Role Switcher** — Customer / Provider / Operator. Clearly labelled "Demo Role Switcher — not real auth".
- **Advance Time** menu — +5m, +1h, +24h, +3d, plus "Run due automations now" and "Reset demo data".
- **Virtual clock** display next to the menu.

## Routes (flat dot file naming)

```text
/                              Home (friendly brand)
/how-it-works
/services
/for-providers
/provider-signup
/faq

/intake                        Stepper layout
/intake/                       1. Move details
/intake/services               2. Pick services
/intake/providers              3. Recommended + Build-your-own
/intake/review                 4. Review estimated total
/intake/submitted              5. Confirmation
/request/$requestId            Customer status page

/provider                      Provider portal layout
/provider/                     Dashboard: opportunities + history
/provider/opportunity/$id      Detail → accept/decline → mock pay → release
/provider/profile              Provider profile editor

/ops                           Ops console layout (sidebar)
/ops/                          Operations Home (widgets)
/ops/requests                  Active Requests table
/ops/requests/$id              3-panel request detail
/ops/providers-queue           Provider invitation/response queue
/ops/billing                   Billing queue
/ops/exceptions                Exceptions queue
/ops/automations               Scheduled & running automations
/ops/providers                 Provider management
/ops/customers                 Customer management
/ops/audit                     Append-only audit log
/ops/health                    System health
```

Each route defines its own `head()` metadata.

## Mock data model (entities — full TS in `src/mock/types.ts`)

`Customer`, `Provider`, `MoveRequest`, `ProviderInvitation`, `IntroductionFee`,
`CustomerRelease`, `AutomationJob`, `Exception`, `AuditEvent`, `RequestNote`,
`DemoState`. Field names mirror the eventual DB schema.

### Request state machine

```text
submitted → matching → provider_invited → awaiting_response
   → accepted → awaiting_payment → details_released → completed
   (branches: declined, expired, escalated, cancelled)
```

### Invitation states

`not_sent → sent → viewed → accepted | declined | expired`

### Automation job types

`invite_next_provider`, `send_invite_reminder`, `expire_invitation`,
`escalate_no_provider`, `send_fee_reminder`, `expire_fee`

## Mock automation (`src/mock/automation.ts`)

A pure function `runDueAutomations(state, now)` returns a new state with all jobs whose `scheduledFor <= now` executed. Called by:
- a 1s interval ticker (so things "happen" while the user watches),
- the **Advance Time** controls (deterministically),
- the **Run now** button per job in the Automation Queue.

Every transition appends an `AuditEvent` and updates `MoveRequest.state` / `slaDueAt` / `nextAction`. Nothing is removed until the request reaches `completed`, `cancelled`, or an exception is explicitly resolved.

## Seeded scenarios (so every state is visible in Ops on load)

Melbourne suburbs only — Northcote, Thornbury, Brunswick, Preston, Fitzroy, Carlton, Richmond, South Yarra, St Kilda, Footscray, Coburg, Collingwood, Hawthorn.

8 seeded requests covering: happy path, accepted-awaiting-payment, details-released-completed, provider-declined-routing-to-next, invitation-expired-escalated, payment-overdue, no-provider-matched, operator-paused. Plus 12 providers across all 7 categories.

## Customer flow acceptance

Intake → services → recommended/manual providers → review (estimated total range from provider `pricingRanges`) → submit → land on `/request/$id` showing live customer-facing timeline.

## Provider flow acceptance

Pre-payment opportunity view shows job summary + scope + fee, **hides** customer PII. Accept → "Payment Required" with mock **Pay introduction fee** button → on success, `CustomerRelease` is created and PII is revealed. Decline routes the request to the next candidate via automation.

## Operations Center acceptance

Every PRD §30 Ops screen exists. Request detail shows customer summary / workflow timeline / current+next state / next automation / actions (pause, resume, cancel, mark reviewed, reopen, trigger next, view automation history) / alerts / notes / billing / exceptions. Queues for providers, billing, exceptions, automations. Audit log is append-only. System health summarises automations scheduled, failed last hour, avg time-to-completion, open exceptions, active providers, blocked requests.

## README_MIGRATION.md (deliverable)

Sections: App purpose · Routes · Mock data structure · Workflow state model · Mock → real-backend mapping (entities → tables, automation jobs → cron/queue workers, role switcher → real auth, mock pay → Stripe) · What must be replaced during migration · Export-to-GitHub notes.

## Build priority order

1. Customer move-out flow
2. Provider accept/decline/payment-gated reveal
3. Ops Center queues + request detail visibility
4. Mock automation / timeline / audit behaviour
5. Marketing pages (short polished copy)
