import { afterEach, describe, expect, it } from "vitest";
import { en, type Messages, type Translation } from "./en";
import { LANGUAGES, LOADERS, browserLang, parseLang, type Lang } from "./languages";
import { plain } from "./Rich";
import { setActive } from "./state";
import { fmtAgo, fmtDate, fmtDateShort, fmtDensity, fmtInt, fmtStat, listParts } from "../lib/format";
import { asEnglish } from "./state";
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

  it("say in every language that they were made with AI and not checked by professionals or native speakers", () => {
    expect(en.languagePanelNote).toMatch(/AI.*professional translators or native speakers/);
    for (const [lang, t] of Object.entries(translations)) {
      expect(t.languagePanelNote, lang).toBeTruthy();
      expect(t.languagePanelNote, lang).not.toBe(en.languagePanelNote);
    }
  });

  it("Navajo uses the modifier-letter apostrophe (ʼ), never a typewriter or curly quote, inside words", () => {
    for (const [key, value] of leaves(translations.nv as Record<string, unknown>)) {
      const text = typeof value === "function" ? (value as (...a: unknown[]) => string)(101, 102, 103, 104, 105, 106, 107) : (value as string);
      expect(text, key).not.toMatch(/\p{L}['’]\p{L}/u);
    }
  });

  it("Katharevousa is polytonic and Demotic is monotonic", () => {
    const text = (t: Translation) => leaves(t as Record<string, unknown>).filter(([, v]) => typeof v === "string").map(([, v]) => v).join(" ");
    expect(text(translations["el-x-kathar"])).toMatch(/[\u1F00-\u1FFF]/);
    expect(text(translations.el)).not.toMatch(/[\u1F00-\u1FFF]/);
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
    expect(browserLang(["el-GR"])).toBe("el"); // Demotic, never Katharevousa
    expect(browserLang(["de-DE"])).toBe("en"); // Standard German does not get Pennsylvania Dutch
    expect(browserLang(["de-US", "pdc"])).toBe("pdc");
    expect(browserLang(["nl-NL"])).toBe("en");
    expect(browserLang(["az-AZ"])).toBe("az-Latn");
    expect(browserLang(["az-Cyrl-AZ"])).toBe("en");
    expect(browserLang(["mn-MN"])).toBe("mn-Cyrl");
    expect(browserLang(["mn-Mong"])).toBe("en");
    expect(browserLang(["la"])).toBe("en"); // historical registers only by explicit choice
    expect(browserLang(["fr-FR", "ht-HT"])).toBe("ht"); // French does not get Haitian Creole, but Haitian Creole does
    expect(browserLang(["nv-US"])).toBe("nv");
    expect(browserLang(["it-CH"])).toBe("it");
    expect(browserLang(["tr-TR"])).toBe("tr");
    expect(browserLang(["hi-IN"])).toBe("hi");
  });
  it("accepts ?lang= values and aliases", () => {
    expect(parseLang("ko-Kore")).toBe("ko-Kore");
    expect(parseLang("KO-KORE")).toBe("ko-Kore");
    expect(parseLang("zh-tw")).toBe("zh-TW");
    expect(parseLang("es-MX")).toBe("es");
    expect(parseLang("xx")).toBeNull();
    expect(parseLang("el-x-kathar")).toBe("el-x-kathar");
    expect(parseLang("EL-X-KATHAR")).toBe("el-x-kathar");
    expect(parseLang("el")).toBe("el");
    expect(parseLang("la")).toBe("la-x-eccl");
    expect(parseLang("la-x-eccl")).toBe("la-x-eccl");
    expect(parseLang("xno")).toBe("xno");
    expect(parseLang("pdc")).toBe("pdc");
    expect(parseLang("de")).toBeNull();
    expect(parseLang("az-latn")).toBe("az-Latn");
    expect(parseLang("mn-cyrl")).toBe("mn-Cyrl");
  });
  it("offers exactly these 22 languages, each loadable and LTR-safe", () => {
    expect(LANGUAGES.map((l) => l.id)).toEqual([
      "en", "es", "ko", "ko-Kore", "zh-TW", "zh-CN", "ja", "hu", "pl", "sv",
      "el", "el-x-kathar", "az-Latn", "mn-Cyrl", "la-x-eccl", "xno", "pdc", "ht", "nv", "it", "tr", "hi",
    ]);
    expect(Object.keys(LOADERS).sort()).toEqual(LANGUAGES.filter((l) => l.id !== "en").map((l) => l.id).sort());
    expect(new Set(LANGUAGES.map((l) => l.native)).size).toBe(22);
    expect(new Set(LANGUAGES.map((l) => l.html)).size).toBe(22);
    for (const l of LANGUAGES) expect(() => new Intl.NumberFormat(l.intl), l.id).not.toThrow();
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
  // Languages whose dates, "ago" and lists are written out in formats.ts (the browser has no data for them, or the
  // wrong register): long date, short date, ago(0), ago(1), ago(12), ago(95), list joiner.
  const WRITTEN_OUT: [Exclude<Lang, "en">, string, string, string, string, string, string, string][] = [
    ["el-x-kathar", "2 Ὀκτωβρίου 2026", "2 Ὀκτ. 2026", "σήμερον", "χθές", "πρὸ 12 ἡμερῶν", "πρὸ 3 περίπου μηνῶν", " καὶ "],
    ["az-Latn", "2 oktyabr 2026", "2 okt 2026", "bu gün", "dünən", "12 gün əvvəl", "təxminən 3 ay əvvəl", " və "],
    ["mn-Cyrl", "2026 оны 10-р сарын 2", "2026.10.02", "өнөөдөр", "өчигдөр", "12 хоногийн өмнө", "ойролцоогоор 3 сарын өмнө", " болон "],
    ["la-x-eccl", "die 2 mensis Octobris anno 2026", "2 Oct. 2026", "hodie", "heri", "ante 12 dies", "ante menses circiter 3", " et "],
    ["xno", "2 jour d’Octobre l’an 2026", "2 Oct. 2026", "a jour de huy", "hier", "12 jours passez", "entour 3 moys passez", " et "],
    ["pdc", "2. Oktower 2026", "2. Okt. 2026", "heit", "geschder", "vor 12 Daag", "vor ebaut 3 Munet", " un "],
    ["ht", "2 oktòb 2026", "2 oktòb 2026", "jodi a", "yè", "sa gen 12 jou", "sa gen anviwon 3 mwa", " ak "],
    ["nv", "Ghąąjįʼ 2, 2026", "Ghąąjįʼ 2, 2026", "dííjį́", "adąąʼdą́ą́ʼ", "12 jį́ yę́ędą́ą́ʼ", "3 nídeezid yę́ędą́ą́ʼ", " dóó "],
  ];
  it.each(WRITTEN_OUT)("%s writes out dates, “ago” and lists", (lang, long, short, ago0, ago1, ago12, ago95, joiner) => {
    use(lang);
    expect(fmtDate("2026-10-02")).toBe(long);
    expect(fmtDateShort("2026-10-02")).toBe(short);
    expect([fmtAgo(0), fmtAgo(1), fmtAgo(12), fmtAgo(95)]).toEqual([ago0, ago1, ago12, ago95]);
    const parts = listParts(["A", "B", "C"]);
    expect(parts.map((p) => p.value).join("")).toBe(`A, B${joiner}C`);
    expect(parts.filter((p) => p.type === "element").map((p) => p.value)).toEqual(["A", "B", "C"]);
  });
  it("browser-formatted languages", () => {
    use("el");
    expect(fmtDate("2026-10-02")).toBe("2 Οκτωβρίου 2026");
    use("it");
    expect(fmtDate("2026-10-02")).toBe("2 ottobre 2026");
    expect(fmtDensity(12.4)).toBe("12,4");
    use("tr");
    expect(fmtDate("2026-10-02")).toBe("2 Ekim 2026");
    use("hi");
    expect(fmtDate("2026-10-02")).toMatch(/^2 अक्(?:ट|त)ूबर 2026$/); // spelling varies with the ICU version
    expect(listParts(["A", "B", "C"]).map((p) => p.value).join("")).toMatch(/^A, B,? और C$/); // CLDR adds the serial comma
  });
  it("falls back to an ISO date, no “ago” and comma lists when the browser lacks a language", () => {
    const info = LANGUAGES.find((l) => l.id === "it")!;
    const saved = info.intl;
    try {
      info.intl = "qaa-QM"; // a private-use locale no browser has data for
      use("it");
      expect(fmtDate("2026-10-02")).toBe("2026-10-02");
      expect(fmtAgo(3)).toBe("");
      expect(listParts(["A", "B", "C"]).map((p) => p.value).join("")).toBe("A, B, C");
    } finally {
      info.intl = saved;
    }
  });
  it("English output is unchanged, and English sections stay English in any language", () => {
    expect([fmtDate("2026-10-02"), fmtDateShort("2026-10-02"), fmtAgo(0), fmtAgo(1), fmtAgo(12), fmtAgo(95)]).toEqual([
      "October 2, 2026", "Oct 2, 2026", "today", "1 day ago", "12 days ago", "about 3 months ago",
    ]);
    expect(listParts(["A", "B", "C"]).map((p) => p.value).join("")).toBe("A, B, and C");
    use("la-x-eccl");
    expect(asEnglish(() => [fmtDate("2026-10-02"), fmtInt(12345)])).toEqual(["October 2, 2026", "12,345"]);
    expect(fmtInt(12345)).toBe("12.345");
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
