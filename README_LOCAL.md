# LeaseMate local development guide

## Project purpose

LeaseMate is a rental move-out coordination prototype. Renters create a move-out service package, providers accept or decline matched opportunities, and accepted providers must pay a **mock** introduction fee before customer details are revealed. The Operations Center shows request, provider, billing, exception, automation, audit, customer, and health workflows that a future operator team would manage.

## Frontend-only warning

This repository is intentionally a **frontend-only prototype** for GitHub/local development. It uses local mock data and browser state only. It does not connect to production infrastructure and must not be treated as a real booking, payment, customer, provider, or operations system.

The following integrations are intentionally **not connected**:

- Supabase
- Stripe
- Auth
- Email/SMS
- External APIs
- Lovable backend integrations
- Production databases
- Real payments

## Commands

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Build the prototype:

```bash
npm run build
```

Typecheck:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint
```

## Demo mode

Demo mode is controlled from `src/mock/demo.ts`. `DEMO_MODE` is currently `true` so local testers can use prototype-only surfaces such as:

- the role switcher
- virtual clock and advance-time controls
- reset-demo-data controls
- provider context switching
- mock introduction-fee payment controls
- operator deep links from customer pages
- the demo automation ticker

For production migration, flip demo mode off or wire it to an environment condition, then replace these controls with real auth, permissions, backend jobs, and payment flows.

## Mock architecture map

- Mock domain types live in `src/mock/types.ts`.
- Seed data lives in `src/mock/seed.ts`.
- The Zustand mock store lives in `src/mock/store.ts` and persists demo state in localStorage under `leasemate.demo.v1`.
- Selector-based mock logic lives in `src/mock/selectors.ts`.
- Automation and workflow logic lives in `src/mock/automation.ts` with the local ticker hook in `src/mock/useAutomationTicker.ts`.
- Customer-facing prototype flows live in `src/components/customer/` and related route files under `src/routes/`.
- Provider-facing prototype flows live in `src/components/provider/` and related route files under `src/routes/`.
- Operations Center screens live in `src/routes/ops*.tsx` with shared navigation in `src/components/ops/OpsSidebar.tsx`.

## Production migration checklist

Replace the following before any production launch:

- Zustand/localStorage persistence with a production data model and database.
- Seed data with real request, customer, provider, invoice, exception, automation, audit, and health records.
- Demo role switching with real authentication, authorization, and account context.
- Mock provider acceptance/decline actions with authenticated provider workflows.
- Mock introduction-fee payment actions with a real payment provider and server-verified payment state.
- Demo automation ticker and virtual clock with server-side jobs, queues, retries, monitoring, and audit trails.
- Customer/operator deep links with permissioned navigation.
- Local-only error handling with an approved production observability strategy.
- Static prototype copy and local-only business rules with production-validated policies.

Do not add Supabase, Stripe, auth, email/SMS, external APIs, Lovable backend services, production database connections, or real payment handling until the product migration plan explicitly calls for them.
