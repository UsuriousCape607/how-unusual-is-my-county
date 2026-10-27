import { getLang, getM, intlLocale } from "../i18n/state";
import { CUSTOM_FORMATS } from "../i18n/formats";

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

const intlData = new Map<string, boolean>();
/** Whether this browser has date data for a locale (Intl otherwise answers in its default language). */
export function hasIntl(locale: string): boolean {
  if (!intlData.has(locale)) intlData.set(locale, Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0);
  return intlData.get(locale)!;
}

/**
 * Dates come from the language's written-out format (formats.ts), else Intl, else an unambiguous ISO date: a page in
 * a language the browser has no data for must never show English month names.
 */
function formatDate(iso: string, short: boolean): string {
  const d = toDate(iso);
  const custom = CUSTOM_FORMATS[getLang()]?.date;
  if (custom) return custom(d.getUTCDate(), d.getUTCMonth(), d.getUTCFullYear(), short);
  if (!hasIntl(intlLocale())) return d.toISOString().slice(0, 10);
  return d.toLocaleDateString(intlLocale(), { year: "numeric", month: short ? "short" : "long", day: "numeric", timeZone: "UTC" });
}

export function fmtDate(iso: string): string {
  return formatDate(iso, false);
}

/** "Oct 2, 2026" — compact form used next to counts. */
export function fmtDateShort(iso: string): string {
  return formatDate(iso, true);
}

/** Whole days from a date (YYYY-MM-DD or ISO timestamp) to `now`. Display only. */
export function daysSince(iso: string, now: Date = new Date()): number {
  const d = toDate(iso, "00:00:00");
  return Math.floor((now.getTime() - d.getTime()) / 86_400_000);
}

/** How long ago, in words; empty when the language has neither a written-out form nor browser data (the date itself is always shown). */
export function fmtAgo(days: number): string {
  const lang = getLang();
  if (lang === "en") {
    if (days <= 0) return "today";
    if (days === 1) return "1 day ago";
    if (days < 60) return `${days} days ago`;
    return `about ${Math.round(days / 30.44)} months ago`;
  }
  const custom = CUSTOM_FORMATS[lang]?.ago;
  if (custom) return custom(Math.max(days, 0));
  if (!hasIntl(intlLocale())) return "";
  // Other languages get their own grammar (plural forms, word order) from the browser.
  const rtf = new Intl.RelativeTimeFormat(intlLocale(), { numeric: "auto" });
  return days < 60 ? rtf.format(-Math.max(days, 0), "day") : rtf.format(-Math.round(days / 30.44), "month");
}

/** A list in the reader's language ("A, B, and C" / "A、B、C" / "A, B et C"), as parts so items can be links. */
export function listParts(items: string[]): { type: "element" | "literal"; value: string }[] {
  const and = CUSTOM_FORMATS[getLang()]?.and;
  if (and || !hasIntl(intlLocale())) {
    return items.flatMap((value, i) => [
      ...(i === 0 ? [] : [{ type: "literal" as const, value: i < items.length - 1 ? ", " : and ? ` ${and} ` : ", " }]),
      { type: "element" as const, value },
    ]);
  }
  return new Intl.ListFormat(intlLocale(), { type: "conjunction" }).formatToParts(items);
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
