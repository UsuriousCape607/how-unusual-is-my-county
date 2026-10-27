import { en, type Messages } from "./en";
import { LANGUAGE, type Lang } from "./languages";

/*
 * The active language, readable outside React (formatting helpers, verdict(), the error page). I18nProvider sets it
 * before rendering in a new language. With nothing set (tests, the build's link previews) everything is English.
 */
let active: { lang: Lang; m: Messages } = { lang: "en", m: en };

export function setActive(lang: Lang, m: Messages): void {
  active = { lang, m };
}

export const getM = (): Messages => active.m;
export const getLang = (): Lang => active.lang;
export const intlLocale = (): string => LANGUAGE[active.lang].intl;

/** Runs fn with English formatting, for sections that stay in English (the methodology) so numbers and dates match the prose. */
export function asEnglish<T>(fn: () => T): T {
  const prev = active;
  active = { lang: "en", m: en };
  try {
    return fn();
  } finally {
    active = prev;
  }
}

/** Plural category of n in the active language ("one", "few", "many", "other", …), for translations that need it. */
export function pluralOf(n: number, locale: string): Intl.LDMLPluralRule {
  return new Intl.PluralRules(locale).select(n);
}
