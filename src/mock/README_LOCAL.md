# Running LeaseMate locally (local prototype)

This prototype is frontend-only by design. It runs anywhere a TanStack
Start + Vite app runs. No Supabase, Stripe, auth, email, SMS, or external
APIs are used.

## Prerequisites

- Node 20+ (or Bun 1.x — the repo includes `bun.lock`).
- No environment variables required.
- No backend services to provision.

## Install + run

```bash
bun install         # or: npm install
bun run dev         # or: npm run dev
```

The app boots with a deterministic seed (see `src/mock/seed.ts`). All
state is held in a Zustand store and persisted to `localStorage` under
the key `leasemate.demo.v1`.

## Resetting demo state

- In-app: open the demo bar (top of every page) → **Advance time → Reset
  demo data**.
- Manually: clear the `leasemate.demo.v1` key from `localStorage`, or
  call `useStore.getState().resetDemoData()` from the browser console.

## Project structure

```
src/
  mock/                  # the entire backend stand-in
    types.ts             # entity types (≈ DB schema)
    seed.ts              # initial fixtures
    store.ts             # Zustand store + actions
    automation.ts        # workflow / state-transition engine
    selectors.ts         # pure read selectors
    useAutomationTicker.ts  # demo-only polling tick
    demo.ts              # DEMO_MODE flag
    utils.ts             # id, time, money helpers
    README_MIGRATION.md  # how to port this to a real backend
    README_LOCAL.md      # this file
  components/
    customer/            # renter-facing UI
    provider/            # provider-facing UI
    ops/                 # operator console UI
    shared/              # shared primitives
  routes/                # TanStack Start file-based routes (thin wrappers)
```

## Demo controls

Demo controls (role switcher, virtual clock, "advance time", "reset demo
data", and operator deep links from customer pages) are gated behind
`isDemoMode()` in `src/mock/demo.ts`. Set `DEMO_MODE = false` to hide
every demo-only surface in one place.

## Migration path

See `README_MIGRATION.md` for the file-by-file mapping from this mock
layer onto a production backend (database, auth, payments, queue).