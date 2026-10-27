import type { Translation } from "./en";

/**
 * Swedish. Written with AI; review by a native speaker welcome. U.S. counties are "county" (ett county, flera countyn),
 * as in Swedish reference works; "mile" is the English mile (not the Swedish mil).
 */
const plats = (n: number) => (n === 1 ? "plats" : "platser");

const sv: Translation = {
  siteTitle: "Hur ovanligt är mitt county?",
  subtitle: "Jämför dokumenterad datacenterutbyggnad med liknande countyn i hela USA.",
  methodologyLink: "Metod och källor",
  langNote: "Översatt med AI och inte granskat av professionella översättare eller modersmålstalare; kan innehålla fel. Namn på countyn och orter visas på engelska.",
  printUrl: (url) => `Interaktiv version: ${url}`,
  loadErrorTitle: "Datafilerna kunde inte läsas in.",
  loadErrorHelp: "Ladda om sidan för att försöka igen. Om du kör webbplatsen lokalt, kör först <code>python scripts/build_all.py</code>.",
  loadingCounties: (n) => `Läser in data för ${n} countyn…`,
  loading: "Läser in…",
  embedLoadError: "Jämförelsen kunde inte läsas in.",
  comparing: (name) => `Jämför <b>${name}</b>`,
  examplesAria: "Exempel på countyn",
  tryLabel: "Testa:",
  notFound: (code) => `Countykoden ${code} hittades inte, så ett exempel visas i stället.`,
  srShowing: (name, verdict) => `Visar ${name}: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>licens</a>). Bearbetning: ${transformations} Befolkning, landareal och countygränser: U.S. Census Bureau (allmän egendom). Dataversion <code>${version}</code>.`,
  footerFallback: "Anläggningsdata: Compute Atlas av Edward Kubiak (CC BY 4.0). Countydata: U.S. Census Bureau.",
  methodologyEnglish: "Det här avsnittet finns bara på engelska.",

  language: "Språk",
  languageButton: (name) => `Språk: ${name}`,
  languagePanelNote:
    "Översättningarna är gjorda med AI och har inte granskats av professionella översättare eller modersmålstalare, så de kan innehålla fel. Namn på countyn och orter är på engelska, så sök på engelska.",
  done: "Klar",

  freshnessAria: "Hur gamla uppgifterna är",
  dataAsOf: (date) => `Uppgifter per <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Anläggningsuppgifterna kommer från Compute Atlas ögonblicksbild ${tag}; projekt som tillkännagetts eller ändrats efter det datumet ingår inte. Befolkning: folkräkningsbyråns uppskattningar per ${popDate}. Gränser och areal: folkräkningsfiler från ${geoVintage}. Webbplatsens data byggdes senast ${built}.`,
  stale: (days) => `Den här ögonblicksbilden är mer än ${days} dagar gammal, så det kan finnas nyare uppgifter. Den aktuella förteckningen finns på <a>compute-atlas.com</a>.`,

  findCounty: "Hitta ett county",
  searchPlaceholder: "På engelska, t.ex. Loudoun County, VA",
  matchingCounties: "Matchande countyn",
  noCountyMatch: (q) => `Inget county matchar ”${q}”. Prova countyts engelska namn, ”Namn, ST” eller en femsiffrig countykod.`,

  facts: (pop, density, geoid) => `${pop} invånare · ${density} per kvadratmile · countykod ${geoid}`,
  shortAnswer: "Det korta svaret",
  verdict: {
    moreAll: (total) => `Mer dokumenterad datacenterutbyggnad än alla ${total} liknande countyn`,
    lessAll: (total) => `Mindre dokumenterad datacenterutbyggnad än alla ${total} liknande countyn`,
    moreMost: "Mer dokumenterad datacenterutbyggnad än de flesta liknande countyn",
    lessMost: "Mindre dokumenterad datacenterutbyggnad än de flesta liknande countyn",
    sameZero: "Som de flesta liknande countyn: inga dokumenterade datacenterplatser under utveckling",
    same: "Lika mycket dokumenterad datacenterutbyggnad som de flesta liknande countyn",
    middle: "I mitten jämfört med liknande countyn",
  },
  heroLabel: (n) => (n === 1 ? "dokumenterad datacenterplats under utveckling" : "dokumenterade datacenterplatser under utveckling"),
  heroAsOf: (date) => ` per ${date}`,
  statusAria: "Status för platserna enligt ögonblicksbilden",
  statusLine: { under_construction: "under byggnation", permitted: "med tillstånd", proposed: "föreslagna" },
  typicalSimilar: "Typiskt liknande county",
  similarWithAny: "Liknande countyn med någon",
  nOf: (n, total) => `${n} av ${total}`,
  averageSimilar: "Genomsnitt bland liknande",
  typical: {
    none: "inga",
    sites: (n) => `${n} ${plats(n)}`,
    range: (a, b) => `${a} till ${b} platser`,
  },
  comparedWith: (total) => `Jämfört med de ${total} mest liknande countyna`,
  cmp: {
    fewer: (n) => `<b>${n}</b> har färre`,
    same: (n) => `<b>${n}</b> lika många`,
    more: (n) => `<b>${n}</b> har fler`,
  },
  barAria: (total, fewer, name, same, more) =>
    `Av ${total} liknande countyn har ${fewer} färre dokumenterade platser än ${name}, ${same} lika många och ${more} fler.`,
  zeroNote:
    "Inga kvalificerande projektuppgifter hittades för det här countyt i den valda ögonblicksbilden. Det betyder inte att inga datacenter planeras här, bara att den här källan inte dokumenterar något.",
  similarLine: "”Liknande” betyder närmast i befolkning och befolkningstäthet, var som helst i USA. De mest liknande är <list/>.",
  operatingNote: (n) => `Därutöver finns uppgifter om ${n} datacenter i drift här (räknas inte ovan).`,
  stateLine: (state, withSites, counties) =>
    `I ${state} har ${withSites} av ${counties} countyn minst en dokumenterad plats under utveckling.`,
  findLink: "Hört talas om ett visst projekt? Se om det räknas",

  share: "Dela",
  shareOptions: "Delningsalternativ",
  copyLink: "Kopiera länk",
  printSummary: "Skriv ut sammanfattning",
  downloadSimilar: "Ladda ned liknande countyn (CSV)",
  downloadSites: "Ladda ned platser under utveckling (CSV)",
  embedAction: "Bädda in på en webbplats…",
  linkCopied: "Länken har kopierats",
  copyFailed: "Det går inte att kopiera här; markera texten och kopiera den själv",
  downloadStarted: "Nedladdningen har startat",
  embedTitle: "Bädda in jämförelsen",
  embedHelp: (name) =>
    `Klistra in det här på din sida. Det visar jämförelsen för ${name} med datum för uppgifterna och källhänvisning, och länkar till hela webbplatsen.`,
  embedCodeLabel: "Inbäddningskod",
  copyCode: "Kopiera kod",
  embedCopied: "Inbäddningskoden har kopierats",

  explainTitle: "Vad betyder siffrorna?",
  qCounted: "Vad räknas som en ”plats under utveckling”?",
  aCounted:
    "En datacenterplats som den öppna forskningsförteckningen Compute Atlas anger som <b>föreslagen</b>, <b>med tillstånd</b> (godkänd) eller <b>under byggnation</b>, med bekräftade eller rapporterade källor. Datacenter i drift räknas separat och visas bara som sammanhang. Varje siffra är antalet dokumenterade platsuppgifter, vilket inte är detsamma som ett kontrollerat antal byggnader.",
  qSimilar: "Vilka är de ”liknande countyna”?",
  aSimilar: (total, name) =>
    `De ${total} countyn i USA som ligger närmast ${name} i både befolkning och befolkningstäthet (invånare per kvadratmile land). Datacenteraktivitet används inte för att välja dem, så de visar vad som är vanligt för platser av den här storleken och tätheten. De kan ligga i vilken delstat som helst.`,
  qRead: "Hur läser jag ”färre, lika många, fler”?",
  aRead: (name, fewer, same, more, total) =>
    `Varje liknande county jämförs med ${name}: ${fewer} har färre dokumenterade platser, ${same} har lika många och ${more} har fler. ”De flesta” betyder mer än hälften, alltså minst 21 av ${total}. Det typiska liknande countyt är det i mitten när alla ${total} ställs upp efter antal (medianen).`,
  qZero: "Vad betyder en nolla?",
  aZero:
    "Att ingen kvalificerande uppgift hittades i den här ögonblicksbilden. Det betyder inte att inget datacenter planeras: förteckningen är ofullständig, och bättre dokumenterade platser kan visa fler uppgifter.",
  qJudge: "Säger det här om utbyggnaden här är bra, dålig eller trolig?",
  aJudge:
    "Nej. Verktyget räknar bara dokumenterade uppgifter och jämför dem med liknande platser. Det mäter inte miljömässiga eller ekonomiska effekter, förklarar inte varför ett county har fler eller färre uppgifter och förutspår inte framtida projekt.",
  qCurrent: "Hur aktuellt är det här?",
  aCurrent: (snapshot, popDate) =>
    `Uppgifterna kommer från Compute Atlas ögonblicksbild per ${snapshot}; projekt som tillkännagetts eller ändrats senare ingår inte. Webbplatsen letar varje vecka efter en nyare ögonblicksbild. Befolkningssiffrorna är folkräkningsbyråns uppskattningar per ${popDate}.`,
  fullMethodology: "Fullständig metod och källor",

  mapTitle: "Karta",
  mapViewAria: "Kartvy",
  mapAria: "Karta över countyn. Välj ett county för att jämföra det.",
  view: { county: "Det här countyt", similar: "Liknande countyn", shaded: "Alla countyn" },
  thisCounty: "Det här countyt",
  sitesInDev: (n) => `${n} ${plats(n)} under utveckling`,
  hoverSimilar: {
    fewer: (name) => `Liknande county · färre än ${name}`,
    same: (name) => `Liknande county · lika många som ${name}`,
    more: (name) => `Liknande county · fler än ${name}`,
  },
  clickToCompare: "Klicka för att jämföra",
  exactLocation: "Exakt plats",
  approxLocation: "Ungefärlig plats, inte den faktiska platsen",
  approxArea: (n) => `${n} platser i det här ungefärliga området`,
  andMore: (n) => `och ${n} till`,
  approxLocations: "Ungefärliga platser, inte de faktiska platserna",
  legendSimilarWith: "Liknande countyn med",
  legend: {
    fewer: (n) => `färre (${n})`,
    same: (n) => `lika många (${n})`,
    more: (n) => `fler (${n})`,
  },
  legendSites: "Platser under utveckling",
  legendThisCounty: "det här countyt",
  legendExact: (n) => `Exakt plats (${n})`,
  legendApprox: (n) => `Ungefärligt område (${n})`,
  zoomHint: "Zooma in för att se var platserna ligger.",
  offMap: (list) => `Också liknande, utanför den här vyn: ${list}.`,

  chartTitle: (name) => `Var ${name} hamnar bland sina 40 liknande countyn`,
  chartHelp: (date, name) =>
    `Varje punkt är ett liknande county, placerat efter antalet dokumenterade platser under utveckling (${date}) och färgat efter om det har färre, lika många eller fler än ${name}. Håll muspekaren över för detaljer; klicka för att jämföra.`,
  chartAria: (label, n, fewer, same, more) =>
    `Punktdiagram: ${label} har ${n}; ${fewer} liknande countyn har färre, ${same} lika många och ${more} fler.`,
  axisLabel: "Dokumenterade datacenterplatser under utveckling",
  typicalMark: (phrase) => `Typiskt: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} invånare · ${density} per kvadratmile`,
  clickToCompareCounty: "Klicka för att jämföra det här countyt",

  recordsTitle: (name, n) => `Dokumenterade platser under utveckling i ${name} (${n})`,
  recordsHelp: (date) =>
    `Föreslagna, godkända eller påbörjade datacenterplatser som dokumenterats i Compute Atlas ögonblicksbild per ${date}, med länkar till ursprungskällorna. Datumet ”Senast uppdaterad” visar när källans uppgifter senast reviderades.`,
  noRecords: "Inga kvalificerande projektuppgifter hittades för det här countyt i den valda ögonblicksbilden.",
  operatingSummary: (n) => `${n} datacenter i drift (bara som sammanhang, räknas inte ovan)`,
  reportFoot: "Saknas en plats, eller ser du ett fel? <a>Rapportera det till Compute Atlas</a>, källan som den här webbplatsen använder.",
  field: {
    operator: "Operatör",
    status: "Status",
    confidence: "Tillförlitlighet",
    location: "Plats",
    assignment: "Countytillhörighet",
    updated: "Senast uppdaterad",
  },
  recordId: (id) => `Uppgift i Compute Atlas: ${id}`,
  confidence: { confirmed: "bekräftad", reported: "rapporterad", rumored: "rykte" },
  status: {
    proposed: "Föreslagen",
    permitted: "Med tillstånd",
    under_construction: "Under byggnation",
    operational: "I drift",
    cancelled: "Avbruten",
  },
  precision: { exact: "Exakta koordinater", approximate: "Ungefärlig plats" },
  assignment: {
    spatial_join: "County enligt kartkoordinaterna",
    spatial_nearest_name_confirmed: "County enligt koordinaterna (kustlinje), namnet bekräftat",
    source_name_match: "County enligt namnet i källan",
  },
  reasons: {
    "status:operational": "Redan i drift (visas separat som sammanhang)",
    "status:cancelled": "Avbruten",
    "facility_type:power_generation": "Ett kraftproduktionsprojekt, inte ett datacenter",
    "facility_type:crypto_mining": "En anläggning för kryptomining, inte ett datacenter",
    "confidence:rumored": "Bara ett rykte (låg tillförlitlighet)",
    "assignment:outside_geographic_scope": "Utanför de 50 delstaterna och DC",
    "assignment:unresolved_multi_site": "Omfattar flera platser utan ett enda county",
    "assignment:approximate_without_source_county": "Ungefärlig plats utan angivet county",
    "assignment:ambiguous_source_county_name": "Det angivna countynamnet passar flera countyn",
    "assignment:unrecognized_source_county_name": "Det angivna countynamnet är inget county i 2025 års folkräkning",
    "assignment:conflict_point_county_vs_source_county": "Platsen på kartan och det angivna countyt stämmer inte överens",
    "assignment:conflict_point_state_vs_source_state": "Platsen på kartan och den angivna delstaten stämmer inte överens",
    "assignment:point_outside_county_polygons": "Platsen på kartan ligger utanför alla countyn",
    "assignment:point_on_county_boundary_ambiguous": "Ligger precis på en countygräns",
  },

  findTitle: "Hitta ett projekt",
  findHelp:
    "Hört talas om ett visst projekt? Sök bland alla uppgifter i ögonblicksbilden efter namn, företag eller ort för att se om det räknas, och om inte, varför.",
  findLabel: "Sök projekt",
  findPlaceholder: "t.ex. Meta, Project Mica, Abilene",
  findLoading: "Läser in över 2 000 projektuppgifter…",
  findError: "Projektlistan kunde inte läsas in. Kontrollera anslutningen och försök igen.",
  findNone: (q) => `Inget projekt matchar ”${q}”. Compute Atlas kanske inte har med det ännu; du kan <a>rapportera det till Compute Atlas</a>.`,
  source: "Källa",
  projectType: { data_center: "Datacenter", crypto_mining: "Kryptomining", power_generation: "Kraftproduktion" },
  countedHere: "Räknas här",
  countedHereNote: "Ingår i det här countyts siffra.",
  counted: "Räknas",
  countedIn: (where) => `I ${where}.`,
  compareCounty: (name) => `Jämför ${name}`,
  operating: "I drift",
  operatingContext: (where) => (where ? `Visas som sammanhang i ${where}, ingår inte i siffran.` : "Visas som sammanhang, ingår inte i siffran."),
  notCounted: "Räknas inte",
  findFoot: "Känner du till ett projekt som saknas eller är fel? <a>Rapportera det till Compute Atlas</a>, källan som den här webbplatsen använder.",

  peersTitle: "De 40 liknande countyna, mest liknande först",
  peersRange: (p0, p1, d0, d1) =>
    `De har mellan ${p0} och ${p1} invånare och mellan ${d0} och ${d1} invånare per kvadratmile. Välj ett namn för att jämföra det countyt i stället.`,
  col: {
    rank: "Plats",
    county: "County",
    state: "Delstat",
    population: "Befolkning (2025)",
    density: "Invånare per kvadratmile",
    sites: (date) => `Platser under utveckling (${date})`,
  },
  showFewer: (n) => `Visa bara de ${n} mest liknande`,
  showAll: (n) => `Visa alla ${n} liknande countyn`,

  summaryTitle: "Sammanfattning",
  aiChip: "Förklaring skriven av AI · skapad i förväg och kontrollerad",
  aiEnglishOnly: "Den här förklaringen finns bara på engelska.",
  aiNote: (model, date, status) =>
    `Skriven en gång av ${model} utifrån det här countyts siffror i ögonblicksbilden per ${date} och sedan kontrollerad siffra för siffra (${status}). Den skapas inte i realtid. Prompt, indata och kontroller finns i AI_EVALUATION.md.`,
  templateChip: "Automatisk sammanfattning · fast mall utifrån de beräknade siffrorna (inte skriven av AI)",
  aiExamples: "Exempel skrivna av AI:",
  sum: {
    zero1: (name, date) => `Inga kvalificerande projektuppgifter hittades för ${name} i den valda ögonblicksbilden (${date}).`,
    zero2: (same, total, more, typical, median, mean) =>
      `Det har samma antal (noll) som ${same} av sina ${total} liknande countyn och färre än ${more}. Typiskt liknande county: ${typical} (median ${median}; medelvärde ${mean}).`,
    some1: (name, n, date) =>
      `${name} har ${n} ${n === 1 ? "kvalificerande dokumenterad uppgift" : "kvalificerande dokumenterade uppgifter"} om datacenterprojekt (föreslagna, med tillstånd eller under byggnation) i ögonblicksbilden per ${date}.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Det är fler än ${fewer} av sina ${total} liknande countyn, lika många som ${same} och färre än ${more}. Typiskt liknande county: ${typical} (median ${median}; medelvärde ${mean}).`,
    noPeers: (total) => `Inget av de ${total} liknande countyna har någon kvalificerande uppgift i den här ögonblicksbilden.`,
    peers: (n, total, pct) => `${n} av de ${total} liknande countyna (${pct} %) har minst en kvalificerande uppgift.`,
    caveat:
      "Liknande countyn är de som ligger närmast i befolkning och befolkningstäthet; datacenteraktivitet används inte för att välja dem. Siffrorna speglar dokumenterade uppgifter i en enda ögonblicksbild, som är ofullständig, så jämförelsen är beskrivande och visar inte orsaker, effekter eller statistisk signifikans.",
  },

  embedNote: (date) =>
    `Liknande countyn är de 40 som ligger närmast i befolkning och befolkningstäthet. Uppgifter per ${date} från Compute Atlas (Edward Kubiak, CC BY 4.0) och U.S. Census Bureau. Bara dokumenterade uppgifter; inte ett antal av alla projekt.`,
  seeFull: "Se hela jämförelsen",
  errorTitle: "Något gick fel",
  errorBody: "Sidan kunde inte läsas in helt. Det kan hända direkt efter att webbplatsen har uppdaterats. Att ladda om brukar hjälpa; ditt county finns kvar i adressen.",
  reload: "Ladda om",
};

export default sv;
