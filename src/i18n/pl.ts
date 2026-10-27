import type { Translation } from "./en";

/**
 * Polish. Written with AI; review by a native speaker welcome. Plural forms come from Intl.PluralRules (one / few /
 * many); English county names are used without declension, as is usual for foreign proper names.
 */
const rule = new Intl.PluralRules("pl-PL");
const form = (n: number, one: string, few: string, many: string) => {
  const c = rule.select(n);
  return c === "one" ? one : c === "few" ? few : many;
};
const lokalizacja = (n: number) => form(n, "lokalizacja", "lokalizacje", "lokalizacji");
/** "ma" / "mają": the verb agrees with the number in front of it (1 ma, 2–4 mają, 5+ ma). */
const ma = (n: number) => form(n, "ma", "mają", "ma");
const centrum = (n: number) => form(n, "działające centrum danych", "działające centra danych", "działających centrów danych");

const pl: Translation = {
  siteTitle: "Jak nietypowe jest moje hrabstwo?",
  subtitle: "Porównaj udokumentowane inwestycje w centra danych z podobnymi hrabstwami w całych Stanach Zjednoczonych.",
  methodologyLink: "Metodologia i źródła",
  langNote: "Przetłumaczono przy pomocy AI, bez weryfikacji przez profesjonalnych tłumaczy ani rodzimych użytkowników języka; mogą występować błędy. Nazwy hrabstw i miejsc podajemy po angielsku.",
  printUrl: (url) => `Wersja interaktywna: ${url}`,
  loadErrorTitle: "Nie udało się wczytać plików z danymi.",
  loadErrorHelp: "Odśwież stronę, aby spróbować ponownie; jeśli uruchamiasz stronę lokalnie, najpierw uruchom <code>python scripts/build_all.py</code>.",
  loadingCounties: (n) => `Wczytywanie danych dla ${n} hrabstw…`,
  loading: "Wczytywanie…",
  embedLoadError: "Nie udało się wczytać tego porównania.",
  comparing: (name) => `Porównanie: <b>${name}</b>`,
  examplesAria: "Przykładowe hrabstwa",
  tryLabel: "Wypróbuj:",
  notFound: (code) => `Nie znaleziono hrabstwa o kodzie ${code}, więc pokazujemy przykładowe hrabstwo.`,
  srShowing: (name, verdict) => `Wyświetlane: ${name}. ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>licencja</a>). Przekształcenia: ${transformations} Ludność, powierzchnia lądowa i granice hrabstw: Biuro Spisu Ludności USA (domena publiczna). Wersja danych <code>${version}</code>.`,
  footerFallback: "Dane o obiektach: Compute Atlas, autor Edward Kubiak (CC BY 4.0). Dane o hrabstwach: Biuro Spisu Ludności USA.",
  methodologyEnglish: "Ta sekcja jest dostępna tylko po angielsku.",

  language: "Język",
  languageButton: (name) => `Język: ${name}`,
  languagePanelNote:
    "Tłumaczenia przygotowano przy pomocy AI i nie sprawdzili ich profesjonalni tłumacze ani rodzimi użytkownicy języka, więc mogą zawierać błędy. Nazwy hrabstw i miejsc są po angielsku, więc wyszukuj po angielsku.",
  done: "Gotowe",

  freshnessAria: "Z kiedy pochodzą te dane",
  dataAsOf: (date) => `Dane na dzień <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Dane o obiektach pochodzą z migawki Compute Atlas ${tag}; nie obejmują projektów ogłoszonych lub zmienionych po tej dacie. Ludność: szacunki spisowe na dzień ${popDate}. Granice i powierzchnia: pliki spisowe z ${geoVintage} r. Dane strony ostatnio odświeżono ${built}.`,
  stale: (days) => `Ta migawka ma ponad ${days} dni, więc mogą istnieć nowsze wpisy. Aktualny wykaz jest dostępny na <a>compute-atlas.com</a>.`,

  findCounty: "Znajdź hrabstwo",
  searchPlaceholder: "Po angielsku, np. Loudoun County, VA",
  matchingCounties: "Pasujące hrabstwa",
  noCountyMatch: (q) => `Żadne hrabstwo nie pasuje do „${q}”. Spróbuj angielskiej nazwy hrabstwa, formatu „Nazwa, ST” lub 5-cyfrowego kodu hrabstwa.`,

  facts: (pop, density, geoid) => `${pop} mieszkańców · ${density} na mi² · kod hrabstwa ${geoid}`,
  shortAnswer: "Krótka odpowiedź",
  verdict: {
    moreAll: (total) => `Więcej udokumentowanych inwestycji w centra danych niż we wszystkich ${total} podobnych hrabstwach`,
    lessAll: (total) => `Mniej udokumentowanych inwestycji w centra danych niż we wszystkich ${total} podobnych hrabstwach`,
    moreMost: "Więcej udokumentowanych inwestycji w centra danych niż w większości podobnych hrabstw",
    lessMost: "Mniej udokumentowanych inwestycji w centra danych niż w większości podobnych hrabstw",
    sameZero: "Jak w większości podobnych hrabstw – brak udokumentowanych lokalizacji centrów danych w fazie rozwoju",
    same: "Tyle samo udokumentowanych inwestycji w centra danych co w większości podobnych hrabstw",
    middle: "Pośrodku stawki wśród podobnych hrabstw",
  },
  heroLabel: (n) => `${lokalizacja(n)} centrów danych w fazie rozwoju (w rejestrze)`,
  heroAsOf: (date) => ` na dzień ${date}`,
  statusAria: "Status tych lokalizacji według migawki",
  statusLine: { under_construction: "w budowie", permitted: "z pozwoleniem", proposed: "proponowane" },
  typicalSimilar: "Typowe podobne hrabstwo",
  similarWithAny: "Podobne hrabstwa z co najmniej jedną",
  nOf: (n, total) => `${n} z ${total}`,
  averageSimilar: "Średnia wśród podobnych",
  typical: {
    none: "brak",
    sites: (n) => `${n} ${lokalizacja(n)}`,
    range: (a, b) => `od ${a} do ${b} lokalizacji`,
  },
  comparedWith: (total) => `Na tle ${total} najbardziej podobnych hrabstw`,
  cmp: {
    fewer: (n) => `mniej: <b>${n}</b>`,
    same: (n) => `tyle samo: <b>${n}</b>`,
    more: (n) => `więcej: <b>${n}</b>`,
  },
  barAria: (total, fewer, name, same, more) =>
    `Spośród ${total} podobnych hrabstw ${fewer} ${ma(fewer)} mniej zarejestrowanych lokalizacji niż ${name}, ${same} tyle samo, a ${more} więcej.`,
  zeroNote:
    "W wybranej migawce danych nie znaleziono kwalifikujących się wpisów o projektach w tym hrabstwie. Nie oznacza to, że nie planuje się tu centrów danych – jedynie, że to źródło żadnego nie dokumentuje.",
  similarLine: "„Podobne” to najbliższe pod względem liczby ludności i gęstości zaludnienia, w dowolnym miejscu USA. Najbardziej podobne to <list/>.",
  operatingNote: (n) => `Osobno w rejestrze ${form(n, "figuruje", "figurują", "figuruje")} tu ${n} ${centrum(n)} (nieuwzględnione powyżej).`,
  stateLine: (state, withSites, counties) =>
    `W stanie ${state} ${withSites} z ${counties} ${counties === 1 ? "hrabstwa" : "hrabstw"} ${ma(withSites)} co najmniej jedną zarejestrowaną lokalizację w fazie rozwoju.`,
  findLink: "Słyszałeś o konkretnym projekcie? Sprawdź, czy jest uwzględniony",

  share: "Udostępnij",
  shareOptions: "Opcje udostępniania",
  copyLink: "Kopiuj link",
  printSummary: "Drukuj podsumowanie",
  downloadSimilar: "Pobierz podobne hrabstwa (CSV)",
  downloadSites: "Pobierz lokalizacje w fazie rozwoju (CSV)",
  embedAction: "Osadź na stronie…",
  linkCopied: "Skopiowano link",
  copyFailed: "Tutaj nie można kopiować; zaznacz tekst i skopiuj go ręcznie",
  downloadStarted: "Rozpoczęto pobieranie",
  embedTitle: "Osadź to porównanie",
  embedHelp: (name) =>
    `Wklej to na swojej stronie. Pokazuje porównanie dla ${name} wraz z datą danych i informacją o źródle oraz linkiem do pełnej strony.`,
  embedCodeLabel: "Kod do osadzenia",
  copyCode: "Kopiuj kod",
  embedCopied: "Skopiowano kod",

  explainTitle: "Co oznaczają te liczby?",
  qCounted: "Co liczy się jako „lokalizacja w fazie rozwoju”?",
  aCounted:
    "Lokalizacja centrum danych, którą publiczny rejestr badawczy Compute Atlas oznacza jako <b>proponowaną</b>, <b>z pozwoleniem</b> (zatwierdzoną) lub <b>w budowie</b>, z potwierdzonymi lub opisanymi w mediach źródłami. Działające centra danych liczymy osobno i pokazujemy tylko jako kontekst. Każda liczba to liczba udokumentowanych wpisów o lokalizacjach, co nie jest tym samym co zweryfikowana liczba budynków.",
  qSimilar: "Które hrabstwa są „podobne”?",
  aSimilar: (total, name) =>
    `${total} hrabstw w USA najbliższych hrabstwu ${name} zarówno pod względem liczby ludności, jak i gęstości zaludnienia (osób na milę kwadratową lądu). Działalność związana z centrami danych nie wpływa na ich wybór, więc pokazują, co jest typowe dla miejsc tej wielkości i gęstości. Mogą leżeć w dowolnym stanie.`,
  qRead: "Jak czytać „mniej, tyle samo, więcej”?",
  aRead: (name, fewer, same, more, total) =>
    `Każde podobne hrabstwo porównujemy z ${name}: ${fewer} ${ma(fewer)} mniej zarejestrowanych lokalizacji, ${same} tyle samo, a ${more} więcej. „Większość” oznacza ponad połowę, czyli co najmniej 21 z ${total}. Typowe podobne hrabstwo to środkowe, gdy wszystkie ${total} ustawimy według liczby wpisów (mediana).`,
  qZero: "Co oznacza zero?",
  aZero:
    "Że w tej migawce danych nie znaleziono kwalifikującego się wpisu. Nie oznacza to, że nie planuje się żadnego centrum danych: rejestr jest niekompletny, a lepiej udokumentowane miejsca mogą mieć więcej wpisów.",
  qJudge: "Czy to mówi, czy inwestycje tutaj są dobre, złe albo prawdopodobne?",
  aJudge:
    "Nie. Narzędzie jedynie liczy udokumentowane wpisy i porównuje je z podobnymi miejscami. Nie mierzy skutków środowiskowych ani gospodarczych, nie wyjaśnia, dlaczego hrabstwo ma więcej lub mniej wpisów, i nie przewiduje przyszłych projektów.",
  qCurrent: "Jak aktualne są te dane?",
  aCurrent: (snapshot, popDate) =>
    `Wpisy pochodzą z migawki Compute Atlas z dnia ${snapshot}; projekty ogłoszone lub zmienione później nie są uwzględnione. Strona co tydzień sprawdza, czy jest nowsza migawka. Dane o ludności to szacunki spisowe na dzień ${popDate}.`,
  fullMethodology: "Pełna metodologia i źródła",

  mapTitle: "Mapa",
  mapViewAria: "Widok mapy",
  mapAria: "Mapa hrabstw. Wybierz hrabstwo, aby je porównać.",
  view: { county: "To hrabstwo", similar: "Podobne hrabstwa", shaded: "Wszystkie hrabstwa" },
  thisCounty: "To hrabstwo",
  sitesInDev: (n) => `${n} ${lokalizacja(n)} w fazie rozwoju`,
  hoverSimilar: {
    fewer: (name) => `Podobne hrabstwo · mniej niż ${name}`,
    same: (name) => `Podobne hrabstwo · tyle samo co ${name}`,
    more: (name) => `Podobne hrabstwo · więcej niż ${name}`,
  },
  clickToCompare: "Kliknij, aby porównać",
  exactLocation: "Dokładna lokalizacja",
  approxLocation: "Przybliżona lokalizacja, nie rzeczywiste miejsce",
  approxArea: (n) => `${n} ${lokalizacja(n)} w tym przybliżonym obszarze`,
  andMore: (n) => `i ${n} więcej`,
  approxLocations: "Przybliżone lokalizacje, nie rzeczywiste miejsca",
  legendSimilarWith: "Podobne hrabstwa:",
  legend: {
    fewer: (n) => `mniej (${n})`,
    same: (n) => `tyle samo (${n})`,
    more: (n) => `więcej (${n})`,
  },
  legendSites: "Lokalizacje w fazie rozwoju",
  legendThisCounty: "to hrabstwo",
  legendExact: (n) => `Dokładna lokalizacja (${n})`,
  legendApprox: (n) => `Przybliżony obszar (${n})`,
  zoomHint: "Przybliż, aby zobaczyć, gdzie są lokalizacje.",
  offMap: (list) => `Również podobne, poza tym widokiem: ${list}.`,

  chartTitle: (name) => `Gdzie plasuje się ${name} wśród 40 podobnych hrabstw`,
  chartHelp: (date, name) =>
    `Każda kropka to jedno podobne hrabstwo, umieszczone według liczby zarejestrowanych lokalizacji w fazie rozwoju (${date}) i pokolorowane według tego, czy ma ich mniej, tyle samo, czy więcej niż ${name}. Najedź kursorem, aby zobaczyć szczegóły; kliknij, aby porównać.`,
  chartAria: (label, n, fewer, same, more) =>
    `Wykres punktowy: ${label} ma ${n}; spośród podobnych hrabstw ${fewer} ${ma(fewer)} mniej, ${same} tyle samo, a ${more} więcej.`,
  axisLabel: "Zarejestrowane lokalizacje centrów danych w fazie rozwoju",
  typicalMark: (phrase) => `Typowo: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} mieszkańców · ${density} na mi²`,
  clickToCompareCounty: "Kliknij, aby porównać to hrabstwo",

  recordsTitle: (name, n) => `Zarejestrowane lokalizacje w fazie rozwoju: ${name} (${n})`,
  recordsHelp: (date) =>
    `Proponowane, zatwierdzone lub budowane lokalizacje centrów danych udokumentowane w migawce Compute Atlas z dnia ${date}, z linkami do oryginalnych źródeł. Data „Ostatnia aktualizacja” wpisu pokazuje, kiedy ostatnio zmieniono informacje w jego źródle.`,
  noRecords: "W wybranej migawce danych nie znaleziono kwalifikujących się wpisów o projektach w tym hrabstwie.",
  operatingSummary: (n) => `${n} ${centrum(n)} (tylko kontekst, nieuwzględnione powyżej)`,
  reportFoot: "Brakuje lokalizacji albo widzisz błąd? <a>Zgłoś to do Compute Atlas</a>, źródła, z którego korzysta ta strona.",
  field: {
    operator: "Operator",
    status: "Status",
    confidence: "Wiarygodność",
    location: "Lokalizacja",
    assignment: "Przypisanie do hrabstwa",
    updated: "Ostatnia aktualizacja",
  },
  recordId: (id) => `Wpis Compute Atlas: ${id}`,
  confidence: { confirmed: "potwierdzone", reported: "opisane w mediach", rumored: "plotka" },
  status: {
    proposed: "Proponowany",
    permitted: "Z pozwoleniem",
    under_construction: "W budowie",
    operational: "Działający",
    cancelled: "Anulowany",
  },
  precision: { exact: "Dokładne współrzędne", approximate: "Przybliżona lokalizacja" },
  assignment: {
    spatial_join: "Hrabstwo według współrzędnych na mapie",
    spatial_nearest_name_confirmed: "Hrabstwo według współrzędnych (linia brzegowa), nazwa potwierdzona",
    source_name_match: "Hrabstwo według nazwy podanej w źródle",
  },
  reasons: {
    "status:operational": "Już działa (pokazane osobno jako kontekst)",
    "status:cancelled": "Anulowany",
    "facility_type:power_generation": "Projekt wytwarzania energii, nie centrum danych",
    "facility_type:crypto_mining": "Kopalnia kryptowalut, nie centrum danych",
    "confidence:rumored": "Tylko plotka (niska wiarygodność)",
    "assignment:outside_geographic_scope": "Poza 50 stanami i Dystryktem Kolumbii",
    "assignment:unresolved_multi_site": "Obejmuje kilka lokalizacji bez jednego hrabstwa",
    "assignment:approximate_without_source_county": "Przybliżona lokalizacja bez podanego hrabstwa",
    "assignment:ambiguous_source_county_name": "Podana nazwa pasuje do więcej niż jednego hrabstwa",
    "assignment:unrecognized_source_county_name": "Podana nazwa nie jest hrabstwem ze spisu z 2025 r.",
    "assignment:conflict_point_county_vs_source_county": "Położenie na mapie i podane hrabstwo się nie zgadzają",
    "assignment:conflict_point_state_vs_source_state": "Położenie na mapie i podany stan się nie zgadzają",
    "assignment:point_outside_county_polygons": "Położenie na mapie wypada poza wszystkimi hrabstwami",
    "assignment:point_on_county_boundary_ambiguous": "Leży dokładnie na granicy hrabstw",
  },

  findTitle: "Znajdź projekt",
  findHelp:
    "Słyszałeś o konkretnym projekcie? Przeszukaj wszystkie wpisy w migawce według nazwy, firmy lub miejsca, aby sprawdzić, czy jest uwzględniony, a jeśli nie – dlaczego.",
  findLabel: "Szukaj projektów",
  findPlaceholder: "np. Meta, Project Mica, Abilene",
  findLoading: "Wczytywanie ponad 2000 wpisów o projektach…",
  findError: "Nie udało się wczytać listy projektów. Sprawdź połączenie i spróbuj ponownie.",
  findNone: (q) => `Żaden projekt nie pasuje do „${q}”. Compute Atlas może go jeszcze nie mieć; możesz <a>zgłosić go do Compute Atlas</a>.`,
  source: "Źródło",
  projectType: { data_center: "Centrum danych", crypto_mining: "Kopanie kryptowalut", power_generation: "Wytwarzanie energii" },
  countedHere: "Uwzględniony tutaj",
  countedHereNote: "Wliczony do liczby dla tego hrabstwa.",
  counted: "Uwzględniony",
  countedIn: (where) => `Hrabstwo: ${where}.`,
  compareCounty: (name) => `Porównaj: ${name}`,
  operating: "Działający",
  operatingContext: (where) => (where ? `Pokazany jako kontekst (${where}), nie wliczony.` : "Pokazany jako kontekst, nie wliczony."),
  notCounted: "Nieuwzględniony",
  findFoot: "Znasz projekt, którego brakuje lub który jest błędnie opisany? <a>Zgłoś go do Compute Atlas</a>, źródła, z którego korzysta ta strona.",

  peersTitle: "40 podobnych hrabstw, od najbardziej podobnego",
  peersRange: (p0, p1, d0, d1) =>
    `Mają od ${p0} do ${p1} mieszkańców i od ${d0} do ${d1} mieszkańców na mi². Wybierz nazwę, aby porównać to hrabstwo.`,
  col: {
    rank: "Miejsce",
    county: "Hrabstwo",
    state: "Stan",
    population: "Ludność (2025)",
    density: "Mieszkańców na mi²",
    sites: (date) => `Lokalizacje w fazie rozwoju (${date})`,
  },
  showFewer: (n) => `Pokaż tylko ${n} najbardziej podobnych`,
  showAll: (n) => `Pokaż wszystkie podobne hrabstwa (${n})`,

  summaryTitle: "Podsumowanie",
  aiChip: "Wyjaśnienie napisane przez AI · wygenerowane wcześniej i sprawdzone",
  aiEnglishOnly: "To wyjaśnienie jest dostępne tylko po angielsku.",
  aiNote: (model, date, status) =>
    `Napisane jednorazowo przez ${model} na podstawie danych tego hrabstwa z migawki z dnia ${date}, a następnie sprawdzone liczba po liczbie (${status}). Nie jest generowane na żywo. Prompt, dane wejściowe i kontrole są w pliku AI_EVALUATION.md.`,
  templateChip: "Automatyczne podsumowanie · stały szablon na podstawie obliczonych danych (nie napisane przez AI)",
  aiExamples: "Przykłady napisane przez AI:",
  sum: {
    zero1: (name, date) => `W wybranej migawce danych (${date}) nie znaleziono kwalifikujących się wpisów o projektach dla ${name}.`,
    zero2: (same, total, more, typical, median, mean) =>
      `Ma tyle samo wpisów (zero) co ${same} z ${total} podobnych hrabstw i mniej niż ${more}. Typowe podobne hrabstwo: ${typical} (mediana ${median}; średnia ${mean}).`,
    some1: (name, n, date) =>
      `${name}: ${n} ${form(n, "kwalifikujący się udokumentowany wpis", "kwalifikujące się udokumentowane wpisy", "kwalifikujących się udokumentowanych wpisów")} o projektach centrów danych (proponowanych, zatwierdzonych lub w budowie) w migawce danych z dnia ${date}.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `To więcej niż w ${fewer} z ${total} podobnych hrabstw, tyle samo co w ${same} i mniej niż w ${more}. Typowe podobne hrabstwo: ${typical} (mediana ${median}; średnia ${mean}).`,
    noPeers: (total) => `Żadne z ${total} podobnych hrabstw nie ma kwalifikującego się wpisu w tej migawce.`,
    peers: (n, total, pct) => `${n} z ${total} podobnych hrabstw (${pct}%) ${ma(n)} co najmniej jeden kwalifikujący się wpis.`,
    caveat:
      "Podobne hrabstwa to te najbliższe pod względem liczby ludności i gęstości zaludnienia; działalność związana z centrami danych nie wpływa na ich wybór. Liczby odzwierciedlają udokumentowane wpisy w jednej, niekompletnej migawce danych, więc porównanie ma charakter opisowy i nie pokazuje przyczyn, skutków ani istotności statystycznej.",
  },

  embedNote: (date) =>
    `Podobne hrabstwa to 40 najbliższych pod względem liczby ludności i gęstości zaludnienia. Dane na dzień ${date} z Compute Atlas (Edward Kubiak, CC BY 4.0) i Biura Spisu Ludności USA. Tylko udokumentowane wpisy; nie jest to liczba wszystkich projektów.`,
  seeFull: "Zobacz pełne porównanie",
  errorTitle: "Coś poszło nie tak",
  errorBody: "Nie udało się wczytać strony do końca. Może się to zdarzyć tuż po aktualizacji strony. Odświeżenie zwykle pomaga; Twoje hrabstwo pozostaje w adresie.",
  reload: "Odśwież",
};

export default pl;
