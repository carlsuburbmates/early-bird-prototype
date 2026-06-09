# LeaseMate Ops Center Spec

## Document Status

Version: v1.0
Document type: Operations Center Specification
Project: LeaseMate
Canonical dependencies:

* `docs/SSOT.md`
* `docs/PRD.md`
* `docs/OPERATING_MODEL.md`
* `docs/WORKFLOWS.md`
* `docs/WEBSITE_WIREFRAMES.md`

This document defines the Operations Center as an implementation-ready operational control surface.

It bridges the product model, workflows, and wireframes into exact Ops requirements: queues, states, columns, alerts, actions, detail panels, cross-links, and acceptance criteria.

---

# 1. Ops Center Purpose

The LeaseMate Operations Center exists to let the operator supervise and control the marketplace coordination workflow.

It must show:

* submitted Move-Out Carts
* cart items / service requirements
* provider-listed service products
* preferred and backup routing
* provider invitations
* provider response state
* introduction fee state
* customer detail release state
* exceptions
* automations
* audit history
* system health

The Operations Center is not a CMS.

It is not a generic admin dashboard.

It is not a passive reporting screen.

It is the control surface for the workflow system.

---

# 2. Core Operating Principle

The Operations Center must follow:

> Autonomous System + Full Visibility + Selective Intervention

This means:

* automation performs routine workflow movement
* the operator sees all workflow states
* operator action is required only when needed
* autonomous workflows remain visible
* failed or blocked workflows are sticky
* payment-gated release is protected
* audit history records meaningful changes

The operator should not manually coordinate every request by default.

---

# 3. Ops Non-Goals

The Operations Center must not become:

* unrestricted CRUD admin
* content management system
* analytics-only dashboard
* black-box automation monitor
* hidden developer log viewer
* customer support inbox replacement
* provider CRM replacement
* production payment processor UI
* production email/SMS platform

It may expose operational controls, but those controls must be workflow-bounded and auditable.

---

# 4. Core Ops Objects

## 4.1 Request

A submitted Move-Out Cart coordination request.

Represents the customer’s full move-out package.

## 4.2 Cart Item / Service Requirement

One selected move-out service within a submitted Move-Out Cart.

Each cart item is the main operational unit.

Example:

* Removalist service product
* End-of-lease cleaning product
* Carpet cleaning product

## 4.3 Service Product

A provider-listed productised move-out service.

Example:

* `2-bedroom apartment move — Northcote to inner Melbourne`

## 4.4 Provider

The business that listed the service product.

## 4.5 Provider Invitation

The invitation sent to a provider for a cart item.

## 4.6 Introduction Fee

The fee created after provider acceptance.

## 4.7 Customer Release

The release of customer details after provider payment.

## 4.8 Exception

A workflow problem requiring review, waiting state, or operator action.

## 4.9 Automation Task

A scheduled or completed system action.

## 4.10 Audit Event

Append-only record of state changes and important events.

---

# 5. Ops Navigation

The Operations Center must expose these sections:

1. Home
2. Active Requests
3. Request Detail
4. Provider Queue
5. Billing Queue
6. Exceptions Queue
7. Automation Queue
8. Providers
9. Customers
10. Audit Log
11. System Health

Recommended routes:

```text
/ops
/ops/requests
/ops/requests/$id
/ops/providers-queue
/ops/billing
/ops/exceptions
/ops/automations
/ops/providers
/ops/customers
/ops/audit
/ops/health
```

---

# 6. Ops Home

## Purpose

Give the operator a live operational summary.

## Required Modules

### Critical Items Panel

Shows sticky items requiring review.

Examples:

* blocked cart items
* payment overdue
* failed automation
* customer release failed
* all providers declined
* no provider matched

### Summary Cards

Must include:

* active requests
* active cart items
* pending provider responses
* pending payments
* overdue payments
* open exceptions
* failed automations
* SLA breaches
* completed introductions

### Recent Activity

Shows latest audit events.

### Quick Links

Links to:

* Active Requests
* Provider Queue
* Billing
* Exceptions
* Automations
* Health

## Required Behaviour

Ops Home must show both normal workflow load and urgent issues.

It must not show only failures.

---

# 7. Active Requests Queue

## Purpose

Master queue for all submitted Move-Out Cart requests.

## Required Columns

* Request ID
* Customer
* Move context
* Cart item count
* Services selected
* Overall request state
* Provider routing state
* Billing state
* Customer release state
* Exception state
* Next action
* SLA status
* Priority
* Alerts
* Created date
* Last updated

## Request States

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

## Required Filters

* request state
* service category
* billing state
* provider state
* release state
* exception state
* SLA state
* priority
* created date

## Row Actions

* open request
* view customer
* view cart items
* view exceptions
* view audit

## Acceptance Rule

Every submitted Move-Out Cart must appear in Active Requests until completed, cancelled, or explicitly closed.

---

# 8. Request Detail

## Purpose

Show and control one submitted Move-Out Cart.

This is the most important Ops screen.

## Required Layout

Three-panel layout:

1. Left panel: customer and request context
2. Center panel: cart routing matrix and timeline
3. Right panel: actions, alerts, billing, exceptions, notes

---

## 8.1 Left Panel

### Customer Summary

Show:

* customer name
* email
* phone
* preferred contact method
* current suburb / catchment
* destination suburb / catchment
* submitted date

### Move Context

Show:

* property type
* bedrooms
* bathrooms
* move-out date
* preferred service date
* access notes
* stairs / lift / parking
* special requirements

### Cart Summary

Show:

* service count
* estimated cart range
* cart item states
* completed items
* unresolved items

---

## 8.2 Center Panel

### Cart Routing Matrix

This is mandatory.

Columns:

* Service category
* Cart item ID
* Service product
* Provider
* Preferred / Backup position
* Invitation state
* Billing state
* Customer release state
* Exception state
* SLA / due time
* Next action

Example:

```text
Service | Product | Provider | Position | Invitation | Billing | Release | Exception | Next Action
Removalist | 2BR apartment move | Northside Movers | Preferred | Awaiting response | Not required | Locked | None | Wait 18h
Cleaning | 2BR EOL clean | Sparkle Clean | Preferred | Accepted | Payment pending | Locked | Payment overdue | Send reminder
Rubbish | Small rubbish removal | Haul Away | Backup | Sent | Not required | Locked | None | Await response
```

### Workflow Timeline

Show chronological events:

* cart submitted
* preferred provider invited
* provider reminder sent
* provider accepted
* introduction fee created
* payment overdue
* payment received
* customer details released
* cart item completed
* exception created
* operator override executed

### Current State Summary

Show:

* overall request state
* highest-severity cart item state
* next system action
* next operator action, if required

---

## 8.3 Right Panel

### Action Panel

Actions must be contextual and workflow-bounded.

Possible actions:

* pause request
* resume request
* cancel request
* mark reviewed
* add internal note
* trigger next automation
* send provider reminder
* invite backup provider
* resolve exception
* reopen exception
* mark fee paid manually
* waive fee
* hold customer release
* release customer details after confirmed payment
* customer update required

### Alerts Panel

Show:

* critical alerts
* warning alerts
* informational alerts

### Billing Summary

Show:

* pending fees
* overdue fees
* paid fees
* waived/cancelled fees

### Exceptions Summary

Show:

* open exceptions
* acknowledged exceptions
* waiting exceptions
* resolved exceptions

### Notes

Show internal operator notes.

---

# 9. Provider Queue

## Purpose

Track provider invitations and response workflow.

## Required Columns

* Invitation ID
* Request ID
* Cart Item ID
* Service Product
* Provider
* Service Category
* Preferred / Backup position
* Invitation status
* Sent time
* Response due
* Response age
* Response result
* Payment state
* Next action

## Invitation States

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

## Required Filters

* invitation status
* preferred / backup position
* service category
* provider
* response due
* overdue
* accepted but unpaid
* declined
* expired

## Row Actions

* open request
* open provider
* send reminder
* invite backup
* mark unavailable
* cancel invitation

## Acceptance Rule

Provider Queue must show whether an invitation is for the preferred option or backup option.

---

# 10. Billing Queue

## Purpose

Protect payment-gated customer detail release.

## Required Columns

* Fee ID
* Request ID
* Cart Item ID
* Service Product
* Provider
* Service Category
* Preferred / Backup position
* Fee amount
* Fee status
* Due time
* Payment age
* Reminder count
* Customer release state
* Next action

## Fee States

* not required
* fee created
* payment pending
* payment reminder sent
* payment overdue
* paid
* waived
* cancelled
* refunded

## Required Filters

* fee status
* overdue
* provider
* service category
* preferred / backup
* customer release state
* due date

## Row Actions

* open request
* open provider
* send payment reminder
* mark paid manually
* waive fee
* cancel fee
* hold release
* release after confirmed payment

## Hard Rule

Accepted but unpaid provider opportunities must remain visible.

No customer details are released unless fee state is paid or an explicit auditable operator override exists.

---

# 11. Exceptions Queue

## Purpose

Show blocked or abnormal workflows.

## Required Columns

* Exception ID
* Request ID
* Cart Item ID
* Service Product
* Provider, if applicable
* Category
* Severity
* Status
* Created time
* Age
* Responsible actor
* Suggested action
* Next action

## Exception Categories

* no provider matched
* provider declined
* provider timeout
* all providers declined
* provider accepted but unpaid
* payment overdue
* customer needs more options
* automation failed
* customer release failed
* data issue
* manual review required
* communication failure

## Exception States

* open
* acknowledged
* in progress
* waiting
* resolved
* closed

## Severity Levels

### Critical

Blocks workflow or risks lead leakage.

Examples:

* customer release failed
* unpaid accepted provider
* no provider matched
* all providers declined
* automation failed

### Warning

Needs attention but does not fully block yet.

Examples:

* provider nearing SLA
* payment due soon
* backup missing

### Informational

Normal but notable workflow event.

Examples:

* provider declined
* backup invited
* reminder sent

## Row Actions

* open request
* acknowledge
* add note
* resolve
* reopen
* escalate
* customer update required

## Acceptance Rule

Exceptions must remain visible until resolved or closed.

---

# 12. Automation Queue

## Purpose

Make automation visible and controllable.

## Required Columns

* Automation ID
* Request ID
* Cart Item ID
* Automation type
* Trigger condition
* Scheduled time
* Time remaining
* Status
* Last run result
* Failure count
* Next action

## Automation Types

* invite preferred provider
* send provider reminder
* expire invitation
* invite backup provider
* mark payment overdue
* send fee reminder
* create exception
* escalate cart item
* customer update required

## Automation States

* scheduled
* running
* completed
* waiting
* failed
* paused
* cancelled

## Row Actions

* open request
* trigger now
* retry
* pause
* resume
* cancel

## Acceptance Rule

Automation must not be hidden.

Every scheduled or failed automation should be visible until completed, cancelled, or archived under a clear rule.

---

# 13. Provider Management

## Purpose

Monitor provider network and product supply.

## Required Columns

* Provider ID
* Business name
* Categories
* Catchments
* Active service products
* Paused service products
* Provider status
* Invitation count
* Acceptance rate
* Decline rate
* Timeout rate
* Outstanding fees
* Last activity

## Provider States

* active
* paused
* suspended
* pending review
* inactive

## Row Actions

* open provider
* view products
* view opportunities
* pause provider
* add note
* review performance

---

# 14. Customer Management

## Purpose

View customer/request history.

## Required Columns

* Customer ID
* Name
* Email
* Phone
* Suburb / catchment
* Active requests
* Completed requests
* Cancelled requests
* Last request
* Status

## Row Actions

* open customer
* open active request
* open request history

---

# 15. Audit Log

## Purpose

Provide append-only workflow history.

## Required Columns

* Timestamp
* Event ID
* Entity type
* Entity ID
* Request ID
* Cart Item ID, if applicable
* Actor type
* Actor ID, if applicable
* Event type
* Previous state
* New state
* Notes
* Source

## Actor Types

* customer
* provider
* operator
* automation
* payment system
* communication system
* system

## Required Filters

* request ID
* cart item ID
* provider
* customer
* actor type
* event type
* date range
* entity type

## Acceptance Rule

Audit events must not be editable from the UI.

No silent state changes.

---

# 16. System Health

## Purpose

Help the operator understand whether the workflow system is healthy.

## Required Health Cards

* active requests
* active cart items
* completed introductions
* blocked cart items
* pending provider responses
* overdue fees
* open exceptions
* critical exceptions
* scheduled automations
* failed automations
* SLA breaches
* active providers
* paused providers
* active service products
* paused service products

## Required Tables

### Provider Metrics

Columns:

* provider
* active products
* invitations
* accepted
* declined
* expired
* acceptance rate
* timeout rate
* fees paid
* outstanding fees

### SLA Breaches

Columns:

* request
* cart item
* service product
* provider
* SLA type
* due time
* overdue duration
* next action

### Automation Failures

Columns:

* automation ID
* request
* cart item
* type
* failure reason
* retry count
* next action

---

# 17. Alert Model

## 17.1 Critical Alerts

Critical alerts must be sticky until resolved.

Examples:

* no provider matched
* all providers declined
* provider accepted but unpaid past SLA
* payment overdue
* automation failed
* customer release failed
* cart item blocked

## 17.2 Warning Alerts

Warning alerts are visible but non-blocking.

Examples:

* provider nearing response SLA
* payment due soon
* backup option missing
* multiple provider declines

## 17.3 Informational Alerts

Informational alerts show normal workflow movement.

Examples:

* cart submitted
* provider invited
* reminder sent
* provider accepted
* payment received
* customer details released

---

# 18. SLA Model

## Provider Response SLA

Provider has 24 hours to respond before reminder.

## Provider Expiry SLA

If no response after 48 hours total, route to backup provider or escalate.

## Payment SLA

Provider should pay within 24 hours after accepting.

If unpaid after 24 hours:

* mark payment overdue
* show sticky billing warning
* trigger reminder or operator review

## Customer Update SLA

If selected providers cannot fulfil a cart item, the customer should receive an update or more choices within the defined routing window.

Initial target:

* within 48 hours if the original cart item cannot be fulfilled

---

# 19. State Badge Rules

State badges must be consistent across Ops screens.

## Request State Badges

* submitted
* matching
* provider invited
* awaiting response
* accepted
* payment pending
* released
* completed
* escalated
* paused
* cancelled

## Cart Item State Badges

* not started
* preferred invited
* preferred declined
* preferred expired
* backup invited
* accepted
* payment pending
* paid
* released
* completed
* unresolved
* escalated
* cancelled

## Invitation State Badges

* draft
* sent
* viewed
* awaiting response
* reminder sent
* accepted
* declined
* expired
* cancelled

## Billing State Badges

* not required
* fee created
* payment pending
* overdue
* paid
* waived
* cancelled
* refunded

## Release State Badges

* locked
* eligible
* released
* release failed

## Automation State Badges

* scheduled
* running
* completed
* failed
* paused
* cancelled

---

# 20. Cross-Linking Rules

Ops objects must cross-link.

## Required Cross-Links

From request:

* customer
* cart items
* provider invitations
* fees
* exceptions
* automations
* audit events

From cart item:

* request
* service product
* provider
* invitation
* fee
* release
* exception
* audit trail

From provider queue:

* request
* provider
* service product
* cart item
* billing state

From billing queue:

* request
* provider
* service product
* cart item
* release state

From exception:

* request
* cart item
* provider if applicable
* automation if applicable
* audit events

From audit log:

* related request
* related cart item
* related provider
* related fee
* related exception

---

# 21. Operator Action Rules

## 21.1 All Actions Must Be Contextual

Actions should appear where they make sense.

Example:

* payment actions appear in Billing Queue and Request Detail
* provider reminder appears in Provider Queue and Request Detail
* exception actions appear in Exceptions Queue and Request Detail

## 21.2 All Meaningful Actions Must Create Audit Events

Examples:

* pause request
* resume request
* send reminder
* invite backup
* mark fee paid
* waive fee
* release details
* resolve exception
* cancel request

## 21.3 Destructive Actions Must Require Confirmation

Examples:

* cancel request
* cancel fee
* waive fee
* release customer details manually
* close unresolved exception

## 21.4 Manual Overrides Must Be Explicit

Manual override should require:

* reason
* actor
* timestamp
* affected entity
* audit event

---

# 22. Request Detail Acceptance Criteria

Request Detail is complete when it shows:

* customer summary
* move context
* submitted cart summary
* cart routing matrix
* preferred and backup provider states
* provider invitation states
* billing states
* release states
* exceptions
* automations
* audit timeline
* next action
* operator action panel
* internal notes
* current alerts

If Request Detail does not show cart-item routing, it is incomplete.

---

# 23. Ops Center Acceptance Criteria

The Operations Center is acceptable when:

* every submitted Move-Out Cart appears in Active Requests
* every submitted cart item is visible operationally
* preferred and backup routing is visible
* provider invitations show response state
* accepted providers with unpaid fees remain visible
* customer detail release state is visible
* customer details are not released before payment
* unresolved exceptions are sticky
* automation tasks are visible
* failed automations are visible
* audit events record meaningful state changes
* system health shows operational risk
* operator can identify what needs action without reading code/logs
* normal autonomous workflows are visible, not only failures
* request detail contains a cart routing matrix
* queues cross-link to related objects

---

# 24. Final Ops Center Statement

The LeaseMate Operations Center is a cart-item workflow control surface.

It must let the operator supervise every submitted Move-Out Cart, every provider-listed service product selected by the customer, every preferred/backup routing attempt, every provider invitation, every introduction fee, every customer detail release, every exception, every automation, and every audit event.

The Operations Center exists to make a solo-operated, automation-first marketplace practical without hiding the workflow.

---

# 25. Prototype Implementation Note

The current frontend prototype now models service products and cart items as first-class mock entities. Ops routes should use the cart-item routing matrix, provider queue, billing queue, provider supply/coverage, health metrics, automations, exceptions, and audit history as mock/demo views of the approved model. This remains in-browser demo data only; it does not add backend services, real payments, auth, SMS/email, external APIs, or production integrations.
