import type { Translation } from "./en";

/**
 * Anglo-Norman in the register of English Law French (the year books, abridgments and reports: "de record", "ceo",
 * "solonc", "issint", "nient", "le dit"), not modern French. Written with AI; not checked by professional translators
 * or specialists. As Law French reporters did, modern things with no Law French word keep their English name with
 * Law French grammar ("un data center", "le transcript"): see TRANSLATION_REVIEW.md. Long dates come from formats.ts
 * without an article ("2 jour d’Octobre l’an 2026"), so sentences supply "le"/"del".
 */
const place = (n: number) => (n === 1 ? "place" : "places");

const xno: Translation = {
  siteTitle: "Coment estraunge est mon countee?",
  subtitle: "Comparez les data centers en fesance de record ove les countees semblables par tout les Estates Unis.",
  methodologyLink: "Methode et sources",
  langNote: "Ceste version fuit fait per intelligence artificiele, et nient examiné per translatours de profession ne per ceux que parlont le langage de nature; issint il poit contener errours. Les nouns des countees et des lieux demurront en Engleis.",
  printUrl: (url) => `Version interactive: ${url}`,
  loadErrorTitle: "Les fichiers del data ne poient estre chargez.",
  loadErrorHelp: "Rechargez le page pur essayer arere; si vous faitez currer le site localment, faitez currer primerement <code>python scripts/build_all.py</code>.",
  loadingCounties: (n) => `Chargeant le data de ${n} countees…`,
  loading: "Chargeant…",
  embedLoadError: "Ceste comparison ne poit estre chargé.",
  comparing: (name) => `Comparant <b>${name}</b>`,
  examplesAria: "Countees pur ensample",
  tryLabel: "Essayez:",
  notFound: (code) => `Le nombre de countee ${code} ne fuit pas trové, issint un countee d’ensample est monstré en lieu de ceo.`,
  srShowing: (name, verdict) => `Monstrant ${name}: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>licence</a>). Transformations: ${transformations} Population, terre et bundes des countees: U.S. Census Bureau (domaine publique). Version del data <code>${version}</code>.`,
  footerFallback: "Data des edifices: Compute Atlas per Edward Kubiak (CC BY 4.0). Data des countees: U.S. Census Bureau.",
  methodologyEnglish: "Ceste partie est en Engleis tantsolement.",

  language: "Langage",
  languageButton: (name) => `Langage: ${name}`,
  languagePanelNote:
    "Les translations fuerent faitz per intelligence artificiele, et ne fuerent pas examinez per translatours de profession ne per ceux que parlont le langage de nature; issint ils poient contener errours. Les nouns des countees et des lieux demurront en Engleis; pur ceo serchez en Engleis.",
  done: "Fait",

  freshnessAria: "De quel temps cest data est",
  dataAsOf: (date) => `Data come il estoit le <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Les recordes des edifices veignont del transcript ${tag} del Compute Atlas; les projectes annuncez ou chaungez aprés cel jour ne sount pas compris. Population: les estimations del Census pur le ${popDate}. Bundes et terre: les fichiers del Census de ${geoVintage}. Le data del site fuit refait darreinement le ${built}.`,
  stale: (days) =>
    `Cest transcript est plus veile que ${days} jours, issint recordes plus noveles poient estre. Le inventarie vif est a <a>compute-atlas.com</a>.`,

  findCounty: "Trovez un countee",
  searchPlaceholder: "En Engleis, sicome Loudoun County, VA",
  matchingCounties: "Countees acordantz",
  noCountyMatch: (q) => `Nul countee acorde ove “${q}”. Essayez le noun Engleis del countee, “Noun, ST”, ou un nombre de countee de 5 chiffres.`,

  facts: (pop, density, geoid) => `${pop} gentz · ${density} par mile quarré · nombre de countee ${geoid}`,
  shortAnswer: "Le brief respons",
  verdict: {
    moreAll: (total) => `Plus de data centers en fesance de record que touts les ${total} countees semblables`,
    lessAll: (total) => `Meins de data centers en fesance de record que touts les ${total} countees semblables`,
    moreMost: "Plus de data centers en fesance de record que le greindre part des countees semblables",
    lessMost: "Meins de data centers en fesance de record que le greindre part des countees semblables",
    sameZero: "Come le greindre part des countees semblables, nul place de data center en fesance de record",
    same: "Autant de data centers en fesance de record que le greindre part des countees semblables",
    middle: "En le milieu, comparé ove les countees semblables",
  },
  heroLabel: (n) => (n === 1 ? "place de data center en fesance, de record" : "places de data center en fesance, de record"),
  heroAsOf: (date) => ` al ${date}`,
  statusAria: "Le estat de ceux places, come ils sount listez en le transcript",
  statusLine: { under_construction: "en edifiant", permitted: "licencié", proposed: "proposé" },
  typicalSimilar: "Countee semblable ordinarie",
  similarWithAny: "Countees semblables ove ascun",
  nOf: (n, total) => `${n} de ${total}`,
  averageSimilar: "Le moien entre les semblables",
  typical: {
    none: "nul",
    sites: (n) => `${n} ${place(n)}`,
    range: (a, b) => `${a} a ${b} places`,
  },
  comparedWith: (total) => `Comparé ove les ${total} countees plus semblables`,
  cmp: {
    fewer: (n) => `<b>${n}</b> ount meins`,
    same: (n) => `<b>${n}</b> autant`,
    more: (n) => `<b>${n}</b> ount plus`,
  },
  barAria: (total, fewer, name, same, more) =>
    `De ${total} countees semblables, ${fewer} ount meins de places de record que ${name}, ${same} ount le mesme nombre, et ${more} ount plus.`,
  zeroNote:
    "Nul recorde de projecte que se qualifie ne fuit trové en cest countee en le transcript eslieu. Ceo ne signifie pas que nul data center est proposé icy, mes tantsolement que nul est de record en ceste source.",
  similarLine: "“Semblable” signifie le plus prochein en population et en densité de population, en quel lieu que ceo soit en les Estates Unis. Les plus semblables sount <list/>.",
  operatingNote: (n) =>
    n === 1
      ? "Ensement, 1 place de data center en operacion est de record icy (nient accompté desuis)."
      : `Ensement, ${n} places de data center en operacion sount de record icy (nient accomptez desuis).`,
  stateLine: (state, withSites, counties) =>
    `En ${state}, ${withSites} de ${counties} ${counties === 1 ? "countee" : "countees"} ${withSites === 1 ? "ad" : "ount"} al meins un place en fesance de record.`,
  findLink: "Avez oye de ascun projecte? Veiez s’il est accompté",

  share: "Envoier",
  shareOptions: "Maners de envoier",
  copyLink: "Copier le lien",
  printSummary: "Imprimer le abbregement",
  downloadSimilar: "Descharger les countees semblables (CSV)",
  downloadSites: "Descharger les places en fesance (CSV)",
  embedAction: "Inserer en un site…",
  linkCopied: "Lien copié",
  copyFailed: "Copier n’est pas possible icy; eslisez le text et copiez le vous mesmes",
  downloadStarted: "Le descharge est comencé",
  embedTitle: "Inserer ceste comparison",
  embedHelp: (name) =>
    `Mittez ceo en vostre page. Il monstre le comparison pur ${name}, ove le jour del data et le credit del source, et mene arere al site entier.`,
  embedCodeLabel: "Code pur inserer",
  copyCode: "Copier le code",
  embedCopied: "Code copié",

  explainTitle: "Que signifiont ceux nombres?",
  qCounted: "Quel chose est accompté come “place en fesance”?",
  aCounted:
    "Un place de data center que le inventarie publique de recherche Compute Atlas liste come <b>proposé</b>, <b>licencié</b> (apprové), ou <b>en edifiant</b>, ove sources confirmez ou reportez. Data centers en operacion sount accomptez a part et monstrez tantsolement pur context. Chescun nombre est le nombre des recordes de places, que n’est pas le mesme chose que un nombre verifié des edifices.",
  qSimilar: "Queux sount les “countees semblables”?",
  aSimilar: (total, name) =>
    `Les ${total} countees des Estates Unis plus procheins a ${name} et en population et en densité de population (gentz par mile quarré de terre). Le activité des data centers n’est pas use pur eux eslire, issint ils monstront ceo que est commune en lieux de tiel grandeur et densité. Ils poient estre en ascun estate.`,
  qRead: "Coment lirray “meins, le mesme, plus”?",
  aRead: (name, fewer, same, more, total) =>
    `Chescun countee semblable est comparé ove ${name}: ${fewer} ount meins de places de record, ${same} ount le mesme nombre, et ${more} ount plus. “Le greindre part” signifie plus que le moitié, issint al meins 21 de ${total}. Le countee semblable ordinarie est celuy del milieu quant touts les ${total} sount mys en ordre solonc lour nombres (le mediane).`,
  qZero: "Que signifie un zero?",
  aZero:
    "Que nul recorde que se qualifie ne fuit trové en cest transcript del data. Ceo ne signifie pas que nul data center est proposé: le inventarie n’est pas perfect, et lieux mieux documentez poient monstrer plus de recordes.",
  qJudge: "Dit ceo si le fesance icy est bone, male, ou semblable a venir?",
  aJudge:
    "Nient. Cest instrument accompte tantsolement les recordes et les compare ove lieux semblables. Il ne mesure pas les effectes sur le environment ou sur le richesse, ne explaine pas pur quel cause un countee ad plus ou meins de recordes, ne predit pas projectes a venir.",
  qCurrent: "De quel temps est ceo?",
  aCurrent: (snapshot, popDate) =>
    `Les recordes sount del transcript del Compute Atlas del ${snapshot}; projectes annuncez ou chaungez aprés ne sount pas compris. Le site serche chescun semaine pur un transcript plus novel. Les nombres de population sount estimations del Census pur le ${popDate}.`,
  fullMethodology: "Le methode entier et les sources",

  mapTitle: "Mappe",
  mapViewAria: "Veue del mappe",
  mapAria: "Mappe des countees. Eslisez un countee pur le comparer.",
  view: { county: "Cest countee", similar: "Countees semblables", shaded: "Touts les countees" },
  thisCounty: "Cest countee",
  sitesInDev: (n) => `${n} ${place(n)} en fesance`,
  hoverSimilar: {
    fewer: (name) => `Countee semblable · meins que ${name}`,
    same: (name) => `Countee semblable · le mesme que ${name}`,
    more: (name) => `Countee semblable · plus que ${name}`,
  },
  clickToCompare: "Pressez pur comparer",
  exactLocation: "Lieu exacte",
  approxLocation: "Lieu a peu prés, nemy le verray place",
  approxArea: (n) => `${n} places en cest lieu a peu prés`,
  andMore: (n) => `et ${n} autres`,
  approxLocations: "Lieux a peu prés, nemy les verrays places",
  legendSimilarWith: "Countees semblables ove",
  legend: {
    fewer: (n) => `meins (${n})`,
    same: (n) => `le mesme (${n})`,
    more: (n) => `plus (${n})`,
  },
  legendSites: "Places en fesance",
  legendThisCounty: "cest countee",
  legendExact: (n) => `Lieu exacte (${n})`,
  legendApprox: (n) => `Lieu a peu prés (${n})`,
  zoomHint: "Approchez pur veier ou les places sount.",
  offMap: (list) => `Auxi semblables, hors de ceste veue: ${list}.`,

  chartTitle: (name) => `Ou ${name} chiet entre ses 40 countees semblables`,
  chartHelp: (date, name) =>
    `Chescun point est un countee semblable, mys solonc son nombre de places en fesance de record (${date}) et coloré solonc ceo que il ad meins, le mesme, ou plus que ${name}. Mittez le pointer dessus pur les particulers; pressez pur comparer.`,
  chartAria: (label, n, fewer, same, more) =>
    `Diagramme de points: ${label} ad ${n}; ${fewer} countees semblables ount meins, ${same} le mesme, ${more} plus.`,
  axisLabel: "Places de data center en fesance, de record",
  typicalMark: (phrase) => `Ordinarie: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} gentz · ${density} par mile quarré`,
  clickToCompareCounty: "Pressez pur comparer cest countee",

  recordsTitle: (name, n) => `Places en fesance de record en ${name} (${n})`,
  recordsHelp: (date) =>
    `Places de data center proposez, licenciez, ou en edifiant, de record en le transcript del Compute Atlas del ${date}, ove liens as sources originals. Le jour “Darreinement chaungé” de un recorde monstre quant les informations de sa source fuerent darreinement revisez.`,
  noRecords: "Nul recorde de projecte que se qualifie ne fuit trové en cest countee en le transcript eslieu.",
  operatingSummary: (n) =>
    n === 1
      ? "1 place de data center en operacion (pur context tantsolement, nient accompté desuis)"
      : `${n} places de data center en operacion (pur context tantsolement, nient accomptez desuis)`,
  reportFoot: "Defaut un place, ou veiez un errour? <a>Monstrez le al Compute Atlas</a>, le source que cest site use.",
  field: {
    operator: "Operatour",
    status: "Estat",
    confidence: "Credence",
    location: "Lieu",
    assignment: "Assignement al countee",
    updated: "Darreinement chaungé",
  },
  recordId: (id) => `Recorde del Compute Atlas: ${id}`,
  confidence: { confirmed: "confirmé", reported: "reporté", rumored: "par fame tantsolement" },
  status: {
    proposed: "Proposé",
    permitted: "Licencié",
    under_construction: "En edifiant",
    operational: "En operacion",
    cancelled: "Cancellé",
  },
  precision: { exact: "Coordinates exactes", approximate: "Lieu a peu prés" },
  assignment: {
    spatial_join: "Countee per les coordinates del mappe",
    spatial_nearest_name_confirmed: "Countee per les coordinates (rivage), noun confirmé",
    source_name_match: "Countee per le noun del countee en le source",
  },
  reasons: {
    "status:operational": "Ja en operacion (monstré a part pur context)",
    "status:cancelled": "Cancellé",
    "facility_type:power_generation": "Un projecte de generacion de power, nemy un data center",
    "facility_type:crypto_mining": "Un place de crypto-mining, nemy un data center",
    "confidence:rumored": "Par fame tantsolement (petit credence)",
    "assignment:outside_geographic_scope": "Hors des 50 estates et del DC",
    "assignment:unresolved_multi_site": "Comprent plusors places sauns un sole countee",
    "assignment:approximate_without_source_county": "Lieu a peu prés sauns countee nomé",
    "assignment:ambiguous_source_county_name": "Le noun de son countee acorde ove plus que un countee",
    "assignment:unrecognized_source_county_name": "Le noun de son countee n’est pas un countee del Census de 2025",
    "assignment:conflict_point_county_vs_source_county": "Son lieu en le mappe et le countee nomé discordont",
    "assignment:conflict_point_state_vs_source_state": "Son lieu en le mappe et le estate nomé discordont",
    "assignment:point_outside_county_polygons": "Son lieu en le mappe chiet hors de chescun countee",
    "assignment:point_on_county_boundary_ambiguous": "Il gist precisement sur le bunde de countee",
  },

  findTitle: "Trovez un projecte",
  findHelp:
    "Avez oye de ascun projecte? Serchez chescun recorde en le transcript per noun, compaignie, ou lieu pur veier s’il est accompté, et si nemy, pur quel cause.",
  findLabel: "Serchez projectes",
  findPlaceholder: "sicome Meta, Project Mica, Abilene",
  findLoading: "Chargeant touts les 2,000+ recordes de projectes…",
  findError: "Le liste des projectes ne poit estre chargé. Examinez vostre connexion et essayez arere.",
  findNone: (q) => `Nul projecte acorde ove “${q}”. Compute Atlas peraventure ne le liste pas uncore; vous poiez <a>le monstrer al Compute Atlas</a>.`,
  source: "Source",
  projectType: { data_center: "Data center", crypto_mining: "Crypto-mining", power_generation: "Generacion de power" },
  countedHere: "Accompté icy",
  countedHereNote: "Compris en le nombre de cest countee.",
  counted: "Accompté",
  countedIn: (where) => `En ${where}.`,
  compareCounty: (name) => `Comparez ${name}`,
  operating: "En operacion",
  operatingContext: (where) => (where ? `Monstré pur context en ${where}, nemy en le nombre.` : "Monstré pur context, nemy en le nombre."),
  notCounted: "Nient accompté",
  findFoot: "Conissez un projecte que defaut ou est erroné? <a>Monstrez le al Compute Atlas</a>, le source que cest site use.",

  peersTitle: "Les 40 countees semblables, le plus semblable primer",
  peersRange: (p0, p1, d0, d1) =>
    `Ils sount de ${p0} a ${p1} gentz et de ${d0} a ${d1} gentz par mile quarré. Eslisez un noun pur comparer cel countee en lieu de cest.`,
  col: {
    rank: "Degree",
    county: "Countee",
    state: "Estate",
    population: "Population (2025)",
    density: "Gentz par mile quarré",
    sites: (date) => `Places en fesance (${date})`,
  },
  showFewer: (n) => `Monstrez tantsolement les ${n} plus semblables`,
  showAll: (n) => `Monstrez touts les ${n} countees semblables`,

  summaryTitle: "Abbregement",
  aiChip: "Explication escrite per intelligence artificiele · fait avant et examiné",
  aiEnglishOnly: "Ceste explication est en Engleis tantsolement.",
  aiNote: (model, date, status) =>
    `Escrite un foitz per ${model} des nombres de cest countee en le transcript del ${date}, et puis examiné nombre per nombre (${status}). Ele n’est pas faite en vif. Le prompt, le data, et les examinations sount en AI_EVALUATION.md.`,
  templateChip: "Abbregement automatique · forme fixe des nombres calculez (nient escrite per intelligence artificiele)",
  aiExamples: "Ensamples escritz per intelligence artificiele:",
  sum: {
    zero1: (name, date) => `Nul recorde de projecte que se qualifie ne fuit trové en ${name} en le transcript del data eslieu (${date}).`,
    zero2: (same, total, more, typical, median, mean) =>
      `Il ad le mesme nombre (zero) que ${same} de ses ${total} countees semblables, et meins que ${more}. Un countee semblable ordinarie ad ${typical} de record (mediane ${median}; moien ${mean}).`,
    some1: (name, n, date) =>
      `${name} ad ${n} ${n === 1 ? "recorde" : "recordes"} de projecte de data center que se ${n === 1 ? "qualifie" : "qualifiont"} (proposé, licencié, ou en edifiant) en le transcript del data del ${date}.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Ceo est plus que ${fewer} de ses ${total} countees semblables, le mesme que ${same}, et meins que ${more}. Un countee semblable ordinarie ad ${typical} de record (mediane ${median}; moien ${mean}).`,
    noPeers: (total) => `Nul des ${total} countees semblables ad un recorde que se qualifie en cest transcript.`,
    peers: (n, total, pct) => `${n} des ${total} countees semblables (${pct}%) ${n === 1 ? "ad" : "ount"} al meins un recorde que se qualifie.`,
    caveat:
      "Les countees semblables sount ceux plus procheins en population et en densité de population; le activité des data centers n’est pas use pur eux eslire. Les nombres monstront les recordes de un sole transcript del data, que n’est pas perfect; issint ceste comparison est descriptive tantsolement, et ne monstre pas les causes, les effectes, ne le significance statistique.",
  },

  embedNote: (date) =>
    `Les countees semblables sount les 40 plus procheins en population et en densité de population. Data come il estoit le ${date}, del Compute Atlas (Edward Kubiak, CC BY 4.0) et del U.S. Census Bureau. Recordes tantsolement; nemy un nombre de touts les projectes.`,
  seeFull: "Veiez le comparison entier",
  errorTitle: "Ascun chose ad failli",
  errorBody:
    "Le page ne poit finir de charger. Ceo poit avenir tantost aprés que le site est refait. Recharger le amende communement; vostre countee est gardé en le adresse.",
  reload: "Recharger",
};

export default xno;
