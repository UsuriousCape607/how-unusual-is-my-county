import type { Translation } from "./en";

/**
 * Azerbaijani, Latin alphabet. Written with AI; not checked by professional translators or native speakers. U.S.
 * counties are "qraflıq" (as in Azerbaijani reference works). Case suffixes follow vowel harmony, so none is attached
 * to an English county name: sentences use "ilə", "üçün" or a colon. Nouns after numbers stay singular.
 */
const azLatn: Translation = {
  siteTitle: "Qraflığım nə dərəcədə qeyri-adidir?",
  subtitle: "Sənədləşdirilmiş məlumat mərkəzi layihələrini ABŞ-ın hər yerindəki oxşar qraflıqlarla müqayisə edin.",
  methodologyLink: "Metodologiya və mənbələr",
  langNote: "Süni intellektlə tərcümə edilib; peşəkar tərcüməçilər və ya ana dili daşıyıcıları tərəfindən yoxlanılmayıb və səhvlər ola bilər. Qraflıq və yer adları ingiliscə göstərilir.",
  printUrl: (url) => `İnteraktiv versiya: ${url}`,
  loadErrorTitle: "Məlumat faylları yüklənmədi.",
  loadErrorHelp: "Yenidən cəhd etmək üçün səhifəni yeniləyin; saytı lokal işlədirsinizsə, əvvəlcə <code>python scripts/build_all.py</code> əmrini işə salın.",
  loadingCounties: (n) => `${n} qraflığın məlumatları yüklənir…`,
  loading: "Yüklənir…",
  embedLoadError: "Bu müqayisə yüklənmədi.",
  comparing: (name) => `Müqayisə: <b>${name}</b>`,
  examplesAria: "Nümunə qraflıqlar",
  tryLabel: "Sınayın:",
  notFound: (code) => `${code} qraflıq kodu tapılmadı, buna görə nümunə qraflıq göstərilir.`,
  srShowing: (name, verdict) => `Göstərilir: ${name}. ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} Dəyişikliklər: ${transformations} Əhali, quru ərazi və qraflıq sərhədləri: ABŞ Siyahıyaalma Bürosu (ictimai mülkiyyət). Məlumat versiyası <code>${version}</code>.`,
  footerFallback: "Obyekt məlumatları: Compute Atlas, Edward Kubiak (CC BY 4.0). Qraflıq məlumatları: ABŞ Siyahıyaalma Bürosu.",
  methodologyEnglish: "Bu bölmə yalnız ingilis dilində mövcuddur.",

  language: "Dil",
  languageButton: (name) => `Dil: ${name}`,
  languagePanelNote:
    "Tərcümələr süni intellektlə hazırlanıb və peşəkar tərcüməçilər və ya ana dili daşıyıcıları tərəfindən yoxlanılmayıb, ona görə səhvlər ola bilər. Qraflıq və yer adları ingiliscədir, ona görə ingiliscə axtarın.",
  done: "Hazırdır",

  freshnessAria: "Məlumatların tarixi",
  dataAsOf: (date) => `Məlumatlar <b>${date}</b> tarixinə olan vəziyyətə görə`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Obyekt qeydləri Compute Atlas ${tag} buraxılışından götürülüb; həmin tarixdən sonra elan edilən və ya dəyişdirilən layihələr daxil deyil. Əhali: ${popDate} tarixinə siyahıyaalma təxminləri. Sərhədlər və ərazi: ${geoVintage} siyahıyaalma faylları. Saytın məlumatlarının sonuncu yenilənməsi: ${built}.`,
  stale: (days) =>
    `Bu buraxılış ${days} gündən köhnədir, ona görə daha yeni qeydlər ola bilər. Aktual siyahı <a>compute-atlas.com</a> saytındadır.`,

  findCounty: "Qraflıq axtarın",
  searchPlaceholder: "İngiliscə yazın, məs. Loudoun County, VA",
  matchingCounties: "Uyğun qraflıqlar",
  noCountyMatch: (q) =>
    `“${q}” sorğusuna uyğun qraflıq yoxdur. Qraflığın ingiliscə adını, “Ad, ST” formatını və ya 5 rəqəmli qraflıq kodunu sınayın.`,

  facts: (pop, density, geoid) => `${pop} nəfər · kv. mil üzrə ${density} nəfər · qraflıq kodu ${geoid}`,
  shortAnswer: "Qısaca",
  verdict: {
    moreAll: (total) => `${total} oxşar qraflığın hamısından çox sənədləşdirilmiş məlumat mərkəzi layihəsi`,
    lessAll: (total) => `${total} oxşar qraflığın hamısından az sənədləşdirilmiş məlumat mərkəzi layihəsi`,
    moreMost: "Oxşar qraflıqların əksəriyyətindən çox sənədləşdirilmiş məlumat mərkəzi layihəsi",
    lessMost: "Oxşar qraflıqların əksəriyyətindən az sənədləşdirilmiş məlumat mərkəzi layihəsi",
    sameZero: "Oxşar qraflıqların əksəriyyəti kimi, inkişaf mərhələsində sənədləşdirilmiş məlumat mərkəzi obyekti yoxdur",
    same: "Oxşar qraflıqların əksəriyyəti qədər sənədləşdirilmiş məlumat mərkəzi layihəsi",
    middle: "Oxşar qraflıqlar arasında ortada",
  },
  heroLabel: () => "inkişaf mərhələsində olan qeydə alınmış məlumat mərkəzi obyekti",
  heroAsOf: (date) => ` (${date} tarixinə)`,
  statusAria: "Buraxılışa görə bu obyektlərin vəziyyəti",
  statusLine: { under_construction: "tikilməkdə", permitted: "icazəli", proposed: "təklif edilmiş" },
  typicalSimilar: "Tipik oxşar qraflıq",
  similarWithAny: "Obyekti olan oxşar qraflıqlar",
  nOf: (n, total) => `${total} qraflıqdan ${n}`,
  averageSimilar: "Oxşar qraflıqlarda orta",
  typical: {
    none: "yoxdur",
    sites: (n) => `${n} obyekt`,
    range: (a, b) => `${a}–${b} obyekt`,
  },
  comparedWith: (total) => `Ən oxşar ${total} qraflıqla müqayisə`,
  cmp: {
    fewer: (n) => `<b>${n}</b> qraflıqda az`,
    same: (n) => `<b>${n}</b> qraflıqda eyni`,
    more: (n) => `<b>${n}</b> qraflıqda çox`,
  },
  barAria: (total, fewer, name, same, more) =>
    `${total} oxşar qraflıqdan ${fewer} qraflıqda qeydə alınmış obyekt ${name} ilə müqayisədə azdır, ${same} qraflıqda eynidir, ${more} qraflıqda çoxdur.`,
  zeroNote:
    "Seçilmiş məlumat buraxılışında bu qraflıq üçün uyğun layihə qeydi tapılmadı. Bu, burada məlumat mərkəzi planlaşdırılmadığı demək deyil; sadəcə bu mənbədə qeyd yoxdur.",
  similarLine: "“Oxşar” ABŞ-ın istənilən yerində əhali sayı və əhali sıxlığına görə ən yaxın qraflıqlar deməkdir. Ən oxşarları: <list/>.",
  operatingNote: (n) => `Bundan əlavə, burada fəaliyyətdə olan ${n} məlumat mərkəzi qeydə alınıb (yuxarıdakı saya daxil deyil).`,
  stateLine: (state, withSites, counties) =>
    `${state} ştatındakı ${counties} qraflıqdan ${withSites} qraflıqda inkişaf mərhələsində ən azı bir qeydə alınmış obyekt var.`,
  findLink: "Konkret layihə haqqında eşitmisiniz? Sayılıb-sayılmadığını yoxlayın",

  share: "Paylaş",
  shareOptions: "Paylaşma seçimləri",
  copyLink: "Keçidi kopyala",
  printSummary: "Xülasəni çap et",
  downloadSimilar: "Oxşar qraflıqları endir (CSV)",
  downloadSites: "İnkişaf mərhələsindəki obyektləri endir (CSV)",
  embedAction: "Vebsayta yerləşdir…",
  linkCopied: "Keçid kopyalandı",
  copyFailed: "Burada kopyalamaq mümkün deyil; mətni seçib özünüz kopyalayın",
  downloadStarted: "Endirmə başladı",
  embedTitle: "Bu müqayisəni yerləşdir",
  embedHelp: (name) =>
    `Bunu səhifənizə yapışdırın. ${name} üçün müqayisəni məlumat tarixi və mənbə qeydi ilə göstərir və saytın tam versiyasına keçid verir.`,
  embedCodeLabel: "Yerləşdirmə kodu",
  copyCode: "Kodu kopyala",
  embedCopied: "Yerləşdirmə kodu kopyalandı",

  explainTitle: "Bu rəqəmlər nə deməkdir?",
  qCounted: "“İnkişaf mərhələsindəki obyekt” kimi nə sayılır?",
  aCounted:
    "İctimai tədqiqat siyahısı olan Compute Atlas-ın təsdiqlənmiş və ya mətbuatda xəbər verilmiş mənbələrlə <b>təklif edilmiş</b>, <b>icazəli</b> (təsdiq edilmiş) və ya <b>tikilməkdə olan</b> kimi göstərdiyi məlumat mərkəzi obyekti. Fəaliyyətdə olan məlumat mərkəzləri ayrıca sayılır və yalnız kontekst üçün göstərilir. Hər rəqəm sənədləşdirilmiş obyekt qeydlərinin sayıdır; bu, binaların yoxlanılmış sayı ilə eyni deyil.",
  qSimilar: "“Oxşar qraflıqlar” hansılardır?",
  aSimilar: (total, name) =>
    `Həm əhali sayı, həm də əhali sıxlığı (quru ərazinin hər kvadrat milinə düşən nəfər) baxımından ${name} ilə ən çox oxşar olan ${total} ABŞ qraflığı. Onları seçərkən məlumat mərkəzi fəaliyyəti nəzərə alınmır; buna görə də bu ölçüdə və sıxlıqda olan yerlər üçün nəyin adi olduğunu göstərirlər. Onlar istənilən ştatda ola bilər.`,
  qRead: "“Az, eyni, çox” necə oxunur?",
  aRead: (name, fewer, same, more, total) =>
    `Hər oxşar qraflıq ${name} ilə müqayisə edilir: ${fewer} qraflıqda qeydə alınmış obyekt azdır, ${same} qraflıqda eynidir, ${more} qraflıqda çoxdur. “Əksəriyyət” yarıdan çox, yəni ${total} qraflıqdan ən azı 21 deməkdir. Tipik oxşar qraflıq bütün ${total} qraflıq saylarına görə düzüldükdə ortada qalandır (median).`,
  qZero: "Sıfır nə deməkdir?",
  aZero:
    "Bu məlumat buraxılışında uyğun qeyd tapılmadığını göstərir. Heç bir məlumat mərkəzinin planlaşdırılmadığı demək deyil: siyahı natamamdır və daha yaxşı sənədləşdirilmiş yerlərdə daha çox qeyd görünə bilər.",
  qJudge: "Bu, buradakı inkişafın yaxşı, pis və ya ehtimal olunan olduğunu göstərirmi?",
  aJudge:
    "Xeyr. Alət yalnız sənədləşdirilmiş qeydləri sayır və oxşar yerlərlə müqayisə edir. Ekoloji və ya iqtisadi təsirləri ölçmür, qraflıqda niyə daha çox və ya az qeyd olduğunu izah etmir və gələcək layihələri proqnozlaşdırmır.",
  qCurrent: "Bu məlumatlar nə qədər aktualdır?",
  aCurrent: (snapshot, popDate) =>
    `Qeydlər ${snapshot} tarixli Compute Atlas buraxılışından götürülüb; sonradan elan edilən və ya dəyişdirilən layihələr daxil deyil. Sayt hər həftə daha yeni buraxılışın olub-olmadığını yoxlayır. Əhali rəqəmləri ${popDate} tarixinə siyahıyaalma təxminləridir.`,
  fullMethodology: "Tam metodologiya və mənbələr",

  mapTitle: "Xəritə",
  mapViewAria: "Xəritə görünüşü",
  mapAria: "Qraflıq xəritəsi. Müqayisə etmək üçün qraflıq seçin.",
  view: { county: "Bu qraflıq", similar: "Oxşar qraflıqlar", shaded: "Bütün qraflıqlar" },
  thisCounty: "Bu qraflıq",
  sitesInDev: (n) => `İnkişaf mərhələsində ${n} obyekt`,
  hoverSimilar: {
    fewer: (name) => `Oxşar qraflıq · ${name} ilə müqayisədə az`,
    same: (name) => `Oxşar qraflıq · ${name} ilə eyni`,
    more: (name) => `Oxşar qraflıq · ${name} ilə müqayisədə çox`,
  },
  clickToCompare: "Müqayisə üçün klikləyin",
  exactLocation: "Dəqiq yer",
  approxLocation: "Təxmini yer, faktiki obyekt deyil",
  approxArea: (n) => `Bu təxmini ərazidə ${n} obyekt`,
  andMore: (n) => `və daha ${n}`,
  approxLocations: "Təxmini yerlər, faktiki obyektlər deyil",
  legendSimilarWith: "Oxşar qraflıqlar:",
  legend: {
    fewer: (n) => `az (${n})`,
    same: (n) => `eyni (${n})`,
    more: (n) => `çox (${n})`,
  },
  legendSites: "İnkişaf mərhələsindəki obyektlər",
  legendThisCounty: "bu qraflıq",
  legendExact: (n) => `Dəqiq yer (${n})`,
  legendApprox: (n) => `Təxmini ərazi (${n})`,
  zoomHint: "Obyektlərin yerini görmək üçün yaxınlaşdırın.",
  offMap: (list) => `Bu görünüşdən kənarda qalan digər oxşar qraflıqlar: ${list}.`,

  chartTitle: (name) => `${name}: 40 oxşar qraflıq arasında yeri`,
  chartHelp: (date, name) =>
    `Hər nöqtə bir oxşar qraflıqdır; inkişaf mərhələsindəki qeydə alınmış obyektlərin sayına (${date}) görə yerləşdirilir və ${name} ilə müqayisədə az, eyni və ya çox olmasına görə rənglənir. Təfərrüat üçün üzərinə gətirin; müqayisə üçün klikləyin.`,
  chartAria: (label, n, fewer, same, more) =>
    `Nöqtə diaqramı: ${label} üçün ${n}; oxşar qraflıqlardan ${fewer} qraflıqda az, ${same} qraflıqda eyni, ${more} qraflıqda çox.`,
  axisLabel: "İnkişaf mərhələsindəki qeydə alınmış məlumat mərkəzi obyektləri",
  typicalMark: (phrase) => `Tipik: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} nəfər · kv. mil üzrə ${density} nəfər`,
  clickToCompareCounty: "Bu qraflığı müqayisə etmək üçün klikləyin",

  recordsTitle: (name, n) => `${name}: inkişaf mərhələsindəki qeydə alınmış obyektlər (${n})`,
  recordsHelp: (date) =>
    `${date} tarixli Compute Atlas buraxılışında sənədləşdirilmiş təklif edilmiş, icazəli və ya tikilməkdə olan məlumat mərkəzi obyektləri, ilkin mənbələrə keçidlərlə. Qeydin “Son yenilənmə” tarixi mənbə məlumatının sonuncu dəfə nə vaxt düzəldildiyini göstərir.`,
  noRecords: "Seçilmiş məlumat buraxılışında bu qraflıq üçün uyğun layihə qeydi tapılmadı.",
  operatingSummary: (n) => `Fəaliyyətdə olan ${n} məlumat mərkəzi (yalnız kontekst, yuxarıdakı saya daxil deyil)`,
  reportFoot: "Obyekt çatışmır və ya səhv görürsünüz? Bu saytın mənbəyi olan <a>Compute Atlas-a bildirin</a>.",
  field: {
    operator: "Operator",
    status: "Vəziyyət",
    confidence: "Etibarlılıq",
    location: "Yer",
    assignment: "Qraflığa aid edilmə",
    updated: "Son yenilənmə",
  },
  recordId: (id) => `Compute Atlas qeydi: ${id}`,
  confidence: { confirmed: "təsdiqlənmiş", reported: "mətbuatda xəbər verilmiş", rumored: "şayiə" },
  status: {
    proposed: "Təklif edilmiş",
    permitted: "İcazəli",
    under_construction: "Tikilməkdə",
    operational: "Fəaliyyətdə",
    cancelled: "Ləğv edilmiş",
  },
  precision: { exact: "Dəqiq koordinatlar", approximate: "Təxmini yer" },
  assignment: {
    spatial_join: "Qraflıq xəritə koordinatlarına görə",
    spatial_nearest_name_confirmed: "Qraflıq koordinatlara görə (sahil xətti), ad təsdiqlənib",
    source_name_match: "Qraflıq mənbədə göstərilən ada görə",
  },
  reasons: {
    "status:operational": "Artıq fəaliyyətdədir (kontekst kimi ayrıca göstərilir)",
    "status:cancelled": "Ləğv edilmiş",
    "facility_type:power_generation": "Enerji istehsalı layihəsi, məlumat mərkəzi deyil",
    "facility_type:crypto_mining": "Kriptovalyuta hasilatı obyekti, məlumat mərkəzi deyil",
    "confidence:rumored": "Yalnız şayiə (aşağı etibarlılıq)",
    "assignment:outside_geographic_scope": "50 ştat və Kolumbiya dairəsindən kənarda",
    "assignment:unresolved_multi_site": "Vahid qraflığı olmayan bir neçə obyekti əhatə edir",
    "assignment:approximate_without_source_county": "Qraflıq adı göstərilməmiş təxmini yer",
    "assignment:ambiguous_source_county_name": "Göstərilən qraflıq adı birdən çox qraflığa uyğun gəlir",
    "assignment:unrecognized_source_county_name": "Göstərilən qraflıq adı 2025-ci il siyahıyaalmasındakı qraflıq deyil",
    "assignment:conflict_point_county_vs_source_county": "Xəritədəki yer ilə göstərilən qraflıq uyğun gəlmir",
    "assignment:conflict_point_state_vs_source_state": "Xəritədəki yer ilə göstərilən ştat uyğun gəlmir",
    "assignment:point_outside_county_polygons": "Xəritədəki yer heç bir qraflığın daxilində deyil",
    "assignment:point_on_county_boundary_ambiguous": "Düz qraflıq sərhədinin üzərindədir",
  },

  findTitle: "Layihə axtarın",
  findHelp:
    "Konkret layihə haqqında eşitmisiniz? Sayılıb-sayılmadığını, sayılmırsa səbəbini görmək üçün buraxılışdakı bütün qeydlərdə ad, şirkət və ya yerə görə axtarış edin.",
  findLabel: "Layihələrdə axtar",
  findPlaceholder: "məs. Meta, Project Mica, Abilene",
  findLoading: "2000-dən çox layihə qeydi yüklənir…",
  findError: "Layihə siyahısı yüklənmədi. Bağlantınızı yoxlayıb yenidən cəhd edin.",
  findNone: (q) => `“${q}” sorğusuna uyğun layihə yoxdur. Compute Atlas onu hələ siyahıya salmamış ola bilər; <a>Compute Atlas-a bildirə bilərsiniz</a>.`,
  source: "Mənbə",
  projectType: { data_center: "Məlumat mərkəzi", crypto_mining: "Kriptovalyuta hasilatı", power_generation: "Enerji istehsalı" },
  countedHere: "Burada sayılır",
  countedHereNote: "Bu qraflığın sayına daxildir.",
  counted: "Sayılır",
  countedIn: (where) => `Sayıldığı yer: ${where}.`,
  compareCounty: (name) => `Müqayisə et: ${name}`,
  operating: "Fəaliyyətdə",
  operatingContext: (where) => (where ? `Kontekst kimi göstərilir (${where}), saya daxil deyil.` : "Kontekst kimi göstərilir, saya daxil deyil."),
  notCounted: "Sayılmır",
  findFoot: "Çatışmayan və ya səhv layihə bilirsiniz? Bu saytın mənbəyi olan <a>Compute Atlas-a bildirin</a>.",

  peersTitle: "40 oxşar qraflıq (ən oxşardan başlayaraq)",
  peersRange: (p0, p1, d0, d1) =>
    `Əhali sayı ${p0} ilə ${p1} arasında, sıxlıq isə kv. mil üzrə ${d0} ilə ${d1} nəfər arasındadır. Həmin qraflığı müqayisə etmək üçün ad seçin.`,
  col: {
    rank: "Sıra",
    county: "Qraflıq",
    state: "Ştat",
    population: "Əhali (2025)",
    density: "Kv. mil üzrə nəfər",
    sites: (date) => `İnkişaf mərhələsindəki obyektlər (${date})`,
  },
  showFewer: (n) => `Yalnız ən oxşar ${n} qraflığı göstər`,
  showAll: (n) => `Bütün ${n} oxşar qraflığı göstər`,

  summaryTitle: "Xülasə",
  aiChip: "Süni intellektin yazdığı izah · əvvəlcədən hazırlanıb və yoxlanılıb",
  aiEnglishOnly: "Bu izah yalnız ingilis dilində mövcuddur.",
  aiNote: (model, date, status) =>
    `${model} tərəfindən bu qraflığın ${date} tarixli buraxılışdakı rəqəmləri əsasında bir dəfə yazılıb, sonra hər rəqəm ayrıca yoxlanılıb (${status}). Canlı yaradılmır. Sorğu, giriş məlumatları və yoxlamalar AI_EVALUATION.md faylındadır.`,
  templateChip: "Avtomatik xülasə · hesablanmış rəqəmlərdən sabit şablon (süni intellekt yazmayıb)",
  aiExamples: "Süni intellektin yazdığı nümunələr:",
  sum: {
    zero1: (name, date) => `Seçilmiş məlumat buraxılışında (${date}) ${name} üçün uyğun layihə qeydi tapılmadı.`,
    zero2: (same, total, more, typical, median, mean) =>
      `Sayı (sıfır) ${total} oxşar qraflıqdan ${same} qraflıqla eynidir və ${more} qraflıqdan azdır. Tipik oxşar qraflıq: ${typical} (median ${median}; orta ${mean}).`,
    some1: (name, n, date) =>
      `${date} tarixli məlumat buraxılışında ${name} üçün ${n} uyğun, sənədləşdirilmiş məlumat mərkəzi layihə qeydi var (təklif edilmiş, icazəli və ya tikilməkdə olan).`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Bu, ${total} oxşar qraflıqdan ${fewer} qraflıqdan çox, ${same} qraflıqla eyni və ${more} qraflıqdan azdır. Tipik oxşar qraflıq: ${typical} (median ${median}; orta ${mean}).`,
    noPeers: (total) => `Bu buraxılışda ${total} oxşar qraflığın heç birində uyğun qeyd yoxdur.`,
    peers: (n, total, pct) => `${total} oxşar qraflıqdan ${n} qraflıqda (${pct}%) ən azı bir uyğun qeyd var.`,
    caveat:
      "Oxşar qraflıqlar əhali sayı və əhali sıxlığına görə ən yaxın olanlardır; onları seçərkən məlumat mərkəzi fəaliyyəti nəzərə alınmır. Rəqəmlər natamam olan tək bir məlumat buraxılışındakı sənədləşdirilmiş qeydləri əks etdirir; buna görə müqayisə təsviri xarakter daşıyır və səbəbləri, təsirləri və ya statistik əhəmiyyəti göstərmir.",
  },

  embedNote: (date) =>
    `Oxşar qraflıqlar əhali sayı və əhali sıxlığına görə ən yaxın 40 qraflıqdır. Məlumatlar ${date} tarixinə Compute Atlas (Edward Kubiak, CC BY 4.0) və ABŞ Siyahıyaalma Bürosundan götürülüb. Yalnız sənədləşdirilmiş qeydlər; bütün layihələrin sayı deyil.`,
  seeFull: "Tam müqayisəyə baxın",
  errorTitle: "Xəta baş verdi",
  errorBody: "Səhifə tam yüklənmədi. Bu, sayt yeniləndikdən dərhal sonra baş verə bilər. Səhifəni yeniləmək adətən problemi həll edir; qraflığınız ünvanda saxlanılır.",
  reload: "Yenilə",
};

export default azLatn;
