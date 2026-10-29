import type { Translation } from "./en";

/** Italian. Written with AI; not checked by professional translators or native speakers. */
const sito = (n: number) => (n === 1 ? "sito" : "siti");

const it: Translation = {
  siteTitle: "Quanto è insolita la mia contea?",
  subtitle: "Confronta lo sviluppo documentato di data center con quello di contee simili in tutti gli Stati Uniti.",
  methodologyLink: "Metodologia e fonti",
  langNote: "Traduzione generata con l’IA e non verificata da traduttori professionisti né da madrelingua: può contenere errori. I nomi di contee e luoghi restano in inglese.",
  printUrl: (url) => `Versione interattiva: ${url}`,
  loadErrorTitle: "Impossibile caricare i file di dati.",
  loadErrorHelp: "Ricarica la pagina per riprovare; se stai eseguendo il sito in locale, esegui prima <code>python scripts/build_all.py</code>.",
  loadingCounties: (n) => `Caricamento dei dati di ${n} contee…`,
  loading: "Caricamento…",
  embedLoadError: "Impossibile caricare questo confronto.",
  comparing: (name) => `Confronto: <b>${name}</b>`,
  examplesAria: "Contee di esempio",
  tryLabel: "Prova:",
  notFound: (code) => `Il codice di contea ${code} non è stato trovato, quindi viene mostrata una contea di esempio.`,
  srShowing: (name, verdict) => `Visualizzazione di ${name}: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} Trasformazioni: ${transformations} Popolazione, superficie terrestre e confini delle contee: U.S. Census Bureau (pubblico dominio). Versione dei dati <code>${version}</code>.`,
  footerFallback: "Dati sulle strutture: Compute Atlas di Edward Kubiak (CC BY 4.0). Dati sulle contee: U.S. Census Bureau.",
  methodologyEnglish: "Questa sezione è disponibile solo in inglese.",

  language: "Lingua",
  languageButton: (name) => `Lingua: ${name}`,
  languagePanelNote:
    "Le traduzioni sono state generate con l’IA e non sono state verificate da traduttori professionisti né da madrelingua, quindi possono contenere errori. I nomi di contee e luoghi sono in inglese: cerca in inglese.",
  done: "Fine",

  freshnessAria: "A quando risalgono questi dati",
  dataAsOf: (date) => `Dati aggiornati al <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `I dati sulle strutture provengono dall’istantanea ${tag} di Compute Atlas; i progetti annunciati o modificati dopo quella data non sono inclusi. Popolazione: stime del Census al ${popDate}. Confini e superficie: file del Census ${geoVintage}. Dati del sito ricostruiti l’ultima volta il ${built}.`,
  stale: (days) =>
    `Questa istantanea ha più di ${days} giorni, quindi potrebbero esistere dati più recenti. L’inventario aggiornato è su <a>compute-atlas.com</a>.`,

  findCounty: "Cerca una contea",
  searchPlaceholder: "In inglese, ad es. Loudoun County, VA",
  matchingCounties: "Contee corrispondenti",
  noCountyMatch: (q) => `Nessuna contea corrisponde a “${q}”. Prova con il nome inglese della contea, “Nome, ST” o un codice di contea a 5 cifre.`,

  facts: (pop, density, geoid) => `${pop} abitanti · ${density} per mi² · codice contea ${geoid}`,
  shortAnswer: "In breve",
  verdict: {
    moreAll: (total) => `Più sviluppo documentato di data center di tutte le ${total} contee simili`,
    lessAll: (total) => `Meno sviluppo documentato di data center di tutte le ${total} contee simili`,
    moreMost: "Più sviluppo documentato di data center della maggior parte delle contee simili",
    lessMost: "Meno sviluppo documentato di data center della maggior parte delle contee simili",
    sameZero: "Come la maggior parte delle contee simili, nessun sito di data center in sviluppo documentato",
    same: "Lo stesso sviluppo documentato di data center della maggior parte delle contee simili",
    middle: "A metà strada rispetto alle contee simili",
  },
  heroLabel: (n) => (n === 1 ? "sito di data center in sviluppo registrato" : "siti di data center in sviluppo registrati"),
  heroAsOf: (date) => ` al ${date}`,
  statusAria: "Stato di questi siti secondo l’istantanea",
  statusLine: { under_construction: "in costruzione", permitted: "autorizzati", proposed: "proposti" },
  typicalSimilar: "Contea simile tipica",
  similarWithAny: "Contee simili con almeno un sito",
  nOf: (n, total) => `${n} su ${total}`,
  averageSimilar: "Media tra le simili",
  typical: {
    none: "nessuno",
    sites: (n) => `${n} ${sito(n)}`,
    range: (a, b) => `da ${a} a ${b} siti`,
  },
  comparedWith: (total) => `Confronto con le ${total} contee più simili`,
  cmp: {
    fewer: (n) => `<b>${n}</b> ne hanno meno`,
    same: (n) => `<b>${n}</b> lo stesso numero`,
    more: (n) => `<b>${n}</b> ne hanno di più`,
  },
  barAria: (total, fewer, name, same, more) =>
    `Delle ${total} contee simili, ${fewer} hanno meno siti registrati di ${name}, ${same} ne hanno lo stesso numero e ${more} ne hanno di più.`,
  zeroNote:
    "Nell’istantanea selezionata non sono stati trovati record di progetti idonei per questa contea. Non significa che qui non siano previsti data center, ma solo che questa fonte non ne documenta nessuno.",
  similarLine: "“Simili” significa più vicine per popolazione e densità di popolazione, ovunque negli Stati Uniti. Le più simili sono <list/>.",
  operatingNote: (n) =>
    n === 1
      ? "Inoltre, qui è registrato 1 data center operativo (non conteggiato sopra)."
      : `Inoltre, qui sono registrati ${n} data center operativi (non conteggiati sopra).`,
  stateLine: (state, withSites, counties) =>
    `In ${state}, ${withSites} contee su ${counties} hanno almeno un sito in sviluppo registrato.`,
  findLink: "Hai sentito parlare di un progetto specifico? Verifica se è conteggiato",

  share: "Condividi",
  shareOptions: "Opzioni di condivisione",
  copyLink: "Copia link",
  printSummary: "Stampa riepilogo",
  downloadSimilar: "Scarica le contee simili (CSV)",
  downloadSites: "Scarica i siti in sviluppo (CSV)",
  embedAction: "Incorpora in un sito web…",
  linkCopied: "Link copiato",
  copyFailed: "Qui non è possibile copiare: seleziona il testo e copialo manualmente",
  downloadStarted: "Download avviato",
  embedTitle: "Incorpora questo confronto",
  embedHelp: (name) =>
    `Incolla questo codice nella tua pagina. Mostra il confronto per ${name}, con la data dei dati e la citazione della fonte, e rimanda al sito completo.`,
  embedCodeLabel: "Codice da incorporare",
  copyCode: "Copia codice",
  embedCopied: "Codice copiato",

  explainTitle: "Che cosa significano questi numeri?",
  qCounted: "Che cosa conta come “sito in sviluppo”?",
  aCounted:
    "Un sito di data center che l’inventario pubblico di ricerca Compute Atlas indica come <b>proposto</b>, <b>autorizzato</b> (approvato) o <b>in costruzione</b>, con fonti confermate o riportate dalla stampa. I data center operativi sono conteggiati a parte e mostrati solo come contesto. Ogni numero è il conteggio dei record di siti documentati, che non equivale a un conteggio verificato di edifici.",
  qSimilar: "Quali sono le “contee simili”?",
  aSimilar: (total, name) =>
    `Le ${total} contee degli Stati Uniti più vicine a ${name} sia per popolazione sia per densità di popolazione (abitanti per miglio quadrato di terraferma). L’attività legata ai data center non viene usata per sceglierle, quindi mostrano ciò che è comune in luoghi di queste dimensioni e densità. Possono trovarsi in qualsiasi stato.`,
  qRead: "Come si leggono “meno, lo stesso, di più”?",
  aRead: (name, fewer, same, more, total) =>
    `Ogni contea simile viene confrontata con ${name}: ${fewer} hanno meno siti registrati, ${same} lo stesso numero e ${more} di più. “La maggior parte” significa più della metà, cioè almeno 21 su ${total}. La contea simile tipica è quella centrale quando tutte le ${total} vengono ordinate in base al loro numero (la mediana).`,
  qZero: "Che cosa significa uno zero?",
  aZero:
    "Che in questa istantanea dei dati non è stato trovato alcun record idoneo. Non significa che non sia previsto alcun data center: l’inventario è incompleto e i luoghi meglio documentati possono mostrare più record.",
  qJudge: "Questo dice se lo sviluppo qui è positivo, negativo o probabile?",
  aJudge:
    "No. Lo strumento si limita a contare i record documentati e a confrontarli con luoghi simili. Non misura effetti ambientali o economici, non spiega perché una contea abbia più o meno record e non prevede progetti futuri.",
  qCurrent: "Quanto sono aggiornati questi dati?",
  aCurrent: (snapshot, popDate) =>
    `I record provengono dall’istantanea di Compute Atlas del ${snapshot}; i progetti annunciati o modificati in seguito non sono inclusi. Il sito controlla ogni settimana se esiste un’istantanea più recente. I dati sulla popolazione sono stime del Census al ${popDate}.`,
  fullMethodology: "Metodologia completa e fonti",

  mapTitle: "Mappa",
  mapViewAria: "Vista della mappa",
  mapAria: "Mappa delle contee. Seleziona una contea per confrontarla.",
  view: { county: "Questa contea", similar: "Contee simili", shaded: "Tutte le contee" },
  thisCounty: "Questa contea",
  sitesInDev: (n) => `${n} ${sito(n)} in sviluppo`,
  hoverSimilar: {
    fewer: (name) => `Contea simile · meno di ${name}`,
    same: (name) => `Contea simile · lo stesso numero di ${name}`,
    more: (name) => `Contea simile · più di ${name}`,
  },
  clickToCompare: "Fai clic per confrontare",
  exactLocation: "Posizione esatta",
  approxLocation: "Posizione approssimativa, non il sito reale",
  approxArea: (n) => `${n} siti in quest’area approssimativa`,
  andMore: (n) => `e altri ${n}`,
  approxLocations: "Posizioni approssimative, non i siti reali",
  legendSimilarWith: "Contee simili con",
  legend: {
    fewer: (n) => `meno (${n})`,
    same: (n) => `lo stesso numero (${n})`,
    more: (n) => `di più (${n})`,
  },
  legendSites: "Siti in sviluppo",
  legendThisCounty: "questa contea",
  legendExact: (n) => `Posizione esatta (${n})`,
  legendApprox: (n) => `Area approssimativa (${n})`,
  zoomHint: "Ingrandisci per vedere dove si trovano i siti.",
  offMap: (list) => `Altre contee simili, fuori da questa vista: ${list}.`,

  chartTitle: (name) => `Dove si colloca ${name} tra le sue 40 contee simili`,
  chartHelp: (date, name) =>
    `Ogni punto è una contea simile, posizionata in base al numero di siti in sviluppo registrati (${date}) e colorata a seconda che ne abbia meno, lo stesso numero o più di ${name}. Passa il mouse per i dettagli; fai clic per confrontare.`,
  chartAria: (label, n, fewer, same, more) =>
    `Grafico a punti: ${label} ne ha ${n}; ${fewer} contee simili ne hanno meno, ${same} lo stesso numero e ${more} di più.`,
  axisLabel: "Siti di data center in sviluppo registrati",
  typicalMark: (phrase) => `Tipico: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} abitanti · ${density} per mi²`,
  clickToCompareCounty: "Fai clic per confrontare questa contea",

  recordsTitle: (name, n) => `Siti in sviluppo registrati in ${name} (${n})`,
  recordsHelp: (date) =>
    `Siti di data center proposti, autorizzati o in costruzione documentati nell’istantanea di Compute Atlas del ${date}, con i link alle fonti originali. La data “Ultimo aggiornamento” di un record indica quando sono state riviste per l’ultima volta le informazioni della sua fonte.`,
  noRecords: "Nell’istantanea selezionata non sono stati trovati record di progetti idonei per questa contea.",
  operatingSummary: (n) =>
    n === 1 ? "1 data center operativo (solo contesto, non conteggiato sopra)" : `${n} data center operativi (solo contesto, non conteggiati sopra)`,
  reportFoot: "Manca un sito o hai notato un errore? <a>Segnalalo a Compute Atlas</a>, la fonte usata da questo sito.",
  field: {
    operator: "Operatore",
    status: "Stato",
    confidence: "Affidabilità",
    location: "Posizione",
    assignment: "Assegnazione alla contea",
    updated: "Ultimo aggiornamento",
  },
  recordId: (id) => `Record di Compute Atlas: ${id}`,
  confidence: { confirmed: "confermato", reported: "riportato dalla stampa", rumored: "voce non confermata" },
  status: {
    proposed: "Proposto",
    permitted: "Autorizzato",
    under_construction: "In costruzione",
    operational: "Operativo",
    cancelled: "Annullato",
  },
  precision: { exact: "Coordinate esatte", approximate: "Posizione approssimativa" },
  assignment: {
    spatial_join: "Contea dalle coordinate sulla mappa",
    spatial_nearest_name_confirmed: "Contea dalle coordinate (costa), nome confermato",
    source_name_match: "Contea dal nome indicato nella fonte",
  },
  reasons: {
    "status:operational": "Già operativo (mostrato a parte come contesto)",
    "status:cancelled": "Annullato",
    "facility_type:power_generation": "Un progetto di produzione di energia, non un data center",
    "facility_type:crypto_mining": "Un sito di mining di criptovalute, non un data center",
    "confidence:rumored": "Solo voci (affidabilità bassa)",
    "assignment:outside_geographic_scope": "Fuori dai 50 stati e dal Distretto di Columbia",
    "assignment:unresolved_multi_site": "Comprende più siti senza un’unica contea",
    "assignment:approximate_without_source_county": "Posizione approssimativa senza contea indicata",
    "assignment:ambiguous_source_county_name": "Il nome della contea corrisponde a più di una contea",
    "assignment:unrecognized_source_county_name": "Il nome della contea non è una contea del Census 2025",
    "assignment:conflict_point_county_vs_source_county": "La posizione sulla mappa e la contea indicata non coincidono",
    "assignment:conflict_point_state_vs_source_state": "La posizione sulla mappa e lo stato indicato non coincidono",
    "assignment:point_outside_county_polygons": "La posizione sulla mappa è fuori da ogni contea",
    "assignment:point_on_county_boundary_ambiguous": "Si trova esattamente sul confine tra contee",
  },

  findTitle: "Trova un progetto",
  findHelp:
    "Hai sentito parlare di un progetto specifico? Cerca tra tutti i record dell’istantanea per nome, azienda o luogo per vedere se è conteggiato e, se no, perché.",
  findLabel: "Cerca progetti",
  findPlaceholder: "ad es. Meta, Project Mica, Abilene",
  findLoading: "Caricamento di oltre 2.000 record di progetti…",
  findError: "Impossibile caricare l’elenco dei progetti. Controlla la connessione e riprova.",
  findNone: (q) => `Nessun progetto corrisponde a “${q}”. Compute Atlas potrebbe non averlo ancora registrato; puoi <a>segnalarlo a Compute Atlas</a>.`,
  source: "Fonte",
  projectType: { data_center: "Data center", crypto_mining: "Mining di criptovalute", power_generation: "Produzione di energia" },
  countedHere: "Conteggiato qui",
  countedHereNote: "Incluso nel numero di questa contea.",
  counted: "Conteggiato",
  countedIn: (where) => `In ${where}.`,
  compareCounty: (name) => `Confronta ${name}`,
  operating: "Operativo",
  operatingContext: (where) => (where ? `Mostrato come contesto in ${where}, non nel conteggio.` : "Mostrato come contesto, non nel conteggio."),
  notCounted: "Non conteggiato",
  findFoot: "Conosci un progetto mancante o errato? <a>Segnalalo a Compute Atlas</a>, la fonte usata da questo sito.",

  peersTitle: "Le 40 contee simili, dalla più simile",
  peersRange: (p0, p1, d0, d1) =>
    `Vanno da ${p0} a ${p1} abitanti e da ${d0} a ${d1} abitanti per mi². Seleziona un nome per confrontare quella contea.`,
  col: {
    rank: "Posizione",
    county: "Contea",
    state: "Stato",
    population: "Popolazione (2025)",
    density: "Abitanti per mi²",
    sites: (date) => `Siti in sviluppo (${date})`,
  },
  showFewer: (n) => `Mostra solo le ${n} più simili`,
  showAll: (n) => `Mostra tutte le ${n} contee simili`,

  summaryTitle: "Riepilogo",
  aiChip: "Spiegazione scritta dall’IA · generata in anticipo e verificata",
  aiEnglishOnly: "Questa spiegazione è disponibile solo in inglese.",
  aiNote: (model, date, status) =>
    `Scritta una sola volta da ${model} a partire dai dati di questa contea nell’istantanea del ${date}, poi verificata numero per numero (${status}). Non viene generata in tempo reale. Prompt, dati di input e verifiche sono in AI_EVALUATION.md.`,
  templateChip: "Riepilogo automatico · modello fisso basato sui dati calcolati (non scritto dall’IA)",
  aiExamples: "Esempi scritti dall’IA:",
  sum: {
    zero1: (name, date) => `Nell’istantanea dei dati selezionata (${date}) non sono stati trovati record di progetti idonei per ${name}.`,
    zero2: (same, total, more, typical, median, mean) =>
      `Ha lo stesso numero (zero) di ${same} delle sue ${total} contee simili e meno di ${more}. Contea simile tipica: ${typical} (mediana ${median}; media ${mean}).`,
    some1: (name, n, date) =>
      `${name} ha ${n} ${n === 1 ? "record documentato" : "record documentati"} di progetti di data center idonei (proposti, autorizzati o in costruzione) nell’istantanea dei dati del ${date}.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `È più di ${fewer} delle sue ${total} contee simili, lo stesso numero di ${same} e meno di ${more}. Contea simile tipica: ${typical} (mediana ${median}; media ${mean}).`,
    noPeers: (total) => `Nessuna delle ${total} contee simili ha un record idoneo in questa istantanea.`,
    peers: (n, total, pct) => `${n} delle ${total} contee simili (${pct}%) hanno almeno un record idoneo.`,
    caveat:
      "Le contee simili sono quelle più vicine per popolazione e densità di popolazione; l’attività legata ai data center non viene usata per sceglierle. I numeri riflettono i record documentati in un’unica istantanea dei dati, che è incompleta: il confronto è quindi descrittivo e non indica cause, impatti né significatività statistica.",
  },

  embedNote: (date) =>
    `Le contee simili sono le 40 più vicine per popolazione e densità di popolazione. Dati al ${date} da Compute Atlas (Edward Kubiak, CC BY 4.0) e dallo U.S. Census Bureau. Solo record documentati; non è il conteggio di tutti i progetti.`,
  seeFull: "Vedi il confronto completo",
  errorTitle: "Qualcosa è andato storto",
  errorBody:
    "Non è stato possibile completare il caricamento della pagina. Può succedere subito dopo un aggiornamento del sito. Di solito basta ricaricare; la tua contea resta nell’indirizzo.",
  reload: "Ricarica",
};

export default it;
