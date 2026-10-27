import type { Translation } from "./en";

/**
 * Navajo (Diné bizaad), standard orthography: ʼ is U+02BC, with ł, nasal hooks and high-tone accents. Written with AI;
 * NOT checked by professional translators or Diné speakers, and the lowest-confidence translation on the site: verb
 * forms and several coined terms need review by a fluent speaker (see TRANSLATION_REVIEW.md). Terms used throughout:
 * béésh nitsékeesí bá kin "data center" (building for computers; béésh nitsékeesí "computer", lit. thinking metal),
 * county (English loan, as in everyday Navajo speech), hahoodzo "state" (as in Hoozdo Hahoodzo, Arizona),
 * ahééníłtʼéhígíí "similar" (coined from ahee- "alike"), naaltsoos bikááʼ "on record" (on paper). Navajo nouns do not
 * inflect for number, so counts need no plural forms.
 */
const DC = "béésh nitsékeesí bá kin";
const SIMILAR = "county ahééníłtʼéhígíí";

const nv: Translation = {
  siteTitle: "Díí county ałʼąą átʼéésh?",
  subtitle: "Béésh nitsékeesí bá kin ádoolnííłígíí naaltsoos bikááʼ: díí county éí county ahééníłtʼéhígíí bił yiníłʼį́, Wááshindoon bikéyah biiʼ.",
  methodologyLink: "Haʼátʼíí bee ályaa dóó háádę́ę́ʼ",
  langNote: "Díí saad AI bee ályaa. Ataʼ halneʼé dóó Diné bizaad yee yáłtiʼígíí doo yídeiiltaʼ da, éí biniinaa łaʼ doo ákótʼée da. County dóó kéyah bízhiʼ Bilagáana bizaad bee siʼą́.",
  printUrl: (url) => `Internet bikááʼ: ${url}`,
  loadErrorTitle: "Data naaltsoos doo hólǫ́ǫ da.",
  loadErrorHelp: "Naaltsoos ánáánílééh. Ni béésh nitsékeesí bikááʼ site ánílééhgo éí, áłtsé <code>python scripts/build_all.py</code> ánílééh.",
  loadingCounties: (n) => `${n} county bidata…`,
  loading: "Hazhóʼó…",
  embedLoadError: "Díí doo hólǫ́ǫ da.",
  comparing: (name) => `<b>${name}</b> bił yiníłʼį́`,
  examplesAria: "County łaʼ",
  tryLabel: "Díí:",
  notFound: (code) => `County code ${code} doo hólǫ́ǫ da; éí biniinaa county łaʼ bee ééhózinii hólǫ́.`,
  srShowing: (name, verdict) => `${name}: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>license</a>). Transformations: ${transformations} Dineʼé, kéyah dóó county bináhásdzo: U.S. Census Bureau (public domain). Data version <code>${version}</code>.`,
  footerFallback: "Kin bidata: Compute Atlas, Edward Kubiak (CC BY 4.0). County bidata: U.S. Census Bureau.",
  methodologyEnglish: "Díí Bilagáana bizaad tʼéiyá bee siʼą́.",

  language: "Saad",
  languageButton: (name) => `Saad: ${name}`,
  languagePanelNote:
    "Díí saad AI bee ádaalyaa. Ataʼ halneʼé dóó bizaad yee yáłtiʼígíí doo yídeiiltaʼ da, éí biniinaa łaʼ doo ákótʼée da. County dóó kéyah bízhiʼ Bilagáana bizaad bee siʼą́; Bilagáana bizaad bee hádínítaʼ.",
  done: "Ałtso",

  freshnessAria: "Díí data hádą́ą́ʼ ályaa",
  dataAsOf: (date) => `Data: <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Kin bidata Compute Atlas ${tag} bitsʼą́ą́dę́ę́ʼ; éí bikéédę́ę́ʼ kin ádaalyaaígíí doo biiʼ hólǫ́ǫ da. Dineʼé: Census, ${popDate}. County bináhásdzo dóó kéyah: Census ${geoVintage}. Díí site ánáádaalyaa: ${built}.`,
  stale: (days) =>
    `Díí data ${days} jį́ bilááh yę́ędą́ą́ʼ ályaa; łaʼ ániidí hólǫ́ doo. Ániidígíí <a>compute-atlas.com</a> bikááʼ.`,

  findCounty: "County hádínítaʼ",
  searchPlaceholder: "Bilagáana bizaad: Loudoun County, VA",
  matchingCounties: "County hólǫ́ǫ́ígíí",
  noCountyMatch: (q) => `“${q}” county doo hólǫ́ǫ da. County bízhiʼ Bilagáana bizaad bee, “Name, ST”, doodaiiʼ county code (5) hádínítaʼ.`,

  facts: (pop, density, geoid) => `${pop} dineʼé · ${density} / mi² · county code ${geoid}`,
  shortAnswer: "Áłtsʼíísígo",
  verdict: {
    moreAll: (total) => `Béésh nitsékeesí bá kin ádoolnííłígíí: tʼáá ałtso ${total} ${SIMILAR} bilááh`,
    lessAll: (total) => `Béésh nitsékeesí bá kin ádoolnííłígíí: tʼáá ałtso ${total} ${SIMILAR} bitsʼą́ą́ʼ áłtsʼíísí`,
    moreMost: `Béésh nitsékeesí bá kin ádoolnííłígíí: ${SIMILAR} łą́ąjí bilááh`,
    lessMost: `Béésh nitsékeesí bá kin ádoolnííłígíí: ${SIMILAR} łą́ąjí bitsʼą́ą́ʼ áłtsʼíísí`,
    sameZero: `County ahééníłtʼéhígíí łą́ąjí ákótʼéego, ${DC} ádoolnííłígíí naaltsoos bikááʼ ádin`,
    same: `Béésh nitsékeesí bá kin ádoolnííłígíí: ${SIMILAR} łą́ąjí ałʼąą doo átʼée da`,
    middle: `${SIMILAR} ałníiʼgi`,
  },
  heroLabel: () => `${DC} ádoolnííłígíí, naaltsoos bikááʼ`,
  heroAsOf: (date) => ` · ${date}`,
  statusAria: "Díí kin haʼátʼéego átʼé",
  statusLine: { under_construction: "ádaalnééh", permitted: "bee haʼdeetʼą́", proposed: "ádoolnííł daaní" },
  typicalSimilar: "County ahééníłtʼéhígíí ałníiʼgi",
  similarWithAny: "County ahééníłtʼéhígíí łaʼ hólǫ́ǫ́ígíí",
  nOf: (n, total) => `${total} biiʼdę́ę́ʼ ${n}`,
  averageSimilar: "Ałníiʼ ánéeltʼeʼ",
  typical: {
    none: "ádin",
    sites: (n) => `${n} kin`,
    range: (a, b) => `${a}–${b} kin`,
  },
  comparedWith: (total) => `${total} ${SIMILAR} bił`,
  cmp: {
    fewer: (n) => `<b>${n}</b> áłtsʼíísí`,
    same: (n) => `<b>${n}</b> ałʼąą doo átʼée da`,
    more: (n) => `<b>${n}</b> bilááh`,
  },
  barAria: (total, fewer, name, same, more) =>
    `${total} ${SIMILAR}: ${fewer} ${name} bitsʼą́ą́ʼ áłtsʼíísí, ${same} ałʼąą doo átʼée da, ${more} bilááh.`,
  zeroNote:
    "Díí county biiʼ, díí data biiʼ, naaltsoos bikááʼ kin ádoolnííłígíí ádin. Éí béésh nitsékeesí bá kin ádin doo óolyée da; díí naaltsoos tʼéiyá doo bikááʼ siʼą́ą da.",
  similarLine: "“Ahééníłtʼéhígíí” éí dineʼé ánéeltʼeʼ dóó dineʼé bitaʼ áhání (population density) bikʼehgo, Wááshindoon bikéyah tʼáá háadida. Tʼáá íiyisíí ahééníłtʼéhígíí: <list/>.",
  operatingNote: (n) => `Tʼáá ałtsʼą́ą́ʼ, ${DC} ${n} naalnishígíí kweʼé naaltsoos bikááʼ hólǫ́ (doo yíltaʼ da).`,
  stateLine: (state, withSites, counties) => `${state} biiʼ, ${counties} county biiʼdę́ę́ʼ ${withSites} kin ádoolnííłígíí łaʼ bee hólǫ́.`,
  findLink: "Kin łaʼ baa yáʼdaʼáłtiʼísh? Kweʼé hádínítaʼ",

  share: "Share",
  shareOptions: "Share",
  copyLink: "Link copy ánílééh",
  printSummary: "Print ánílééh",
  downloadSimilar: "County ahééníłtʼéhígíí download ánílééh (CSV)",
  downloadSites: "Kin ádoolnííłígíí download ánílééh (CSV)",
  embedAction: "Website bikááʼ ánílééh…",
  linkCopied: "Link copy ályaa",
  copyFailed: "Kweʼé copy doo bíighah da; saad tʼáá ni copy ánílééh",
  downloadStarted: "Download ályaa",
  embedTitle: "Díí website bikááʼ ánílééh",
  embedHelp: (name) =>
    `Díí ni website bikááʼ ánílééh. ${name} bidata, data bijį́ dóó háádę́ę́ʼ hólǫ́ǫ́ígíí, dóó site tʼáá ałtso bichʼįʼ link.`,
  embedCodeLabel: "Embed code",
  copyCode: "Code copy ánílééh",
  embedCopied: "Code copy ályaa",

  explainTitle: "Díí ánéeltʼeʼígíí haʼátʼíí óolyé?",
  qCounted: "“Kin ádoolnííłígíí” haʼátʼíí óolyé?",
  aCounted:
    "Béésh nitsékeesí bá kin Compute Atlas (public research inventory) bikááʼ <b>ádoolnííł daaní</b> (proposed), <b>bee haʼdeetʼą́</b> (permitted), doodaiiʼ <b>ádaalnééh</b> (under construction) daaníigo, naaltsoos bikʼehgo (confirmed doodaiiʼ reported). Béésh nitsékeesí bá kin naalnishígíí tʼáá ałtsʼą́ą́ʼ yíltaʼ (context tʼéiyá). Ánéeltʼeʼígíí éí naaltsoos ánéeltʼeʼígíí átʼé; kin tʼáá ákótʼéego ánéeltʼeʼígíí doo átʼée da.",
  qSimilar: "“County ahééníłtʼéhígíí” haʼátʼíí átʼé?",
  aSimilar: (total, name) =>
    `${total} county Wááshindoon bikéyah biiʼ dahólǫ́ǫ́ígíí, ${name} bił ahééníłtʼéhígíí: dineʼé ánéeltʼeʼ dóó dineʼé bitaʼ áhání (population density) bikʼehgo. Béésh nitsékeesí bá kin bee doo ádaalyaa da, éí biniinaa kéyah díí ánéeltʼeʼígíí bee haʼátʼíí tʼáá áłahjįʼ ádaatʼéhígíí yee ééhózin. Hahoodzo tʼáá háadida biiʼ dahólǫ́.`,
  qRead: "“Áłtsʼíísí, ałʼąą doo átʼée da, bilááh” haʼátʼíí óolyé?",
  aRead: (name, fewer, same, more, total) =>
    `County ahééníłtʼéhígíí tʼáá ałtso ${name} bił yiiłtsą́: ${fewer} áłtsʼíísí, ${same} ałʼąą doo átʼée da, ${more} bilááh. “Łą́ąjí” (most) éí ałníiʼ bilááh, ${total} biiʼdę́ę́ʼ 21 doodaiiʼ bilááh. County ahééníłtʼéhígíí ałníiʼgi éí ${total} tʼáá ałtso bánéeltʼeʼ bikʼehgo ałkééʼ ndaasʼą́ągo ałníiʼgi siʼą́ (median).`,
  qZero: "Ádin (0) haʼátʼíí óolyé?",
  aZero:
    "Díí data biiʼ naaltsoos łaʼ ádin óolyé. Béésh nitsékeesí bá kin ádin doo óolyée da: díí naaltsoos tʼáá ałtso doo bikááʼ siʼą́ą da, áádóó kéyah łaʼ éí naaltsoos łą́ąjí bikááʼ dahólǫ́.",
  qJudge: "Díí éí “yáʼátʼééh”, “doo yáʼátʼééh da”, doodaiiʼ “ádoolnííł” haʼníísh?",
  aJudge:
    "Dooda. Díí naaltsoos bikááʼ ánéeltʼeʼígíí tʼéiyá yíltaʼ dóó kéyah ahééníłtʼéhígíí bił yiiłtsą́. Nahasdzáán doodaiiʼ béeso bikʼehgo haʼátʼíí ádaalyaaígíí doo yee haʼníi da; haʼátʼíí biniinaa county łaʼ bilááh doodaiiʼ áłtsʼíísí doo yee haʼníi da; kin ádoolnííłígíí doo yee haʼníi da.",
  qCurrent: "Díí data hádą́ą́ʼ ályaa?",
  aCurrent: (snapshot, popDate) =>
    `Naaltsoos éí Compute Atlas ${snapshot} bitsʼą́ą́dę́ę́ʼ; éí bikéédę́ę́ʼ kin ádaalyaaígíí doo biiʼ hólǫ́ǫ da. Damóo tʼáá ałtso, site ániidígíí hádéítaʼ. Dineʼé ánéeltʼeʼígíí: Census, ${popDate}.`,
  fullMethodology: "Haʼátʼíí bee ályaa dóó háádę́ę́ʼ (Bilagáana bizaad)",

  mapTitle: "Kéyah naaltsoos",
  mapViewAria: "Kéyah naaltsoos: haʼátʼíí yiníłʼį́",
  mapAria: "County bikéyah naaltsoos. County łaʼ bikʼidíílniih dóó bił yiníłʼį́.",
  view: { county: "Díí county", similar: "County ahééníłtʼéhígíí", shaded: "County tʼáá ałtso" },
  thisCounty: "Díí county",
  sitesInDev: (n) => `${n} kin ádoolnííłígíí`,
  hoverSimilar: {
    fewer: (name) => `County ahééníłtʼéhígíí · ${name} bitsʼą́ą́ʼ áłtsʼíísí`,
    same: (name) => `County ahééníłtʼéhígíí · ${name} bił ałʼąą doo átʼée da`,
    more: (name) => `County ahééníłtʼéhígíí · ${name} bilááh`,
  },
  clickToCompare: "Bikʼidíílniih dóó bił yiníłʼį́",
  exactLocation: "Tʼáá áajígo",
  approxLocation: "Áhánígo; tʼáá áájí doo átʼée da",
  approxArea: (n) => `${n} kin díí kéyah biiʼ (áhánígo)`,
  andMore: (n) => `dóó ${n} ałdóʼ`,
  approxLocations: "Áhánígo; tʼáá áájí doo átʼée da",
  legendSimilarWith: "County ahééníłtʼéhígíí:",
  legend: {
    fewer: (n) => `áłtsʼíísí (${n})`,
    same: (n) => `ałʼąą doo átʼée da (${n})`,
    more: (n) => `bilááh (${n})`,
  },
  legendSites: "Kin ádoolnííłígíí",
  legendThisCounty: "díí county",
  legendExact: (n) => `Tʼáá áajígo (${n})`,
  legendApprox: (n) => `Áhánígo (${n})`,
  zoomHint: "Áhání ánílééh (zoom in) dóó kin háadi dahólǫ́ yiníłʼį́.",
  offMap: (list) => `Ałdóʼ ahééníłtʼéhígíí (díí kéyah naaltsoos bikááʼ ádin): ${list}.`,

  chartTitle: (name) => `${name}: 40 ${SIMILAR} bitaʼgi háadi siʼą́`,
  chartHelp: (date, name) =>
    `Dot tʼááłáʼí éí county ahééníłtʼéhígíí tʼááłáʼí átʼé, kin ádoolnííłígíí ánéeltʼeʼ (${date}) bikʼehgo siʼą́; ${name} bitsʼą́ą́ʼ áłtsʼíísí, ałʼąą doo átʼée da, doodaiiʼ bilááh bikʼehgo ałʼąą ádaatʼéego bee ééhózin. Bikʼidíílniih dóó bił yiníłʼį́.`,
  chartAria: (label, n, fewer, same, more) =>
    `Dot chart: ${label} ${n}; ${SIMILAR} ${fewer} áłtsʼíísí, ${same} ałʼąą doo átʼée da, ${more} bilááh.`,
  axisLabel: "Béésh nitsékeesí bá kin ádoolnííłígíí, naaltsoos bikááʼ",
  typicalMark: (phrase) => `Ałníiʼgi: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} dineʼé · ${density} / mi²`,
  clickToCompareCounty: "Bikʼidíílniih dóó díí county bił yiníłʼį́",

  recordsTitle: (name, n) => `${name} biiʼ kin ádoolnííłígíí, naaltsoos bikááʼ (${n})`,
  recordsHelp: (date) =>
    `Béésh nitsékeesí bá kin ádoolnííł daaníigo, bee haʼdeetʼą́ígíí, doodaiiʼ ádaalnééhígíí, Compute Atlas (${date}) bikááʼ; háádę́ę́ʼ hólǫ́ǫ́ígíí bichʼįʼ link ałdóʼ. “Ániid ályaa” bijį́ éí naaltsoos bitsʼą́ą́dę́ę́ʼ hólǫ́ǫ́ígíí hádą́ą́ʼ ánáádaalyaa yee ééhózin.`,
  noRecords: "Díí county biiʼ, díí data biiʼ, naaltsoos bikááʼ kin ádoolnííłígíí ádin.",
  operatingSummary: (n) => `${DC} ${n} naalnishígíí (context tʼéiyá; doo yíltaʼ da)`,
  reportFoot: "Kin łaʼ ádinísh, doodaiiʼ łaʼ doo ákótʼée da? <a>Compute Atlas bił hólneʼ</a>; díí site éí bitsʼą́ą́dę́ę́ʼ.",
  field: {
    operator: "Operator",
    status: "Haʼátʼéego átʼé",
    confidence: "Bee ééhózin",
    location: "Háadi",
    assignment: "County háidígíí",
    updated: "Ániid ályaa",
  },
  recordId: (id) => `Compute Atlas naaltsoos: ${id}`,
  confidence: { confirmed: "tʼáá ákótʼé", reported: "haʼdííniid", rumored: "tʼáá baa yáʼdaʼáłtiʼ" },
  status: {
    proposed: "Ádoolnííł daaní",
    permitted: "Bee haʼdeetʼą́",
    under_construction: "Ádaalnééh",
    operational: "Naalnish",
    cancelled: "Ádin silįįʼ",
  },
  precision: { exact: "Tʼáá áajígo", approximate: "Áhánígo" },
  assignment: {
    spatial_join: "County: kéyah naaltsoos bikʼehgo",
    spatial_nearest_name_confirmed: "County: kéyah naaltsoos bikʼehgo (tó bibaahgi), bízhiʼ tʼáá ákótʼé",
    source_name_match: "County: naaltsoos bikááʼ bízhiʼ bikʼehgo",
  },
  reasons: {
    "status:operational": "Tʼáá íídą́ą́ʼ naalnish (tʼáá ałtsʼą́ą́ʼ)",
    "status:cancelled": "Ádin silįįʼ",
    "facility_type:power_generation": "Electricity ályaa biniiyé; béésh nitsékeesí bá kin doo átʼée da",
    "facility_type:crypto_mining": "Crypto mining biniiyé; béésh nitsékeesí bá kin doo átʼée da",
    "confidence:rumored": "Tʼáá baa yáʼdaʼáłtiʼ (doo bééhózin da)",
    "assignment:outside_geographic_scope": "50 hahoodzo dóó DC biiʼ doo átʼée da",
    "assignment:unresolved_multi_site": "Kin łą́ą́ʼ; county tʼááłáʼí doo bééhózin da",
    "assignment:approximate_without_source_county": "Áhánígo; county bízhiʼ ádin",
    "assignment:ambiguous_source_county_name": "County bízhiʼ county naaki doodaiiʼ bilááh bízhiʼ átʼé",
    "assignment:unrecognized_source_county_name": "County bízhiʼ 2025 Census biiʼ ádin",
    "assignment:conflict_point_county_vs_source_county": "Kéyah naaltsoos dóó county bízhiʼ ałʼąą átʼé",
    "assignment:conflict_point_state_vs_source_state": "Kéyah naaltsoos dóó hahoodzo bízhiʼ ałʼąą átʼé",
    "assignment:point_outside_county_polygons": "Kéyah naaltsoos bikááʼ county łaʼ biiʼ doo siʼą́ą da",
    "assignment:point_on_county_boundary_ambiguous": "County bináhásdzo tʼáá bikááʼ siʼą́",
  },

  findTitle: "Kin łaʼ hádínítaʼ",
  findHelp:
    "Kin łaʼ baa yáʼdaʼáłtiʼísh? Naaltsoos tʼáá ałtso bízhiʼ, company, doodaiiʼ kéyah bee hádínítaʼ; yíltaʼísh doodaiiʼ haʼátʼíí biniinaa doo yíltaʼ da yiníłʼį́.",
  findLabel: "Kin hádínítaʼ",
  findPlaceholder: "Meta, Project Mica, Abilene",
  findLoading: "Naaltsoos 2,000 bilááh…",
  findError: "Kin bínaaltsoos doo hólǫ́ǫ da. Internet hólǫ́ǫ́ísh yiníłʼį́ dóó ánáánílééh.",
  findNone: (q) => `“${q}” kin doo hólǫ́ǫ da. Compute Atlas biiʼ tʼahdoo siʼą́ą da; <a>Compute Atlas bił hólneʼ</a>.`,
  source: "Háádę́ę́ʼ",
  projectType: { data_center: "Béésh nitsékeesí bá kin", crypto_mining: "Crypto mining", power_generation: "Electricity ályaa" },
  countedHere: "Kweʼé yíltaʼ",
  countedHereNote: "Díí county bánéeltʼeʼ biiʼ hólǫ́.",
  counted: "Yíltaʼ",
  countedIn: (where) => `${where} biiʼ.`,
  compareCounty: (name) => `${name} bił yiníłʼį́`,
  operating: "Naalnish",
  operatingContext: (where) => (where ? `${where} biiʼ context tʼéiyá; doo yíltaʼ da.` : "Context tʼéiyá; doo yíltaʼ da."),
  notCounted: "Doo yíltaʼ da",
  findFoot: "Kin łaʼ ádinísh doodaiiʼ doo ákótʼée da? <a>Compute Atlas bił hólneʼ</a>; díí site éí bitsʼą́ą́dę́ę́ʼ.",

  peersTitle: "40 county ahééníłtʼéhígíí (tʼáá íiyisíí ahééníłtʼéhígíí áłtsé)",
  peersRange: (p0, p1, d0, d1) =>
    `Dineʼé ${p0}–${p1}, dóó ${d0}–${d1} dineʼé / mi². County bízhiʼ bikʼidíílniih dóó éí bił yiníłʼį́.`,
  col: {
    rank: "#",
    county: "County",
    state: "Hahoodzo",
    population: "Dineʼé (2025)",
    density: "Dineʼé / mi²",
    sites: (date) => `Kin ádoolnííłígíí (${date})`,
  },
  showFewer: (n) => `${n} tʼéiyá`,
  showAll: (n) => `County ahééníłtʼéhígíí tʼáá ałtso (${n})`,

  summaryTitle: "Áłtsʼíísígo",
  aiChip: "AI bee ályaa · áłtsé ályaa, ánéeltʼeʼ yíltaʼ",
  aiEnglishOnly: "Díí Bilagáana bizaad tʼéiyá bee siʼą́.",
  aiNote: (model, date, status) =>
    `${model} éí tʼááłáʼí yee ályaa, díí county bánéeltʼeʼ (${date}) bikʼehgo; áádóó ánéeltʼeʼ tʼáá ałtso yíltaʼ (${status}). Kʼad doo ádaalnééh da. Prompt, input, dóó checks: AI_EVALUATION.md.`,
  templateChip: "Áłtsʼíísígo · ánéeltʼeʼ bikʼehgo template; AI doo bee ályaa da",
  aiExamples: "AI bee ályaa:",
  sum: {
    zero1: (name, date) => `${name} biiʼ naaltsoos bikááʼ kin ádoolnííłígíí ádin, díí data biiʼ (${date}).`,
    zero2: (same, total, more, typical, median, mean) =>
      `${total} ${SIMILAR} biiʼdę́ę́ʼ ${same} ałʼąą doo átʼée da (ádin), ${more} bilááh. County ahééníłtʼéhígíí ałníiʼgi: ${typical} (median ${median}; average ${mean}).`,
    some1: (name, n, date) =>
      `${name} biiʼ ${DC} ádoolnííłígíí ${n} naaltsoos bikááʼ hólǫ́ (ádoolnííł daaní, bee haʼdeetʼą́, doodaiiʼ ádaalnééh), díí data biiʼ (${date}).`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `${total} ${SIMILAR} biiʼdę́ę́ʼ ${fewer} éí bitsʼą́ą́ʼ áłtsʼíísí, ${same} ałʼąą doo átʼée da, ${more} bilááh. County ahééníłtʼéhígíí ałníiʼgi: ${typical} (median ${median}; average ${mean}).`,
    noPeers: (total) => `${total} ${SIMILAR} biiʼ naaltsoos łaʼ ádin.`,
    peers: (n, total, pct) => `${total} ${SIMILAR} biiʼdę́ę́ʼ ${n} (${pct}%) naaltsoos łaʼ bee hólǫ́.`,
    caveat:
      "County ahééníłtʼéhígíí éí dineʼé ánéeltʼeʼ dóó dineʼé bitaʼ áhání bikʼehgo; béésh nitsékeesí bá kin doo bee ádaalyaa da. Ánéeltʼeʼígíí éí data tʼááłáʼí biiʼ naaltsoos tʼéiyá; díí data tʼáá ałtso doo biiʼ hólǫ́ǫ da. Díí tʼáá ákótʼéego yee haʼní; haʼátʼíí biniinaa, haʼátʼíí ádoolnííł, doodaiiʼ statistics doo yee haʼníi da.",
  },

  embedNote: (date) =>
    `County ahééníłtʼéhígíí éí 40 dineʼé ánéeltʼeʼ dóó dineʼé bitaʼ áhání bikʼehgo. Data: ${date}, Compute Atlas (Edward Kubiak, CC BY 4.0) dóó U.S. Census Bureau. Naaltsoos bikááʼ tʼéiyá; kin tʼáá ałtso doo átʼée da.`,
  seeFull: "Tʼáá ałtso yiníłʼį́",
  errorTitle: "Łaʼ doo ákótʼée da",
  errorBody:
    "Díí naaltsoos doo ałtso ályaa da. Site ániid ályaago ákótʼé łeh. Ánáánílééh; tʼáá áłahjįʼ ákótʼé. Ni county link biiʼ siʼą́.",
  reload: "Ánáánílééh",
};

export default nv;
