import type { Translation } from "./en";

/**
 * Hungarian. Written with AI; review by a native speaker welcome. County names stay in English and numbers vary, so
 * sentences never attach a case suffix directly to a name or a number (they use postpositions such as közül, esetében).
 * Nouns after numbers stay singular, as Hungarian requires.
 */
const hu: Translation = {
  siteTitle: "Mennyire szokatlan a megyém?",
  subtitle: "Hasonlítsd össze a dokumentált adatközpont-fejlesztéseket az Egyesült Államok hasonló megyéivel.",
  methodologyLink: "Módszertan és források",
  langNote: "MI-vel fordítva, szakfordító vagy anyanyelvi beszélő nem ellenőrizte; hibákat tartalmazhat. A megyék és helyek neve angolul szerepel.",
  printUrl: (url) => `Interaktív változat: ${url}`,
  loadErrorTitle: "Az adatfájlokat nem sikerült betölteni.",
  loadErrorHelp: "Töltsd be újra az oldalt; ha helyben futtatod az oldalt, előbb futtasd a <code>python scripts/build_all.py</code> parancsot.",
  loadingCounties: (n) => `Adatok betöltése, összesen ${n} megye…`,
  loading: "Betöltés…",
  embedLoadError: "Ezt az összehasonlítást nem sikerült betölteni.",
  comparing: (name) => `Összehasonlítás: <b>${name}</b>`,
  examplesAria: "Példamegyék",
  tryLabel: "Próbáld ki:",
  notFound: (code) => `Nincs ilyen megyekód (${code}), ezért egy példamegye látható.`,
  srShowing: (name, verdict) => `Megjelenítve: ${name}. ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>licenc</a>). Átalakítások: ${transformations} Népesség, szárazföldi terület és megyehatárok: az USA Népszámlálási Hivatala (közkincs). Adatverzió: <code>${version}</code>.`,
  footerFallback: "Létesítményadatok: Compute Atlas, Edward Kubiak (CC BY 4.0). Megyeadatok: az USA Népszámlálási Hivatala.",
  methodologyEnglish: "Ez a szakasz csak angolul érhető el.",

  language: "Nyelv",
  languageButton: (name) => `Nyelv: ${name}`,
  languagePanelNote:
    "A fordítások MI-vel készültek, szakfordító vagy anyanyelvi beszélő nem ellenőrizte őket, ezért hibákat tartalmazhatnak. A megyék és helyek neve angolul szerepel, ezért angolul keress.",
  done: "Kész",

  freshnessAria: "Az adatok időpontja",
  dataAsOf: (date) => `Adatok állapota: <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `A létesítmények adatai a Compute Atlas ${tag} pillanatképéből származnak; az azóta bejelentett vagy módosított projektek nem szerepelnek. Népesség: népszámlálási becslés, állapot: ${popDate} Határok és terület: népszámlálási fájlok, ${geoVintage}. Az oldal adatainak utolsó frissítése: ${built}`,
  stale: (days) => `Ez a pillanatkép több mint ${days} napos, így lehetnek újabb adatok. A naprakész lista a <a>compute-atlas.com</a> oldalon található.`,

  findCounty: "Megye keresése",
  searchPlaceholder: "Angolul, pl. Loudoun County, VA",
  matchingCounties: "Találatok",
  noCountyMatch: (q) => `Nincs találat erre: „${q}”. Próbáld a megye angol nevével, „Név, ST” formában vagy ötjegyű megyekóddal.`,

  facts: (pop, density, geoid) => `${pop} lakos · ${density} fő négyzetmérföldenként · megyekód: ${geoid}`,
  shortAnswer: "Röviden",
  verdict: {
    moreAll: (total) => `Több dokumentált adatközpont-fejlesztés, mint mind a ${total} hasonló megyében`,
    lessAll: (total) => `Kevesebb dokumentált adatközpont-fejlesztés, mint mind a ${total} hasonló megyében`,
    moreMost: "Több dokumentált adatközpont-fejlesztés, mint a legtöbb hasonló megyében",
    lessMost: "Kevesebb dokumentált adatközpont-fejlesztés, mint a legtöbb hasonló megyében",
    sameZero: "A legtöbb hasonló megyéhez hasonlóan nincs dokumentált, fejlesztés alatt álló adatközpont-helyszín",
    same: "Ugyanannyi dokumentált adatközpont-fejlesztés, mint a legtöbb hasonló megyében",
    middle: "A hasonló megyék között középen helyezkedik el",
  },
  heroLabel: () => "fejlesztés alatt álló adatközpont-helyszín a nyilvántartásban",
  heroAsOf: (date) => ` (állapot: ${date})`,
  statusAria: "A helyszínek állapota a pillanatkép szerint",
  statusLine: { under_construction: "épül", permitted: "engedélyezett", proposed: "tervezett" },
  typicalSimilar: "Tipikus hasonló megye",
  similarWithAny: "Hasonló megyék, ahol van ilyen",
  nOf: (n, total) => `${total} közül ${n}`,
  averageSimilar: "Átlag a hasonlók között",
  typical: {
    none: "nincs",
    sites: (n) => `${n} helyszín`,
    range: (a, b) => `${a}–${b} helyszín`,
  },
  comparedWith: (total) => `Összevetés a ${total} leghasonlóbb megyével`,
  cmp: {
    fewer: (n) => `kevesebb: <b>${n}</b>`,
    same: (n) => `ugyanannyi: <b>${n}</b>`,
    more: (n) => `több: <b>${n}</b>`,
  },
  barAria: (total, fewer, name, same, more) =>
    `A ${total} hasonló megye közül ${fewer} esetében kevesebb a nyilvántartott helyszín, mint ${name} esetében, ${same} esetében ugyanannyi, ${more} esetében több.`,
  zeroNote:
    "A kiválasztott pillanatképben nem található megfelelő projektadat erről a megyéről. Ez nem jelenti azt, hogy itt nem terveznek adatközpontot, csak azt, hogy ez a forrás nem dokumentál ilyet.",
  similarLine: "„Hasonló” az a megye, amely népességben és népsűrűségben a legközelebb áll, bárhol az USA-ban. A leghasonlóbbak: <list/>.",
  operatingNote: (n) => `Ezenkívül ${n} működő adatközpont-helyszín is szerepel itt a nyilvántartásban (a fenti számban nincs benne).`,
  stateLine: (state, withSites, counties) =>
    `${state} állam ${counties} megyéje közül ${withSites} megyében van legalább egy nyilvántartott, fejlesztés alatt álló helyszín.`,
  findLink: "Hallottál egy konkrét projektről? Nézd meg, beleszámít-e",

  share: "Megosztás",
  shareOptions: "Megosztási lehetőségek",
  copyLink: "Hivatkozás másolása",
  printSummary: "Összefoglaló nyomtatása",
  downloadSimilar: "Hasonló megyék letöltése (CSV)",
  downloadSites: "Fejlesztés alatt álló helyszínek letöltése (CSV)",
  embedAction: "Beágyazás weboldalba…",
  linkCopied: "Hivatkozás kimásolva",
  copyFailed: "Itt nem lehet másolni; jelöld ki a szöveget, és másold ki kézzel",
  downloadStarted: "A letöltés elindult",
  embedTitle: "Az összehasonlítás beágyazása",
  embedHelp: (name) =>
    `Illeszd be ezt az oldaladba. Megjeleníti az összehasonlítást (${name}) az adatok dátumával és a forrás megjelölésével, és a teljes oldalra mutat.`,
  embedCodeLabel: "Beágyazási kód",
  copyCode: "Kód másolása",
  embedCopied: "Beágyazási kód kimásolva",

  explainTitle: "Mit jelentenek ezek a számok?",
  qCounted: "Mi számít „fejlesztés alatt álló helyszínnek”?",
  aCounted:
    "Olyan adatközpont-helyszín, amelyet a Compute Atlas nyilvános kutatási adatbázis <b>tervezett</b>, <b>engedélyezett</b> (jóváhagyott) vagy <b>épülő</b> státusszal tart nyilván, megerősített vagy sajtóban közölt forrással. A működő adatközpontokat külön számoljuk, és csak háttérként mutatjuk. Minden szám a dokumentált helyszínbejegyzések száma, ami nem azonos az épületek ellenőrzött számával.",
  qSimilar: "Melyek a „hasonló megyék”?",
  aSimilar: (total, name) =>
    `Az a ${total} amerikai megye, amely népességben és népsűrűségben (fő négyzetmérföldnyi szárazföldenként) is a legközelebb áll ehhez: ${name}. Kiválasztásukhoz nem használjuk az adatközpontokkal kapcsolatos adatokat, így azt mutatják, mi a megszokott az ilyen méretű és sűrűségű helyeken. Bármelyik államban lehetnek.`,
  qRead: "Hogyan olvassam a „kevesebb, ugyanannyi, több” adatokat?",
  aRead: (name, fewer, same, more, total) =>
    `Minden hasonló megyét összevetünk ezzel: ${name}. ${fewer} esetében kevesebb a nyilvántartott helyszín, ${same} esetében ugyanannyi, ${more} esetében több. A „legtöbb” a felénél többet jelent, vagyis legalább 21 megyét a ${total} közül. A tipikus hasonló megye az, amelyik középen áll, ha mind a ${total} megyét sorba rendezzük (a medián).`,
  qZero: "Mit jelent a nulla?",
  aZero:
    "Azt, hogy ebben a pillanatképben nem találtunk megfelelő bejegyzést. Nem jelenti azt, hogy nem terveznek adatközpontot: az adatbázis hiányos, és a jobban dokumentált helyeken több bejegyzés jelenhet meg.",
  qJudge: "Megmondja ez, hogy az itteni fejlesztés jó, rossz vagy valószínű?",
  aJudge:
    "Nem. Az eszköz csak megszámolja a dokumentált bejegyzéseket, és összeveti őket hasonló helyekkel. Nem méri a környezeti vagy gazdasági hatásokat, nem magyarázza meg, miért van egy megyében több vagy kevesebb bejegyzés, és nem jósol meg jövőbeli projekteket.",
  qCurrent: "Mennyire friss ez?",
  aCurrent: (snapshot, popDate) =>
    `A bejegyzések a Compute Atlas pillanatképéből származnak (állapot: ${snapshot}); a később bejelentett vagy módosított projektek nem szerepelnek. Az oldal hetente ellenőrzi, van-e újabb pillanatkép. A népességi adatok népszámlálási becslések (állapot: ${popDate}).`,
  fullMethodology: "Teljes módszertan és források",

  mapTitle: "Térkép",
  mapViewAria: "Térképnézet",
  mapAria: "Megyetérkép. Válassz egy megyét az összehasonlításhoz.",
  view: { county: "Ez a megye", similar: "Hasonló megyék", shaded: "Összes megye" },
  thisCounty: "Ez a megye",
  sitesInDev: (n) => `${n} fejlesztés alatt álló helyszín`,
  hoverSimilar: {
    fewer: (name) => `Hasonló megye · kevesebb, mint ${name}`,
    same: (name) => `Hasonló megye · ugyanannyi, mint ${name}`,
    more: (name) => `Hasonló megye · több, mint ${name}`,
  },
  clickToCompare: "Kattints az összehasonlításhoz",
  exactLocation: "Pontos hely",
  approxLocation: "Hozzávetőleges hely, nem a valódi helyszín",
  approxArea: (n) => `${n} helyszín ezen a hozzávetőleges területen`,
  andMore: (n) => `és még ${n}`,
  approxLocations: "Hozzávetőleges helyek, nem a valódi helyszínek",
  legendSimilarWith: "Hasonló megyék:",
  legend: {
    fewer: (n) => `kevesebb (${n})`,
    same: (n) => `ugyanannyi (${n})`,
    more: (n) => `több (${n})`,
  },
  legendSites: "Fejlesztés alatt álló helyszínek",
  legendThisCounty: "ez a megye",
  legendExact: (n) => `Pontos hely (${n})`,
  legendApprox: (n) => `Hozzávetőleges terület (${n})`,
  zoomHint: "Nagyíts rá, hogy lásd a helyszíneket.",
  offMap: (list) => `Szintén hasonlók, ezen a nézeten kívül: ${list}.`,

  chartTitle: (name) => `Hol áll ${name} a 40 hasonló megye között?`,
  chartHelp: (date, name) =>
    `Minden pont egy hasonló megye, a nyilvántartott, fejlesztés alatt álló helyszínek száma szerint elhelyezve (${date}), és aszerint színezve, hogy kevesebb, ugyanannyi vagy több van-e benne, mint ${name} esetében. Vidd fölé az egeret a részletekért; kattints az összehasonlításhoz.`,
  chartAria: (label, n, fewer, same, more) =>
    `Pontdiagram: ${label}, ${n} helyszín. A hasonló megyék közül ${fewer} esetében kevesebb, ${same} esetében ugyanannyi, ${more} esetében több.`,
  axisLabel: "Nyilvántartott, fejlesztés alatt álló adatközpont-helyszínek",
  typicalMark: (phrase) => `Tipikus: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} lakos · ${density} fő négyzetmérföldenként`,
  clickToCompareCounty: "Kattints, hogy ezt a megyét hasonlítsd össze",

  recordsTitle: (name, n) => `Nyilvántartott, fejlesztés alatt álló helyszínek – ${name} (${n})`,
  recordsHelp: (date) =>
    `A Compute Atlas pillanatképében (állapot: ${date}) dokumentált tervezett, engedélyezett vagy épülő adatközpont-helyszínek, az eredeti források hivatkozásaival. A bejegyzés „Utolsó frissítés” dátuma azt mutatja, mikor módosult utoljára a forrás információja.`,
  noRecords: "A kiválasztott pillanatképben nem található megfelelő projektadat erről a megyéről.",
  operatingSummary: (n) => `${n} működő adatközpont-helyszín (csak háttérként, a fenti számban nincs benne)`,
  reportFoot: "Hiányzik egy helyszín, vagy hibát látsz? <a>Jelezd a Compute Atlasnak</a>, az oldal forrásának.",
  field: {
    operator: "Üzemeltető",
    status: "Állapot",
    confidence: "Megbízhatóság",
    location: "Hely",
    assignment: "Megyéhez rendelés",
    updated: "Utolsó frissítés",
  },
  recordId: (id) => `Compute Atlas-bejegyzés: ${id}`,
  confidence: { confirmed: "megerősített", reported: "sajtóban közölt", rumored: "pletyka" },
  status: {
    proposed: "Tervezett",
    permitted: "Engedélyezett",
    under_construction: "Épül",
    operational: "Működik",
    cancelled: "Visszavonva",
  },
  precision: { exact: "Pontos koordináták", approximate: "Hozzávetőleges hely" },
  assignment: {
    spatial_join: "Megye a térképi koordináták alapján",
    spatial_nearest_name_confirmed: "Megye a koordináták alapján (partvonal), név ellenőrizve",
    source_name_match: "Megye a forrásban megadott név alapján",
  },
  reasons: {
    "status:operational": "Már működik (háttérként külön látható)",
    "status:cancelled": "Visszavonva",
    "facility_type:power_generation": "Energiatermelési projekt, nem adatközpont",
    "facility_type:crypto_mining": "Kriptobányászati létesítmény, nem adatközpont",
    "confidence:rumored": "Csak pletyka (alacsony megbízhatóság)",
    "assignment:outside_geographic_scope": "Az 50 államon és DC-n kívül esik",
    "assignment:unresolved_multi_site": "Több helyszínt fed le, nincs egyetlen megyéje",
    "assignment:approximate_without_source_county": "Hozzávetőleges hely, megye megnevezése nélkül",
    "assignment:ambiguous_source_county_name": "A megadott megyenév több megyére is illik",
    "assignment:unrecognized_source_county_name": "A megadott megyenév nem 2025-ös népszámlálási megye",
    "assignment:conflict_point_county_vs_source_county": "A térképi hely és a megadott megye eltér",
    "assignment:conflict_point_state_vs_source_state": "A térképi hely és a megadott állam eltér",
    "assignment:point_outside_county_polygons": "A térképi hely egyetlen megyébe sem esik",
    "assignment:point_on_county_boundary_ambiguous": "Pontosan megyehatáron fekszik",
  },

  findTitle: "Projekt keresése",
  findHelp:
    "Hallottál egy konkrét projektről? Keress a pillanatkép összes bejegyzésében név, cég vagy hely szerint, hogy lásd, beleszámít-e, és ha nem, miért.",
  findLabel: "Projektek keresése",
  findPlaceholder: "pl. Meta, Project Mica, Abilene",
  findLoading: "Több mint 2000 projektbejegyzés betöltése…",
  findError: "A projektlistát nem sikerült betölteni. Ellenőrizd a kapcsolatot, és próbáld újra.",
  findNone: (q) => `Nincs ilyen projekt: „${q}”. Lehet, hogy a Compute Atlas még nem tartja nyilván; <a>jelezheted a Compute Atlasnak</a>.`,
  source: "Forrás",
  projectType: { data_center: "Adatközpont", crypto_mining: "Kriptobányászat", power_generation: "Energiatermelés" },
  countedHere: "Itt beleszámít",
  countedHereNote: "Benne van ennek a megyének a számában.",
  counted: "Beleszámít",
  countedIn: (where) => `Megye: ${where}.`,
  compareCounty: (name) => `Összehasonlítás: ${name}`,
  operating: "Működik",
  operatingContext: (where) => (where ? `Háttérként látható (${where}), a számban nincs benne.` : "Háttérként látható, a számban nincs benne."),
  notCounted: "Nem számít bele",
  findFoot: "Tudsz egy hiányzó vagy hibás projektről? <a>Jelezd a Compute Atlasnak</a>, az oldal forrásának.",

  peersTitle: "A 40 hasonló megye, a leghasonlóbbal kezdve",
  peersRange: (p0, p1, d0, d1) =>
    `Népességük ${p0} és ${p1} fő között, népsűrűségük ${d0} és ${d1} fő/négyzetmérföld között van. Válassz egy nevet, hogy azt a megyét hasonlítsd össze.`,
  col: {
    rank: "Hely",
    county: "Megye",
    state: "Állam",
    population: "Népesség (2025)",
    density: "Fő négyzetmérföldenként",
    sites: (date) => `Fejlesztés alatt álló helyszínek (${date})`,
  },
  showFewer: (n) => `Csak a ${n} leghasonlóbb mutatása`,
  showAll: (n) => `Mind a ${n} hasonló megye mutatása`,

  summaryTitle: "Összefoglaló",
  aiChip: "MI által írt magyarázat · előre elkészítve és ellenőrizve",
  aiEnglishOnly: "Ez a magyarázat csak angolul érhető el.",
  aiNote: (model, date, status) =>
    `Egyszer írta meg a következő modell: ${model}, a megye adataiból (pillanatkép: ${date}), majd számról számra ellenőriztük (${status}). Nem élőben készül. A prompt, a bemenet és az ellenőrzések az AI_EVALUATION.md fájlban találhatók.`,
  templateChip: "Automatikus összefoglaló · rögzített sablon a kiszámított adatokból (nem MI írta)",
  aiExamples: "MI által írt példák:",
  sum: {
    zero1: (name, date) => `A kiválasztott pillanatképben (${date}) nem található megfelelő projektadat erről a megyéről: ${name}.`,
    zero2: (same, total, more, typical, median, mean) =>
      `A száma (nulla) ugyanannyi, mint a ${total} hasonló megye közül ${same} esetében, és kevesebb, mint ${more} esetében. A tipikus hasonló megye nyilvántartott helyszínei: ${typical} (medián: ${median}; átlag: ${mean}).`,
    some1: (name, n, date) =>
      `${name}: ${n} megfelelő, dokumentált adatközpont-projektbejegyzés (tervezett, engedélyezett vagy épülő) a pillanatképben (állapot: ${date}).`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Ez több, mint a ${total} hasonló megye közül ${fewer} esetében, ugyanannyi, mint ${same} esetében, és kevesebb, mint ${more} esetében. A tipikus hasonló megye nyilvántartott helyszínei: ${typical} (medián: ${median}; átlag: ${mean}).`,
    noPeers: (total) => `A ${total} hasonló megye egyikében sincs megfelelő bejegyzés ebben a pillanatképben.`,
    peers: (n, total, pct) => `A ${total} hasonló megye közül ${n} esetében (${pct}%) van legalább egy megfelelő bejegyzés.`,
    caveat:
      "A hasonló megyék népességben és népsűrűségben állnak a legközelebb; kiválasztásukhoz nem használjuk az adatközpontokkal kapcsolatos adatokat. A számok egyetlen, hiányos pillanatkép dokumentált bejegyzéseit tükrözik, így az összehasonlítás leíró jellegű, és nem mutat okokat, hatásokat vagy statisztikai szignifikanciát.",
  },

  embedNote: (date) =>
    `A hasonló megyék az a 40 megye, amely népességben és népsűrűségben a legközelebb áll. Adatok állapota: ${date} Forrás: Compute Atlas (Edward Kubiak, CC BY 4.0) és az USA Népszámlálási Hivatala. Csak dokumentált bejegyzések; nem az összes projekt száma.`,
  seeFull: "A teljes összehasonlítás megtekintése",
  errorTitle: "Hiba történt",
  errorBody:
    "Az oldal betöltése nem fejeződött be. Ez közvetlenül az oldal frissítése után fordulhat elő. Az újratöltés általában megoldja; a megyéd a címben megmarad.",
  reload: "Újratöltés",
};

export default hu;
