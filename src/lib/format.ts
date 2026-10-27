import { getLang, getM, intlLocale } from "../i18n/state";

/** Formatting follows the active interface language (see src/i18n); with none set it is U.S. English. */
const intFmt = (): Intl.NumberFormat => new Intl.NumberFormat(intlLocale(), { maximumFractionDigits: 0 });

/** "0.5" → "0,5" where the language uses a decimal comma. */
function localDecimal(text: string): string {
  const sep = new Intl.NumberFormat(intlLocale()).formatToParts(1.5).find((p) => p.type === "decimal")?.value ?? ".";
  return sep === "." ? text : text.replace(".", sep);
}

export function fmtInt(n: number): string {
  return intFmt().format(n);
}

/** Density with sensible precision: 0.3, 12.4, 1,234 people per sq mi. */
export function fmtDensity(n: number | null): string {
  if (n === null) return "n/a";
  if (n < 100) return localDecimal(n.toFixed(1));
  return intFmt().format(n);
}

/** Median of integer counts is a whole or half number; show it without trailing zeros. */
export function fmtStat(n: number, digits = 1): string {
  return Number.isInteger(n) ? String(n) : localDecimal(n.toFixed(digits).replace(/\.0$/, ""));
}

function toDate(iso: string, time = "12:00:00"): Date {
  return new Date(iso.length === 10 ? `${iso}T${time}Z` : iso);
}

/** Mixed-script Korean writes dates with hanja: 2026年 10月 2日. */
function hanjaDate(d: Date): string {
  return `${d.getUTCFullYear()}年 ${d.getUTCMonth() + 1}月 ${d.getUTCDate()}日`;
}

export function fmtDate(iso: string): string {
  const d = toDate(iso);
  if (getLang() === "ko-Kore") return hanjaDate(d);
  return d.toLocaleDateString(intlLocale(), { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

/** "Oct 2, 2026" — compact form used next to counts. */
export function fmtDateShort(iso: string): string {
  const d = toDate(iso);
  if (getLang() === "ko-Kore") return hanjaDate(d);
  return d.toLocaleDateString(intlLocale(), { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** Whole days from a date (YYYY-MM-DD or ISO timestamp) to `now`. Display only. */
export function daysSince(iso: string, now: Date = new Date()): number {
  const d = toDate(iso, "00:00:00");
  return Math.floor((now.getTime() - d.getTime()) / 86_400_000);
}

export function fmtAgo(days: number): string {
  if (getLang() !== "en") {
    // Other languages get their own grammar (plural forms, word order) from the browser.
    const rtf = new Intl.RelativeTimeFormat(intlLocale(), { numeric: "auto" });
    return days < 60 ? rtf.format(-Math.max(days, 0), "day") : rtf.format(-Math.round(days / 30.44), "month");
  }
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 60) return `${days} days ago`;
  return `about ${Math.round(days / 30.44)} months ago`;
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

export function countyLabel(c: { county_name: string; state: string }): string {
  return `${c.county_name}, ${c.state}`;
}

export function statusLabel(s?: string): string | undefined {
  return s ? getM().status[s] ?? s : undefined;
}

export function precisionLabel(p?: string): string | undefined {
  return p ? getM().precision[p] ?? p : undefined;
}

export function assignmentLabel(m?: string): string | undefined {
  return m ? getM().assignment[m] ?? m : undefined;
}

export function confidenceLabel(c?: string): string | undefined {
  return c ? getM().confidence[c] ?? c : undefined;
}
