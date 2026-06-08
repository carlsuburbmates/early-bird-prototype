LeaseMate Operating Model

Document Status

Version: v1.0
Document type: Operating Model
Canonical dependencies:

* docs/PROJECT_TRUTH.md
* docs/PRD.md

This document defines how LeaseMate should operate as a solo-founder, automation-first rental move-out coordination platform.

It focuses specifically on:

* Operations Center philosophy
* queue architecture
* workflow visibility
* state transitions
* automation
* escalation
* notification model
* auditability
* operator actions
* system health
* solo-founder control boundaries

⸻

1. Operating Principle

LeaseMate operates under this principle:

Autonomous System + Full Visibility + Selective Intervention

This means:

* automation handles routine workflow movement
* the operator can see every workflow
* operator action is required only when needed
* automated workflows are never hidden
* nothing disappears silently
* all state changes are visible
* all important events are auditable

The system should not be exception-only.

The system should not be black-box automation.

The system should behave like an operations control tower.

⸻

2. Role of the Operations Center

The Operations Center is the live control surface for LeaseMate.

It is not:

* a CMS
* a basic admin panel
* a passive analytics dashboard
* a generic CRUD interface

It is responsible for showing:

* customer request state
* provider invitation state
* provider response state
* billing/payment state
* customer detail release state
* automation state
* exceptions
* audit events
* system health

The operator must be able to understand what is happening without reading code, logs, database records, or external tooling.

⸻

3. Solo-Founder Operating Model

LeaseMate is designed for one person supervising many workflows.

The operator should not need to manually manage every request.

The operator should only intervene when:

* automation cannot proceed
* a payment is overdue
* providers decline or expire
* no provider is available
* customer options need revision
* customer detail release fails
* a request is blocked
* a workflow is paused
* an exception is raised
* a manual override is required

Routine workflows should continue autonomously while remaining visible.

⸻

4. Core Operations Objects

The Operations Center must expose these core objects:

Customer

The renter submitting a move-out request.

Request / MoveRequest

The overall move-out package request.

Service Requirement

One required service within a move-out package.

Example:

* removalist
* end-of-lease cleaning
* carpet cleaning

Provider

The independent business that may accept an opportunity.

Provider Selection

The chosen or recommended provider for a service requirement.

Provider Invitation

The invitation sent to a provider for a specific request and service.

Introduction Fee

The fee payable by the provider after accepting.

Customer Release

The event where customer details are released after payment.

Exception

An issue requiring attention, review, or escalation.

Automation Task

A scheduled or executed automated workflow step.

Audit Event

An append-only record of important system, provider, customer, or operator activity.

⸻

5. Queue Architecture

The Operations Center must use queues as the primary operating model.

Queues must show both normal and problem workflows.

A workflow should not disappear from visibility simply because automation is handling it.

⸻

5.1 Active Requests Queue

Purpose:

Show all customer requests across all lifecycle states.

This is the master operational queue.

Required columns:

* request ID
* customer
* services requested
* current state
* provider state
* billing state
* customer release state
* next action
* SLA timer
* priority
* alerts
* created date
* last updated

Typical states:

* submitted
* matching
* matched
* provider invited
* awaiting provider response
* provider accepted
* payment pending
* payment received
* customer details released
* completed
* escalated
* paused
* cancelled

Operator should be able to open request detail from any row.

⸻

5.2 Provider Queue

Purpose:

Show provider invitation and response workflow.

Required columns:

* invitation ID
* request ID
* provider
* service category
* invitation status
* sent time
* response due
* response age
* response result
* payment state
* next action

Provider invitation states:

* draft
* not sent
* sent
* viewed
* awaiting response
* reminder sent
* accepted
* declined
* expired
* cancelled

Provider Queue should make slow, declined, or expired provider responses obvious.

⸻

5.3 Billing Queue

Purpose:

Show introduction fee status.

Billing is central because customer details are released only after payment.

Required columns:

* fee ID
* request ID
* provider
* service category
* fee amount
* fee status
* due time
* payment age
* reminder count
* customer release state
* next action

Billing states:

* not required
* fee created
* payment pending
* payment reminder sent
* payment overdue
* paid
* waived
* cancelled
* refunded

Accepted but unpaid provider opportunities must stay visible.

Nothing should leave Billing Queue until resolved.

⸻

5.4 Exceptions Queue

Purpose:

Show unresolved issues requiring attention or review.

Exception categories:

* no provider matched
* provider declined
* provider timeout
* all providers declined
* provider accepted but unpaid
* payment overdue
* customer needs new options
* automation failed
* manual review required
* data issue
* communication failure
* customer release failure

Required columns:

* exception ID
* request ID
* category
* severity
* created time
* age
* responsible actor
* suggested action
* status

Exception states:

* open
* acknowledged
* in progress
* waiting
* resolved
* closed

Exceptions should be sticky until resolved or closed.

⸻

5.5 Automation Queue

Purpose:

Show scheduled, running, completed, failed, and paused automation tasks.

This queue is critical because automation must be visible.

Required columns:

* automation ID
* request ID
* automation type
* current trigger
* scheduled execution time
* time remaining
* last run result
* next run
* status
* failure count

Automation states:

* scheduled
* running
* completed
* waiting
* failed
* paused
* cancelled

Automation examples:

* invite selected provider
* send provider reminder
* expire invitation
* invite next provider
* mark payment overdue
* send fee reminder
* escalate request

⸻

5.6 Audit Log

Purpose:

Provide append-only event history.

Audit Log should not be editable.

Audit events should include:

* event ID
* entity type
* entity ID
* event type
* actor type
* actor ID, if applicable
* timestamp
* previous state
* new state
* notes
* source

Actor types:

* customer
* provider
* operator
* automation
* payment system
* communication system
* system

⸻

5.7 System Health

Purpose:

Show whether the operating system is healthy.

System Health should summarise:

* active requests
* completed requests
* blocked requests
* escalated requests
* open exceptions
* critical exceptions
* scheduled automations
* failed automations
* overdue fees
* SLA breaches
* active providers
* paused providers
* total customer releases

⸻

6. Request Lifecycle

Core request lifecycle:

1. Submitted
2. Matching / Matched
3. Provider Invited
4. Awaiting Provider Response
5. Provider Accepted
6. Payment Pending
7. Payment Received
8. Customer Details Released
9. Completed

Exceptional states:

* declined
* expired
* escalated
* paused
* cancelled

Every request detail page must show:

* current state
* previous state
* next expected state
* next action
* next automation
* time remaining
* provider state
* billing state
* release state
* exceptions
* audit timeline

⸻

7. Provider Invitation Lifecycle

Provider invitation lifecycle:

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

Rules:

If accepted:

* create introduction fee
* move request to payment pending
* keep customer details hidden

If declined:

* record decline
* create audit event
* route to next provider where possible
* escalate if no provider remains

If expired:

* record expiry
* create audit event
* route to next provider where possible
* escalate if no provider remains

⸻

8. Payment Lifecycle

Payment lifecycle:

1. Not Required
2. Fee Created
3. Payment Pending
4. Payment Reminder Sent
5. Payment Overdue
6. Paid
7. Customer Details Released
8. Closed

Core rule:

Payment is the gate between provider acceptance and customer detail release.

No payment means no customer details.

Only exception:

A clearly recorded operator override may release details manually, but this should be exceptional and auditable.

⸻

9. Customer Release Lifecycle

Customer release lifecycle:

1. Not Eligible
2. Eligible After Payment
3. Released
4. Release Failed

Customer details should include only the information required for the provider to contact and service the customer.

The release event must be auditable.

The customer release state should be visible in:

* request detail
* provider opportunity flow
* billing queue
* audit log

⸻

10. Escalation Model

Default escalation flow:

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

Escalation reasons:

* provider did not respond
* provider declined
* provider accepted but did not pay
* all providers declined
* no provider matched
* customer package cannot be fulfilled
* automation failed
* data is incomplete
* manual decision required

Automation should attempt recovery first.

Operator should enter when automation cannot confidently progress the workflow.

⸻

11. SLA Model

The v1 SLA model should remain simple.

First Provider Invitation

Target:

* within 5 minutes of request submission in automated mode

Provider Response

Target:

* provider has 24 hours to respond before reminder

Provider Expiry

Target:

* if no response after 48 hours total, route to next provider or escalate

Payment

Target:

* provider pays within 24 hours after accepting

If unpaid after 24 hours:

* mark fee as overdue
* show sticky billing warning
* trigger reminder

Customer Update

Target:

* if selected providers cannot be secured, customer should be updated within 48 hours

⸻

12. Notification Model

Notifications are dashboard-first.

The prototype should model notification states visually.

Do not send real notifications in the frontend prototype.

Critical Notifications

Sticky until resolved.

Examples:

* no provider available
* all providers declined
* payment overdue
* automation failed
* customer request blocked
* customer release failed

Warning Notifications

Visible but non-blocking.

Examples:

* provider response nearing SLA
* payment due soon
* reminder scheduled
* multiple declines

Informational Notifications

Normal lifecycle updates.

Examples:

* request submitted
* provider invited
* provider accepted
* payment received
* customer details released
* request completed

⸻

13. Operator Actions

Operator actions should be available from the relevant request, provider, billing, automation, or exception context.

Request-Level Actions

* view request
* add internal note
* change priority
* pause workflow
* resume workflow
* cancel request
* mark as reviewed
* reopen request
* force escalation
* manually assign provider
* add alternative provider
* send customer update
* mark workflow complete

Provider-Level Actions

* view provider
* invite provider
* resend invitation
* send reminder
* mark provider declined
* mark provider unavailable
* suspend provider
* add provider note
* update provider category
* update provider capability

Billing-Level Actions

* view fee
* send payment reminder
* mark as paid manually
* waive fee
* cancel fee
* hold customer release
* release customer details after confirmed payment

Exception-Level Actions

* acknowledge exception
* assign status
* add note
* resolve exception
* reopen exception
* escalate manually

Automation-Level Actions

* pause automation
* resume automation
* retry automation
* cancel scheduled automation
* trigger next automation step
* view automation history

Prototype-only operator actions must be gated or clearly marked as demo-only.

⸻

14. Workflow Visibility Rules

Every workflow must expose:

* current state
* previous state
* next expected state
* next automated action
* time remaining
* responsible actor
* provider status
* billing status
* customer release status
* exceptions
* audit events

Nothing should change state silently.

All meaningful state changes must produce an audit event.

⸻

15. Automation Rules

Automation should perform routine workflow movement.

Automation may:

* invite selected provider
* send reminders
* expire invitations
* invite next provider
* mark payment overdue
* send fee reminder
* escalate blocked requests
* create audit events
* create exceptions

Automation must not:

* hide workflows
* release customer details before payment
* silently change state
* delete history
* remove operator visibility

In the prototype, automation is simulated.

In production, automation should move to backend queue, cron, or workflow engine.

⸻

16. Audit Rules

Audit history must be append-only.

Every important event must be recorded.

Examples:

* customer request created
* customer selected provider
* system recommended provider
* provider invitation sent
* provider accepted
* provider declined
* provider reminder sent
* introduction fee generated
* payment received
* customer details released
* operator override performed
* automation failed
* exception created
* exception resolved

No silent workflow changes.

No destructive audit edits.

⸻

17. System Health Model

System Health should help the solo operator answer:

* Are requests moving?
* Are providers responding?
* Are payments being completed?
* Are automations running?
* Are exceptions building up?
* Are any workflows blocked?
* Are SLAs being breached?

Health areas:

Request Health

* active requests
* completed requests
* blocked requests
* escalated requests
* average time to completion

Provider Health

* active providers
* pending provider responses
* provider acceptance rate
* provider decline rate
* provider timeout rate

Billing Health

* fees created
* fees paid
* fees overdue
* payment conversion rate
* average payment time

Automation Health

* automations scheduled
* automations completed
* automations failed
* paused automations

Queue Health

* Active Requests count
* Provider Queue count
* Billing Queue count
* Exceptions count
* Automation Queue count

⸻

18. Demo Mode Operating Rules

The current prototype is frontend-only and demo-mode driven.

Demo-only controls include:

* role switcher
* simulation controls
* advance-time controls
* mock payment controls
* operator deep links from customer pages
* automation ticker
* localStorage persistence

These must be gated or clearly marked as demo-only.

Demo mode must not be confused with real production auth or access control.

Future production must replace demo mode with:

* real authentication
* role-based permissions
* backend-controlled workflow transitions
* backend audit events
* real payment confirmation
* secure customer detail release

⸻

19. Production Replacement Map

Prototype operating element → future production replacement:

* mock store → database/API
* localStorage → persisted backend storage
* mock payment button → payment processor
* mock customer release → backend-controlled release event
* demo role switcher → real auth/RBAC
* automation ticker → backend queue/cron/workflow engine
* seed data → database migrations/seeds
* selectors → SQL views/API queries
* mock audit → append-only audit table
* simulated notifications → email/SMS/notification provider
* frontend-only route protection → server-backed permissions

⸻

20. Operating Non-Goals

Do not add to the frontend prototype:

* real payments
* real authentication
* real backend
* Supabase
* Stripe
* email/SMS
* external APIs
* real provider accounts
* real customer accounts
* quote bidding
* live booking calendar
* in-app chat
* production CRM
* production invoicing
* complex AI matching

These are future decisions after workflow validation.

⸻

21. Operating Success Criteria

The operating model is working when:

* all active workflows are visible
* autonomous workflows remain visible
* blocked workflows are obvious
* accepted but unpaid providers remain visible
* customer details are not released before payment
* exceptions are sticky until resolved
* audit history records state changes
* system health gives useful operational signals
* the solo operator can understand what needs action without searching through code or logs

⸻

22. Final Operating Summary

LeaseMate should operate as a full-visibility, automation-first coordination system.

The Operations Center is the operator’s control tower.

Automation moves routine work forward.

Queues organise operational attention.

Audit history preserves trust.

System Health shows whether the business is functioning.

The operator intervenes selectively, not constantly.