import type { Translation } from "./en";

export type Lang =
  | "en" | "es" | "ko" | "ko-Kore" | "zh-TW" | "zh-CN" | "ja" | "hu" | "pl" | "sv"
  | "el" | "el-x-kathar" | "az-Latn" | "mn-Cyrl" | "la-x-eccl" | "xno" | "pdc" | "ht" | "nv" | "it" | "tr" | "hi";

export interface LanguageInfo {
  id: Lang;
  /** Name in the language itself (menu) and a short form (button). */
  native: string;
  short: string;
  english: string;
  /** <html lang>: picks the right CJK glyphs and fonts and the screen-reader voice. */
  html: string;
  /**
   * Intl locale. Always used for numbers (digit grouping, decimal sign); also for dates, relative time and lists unless
   * formats.ts writes them out for this language. Where Intl has no data for the language itself (see formats.ts),
   * this is a locale with the same number conventions.
   */
  intl: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { id: "en", native: "English", short: "English", english: "English", html: "en", intl: "en-US" },
  { id: "es", native: "Español", short: "Español", english: "Spanish", html: "es", intl: "es-US" },
  { id: "ko", native: "한국어", short: "한국어", english: "Korean", html: "ko", intl: "ko-KR" },
  { id: "ko-Kore", native: "韓國語（國漢文混用）", short: "韓國語", english: "Korean (mixed Hangul–Hanja)", html: "ko-Kore", intl: "ko-KR" },
  { id: "zh-TW", native: "繁體中文（台灣）", short: "繁體中文", english: "Chinese (Traditional, Taiwan)", html: "zh-Hant-TW", intl: "zh-TW" },
  { id: "zh-CN", native: "简体中文", short: "简体中文", english: "Chinese (Simplified)", html: "zh-Hans-CN", intl: "zh-CN" },
  { id: "ja", native: "日本語", short: "日本語", english: "Japanese", html: "ja", intl: "ja-JP" },
  { id: "hu", native: "Magyar", short: "Magyar", english: "Hungarian", html: "hu", intl: "hu-HU" },
  { id: "pl", native: "Polski", short: "Polski", english: "Polish", html: "pl", intl: "pl-PL" },
  { id: "sv", native: "Svenska", short: "Svenska", english: "Swedish", html: "sv", intl: "sv-SE" },
  { id: "el", native: "Ελληνικά (Δημοτική)", short: "Ελληνικά", english: "Greek (Demotic)", html: "el", intl: "el-GR" },
  { id: "el-x-kathar", native: "Ελληνικά (Καθαρεύουσα)", short: "Καθαρεύουσα", english: "Greek (Katharevousa)", html: "el-x-kathar", intl: "el-GR" },
  // Azerbaijani numbers group with "." and use a decimal comma, as Turkish does (Intl has no usable az data).
  { id: "az-Latn", native: "Azərbaycanca", short: "Azərbaycanca", english: "Azerbaijani (Latin)", html: "az-Latn", intl: "tr-TR" },
  { id: "mn-Cyrl", native: "Монгол", short: "Монгол", english: "Mongolian (Cyrillic)", html: "mn-Cyrl", intl: "en-US" },
  // Holy See documents group thousands with "." and use a decimal comma.
  { id: "la-x-eccl", native: "Latina Ecclesiastica", short: "Latina", english: "Ecclesiastical Latin", html: "la-x-eccl", intl: "it-IT" },
  { id: "xno", native: "Anglo-Norman (Law French)", short: "Law French", english: "Anglo-Norman (Law French)", html: "xno", intl: "en-GB" },
  { id: "pdc", native: "Pennsylvania Dutch (Deitsch)", short: "Deitsch", english: "Pennsylvania Dutch", html: "pdc", intl: "en-US" },
  { id: "ht", native: "Kreyòl ayisyen", short: "Kreyòl", english: "Haitian Creole", html: "ht", intl: "fr-HT" },
  { id: "nv", native: "Diné bizaad", short: "Diné bizaad", english: "Navajo", html: "nv", intl: "en-US" },
  { id: "it", native: "Italiano", short: "Italiano", english: "Italian", html: "it", intl: "it-IT" },
  { id: "tr", native: "Türkçe", short: "Türkçe", english: "Turkish", html: "tr", intl: "tr-TR" },
  { id: "hi", native: "हिन्दी", short: "हिन्दी", english: "Hindi", html: "hi", intl: "hi-IN" },
];

export const LANGUAGE: Record<Lang, LanguageInfo> = Object.fromEntries(LANGUAGES.map((l) => [l.id, l])) as Record<Lang, LanguageInfo>;

/** Translations load on demand, so English visitors download none of them. */
export const LOADERS: Record<Exclude<Lang, "en">, () => Promise<{ default: Translation }>> = {
  es: () => import("./es"),
  ko: () => import("./ko"),
  "ko-Kore": () => import("./ko-Kore"),
  "zh-TW": () => import("./zh-TW"),
  "zh-CN": () => import("./zh-CN"),
  ja: () => import("./ja"),
  hu: () => import("./hu"),
  pl: () => import("./pl"),
  sv: () => import("./sv"),
  el: () => import("./el"),
  "el-x-kathar": () => import("./el-x-kathar"),
  "az-Latn": () => import("./az-Latn"),
  "mn-Cyrl": () => import("./mn-Cyrl"),
  "la-x-eccl": () => import("./la-x-eccl"),
  xno: () => import("./xno"),
  pdc: () => import("./pdc"),
  ht: () => import("./ht"),
  nv: () => import("./nv"),
  it: () => import("./it"),
  tr: () => import("./tr"),
  hi: () => import("./hi"),
};

/** A ?lang= value or stored choice → a supported language (accepts common aliases such as zh-Hant or ko-Hang). */
export function parseLang(value: string | null | undefined): Lang | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  const exact = LANGUAGES.find((l) => l.id.toLowerCase() === v);
  if (exact) return exact.id;
  if (v === "ko-hani" || v === "ko-kore-kr") return "ko-Kore";
  if (v === "la") return "la-x-eccl"; // an explicit ?lang=la: ecclesiastical Latin is the site's only Latin
  return matchBrowserTag(v);
}

/**
 * Best match for one browser language tag. Historical and specialised registers (mixed-script Korean, Katharevousa,
 * ecclesiastical Latin, Law French) are offered only by explicit choice, and no language stands in for another: a
 * German browser does not get Pennsylvania Dutch, a Greek one gets Demotic, Azerbaijani or Mongolian written in
 * another script gets English.
 */
function matchBrowserTag(tag: string): Lang | null {
  const t = tag.toLowerCase();
  const primary = t.split("-")[0];
  if (primary === "zh") return /hant|-tw|-hk|-mo/.test(t) ? "zh-TW" : "zh-CN";
  if (primary === "az") return /cyrl|arab/.test(t) ? null : "az-Latn";
  if (primary === "mn") return /mong/.test(t) ? null : "mn-Cyrl";
  if (["en", "es", "ko", "ja", "hu", "pl", "sv", "el", "pdc", "ht", "nv", "it", "tr", "hi"].includes(primary)) return primary as Lang;
  return null;
}

/** First supported language in the browser's preference list, else English. */
export function browserLang(tags: readonly string[]): Lang {
  for (const tag of tags) {
    const m = matchBrowserTag(tag);
    if (m) return m;
  }
  return "en";
}
