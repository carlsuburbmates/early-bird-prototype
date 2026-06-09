/**
 * Local-only error reporting shim retained for migration safety.
 *
 * Lovable's external `window.__lovableEvents.captureException` hook is
 * intentionally not called here. This prototype must remain frontend-only and
 * free of Lovable backend integrations, telemetry, or external reporting.
 */
export function reportLovableError(_error: unknown, _context: Record<string, unknown> = {}) {
  // No-op by design: errors stay local via the caller's console.error.
}
