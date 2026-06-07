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
| `utils.ts` | Server-side helpers (id, time, money) |

## Concepts that disappear in production

- **Virtual clock (`demo.virtualNow`)** — real cron jobs use wall-clock time.
- **`advanceTime` / `runJobNow` / `resetDemoData`** — demo-only controls.
- **`DemoBar` role switcher** — replaced by real auth (Supabase, Cognito, etc.).
- **`payIntroductionFee` mock** — replaced by Stripe Checkout + webhook.

## Concepts that stay

- Entity shapes in `types.ts` are intended to map 1:1 onto DB tables.
- State transitions in `automation.ts::executeJob` describe the eventual worker.
- Audit events are written on every transition for parity with the production log.