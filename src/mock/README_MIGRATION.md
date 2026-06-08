# Migration notes — LeaseMate prototype

This folder is the single seam between the frontend prototype and a future backend.
Everything is in-memory, persisted to `localStorage`. No network calls are made.

## File map

| File | Production replacement |
| --- | --- |
| `types.ts` | DB schema + generated DTOs |
| `seed.ts` | DB migrations + seed scripts |
| `store.ts` | TanStack Query + server functions / RPC |
| `automation.ts` | Backend cron / queue worker |
| `selectors.ts` | SQL views / API endpoints (one selector ≈ one query) |
| `useAutomationTicker.ts` | Delete — replaced by server-side cron / queue |
| `demo.ts` | Delete — `DEMO_MODE` is always `false` in production |
| `utils.ts` | Server-side helpers (id, time, money) |

## Concepts that disappear in production

- **Virtual clock (`demo.virtualNow`)** — real cron jobs use wall-clock time.
- **`advanceTime` / `runJobNow` / `resetDemoData`** — demo-only controls.
- **`DemoBar` role switcher** — replaced by real auth. Already gated behind
  `isDemoMode()` so flipping `DEMO_MODE` removes it.
- **`useAutomationTicker`** — demo-mode only; production runs server cron.
- **Operator deep links from customer pages** (e.g. on `/submitted/$id`,
  `/request/$id`) — gated behind `isDemoMode()`.
- **`payIntroductionFee` mock** — replaced by Stripe Checkout + webhook.

## Concepts that stay

- Entity shapes in `types.ts` are intended to map 1:1 onto DB tables.
- State transitions in `automation.ts::executeJob` describe the eventual worker.
- Selectors in `selectors.ts` are the canonical list of read queries the
  backend must expose.
- Audit events are written on every transition for parity with the production log.

## Domain component layout

- `src/components/customer/` — renter-facing surfaces (intake, request status).
- `src/components/provider/` — provider-facing surfaces (dashboard).
- `src/components/ops/` — operator console.
- `src/components/shared/` — primitives shared across roles.

Route files under `src/routes/` are intentionally thin: they wire path
params + page metadata, then delegate to a domain component. Keep it that
way during migration so swapping the data layer doesn't churn the routes.