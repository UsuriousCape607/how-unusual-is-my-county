import type { Translation } from "./en";

/**
 * Pennsylvania Dutch (Deitsch), German-based Buffington–Barba spelling — not Standard German: net, is/sin, hot/hen,
 * Leit, Daag, Kaundi, Schtaat, uffgschriwwe, yuscht, ebbes, letz, Gschaerr. English technical loans (Data-Center,
 * Link, Snapshot, Feils) are kept, as Deitsch speakers use them. "Development" is rendered through the recorded sites
 * themselves ("Bletz, wu am Kumme sin"). Written with AI; not checked by professional translators or native speakers —
 * see TRANSLATION_REVIEW.md for low-confidence terms.
 */
const Bletz = (n: number) => (n === 1 ? "Blatz" : "Bletz");

const pdc: Translation = {
  siteTitle: "Wie ungewehnlich is mei Kaundi?",
  subtitle: "Vergleich die uffgschriwwene Data-Center-Bletz mit ehnliche Kaundis iwwerall in die Vereenichte Schtaade.",
  methodologyLink: "Methode un Quelle",
  langNote: "Mit AI iwwersetzt; ken Iwwersetzer un ken Mudderschprooch-Schwetzer hot's nochgeguckt, so's kann Fehler hawwe. Die Naame vun Kaundis un Bletz sin in Englisch.",
  printUrl: (url) => `Interaktiv Version: ${url}`,
  loadErrorTitle: "Mer hen die Data-Feils net laade kenne.",
  loadErrorHelp: "Laad die Seit nochemol fer's widder browiere; wann du die Webseit uff deim eegne Kombyuder laaft, laaf zerscht <code>python scripts/build_all.py</code>.",
  loadingCounties: (n) => `Am Laade, Data fer ${n} Kaundis…`,
  loading: "Am Laade…",
  embedLoadError: "Mer hen den Vergleich net laade kenne.",
  comparing: (name) => `Mer vergleiche <b>${name}</b>`,
  examplesAria: "Beischpiel-Kaundis",
  tryLabel: "Browier:",
  notFound: (code) => `Mer hen ken Kaundi mit em Kode ${code} gfunne, also weise mer en Beischpiel-Kaundi.`,
  srShowing: (name, verdict) => `Do is ${name}: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>Lizens</a>). Was gennert is: ${transformations} Leit, Landflaech un Kaundi-Grenze: US Census Bureau (fer alle frei). Data-Version <code>${version}</code>.`,
  footerFallback: "Data vun de Bletz: Compute Atlas vum Edward Kubiak (CC BY 4.0). Kaundi-Data: US Census Bureau.",
  methodologyEnglish: "Des Schtick gebt's yuscht in Englisch.",

  language: "Schprooch",
  languageButton: (name) => `Schprooch: ${name}`,
  languagePanelNote:
    "Die Iwwersetzinge sin mit AI gmacht, un ken Iwwersetzer un ken Mudderschprooch-Schwetzer hot sie nochgeguckt, so sie kenne Fehler hawwe. Die Naame vun Kaundis un Bletz sin in Englisch, also such in Englisch.",
  done: "Fattich",

  freshnessAria: "Vun wann die Data sin",
  dataAsOf: (date) => `Data vum <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Die Eitraeg vun de Bletz kumme vum Compute-Atlas-Snapshot ${tag}; Projekte, wu nooch dem Daag aagekindicht odder gennert waare, sin net drin. Leit: Census-Schatzinge fer de ${popDate}. Grenze un Flaech: Census-Feils vun ${geoVintage}. Die Data vun de Webseit sin letscht nei gmacht waare: ${built}.`,
  stale: (days) =>
    `Der Snapshot is iwwer ${days} Daag alt, so's kennt neiere Eitraeg gewwe. Die aktuell Lischt is uff <a>compute-atlas.com</a>.`,

  findCounty: "Find en Kaundi",
  searchPlaceholder: "In Englisch, wie Loudoun County, VA",
  matchingCounties: "Kaundis, wu basse",
  noCountyMatch: (q) => `Ken Kaundi basst zu „${q}“. Browier der englisch Naame vum Kaundi, „Naame, ST“ odder en Kaundi-Kode mit 5 Ziffere.`,

  facts: (pop, density, geoid) => `${pop} Leit · ${density} pro Quadraatmeil · Kaundi-Kode ${geoid}`,
  shortAnswer: "Die korz Antwatt",
  verdict: {
    moreAll: (total) => `Meh uffgschriwwene Data-Center-Bletz as all ${total} ehnliche Kaundis`,
    lessAll: (total) => `Wennicher uffgschriwwene Data-Center-Bletz as all ${total} ehnliche Kaundis`,
    moreMost: "Meh uffgschriwwene Data-Center-Bletz as die meeschte ehnliche Kaundis",
    lessMost: "Wennicher uffgschriwwene Data-Center-Bletz as die meeschte ehnliche Kaundis",
    sameZero: "Wie die meeschte ehnliche Kaundis: ken uffgschriwwene Data-Center-Bletz, wu am Kumme sin",
    same: "Grad so viel uffgschriwwene Data-Center-Bletz as die meeschte ehnliche Kaundis",
    middle: "In de Mitt vun de ehnliche Kaundis",
  },
  heroLabel: (n) => (n === 1 ? "uffgschriwwener Data-Center-Blatz, wu am Kumme is" : "uffgschriwwene Data-Center-Bletz, wu am Kumme sin"),
  heroAsOf: (date) => ` (Schtand: ${date})`,
  statusAria: "Schtand vun denne Bletz, wie's im Snapshot schteht",
  statusLine: { under_construction: "waerre gebaut", permitted: "erlaabt", proposed: "vorgschlagge" },
  typicalSimilar: "Gewehnlicher ehnlicher Kaundi",
  similarWithAny: "Ehnliche Kaundis mit eens odder meh",
  nOf: (n, total) => `${n} vun ${total}`,
  averageSimilar: "Dorchschnitt bei de Ehnliche",
  typical: {
    none: "ken",
    sites: (n) => `${n} ${Bletz(n)}`,
    range: (a, b) => `${a} bis ${b} Bletz`,
  },
  comparedWith: (total) => `Verglieche mit de ${total} ehnlichschte Kaundis`,
  cmp: {
    fewer: (n) => `<b>${n}</b> hen wennicher`,
    same: (n) => `<b>${n}</b> hen grad so viel`,
    more: (n) => `<b>${n}</b> hen meh`,
  },
  barAria: (total, fewer, name, same, more) =>
    `Vun ${total} ehnliche Kaundis hen ${fewer} wennicher uffgschriwwene Bletz as ${name}, ${same} hen grad so viel, un ${more} hen meh.`,
  zeroNote:
    "Im Snapshot, wu du gwehlt hoscht, hen mer ken bassende Projekt-Eitraeg fer den Kaundi gfunne. Des meent net, ass do ken Data-Center geplannt sin — yuscht, ass die Quell ken uffgschriwwe hot.",
  similarLine: "„Ehnlich“ meent: am neegschte in de Zaahl vun Leit un wie dicht sie wuhne, egal wu in Amerikaa. Die ehnlichschte sin <list/>.",
  operatingNote: (n) =>
    n === 1
      ? "Newwebei: Do is 1 Data-Center uffgschriwwe, wu schunn laaft (owwe net gezehlt)."
      : `Newwebei: Do sin ${n} Data-Centers uffgschriwwe, wu schunn laafe (owwe net gezehlt).`,
  stateLine: (state, withSites, counties) =>
    `In ${state} hen ${withSites} vun ${counties} Kaundis zum wennigschte een uffgschriwwener Blatz, wu am Kumme is.`,
  findLink: "Hoscht vun me gewisse Projekt geheert? Guck, eb's gezehlt is",

  share: "Deele",
  shareOptions: "Wie deele",
  copyLink: "Link koppiere",
  printSummary: "Zammefassing drucke",
  downloadSimilar: "Ehnliche Kaundis runnerlaade (CSV)",
  downloadSites: "Bletz am Kumme runnerlaade (CSV)",
  embedAction: "Uff en Webseit neisetze…",
  linkCopied: "Link koppiert",
  copyFailed: "Do kann mer net koppiere; mark der Text un koppier ihn selwert",
  downloadStarted: "Runnerlaade hot aagfange",
  embedTitle: "Den Vergleich neisetze",
  embedHelp: (name) =>
    `Duh des uff dei Seit. Es weist der Vergleich fer ${name} mit em Daag vun de Data un wu sie herkumme, un hot en Link zu de ganz Webseit.`,
  embedCodeLabel: "Kode fer neisetze",
  copyCode: "Kode koppiere",
  embedCopied: "Kode koppiert",

  explainTitle: "Was meene die Zaahle?",
  qCounted: "Was zehlt as „Blatz, wu am Kumme is“?",
  aCounted:
    "En Data-Center-Blatz, wu die effentlich Forsching-Lischt Compute Atlas as <b>vorgschlagge</b>, <b>erlaabt</b> (gutgheese) odder <b>waerd gebaut</b> uffschreibt, mit Quelle, wu bschtaericht odder in de Zeiding gemeldt sin. Data-Centers, wu schunn laafe, waerre extra gezehlt un yuscht fer's Bild gewisse. Yede Zaahl is wie viel Blatz-Eitraeg uffgschriwwe sin; des is net es seem wie en nochgezehlte Zaahl vun Gebeier.",
  qSimilar: "Wer sin die „ehnliche Kaundis“?",
  aSimilar: (total, name) =>
    `Die ${total} Kaundis in Amerikaa, wu am neegschte bei ${name} sin, beides in de Zaahl vun Leit un wie dicht sie wuhne (Leit pro Quadraatmeil Land). Was mit Data-Centers laaft, waerd net gebraucht fer sie raus zu suche, also weise sie, was gewehnlich is fer Bletz vun dere Grees un Dichde. Sie kenne in yedem Schtaat sei.`,
  qRead: "Wie les ich „wennicher, grad so viel, meh“?",
  aRead: (name, fewer, same, more, total) =>
    `Yeder ehnlicher Kaundi waerd mit ${name} verglieche: ${fewer} hen wennicher uffgschriwwene Bletz, ${same} hen grad so viel, un ${more} hen meh. „Die meeschte“ meent meh as die Helft, also zum wennigschte 21 vun ${total}. Der gewehnlich ehnlich Kaundi is der in de Mitt, wann mer all ${total} nooch ihre Zaahl uffreiht (der Median).`,
  qZero: "Was meent en Null?",
  aZero:
    "Ass mer in dem Snapshot ken bassender Eitraag gfunne hen. Es meent net, ass ken Data-Center geplannt is: die Lischt is net ganz, un Bletz, wu besser uffgschriwwe sin, kenne meh Eitraeg weise.",
  qJudge: "Saagt des, eb es Baue do gut, schlecht odder waahrscheinlich is?",
  aJudge:
    "Nee. Des Gschaerr zehlt yuscht uffgschriwwene Eitraeg un vergleicht sie mit ehnliche Bletz. Es messt ken Effekte uff die Natur odder es Geld, es saagt net, warum en Kaundi meh odder wennicher Eitraeg hot, un es saagt ken Projekte vorraus.",
  qCurrent: "Wie frisch sin die Data?",
  aCurrent: (snapshot, popDate) =>
    `Die Eitraeg kumme vum Compute-Atlas-Snapshot vum ${snapshot}; Projekte, wu schpeeder aagekindicht odder gennert waare, sin net drin. Die Webseit guckt alle Woch, eb's en neiere Snapshot gebt. Die Zaahle vun Leit sin Census-Schatzinge fer de ${popDate}.`,
  fullMethodology: "Ganze Methode un Quelle",

  mapTitle: "Landkaart",
  mapViewAria: "Wie die Kaart weist",
  mapAria: "Kaart vun de Kaundis. Wehl en Kaundi fer ihn zu vergleiche.",
  view: { county: "Der Kaundi", similar: "Ehnliche Kaundis", shaded: "All Kaundis" },
  thisCounty: "Der Kaundi",
  sitesInDev: (n) => `${n} ${Bletz(n)} am Kumme`,
  hoverSimilar: {
    fewer: (name) => `Ehnlicher Kaundi · wennicher as ${name}`,
    same: (name) => `Ehnlicher Kaundi · grad so viel as ${name}`,
    more: (name) => `Ehnlicher Kaundi · meh as ${name}`,
  },
  clickToCompare: "Klick fer vergleiche",
  exactLocation: "Genaue Blatz",
  approxLocation: "Ungfaehrer Blatz, net der wohr Blatz",
  approxArea: (n) => `${n} Bletz in dem ungfaehre Gebiet`,
  andMore: (n) => `un noch ${n}`,
  approxLocations: "Ungfaehre Bletz, net die wohre Bletz",
  legendSimilarWith: "Ehnliche Kaundis mit",
  legend: {
    fewer: (n) => `wennicher (${n})`,
    same: (n) => `grad so viel (${n})`,
    more: (n) => `meh (${n})`,
  },
  legendSites: "Bletz am Kumme",
  legendThisCounty: "der Kaundi",
  legendExact: (n) => `Genaue Blatz (${n})`,
  legendApprox: (n) => `Ungfaehres Gebiet (${n})`,
  zoomHint: "Zoom nei fer sehne, wu die Bletz sin.",
  offMap: (list) => `Aa ehnlich, ausserhalb vun dem Bild: ${list}.`,

  chartTitle: (name) => `Wu ${name} schteht unner seine 40 ehnliche Kaundis`,
  chartHelp: (date, name) =>
    `Yeder Dipp is en ehnlicher Kaundi, hiegsetzt nooch de Zaahl vun uffgschriwwene Bletz am Kumme (${date}) un gfaerbt nooch dem, eb er wennicher, grad so viel odder meh hot as ${name}. Fahr driwwer fer meh Info; klick fer vergleiche.`,
  chartAria: (label, n, fewer, same, more) =>
    `Dipp-Grafik: ${label} hot ${n}; ${fewer} ehnliche Kaundis hen wennicher, ${same} grad so viel, ${more} meh.`,
  axisLabel: "Uffgschriwwene Data-Center-Bletz am Kumme",
  typicalMark: (phrase) => `Gewehnlich: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} Leit · ${density} pro Quadraatmeil`,
  clickToCompareCounty: "Klick fer den Kaundi vergleiche",

  recordsTitle: (name, n) => `Uffgschriwwene Bletz am Kumme in ${name} (${n})`,
  recordsHelp: (date) =>
    `Data-Center-Bletz, wu vorgschlagge, erlaabt odder am Baue sin, uffgschriwwe im Compute-Atlas-Snapshot vum ${date}, mit Links zu de Quelle. Der Daag „Letscht geennert“ vun me Eitraag weist, wann die Quell letscht gennert waar.`,
  noRecords: "Im Snapshot, wu du gwehlt hoscht, hen mer ken bassende Projekt-Eitraeg fer den Kaundi gfunne.",
  operatingSummary: (n) =>
    n === 1
      ? "1 Data-Center, wu schunn laaft (yuscht fer's Bild, owwe net gezehlt)"
      : `${n} Data-Centers, wu schunn laafe (yuscht fer's Bild, owwe net gezehlt)`,
  reportFoot: "Fehlt en Blatz, odder siehscht du en Fehler? <a>Meld's an Compute Atlas</a>, die Quell vun dere Webseit.",
  field: {
    operator: "Wer's laaft",
    status: "Schtand",
    confidence: "Wie sicher",
    location: "Blatz",
    assignment: "Zu wellem Kaundi",
    updated: "Letscht geennert",
  },
  recordId: (id) => `Compute-Atlas-Eitraag: ${id}`,
  confidence: { confirmed: "bschtaericht", reported: "in de Zeiding", rumored: "Gschwetz" },
  status: {
    proposed: "Vorgschlagge",
    permitted: "Erlaabt",
    under_construction: "Waerd gebaut",
    operational: "Laaft schunn",
    cancelled: "Abgebroche",
  },
  precision: { exact: "Genaue Koordinaate", approximate: "Ungfaehrer Blatz" },
  assignment: {
    spatial_join: "Kaundi vun de Koordinaate uff de Kaart",
    spatial_nearest_name_confirmed: "Kaundi vun de Koordinaate (am Ufer), Naame bschtaericht",
    source_name_match: "Kaundi vum Naame in de Quell",
  },
  reasons: {
    "status:operational": "Laaft schunn (extra gewisse fer's Bild)",
    "status:cancelled": "Abgebroche",
    "facility_type:power_generation": "En Projekt fer Schtrom mache, ken Data-Center",
    "facility_type:crypto_mining": "En Crypto-Mining-Blatz, ken Data-Center",
    "confidence:rumored": "Yuscht Gschwetz (net arig sicher)",
    "assignment:outside_geographic_scope": "Ausserhalb vun de 50 Schtaade un DC",
    "assignment:unresolved_multi_site": "Hot meh as een Blatz un ken eenzicher Kaundi",
    "assignment:approximate_without_source_county": "Ungfaehrer Blatz, ken Kaundi aagewwe",
    "assignment:ambiguous_source_county_name": "Der Kaundi-Naame basst zu meh as eem Kaundi",
    "assignment:unrecognized_source_county_name": "Der Kaundi-Naame is ken Kaundi im Census vun 2025",
    "assignment:conflict_point_county_vs_source_county": "Der Blatz uff de Kaart un der aagewwe Kaundi schtimme net",
    "assignment:conflict_point_state_vs_source_state": "Der Blatz uff de Kaart un der aagewwe Schtaat schtimme net",
    "assignment:point_outside_county_polygons": "Der Blatz uff de Kaart is in kem Kaundi",
    "assignment:point_on_county_boundary_ambiguous": "Hockt graad uff de Kaundi-Grenz",
  },

  findTitle: "Find en Projekt",
  findHelp:
    "Hoscht vun me gewisse Projekt geheert? Such in all de Eitraeg im Snapshot nooch Naame, Kumpanie odder Blatz, fer sehne, eb's gezehlt is, un wann net, warum.",
  findLabel: "Projekte suche",
  findPlaceholder: "wie Meta, Project Mica, Abilene",
  findLoading: "Am Laade, iwwer 2,000 Projekt-Eitraeg…",
  findError: "Mer hen die Projekt-Lischt net laade kenne. Guck dei Verbinning un browier's nochemol.",
  findNone: (q) => `Ken Projekt basst zu „${q}“. Compute Atlas hot's villeicht noch net; du kannscht's <a>an Compute Atlas melde</a>.`,
  source: "Quell",
  projectType: { data_center: "Data-Center", crypto_mining: "Crypto-Mining", power_generation: "Schtrom mache" },
  countedHere: "Do gezehlt",
  countedHereNote: "Is in de Zaahl vun dem Kaundi.",
  counted: "Gezehlt",
  countedIn: (where) => `In ${where}.`,
  compareCounty: (name) => `${name} vergleiche`,
  operating: "Laaft schunn",
  operatingContext: (where) => (where ? `Gewisse fer's Bild in ${where}, net in de Zaahl.` : "Gewisse fer's Bild, net in de Zaahl."),
  notCounted: "Net gezehlt",
  findFoot: "Weescht du vun me Projekt, wu fehlt odder letz is? <a>Meld's an Compute Atlas</a>, die Quell vun dere Webseit.",

  peersTitle: "Die 40 ehnliche Kaundis, die ehnlichscht zerscht",
  peersRange: (p0, p1, d0, d1) =>
    `Sie hen vun ${p0} bis ${p1} Leit un vun ${d0} bis ${d1} Leit pro Quadraatmeil. Wehl en Naame fer seller Kaundi zu vergleiche.`,
  col: {
    rank: "Blatz",
    county: "Kaundi",
    state: "Schtaat",
    population: "Leit (2025)",
    density: "Leit pro Quadraatmeil",
    sites: (date) => `Bletz am Kumme (${date})`,
  },
  showFewer: (n) => `Yuscht die ${n} ehnlichschte weise`,
  showAll: (n) => `All ${n} ehnliche Kaundis weise`,

  summaryTitle: "Zammefassing",
  aiChip: "Vun AI gschriwwe · vorher gmacht un nochgeguckt",
  aiEnglishOnly: "Die Erklaerung gebt's yuscht in Englisch.",
  aiNote: (model, date, status) =>
    `Eemol gschriwwe vun ${model} aus de Zaahle vun dem Kaundi im Snapshot vum ${date}, un dann Zaahl fer Zaahl nochgeguckt (${status}). Es waerd net live gmacht. Der Prompt, die Data un die Prieferinge sin in AI_EVALUATION.md.`,
  templateChip: "Automaadisch Zammefassing · faschti Vorlaag aus de gerechente Zaahle (net vun AI gschriwwe)",
  aiExamples: "Vun AI gschriwwe Beischpiele:",
  sum: {
    zero1: (name, date) => `Im Snapshot, wu du gwehlt hoscht (${date}), hen mer ken bassende Projekt-Eitraeg fer ${name} gfunne.`,
    zero2: (same, total, more, typical, median, mean) =>
      `Er hot die seem Zaahl (null) wie ${same} vun seine ${total} ehnliche Kaundis, un wennicher as ${more}. Gewehnlicher ehnlicher Kaundi: ${typical} (Median ${median}; Dorchschnitt ${mean}).`,
    some1: (name, n, date) =>
      `${name} hot ${n} ${n === 1 ? "bassender uffgschriwwener Eitraag" : "bassende uffgschriwwene Eitraeg"} fer Data-Center-Projekte (vorgschlagge, erlaabt odder am Baue) im Snapshot vum ${date}.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Des is meh as ${fewer} vun seine ${total} ehnliche Kaundis, grad so viel wie ${same}, un wennicher as ${more}. Gewehnlicher ehnlicher Kaundi: ${typical} (Median ${median}; Dorchschnitt ${mean}).`,
    noPeers: (total) => `Ken vun de ${total} ehnliche Kaundis hot en bassender Eitraag in dem Snapshot.`,
    peers: (n, total, pct) =>
      `${n} vun de ${total} ehnliche Kaundis (${pct}%) ${n === 1 ? "hot" : "hen"} zum wennigschte een bassender Eitraag.`,
    caveat:
      "Ehnliche Kaundis sin die, wu am neegschte sin in de Zaahl vun Leit un wie dicht sie wuhne; was mit Data-Centers laaft, waerd net gebraucht fer sie raus zu suche. Die Zaahle weise uffgschriwwene Eitraeg in eem eenzicher Snapshot, un der is net ganz; also beschreibt der Vergleich yuscht, un er weist ken Ursache, ken Effekte un ken schtatistischi Bedeiding.",
  },

  embedNote: (date) =>
    `Ehnliche Kaundis sin die 40, wu am neegschte sin in de Zaahl vun Leit un wie dicht sie wuhne. Data vum ${date} vun Compute Atlas (Edward Kubiak, CC BY 4.0) un vum US Census Bureau. Yuscht uffgschriwwene Eitraeg; net en Zaahl vun all de Projekte.`,
  seeFull: "Der ganz Vergleich aagucke",
  errorTitle: "Ebbes is letz gange",
  errorBody: "Die Seit hot net ganz laade kenne. Des kann graad nooch me Update vun de Webseit vorkumme. Nochemol laade helft meeschtens; dei Kaundi bleibt in de Adress.",
  reload: "Nochemol laade",
};

export default pdc;
