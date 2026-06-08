LeaseMate PRD

Document Status

Version: v1.0
Document type: Product Requirements Document
Project: LeaseMate
Current phase: Frontend-only prototype / local-readiness cleanup
Canonical dependency: docs/PROJECT_TRUTH.md

This PRD merges the full product, workflow, operating model, prototype scope, and migration requirements for LeaseMate.

LeaseMate is a rental move-out coordination platform for renters who need to organise multiple services when leaving a rental property.

This document should guide:

* frontend prototype refinement
* Lovable-generated prototype evaluation
* Codex Cloud cleanup tasks
* local development setup
* future production rebuild planning
* Operations Center design
* workflow state modelling
* migration planning

Do not reinterpret LeaseMate as a generic marketplace, directory, quote-comparison website, booking engine, removalist company, cleaning company, or property management system.

⸻

1. Executive Summary

LeaseMate helps renters plan and coordinate the services needed when moving out of a rental property.

The platform helps renters:

* enter move-out requirements once
* understand likely cost ranges
* choose preferred providers
* build a move-out service package
* submit one coordinated request
* avoid contacting multiple businesses individually

The platform does not provide moving, cleaning, storage, handyman, rubbish removal, or utility services directly.

The platform coordinates exclusive introductions between renters and independent service providers.

A provider only receives the customer’s contact details after:

1. the provider accepts the opportunity
2. the provider pays the platform’s introduction fee

After the introduction fee is paid, the provider contacts the customer directly and sends their own quote, invoice, booking confirmation, or service arrangement.

The platform’s core value is not cheap quotes.

The core value is:

Helping renters build and coordinate a complete move-out service package with less chasing, less confusion, and better visibility over expected costs.

The operating model is:

Autonomous System + Full Visibility + Selective Intervention

Automation performs routine workflow execution.

The solo operator supervises everything through an Operations Center with complete visibility over customer requests, provider invitations, billing states, automation timers, exceptions, audit history, and system health.

⸻

2. Product Category

Primary Category

Rental Move-Out Coordination Platform

Secondary Category

Managed Introduction Platform

Internal Product Type

Workflow-orchestrated service coordination system

Not This

LeaseMate is not:

* a removalist company
* a cleaning company
* a storage provider
* a quote-comparison marketplace
* a generic business directory
* a public job board
* an auction platform
* a booking engine
* a property management platform
* a marketplace checkout platform

Why This Category Fits

Renters often need several services across a compressed move-out timeline.

LeaseMate exists to organise that multi-service need into one structured workflow.

⸻

3. Product Vision

The long-term vision is for LeaseMate to become the default place renters go when preparing to move out of a rental property.

The platform should make moving out feel less like a chaotic set of disconnected tasks and more like a structured plan.

A renter should be able to:

1. enter move-out details once
2. understand which services may be needed
3. see suitable providers
4. compare estimated price ranges
5. build a move-out package
6. submit once
7. let the platform coordinate introductions

A provider should receive warmer, more qualified, more exclusive opportunities than standard low-quality lead marketplaces.

The operator should be able to supervise many active workflows without manually chasing every provider or customer.

⸻

4. Core Business Definition

LeaseMate helps renters organise everything they need for moving out of a rental property by building a move-out service package and coordinating exclusive introductions with suitable providers through a fully visible, automation-first operations system.

⸻

5. Product Objectives

Customer Objectives

LeaseMate must let renters:

* understand what services they need
* submit move-out details once
* choose recommended providers or manually build a package
* view estimated cost ranges
* submit one coordinated request
* track request progress
* avoid supplier chasing before the introduction workflow begins

Provider Objectives

LeaseMate must let providers:

* receive structured opportunities
* see enough job context to accept or decline
* avoid seeing customer contact details before payment
* accept suitable opportunities
* decline unsuitable opportunities
* pay a mock introduction fee in prototype
* receive customer details only after payment
* view opportunity history

Operator Objectives

LeaseMate must let the solo operator:

* view all workflows
* see both autonomous and manual states
* track provider invitations
* track billing/payment states
* detect overdue or blocked items
* monitor automation timers
* handle exceptions
* view audit history
* understand system health
* intervene selectively

⸻

6. Customer Problem

Renters moving out often need to organise several services at the same time.

Common needs include:

* removalists
* end-of-lease cleaning
* carpet cleaning
* rubbish removal
* storage
* handyman repairs
* utility connection or disconnection

The current process is fragmented.

Renters usually have to:

* search Google repeatedly
* visit several different websites
* request multiple quotes
* compare inconsistent pricing
* take calls from different providers
* explain the same move details repeatedly
* track provider responses manually
* deal with uncertainty around total cost
* manage move-out deadlines under pressure

The most painful part is not only finding providers.

The painful part is coordinating everything while trying to leave the property properly, avoid delays, and reduce the risk of bond-related issues.

⸻

7. Customer Solution

LeaseMate gives renters one structured place to plan and coordinate their move-out.

The customer enters move-out details once.

The platform then:

* understands the move-out requirement
* shows relevant service categories
* recommends suitable providers
* displays estimated price ranges
* allows package creation
* coordinates provider introductions
* tracks workflow progress

The customer does not need to call every supplier before submitting their preferred package.

The platform handles the introduction workflow behind the scenes.

⸻

8. Target Customer

Primary Customer

Renters moving out of a rental property.

Initial Geographic Focus

Australia, with initial practical focus likely on Melbourne or a specific local launch area.

Relevant Customer Situations

The product is relevant when a renter is:

* moving to another rental
* moving into a purchased home
* ending a lease
* downsizing
* relocating for work
* moving out urgently
* organising end-of-lease cleaning
* coordinating services before final inspection
* unsure how much the move-out process may cost

Customer Mindset

The customer wants:

* less chasing
* less uncertainty
* clearer expected costs
* fewer phone calls
* a simple process
* providers that match their actual needs
* a coordinated move-out plan

⸻

9. Provider Customer

Provider Types

Initial provider categories:

1. removalists
2. end-of-lease cleaners
3. carpet cleaners
4. rubbish removal providers
5. storage providers
6. handymen
7. utility connection/disconnection partners

Provider Problem

Providers often receive low-quality, non-exclusive, poorly matched leads from marketplaces.

Common frustrations include:

* competing with too many providers
* receiving vague job details
* paying for weak leads
* speaking to customers who are not serious
* wasting time on jobs outside their area or capability
* chasing customers who are only collecting quotes

Provider Solution

LeaseMate gives providers exclusive, pre-qualified opportunities where the customer has already selected or accepted them as a preferred provider.

Providers only pay when they choose to accept the opportunity.

They do not pay just to be listed.

They do not pay for every view.

They do not pay for unqualified traffic.

They pay to unlock an exclusive customer introduction.

⸻

10. Core Value Propositions

For Renters

* plan move-out services in one place
* enter details once
* understand expected price ranges
* choose preferred providers
* avoid quote-chasing
* reduce coordination stress
* track request status
* get connected only when a provider accepts

For Providers

* receive pre-qualified opportunities
* avoid competing quote wars
* see job details before accepting
* pay only after choosing to accept
* receive exclusive customer introductions
* avoid low-fit requests
* build visibility in a move-out-focused channel

For the Operator

* full visibility over all workflows
* automation handles routine steps
* clear queues show what needs attention
* nothing disappears silently
* payments, provider status, customer status, exceptions, and automation are visible
* solo operation remains practical

⸻

11. Core Product Rules

Rule 1 — The Customer Does Not Directly Buy Services From the Platform

LeaseMate does not sell cleaning, moving, storage, handyman, rubbish removal, or utility services.

LeaseMate coordinates introductions.

Rule 2 — Providers Invoice Customers Directly

After customer details are released, the provider handles their own quote, invoice, booking, payment, and service delivery with the customer.

Rule 3 — Displayed Prices Are Estimated Ranges

The platform displays estimated price ranges, not guaranteed final quotes.

Final pricing is determined by the provider.

Rule 4 — Customer Details Stay Hidden Until Payment

Customer contact details are never revealed to a provider until the provider has accepted and paid the introduction fee.

Rule 5 — The Introduction Is Exclusive

A paid introduction should be treated as exclusive for that specific customer and service need.

Rule 6 — Workflow State Is the Source of Operational Truth

Every request, provider invitation, billing step, automation, exception, and release must have a visible state.

Rule 7 — Nothing Disappears Until Completed

Items do not vanish from the Operations Center just because automation is handling them.

Everything remains visible until lifecycle completion, cancellation, or explicit closure.

⸻

12. Service Categories

Launch service categories:

* removalist
* end-of-lease cleaning
* carpet cleaning
* rubbish removal
* storage
* handyman
* utilities

Each category must support:

* provider capability matching
* estimated price range display
* provider profile display
* provider invitation
* accept/decline workflow
* introduction fee
* customer detail release after payment

Customers may select one or multiple services.

The system must support multi-service move-out packages from day one.

⸻

13. Customer Journey

Step 1 — Landing / Start

Customer arrives on the website.

Primary message:

Move out without chasing every provider yourself.

Primary CTA:

Plan My Move-Out

Secondary CTA:

Join as a Provider

Homepage must explain:

* what the platform does
* who it is for
* what services are covered
* how the process works
* that providers are independent
* that prices are estimates
* that the platform coordinates introductions

⸻

Step 2 — Move-Out Intake

Required fields:

* current suburb
* destination suburb
* property type
* bedrooms
* bathrooms
* move-out date
* preferred service date
* access notes
* required services

Optional fields:

* stairs
* lift availability
* parking availability
* heavy items
* pets
* time sensitivity
* special instructions
* budget sensitivity
* whether the customer wants recommendations or manual choice
* preferred contact method

⸻

Step 3 — Service Selection

Customer chooses required services.

The UI should make it clear that customers can build a multi-service package.

Service cards should use plain-language descriptions.

⸻

Step 4 — Package Mode Selection

The customer has two paths.

Mode A — Recommended Package

The platform recommends providers for each selected service.

Customer sees:

* provider name
* service category
* estimated price range
* coverage area
* capability match
* short description
* why this provider fits
* option to accept recommended package
* option to swap provider

This mode is for customers who want simplicity.

Mode B — Build My Own Package

Customer browses provider options per service category.

Customer can compare providers based on:

* service area
* estimated pricing range
* property types serviced
* job size range
* availability indicator
* capability tags
* business summary
* optional trust signals

The customer adds preferred providers to their move-out package.

This mode is for customers who want control.

⸻

Step 5 — Package Review

Customer sees a package summary.

Example:

* Removalist: Provider A, estimated $700–$900
* End-of-lease cleaner: Provider B, estimated $350–$500
* Carpet cleaner: Provider C, estimated $120–$220
* Rubbish removal: Provider D, estimated $150–$300

Estimated total:

$1,320–$1,920

The total must be shown as an estimate range, not a guarantee.

Customer confirms:

* details are accurate
* they understand providers invoice directly
* they understand prices are estimated
* they consent to the platform coordinating introductions

⸻

Step 6 — Submission Confirmation

The system creates a customer request.

Customer sees:

* confirmation message
* request ID
* selected services
* current status
* explanation of what happens next
* link to request status page

Suggested wording:

We’ve received your move-out package. We’ll now begin coordinating with your selected providers. You’ll be updated when a provider accepts or if we need you to choose another option.

⸻

Step 7 — Request Tracking

Customer should be able to view a customer-facing request status page.

Possible customer-visible statuses:

* request submitted
* contacting providers
* provider accepted
* provider unavailable
* alternative needed
* introduction completed

Customer-facing status page should show:

* request ID
* current status
* selected services
* estimated package range
* simplified timeline
* next expected step
* status explanation

Customer should not see internal billing details.

Customer should not see provider payment workflow.

Customer should not see operator controls unless demo mode is enabled.

⸻

14. Provider Journey

Step 1 — Provider Profile Creation

Required fields:

* business name
* contact name
* email
* phone
* ABN or business identifier, if applicable
* service categories
* service areas
* property types serviced
* typical job sizes
* estimated price ranges
* availability notes
* business description
* terms acknowledgement

Optional fields:

* website
* insurance details
* licence details, if relevant
* photos
* reviews
* preferred job types
* excluded job types
* minimum job value
* lead response preference

⸻

Step 2 — Provider Capability Profile

Each provider must define what they can actually handle.

Capabilities may include:

* suburbs serviced
* property types
* bedroom ranges
* access limitations
* job complexity
* service timing
* price range
* add-on services

Provider profiles are matching inputs, not just marketing content.

⸻

Step 3 — Opportunity Received

Provider receives an opportunity.

Provider sees:

* service category
* customer suburb
* destination suburb, if relevant
* property type
* bedrooms
* bathrooms
* move-out date
* service date
* job summary
* estimated job scope
* platform introduction fee
* accept button
* decline button

Provider does not see:

* customer full name
* phone number
* email
* exact address, unless intentionally allowed later
* other private customer details

⸻

Step 4 — Provider Decision

Provider chooses:

* accept
* decline

If provider declines:

* system records decline
* audit event is created
* system may route to another provider
* if no provider remains, request escalates

If provider accepts:

* invitation state becomes accepted
* introduction fee is created
* opportunity enters payment-required state
* customer details remain hidden

⸻

Step 5 — Introduction Fee Payment

After acceptance, provider sees:

Pay introduction fee to unlock customer details.

For prototype:

* payment is simulated
* provider clicks mock payment button
* fee state becomes paid
* customer details are released

For production:

* payment must later connect to a real payment provider

⸻

Step 6 — Customer Details Released

After payment, provider sees:

* customer name
* customer phone
* customer email
* relevant job details
* notes
* preferred contact method

Provider then contacts the customer directly.

Provider sends their own formal quote, invoice, booking confirmation, or service arrangement.

⸻

Step 7 — Provider History

Provider should be able to see:

* opportunities received
* accepted opportunities
* declined opportunities
* paid introductions
* released customer details
* completed introductions
* outstanding introduction fees

⸻

15. Revenue Model

Primary Revenue

Exclusive introduction fees paid by providers.

Payment Trigger

Provider pays only after accepting a specific opportunity.

Release Rule

Customer details are released only after payment.

Fee Structure

For v1 planning and prototype, use category-based fixed fees.

Suggested planning assumptions:

* removalist: $25–$40
* end-of-lease cleaning: $15–$25
* carpet cleaning: $10–$20
* rubbish removal: $10–$25
* handyman: $10–$30
* storage: $10–$25
* utility connection: referral or partner commission model

These are assumptions only and require validation.

Why Fixed Fees First

Fixed fees are simpler for:

* prototype
* provider understanding
* billing logic
* Ops visibility
* avoiding disputes over job value

Percentage-based fees should not be used in v1.

⸻

16. Pricing Philosophy

LeaseMate shows estimated price ranges.

LeaseMate does not guarantee final prices.

Providers determine final pricing.

Use wording such as:

* estimated range
* typical range
* expected range
* indicative cost

Avoid wording such as:

* guaranteed price
* final quote
* fixed cost
* book now for this amount

Provider Pricing Inputs

Providers should define estimated ranges for common job types.

Example for end-of-lease cleaning:

* 1-bedroom apartment: $250–$350
* 2-bedroom apartment: $350–$500
* 3-bedroom house: $500–$750

Example for removalists:

* 1-bedroom apartment: $350–$600
* 2-bedroom apartment: $600–$900
* 3-bedroom house: $900–$1,500

Example for rubbish removal:

* small load: $100–$200
* medium load: $200–$400
* large load: $400+

Display Rule

Always show price as a range.

Never show a single exact figure unless the provider has explicitly defined a fixed-price service.

⸻

17. Operations Philosophy

The Operations Center is the core control surface.

The operating philosophy is:

Autonomous System + Full Visibility + Selective Intervention

This means:

* automation handles routine routing, reminders, state changes, billing triggers, and escalation preparation
* the operator can see everything
* the operator only needs to act when a workflow requires intervention
* automated workflows are still visible while running
* no active process is hidden from the operator

This is not exception-only monitoring.

It is not a black-box automation system.

It is a full visibility control center.

⸻

18. Operations Center Definition

Name

Operations Center

Not Called

* Admin Dashboard
* Admin Panel
* CMS
* Back Office

Why

“Admin dashboard” implies content management or manual CRUD.

“Operations Center” implies:

* workflow visibility
* live state tracking
* queue management
* intervention
* escalation
* system health
* auditability

That is the correct framing for this platform.

⸻

19. Operations Center Navigation

Recommended navigation:

1. Home
2. Active Requests
3. Provider Queue
4. Billing Queue
5. Exceptions Queue
6. Automation Queue
7. Providers
8. Customers
9. Audit Log
10. System Health
11. Settings

For current prototype route coverage, the app should support:

Public:

* /
* /how-it-works
* /services
* /for-providers
* /provider-signup
* /faq

Customer:

* /intake
* /request/$id
* /submitted/$id

Provider:

* /provider

Ops:

* /ops
* /ops/requests
* /ops/providers-queue
* /ops/billing
* /ops/exceptions
* /ops/automations
* /ops/providers
* /ops/customers
* /ops/audit
* /ops/health

⸻

20. Queue Architecture

20.1 Active Requests Queue

Purpose:

Show every customer request, regardless of whether automation is handling it or operator action is needed.

Columns:

* request ID
* customer
* services requested
* current state
* provider status
* billing status
* next action
* SLA timer
* priority
* created date
* last update
* alerts

States shown:

* submitted
* matched
* provider invited
* awaiting provider response
* provider accepted
* payment pending
* payment received
* customer released
* completed
* escalated
* paused
* cancelled

This is the master operational queue.

⸻

20.2 Provider Queue

Purpose:

Show provider-side actions and states.

Columns:

* provider
* service category
* request ID
* invitation status
* response due
* response age
* accepted/declined/expired
* payment status
* last contact
* next action

Provider invitation states:

* not sent
* sent
* viewed
* reminder due
* accepted
* declined
* expired
* cancelled

⸻

20.3 Billing Queue

Purpose:

Show every introduction fee.

Columns:

* fee ID
* provider
* request ID
* service category
* amount
* status
* due time
* payment age
* reminder count
* next action

Billing states:

* not required
* fee created
* payment pending
* paid
* overdue
* cancelled
* refunded
* waived

Accepted but unpaid opportunities must remain visible.

Nothing disappears from this queue until resolved.

⸻

20.4 Exceptions Queue

Purpose:

Show unresolved problems requiring attention or review.

Exception categories:

* no provider matched
* provider declined
* provider timeout
* provider accepted but unpaid
* payment failed
* customer needs new options
* automation failed
* manual review required
* data issue
* communication failure

Columns:

* exception ID
* request ID
* severity
* category
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

⸻

20.5 Automation Queue

Purpose:

Show scheduled and running automation.

This is critical for solo-founder visibility.

Columns:

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

Example visible automation:

Request #1042 — Invite Provider 2 in 18h 32m if Provider 1 does not respond.

⸻

21. Request Lifecycle

Core lifecycle:

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

Lifecycle Definitions

Submitted

Customer has submitted the move-out package.

Matching / Matched

System has identified suitable provider options.

Provider Invited

The selected or recommended provider has been invited.

Awaiting Provider Response

Provider has not yet accepted or declined.

Provider Accepted

Provider has accepted the opportunity.

Payment Pending

Provider must pay the introduction fee.

Payment Received

Payment has been completed.

Customer Details Released

Customer details have been released to the provider.

Completed

The platform introduction workflow is complete.

⸻

22. Provider Invitation Lifecycle

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

Key Rules

If accepted:

* create introduction fee
* move to payment pending
* do not release customer details yet

If declined:

* route to next provider or escalate

If expired:

* route to next provider or escalate

⸻

23. Payment Lifecycle

1. Not Required
2. Fee Created
3. Payment Pending
4. Payment Reminder Sent
5. Payment Overdue
6. Paid
7. Customer Details Released
8. Closed

Key Rule

Payment is the gate between provider acceptance and customer detail release.

No payment means no customer details.

⸻

24. Customer Release Lifecycle

1. Not Eligible
2. Eligible After Payment
3. Released
4. Release Failed

Customer details must not be released unless the related introduction fee is paid or manually resolved under an explicit operator override.

⸻

25. Escalation Logic

Standard Flow

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

Practical Interpretation

The system should attempt recovery automatically before requiring operator action.

The operator should be alerted when automation can no longer progress the workflow confidently.

Escalation Reasons

* provider did not respond
* provider declined
* provider accepted but did not pay
* no suitable provider remains
* customer package cannot be fulfilled
* automation failed
* data is incomplete
* manual decision required

⸻

26. SLA Model

The SLA model should be simple in v1.

Customer Request SLA

First provider invitation should be sent quickly after submission.

Target:

* within 5 minutes in automated mode
* immediately visible in Operations Center

Provider Response SLA

Provider has 24 hours to respond before reminder.

Provider Reminder SLA

Reminder sent after 24 hours.

Provider Expiry SLA

If no response after 48 hours total, move to next provider or escalate.

Payment SLA

Provider should pay within 24 hours after accepting.

If unpaid after 24 hours:

* mark payment as overdue
* show sticky billing warning
* trigger reminder

If unpaid after further delay:

* operator review or route to alternative provider

Customer Update SLA

If selected providers cannot be secured, customer should receive an update after the defined routing window.

Suggested initial target:

* customer updated within 48 hours if the original package cannot be fulfilled

⸻

27. Notification Model

Notification Principle

Dashboard-first.

Notifications should be visible in the Operations Center before relying on external channels.

Prototype should model notification states visually.

Do not send real notifications in the frontend prototype.

Notification Levels

Critical

Sticky until resolved.

Examples:

* no provider available
* payment overdue
* automation failed
* customer request blocked
* customer details release failed

Warning

Visible but non-blocking.

Examples:

* provider response nearing SLA
* payment due soon
* reminder scheduled
* multiple provider declines

Informational

Normal lifecycle updates.

Examples:

* request submitted
* provider invited
* provider accepted
* payment received
* customer details released
* request completed

⸻

28. Operator Actions

The operator must be able to intervene without leaving the request detail page.

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

Prototype-only controls must be gated or clearly marked demo-only.

⸻

29. Workflow Visibility Requirements

Every request detail page must show:

* customer summary
* selected services
* provider choices
* current lifecycle state
* previous state
* next expected state
* next automation
* time remaining
* billing status
* customer release status
* exceptions
* timeline
* internal notes
* available actions

Timeline Example

* 08:00 — Customer request submitted
* 08:01 — System matched providers
* 08:02 — Provider A invited
* 08:03 — Email simulated
* 14:30 — Provider A accepted
* 14:31 — Introduction fee created
* 14:32 — Payment link shown
* 15:05 — Payment received
* 15:06 — Customer details released
* 15:07 — Request marked completed

Automation must not silently change state without audit history.

⸻

30. Audit Model

Audit history is append-only.

No silent changes.

Every important event should be recorded.

Audit Event Examples

* customer created request
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

Audit Event Fields

Each audit event should include:

* event ID
* related request ID
* related provider ID, if applicable
* related customer ID, if applicable
* event type
* actor type
* actor ID, if available
* timestamp
* previous state
* new state
* notes
* system source

Actor types:

* customer
* provider
* operator
* automation
* payment system
* communication system
* system

⸻

31. System Health

The Operations Center must include a System Health module.

Health Areas

Request Health

* active requests
* completed requests
* escalated requests
* requests blocked
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
* retry count
* paused automations

Communication Health

* emails simulated
* email failures simulated, if relevant
* SMS simulated later if used
* notifications pending

Queue Health

* Active Requests count
* Provider Queue count
* Billing Queue count
* Exceptions count
* Automation Queue count

Prototype Health Metrics

Current prototype should expose:

* total requests
* active requests
* completed requests
* cancelled requests
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

32. Information Architecture

Core Entities

Customer

Represents renter.

Fields:

* customer ID
* name
* email
* phone
* current suburb
* destination suburb
* preferred contact method
* created date

Request / MoveRequest

Represents move-out package request.

Fields:

* request ID
* customer ID
* property details
* move date
* required services
* current state
* priority
* SLA timer
* created date
* updated date

Service Requirement

Represents one requested service within a request.

Fields:

* service requirement ID
* request ID
* service category
* details
* estimated range
* status

Provider

Represents business.

Fields:

* provider ID
* business name
* service categories
* service areas
* capability profile
* pricing ranges
* status
* created date

Provider Selection

Represents customer’s chosen provider for a service.

Fields:

* selection ID
* request ID
* service requirement ID
* provider ID
* rank
* selected by customer or system
* status

Provider Invitation

Represents invitation sent to provider.

Fields:

* invitation ID
* request ID
* provider ID
* service requirement ID
* status
* sent time
* response time
* expiry time

Introduction Fee

Represents provider fee.

Fields:

* fee ID
* invitation ID
* provider ID
* request ID
* amount
* status
* due time
* paid time

Customer Release

Represents release of customer details.

Fields:

* release ID
* request ID
* provider ID
* fee ID
* released time
* release status

Exception

Represents operational issue.

Fields:

* exception ID
* request ID
* category
* severity
* status
* created time
* resolved time

Automation Task

Represents scheduled or running automation.

Fields:

* automation ID
* request ID
* type
* status
* scheduled time
* completed time
* failure reason

Audit Event

Represents append-only event history.

Fields:

* event ID
* entity type
* entity ID
* event type
* actor
* timestamp
* previous state
* new state
* notes

Request Note

Represents operator notes attached to a request.

Fields:

* note ID
* request ID
* actor
* note
* created time

⸻

33. Technical Mock Architecture

The current prototype is frontend-only.

Expected mock architecture:

* src/mock/types.ts
* src/mock/seed.ts
* src/mock/store.ts
* src/mock/selectors.ts
* src/mock/automation.ts
* src/mock/useAutomationTicker.ts
* src/mock/demo.ts

File Responsibilities

src/mock/types.ts

Defines TypeScript entity types and enums.

src/mock/seed.ts

Defines deterministic demo data.

src/mock/store.ts

Defines Zustand store, state mutations, and mock workflow actions.

src/mock/selectors.ts

Defines pure selectors for derived views such as billing queue, overdue fees, blocked requests, provider metrics, customer list, and system health.

src/mock/automation.ts

Defines simulated automation transitions.

src/mock/useAutomationTicker.ts

Runs due mock automation jobs in demo mode.

src/mock/demo.ts

Defines demo mode and gates demo-only behaviour.

⸻

34. Component Structure

Components should be organised by domain:

* src/components/customer
* src/components/provider
* src/components/ops
* src/components/shared

Route files should remain thin where practical.

Route files should primarily:

* define the route
* set metadata
* import and render domain components

Business logic should not be buried inside route files or UI components.

Derived workflow logic should live in selectors or mock workflow modules.

⸻

35. Screen Inventory

Public Website

Home

Purpose:

Explain the platform and direct renters to start.

Modules:

* Hero
* How it works
* Services covered
* Why it is different
* For providers CTA
* FAQ

How It Works

Explains:

* enter move details
* choose services
* select providers
* platform coordinates
* provider accepts
* provider pays introduction fee
* customer details released

Services

Shows categories:

* removalists
* end-of-lease cleaning
* carpet cleaning
* rubbish removal
* storage
* handyman
* utilities

Request Help / Intake

Customer form.

Provider Signup

Provider registration page.

⸻

Customer Screens

Move-Out Intake

Collects request details.

Service Selection

Customer selects required services.

Recommended Package

Shows system-recommended providers.

Build My Own Package

Allows provider browsing and selection.

Package Review

Shows selected providers and estimated total.

Submission Confirmation

Confirms request submitted.

Request Status

Shows customer-visible status.

⸻

Provider Screens

Provider Dashboard

Shows opportunities and history.

Opportunity Detail

Shows job summary and accept/decline actions.

Payment Required

Shows introduction fee payment requirement.

Customer Details Released

Shows customer contact details after payment.

Provider Profile

Shows service areas, pricing ranges, categories, and capabilities.

⸻

Operations Center Screens

Operations Home

Summary of live operational state.

Active Requests

Master queue.

Request Detail

Full workflow timeline and action center.

Provider Queue

Provider invitation and response queue.

Billing Queue

Introduction fee status queue.

Exceptions Queue

Operational issue queue.

Automation Queue

Scheduled and running automation view.

Provider Management

Provider profiles and performance.

Customer Management

Customer request history.

Audit Log

Append-only event history.

System Health

Operational health overview.

⸻

36. Low-Fidelity Operations Layout

Operations Home

Sections:

* critical items
* active requests
* provider responses pending
* payments pending
* exceptions open
* automations scheduled
* system health summary

Active Requests Table

Columns:

* request ID
* customer
* services
* state
* next action
* SLA
* priority
* alerts

Request Detail Layout

Left panel:

* customer
* request summary
* services selected
* provider selections

Center panel:

* workflow timeline
* current state
* next state
* next automation

Right panel:

* actions
* alerts
* notes
* billing status
* exceptions

Automation Queue

Rows:

* request
* automation type
* next run
* status
* last result
* action

Billing Queue

Rows:

* provider
* request
* fee amount
* status
* due time
* reminder count
* action

⸻

37. Prototype Scope

The current prototype should remain frontend-only.

No:

* Supabase
* Stripe
* authentication
* real email
* SMS
* external APIs
* Lovable backend integrations
* production database
* real payments
* real accounts

Use:

* mock data
* local state
* simulated workflow transitions
* demo mode
* mock payment
* mock customer release

Prototype Must Demonstrate

Customer:

* intake form
* service selection
* recommended package
* build-my-own package
* package review
* submission confirmation
* status screen

Provider:

* opportunity screen
* accept/decline
* mock payment required
* mock payment complete
* customer details revealed only after payment

Ops:

* Active Requests queue
* Provider Queue
* Billing Queue
* Exceptions Queue
* Automation Queue
* Request Detail timeline
* Audit Log
* Provider Management
* Customer Management
* System Health

Prototype Should Include Mock Data

At minimum:

* 10 customer requests
* 20 providers
* multiple service categories
* multiple workflow states
* pending payments
* completed introductions
* declined providers
* timeout examples
* escalation examples
* automation scheduled examples

Seeded scenarios should include:

* happy path
* provider decline then reroute
* invitation expired
* payment overdue
* no provider matched
* paused workflow
* cancelled request
* all providers declined
* details released but not completed
* completed request

⸻

38. Demo Mode Requirements

Demo-only controls must be gated or clearly marked demo-only.

Demo-only surfaces include:

* role switcher
* simulation controls
* advance-time controls
* mock payment controls
* operator deep links from customer pages
* automation ticker
* localStorage persistence

Use src/mock/demo.ts or equivalent demo flag/helper.

In production, demo mode must be removed, disabled, or replaced by real auth and backend workflow controls.

⸻

39. Non-Goals for v1 Prototype

Do not build:

* real payments
* real emails
* real authentication
* real provider onboarding approval
* SMS
* reviews
* ratings
* live chat
* customer-provider messaging
* mobile app
* complex AI matching
* dynamic pricing engine
* subscription billing
* provider bidding
* public quote comparison
* real booking calendar
* marketplace checkout
* production CRM
* production invoicing

These are not needed to validate the workflow.

⸻

40. Prototype Acceptance Criteria

Customer Acceptance

The prototype is acceptable when:

* customer can start intake
* customer can enter move-out details
* customer can select services
* customer can view estimated package
* customer can submit package
* customer can view request status
* customer does not see internal billing workflow
* customer does not see operator controls unless demo mode is active

Provider Acceptance

The prototype is acceptable when:

* provider can view opportunity
* provider can accept
* provider can decline
* accepted opportunity requires mock payment
* customer details are hidden before payment
* customer details reveal after payment

Operator Acceptance

The prototype is acceptable when:

* operator can view all active requests
* operator can open request detail
* operator can see provider state
* operator can see billing state
* operator can see exceptions
* operator can see automations
* operator can see audit history
* operator can see system health
* operator can trigger demo-only actions
* autonomous and manual workflows are both visible

Technical Acceptance

The prototype is acceptable when:

* app builds locally
* main routes import cleanly
* demo mode is explicit
* no backend services are added
* no external APIs are added
* no hard-coded colours are added
* route files remain thin where practical
* mock logic remains migration-friendly
* selectors remain pure where practical

⸻

41. Local / GitHub Migration Acceptance Criteria

Before moving from Lovable prototype to full local/GitHub-first continuation:

* root metadata uses LeaseMate branding
* no active Lovable external reporting exists
* build passes, or blockers are clearly documented
* main routes import cleanly
* demo controls remain gated
* no backend integrations are added
* docs are saved in repo
* workflow states are validated
* customer flow is validated
* provider flow is validated
* Ops Center model is validated
* payment-gated release rule is validated
* mock data model is accepted as future database reference
* selectors are accepted as future API/query reference
* prototype runs locally

⸻

42. Production Replacement Map

Prototype element → future production replacement:

* mock store → database/API
* localStorage → persisted backend storage
* mock payment button → Stripe or payment processor
* mock customer release → backend-controlled release event
* demo role switcher → real auth/RBAC
* automation ticker → backend queue/cron/workflow engine
* seed data → database migrations/seeds
* selectors → SQL views/API queries
* mock audit → append-only audit table
* mock provider/customer views → authenticated portals
* simulated notifications → email/SMS/notification provider
* frontend-only route protection → server-backed permissions

⸻

43. Documentation Requirements

The repo should include:

* docs/PROJECT_TRUTH.md
* docs/PRD.md
* docs/OPERATING_MODEL.md
* docs/LOVABLE_WORKSPACE_KNOWLEDGE.md
* docs/CODEX_CLOUD_TASKS.md
* docs/MIGRATION_NOTES.md
* README_LOCAL.md

README_LOCAL.md should include:

* project purpose
* frontend-only warning
* install command
* dev command
* build command
* typecheck/lint commands if available
* demo mode explanation
* where mock types live
* where seed data lives
* where Zustand store lives
* where selectors live
* where workflow/automation logic lives
* what must be replaced during production migration
* warning that Supabase, Stripe, auth, email/SMS are intentionally not connected

⸻

44. Locked Decisions

The following are locked for v1 planning:

1. Product is for renters moving out.
2. Product is a rental move-out coordination platform.
3. Product coordinates introductions.
4. Product does not provide services directly.
5. Customer can use recommended package or build their own.
6. Provider profiles include capabilities and estimated price ranges.
7. Customer sees estimated price ranges, not final quotes.
8. Provider accepts or declines opportunities.
9. Customer details remain hidden until provider pays.
10. Provider invoices customer directly after details are released.
11. Revenue is introduction-fee based.
12. Ops surface is called Operations Center.
13. Operations model is autonomous system plus full visibility plus selective intervention.
14. All workflows must be visible, including automated workflows.
15. Nothing disappears until completed or closed.
16. Audit trail is append-only.
17. Prototype should be frontend-only with mock data.
18. No backend integrations should be added until explicitly decided later.

⸻

45. Open Decisions

These are not blockers for prototype but must be resolved before production:

1. final brand name
2. initial city or suburb launch area
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
13. whether storage is treated as provider introduction or affiliate referral
14. whether customer exact address is collected upfront or later
15. whether customers can cancel after provider acceptance
16. how disputes are handled after introduction
17. final production backend architecture
18. final payment provider
19. final communication provider
20. final operations permission model

⸻

46. Highest-Risk Areas

Risk 1 — Provider Willingness to Pay

The business depends on providers accepting the model:

Pay to unlock exclusive customer details after accepting the opportunity.

Validation required.

Risk 2 — Price Range Accuracy

If displayed price ranges are too inaccurate, customers may lose trust.

Risk 3 — Provider Response Speed

If providers do not respond within the expected window, customer experience suffers.

Risk 4 — Ops Overload

If automation is weak, the solo operator becomes the bottleneck.

Risk 5 — Workflow Confusion

If request states are unclear, the Operations Center becomes unreliable.

Risk 6 — Payment-Gated Release

If providers resist paying before customer details are revealed, conversion may suffer.

Risk 7 — Agent Drift

AI builders or coding agents may expand scope, add backend services, or reinterpret the product unless repo documentation is explicit.

Risk 8 — Prototype Lock-In

Prototype logic must not be tied to Lovable-only systems or hidden integrations.

⸻

47. Success Metrics

Customer Metrics

* intake completion rate
* package submission rate
* recommended package acceptance rate
* build-my-own usage rate
* customer update time
* customer drop-off by screen
* request status page visits

Provider Metrics

* provider invitation acceptance rate
* provider decline rate
* provider timeout rate
* introduction fee payment rate
* average time to accept
* average time to pay
* provider repeat usage

Ops Metrics

* active request count
* escalation rate
* average request completion time
* automation success rate
* manual intervention rate
* payment overdue count
* exception resolution time
* blocked request count
* SLA breach count

Business Metrics

* introductions completed
* introduction fees collected
* revenue per request
* customer request volume
* provider acquisition rate
* provider activation rate
* provider repeat acceptance rate

⸻

48. Production Build Direction

After prototype validation, the eventual production system should use a real backend and database.

Likely future architecture:

* frontend web app
* backend database
* provider/customer auth
* payment integration
* email integration
* workflow state engine
* audit event table
* Operations Center

However, the prototype should not prematurely connect to backend services.

The prototype’s purpose is to validate:

* screens
* workflows
* queue design
* operational visibility
* state transitions
* customer experience
* provider experience
* payment-gated release logic
* solo operator control model

⸻

49. Agent / Codex Guardrails

When using Lovable, Codex, Cursor, OpenCode, or other AI coding agents:

Agents must not:

* rebuild the app
* change the product concept
* add backend services
* add Supabase
* add Stripe
* add auth
* add external APIs
* redesign the UI broadly
* change design tokens
* hard-code colours
* bury workflow logic in UI components
* remove demo-mode separation
* remove mock migration seams

Agents may:

* fix build errors
* fix import errors
* improve documentation
* improve route reachability
* improve component separation
* improve metadata
* improve migration clarity
* improve mock selectors
* improve demo-only gating
* improve local-readiness

⸻

50. Final PRD Summary

LeaseMate must demonstrate a complete rental move-out coordination workflow where renters build a service package, providers accept and pay for exclusive introductions, and the operator supervises all autonomous and manual workflow states through a full-visibility Operations Center.

This PRD is complete for the current frontend prototype and local-readiness phase.

It is not a production engineering specification.

Production backend, payments, auth, communications, legal terms, provider verification, and commercial validation remain future decisions.