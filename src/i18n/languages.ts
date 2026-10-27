import type { Translation } from "./en";

export type Lang = "en" | "es" | "ko" | "ko-Kore" | "zh-TW" | "zh-CN" | "ja" | "hu" | "pl" | "sv";

export interface LanguageInfo {
  id: Lang;
  /** Name in the language itself (menu) and a short form (button). */
  native: string;
  short: string;
  english: string;
  /** <html lang>: picks the right CJK glyphs and fonts. */
  html: string;
  /** Locale for numbers, dates and plural rules. */
  intl: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { id: "en", native: "English", short: "English", english: "English", html: "en", intl: "en-US" },
  { id: "es", native: "Español", short: "Español", english: "Spanish", html: "es", intl: "es-US" },
  { id: "ko", native: "한국어", short: "한국어", english: "Korean", html: "ko", intl: "ko-KR" },
  { id: "ko-Kore", native: "韓國語 (國漢文混用)", short: "韓國語", english: "Korean (mixed script)", html: "ko-Kore", intl: "ko-KR" },
  { id: "zh-TW", native: "繁體中文（台灣）", short: "繁體中文", english: "Chinese (Traditional, Taiwan)", html: "zh-Hant-TW", intl: "zh-TW" },
  { id: "zh-CN", native: "简体中文", short: "简体中文", english: "Chinese (Simplified)", html: "zh-Hans-CN", intl: "zh-CN" },
  { id: "ja", native: "日本語", short: "日本語", english: "Japanese", html: "ja", intl: "ja-JP" },
  { id: "hu", native: "Magyar", short: "Magyar", english: "Hungarian", html: "hu", intl: "hu-HU" },
  { id: "pl", native: "Polski", short: "Polski", english: "Polish", html: "pl", intl: "pl-PL" },
  { id: "sv", native: "Svenska", short: "Svenska", english: "Swedish", html: "sv", intl: "sv-SE" },
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
};

/** A ?lang= value or stored choice → a supported language (accepts common aliases such as zh-Hant or ko-Hang). */
export function parseLang(value: string | null | undefined): Lang | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  const exact = LANGUAGES.find((l) => l.id.toLowerCase() === v);
  if (exact) return exact.id;
  if (v === "ko-hani" || v === "ko-kore-kr") return "ko-Kore";
  return matchBrowserTag(v);
}

/** Best match for one browser language tag; mixed-script Korean is offered only by explicit choice. */
function matchBrowserTag(tag: string): Lang | null {
  const t = tag.toLowerCase();
  const primary = t.split("-")[0];
  if (primary === "zh") return /hant|-tw|-hk|-mo/.test(t) ? "zh-TW" : "zh-CN";
  if (["en", "es", "ko", "ja", "hu", "pl", "sv"].includes(primary)) return primary as Lang;
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
