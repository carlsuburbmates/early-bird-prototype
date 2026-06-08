# LeaseMate SSOT

## Document Status

Version: v1.0
Document type: Single Source of Truth
Project: LeaseMate

This document is the highest-authority source for LeaseMate’s intended product identity, business model, operating principles, locked decisions, and non-goals.

If another project document conflicts with this file, this file wins.

This document defines what LeaseMate is expected to be. It must not contain temporary implementation status, builder history, task prompts, or tool-specific instructions.

---

# 1. Documentation Authority

The canonical documentation hierarchy is:

1. `docs/SSOT.md`
2. `docs/PRD.md`
3. `docs/OPERATING_MODEL.md`
4. `docs/WORKFLOWS.md`
5. `docs/DECISIONS.md`
6. `docs/TECHNICAL_STATE.md`
7. `docs/MIGRATION_PLAN.md`
8. `docs/RUNBOOK_LOCAL.md`

## Authority Rules

* `SSOT.md` defines the product truth and non-negotiable project boundaries.
* `PRD.md` defines product requirements.
* `OPERATING_MODEL.md` defines operational behaviour and control model.
* `WORKFLOWS.md` defines step-by-step workflow behaviour.
* `DECISIONS.md` records approved major decisions.
* `TECHNICAL_STATE.md` records current implementation state.
* `MIGRATION_PLAN.md` records future migration direction.
* `RUNBOOK_LOCAL.md` records local setup, verification, and testing instructions.

Temporary task notes, prompts, AI-builder outputs, and implementation logs are not product truth.

---

# 2. Product Identity

LeaseMate is a **rental move-out coordination platform**.

It helps renters organise the services they need when leaving a rental property.

LeaseMate coordinates introductions between renters and independent service providers.

LeaseMate does not provide the services directly.

---

# 3. One-Sentence Definition

LeaseMate helps renters build and manage a complete move-out service package while coordinating exclusive provider introductions through a fully visible, automation-first Operations Center.

---

# 4. Product Category

## Primary Category

Rental Move-Out Coordination Platform

## Secondary Category

Managed Introduction Platform

## Internal Product Type

Workflow-orchestrated service coordination system

---

# 5. What LeaseMate Is Not

LeaseMate is not:

* a removalist company
* a cleaning company
* a storage provider
* a handyman service
* a utility provider
* a generic marketplace
* a generic business directory
* a quote-comparison website
* a public job board
* an auction platform
* a booking engine
* a property management platform
* a marketplace checkout platform

Any decision that pushes LeaseMate toward these categories is scope drift unless explicitly approved.

---

# 6. Core Users

LeaseMate has three primary user groups:

1. Customer / renter
2. Provider
3. Operator

---

# 7. Customer / Renter

## Definition

A customer is a renter moving out of a rental property.

## Customer Situations

LeaseMate is relevant when a renter is:

* ending a lease
* moving to another rental
* moving into a purchased property
* downsizing
* relocating
* moving urgently
* preparing for final inspection
* arranging end-of-lease cleaning
* coordinating several move-out services
* unsure how much the move-out process may cost

## Customer Goals

The customer wants:

* less chasing
* fewer supplier calls
* clearer expected costs
* a simple planning process
* relevant provider options
* a coordinated move-out package
* visibility over request progress

---

# 8. Provider

## Definition

A provider is an independent business that may service one or more move-out needs.

## Initial Provider Categories

Initial provider categories are:

1. removalists
2. end-of-lease cleaners
3. carpet cleaners
4. rubbish removal providers
5. storage providers
6. handymen
7. utility connection/disconnection partners

## Provider Goals

The provider wants:

* suitable opportunities
* clearer job details before accepting
* fewer low-quality leads
* less quote-chasing
* reduced competition with many providers
* exclusive customer introductions
* payment only when they accept a relevant opportunity

---

# 9. Operator

## Definition

The operator is the business owner or operating user supervising the platform.

## Operator Goals

The operator needs to:

* see every workflow
* monitor automation
* track provider invitations
* track billing/payment states
* identify blocked requests
* handle exceptions
* intervene selectively
* maintain trust through auditability
* avoid becoming a manual call centre

---

# 10. Core Customer Problem

Renters moving out often need multiple services at the same time.

Common service needs include:

* removalists
* end-of-lease cleaning
* carpet cleaning
* rubbish removal
* storage
* handyman repairs
* utility connection or disconnection

The current process is fragmented.

Renters usually have to:

* search across multiple websites
* request several quotes
* compare inconsistent prices
* call or message many providers
* repeat the same move details
* track provider responses manually
* manage deadlines under pressure
* guess the total move-out cost

The core problem is not simply finding one provider.

The core problem is coordinating the full move-out process.

---

# 11. Core Customer Solution

LeaseMate gives renters one structured place to plan and coordinate their move-out.

The renter enters move-out details once.

The platform then:

* understands the move-out requirement
* shows relevant service categories
* recommends suitable providers
* lets the customer build their own package if preferred
* displays estimated price ranges
* submits one coordinated request
* coordinates provider introductions
* tracks workflow progress

---

# 12. Service Categories

LeaseMate should support these launch service categories:

* removalist
* end-of-lease cleaning
* carpet cleaning
* rubbish removal
* storage
* handyman
* utilities

Each service category should support:

* provider capability matching
* estimated price range display
* provider profile display
* provider invitation
* accept/decline workflow
* introduction fee
* customer detail release after payment

Customers may select one or multiple services.

LeaseMate must support multi-service move-out packages.

---

# 13. Customer Workflow Truth

The intended customer workflow is:

1. Customer enters move-out details.
2. Customer selects required services.
3. Customer chooses recommended providers or builds their own package.
4. Customer reviews estimated price ranges.
5. Customer submits the package.
6. Platform coordinates provider introductions.
7. Customer tracks request status.
8. Customer is introduced after provider acceptance and payment.

The customer should not need to manually call every supplier before submitting a package.

---

# 14. Provider Workflow Truth

The intended provider workflow is:

1. Provider receives an opportunity.
2. Provider reviews job summary without customer contact details.
3. Provider accepts or declines.
4. If accepted, provider pays an introduction fee.
5. Customer details are released only after payment.
6. Provider contacts the customer directly.
7. Provider invoices the customer directly.

The provider should not receive customer contact details before payment.

---

# 15. Operator Workflow Truth

The intended operator workflow is:

1. Operator sees all active requests.
2. Operator monitors provider invitations.
3. Operator monitors billing and payment states.
4. Operator monitors automation timers.
5. Operator reviews exceptions.
6. Operator intervenes only when required.
7. Operator uses audit history to verify what happened.

The operator supervises workflows; the operator should not manually coordinate every request by default.

---

# 16. Introduction Rule

Customer details remain hidden until both conditions are met:

1. Provider accepts the opportunity.
2. Provider pays the introduction fee.

Only after payment may the provider receive customer contact details.

This rule is central to the business model.

It prevents unpaid lead leakage.

---

# 17. Revenue Model

LeaseMate’s primary revenue model is an **exclusive introduction fee** paid by providers.

## Payment Trigger

The provider pays only after accepting a specific opportunity.

## What LeaseMate Sells

LeaseMate sells:

* exclusive customer introductions

LeaseMate does not sell:

* the actual moving service
* the actual cleaning service
* the actual storage service
* provider labour
* customer checkout
* general directory views
* quote bidding access

## Provider Invoice Rule

Providers invoice customers directly after customer details are released.

LeaseMate does not invoice the customer for the provider’s service.

---

# 18. Pricing Philosophy

LeaseMate displays estimated price ranges.

LeaseMate does not display guaranteed final quotes unless a provider explicitly defines a fixed-price service.

Final pricing is determined by the provider.

Acceptable pricing language:

* estimated range
* typical range
* expected range
* indicative cost

Avoid:

* guaranteed price
* final quote
* fixed cost
* book now for this amount

The purpose of price ranges is to help renters make better decisions before selecting providers.

---

# 19. Operations Philosophy

The operating model is:

> Autonomous System + Full Visibility + Selective Intervention

This means:

* automation handles routine workflow steps
* the operator sees every workflow
* autonomous workflows remain visible
* manual intervention is selective
* blocked items are surfaced clearly
* nothing disappears silently
* every important state change is auditable

This is not exception-only monitoring.

This is not a passive admin dashboard.

This is not black-box automation.

---

# 20. Operations Center

The operator-facing surface is called:

**Operations Center**

It is not called:

* admin panel
* admin dashboard
* CMS
* back office

## Purpose

The Operations Center exists to let the operator:

* monitor
* understand
* control
* intervene
* audit
* verify operational health

The Operations Center is the control surface over the autonomous workflow system.

---

# 21. Required Operations Surfaces

The Operations Center must expose:

1. Active Requests
2. Provider Queue
3. Billing Queue
4. Exceptions Queue
5. Automation Queue
6. Provider Management
7. Customer Management
8. Audit Log
9. System Health

## Visibility Rule

Every request, provider invitation, billing item, automation task, exception, and release must have a visible state.

Items must not disappear simply because automation is handling them.

---

# 22. Core Request Lifecycle

The core request lifecycle is:

1. Submitted
2. Matching / Matched
3. Provider Invited
4. Awaiting Provider Response
5. Provider Accepted
6. Payment Pending
7. Payment Received
8. Customer Details Released
9. Completed

Exceptional states may include:

* declined
* expired
* escalated
* paused
* cancelled

Every state must be visible in the Operations Center.

---

# 23. Provider Invitation Lifecycle

The provider invitation lifecycle is:

1. Draft
2. Not Sent
3. Sent
4. Viewed
5. Awaiting Response
6. Reminder Sent
7. Accepted
8. Declined
9. Expired
10. Cancelled

## Accepted Rule

If a provider accepts:

* create introduction fee
* move request toward payment pending
* keep customer details hidden

## Declined Rule

If a provider declines:

* record decline
* write audit event
* route to another provider if possible
* escalate if no suitable provider remains

## Expired Rule

If a provider does not respond:

* record expiry
* write audit event
* route to another provider if possible
* escalate if no suitable provider remains

---

# 24. Payment Lifecycle

The payment lifecycle is:

1. Not Required
2. Fee Created
3. Payment Pending
4. Payment Reminder Sent
5. Payment Overdue
6. Paid
7. Customer Details Released
8. Closed

Core rule:

> No payment means no customer details.

Only an explicit, auditable operator override may bypass this later.

---

# 25. Escalation Logic

Standard escalation model:

Provider 1 invited

↓

24 hours passes

↓

Reminder sent

↓

24 more hours passes

↓

Provider 2 invited

↓

24 hours passes

↓

Reminder sent

↓

24 more hours passes

↓

Ops escalation if no success

Escalation reasons include:

* provider did not respond
* provider declined
* all providers declined
* no provider matched
* provider accepted but did not pay
* customer package cannot be fulfilled
* automation failed
* data is incomplete
* manual decision is required

Automation attempts recovery first.

Operator enters when automation cannot confidently progress the workflow.

---

# 26. Audit Rule

Audit history must be append-only.

Every important event must be recorded.

Examples:

* request created
* provider matched
* provider invited
* provider accepted
* provider declined
* reminder sent
* introduction fee generated
* payment received
* customer details released
* exception created
* exception resolved
* automation failed
* operator override performed

No silent workflow changes.

No destructive audit edits.

---

# 27. System Health Rule

LeaseMate must expose system health to the operator.

System Health should answer:

* Are requests moving?
* Are providers responding?
* Are payments being completed?
* Are automations running?
* Are exceptions increasing?
* Are workflows blocked?
* Are SLAs being breached?

System Health should include:

* active requests
* completed requests
* blocked requests
* open exceptions
* critical exceptions
* scheduled automations
* failed automations
* overdue fees
* SLA breaches
* active providers
* paused providers
* total customer releases

---

# 28. Product Non-Goals

Do not add unless explicitly approved later:

* real payments before workflow validation
* real authentication before workflow validation
* real backend before workflow validation
* provider bidding
* quote marketplace behaviour
* reviews
* ratings
* live chat
* booking calendar
* dynamic pricing engine
* complex AI matching
* production CRM
* production invoicing
* mobile app
* customer marketplace checkout

These are future decisions after workflow validation.

---

# 29. Locked Decisions

The following decisions are locked:

1. LeaseMate is for renters moving out.
2. LeaseMate is a rental move-out coordination platform.
3. LeaseMate coordinates introductions.
4. LeaseMate does not provide services directly.
5. Customers can use recommended package or build their own package.
6. Provider profiles include capabilities and estimated price ranges.
7. Customers see estimated price ranges, not final quotes.
8. Providers accept or decline opportunities.
9. Customer details remain hidden until provider acceptance and introduction-fee payment.
10. Providers invoice customers directly after customer details are released.
11. Revenue is introduction-fee based.
12. The Ops surface is called Operations Center.
13. Operations model is autonomous system plus full visibility plus selective intervention.
14. Automated workflows must remain visible.
15. Nothing disappears until completed, cancelled, or closed.
16. Audit history is append-only.
17. Builder/tool-specific history is not product truth.
18. Documentation authority starts with this SSOT.

---

# 30. Open Decisions

These are not blockers for workflow definition but must be resolved before production:

1. final brand name
2. initial city/suburb launch area
3. exact provider verification requirements
4. exact introduction fee amounts
5. legal terms for providers
6. legal terms for customers
7. refund policy for introduction fees
8. whether providers must prepay credits later
9. whether customer accounts are required
10. whether provider accounts are required at launch
11. whether manual provider onboarding is required before public visibility
12. whether utilities are direct providers or referral partners
13. whether storage is provider introduction or affiliate referral
14. whether customer exact address is collected upfront or later
15. whether customers can cancel after provider acceptance
16. how disputes are handled after introduction
17. final production backend architecture
18. final payment provider
19. final communication provider
20. final permissions/RBAC model

---

# 31. Highest-Risk Areas

## Provider Willingness to Pay

The business depends on providers accepting the rule:

> Pay to unlock exclusive customer details after accepting the opportunity.

This must be validated.

## Price Range Accuracy

If displayed price ranges are inaccurate, customers may lose trust.

## Provider Response Speed

If providers do not respond quickly enough, customer experience suffers.

## Ops Overload

If automation is weak, the operator becomes the bottleneck.

## Workflow Confusion

If request states are unclear, the Operations Center becomes unreliable.

## Payment-Gated Release Resistance

Providers may resist paying before receiving customer details.

## Agent Drift

Coding agents may expand scope, add backend services, or reinterpret the product unless documentation is explicit.

## Prototype Lock-In

Prototype logic must not become tied to builder-specific systems or hidden integrations.

---

# 32. Success Metrics

## Customer Metrics

* intake completion rate
* package submission rate
* recommended package acceptance rate
* build-my-own usage rate
* customer update time
* customer drop-off by screen
* request status page visits

## Provider Metrics

* provider invitation acceptance rate
* provider decline rate
* provider timeout rate
* introduction fee payment rate
* average time to accept
* average time to pay
* provider repeat usage

## Ops Metrics

* active request count
* escalation rate
* average request completion time
* automation success rate
* manual intervention rate
* payment overdue count
* exception resolution time
* blocked request count
* SLA breach count

## Business Metrics

* introductions completed
* introduction fees collected
* revenue per request
* customer request volume
* provider acquisition rate
* provider activation rate
* provider repeat acceptance rate

---

# 33. Final SSOT Statement

LeaseMate is a renter-focused move-out coordination platform where customers create a service package, providers accept paid exclusive introductions, and an operator supervises the autonomous workflow through a full-visibility Operations Center.

This document is the highest authority for the project’s intended identity, boundaries, and locked decisions.
