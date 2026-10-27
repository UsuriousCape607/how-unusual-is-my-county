import type { Lang } from "./languages";

/**
 * Dates, "N days ago" and list joining written out by hand for languages whose conventions the browser's Intl data
 * cannot be trusted to supply. Checked in Chromium: no locale data at all for Mongolian, Latin, Anglo-Norman,
 * Pennsylvania Dutch, Haitian Creole or Navajo (Intl silently answers in English), only placeholder data for
 * Azerbaijani ("2026 M10 2", "-3 d"), and no polytonic Greek or hanja date forms. Numbers still go through Intl, using
 * the `intl` locale in languages.ts (chosen for its digit grouping and decimal sign).
 */
export interface CustomFormat {
  /** Long ("2 October 2026") or short ("2 Oct 2026") date; month is 0–11. */
  date?: (day: number, month: number, year: number, short: boolean) => string;
  /** How long ago, in whole days (0 = today). */
  ago?: (days: number) => string;
  /** Word joining the last two items of a list: "A, B and C". */
  and?: string;
}

const words = (s: string) => s.split(" ");
const months = (days: number) => Math.round(days / 30.44);

const KATHAREVOUSA = words("Ἰανουαρίου Φεβρουαρίου Μαρτίου Ἀπριλίου Μαΐου Ἰουνίου Ἰουλίου Αὐγούστου Σεπτεμβρίου Ὀκτωβρίου Νοεμβρίου Δεκεμβρίου");
const KATHAREVOUSA_SHORT = words("Ἰαν. Φεβρ. Μαρτ. Ἀπρ. Μαΐου Ἰουν. Ἰουλ. Αὐγ. Σεπτ. Ὀκτ. Νοεμ. Δεκ.");
const AZERBAIJANI = words("yanvar fevral mart aprel may iyun iyul avqust sentyabr oktyabr noyabr dekabr");
const LATIN = words("Ianuarii Februarii Martii Aprilis Maii Iunii Iulii Augusti Septembris Octobris Novembris Decembris");
const LATIN_SHORT = words("Ian. Feb. Mart. Apr. Mai. Iun. Iul. Aug. Sept. Oct. Nov. Dec.");
const ANGLO_NORMAN = words("Janver Feverer Marz Averil May Juyn Juyl August Septembre Octobre Novembre Decembre");
const DEITSCH = words("Yenner Hanning Marz Abril Moi Yuni Yuli Auguscht September Oktower Nowember Disember");
const KREYOL = words("janvye fevriye mas avril me jen jiyè out septanm oktòb novanm desanm");
const DINE = ["Yas Niłtʼees", "Atsá Biyáázh", "Wóózhchʼį́į́d", "Tʼą́ą́chil", "Tʼą́ą́tsoh", "Yaʼiishjááshchilí", "Yaʼiishjáástsoh", "Biniʼantʼą́ą́tsʼózí", "Biniʼantʼą́ą́tsoh", "Ghąąjįʼ", "Níłchʼitsʼósí", "Níłchʼitsoh"];
const pad = (n: number) => String(n).padStart(2, "0");

export const CUSTOM_FORMATS: Partial<Record<Lang, CustomFormat>> = {
  // Mixed-script Korean writes dates with hanja: 2026年 10月 2日. Relative time and lists come from Intl (ko).
  "ko-Kore": { date: (d, m, y) => `${y}年 ${m + 1}月 ${d}日` },
  // Katharevousa, polytonic: genitive month names, learned "πρὸ … ἡμερῶν".
  "el-x-kathar": {
    date: (d, m, y, short) => `${d} ${(short ? KATHAREVOUSA_SHORT : KATHAREVOUSA)[m]} ${y}`,
    ago: (n) => (n <= 0 ? "σήμερον" : n === 1 ? "χθές" : n < 60 ? `πρὸ ${n} ἡμερῶν` : `πρὸ ${months(n)} περίπου μηνῶν`),
    and: "καὶ",
  },
  "az-Latn": {
    date: (d, m, y, short) => `${d} ${short ? AZERBAIJANI[m].slice(0, 3) : AZERBAIJANI[m]} ${y}`,
    ago: (n) => (n <= 0 ? "bu gün" : n === 1 ? "dünən" : n < 60 ? `${n} gün əvvəl` : `təxminən ${months(n)} ay əvvəl`),
    and: "və",
  },
  // Mongolian names months by number: 2026 оны 10-р сарын 2; short form 2026.10.02.
  "mn-Cyrl": {
    date: (d, m, y, short) => (short ? `${y}.${pad(m + 1)}.${pad(d)}` : `${y} оны ${m + 1}-р сарын ${d}`),
    ago: (n) => (n <= 0 ? "өнөөдөр" : n === 1 ? "өчигдөр" : n < 60 ? `${n} хоногийн өмнө` : `ойролцоогоор ${months(n)} сарын өмнө`),
    and: "болон",
  },
  // Curial style: "die 2 mensis Octobris anno 2026" (an ablative of time, so sentences are built around it).
  "la-x-eccl": {
    date: (d, m, y, short) => (short ? `${d} ${LATIN_SHORT[m]} ${y}` : `die ${d} mensis ${LATIN[m]} anno ${y}`),
    ago: (n) => (n <= 0 ? "hodie" : n === 1 ? "heri" : n < 60 ? `ante ${n} dies` : `ante menses circiter ${months(n)}`),
    and: "et",
  },
  // Law French: "2 jour d’Octobre l’an 2026".
  xno: {
    date: (d, m, y, short) => {
      const mo = ANGLO_NORMAN[m];
      return short ? `${d} ${mo.slice(0, 3)}. ${y}` : `${d} jour ${/^[AEIOU]/.test(mo) ? "d’" : "de "}${mo} l’an ${y}`;
    },
    ago: (n) => (n <= 0 ? "a jour de huy" : n === 1 ? "hier" : n < 60 ? `${n} jours passez` : `entour ${months(n)} moys passez`),
    and: "et",
  },
  // Pennsylvania Dutch (Buffington–Barba spelling): "2. Oktower 2026".
  pdc: {
    date: (d, m, y, short) => `${d}. ${short ? `${DEITSCH[m].slice(0, 3)}.` : DEITSCH[m]} ${y}`,
    ago: (n) => (n <= 0 ? "heit" : n === 1 ? "geschder" : n < 60 ? `vor ${n} Daag` : `vor ebaut ${months(n)} Munet`),
    and: "un",
  },
  ht: {
    date: (d, m, y) => `${d} ${KREYOL[m]} ${y}`,
    ago: (n) => (n <= 0 ? "jodi a" : n === 1 ? "yè" : n < 60 ? `sa gen ${n} jou` : `sa gen anviwon ${months(n)} mwa`),
    and: "ak",
  },
  // Navajo month names; month–day–year order as in Navajo Nation publications. "Ago" phrasing is low-confidence.
  nv: {
    date: (d, m, y) => `${DINE[m]} ${d}, ${y}`,
    ago: (n) => (n <= 0 ? "dííjį́" : n === 1 ? "adąąʼdą́ą́ʼ" : n < 60 ? `${n} jį́ yę́ędą́ą́ʼ` : `${months(n)} nídeezid yę́ędą́ą́ʼ`),
    and: "dóó",
  },
};
