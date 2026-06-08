/**
 * Demo-mode helper.
 *
 * The prototype is always in demo mode. This flag exists so it's trivial
 * to disable demo controls (role switcher, virtual clock, ticker, operator
 * deep links from customer pages, etc.) in a production build.
 *
 * MIGRATION: flip to `false` (or wire to `import.meta.env.MODE !== "production"`)
 * once real auth + a real backend are in place. Search for `isDemoMode()` and
 * `DEMO_MODE` to find every gated surface.
 */
export const DEMO_MODE = true;

export function isDemoMode(): boolean {
  return DEMO_MODE;
}