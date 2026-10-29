/**
 * English interface text: the source of truth for every language. Each translation (./es.ts, ./ja.ts, …) gives its
 * own version of any of these; whatever it leaves out falls back to English. Names of counties, states, companies and
 * projects are data and stay as they are in the sources. Markup inside strings (<b>…</b>, <a>…</a>, <code>…</code> and
 * slots such as <list/>) is rendered by Rich.tsx, so translators can move it to fit their word order.
 */
const s = (n: number) => (n === 1 ? "" : "s");

export const en = {
  // Header, page states, footer
  siteTitle: "How Unusual Is My County?",
  subtitle: "Compare documented data-center development with similar counties across the United States.",
  methodologyLink: "Methodology & sources",
  langNote: "", // translated versions say they were machine-translated with AI and not checked by professionals or native speakers
  printUrl: (url: string) => `Interactive version: ${url}`,
  loadErrorTitle: "The data files could not be loaded.",
  loadErrorHelp: "Reload the page to try again; if you are running the site locally, run <code>python scripts/build_all.py</code> first.",
  loadingCounties: (n: string) => `Loading data for ${n} counties…`,
  loading: "Loading…",
  embedLoadError: "This comparison could not be loaded.",
  comparing: (name: string) => `Comparing <b>${name}</b>`,
  examplesAria: "Example counties",
  tryLabel: "Try:",
  notFound: (code: string) => `County code ${code} was not found, so an example county is shown instead.`,
  srShowing: (name: string, verdict: string) => `Showing ${name}: ${verdict}.`,
  footer: (attribution: string, transformations: string, version: string) =>
    `${attribution} Transformations: ${transformations} Population, land area and county boundaries: U.S. Census Bureau (public domain). Data version <code>${version}</code>.`,
  footerFallback: "Facility data: Compute Atlas by Edward Kubiak (CC BY 4.0). County data: U.S. Census Bureau.",
  methodologyEnglish: "", // translated versions say the methodology section is in English

  // Language picker
  language: "Language",
  languageButton: (name: string) => `Language: ${name}`,
  languagePanelNote:
    "Translations were made with AI and have not been checked by professional translators or native speakers, so they may contain mistakes. County and place names stay in English, so search in English.",
  done: "Done",

  // Data dates banner
  freshnessAria: "When this data is from",
  dataAsOf: (date: string) => `Data as of <b>${date}</b>`,
  freshnessSub: (tag: string, popDate: string, geoVintage: string, built: string) =>
    `Facility records come from the Compute Atlas snapshot ${tag}; projects announced or changed after that date are not included. Population: Census estimates for ${popDate}. Boundaries and land area: ${geoVintage} Census files. Site data last rebuilt ${built}.`,
  stale: (days: number) =>
    `This snapshot is more than ${days} days old, so newer records may exist. The live inventory is at <a>compute-atlas.com</a>.`,

  // County search
  findCounty: "Find a county",
  searchPlaceholder: "e.g. Loudoun County, VA",
  matchingCounties: "Matching counties",
  noCountyMatch: (q: string) => `No county matches “${q}”. Try a county name, “Name, ST”, or a 5-digit county code.`,

  // The answer
  facts: (pop: string, density: string, geoid: string) => `${pop} people · ${density} per sq mi · county code ${geoid}`,
  shortAnswer: "The short answer",
  verdict: {
    moreAll: (total: number) => `More documented data-center development than all ${total} similar counties`,
    lessAll: (total: number) => `Less documented data-center development than all ${total} similar counties`,
    moreMost: "More documented data-center development than most similar counties",
    lessMost: "Less documented data-center development than most similar counties",
    sameZero: "Like most similar counties, no documented data-center sites in development",
    same: "The same documented data-center development as most similar counties",
    middle: "In the middle compared with similar counties",
  },
  heroLabel: (n: number) => `data-center site${s(n)} in development on record`,
  heroAsOf: (date: string) => ` as of ${date}`,
  statusAria: "Status of these sites, as listed in the snapshot",
  statusLine: { under_construction: "under construction", permitted: "permitted", proposed: "proposed" },
  typicalSimilar: "Typical similar county",
  similarWithAny: "Similar counties with any",
  nOf: (n: number, total: number) => `${n} of ${total}`,
  averageSimilar: "Average among similar",
  typical: {
    none: "none",
    sites: (n: number) => `${n} site${s(n)}`,
    range: (a: number, b: number) => `${a} to ${b} sites`,
  },
  comparedWith: (total: number) => `Compared with the ${total} most similar counties`,
  cmp: {
    fewer: (n: number) => `<b>${n}</b> have fewer`,
    same: (n: number) => `<b>${n}</b> the same`,
    more: (n: number) => `<b>${n}</b> have more`,
  },
  barAria: (total: number, fewer: number, name: string, same: number, more: number) =>
    `Of ${total} similar counties, ${fewer} have fewer sites on record than ${name}, ${same} have the same number, and ${more} have more.`,
  zeroNote:
    "No qualifying pipeline records were found in this county in the selected dataset snapshot. That does not mean no data centers are proposed here, only that none is documented in this source.",
  similarLine: "“Similar” means closest in population and population density, anywhere in the U.S. The most similar are <list/>.",
  operatingNote: (n: number) =>
    `Separately, ${n} operating data-center ${n === 1 ? "site is" : "sites are"} on record here (not counted above).`,
  stateLine: (state: string, withSites: number, counties: number) =>
    `In ${state}, ${withSites} of ${counties} ${counties === 1 ? "county" : "counties"} have at least one site in development on record.`,
  findLink: "Heard about a specific project? See whether it’s counted",

  // Share menu
  share: "Share",
  shareOptions: "Share options",
  copyLink: "Copy link",
  printSummary: "Print summary",
  downloadSimilar: "Download similar counties (CSV)",
  downloadSites: "Download sites in development (CSV)",
  embedAction: "Embed on a website…",
  linkCopied: "Link copied",
  copyFailed: "Copying isn't available here; select the text and copy it instead",
  downloadStarted: "Download started",
  embedTitle: "Embed this comparison",
  embedHelp: (name: string) =>
    `Paste this into your page. It shows the comparison for ${name}, with its data date and source credit, and links back to the full site.`,
  embedCodeLabel: "Embed code",
  copyCode: "Copy code",
  embedCopied: "Embed code copied",

  // What do these numbers mean?
  explainTitle: "What do these numbers mean?",
  qCounted: "What is counted as a “site in development”?",
  aCounted:
    "A data-center site that the public research inventory Compute Atlas lists as <b>proposed</b>, <b>permitted</b> (approved), or <b>under construction</b>, with confirmed or reported sources. Operating data centers are counted separately and shown only as context. Each count is the number of documented site records, which is not the same as a verified count of buildings.",
  qSimilar: "Who are the “similar counties”?",
  aSimilar: (total: number, name: string) =>
    `The ${total} U.S. counties closest to ${name} in both population and population density (people per square mile of land). Data-center activity is not used to choose them, so they show what is common for places of this size and density. They can be in any state.`,
  qRead: "How do I read “fewer, the same, more”?",
  aRead: (name: string, fewer: number, same: number, more: number, total: number) =>
    `Each similar county is compared with ${name}: ${fewer} have fewer sites on record, ${same} have the same number, and ${more} have more. “Most” means more than half, so at least 21 of ${total}. The typical similar county is the middle one when all ${total} are lined up by their counts (the median).`,
  qZero: "What does a zero mean?",
  aZero:
    "That no qualifying record was found in this dataset snapshot. It does not mean no data center is proposed: the inventory is incomplete, and better-documented places may show more records.",
  qJudge: "Does this say whether development here is good, bad, or likely?",
  aJudge:
    "No. The tool only counts documented records and compares them with similar places. It does not measure environmental or economic effects, explain why a county has more or fewer records, or predict future projects.",
  qCurrent: "How current is this?",
  aCurrent: (snapshot: string, popDate: string) =>
    `The records are from the Compute Atlas snapshot of ${snapshot}; projects announced or changed later are not included. The site checks weekly for a newer snapshot. Population figures are Census estimates for ${popDate}.`,
  fullMethodology: "Full methodology and sources",

  // Map
  mapTitle: "Map",
  mapViewAria: "Map view",
  mapAria: "County map. Select a county to compare it.",
  view: { county: "This county", similar: "Similar counties", shaded: "All counties" },
  thisCounty: "This county",
  sitesInDev: (n: number) => `${n} site${s(n)} in development`,
  hoverSimilar: {
    fewer: (name: string) => `Similar county · fewer than ${name}`,
    same: (name: string) => `Similar county · the same as ${name}`,
    more: (name: string) => `Similar county · more than ${name}`,
  },
  clickToCompare: "Click to compare",
  exactLocation: "Exact location",
  approxLocation: "Approximate location, not the actual site",
  approxArea: (n: number) => `${n} sites in this approximate area`,
  andMore: (n: number) => `and ${n} more`,
  approxLocations: "Approximate locations, not the actual sites",
  legendSimilarWith: "Similar counties with",
  legend: {
    fewer: (n: number) => `fewer (${n})`,
    same: (n: number) => `the same (${n})`,
    more: (n: number) => `more (${n})`,
  },
  legendSites: "Sites in development",
  legendThisCounty: "this county",
  legendExact: (n: number) => `Exact location (${n})`,
  legendApprox: (n: number) => `Approximate area (${n})`,
  zoomHint: "Zoom in to see where the sites are.",
  offMap: (list: string) => `Also similar, outside this view: ${list}.`,

  // Chart
  chartTitle: (name: string) => `Where ${name} falls among its 40 similar counties`,
  chartHelp: (date: string, name: string) =>
    `Each dot is one similar county, placed by its number of sites in development on record (${date}) and coloured by whether it has fewer, the same, or more than ${name}. Hover for details; click to compare.`,
  chartAria: (label: string, n: number, fewer: number, same: number, more: number) =>
    `Dot plot: ${label} has ${n}; ${fewer} similar counties have fewer, ${same} the same, ${more} more.`,
  axisLabel: "Data-center sites in development on record",
  typicalMark: (phrase: string) => `Typical: ${phrase}`,
  peopleDensity: (pop: string, density: string) => `${pop} people · ${density} per sq mi`,
  clickToCompareCounty: "Click to compare this county",

  // Site records
  recordsTitle: (name: string, n: number) => `Sites in development on record in ${name} (${n})`,
  recordsHelp: (date: string) =>
    `Proposed, permitted, or under-construction data-center sites documented in the Compute Atlas snapshot of ${date}, with links to the original sources. A record’s “Last updated” date shows when its source information was last revised.`,
  noRecords: "No qualifying pipeline records were found in this county in the selected dataset snapshot.",
  operatingSummary: (n: number) => `${n} operating data-center site${s(n)} (context only, not counted above)`,
  reportFoot: "Missing a site, or see an error? <a>Report it to Compute Atlas</a>, the source this site uses.",
  field: {
    operator: "Operator",
    status: "Status",
    confidence: "Confidence",
    location: "Location",
    assignment: "County assignment",
    updated: "Last updated",
  },
  recordId: (id: string) => `Compute Atlas record: ${id}`,
  confidence: { confirmed: "confirmed", reported: "reported", rumored: "rumored" } as Record<string, string>,
  status: {
    proposed: "Proposed",
    permitted: "Permitted",
    under_construction: "Under construction",
    operational: "Operational",
    cancelled: "Cancelled",
  } as Record<string, string>,
  precision: { exact: "Exact coordinates", approximate: "Approximate location" } as Record<string, string>,
  assignment: {
    spatial_join: "County from map coordinates",
    spatial_nearest_name_confirmed: "County from coordinates (shoreline), name confirmed",
    source_name_match: "County from source county name",
  } as Record<string, string>,
  reasons: {
    "status:operational": "Already operating (shown separately as context)",
    "status:cancelled": "Cancelled",
    "facility_type:power_generation": "A power-generation project, not a data center",
    "facility_type:crypto_mining": "A crypto-mining site, not a data center",
    "confidence:rumored": "Only rumored (low confidence)",
    "assignment:outside_geographic_scope": "Outside the 50 states and DC",
    "assignment:unresolved_multi_site": "Covers several sites with no single county",
    "assignment:approximate_without_source_county": "Approximate location with no county named",
    "assignment:ambiguous_source_county_name": "Its county name matches more than one county",
    "assignment:unrecognized_source_county_name": "Its county name isn't a 2025 Census county",
    "assignment:conflict_point_county_vs_source_county": "Its map location and named county disagree",
    "assignment:conflict_point_state_vs_source_state": "Its map location and named state disagree",
    "assignment:point_outside_county_polygons": "Its map location falls outside every county",
    "assignment:point_on_county_boundary_ambiguous": "It sits exactly on a county boundary",
  } as Record<string, string>,

  // Find a project
  findTitle: "Find a project",
  findHelp:
    "Heard about a specific project? Search every record in the snapshot by name, company, or place to see whether it’s counted, and if not, why.",
  findLabel: "Search projects",
  findPlaceholder: "e.g. Meta, Project Mica, Abilene",
  findLoading: "Loading all 2,000+ project records…",
  findError: "The project list couldn’t be loaded. Check your connection and try again.",
  findNone: (q: string) => `No project matches “${q}”. Compute Atlas may not list it yet; you can <a>report it to Compute Atlas</a>.`,
  source: "Source",
  projectType: { data_center: "Data center", crypto_mining: "Crypto mining", power_generation: "Power generation" } as Record<string, string>,
  countedHere: "Counted here",
  countedHereNote: "Included in this county’s number.",
  counted: "Counted",
  countedIn: (where: string) => `In ${where}.`,
  compareCounty: (name: string) => `Compare ${name}`,
  operating: "Operating",
  operatingContext: (where: string | null) => (where ? `Shown as context in ${where}, not in the count.` : "Shown as context, not in the count."),
  notCounted: "Not counted",
  findFoot: "Know of a project that’s missing or wrong? <a>Report it to Compute Atlas</a>, the source this site uses.",

  // Similar-counties table
  peersTitle: "The 40 similar counties, most similar first",
  peersRange: (p0: string, p1: string, d0: string, d1: string) =>
    `They range from ${p0} to ${p1} people and from ${d0} to ${d1} people per sq mi. Select a name to compare that county instead.`,
  col: {
    rank: "Rank",
    county: "County",
    state: "State",
    population: "Population (2025)",
    density: "People per sq mi",
    sites: (date: string) => `Sites in development (${date})`,
  },
  showFewer: (n: number) => `Show only the ${n} most similar`,
  showAll: (n: number) => `Show all ${n} similar counties`,

  // Summary (deterministic template) and AI examples
  summaryTitle: "Summary",
  aiChip: "AI-written explanation · pre-generated and checked",
  aiEnglishOnly: "", // translated versions say the AI explanation is in English
  aiNote: (model: string, date: string, status: string) =>
    `Written once by ${model} from this county's figures in the ${date} snapshot, then checked number by number (${status}). It is not generated live. Prompt, input, and checks are in AI_EVALUATION.md.`,
  templateChip: "Automated summary · fixed template from the calculated figures (not AI-written)",
  aiExamples: "AI-written examples:",
  sum: {
    zero1: (name: string, date: string) => `No qualifying pipeline records were found in ${name} in the selected dataset snapshot (${date}).`,
    zero2: (same: number, total: number, more: number, typical: string, median: string, mean: string) =>
      `It has the same count (zero) as ${same} of its ${total} similar counties, and fewer than ${more}. A typical similar county has ${typical} on record (median ${median}; average ${mean}).`,
    some1: (name: string, n: number, date: string) =>
      `${name} has ${n} qualifying documented data-center pipeline record${s(n)} (proposed, permitted, or under construction) in the ${date} dataset snapshot.`,
    some2: (fewer: number, total: number, same: number, more: number, typical: string, median: string, mean: string) =>
      `That is more than ${fewer} of its ${total} similar counties, the same as ${same}, and fewer than ${more}. A typical similar county has ${typical} on record (median ${median}; average ${mean}).`,
    noPeers: (total: number) => `None of the ${total} similar counties has a qualifying record in this snapshot.`,
    peers: (n: number, total: number, pct: string) => `${n} of the ${total} similar counties (${pct}%) have at least one qualifying record.`,
    caveat:
      "Similar counties are the ones closest in population and population density; data-center activity is not used to pick them. Counts reflect documented records in one dataset snapshot, which is incomplete, so this comparison is descriptive and does not show causes, impacts, or statistical significance.",
  },

  // Embed card and error page
  embedNote: (date: string) =>
    `Similar counties are the 40 closest in population and population density. Data as of ${date} from Compute Atlas (Edward Kubiak, CC BY 4.0) and the U.S. Census Bureau. Documented records only; not a count of all projects.`,
  seeFull: "See the full comparison",
  errorTitle: "Something went wrong",
  errorBody:
    "The page couldn’t finish loading. This can happen right after the site is updated. Reloading usually fixes it; your county is kept in the address.",
  reload: "Reload",
};

export type Messages = typeof en;
/** A translation: any subset of the English keys (nested groups are translated whole). */
export type Translation = Partial<Messages>;
