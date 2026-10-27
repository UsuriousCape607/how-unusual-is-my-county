import { en } from "../i18n/en";
import { getM } from "../i18n/state";

/** Plain-language labels for the pipeline's exclusion reasons (codes come from process_facilities.py), in English for the methodology tables. */
export const REASON_LABELS: Record<string, string> = en.reasons;

/** Reason in the active language. */
export function reasonLabel(code?: string): string {
  const m = getM();
  if (!code) return m.notCounted;
  return m.reasons[code] ?? code;
}
