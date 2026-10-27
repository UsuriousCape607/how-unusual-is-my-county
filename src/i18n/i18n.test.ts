import { afterEach, describe, expect, it } from "vitest";
import { en, type Messages, type Translation } from "./en";
import { LANGUAGES, LOADERS, browserLang, parseLang, type Lang } from "./languages";
import { plain } from "./Rich";
import { setActive } from "./state";
import { fmtAgo, fmtDate, fmtDensity, fmtInt, fmtStat } from "../lib/format";
import { verdict } from "../lib/summary";

const translations = Object.fromEntries(
  await Promise.all(Object.entries(LOADERS).map(async ([lang, load]) => [lang, (await load()).default])),
) as Record<Exclude<Lang, "en">, Translation>;

/** Every message (including nested groups) as [path, value]. */
function leaves(obj: Record<string, unknown>, prefix = ""): [string, unknown][] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? leaves(v as Record<string, unknown>, `${prefix}${k}.`) : [[`${prefix}${k}`, v] as [string, unknown]],
  );
}

// Messages whose number is shown next to them rather than inside them (the big figure before "sites in development").
const NUMBER_SHOWN_ELSEWHERE = new Set(["heroLabel"]);

afterEach(() => setActive("en", en));

describe("translations", () => {
  const enLeaves = new Map(leaves(en));

  it("every language translates every message", () => {
    for (const [lang, t] of Object.entries(translations)) {
      const have = new Set(leaves(t as Record<string, unknown>).map(([k]) => k));
      const missing = [...enLeaves.keys()].filter((k) => !have.has(k));
      expect(missing, lang).toEqual([]);
    }
  });

  it("keeps every number and name it is given, with balanced markup", () => {
    for (const [lang, t] of Object.entries(translations)) {
      for (const [key, value] of leaves(t as Record<string, unknown>)) {
        const ref = enLeaves.get(key);
        expect(ref, `${lang}: ${key} is not an English key`).toBeDefined();
        expect(typeof value, `${lang}: ${key}`).toBe(typeof ref);
        let out: string;
        if (typeof value === "function") {
          // A distinct number per parameter (names and dates included), so each one can be found in the output.
          const args = Array.from({ length: (ref as (...a: unknown[]) => string).length }, (_, i) => 101 + i);
          out = (value as (...a: unknown[]) => string)(...args);
          if (!NUMBER_SHOWN_ELSEWHERE.has(key)) for (const a of args) expect(out, `${lang}: ${key} should include ${a}`).toContain(String(a));
        } else {
          out = value as string;
        }
        expect(out, `${lang}: ${key}`).not.toMatch(/undefined|NaN|\[object/);
        for (const tag of ["b", "a", "code"]) {
          expect((out.match(new RegExp(`<${tag}>`, "g")) ?? []).length, `${lang}: ${key} <${tag}>`).toBe((out.match(new RegExp(`</${tag}>`, "g")) ?? []).length);
        }
        if (typeof ref === "string" && (ref as string).includes("<list/>")) expect(out, `${lang}: ${key}`).toContain("<list/>");
      }
    }
  });

  it("translated versions explain that the methodology and AI text are English", () => {
    for (const [lang, t] of Object.entries(translations)) {
      expect(t.methodologyEnglish, lang).toBeTruthy();
      expect(t.aiEnglishOnly, lang).toBeTruthy();
      expect(t.langNote, lang).toBeTruthy();
    }
  });
});

describe("choosing a language", () => {
  it("maps browser languages to the closest supported one", () => {
    expect(browserLang(["ja-JP", "en-US"])).toBe("ja");
    expect(browserLang(["zh-HK"])).toBe("zh-TW");
    expect(browserLang(["zh-Hant"])).toBe("zh-TW");
    expect(browserLang(["zh"])).toBe("zh-CN");
    expect(browserLang(["ko-KR"])).toBe("ko"); // mixed script only by explicit choice
    expect(browserLang(["pt-BR", "sv-FI"])).toBe("sv");
    expect(browserLang(["fr-FR"])).toBe("en");
  });
  it("accepts ?lang= values and aliases", () => {
    expect(parseLang("ko-Kore")).toBe("ko-Kore");
    expect(parseLang("KO-KORE")).toBe("ko-Kore");
    expect(parseLang("zh-tw")).toBe("zh-TW");
    expect(parseLang("es-MX")).toBe("es");
    expect(parseLang("xx")).toBeNull();
    expect(LANGUAGES.map((l) => l.id)).toEqual(["en", "es", "ko", "ko-Kore", "zh-TW", "zh-CN", "ja", "hu", "pl", "sv"]);
  });
});

describe("formatting follows the language", () => {
  const use = (lang: Exclude<Lang, "en">) => setActive(lang, { ...en, ...translations[lang] } as Messages);

  it("dates", () => {
    expect(fmtDate("2026-10-02")).toBe("October 2, 2026");
    use("hu");
    expect(fmtDate("2026-10-02")).toBe("2026. október 2.");
    use("ja");
    expect(fmtDate("2026-10-02")).toBe("2026年10月2日");
    use("ko-Kore");
    expect(fmtDate("2026-10-02")).toBe("2026年 10月 2日");
    use("es");
    expect(fmtDate("2026-10-02")).toBe("2 de octubre de 2026");
  });
  it("numbers and relative time", () => {
    use("sv");
    expect(fmtDensity(12.4)).toBe("12,4");
    expect(fmtStat(0.5)).toBe("0,5");
    expect(fmtInt(1914391).replace(/\s/g, " ")).toBe("1 914 391");
    use("pl");
    expect(fmtAgo(3)).toBe("3 dni temu");
    use("ja");
    expect(fmtAgo(0)).toBe("今日");
  });
  it("the verdict", () => {
    const c = { pipeline_count: 9 } as Parameters<typeof verdict>[0];
    const p = { n_fewer: 40, n_equal: 0, n_greater: 0 } as Parameters<typeof verdict>[1];
    use("ja");
    expect(verdict(c, p).headline).toBe("記録上のデータセンター開発は、類似する 40 郡のすべてより多い");
    use("ko-Kore");
    expect(verdict(c, p).headline).toContain("類似한 카운티 40곳");
  });
  it("plain() strips markup for labels", () => {
    expect(plain(en.dataAsOf("Oct 2"))).toBe("Data as of Oct 2");
  });
});
