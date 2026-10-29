import type { Translation } from "./en";

/**
 * Ecclesiastical Latin, in the register of modern Roman Catholic institutional documents (Holy See usage, the Lexicon
 * recentis Latinitatis). Written with AI; not checked by professional translators or Latinists. Modern technical terms
 * (data center, snapshot, website, download) are coinages or periphrases: see TRANSLATION_REVIEW.md. Long dates come
 * from formats.ts as ablatives of time ("die 2 mensis Octobris anno 2026"), so sentences use them that way; short
 * dates ("2 Oct. 2026") appear only after a colon, after "ad diem", or in parentheses.
 */
const locus = (n: number) => (n === 1 ? "locus" : "loca");

const la: Translation = {
  siteTitle: "Quam insolitus est comitatus meus?",
  subtitle: "Confer apparatum centrorum datorum in actis relatum cum comitatibus similibus per Civitates Foederatas Americae.",
  methodologyLink: "Ratio et fontes",
  langNote: "Haec versio ope intellegentiae artificialis confecta est neque ab interpretibus peritis neque a Latinitatis cultoribus recognita; errores continere potest. Nomina comitatuum et locorum Anglice manent.",
  printUrl: (url) => `Versio interactiva: ${url}`,
  loadErrorTitle: "Fasciculi notitiarum aperiri non potuerunt.",
  loadErrorHelp: "Paginam renova ut iterum coneris; si situm in tuo computatro exerces, prius exsequere <code>python scripts/build_all.py</code>.",
  loadingCounties: (n) => `Notitiae de ${n} comitatibus afferuntur…`,
  loading: "Exspecta, quaeso…",
  embedLoadError: "Haec collatio afferri non potuit.",
  comparing: (name) => `Confertur <b>${name}</b>`,
  examplesAria: "Comitatus exempli gratia",
  tryLabel: "Experire:",
  notFound: (code) => `Comitatus numero ${code} notatus non inventus est; quare comitatus exempli gratia ostenditur.`,
  srShowing: (name, verdict) => `Ostenditur ${name}: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} Mutationes: ${transformations} Incolae, area terrestris et fines comitatuum: U.S. Census Bureau (ditionis publicae). Versio notitiarum <code>${version}</code>.`,
  footerFallback: "Notitiae de aedificiis: Compute Atlas, auctore Edward Kubiak (CC BY 4.0). Notitiae de comitatibus: U.S. Census Bureau.",
  methodologyEnglish: "Haec pars Anglice tantum praebetur.",

  language: "Lingua",
  languageButton: (name) => `Lingua: ${name}`,
  languagePanelNote:
    "Versiones ope intellegentiae artificialis confectae sunt neque ab interpretibus peritis neque a loquentibus nativis recognitae, quare errores continere possunt. Nomina comitatuum et locorum Anglice manent; ergo Anglice quaere.",
  done: "Factum",

  freshnessAria: "Ad quod tempus hae notitiae pertinent",
  dataAsOf: (date) => `Notitiae prout erant <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Inscriptiones de aedificiis sumptae sunt ex exemplo Compute Atlas ${tag}; incepta post illum diem nuntiata vel mutata non includuntur. Incolae: numerus quem Census aestimat ${popDate} fuisse. Fines et area terrestris: fasciculi Census anni ${geoVintage}. Notitiae situs postremum renovatae: ${built}.`,
  stale: (days) =>
    `Hoc exemplum ante plus quam ${days} dies confectum est, quare recentiores inscriptiones exstare possunt. Index hodiernus invenitur apud <a>compute-atlas.com</a>.`,

  findCounty: "Quaere comitatum",
  searchPlaceholder: "Anglice, ex. gr. Loudoun County, VA",
  matchingCounties: "Comitatus congruentes",
  noCountyMatch: (q) => `Nullus comitatus congruit cum «${q}». Experire nomen comitatus Anglicum, «Nomen, ST» vel numerum comitatus quinque notarum.`,

  facts: (pop, density, geoid) => `${pop} incolae · ${density} per milliare quadratum · numerus comitatus ${geoid}`,
  shortAnswer: "Breviter",
  verdict: {
    moreAll: (total) => `Plus apparatus centrorum datorum in actis relati quam omnes ${total} comitatus similes`,
    lessAll: (total) => `Minus apparatus centrorum datorum in actis relati quam omnes ${total} comitatus similes`,
    moreMost: "Plus apparatus centrorum datorum in actis relati quam plerique comitatus similes",
    lessMost: "Minus apparatus centrorum datorum in actis relati quam plerique comitatus similes",
    sameZero: "Sicut plerique comitatus similes, nulla loca centrorum datorum in apparatu in actis relata",
    same: "Tantundem apparatus centrorum datorum in actis relati quantum plerique comitatus similes",
    middle: "Medius inter comitatus similes",
  },
  heroLabel: (n) => (n === 1 ? "locus centri datorum in apparatu, in actis relatus" : "loca centrorum datorum in apparatu, in actis relata"),
  heroAsOf: (date) => ` ad diem ${date}`,
  statusAria: "Status horum locorum, prout in exemplo notantur",
  statusLine: { under_construction: "in aedificatione", permitted: "permissu dato", proposed: "in proposito" },
  typicalSimilar: "Comitatus similis typicus",
  similarWithAny: "Comitatus similes cum ullo loco",
  nOf: (n, total) => `${n} ex ${total}`,
  averageSimilar: "Medium inter similes",
  typical: {
    none: "nulla",
    sites: (n) => `${n} ${locus(n)}`,
    range: (a, b) => `inter ${a} et ${b} loca`,
  },
  comparedWith: (total) => `Collatio cum ${total} comitatibus simillimis`,
  cmp: {
    fewer: (n) => `<b>${n}</b> pauciora habent`,
    same: (n) => `<b>${n}</b> totidem`,
    more: (n) => `<b>${n}</b> plura habent`,
  },
  barAria: (total, fewer, name, same, more) =>
    `Ex ${total} comitatibus similibus, ${fewer} pauciora loca in actis habent quam ${name}, ${same} totidem, ${more} plura.`,
  zeroNote:
    "In hoc exemplo notitiarum electo nullae inscriptiones idoneae de inceptis in hoc comitatu inventae sunt. Quod non significat nulla centra datorum hic proponi, sed tantum nullum in hoc fonte documentis firmari.",
  similarLine: "«Similes» sunt comitatus incolarum numero et densitate proximi, ubicumque in Civitatibus Foederatis. Simillimi sunt <list/>.",
  operatingNote: (n) =>
    n === 1
      ? "Praeterea 1 locus centri datorum iam operantis hic in actis est (supra non numeratus)."
      : `Praeterea ${n} loca centrorum datorum iam operantium hic in actis sunt (supra non numerata).`,
  stateLine: (state, withSites, counties) =>
    `In ${state}, ${withSites} ex ${counties} ${counties === 1 ? "comitatu" : "comitatibus"} saltem unum locum in apparatu in actis ${withSites === 1 ? "habet" : "habent"}.`,
  findLink: "De incepto quodam audivisti? Vide num numeretur",

  share: "Communica",
  shareOptions: "Modi communicandi",
  copyLink: "Exscribe nexum",
  printSummary: "Imprime summarium",
  downloadSimilar: "Deprome comitatus similes (CSV)",
  downloadSites: "Deprome loca in apparatu (CSV)",
  embedAction: "Insere in situm interretialem…",
  linkCopied: "Nexus exscriptus",
  copyFailed: "Hic exscribi non licet; textum selige et ipse exscribe",
  downloadStarted: "Depromptio coepta",
  embedTitle: "Insere hanc collationem",
  embedHelp: (name) =>
    `Hoc in paginam tuam insere. Collationem pro ${name} ostendit, cum die notitiarum et fonte memorato, et ad situm integrum remittit.`,
  embedCodeLabel: "Codex inserendus",
  copyCode: "Exscribe codicem",
  embedCopied: "Codex exscriptus",

  explainTitle: "Quid hi numeri significant?",
  qCounted: "Quid habetur «locus in apparatu»?",
  aCounted:
    "Locus centri datorum quem index publicus investigationis Compute Atlas notat ut <b>propositum</b>, <b>permissum</b> (approbatum) vel <b>in aedificatione</b>, fontibus confirmatis vel nuntiatis. Centra datorum iam operantia seorsum numerantur et ad contextum tantum ostenduntur. Quisque numerus est numerus inscriptionum locorum documentis firmatarum, qui non idem est ac numerus aedificiorum probatus.",
  qSimilar: "Qui sunt «comitatus similes»?",
  aSimilar: (total, name) =>
    `${total} comitatus Civitatum Foederatarum proximi ad ${name} tam incolarum numero quam densitate (incolis in singula milliaria quadrata terrae). Opera centrorum datorum ad eos eligendos non adhibentur, ita ut ostendant quid in locis huius magnitudinis et densitatis commune sit. In qualibet civitate esse possunt.`,
  qRead: "Quomodo leguntur «pauciora, totidem, plura»?",
  aRead: (name, fewer, same, more, total) =>
    `Quisque comitatus similis cum ${name} confertur: ${fewer} pauciora loca in actis habent, ${same} totidem, ${more} plura. «Plerique» significat plus quam dimidiam partem, id est saltem 21 ex ${total}. Comitatus similis typicus est medius, cum omnes ${total} secundum numeros suos ordinantur (mediana).`,
  qZero: "Quid significat «0»?",
  aZero:
    "Nullam inscriptionem idoneam in hoc exemplo notitiarum inventam esse. Non significat nullum centrum datorum proponi: index imperfectus est, et loca melius documentis instructa plures inscriptiones ostendere possunt.",
  qJudge: "Num hoc dicit utrum apparatus hic bonus, malus an probabilis sit?",
  aJudge:
    "Minime. Instrumentum tantum inscriptiones documentis firmatas numerat easque cum locis similibus confert. Effectus ad naturam vel ad rem oeconomicam pertinentes non metitur, non explicat cur comitatus plures paucioresve inscriptiones habeat, neque futura incepta praedicit.",
  qCurrent: "Quam recentes sunt hae notitiae?",
  aCurrent: (snapshot, popDate) =>
    `Inscriptiones sumptae sunt ex exemplo Compute Atlas ${snapshot} confecto; incepta postea nuntiata vel mutata non includuntur. Situs singulis hebdomadibus inquirit num recentius exemplum exstet. Numeri incolarum sunt quos Census aestimat ${popDate} fuisse.`,
  fullMethodology: "Ratio integra et fontes",

  mapTitle: "Tabula geographica",
  mapViewAria: "Aspectus tabulae",
  mapAria: "Tabula comitatuum. Comitatum selige ut eum conferas.",
  view: { county: "Hic comitatus", similar: "Comitatus similes", shaded: "Omnes comitatus" },
  thisCounty: "Hic comitatus",
  sitesInDev: (n) => `${n} ${locus(n)} in apparatu`,
  hoverSimilar: {
    fewer: (name) => `Comitatus similis · pauciora quam ${name}`,
    same: (name) => `Comitatus similis · totidem quot ${name}`,
    more: (name) => `Comitatus similis · plura quam ${name}`,
  },
  clickToCompare: "Preme ut conferas",
  exactLocation: "Locus exactus",
  approxLocation: "Locus approximatus, non locus verus",
  approxArea: (n) => `${n} loca in hac regione approximata`,
  andMore: (n) => `et ${n} alia`,
  approxLocations: "Loca approximata, non loca vera",
  legendSimilarWith: "Comitatus similes cum",
  legend: {
    fewer: (n) => `paucioribus (${n})`,
    same: (n) => `totidem (${n})`,
    more: (n) => `pluribus (${n})`,
  },
  legendSites: "Loca in apparatu",
  legendThisCounty: "hic comitatus",
  legendExact: (n) => `Locus exactus (${n})`,
  legendApprox: (n) => `Regio approximata (${n})`,
  zoomHint: "Amplifica ut videas ubi loca sint.",
  offMap: (list) => `Etiam similes, extra hunc aspectum: ${list}.`,

  chartTitle: (name) => `Quo loco ${name} inter suos 40 comitatus similes sit`,
  chartHelp: (date, name) =>
    `Quodque punctum est unus comitatus similis, positum secundum numerum locorum in apparatu in actis (${date}) et coloratum prout pauciora, totidem an plura habet quam ${name}. Cursorem superpone ut singula videas; preme ut conferas.`,
  chartAria: (label, n, fewer, same, more) =>
    `Diagramma punctorum: ${label} habet ${n}; ${fewer} comitatus similes pauciora habent, ${same} totidem, ${more} plura.`,
  axisLabel: "Loca centrorum datorum in apparatu, in actis",
  typicalMark: (phrase) => `Typicus: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} incolae · ${density} per milliare quadratum`,
  clickToCompareCounty: "Preme ut hunc comitatum conferas",

  recordsTitle: (name, n) => `Loca in apparatu in actis relata in ${name} (${n})`,
  recordsHelp: (date) =>
    `Loca centrorum datorum proposita, permissa vel in aedificatione, quae in exemplo Compute Atlas (${date}) documentis firmantur, cum nexibus ad fontes primigenios. Dies «Postremum renovatum» inscriptionis ostendit quando notitiae fontis eius postremum recognitae sint.`,
  noRecords: "In hoc exemplo notitiarum electo nullae inscriptiones idoneae de inceptis in hoc comitatu inventae sunt.",
  operatingSummary: (n) =>
    n === 1
      ? "1 locus centri datorum iam operantis (ad contextum tantum, supra non numeratus)"
      : `${n} loca centrorum datorum iam operantium (ad contextum tantum, supra non numerata)`,
  reportFoot: "Deestne locus, an errorem vides? <a>Id Compute Atlas significa</a>, fonti quo hic situs utitur.",
  field: {
    operator: "Administrator",
    status: "Status",
    confidence: "Fides",
    location: "Locus",
    assignment: "Attributio comitatus",
    updated: "Postremum renovatum",
  },
  recordId: (id) => `Inscriptio Compute Atlas: ${id}`,
  confidence: { confirmed: "confirmatum", reported: "nuntiatum", rumored: "fama tantum" },
  status: {
    proposed: "Propositum",
    permitted: "Permissum",
    under_construction: "In aedificatione",
    operational: "Operans",
    cancelled: "Rescissum",
  },
  precision: { exact: "Coordinatae exactae", approximate: "Locus approximatus" },
  assignment: {
    spatial_join: "Comitatus ex coordinatis tabulae",
    spatial_nearest_name_confirmed: "Comitatus ex coordinatis (ora maritima), nomine confirmato",
    source_name_match: "Comitatus ex nomine in fonte dato",
  },
  reasons: {
    "status:operational": "Iam operans (seorsum ad contextum ostenditur)",
    "status:cancelled": "Rescissum",
    "facility_type:power_generation": "Inceptum ad energiam gignendam, non centrum datorum",
    "facility_type:crypto_mining": "Locus monetae cryptographicae fodiendae, non centrum datorum",
    "confidence:rumored": "Fama tantum (fides parva)",
    "assignment:outside_geographic_scope": "Extra 50 civitates et Districtum Columbiae",
    "assignment:unresolved_multi_site": "Plura loca complectitur sine uno comitatu",
    "assignment:approximate_without_source_county": "Locus approximatus nullo comitatu nominato",
    "assignment:ambiguous_source_county_name": "Nomen comitatus eius cum pluribus comitatibus congruit",
    "assignment:unrecognized_source_county_name": "Nomen comitatus eius non est comitatus Census anni 2025",
    "assignment:conflict_point_county_vs_source_county": "Locus in tabula et comitatus nominatus inter se dissentiunt",
    "assignment:conflict_point_state_vs_source_state": "Locus in tabula et civitas nominata inter se dissentiunt",
    "assignment:point_outside_county_polygons": "Locus in tabula extra omnes comitatus cadit",
    "assignment:point_on_county_boundary_ambiguous": "In ipso comitatuum fine iacet",
  },

  findTitle: "Inveni inceptum",
  findHelp:
    "De incepto quodam audivisti? Omnes inscriptiones exempli quaere nomine, societate vel loco, ut videas num numeretur et, si non, quare.",
  findLabel: "Quaere incepta",
  findPlaceholder: "ex. gr. Meta, Project Mica, Abilene",
  findLoading: "Plus quam 2000 inscriptiones inceptorum afferuntur…",
  findError: "Index inceptorum afferri non potuit. Conexum tuum inspice et iterum conare.",
  findNone: (q) => `Nullum inceptum congruit cum «${q}». Fortasse Compute Atlas id nondum recenset; potes <a>id Compute Atlas significare</a>.`,
  source: "Fons",
  projectType: { data_center: "Centrum datorum", crypto_mining: "Fossio monetae cryptographicae", power_generation: "Generatio energiae" },
  countedHere: "Hic numeratur",
  countedHereNote: "In numero huius comitatus includitur.",
  counted: "Numeratur",
  countedIn: (where) => `In ${where}.`,
  compareCounty: (name) => `Confer ${name}`,
  operating: "Operans",
  operatingContext: (where) => (where ? `Ad contextum ostenditur in ${where}, non in numero.` : "Ad contextum ostenditur, non in numero."),
  notCounted: "Non numeratur",
  findFoot: "Novistine inceptum quod deest vel erratum est? <a>Id Compute Atlas significa</a>, fonti quo hic situs utitur.",

  peersTitle: "40 comitatus similes, simillimo primo",
  peersRange: (p0, p1, d0, d1) =>
    `Habent inter ${p0} et ${p1} incolas et inter ${d0} et ${d1} incolas per milliare quadratum. Nomen selige ut illum comitatum potius conferas.`,
  col: {
    rank: "Ordo",
    county: "Comitatus",
    state: "Civitas",
    population: "Incolae (2025)",
    density: "Incolae per mil. quadr.",
    sites: (date) => `Loca in apparatu (${date})`,
  },
  showFewer: (n) => `Ostende tantum ${n} simillimos`,
  showAll: (n) => `Ostende omnes ${n} comitatus similes`,

  summaryTitle: "Summarium",
  aiChip: "Explicatio ab intellegentia artificiali scripta · antea confecta et probata",
  aiEnglishOnly: "Haec explicatio Anglice tantum praebetur.",
  aiNote: (model, date, status) =>
    `Semel scripta a ${model} ex numeris huius comitatus in exemplo ${date} confecto, deinde numerus post numerum probata (${status}). Non vivo tempore gignitur. Mandatum, data ingesta et probationes inveniuntur in AI_EVALUATION.md.`,
  templateChip: "Summarium automaticum · forma fixa ex numeris computatis (non ab intellegentia artificiali scriptum)",
  aiExamples: "Exempla ab intellegentia artificiali scripta:",
  sum: {
    zero1: (name, date) => `Nullae inscriptiones idoneae de inceptis in ${name} inventae sunt in exemplo notitiarum electo, ${date} confecto.`,
    zero2: (same, total, more, typical, median, mean) =>
      `Totidem (nulla) habet quot ${same} ex ${total} comitatibus similibus, et pauciora quam ${more}. Comitatus similis typicus: ${typical} in actis (mediana ${median}; medium ${mean}).`,
    some1: (name, n, date) =>
      `${name} in exemplo notitiarum ${date} confecto ${n} ${n === 1 ? "inscriptionem idoneam habet" : "inscriptiones idoneas habet"} de inceptis centrorum datorum documentis firmatis (propositis, permissis vel in aedificatione).`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Hoc plus est quam ${fewer} ex ${total} comitatibus similibus, totidem quot ${same}, et minus quam ${more}. Comitatus similis typicus: ${typical} in actis (mediana ${median}; medium ${mean}).`,
    noPeers: (total) => `Nullus ex ${total} comitatibus similibus inscriptionem idoneam in hoc exemplo habet.`,
    peers: (n, total, pct) => `${n} ex ${total} comitatibus similibus (${pct}%) saltem unam inscriptionem idoneam ${n === 1 ? "habet" : "habent"}.`,
    caveat:
      "Comitatus similes sunt qui incolarum numero et densitate proximi sunt; opera centrorum datorum ad eos eligendos non adhibentur. Numeri inscriptiones documentis firmatas in uno exemplo notitiarum, quod imperfectum est, referunt; quare haec collatio tantum describit, neque causas neque effectus neque significationem statisticam ostendit.",
  },

  embedNote: (date) =>
    `Comitatus similes sunt 40 incolarum numero et densitate proximi. Notitiae prout erant ${date}, ex Compute Atlas (Edward Kubiak, CC BY 4.0) et U.S. Census Bureau. Inscriptiones documentis firmatae tantum; non numerus omnium inceptorum.`,
  seeFull: "Vide collationem integram",
  errorTitle: "Aliquid perperam accidit",
  errorBody:
    "Pagina tota afferri non potuit. Hoc accidere potest statim postquam situs renovatus est. Plerumque pagina renovata res corrigitur; comitatus tuus in nexu servatur.",
  reload: "Renova",
};

export default la;
