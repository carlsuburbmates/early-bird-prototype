LeaseMate Project Truth

Status

This document is the locked product truth for LeaseMate.

It should be treated as the source of truth for product direction, PRD work, Lovable prototype refinement, Codex Cloud tasks, local development, and future migration planning.

Do not reinterpret the product as a generic marketplace, generic directory, removalist company, cleaning company, booking platform, or quote-comparison website.

⸻

1. Working Concept

LeaseMate is a rental move-out coordination platform.

It helps renters organise and secure the services they need when leaving a rental property.

The platform coordinates introductions between renters and independent service providers.

The platform does not provide moving, cleaning, storage, handyman, rubbish removal, or utility services directly.

⸻

2. Business Category

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
* a generic directory
* a booking engine
* a job board
* an auction platform
* a property management platform

⸻

3. Target Customer

The primary customer is a renter moving out of a rental property.

This includes renters who are:

* ending a lease
* moving to another rental
* moving into a purchased property
* relocating
* downsizing
* managing end-of-lease requirements
* trying to coordinate multiple move-out services before final inspection

The initial geographic assumption is Australia, with practical early focus on Melbourne and surrounding suburbs.

⸻

4. Customer Problem

A renter moving out often needs several services at the same time, including:

* removalists
* end-of-lease cleaners
* carpet cleaners
* rubbish removal
* storage
* handyman repairs
* utility connection or disconnection

The current process is fragmented.

Renters usually have to:

* search across many websites
* request multiple quotes
* compare inconsistent pricing
* call or message several businesses
* explain the same details repeatedly
* track provider responses manually
* manage move-out timing under pressure
* estimate total move-out cost with poor information

The problem is not simply finding a provider.

The real problem is coordinating the full move-out process.

⸻

5. Customer Solution

LeaseMate lets the customer enter their move-out requirements once.

The platform then:

* understands the move-out need
* identifies relevant service categories
* recommends suitable providers
* shows estimated price ranges
* lets the customer build a move-out package
* coordinates provider introductions behind the scenes
* gives the customer visibility over request progress

The customer does not need to chase every supplier manually before submitting their preferred move-out package.

⸻

6. Core Customer Journey

Step 1 — Enter Move-Out Details

The renter enters:

* current suburb
* destination suburb
* property type
* bedrooms
* bathrooms
* move-out date
* service timing
* access notes
* additional requirements

Step 2 — Select Required Services

The renter selects one or more services:

* removalist
* end-of-lease cleaning
* carpet cleaning
* rubbish removal
* storage
* handyman
* utilities

Step 3 — Choose Package Mode

The renter can use either:

Recommended Package

The platform recommends providers for selected services.

Build My Own Package

The renter browses available providers and selects preferred providers manually.

Step 4 — Review Estimated Cost

The renter sees estimated price ranges for selected services and the total estimated package range.

These are not guaranteed final quotes.

Step 5 — Submit Package

The renter submits the move-out package.

Step 6 — Platform Coordinates Introductions

The platform contacts selected providers through the workflow.

The renter waits for provider acceptance or updated options.

⸻

7. Provider Model

Providers are independent businesses.

Provider categories include:

* removalists
* end-of-lease cleaners
* carpet cleaners
* rubbish removal providers
* storage providers
* handymen
* utility connection/disconnection partners

Providers maintain profiles that describe:

* business name
* service categories
* service areas
* property types serviced
* job sizes handled
* estimated pricing ranges
* availability
* capabilities
* business information

Provider profiles are not only marketing pages.

They are matching inputs.

⸻

8. Provider Workflow

A provider receives an opportunity showing:

* service category
* suburb/location context
* property details
* job summary
* requested service
* estimated scope
* introduction fee amount

The provider does not initially receive customer contact details.

The provider can:

* accept
* decline

If the provider declines, the platform may contact the next provider or escalate.

If the provider accepts, the provider must pay the introduction fee before customer details are released.

⸻

9. Introduction Rule

Customer details remain hidden until both conditions are met:

1. Provider accepts the opportunity.
2. Provider pays the introduction fee.

Only after payment does the platform release customer details.

Customer details may include:

* customer name
* phone
* email
* preferred contact method
* relevant job notes

This rule is central to the business model.

It prevents unpaid lead leakage.

⸻

10. Revenue Model

The primary revenue model is an exclusive introduction fee paid by providers.

The provider pays only after accepting a specific opportunity.

The platform sells:

Exclusive customer introductions.

The platform does not sell:

* the actual moving service
* the cleaning service
* the storage service
* advertising impressions
* quote competition
* general directory placement

Providers invoice customers directly after the introduction is completed.

⸻

11. Pricing Philosophy

LeaseMate shows estimated pricing ranges.

The platform does not generate final quotes.

The provider determines final service pricing.

Use wording such as:

* estimated range
* typical range
* expected range
* indicative cost

Avoid wording such as:

* guaranteed price
* final quote
* fixed cost
* book now for this price

The purpose of price ranges is to help renters make informed decisions before selecting providers.

⸻

12. Operations Philosophy

The operating model is:

Autonomous System + Full Visibility + Selective Intervention

This means:

* automation handles routine workflow steps
* the operator can see all workflows
* the operator intervenes only when needed
* autonomous workflows are still visible
* nothing disappears from the Operations Center until completed, cancelled, or closed

This is not an exception-only dashboard.

This is not a passive analytics dashboard.

The Operations Center is a live control surface.

⸻

13. Operations Center

The Ops surface is called:

Operations Center

It is not called:

* admin panel
* admin dashboard
* CMS
* back office

The Operations Center must show:

* active customer requests
* provider invitations
* provider responses
* introduction fee states
* payment pending items
* customer detail release state
* exceptions
* automations
* audit history
* system health

The operator must be able to understand what is happening without reading code or logs.

⸻

14. Queue Architecture

The Operations Center must include these queues:

Active Requests

All customer requests across lifecycle states.

Provider Queue

Provider invitations, responses, declines, expiries, and pending actions.

Billing Queue

Introduction fees, pending payments, paid items, overdue payments, waived/cancelled fees.

Exceptions Queue

Routing failures, provider issues, unpaid introductions, customer issues, workflow failures, automation failures.

Automation Queue

Scheduled actions, timers, reminders, automation status, failed automations.

Audit Log

Append-only event history.

System Health

Operational health overview across requests, providers, billing, automations, exceptions, and communications.

⸻

15. Request Lifecycle

Core request lifecycle:

1. Submitted
2. Matched
3. Provider Invited
4. Awaiting Provider Response
5. Provider Accepted
6. Payment Pending
7. Payment Received
8. Customer Details Released
9. Completed

Additional states may include:

* Declined
* Expired
* Escalated
* Paused
* Cancelled

Every state must be visible in Ops.

⸻

16. Escalation Logic

Default escalation concept:

Provider invited

↓

24 hours

↓

Reminder

↓

24 more hours

↓

Next provider

↓

No success

↓

Ops escalation

Automation attempts recovery first.

The operator enters when automation cannot confidently progress the workflow.

⸻

17. Audit Rule

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
* operator override performed
* automation failed

Audit history should be append-only.

No silent workflow changes.

⸻

18. Solo Founder Principle

LeaseMate is designed for one operator supervising many workflows.

The platform should:

* automate routine work
* surface important work
* show every workflow state
* make blocked items obvious
* allow operator intervention
* avoid requiring manual coordination of every request

The operator should not become a call centre.

⸻

19. Prototype Scope

The current prototype is frontend-only.

It uses:

* mock/local data
* simulated workflow state
* simulated automation
* mock payment actions
* demo mode
* Zustand store
* TanStack Start routes

The prototype must not include:

* Supabase
* Stripe
* real auth
* real email
* SMS
* external APIs
* production backend
* real provider accounts
* real customer accounts

⸻

20. Locked Decisions

The following decisions are locked:

1. LeaseMate is for renters moving out.
2. The product is a rental move-out coordination platform.
3. The platform coordinates introductions.
4. The platform does not provide services directly.
5. Customers can accept recommendations or build their own package.
6. Provider profiles include capabilities and estimated price ranges.
7. Prices shown are estimated ranges, not final quotes.
8. Providers accept or decline opportunities.
9. Customer details remain hidden until provider acceptance and introduction-fee payment.
10. Providers invoice customers directly after customer details are released.
11. Revenue is introduction-fee based.
12. The Ops surface is called Operations Center.
13. Operations model is autonomous system plus full visibility plus selective intervention.
14. Automated workflows must remain visible.
15. Nothing disappears until completed, cancelled, or closed.
16. Audit history is append-only.
17. Current prototype remains frontend-only until explicitly changed.

⸻

21. Non-Goals

Do not build in the current prototype:

* real payments
* real authentication
* real backend
* real customer/provider accounts
* live booking calendar
* reviews/ratings
* chat
* SMS
* complex AI matching
* dynamic pricing engine
* provider bidding
* quote marketplace behaviour
* production CRM
* production invoicing
* mobile app

These are out of scope until the workflow prototype is validated.

⸻

22. Final One-Sentence Definition

LeaseMate is a rental move-out coordination platform that helps renters build and manage a complete move-out service package while coordinating exclusive provider introductions through a fully visible, automation-first Operations Center.