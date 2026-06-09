# LeaseMate Website Wireframes

## Document Status

Version: v1.0
Document type: Website Wireframe Specification
Project: LeaseMate
Canonical dependencies:

* `docs/SSOT.md`
* `docs/PRD.md`
* `docs/OPERATING_MODEL.md`
* `docs/WORKFLOWS.md`

This document defines the required website pages, routes, layout structures, and screen modules for LeaseMate.

It is written to support the approved product model:

> LeaseMate is a rental move-out service marketplace where renters build a Move-Out Cart from provider-listed service products with estimated price ranges, then LeaseMate coordinates payment-gated provider introductions.

This document must support the workflows defined in `docs/WORKFLOWS.md`.

---

# 1. Wireframe Principles

## 1.1 Marketplace First

The customer-facing experience should look and behave like a service marketplace.

Customers browse provider-listed move-out service products, compare estimated ranges, and add products to a Move-Out Cart.

The product should not be framed primarily as a platform-generated recommendation tool.

---

## 1.2 Cart, Not Checkout

The Move-Out Cart is not ecommerce checkout.

The customer does not pay LeaseMate when submitting the cart.

The cart creates a coordinated provider-introduction request.

Avoid customer-facing labels such as:

* checkout
* buy now
* pay now
* purchase service

Use labels such as:

* Add to Move-Out Cart
* Choose Preferred Option
* Choose Backup Option
* Review Cart
* Submit Move-Out Cart

---

## 1.3 Productised Services

Providers list service products.

A service product is more specific than a generic provider profile.

Example:

`2-bedroom apartment move — Northcote to inner Melbourne`

A service product should clearly show:

* provider
* service category
* product title
* estimated price range
* catchment / service area
* property fit
* inclusions
* exclusions
* add-ons
* availability or capacity notes where available

---

## 1.4 Estimated Ranges Only

All prices shown to customers are estimated ranges.

They are not final quotes.

The UI must clearly say:

* estimated range
* final price confirmed by provider
* provider invoices directly

---

## 1.5 Payment-Gated Release

Customer details are hidden from providers until:

1. provider accepts the opportunity
2. provider pays the introduction fee

The provider-facing and Ops-facing wireframes must make this rule visible.

---

## 1.6 Operator Full Visibility

The Operations Center must show every workflow state.

It must show both:

* autonomous workflows
* workflows requiring operator input

It must not be exception-only.

---

# 2. Route Map

## 2.1 Public Routes

* `/`
* `/how-it-works`
* `/services`
* `/services/$category`
* `/for-providers`
* `/provider-signup`
* `/faq`

## 2.2 Customer Routes

* `/intake`
* `/cart`
* `/cart/review`
* `/submitted/$id`
* `/request/$id`

If implementation keeps cart steps inside `/intake`, that is acceptable, but the wireframe model still treats cart building and review as distinct screens.

## 2.3 Provider Routes

* `/provider`
* `/provider/products`
* `/provider/products/new`
* `/provider/products/$id`
* `/provider/opportunities/$id`
* `/provider/opportunities/$id/pay`
* `/provider/opportunities/$id/released`
* `/provider/profile`

If implementation keeps provider opportunity states inside `/provider`, that is acceptable, but the workflow states must still be visually represented.

## 2.4 Operations Routes

* `/ops`
* `/ops/requests`
* `/ops/requests/$id`
* `/ops/providers-queue`
* `/ops/billing`
* `/ops/exceptions`
* `/ops/automations`
* `/ops/providers`
* `/ops/customers`
* `/ops/audit`
* `/ops/health`

---

# 3. Global Navigation

## 3.1 Public Header

Visible on public and customer-facing pages.

Layout:

```text
[LeaseMate Logo]

[Nav]
- Services
- How It Works
- For Providers
- FAQ

[Primary CTA]
Plan My Move-Out
```

Primary CTA:

* `Plan My Move-Out` → `/intake`

Secondary CTA:

* `Join as Provider` → `/for-providers`

---

## 3.2 Customer Header

Visible on customer workflow pages.

Layout:

```text
[LeaseMate Logo]

[Progress Indicator]
Move Details → Services → Products → Cart → Submit

[Cart Summary Button]
Move-Out Cart: X items | Estimated $min–$max
```

Rules:

* Cart summary should remain visible during product selection.
* Customer should not see Ops controls.
* Customer should not see provider payment state.
* Customer should not see internal billing or audit state.

---

## 3.3 Provider Navigation

Visible on provider pages.

Layout:

```text
[Provider Sidebar]

- Dashboard
- Opportunities
- Service Products
- Profile
- History
```

Purpose:

Providers must be able to manage productised service listings and respond to opportunities.

---

## 3.4 Operations Navigation

Visible on Ops pages.

Layout:

```text
[Ops Sidebar]

- Home
- Active Requests
- Provider Queue
- Billing
- Exceptions
- Automations
- Providers
- Customers
- Audit Log
- System Health
```

Top bar:

```text
[Critical Alerts] [Pending Payments] [Failed Automations] [SLA Breaches]
```

---

# 4. Public Website Wireframes

## 4.1 Home

Route:

* `/`

Purpose:

Explain LeaseMate as a move-out service marketplace and coordination platform.

Layout:

```text
[Header]

[Hero]
Headline:
Build your move-out service cart without chasing every provider.

Subtext:
Browse removalists, cleaners, rubbish removal, storage, handyman help and utilities. Add what you need to your Move-Out Cart, review estimated ranges, and let LeaseMate coordinate provider introductions.

Primary CTA:
Plan My Move-Out

Secondary CTA:
List Your Services

[Marketplace Preview]
Cards:
- Removalist products
- End-of-lease cleaning products
- Carpet cleaning products
- Rubbish removal products
- Storage products
- Handyman products
- Utilities products

[How It Works Summary]
1. Enter move context
2. Browse service products
3. Add products to your Move-Out Cart
4. Submit one coordinated request
5. Providers accept and contact you after introduction

[Why It Is Different]
- Productised move-out services
- Estimated ranges before submission
- Preferred and backup options
- No checkout at cart submission
- Providers invoice directly

[Provider CTA]
Providers can list move-out service products and receive qualified opportunities.

[FAQ Preview]

[Footer]
```

Supported workflows:

* visitor understands product
* renter starts move-out cart
* provider learns about listing products

---

## 4.2 How It Works

Route:

* `/how-it-works`

Purpose:

Explain the customer, provider, and coordination process.

Layout:

```text
[Header]

[Page Title]
How LeaseMate Works

[Customer Flow]
1. Tell us your move context
2. Browse provider-listed service products
3. Add products to your Move-Out Cart
4. Choose preferred and backup options
5. Review estimated ranges
6. Submit your cart
7. LeaseMate coordinates provider introductions

[Provider Flow]
1. Provider lists service products
2. Customer selects product
3. Provider receives opportunity
4. Provider accepts or declines
5. Accepted provider pays introduction fee
6. Customer details are released after payment

[Important Notes]
- LeaseMate does not provide the services directly
- Prices are estimated ranges
- Customer does not pay LeaseMate at cart submission
- Providers invoice customers directly
- Customer details are protected until provider acceptance and payment

[CTA]
Start Your Move-Out Cart
```

Supported workflows:

* customer education
* provider expectation-setting
* payment-gated release explanation

---

## 4.3 Services Overview

Route:

* `/services`

Purpose:

Show marketplace categories.

Layout:

```text
[Header]

[Page Title]
Browse move-out service categories

[Service Category Grid]
Each category card:
- category name
- short description
- example products
- typical estimated range wording
- CTA: Browse Products

Categories:
- Removalists
- End-of-lease cleaning
- Carpet cleaning
- Rubbish removal
- Storage
- Handyman
- Utilities

[Move Context CTA]
Enter your move details to filter relevant products.

[CTA]
Start Move-Out Planning
```

Supported workflows:

* customer browses service categories
* customer proceeds to intake/product browsing

---

## 4.4 Service Category Product Listing

Route:

* `/services/$category`

Purpose:

Show productised service listings for one category.

Layout:

```text
[Header]

[Category Header]
- Category name
- Plain-language explanation
- Estimated range disclaimer

[Filters]
- Current suburb / catchment
- Destination catchment where relevant
- Property type
- Bedrooms
- Bathrooms
- Access notes
- Price range
- Availability/capacity
- Provider

[Product Grid/List]
Each Product Card:
- product title
- provider name
- estimated price range
- catchment
- property fit
- inclusions summary
- exclusions summary
- add-ons available
- Button: Add to Move-Out Cart
- Button: Choose as Preferred
- Button: Choose as Backup

[Cart Sidebar]
- selected products
- preferred/backup status
- estimated total range
- Review Cart button
```

Supported workflows:

* browse productised services
* add product to cart
* choose preferred/backup option

---

## 4.5 For Providers

Route:

* `/for-providers`

Purpose:

Explain provider value proposition.

Layout:

```text
[Header]

[Hero]
List productised move-out services and receive qualified opportunities.

[Provider Value]
- Create service products with estimated ranges
- Define catchments and job criteria
- Customers add products to Move-Out Carts
- Receive structured opportunities
- Accept only jobs you want
- Pay only after accepting
- Customer details released after payment

[Example Product Cards]
- 2-bedroom apartment move — inner north to Melbourne metro
- 2-bedroom apartment end-of-lease clean — inner north
- Small move-out rubbish removal — inner north

[How Provider Flow Works]
1. List service product
2. Customer selects product
3. You receive opportunity
4. Accept or decline
5. Pay introduction fee if accepted
6. Receive customer details

[CTA]
Create Provider Profile
```

Supported workflows:

* provider education
* provider signup

---

## 4.6 Provider Signup

Route:

* `/provider-signup`

Purpose:

Capture provider details and product-listing readiness.

Layout:

```text
[Header]

[Page Title]
Join as a provider

[Provider Details Form]
- Business name
- Contact name
- Email
- Phone
- ABN / business identifier
- Website
- Insurance/licence details where relevant

[Service Capability Form]
- Service categories
- Service areas/catchments
- Property types serviced
- Job sizes handled
- Access limitations
- Availability notes

[Initial Service Product Prompt]
- Product title
- Category
- Estimated min price
- Estimated max price
- Inclusions
- Exclusions
- Add-ons

[Submit Button]
Submit Provider Profile
```

Supported workflows:

* provider signup
* provider service-product creation starting point

---

## 4.7 FAQ

Route:

* `/faq`

Purpose:

Answer objections and clarify rules.

Layout:

```text
[Header]

[For Renters]
- What is a Move-Out Cart?
- Am I paying LeaseMate?
- Are prices final?
- Who invoices me?
- What happens if my preferred provider cannot accept?
- Can I choose backup options?
- When will providers contact me?

[For Providers]
- What is a service product?
- When do I pay?
- What details do I see before accepting?
- Are introductions exclusive?
- What happens if I decline?
- What happens after I pay?

[CTA]
Start Move-Out Cart
List Services
```

Supported workflows:

* objection handling
* customer/provider education

---

# 5. Customer Wireframes

## 5.1 Move Context Intake

Route:

* `/intake`

Purpose:

Collect move details to filter relevant service products.

Layout:

```text
[Customer Header]
[Progress Indicator]

[Step 1: Move Context]
Fields:
- Current suburb
- Destination suburb
- Property type
- Bedrooms
- Bathrooms
- Move-out date
- Preferred service date
- Stairs / lift / parking
- Heavy items
- Access notes
- Special requirements

[Continue Button]
Browse Service Products
```

Supported workflow:

* customer starts move-out planning
* move context created

---

## 5.2 Service Category Selection

Route:

* `/intake`

Purpose:

Let customer select service categories needed.

Layout:

```text
[Customer Header]
[Progress Indicator]

[Step 2: Select Services]

[Service Cards]
- Removalist
- End-of-lease cleaning
- Carpet cleaning
- Rubbish removal
- Storage
- Handyman
- Utilities

[Cart Preparation Summary]
Selected services: X
Empty cart slots created: X

[Continue Button]
Browse Products
```

Supported workflow:

* selected categories define cart structure

---

## 5.3 Productised Service Marketplace

Route:

* `/intake` or `/services/$category`

Purpose:

Customer browses relevant provider-listed service products.

Layout:

```text
[Customer Header]

[Marketplace Layout]

LEFT:
[Filters]
- Service category
- Current suburb/catchment
- Destination catchment
- Property type
- Bedrooms
- Bathrooms
- Access assumptions
- Estimated range
- Availability/capacity

CENTER:
[Product Cards]

Product Card:
- Product title
- Provider name
- Estimated range
- Category
- Catchment
- Property fit
- Inclusions
- Exclusions
- Add-ons
- Capacity note
- Button: Choose Preferred
- Button: Choose Backup

RIGHT:
[Move-Out Cart Sidebar]
For each selected service:
- Preferred: selected / not selected
- Backup: selected / not selected
- Estimated range
- Status: ready / missing preferred / missing backup
```

Supported workflows:

* browse service products
* compare ranges
* choose preferred/backup options
* build Move-Out Cart

---

## 5.4 Move-Out Cart

Route:

* `/cart`

Purpose:

Show active cart before final review.

Layout:

```text
[Customer Header]

[Page Title]
Your Move-Out Cart

[Cart Items]
Each item:
- service category
- preferred product
- preferred provider
- backup product
- backup provider
- estimated range
- status
- edit/remove actions

[Estimated Total Range]
Minimum total
Maximum total

[Cart Readiness]
- all selected services have preferred option
- backup missing for X services
- incomplete items warning if any

[Important Reminder]
This is not checkout. You are submitting a coordination request. Providers invoice directly.

[Actions]
- Continue Browsing Products
- Review Cart
```

Supported workflows:

* cart review before submission
* incomplete cart detection
* no-checkout clarification

---

## 5.5 Cart Review

Route:

* `/cart/review`

Purpose:

Final confirmation before submission.

Layout:

```text
[Customer Header]

[Move Details Summary]
- current suburb
- destination suburb
- property type
- bedrooms
- bathrooms
- move date
- access notes

[Move-Out Cart Review Table]
Columns:
- Service
- Preferred Product
- Preferred Provider
- Backup Product
- Backup Provider
- Estimated Range
- Status

[Estimated Total Range]
$min–$max

[Confirmation Notes]
- These are estimated ranges, not final quotes.
- The customer does not pay LeaseMate now.
- LeaseMate coordinates introductions.
- Preferred provider is contacted first.
- Backup provider may be contacted if preferred provider fails.
- Providers invoice customers directly.
- Customer details are shared only after provider acceptance and introduction-fee payment.

[Submit Button]
Submit Move-Out Cart
```

Supported workflows:

* customer submits coordinated request
* customer understands no checkout/payment

---

## 5.6 Submission Confirmation

Route:

* `/submitted/$id`

Purpose:

Confirm Move-Out Cart submission.

Layout:

```text
[Customer Header]

[Confirmation Card]
Your Move-Out Cart has been submitted.

[Request ID]
Request #...

[Submitted Cart Summary]
- service categories
- preferred products/providers
- backup products/providers
- estimated total range

[What Happens Next]
1. We contact your preferred providers.
2. If a preferred provider cannot accept, we may contact your backup option.
3. If no selected provider can fulfil a service, we may ask you to choose more options.
4. Provider contact details are exchanged only after provider acceptance and payment-gated release.

[Action]
View Request Status
```

Supported workflows:

* customer confirmation
* transition to tracking

---

## 5.7 Customer Request Status

Route:

* `/request/$id`

Purpose:

Show customer-facing progress by cart item.

Layout:

```text
[Customer Header]

[Request Summary]
- Request ID
- Overall status
- Submitted date
- Estimated cart range

[Per-Service Status Cards]

Card:
- Service category
- Preferred product/provider
- Preferred status
- Backup product/provider
- Backup status
- Current plain-language status
- Next expected step

Example statuses:
- Preferred provider contacted
- Awaiting provider response
- Backup provider contacted
- Provider accepted
- Introduction in progress
- Introduction completed
- More choices needed

[Timeline]
- Cart submitted
- Preferred providers contacted
- Backup contacted where needed
- Provider accepted
- Introduction completed

[Help Text]
We will update you if more options are needed.
```

Hidden from customer:

* provider payment due time
* fee amount unless intentionally customer-visible later
* internal billing queue
* internal exceptions
* operator notes
* audit internals
* automation internals
* operator controls

Supported workflows:

* customer tracks request progress
* per-cart-item visibility without internal complexity

---

# 6. Provider Wireframes

## 6.1 Provider Dashboard

Route:

* `/provider`

Purpose:

Show provider opportunities and product activity.

Layout:

```text
[Provider Sidebar]

[Summary Cards]
- Active service products
- Pending opportunities
- Accepted opportunities
- Payment pending
- Released introductions

[Opportunities List]
Columns/cards:
- opportunity ID
- service product
- service category
- preferred/backup position
- customer move context
- service date
- introduction fee
- status
- action

[Recent History]
- accepted
- declined
- paid
- released
```

Supported workflows:

* provider views opportunities
* provider opens opportunity detail

---

## 6.2 Provider Service Products

Route:

* `/provider/products`

Purpose:

Provider manages productised listings.

Layout:

```text
[Provider Sidebar]

[Page Header]
Service Products

[Product Table]
Columns:
- Product title
- Category
- Catchment
- Estimated range
- Status
- Last updated
- Opportunities generated

[Actions]
- Create Product
- Edit Product
- Pause Product
```

Supported workflows:

* provider manages marketplace products

---

## 6.3 Create / Edit Service Product

Routes:

* `/provider/products/new`
* `/provider/products/$id`

Purpose:

Create or update provider-listed service product.

Layout:

```text
[Provider Sidebar]

[Product Form]

Basic Details:
- product title
- service category
- description
- status: active/paused

Service Criteria:
- service area/catchment
- property type eligibility
- bedroom/bathroom criteria
- pickup/destination catchment where relevant
- access assumptions

Pricing:
- estimated min price
- estimated max price
- add-ons
- exclusions

Scope:
- included services
- excluded services
- availability/capacity notes

[Save Product]
```

Supported workflows:

* provider creates service product
* product becomes marketplace unit

---

## 6.4 Opportunity Detail

Route:

* `/provider/opportunities/$id`

Purpose:

Provider reviews selected service-product opportunity.

Layout:

```text
[Provider Sidebar]

[Opportunity Summary]
- opportunity ID
- selected service product
- preferred/backup position
- service category
- customer suburb/catchment
- destination catchment if relevant
- property type
- bedrooms
- bathrooms
- move date
- service date
- access notes
- job summary

[Customer Details Locked Notice]
Customer details are hidden until you accept and pay the introduction fee.

[Introduction Fee]
- amount
- explanation

[Actions]
- Accept Opportunity
- Decline Opportunity
```

Supported workflows:

* provider accepts
* provider declines

---

## 6.5 Payment Required

Route:

* `/provider/opportunities/$id/pay`

Purpose:

Require introduction fee before customer detail release.

Layout:

```text
[Provider Sidebar]

[Payment Required]
You accepted this opportunity.

[Fee Summary]
- service product
- customer move context
- introduction fee amount
- status: payment pending

[Locked Customer Details]
- name: hidden
- phone: hidden
- email: hidden

[Action]
Pay Introduction Fee
```

Supported workflows:

* provider pays introduction fee
* payment-gated release enforced

---

## 6.6 Customer Details Released

Route:

* `/provider/opportunities/$id/released`

Purpose:

Show customer details after payment.

Layout:

```text
[Provider Sidebar]

[Released Customer Details]
- customer name
- phone
- email
- preferred contact method
- relevant notes

[Service Product Context]
- product title
- service category
- move context
- service date

[Next Step]
Contact the customer directly and send your quote, invoice, or booking confirmation.
```

Supported workflows:

* provider contacts customer directly
* introduction workflow completes

---

## 6.7 Provider Profile

Route:

* `/provider/profile`

Purpose:

Manage provider account/profile context.

Layout:

```text
[Provider Sidebar]

[Business Details]
- business name
- contact name
- email
- phone
- website
- ABN / business identifier

[Capabilities]
- service categories
- catchments
- property types
- job sizes
- limitations

[Trust/Compliance]
- insurance
- licences where relevant
- terms acknowledgement

[Save]
```

Supported workflows:

* provider profile supports product trust and matching context

---

# 7. Operations Center Wireframes

## 7.1 Operations Home

Route:

* `/ops`

Purpose:

Show live operating state.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Critical Items]
- blocked cart items
- overdue payments
- failed automations
- unresolved exceptions

[Summary Cards]
- active requests
- active cart items
- pending provider responses
- pending payments
- open exceptions
- scheduled automations
- completed introductions

[Recent Activity]
- latest audit events

[Quick Links]
- Active Requests
- Provider Queue
- Billing
- Exceptions
- Automations
```

Supported workflows:

* operator understands current operational load

---

## 7.2 Active Requests

Route:

* `/ops/requests`

Purpose:

Master queue for submitted Move-Out Carts.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Page Header]
Active Requests

[Filters]
- request state
- cart item state
- service category
- provider state
- billing state
- exception state
- SLA state

[Requests Table]
Columns:
- Request ID
- Customer
- Cart item count
- Services
- Current state
- Provider state
- Billing state
- Release state
- Next action
- SLA
- Alerts
- Last updated

[Row Action]
Open Request
```

Supported workflows:

* operator sees all customer requests
* operator opens request detail

---

## 7.3 Request Detail

Route:

* `/ops/requests/$id`

Purpose:

Full control surface for one submitted Move-Out Cart.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Request Header]
- request ID
- customer
- overall state
- priority
- alerts

[Three-Panel Layout]

LEFT PANEL:
[Customer Summary]
- name
- email
- phone
- suburb / catchment
- move details

[Move Context]
- property type
- bedrooms
- bathrooms
- move date
- access notes

CENTER PANEL:
[Cart Routing Matrix]
Columns:
- Service
- Product
- Provider
- Preferred / Backup
- Invitation State
- Billing State
- Release State
- Exception State
- Next Action

[Workflow Timeline]
- cart submitted
- preferred provider invited
- provider accepted/declined/expired
- backup invited
- fee created
- payment received
- customer details released
- completed

RIGHT PANEL:
[Operator Actions]
- pause/resume
- trigger next step
- send reminder
- mark reviewed
- add note
- resolve exception
- cancel item/request

[Billing Summary]
- pending fees
- overdue fees
- paid fees

[Exceptions]
- open issues

[Audit Summary]
- latest events
```

Supported workflows:

* cart item routing visibility
* provider invitation monitoring
* billing/release control
* exception handling
* audit verification

---

## 7.4 Provider Queue

Route:

* `/ops/providers-queue`

Purpose:

Track invitations by cart item and provider.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Page Header]
Provider Queue

[Filters]
- invitation status
- preferred/backup position
- service category
- provider
- response due
- overdue

[Table]
Columns:
- Invitation ID
- Request ID
- Cart Item ID
- Service Product
- Provider
- Service Category
- Preferred/Backup
- Invitation Status
- Response Due
- Response Age
- Payment State
- Next Action

[Row Actions]
- open request
- open provider
- send reminder
```

Supported workflows:

* preferred/backup routing visibility
* response monitoring
* escalation trigger

---

## 7.5 Billing Queue

Route:

* `/ops/billing`

Purpose:

Track provider introduction fees and customer detail release.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Page Header]
Billing Queue

[Summary Cards]
- pending fees
- overdue fees
- paid fees
- waived/cancelled fees

[Filters]
- fee status
- overdue
- provider
- service category
- release state

[Table]
Columns:
- Fee ID
- Request ID
- Cart Item ID
- Service Product
- Provider
- Service Category
- Amount
- Status
- Due Time
- Payment Age
- Customer Release State
- Next Action

[Row Actions]
- open request
- send reminder
- mark paid
- waive/cancel
```

Supported workflows:

* payment-gated release control
* accepted-but-unpaid visibility

---

## 7.6 Exceptions Queue

Route:

* `/ops/exceptions`

Purpose:

Show blocked or abnormal workflows.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Page Header]
Exceptions

[Filters]
- severity
- category
- age
- status
- service category

[Table]
Columns:
- Exception ID
- Request ID
- Cart Item ID
- Service Product
- Category
- Severity
- Age
- Responsible Actor
- Suggested Action
- Status

[Row Actions]
- open request
- acknowledge
- resolve
```

Supported workflows:

* unresolved cart items
* failed provider routing
* overdue payment
* failed release
* automation failure

---

## 7.7 Automation Queue

Route:

* `/ops/automations`

Purpose:

Show automation as visible operational work.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Page Header]
Automation Queue

[Summary Cards]
- scheduled
- running
- failed
- paused

[Table]
Columns:
- Automation ID
- Request ID
- Cart Item ID
- Type
- Trigger
- Scheduled Time
- Time Remaining
- Last Result
- Status
- Failure Count

[Row Actions]
- trigger now
- pause
- resume
- retry
- open request
```

Supported workflows:

* preferred provider invitation
* backup provider invitation
* reminders
* expiry
* payment overdue
* escalation

---

## 7.8 Provider Management

Route:

* `/ops/providers`

Purpose:

Monitor provider network and product activity.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Page Header]
Providers

[Filters]
- category
- catchment
- status
- active products
- acceptance rate

[Provider Table]
Columns:
- Provider
- Categories
- Catchments
- Active Products
- Status
- Acceptance Rate
- Decline Rate
- Timeout Rate
- Outstanding Fees
- Last Activity

[Row Action]
Open Provider
```

Supported workflows:

* operator monitors provider marketplace supply

---

## 7.9 Customer Management

Route:

* `/ops/customers`

Purpose:

View customer/request history.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Page Header]
Customers

[Customer Table]
Columns:
- Customer
- Email
- Phone
- Suburb / Catchment
- Active Requests
- Completed Requests
- Last Request
- Status

[Row Action]
Open related request
```

Supported workflows:

* operator understands customer request context

---

## 7.10 Audit Log

Route:

* `/ops/audit`

Purpose:

Append-only history of important workflow events.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Page Header]
Audit Log

[Filters]
- entity type
- request ID
- cart item ID
- provider
- actor
- event type
- date range

[Audit Table]
Columns:
- Timestamp
- Actor
- Entity
- Event Type
- Previous State
- New State
- Notes
- Source

[Row Action]
Open related entity
```

Supported workflows:

* operator verifies what happened

---

## 7.11 System Health

Route:

* `/ops/health`

Purpose:

Show operational health.

Layout:

```text
[Ops Sidebar] [Ops Top Bar]

[Health Cards]
- active requests
- active cart items
- completed introductions
- blocked cart items
- open exceptions
- critical exceptions
- scheduled automations
- failed automations
- overdue fees
- SLA breaches
- active providers
- paused providers/products

[Provider Metrics Table]
Columns:
- Provider
- Active Products
- Invited
- Accepted
- Declined
- Expired
- Acceptance Rate
- Fees Paid
- Outstanding Fees

[SLA Breaches]
Columns:
- Request
- Cart Item
- Service Product
- SLA Due
- Overdue Time
- Next Action
```

Supported workflows:

* solo-operator health monitoring

---

# 8. End-to-End Route Coverage

## 8.1 Customer Marketplace-to-Cart Flow

```text
/ → /intake → /services/$category or product browsing step → /cart → /cart/review → /submitted/$id → /request/$id
```

Required screens:

* Home
* Move Context Intake
* Service Category Selection
* Productised Service Marketplace
* Move-Out Cart
* Cart Review
* Submission Confirmation
* Customer Request Status

---

## 8.2 Provider Product-to-Introduction Flow

```text
/provider/products/new → /provider → /provider/opportunities/$id → /provider/opportunities/$id/pay → /provider/opportunities/$id/released
```

Required screens:

* Create Service Product
* Provider Dashboard
* Opportunity Detail
* Payment Required
* Customer Details Released

---

## 8.3 Operator Cart Routing Flow

```text
/ops → /ops/requests → /ops/requests/$id
```

Supporting Ops routes:

```text
/ops/providers-queue
/ops/billing
/ops/exceptions
/ops/automations
/ops/providers
/ops/customers
/ops/audit
/ops/health
```

Required screens:

* Operations Home
* Active Requests
* Request Detail with Cart Routing Matrix
* Provider Queue
* Billing Queue
* Exceptions Queue
* Automation Queue
* Provider Management
* Customer Management
* Audit Log
* System Health

---

# 9. Wireframe Acceptance Criteria

The wireframes are complete when:

* customer can enter move context
* customer can browse productised service listings
* customer can add service products to a Move-Out Cart
* customer can select preferred and backup options
* customer can review estimated item ranges and total cart range
* customer can submit cart without payment
* customer can track per-service status
* provider can create/list service products
* provider can view opportunities generated from selected products
* provider can accept or decline
* provider must pay introduction fee before seeing customer details
* customer details remain hidden before payment
* operator can see submitted carts
* operator can see cart-item routing matrix
* operator can see preferred/backup routing
* operator can see provider invitation states
* operator can see billing states
* operator can see customer release states
* operator can see exceptions
* operator can see automation
* operator can verify audit history
* operator can monitor system health
* no customer-facing page uses checkout/payment language for cart submission
* no provider page exposes customer details before payment

---

# 10. Final Wireframe Statement

LeaseMate’s website must support three connected experiences:

1. A renter browses productised move-out services and builds a Move-Out Cart.
2. A provider lists service products, accepts opportunities, pays for introductions, and receives customer details after payment.
3. An operator supervises request, cart-item, provider, billing, automation, exception, release, and audit states through a full-visibility Operations Center.

The customer experience should feel like a service marketplace with a non-payment cart.

The provider experience should make service-product listing and payment-gated introductions clear.

The Operations Center should make every workflow state visible.

---

# 11. Prototype Implementation Note

The Operations Center wireframes are implemented in the prototype as mock cart-item workflow screens: Active Requests summarises cart/routing/billing/release state, Request Detail centers on a Cart Routing Matrix, Provider Queue shows live invitations, Billing Queue shows the exact cart item and service product being unlocked, and Providers/Health surface supply coverage.
