# LeaseMate Workflows

## Document Status

Version: v1.0
Document type: User Workflow Specification
Project: LeaseMate
Canonical dependencies:

* `docs/SSOT.md`
* `docs/PRD.md`
* `docs/OPERATING_MODEL.md`

This document defines the expected end-to-end workflows for LeaseMate.

It is written to align with the approved product model:

> LeaseMate is a rental move-out service marketplace where renters build a Move-Out Cart from provider-listed service products with estimated price ranges, then LeaseMate coordinates payment-gated provider introductions.

This document should be read before `docs/WEBSITE_WIREFRAMES.md`.

The wireframes must materialise these workflows end to end.

---

# 1. Core Workflow Model

LeaseMate has three primary user groups:

1. Customer / renter
2. Provider
3. Operator

The core system flow is:

1. Providers list productised move-out service products.
2. Customers browse service products by category and move context.
3. Customers add selected service products to a Move-Out Cart.
4. Customers choose preferred and backup options where available.
5. Customers review estimated item ranges and total cart range.
6. Customers submit the cart as a coordination request.
7. LeaseMate routes each cart item to the relevant provider.
8. Provider accepts or declines.
9. If provider accepts, provider pays the introduction fee.
10. Customer details are released only after provider payment.
11. Provider contacts and invoices customer directly.
12. Operator supervises every state through the Operations Center.

---

# 2. User Types

## 2.1 Customer / Renter

A customer is a renter moving out of a rental property.

The customer uses LeaseMate to:

* enter move-out context
* browse productised move-out services
* compare estimated price ranges
* add service products to a Move-Out Cart
* select preferred and backup options
* submit one coordinated move-out request
* track request progress

The customer does not pay LeaseMate at cart submission.

The customer does not buy services directly through LeaseMate.

The customer is introduced to providers after provider acceptance and payment-gated release.

---

## 2.2 Provider

A provider is an independent business that lists move-out service products.

The provider uses LeaseMate to:

* create productised service listings
* define estimated price ranges
* define service criteria and catchments
* receive opportunities when customers select their products
* accept or decline opportunities
* pay an introduction fee after accepting
* receive customer details only after payment
* contact and invoice the customer directly

---

## 2.3 Operator

The operator supervises the marketplace and coordination workflow.

The operator uses the Operations Center to:

* see all customer requests
* see all submitted cart items
* monitor preferred and backup routing
* monitor provider invitations
* monitor billing and payment states
* monitor customer detail release states
* monitor automations
* resolve exceptions
* audit workflow history
* intervene selectively

The operator should not manually coordinate every request by default.

Automation should handle routine movement while remaining visible.

---

# 3. Core Objects

## 3.1 Service Product

A provider-listed productised move-out service.

Examples:

* `2-bedroom apartment move — Northcote to inner Melbourne`
* `2-bedroom apartment end-of-lease clean — inner north`
* `Small move-out rubbish removal — inner north`

A service product should include:

* product ID
* provider ID
* service category
* product title
* description
* service area / catchment
* property type eligibility
* bedroom / bathroom criteria where relevant
* pickup / destination catchment where relevant
* access assumptions
* included services
* excluded services
* add-ons
* estimated min price
* estimated max price
* availability / capacity notes
* active / paused status

Service products are the core marketplace unit.

---

## 3.2 Move-Out Cart

A customer-created package of selected service products.

The cart may include one or multiple service categories.

Each cart item represents a selected service product for one move-out need.

A cart item may include:

* service category
* preferred service product
* preferred provider
* backup service product, where available
* backup provider, where available
* estimated item range
* cart item status

The Move-Out Cart is not checkout.

It is a coordination request builder.

---

## 3.3 Cart Item

A cart item is one selected service need inside a Move-Out Cart.

Example:

| Service    | Preferred Product                                 | Backup Product                          | Estimated Range |
| ---------- | ------------------------------------------------- | --------------------------------------- | --------------- |
| Removalist | 2BR apartment move — Northcote to inner Melbourne | 2BR apartment move — inner north backup | $650–$1,100     |

After submission, each cart item becomes an operational service requirement.

Each cart item must be visible in Ops.

---

## 3.4 Provider Invitation

A request sent to a provider for a specific cart item.

A provider invitation relates to:

* request
* cart item
* service product
* provider
* preferred or backup position
* response state
* billing state after acceptance
* customer detail release state

---

## 3.5 Introduction Fee

The fee payable by the provider after accepting an opportunity.

The introduction fee must be paid before customer details are released.

---

## 3.6 Customer Release

The event where customer contact details are released to the provider after provider payment.

This is the point where the provider can contact and invoice the customer directly.

---

# 4. Workflow Principles

## 4.1 Marketplace Product Principle

LeaseMate is organised around provider-listed service products.

Customers browse service products, not generic provider profiles alone.

Provider profiles support trust and context, but service products are the transactional selection unit.

---

## 4.2 Move-Out Cart Principle

The customer builds a Move-Out Cart from service products.

The cart allows the customer to collect all selected move-out services in one place before submission.

The cart may include preferred and backup options per service need.

---

## 4.3 No Checkout Principle

The Move-Out Cart is not ecommerce checkout.

The customer does not pay LeaseMate when submitting the cart.

The cart submission creates a coordination request.

---

## 4.4 Estimated Range Principle

Service product prices are estimated ranges.

They are not final quotes.

They help the customer compare likely costs before selecting products.

The exact production pricing algorithm is not yet defined.

Expected principle:

> Service product estimated ranges are provider-defined and filtered or matched against renter move context.

---

## 4.5 Preferred / Backup Routing Principle

The preferred provider/product is contacted first.

If the preferred provider declines, expires, or cannot take the job, the backup option may be contacted.

If no option can fulfil the cart item, the item becomes unresolved and requires operator or customer update.

---

## 4.6 Payment-Gated Release Principle

Customer details remain hidden until:

1. provider accepts the opportunity
2. provider pays the introduction fee

No payment means no customer details, except a future explicit auditable operator override.

---

## 4.7 Full Visibility Principle

Every request, cart item, provider invitation, billing item, automation, exception, and release must remain visible in the Operations Center.

Automation must not hide work from the operator.

---

# 5. Public Visitor Workflows

## 5.1 Visitor Understands LeaseMate

### User

Public visitor, renter, or provider.

### Goal

Understand what LeaseMate does.

### Entry Routes

* `/`
* `/how-it-works`
* `/services`
* `/faq`

### Workflow

1. Visitor lands on homepage.
2. Visitor reads LeaseMate’s marketplace and coordination value proposition.
3. Visitor understands they can browse move-out service products.
4. Visitor understands the cart is for coordination, not checkout.
5. Visitor chooses one of:

   * start move-out planning
   * browse services
   * learn how it works
   * provider signup

### Completion

Visitor understands the product and chooses a next action.

---

## 5.2 Visitor Browses Service Categories

### User

Customer / renter.

### Goal

Understand available move-out service categories.

### Entry Route

* `/services`

### Workflow

1. Customer opens services page.
2. Customer sees service categories:

   * removalist
   * end-of-lease cleaning
   * carpet cleaning
   * rubbish removal
   * storage
   * handyman
   * utilities
3. Customer understands each category contains provider-listed service products.
4. Customer starts intake or continues browsing.

### Completion

Customer understands service categories and proceeds toward cart creation.

---

## 5.3 Provider Learns About Listing Products

### User

Potential provider.

### Goal

Understand provider participation.

### Entry Routes

* `/for-providers`
* `/provider-signup`

### Workflow

1. Provider opens provider page.
2. Provider learns they can list productised move-out services.
3. Provider learns products include estimated price ranges and criteria.
4. Provider learns customers may add those products to Move-Out Carts.
5. Provider learns they only pay after accepting an opportunity.
6. Provider starts signup.

### Completion

Provider submits or begins provider signup.

---

# 6. Customer Workflows

## 6.1 Customer Starts Move-Out Planning

### User

Customer / renter.

### Goal

Begin building a Move-Out Cart.

### Entry Route

* `/intake`

### Workflow

1. Customer clicks `Plan My Move-Out`.
2. Customer enters move context:

   * current suburb
   * destination suburb
   * property type
   * bedrooms
   * bathrooms
   * move-out date
   * preferred service date
   * access notes
   * special requirements
3. System uses move context to help filter relevant service products.
4. Customer proceeds to service category selection or marketplace browsing.

### State Created

* draft move-out request
* move context

### Completion

Customer can browse relevant productised services.

---

## 6.2 Customer Selects Service Categories

### User

Customer / renter.

### Goal

Choose needed service categories.

### Route

* `/intake`

### Workflow

1. Customer sees service category cards.
2. Customer selects one or more:

   * removalist
   * end-of-lease cleaning
   * carpet cleaning
   * rubbish removal
   * storage
   * handyman
   * utilities
3. Selected categories define the cart structure.
4. Customer proceeds to browse service products.

### State Created

* selected service categories
* empty cart item slots per selected category

### Completion

Customer has selected the service categories they want to fill.

---

## 6.3 Customer Browses Productised Service Listings

### User

Customer / renter.

### Goal

Compare relevant service products.

### Route

* `/intake`

### Workflow

1. Customer views productised service listings by category.
2. Listings are filtered or organised by move context where possible.
3. Each service product shows:

   * product title
   * provider name
   * service category
   * service area / catchment
   * property type fit
   * estimated price range
   * inclusions
   * exclusions
   * add-ons
   * availability / capacity note if available
4. Customer compares products.
5. Customer chooses products to add to cart.

### Completion

Customer has identified relevant products for one or more selected service categories.

---

## 6.4 Customer Adds Product to Move-Out Cart

### User

Customer / renter.

### Goal

Add a service product to the cart.

### Route

* `/intake`

### Workflow

1. Customer clicks `Add to Move-Out Cart` or equivalent.
2. Customer chooses whether the product is:

   * preferred option
   * backup option
3. Product appears in cart summary.
4. Cart item shows:

   * service category
   * selected product
   * provider
   * preferred/backup position
   * estimated range
5. Estimated cart total updates.

### State Created

* cart item
* product selection
* estimated cart range

### Completion

Product is added to cart.

---

## 6.5 Customer Selects Preferred and Backup Options

### User

Customer / renter.

### Goal

Reduce risk of provider unavailability.

### Route

* `/intake`

### Workflow

1. Customer selects preferred product/provider for a service.
2. Customer may select backup product/provider for the same service.
3. Cart shows both options.
4. Cart item status updates:

   * complete
   * missing backup
   * missing preferred option
5. Customer repeats for other service categories.

### Completion

Customer has preferred and backup routing options where available.

### Rule

Backup selection is strongly useful but may not be mandatory for every service if no reasonable backup exists.

---

## 6.6 Customer Reviews Move-Out Cart

### User

Customer / renter.

### Goal

Confirm selected products and estimated cost range.

### Route

* `/intake`

### Workflow

1. Customer opens cart review.
2. Customer sees:

   * move context summary
   * selected service categories
   * preferred products
   * backup products
   * provider names
   * estimated range per cart item
   * total estimated cart range
3. Customer sees clear notes:

   * prices are estimates
   * providers invoice directly
   * LeaseMate coordinates introductions
   * customer does not pay LeaseMate now
   * preferred option is contacted first
   * backup option may be contacted if preferred fails
   * customer details are shared only after provider acceptance and introduction-fee payment
4. Customer submits cart.

### State Created

* submitted Move-Out Cart
* customer request
* operational cart items / service requirements

### Completion

Cart becomes a coordination request.

---

## 6.7 Customer Receives Submission Confirmation

### User

Customer / renter.

### Goal

Understand what happens next.

### Route

* `/submitted/$id`

### Workflow

1. Customer lands on confirmation page.
2. Customer sees:

   * request ID
   * selected service products
   * preferred and backup options
   * estimated total range
   * next-step explanation
3. Customer understands LeaseMate will coordinate provider invitations.
4. Customer can open request status page.

### Completion

Customer understands the request was submitted and can track progress.

---

## 6.8 Customer Tracks Request Status

### User

Customer / renter.

### Goal

Track progress without seeing internal operations complexity.

### Route

* `/request/$id`

### Workflow

1. Customer opens request status.
2. Customer sees overall request status.
3. Customer sees per-service status:

   * preferred provider contacted
   * backup provider contacted
   * provider accepted
   * provider unavailable
   * alternative needed
   * introduction completed
4. Customer sees estimated cart range.
5. Customer sees next expected step in plain language.

### Hidden From Customer

* provider payment due time
* internal billing queue
* internal exception details
* operator notes
* audit internals
* automation internals
* operator controls unless explicitly demo-only

### Completion

Customer receives introduction or is told more options are needed.

---

# 7. Provider Workflows

## 7.1 Provider Creates Service Product

### User

Provider.

### Goal

List a productised move-out service.

### Route

* provider profile / provider product management route

### Workflow

1. Provider creates a service product.
2. Provider defines:

   * service category
   * product title
   * service area / catchment
   * property type eligibility
   * job criteria
   * included services
   * excluded services
   * add-ons
   * estimated min price
   * estimated max price
   * availability / capacity note
3. Provider saves product.
4. Product becomes active or paused.

### Completion

Service product can appear in marketplace listings if active.

---

## 7.2 Provider Views Opportunities

### User

Provider.

### Goal

See customer-selected product opportunities.

### Route

* `/provider`

### Workflow

1. Provider opens dashboard.
2. Provider sees opportunities where a customer selected one of their service products.
3. Provider sees:

   * service product
   * service category
   * customer move context
   * property details
   * service date
   * estimated scope
   * introduction fee
   * preferred or backup position if relevant
4. Provider opens opportunity detail.

### Completion

Provider chooses an opportunity to review.

---

## 7.3 Provider Reviews Opportunity

### User

Provider.

### Goal

Decide whether to accept.

### Workflow

1. Provider opens opportunity.
2. Provider sees job summary.
3. Provider sees selected service product context.
4. Provider sees introduction fee.
5. Provider does not see customer contact details.
6. Provider chooses accept or decline.

### Completion

Provider accepts or declines.

---

## 7.4 Provider Declines Opportunity

### User

Provider.

### Goal

Reject unsuitable opportunity.

### Workflow

1. Provider clicks decline.
2. Invitation state becomes declined.
3. Audit event is created.
4. If declined provider was preferred option, backup option may be invited.
5. If no backup exists, item becomes unresolved or escalated.

### Completion

Opportunity is declined and routing continues or escalates.

---

## 7.5 Provider Accepts Opportunity

### User

Provider.

### Goal

Accept opportunity and proceed to payment.

### Workflow

1. Provider clicks accept.
2. Invitation state becomes accepted.
3. Introduction fee is created.
4. Cart item/request moves to payment pending.
5. Customer details remain hidden.
6. Provider is shown payment-required state.

### Completion

Provider reaches payment-required state.

---

## 7.6 Provider Pays Introduction Fee

### User

Provider.

### Goal

Unlock customer details.

### Workflow

1. Provider views payment-required screen.
2. Provider sees fee amount.
3. Provider pays introduction fee.
4. Fee state becomes paid.
5. Customer release is created.
6. Customer details become visible.
7. Audit event is created.

### Completion

Provider receives customer details.

---

## 7.7 Provider Contacts Customer

### User

Provider.

### Goal

Contact and invoice customer directly.

### Workflow

1. Provider sees released customer details:

   * name
   * phone
   * email
   * preferred contact method
   * relevant job notes
2. Provider contacts customer outside LeaseMate.
3. Provider sends their own quote, invoice, booking confirmation, or service arrangement.

### Completion

LeaseMate introduction workflow is complete for that service product/cart item.

---

# 8. Operator Workflows

## 8.1 Operator Opens Operations Center

### User

Operator.

### Goal

Understand live marketplace coordination state.

### Route

* `/ops`

### Workflow

1. Operator opens Operations Center.
2. Operator sees summary:

   * active requests
   * submitted carts
   * active cart items
   * pending provider responses
   * pending payments
   * open exceptions
   * scheduled automations
   * system health indicators
3. Operator selects a queue or request to inspect.

### Completion

Operator understands where attention is needed.

---

## 8.2 Operator Monitors Active Requests

### User

Operator.

### Goal

See all customer requests.

### Route

* `/ops/requests`

### Workflow

1. Operator opens Active Requests.
2. Operator sees each submitted Move-Out Cart request.
3. Operator sees:

   * request state
   * customer
   * services selected
   * cart item count
   * provider state
   * billing state
   * release state
   * next action
   * SLA timer
   * alerts
4. Operator opens request detail if needed.

### Completion

Operator can identify whether request is moving, blocked, or completed.

---

## 8.3 Operator Reviews Cart Routing Matrix

### User

Operator.

### Goal

Understand routing per cart item.

### Route

* `/ops/requests/$id`

### Workflow

1. Operator opens request detail.
2. Operator sees cart routing matrix:

   * service category
   * selected product
   * provider
   * preferred/backup position
   * invitation state
   * billing state
   * customer release state
   * exception state
   * next action
3. Operator can identify:

   * preferred provider awaiting response
   * backup provider not yet contacted
   * provider accepted but unpaid
   * item released
   * item unresolved
   * item escalated

### Completion

Operator understands the state of every cart item.

---

## 8.4 Operator Monitors Provider Queue

### User

Operator.

### Goal

Track provider invitations and responses.

### Route

* `/ops/providers-queue`

### Workflow

1. Operator opens Provider Queue.
2. Operator sees invitations with:

   * invitation ID
   * request ID
   * cart item ID
   * service product
   * provider
   * service category
   * preferred/backup position
   * invitation status
   * response due
   * response age
   * payment state
   * next action
3. Operator identifies slow, declined, or expired invitations.
4. Operator opens request or provider if needed.

### Completion

Provider routing remains visible and actionable.

---

## 8.5 Operator Monitors Billing Queue

### User

Operator.

### Goal

Track introduction fees and customer detail release.

### Route

* `/ops/billing`

### Workflow

1. Operator opens Billing Queue.
2. Operator sees:

   * fee ID
   * request ID
   * cart item ID
   * service product
   * provider
   * service category
   * fee amount
   * fee status
   * due time
   * payment age
   * customer release state
   * next action
3. Operator identifies accepted but unpaid providers.
4. Operator takes action if required.

### Completion

Payment-gated release remains controlled and visible.

---

## 8.6 Operator Handles Exceptions

### User

Operator.

### Goal

Resolve blocked workflows.

### Route

* `/ops/exceptions`

### Workflow

1. Operator opens Exceptions Queue.
2. Operator sees unresolved issues:

   * no provider matched
   * provider declined
   * provider timeout
   * all providers declined
   * provider accepted but unpaid
   * payment overdue
   * customer needs new options
   * automation failed
   * customer release failure
3. Operator opens request detail.
4. Operator decides whether to:

   * contact backup provider
   * add more choices
   * customer update required
   * resolve exception
   * cancel item/request
   * manually override where allowed

### Completion

Exception is resolved, waiting, or escalated.

---

## 8.7 Operator Monitors Automation

### User

Operator.

### Goal

See scheduled and running automation.

### Route

* `/ops/automations`

### Workflow

1. Operator opens Automation Queue.
2. Operator sees automation tasks:

   * invite provider
   * send reminder
   * expire invitation
   * invite backup provider
   * mark payment overdue
   * escalate cart item
3. Operator sees status, scheduled time, last result, and failure state.
4. Operator may trigger, retry, pause, or resume where appropriate.

### Completion

Automation remains visible and controllable.

---

## 8.8 Operator Views Audit Log

### User

Operator.

### Goal

Verify what happened.

### Route

* `/ops/audit`

### Workflow

1. Operator opens Audit Log.
2. Operator reviews events by request, provider, cart item, or fee.
3. Operator verifies:

   * actor
   * timestamp
   * event
   * previous state
   * new state
   * notes/source

### Completion

Operator can reconstruct workflow history.

---

## 8.9 Operator Views System Health

### User

Operator.

### Goal

Understand whether the system is functioning.

### Route

* `/ops/health`

### Workflow

1. Operator opens System Health.
2. Operator sees:

   * active requests
   * active cart items
   * pending provider responses
   * overdue fees
   * open exceptions
   * failed automations
   * SLA breaches
   * active providers
   * paused products/providers
   * completed introductions
3. Operator investigates unhealthy signals.

### Completion

Operator understands platform health.

---

# 9. Automation Workflows

## 9.1 Preferred Provider Invitation

### Trigger

Customer submits Move-Out Cart.

### Workflow

1. System identifies preferred product/provider for each cart item.
2. System creates provider invitation.
3. Invitation state becomes sent.
4. Audit event is created.
5. Reminder or expiry automation is scheduled.

### Completion

Preferred provider is awaiting response.

---

## 9.2 Preferred Provider Declines or Expires

### Trigger

Preferred provider declines or does not respond in time.

### Workflow

1. Invitation becomes declined or expired.
2. Audit event is created.
3. System checks for backup option.
4. If backup exists, backup provider is invited.
5. If backup does not exist, exception is created.

### Completion

Workflow routes to backup or escalates.

---

## 9.3 Backup Provider Invitation

### Trigger

Preferred option fails and backup exists.

### Workflow

1. System creates invitation for backup product/provider.
2. Backup invitation state becomes sent.
3. Audit event is created.
4. Reminder or expiry automation is scheduled.

### Completion

Backup provider is awaiting response.

---

## 9.4 No Provider Can Fulfil Cart Item

### Trigger

Preferred and backup options fail, or no available provider exists.

### Workflow

1. Cart item becomes unresolved.
2. Exception is created.
3. Operator reviews.
4. Customer may be offered more choices.

### Completion

Operator or customer update is required.

---

## 9.5 Payment Overdue Automation

### Trigger

Provider accepted but introduction fee remains unpaid past SLA.

### Workflow

1. Fee becomes overdue.
2. Billing Queue updates.
3. Warning or exception is created.
4. Audit event is created.
5. Operator visibility is maintained.

### Completion

Payment remains unresolved until provider pays, fee is waived/cancelled, or operator handles it.

---

# 10. Billing and Release Workflow

## 10.1 Payment-Gated Release

### Trigger

Provider accepts opportunity.

### Workflow

1. Provider accepts invitation.
2. Introduction fee is created.
3. Customer details remain hidden.
4. Provider pays introduction fee.
5. Fee state becomes paid.
6. Customer release record is created.
7. Customer details become visible to provider.
8. Audit event is created.

### Completion

Provider has customer details and can contact customer directly.

### Hard Rule

No payment means no customer details, except explicit auditable operator override.

---

# 11. Pricing Range Workflow

## 11.1 Provider-Defined Estimated Ranges

### User

Provider.

### Goal

Define meaningful estimated price ranges for service products.

### Workflow

1. Provider creates service product.
2. Provider defines criteria:

   * service category
   * catchment
   * property type
   * bedroom/bathroom criteria where relevant
   * access assumptions
   * inclusions/exclusions
   * add-ons
3. Provider sets estimated min and max price.
4. Product appears with an estimated range.

### Completion

Service product has a visible estimated range.

---

## 11.2 Customer Sees Estimated Cart Range

### User

Customer.

### Goal

Understand expected cost range.

### Workflow

1. Customer adds service products to cart.
2. Each selected product contributes estimated min/max.
3. Cart shows estimated range per item.
4. Cart shows total estimated range.

### Rule

The total is not a final quote.

The exact production pricing algorithm remains a future decision.

---

# 12. Workflow-to-Wireframe Coverage Requirements

The website wireframes must support these workflows:

## Public

* understand product
* browse service categories
* provider learns about listing products

## Customer

* enter move context
* browse productised service products
* add products to Move-Out Cart
* choose preferred/backup options
* review estimated ranges
* submit cart
* track request status

## Provider

* create service products
* view opportunities
* accept/decline
* pay introduction fee
* receive customer details after payment

## Operator

* view Operations Home
* monitor active requests
* inspect cart routing matrix
* monitor provider queue
* monitor billing queue
* handle exceptions
* monitor automation
* view audit log
* view system health

---

# 13. Workflow Acceptance Criteria

The workflows are complete when:

* every user type has a defined journey
* provider-listed service products are represented as the marketplace unit
* Move-Out Cart is represented as the customer-facing differentiator
* customer can select service products, not just provider profiles
* customer can choose preferred and backup options where available
* estimated item ranges and total cart range are visible
* customer submission is not checkout
* customer does not pay LeaseMate at cart submission
* submitted cart items become operational service requirements
* preferred provider is contacted first
* backup provider is contacted if preferred option fails
* accepted provider must pay before customer details are released
* Ops can see routing state per cart item
* billing queue protects payment-gated release
* automation remains visible
* exceptions remain sticky until resolved
* audit history records meaningful state changes

---

# 14. Final Workflow Statement

LeaseMate workflows are built around provider-listed move-out service products and a customer Move-Out Cart.

Customers browse service products and submit a coordinated cart.

Providers accept and pay for exclusive introductions.

The operator supervises request, cart-item, provider, billing, automation, exception, and release states through a full-visibility Operations Center.
