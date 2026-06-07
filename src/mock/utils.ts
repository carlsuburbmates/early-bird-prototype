/**
 * Mock helpers: id generation, virtual-clock math, formatting.
 * MIGRATION: replace `newId` with DB-generated UUIDs; the virtual clock disappears entirely
 * (real cron / queue workers use wall-clock time).
 */
import type { PriceRange, ServiceCategory } from "./types";

let _counter = 0;
export function newId(prefix = "id"): string {
  _counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${_counter.toString(36)}`;
}

export function addMinutes(iso: string, mins: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + mins);
  return d.toISOString();
}
export const addHours = (iso: string, h: number) => addMinutes(iso, h * 60);
export const addDays = (iso: string, d: number) => addMinutes(iso, d * 60 * 24);

export function isDue(scheduledFor: string, now: string): boolean {
  return new Date(scheduledFor).getTime() <= new Date(now).getTime();
}

export function formatMoney(n: number): string {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

export function formatRange(r: PriceRange): string {
  return `${formatMoney(r.min)}–${formatMoney(r.max)}`;
}

export function sumRanges(ranges: PriceRange[]): PriceRange {
  return ranges.reduce(
    (acc, r) => ({ min: acc.min + r.min, max: acc.max + r.max }),
    { min: 0, max: 0 },
  );
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function relativeFromNow(iso: string, now: string): string {
  const diff = new Date(iso).getTime() - new Date(now).getTime();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const hrs = Math.round(mins / 60);
  const days = Math.round(hrs / 24);
  const label =
    days >= 1 ? `${days}d` : hrs >= 1 ? `${hrs}h` : mins >= 1 ? `${mins}m` : "<1m";
  return diff >= 0 ? `in ${label}` : `${label} ago`;
}

/** Default introduction fee per category. MIGRATION: move to pricing config table. */
export const INTRODUCTION_FEES: Record<ServiceCategory, number> = {
  removalist: 49,
  eol_cleaning: 35,
  carpet_cleaning: 25,
  rubbish_removal: 25,
  storage: 30,
  handyman: 25,
  utilities: 15,
};

/** SLAs in virtual minutes. MIGRATION: move to workflow config table. */
export const SLA = {
  invitationReminderMins: 24 * 60,
  invitationExpiryMins: 48 * 60,
  feeReminderMins: 12 * 60,
  feeExpiryMins: 24 * 60,
};
