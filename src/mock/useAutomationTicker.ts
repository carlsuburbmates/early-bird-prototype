/**
 * Auto-runs due automation jobs against the virtual clock on a polling
 * interval. Demo-mode only — disabled when `isDemoMode()` is false.
 *
 * The existing manual controls (`advanceTime`, `runDue`, `runJobNow`)
 * still work. MIGRATION: delete this hook; production runs server-side
 * cron / queue workers.
 */
import { useEffect } from "react";
import { useStore } from "./store";
import { isDemoMode } from "./demo";

export function useAutomationTicker(intervalMs = 2000) {
  const runDue = useStore((s) => s.runDue);
  useEffect(() => {
    if (!isDemoMode()) return;
    const t = setInterval(() => runDue(), intervalMs);
    return () => clearInterval(t);
  }, [runDue, intervalMs]);
}