import type { Translation } from "./en";

/**
 * Haitian Creole, standard (IPN) orthography. Written with AI; not checked by professional translators or native
 * speakers. "Snapshot" is "ekstrè done" (data extract); nouns take no plural marker after a number.
 */
const ht: Translation = {
  siteTitle: "Jiska ki pwen konte mwen an pa abityèl?",
  subtitle: "Konpare devlopman sant done ki dokimante yo ak konte ki sanble yo toupatou Ozetazini.",
  methodologyLink: "Metodoloji ak sous",
  langNote: "Tradiksyon sa a fèt ak entèlijans atifisyèl; ni tradiktè pwofesyonèl ni moun ki pale lang lan natifnatal pa verifye l, kidonk li ka gen erè. Non konte ak non kote yo rete an angle.",
  printUrl: (url) => `Vèsyon entèraktif: ${url}`,
  loadErrorTitle: "Nou pa t kapab chaje fichye done yo.",
  loadErrorHelp: "Rechaje paj la pou eseye ankò; si w ap kouri sit la sou òdinatè w, kouri <code>python scripts/build_all.py</code> anvan.",
  loadingCounties: (n) => `N ap chaje done pou ${n} konte…`,
  loading: "N ap chaje…",
  embedLoadError: "Nou pa t kapab chaje konparezon sa a.",
  comparing: (name) => `N ap konpare <b>${name}</b>`,
  examplesAria: "Egzanp konte",
  tryLabel: "Eseye:",
  notFound: (code) => `Nou pa jwenn kòd konte ${code}, kidonk n ap montre yon konte egzanp.`,
  srShowing: (name, verdict) => `N ap montre ${name}: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>lisans</a>). Transfòmasyon: ${transformations} Popilasyon, sifas tè ak fwontyè konte yo: Biwo Resansman Etazini (domèn piblik). Vèsyon done <code>${version}</code>.`,
  footerFallback: "Done sou enstalasyon yo: Compute Atlas, pa Edward Kubiak (CC BY 4.0). Done sou konte yo: Biwo Resansman Etazini.",
  methodologyEnglish: "Seksyon sa a disponib an angle sèlman.",

  language: "Lang",
  languageButton: (name) => `Lang: ${name}`,
  languagePanelNote:
    "Tradiksyon yo fèt ak entèlijans atifisyèl, e ni tradiktè pwofesyonèl ni moun ki pale lang yo natifnatal pa verifye yo, kidonk yo ka gen erè. Non konte ak non kote yo an angle, kidonk chèche an angle.",
  done: "Fini",

  freshnessAria: "Ki dat done sa yo",
  dataAsOf: (date) => `Done jiska <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Done sou enstalasyon yo soti nan ekstrè ${tag} Compute Atlas la; pwojè ki te anonse oswa chanje apre dat sa a pa ladan. Popilasyon: estimasyon resansman pou ${popDate}. Fwontyè ak sifas: fichye resansman ${geoVintage}. Dènye fwa done sit la te rekonstwi: ${built}.`,
  stale: (days) =>
    `Ekstrè sa a gen plis pase ${days} jou, kidonk ka gen dosye ki pi nouvo. Lis ki ajou a sou <a>compute-atlas.com</a>.`,

  findCounty: "Chèche yon konte",
  searchPlaceholder: "An angle, egz. Loudoun County, VA",
  matchingCounties: "Konte ki koresponn",
  noCountyMatch: (q) => `Pa gen konte ki koresponn ak “${q}”. Eseye non konte a an angle, “Non, ST”, oswa yon kòd konte 5 chif.`,

  facts: (pop, density, geoid) => `${pop} moun · ${density} pa mil kare · kòd konte ${geoid}`,
  shortAnswer: "Repons kout la",
  verdict: {
    moreAll: (total) => `Plis devlopman sant done ki dokimante pase tout ${total} konte ki sanble yo`,
    lessAll: (total) => `Mwens devlopman sant done ki dokimante pase tout ${total} konte ki sanble yo`,
    moreMost: "Plis devlopman sant done ki dokimante pase pifò konte ki sanble yo",
    lessMost: "Mwens devlopman sant done ki dokimante pase pifò konte ki sanble yo",
    sameZero: "Tankou pifò konte ki sanble yo, pa gen okenn sit sant done an devlopman ki dokimante",
    same: "Menm kantite devlopman sant done ki dokimante ak pifò konte ki sanble yo",
    middle: "Nan mitan konte ki sanble yo",
  },
  heroLabel: () => "sit sant done an devlopman ki anrejistre",
  heroAsOf: (date) => ` jiska ${date}`,
  statusAria: "Estati sit sa yo dapre ekstrè a",
  statusLine: { under_construction: "an konstriksyon", permitted: "gen pèmi", proposed: "pwopoze" },
  typicalSimilar: "Konte tipik ki sanble",
  similarWithAny: "Konte ki sanble ki gen omwen youn",
  nOf: (n, total) => `${n} sou ${total}`,
  averageSimilar: "Mwayèn konte ki sanble yo",
  typical: {
    none: "okenn",
    sites: (n) => `${n} sit`,
    range: (a, b) => `${a} a ${b} sit`,
  },
  comparedWith: (total) => `Konpare ak ${total} konte ki pi sanble yo`,
  cmp: {
    fewer: (n) => `<b>${n}</b> gen mwens`,
    same: (n) => `<b>${n}</b> gen menm kantite`,
    more: (n) => `<b>${n}</b> gen plis`,
  },
  barAria: (total, fewer, name, same, more) =>
    `Sou ${total} konte ki sanble, ${fewer} gen mwens sit anrejistre pase ${name}, ${same} gen menm kantite, e ${more} gen plis.`,
  zeroNote:
    "Nou pa jwenn okenn dosye pwojè ki kalifye pou konte sa a nan ekstrè done yo chwazi a. Sa pa vle di pa gen sant done ki pwopoze isit la, sèlman sous sa a pa dokimante okenn.",
  similarLine: "“Ki sanble” vle di ki pi pre nan popilasyon ak dansite popilasyon, nenpòt kote Ozetazini. Sa ki pi sanble yo se <list/>.",
  operatingNote: (n) => `Apa sa, gen ${n} sant done k ap fonksyone ki anrejistre isit la (yo pa konte pi wo a).`,
  stateLine: (state, withSites, counties) => `Nan ${state}, ${withSites} sou ${counties} konte gen omwen yon sit an devlopman ki anrejistre.`,
  findLink: "Ou tande pale de yon pwojè espesifik? Gade si yo konte l",

  share: "Pataje",
  shareOptions: "Opsyon pou pataje",
  copyLink: "Kopye lyen an",
  printSummary: "Enprime rezime a",
  downloadSimilar: "Telechaje konte ki sanble yo (CSV)",
  downloadSites: "Telechaje sit an devlopman yo (CSV)",
  embedAction: "Mete l sou yon sit entènèt…",
  linkCopied: "Lyen an kopye",
  copyFailed: "Ou pa ka kopye isit la; chwazi tèks la epi kopye l ou menm",
  downloadStarted: "Telechajman an kòmanse",
  embedTitle: "Mete konparezon sa a sou sit ou",
  embedHelp: (name) =>
    `Kole sa a nan paj ou. Li montre konparezon pou ${name}, ak dat done yo ak non sous la, epi li gen yon lyen pou ale sou sit konplè a.`,
  embedCodeLabel: "Kòd pou mete sou sit",
  copyCode: "Kopye kòd la",
  embedCopied: "Kòd la kopye",

  explainTitle: "Kisa chif sa yo vle di?",
  qCounted: "Kisa yo konte kòm “sit an devlopman”?",
  aCounted:
    "Yon sit sant done ke envantè rechèch piblik Compute Atlas la make kòm <b>pwopoze</b>, <b>gen pèmi</b> (apwouve) oswa <b>an konstriksyon</b>, ak sous ki konfime oswa ki parèt nan laprès. Sant done k ap fonksyone yo konte apa epi yo montre yo sèlman pou kontèks. Chak chif se kantite dosye sit ki dokimante, sa ki pa menm bagay ak yon kantite batiman ki verifye.",
  qSimilar: "Ki konte ki “sanble” yo?",
  aSimilar: (total, name) =>
    `Se ${total} konte Etazini ki pi pre ${name} ni nan popilasyon ni nan dansite popilasyon (moun pa mil kare tè). Yo pa sèvi ak aktivite sant done pou chwazi yo, kidonk yo montre sa ki nòmal pou kote ki gen menm gwosè ak menm dansite. Yo ka nan nenpòt eta.`,
  qRead: "Ki jan pou m li “mwens, menm kantite, plis”?",
  aRead: (name, fewer, same, more, total) =>
    `Yo konpare chak konte ki sanble ak ${name}: ${fewer} gen mwens sit anrejistre, ${same} gen menm kantite, e ${more} gen plis. “Pifò” vle di plis pase mwatye, sa vle di omwen 21 sou ${total}. Konte tipik ki sanble a se sa ki nan mitan lè ou ranje tout ${total} yo dapre kantite yo (medyàn nan).`,
  qZero: "Kisa yon zewo vle di?",
  aZero:
    "Sa vle di yo pa jwenn okenn dosye ki kalifye nan ekstrè done sa a. Sa pa vle di pa gen sant done ki pwopoze: envantè a pa konplè, e kote ki pi byen dokimante ka gen plis dosye.",
  qJudge: "Èske sa di si devlopman isit la bon, move oswa si l ap rive?",
  aJudge:
    "Non. Zouti a sèlman konte dosye ki dokimante epi li konpare yo ak kote ki sanble. Li pa mezire efè sou anviwònman an oswa sou ekonomi an, li pa eksplike poukisa yon konte gen plis oswa mwens dosye, e li pa prevwa pwojè ki pral fèt.",
  qCurrent: "Èske done sa yo ajou?",
  aCurrent: (snapshot, popDate) =>
    `Dosye yo soti nan ekstrè Compute Atlas ${snapshot} la; pwojè ki te anonse oswa chanje apre sa pa ladan. Sit la tcheke chak semèn si gen yon ekstrè ki pi nouvo. Chif popilasyon yo se estimasyon resansman pou ${popDate}.`,
  fullMethodology: "Tout metodoloji a ak sous yo",

  mapTitle: "Kat",
  mapViewAria: "Vi kat la",
  mapAria: "Kat konte yo. Chwazi yon konte pou konpare l.",
  view: { county: "Konte sa a", similar: "Konte ki sanble", shaded: "Tout konte" },
  thisCounty: "Konte sa a",
  sitesInDev: (n) => `${n} sit an devlopman`,
  hoverSimilar: {
    fewer: (name) => `Konte ki sanble · mwens pase ${name}`,
    same: (name) => `Konte ki sanble · menm kantite ak ${name}`,
    more: (name) => `Konte ki sanble · plis pase ${name}`,
  },
  clickToCompare: "Klike pou konpare",
  exactLocation: "Kote egzak",
  approxLocation: "Kote apeprè, se pa vrè sit la",
  approxArea: (n) => `${n} sit nan zòn apeprè sa a`,
  andMore: (n) => `ak ${n} lòt`,
  approxLocations: "Kote apeprè, se pa vrè sit yo",
  legendSimilarWith: "Konte ki sanble ki gen",
  legend: {
    fewer: (n) => `mwens (${n})`,
    same: (n) => `menm kantite (${n})`,
    more: (n) => `plis (${n})`,
  },
  legendSites: "Sit an devlopman",
  legendThisCounty: "konte sa a",
  legendExact: (n) => `Kote egzak (${n})`,
  legendApprox: (n) => `Zòn apeprè (${n})`,
  zoomHint: "Fè zoum pou wè kote sit yo ye.",
  offMap: (list) => `Lòt konte ki sanble, andeyò vi sa a: ${list}.`,

  chartTitle: (name) => `Ki kote ${name} ye pami 40 konte ki sanble avè l yo`,
  chartHelp: (date, name) =>
    `Chak pwen se yon konte ki sanble, ki plase dapre kantite sit an devlopman ki anrejistre (${date}) epi ki gen koulè dapre si li gen mwens, menm kantite oswa plis pase ${name}. Pase sourit la sou li pou detay; klike pou konpare.`,
  chartAria: (label, n, fewer, same, more) =>
    `Grafik pwen: ${label} gen ${n}; ${fewer} konte ki sanble gen mwens, ${same} gen menm kantite, ${more} gen plis.`,
  axisLabel: "Sit sant done an devlopman ki anrejistre",
  typicalMark: (phrase) => `Tipik: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} moun · ${density} pa mil kare`,
  clickToCompareCounty: "Klike pou konpare konte sa a",

  recordsTitle: (name, n) => `Sit an devlopman ki anrejistre nan ${name} (${n})`,
  recordsHelp: (date) =>
    `Sit sant done ki pwopoze, ki gen pèmi oswa ki an konstriksyon, ki dokimante nan ekstrè Compute Atlas ${date} la, ak lyen ki mennen nan sous orijinal yo. Dat “Dènye mizajou” yon dosye montre ki lè enfòmasyon sous li te revize dènye fwa.`,
  noRecords: "Nou pa jwenn okenn dosye pwojè ki kalifye pou konte sa a nan ekstrè done yo chwazi a.",
  operatingSummary: (n) => `${n} sant done k ap fonksyone (sèlman pou kontèks, yo pa konte pi wo a)`,
  reportFoot: "Gen yon sit ki manke, oswa ou wè yon erè? <a>Rapòte l bay Compute Atlas</a>, sous sit sa a itilize a.",
  field: {
    operator: "Operatè",
    status: "Estati",
    confidence: "Fyabilite",
    location: "Kote",
    assignment: "Konte yo atribye l",
    updated: "Dènye mizajou",
  },
  recordId: (id) => `Dosye Compute Atlas: ${id}`,
  confidence: { confirmed: "konfime", reported: "rapòte nan laprès", rumored: "rimè" },
  status: {
    proposed: "Pwopoze",
    permitted: "Gen pèmi",
    under_construction: "An konstriksyon",
    operational: "Ap fonksyone",
    cancelled: "Anile",
  },
  precision: { exact: "Kowòdone egzak", approximate: "Kote apeprè" },
  assignment: {
    spatial_join: "Konte dapre kowòdone kat la",
    spatial_nearest_name_confirmed: "Konte dapre kowòdone yo (bò lanmè), non an konfime",
    source_name_match: "Konte dapre non sous la bay",
  },
  reasons: {
    "status:operational": "Deja ap fonksyone (yo montre l apa pou kontèks)",
    "status:cancelled": "Anile",
    "facility_type:power_generation": "Yon pwojè pwodiksyon elektrisite, se pa yon sant done",
    "facility_type:crypto_mining": "Yon sit min kriptomone, se pa yon sant done",
    "confidence:rumored": "Se sèlman rimè (fyabilite fèb)",
    "assignment:outside_geographic_scope": "Andeyò 50 eta yo ak Distri Kolonbi",
    "assignment:unresolved_multi_site": "Li kouvri plizyè sit san yon sèl konte",
    "assignment:approximate_without_source_county": "Kote apeprè san non konte",
    "assignment:ambiguous_source_county_name": "Non konte a koresponn ak plis pase yon konte",
    "assignment:unrecognized_source_county_name": "Non konte a pa yon konte nan resansman 2025 la",
    "assignment:conflict_point_county_vs_source_county": "Kote sou kat la ak konte yo nonmen an pa dakò",
    "assignment:conflict_point_state_vs_source_state": "Kote sou kat la ak eta yo nonmen an pa dakò",
    "assignment:point_outside_county_polygons": "Kote sou kat la tonbe andeyò tout konte",
    "assignment:point_on_county_boundary_ambiguous": "Li chita egzakteman sou fwontyè ant konte yo",
  },

  findTitle: "Chèche yon pwojè",
  findHelp:
    "Ou tande pale de yon pwojè espesifik? Chèche nan tout dosye ekstrè a pa non, konpayi oswa kote pou wè si yo konte l, e si yo pa konte l, poukisa.",
  findLabel: "Chèche pwojè",
  findPlaceholder: "egz. Meta, Project Mica, Abilene",
  findLoading: "N ap chaje plis pase 2 000 dosye pwojè…",
  findError: "Nou pa t kapab chaje lis pwojè yo. Tcheke koneksyon ou epi eseye ankò.",
  findNone: (q) => `Pa gen pwojè ki koresponn ak “${q}”. Petèt Compute Atlas poko gen li; ou ka <a>rapòte l bay Compute Atlas</a>.`,
  source: "Sous",
  projectType: { data_center: "Sant done", crypto_mining: "Min kriptomone", power_generation: "Pwodiksyon elektrisite" },
  countedHere: "Yo konte l isit la",
  countedHereNote: "Li nan chif konte sa a.",
  counted: "Yo konte l",
  countedIn: (where) => `Nan ${where}.`,
  compareCounty: (name) => `Konpare ${name}`,
  operating: "Ap fonksyone",
  operatingContext: (where) => (where ? `Yo montre l pou kontèks nan ${where}, men yo pa konte l.` : "Yo montre l pou kontèks, men yo pa konte l."),
  notCounted: "Yo pa konte l",
  findFoot: "Ou konnen yon pwojè ki manke oswa ki gen erè? <a>Rapòte l bay Compute Atlas</a>, sous sit sa a itilize a.",

  peersTitle: "40 konte ki sanble yo, sa ki pi sanble an premye",
  peersRange: (p0, p1, d0, d1) =>
    `Yo gen ant ${p0} ak ${p1} moun, ak ant ${d0} ak ${d1} moun pa mil kare. Chwazi yon non pou konpare konte sa a pito.`,
  col: {
    rank: "Plas",
    county: "Konte",
    state: "Eta",
    population: "Popilasyon (2025)",
    density: "Moun pa mil kare",
    sites: (date) => `Sit an devlopman (${date})`,
  },
  showFewer: (n) => `Montre sèlman ${n} ki pi sanble yo`,
  showAll: (n) => `Montre tout ${n} konte ki sanble yo`,

  summaryTitle: "Rezime",
  aiChip: "Eksplikasyon entèlijans atifisyèl ekri · prepare davans epi verifye",
  aiEnglishOnly: "Eksplikasyon sa a disponib an angle sèlman.",
  aiNote: (model, date, status) =>
    `${model} te ekri l yon sèl fwa apati chif konte sa a nan ekstrè ${date} la, epi apre sa yo verifye chak chif youn pa youn (${status}). Li pa jenere an dirèk. Konsiy la, done yo bay la ak verifikasyon yo nan AI_EVALUATION.md.`,
  templateChip: "Rezime otomatik · modèl fiks ki fèt ak chif yo kalkile (se pa entèlijans atifisyèl ki ekri l)",
  aiExamples: "Egzanp entèlijans atifisyèl ekri:",
  sum: {
    zero1: (name, date) => `Nou pa jwenn okenn dosye pwojè ki kalifye pou ${name} nan ekstrè done yo chwazi a (${date}).`,
    zero2: (same, total, more, typical, median, mean) =>
      `Li gen menm kantite (zewo) ak ${same} nan ${total} konte ki sanble avè l yo, e mwens pase ${more}. Konte tipik ki sanble: ${typical} (medyàn ${median}; mwayèn ${mean}).`,
    some1: (name, n, date) =>
      `${name} gen ${n} dosye dokimante sou pwojè sant done ki kalifye (pwopoze, gen pèmi oswa an konstriksyon) nan ekstrè done ${date} la.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Sa plis pase ${fewer} nan ${total} konte ki sanble avè l yo, menm kantite ak ${same}, e mwens pase ${more}. Konte tipik ki sanble: ${typical} (medyàn ${median}; mwayèn ${mean}).`,
    noPeers: (total) => `Okenn nan ${total} konte ki sanble yo pa gen dosye ki kalifye nan ekstrè sa a.`,
    peers: (n, total, pct) => `${n} nan ${total} konte ki sanble yo (${pct}%) gen omwen yon dosye ki kalifye.`,
    caveat:
      "Konte ki sanble yo se sa ki pi pre nan popilasyon ak dansite popilasyon; yo pa sèvi ak aktivite sant done pou chwazi yo. Chif yo reflete dosye ki dokimante nan yon sèl ekstrè done ki pa konplè, kidonk konparezon sa a se yon deskripsyon sèlman: li pa montre kòz, efè oswa enpòtans estatistik.",
  },

  embedNote: (date) =>
    `Konte ki sanble yo se 40 konte ki pi pre nan popilasyon ak dansite popilasyon. Done jiska ${date} soti nan Compute Atlas (Edward Kubiak, CC BY 4.0) ak Biwo Resansman Etazini. Sèlman dosye ki dokimante; se pa kantite tout pwojè yo.`,
  seeFull: "Gade tout konparezon an",
  errorTitle: "Gen yon bagay ki pa mache",
  errorBody: "Paj la pa t fin chaje. Sa ka rive touswit apre yo fin mete sit la ajou. Rechaje paj la souvan regle sa; konte ou chwazi a rete nan adrès la.",
  reload: "Rechaje",
};

export default ht;
