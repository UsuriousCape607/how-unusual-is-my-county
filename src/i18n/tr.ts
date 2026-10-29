import type { Translation } from "./en";

/**
 * Turkish. Written with AI; not checked by professional translators or native speakers. U.S. counties are "ilçe" (as
 * in Turkish news; "kontluk" is the alternative). Suffixes follow vowel harmony, so none is attached to an English
 * county name: sentences use separate words (ile, için) or a colon instead.
 */
const tr: Translation = {
  siteTitle: "İlçem ne kadar sıra dışı?",
  subtitle: "Belgelenmiş veri merkezi gelişimini ABD genelindeki benzer ilçelerle karşılaştırın.",
  methodologyLink: "Yöntem ve kaynaklar",
  langNote: "Yapay zekâyla çevrilmiştir; profesyonel çevirmenler veya ana dili Türkçe olan kişiler tarafından kontrol edilmemiştir ve hata içerebilir. İlçe ve yer adları İngilizce gösterilir.",
  printUrl: (url) => `Etkileşimli sürüm: ${url}`,
  loadErrorTitle: "Veri dosyaları yüklenemedi.",
  loadErrorHelp: "Yeniden denemek için sayfayı yenileyin; siteyi yerel olarak çalıştırıyorsanız önce <code>python scripts/build_all.py</code> komutunu çalıştırın.",
  loadingCounties: (n) => `${n} ilçenin verileri yükleniyor…`,
  loading: "Yükleniyor…",
  embedLoadError: "Bu karşılaştırma yüklenemedi.",
  comparing: (name) => `Karşılaştırılan: <b>${name}</b>`,
  examplesAria: "Örnek ilçeler",
  tryLabel: "Deneyin:",
  notFound: (code) => `${code} ilçe kodu bulunamadı; bu yüzden örnek bir ilçe gösteriliyor.`,
  srShowing: (name, verdict) => `Gösterilen: ${name}. ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} Dönüşümler: ${transformations} Nüfus, kara yüzölçümü ve ilçe sınırları: ABD Nüfus Sayım Bürosu (kamu malı). Veri sürümü <code>${version}</code>.`,
  footerFallback: "Tesis verileri: Compute Atlas, Edward Kubiak (CC BY 4.0). İlçe verileri: ABD Nüfus Sayım Bürosu.",
  methodologyEnglish: "Bu bölüm yalnızca İngilizce olarak sunulmaktadır.",

  language: "Dil",
  languageButton: (name) => `Dil: ${name}`,
  languagePanelNote:
    "Çeviriler yapay zekâyla yapılmıştır; profesyonel çevirmenler veya ana dili bu dillerden biri olan kişiler tarafından kontrol edilmemiştir ve hata içerebilir. İlçe ve yer adları İngilizcedir, bu yüzden İngilizce arayın.",
  done: "Bitti",

  freshnessAria: "Verilerin tarihi",
  dataAsOf: (date) => `Veriler <b>${date}</b> tarihi itibarıyla`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Tesis kayıtları Compute Atlas ${tag} anlık görüntüsünden alınmıştır; bu tarihten sonra duyurulan veya değiştirilen projeler dahil değildir. Nüfus: ${popDate} tarihli nüfus sayımı tahminleri. Sınırlar ve yüzölçümü: ${geoVintage} nüfus sayımı dosyaları. Site verilerinin son güncellenme tarihi: ${built}.`,
  stale: (days) =>
    `Bu anlık görüntü ${days} günden eski olduğu için daha yeni kayıtlar olabilir. Güncel envanter <a>compute-atlas.com</a> adresindedir.`,

  findCounty: "İlçe bulun",
  searchPlaceholder: "İngilizce yazın, ör. Loudoun County, VA",
  matchingCounties: "Eşleşen ilçeler",
  noCountyMatch: (q) => `“${q}” ile eşleşen ilçe yok. İngilizce ilçe adını, “Ad, ST” biçimini veya 5 haneli ilçe kodunu deneyin.`,

  facts: (pop, density, geoid) => `${pop} kişi · mil² başına ${density} kişi · ilçe kodu ${geoid}`,
  shortAnswer: "Kısaca",
  verdict: {
    moreAll: (total) => `${total} benzer ilçenin hepsinden daha fazla belgelenmiş veri merkezi gelişimi`,
    lessAll: (total) => `${total} benzer ilçenin hepsinden daha az belgelenmiş veri merkezi gelişimi`,
    moreMost: "Benzer ilçelerin çoğundan daha fazla belgelenmiş veri merkezi gelişimi",
    lessMost: "Benzer ilçelerin çoğundan daha az belgelenmiş veri merkezi gelişimi",
    sameZero: "Benzer ilçelerin çoğu gibi, geliştirme aşamasında belgelenmiş veri merkezi sahası yok",
    same: "Benzer ilçelerin çoğuyla aynı düzeyde belgelenmiş veri merkezi gelişimi",
    middle: "Benzer ilçeler arasında ortalarda",
  },
  heroLabel: () => "geliştirme aşamasında kayıtlı veri merkezi sahası",
  heroAsOf: (date) => ` (${date} itibarıyla)`,
  statusAria: "Anlık görüntüye göre bu sahaların durumu",
  statusLine: { under_construction: "inşa halinde", permitted: "izinli", proposed: "önerilen" },
  typicalSimilar: "Tipik benzer ilçe",
  similarWithAny: "Sahası olan benzer ilçeler",
  nOf: (n, total) => `${total} ilçeden ${n}`,
  averageSimilar: "Benzer ilçelerin ortalaması",
  typical: {
    none: "yok",
    sites: (n) => `${n} saha`,
    range: (a, b) => `${a}–${b} saha`,
  },
  comparedWith: (total) => `En benzer ${total} ilçeyle karşılaştırma`,
  cmp: {
    fewer: (n) => `<b>${n}</b> ilçede daha az`,
    same: (n) => `<b>${n}</b> ilçede aynı`,
    more: (n) => `<b>${n}</b> ilçede daha fazla`,
  },
  barAria: (total, fewer, name, same, more) =>
    `${total} benzer ilçenin ${fewer} tanesinde kayıtlı saha sayısı ${name} ile kıyasla daha az, ${same} tanesinde aynı, ${more} tanesinde daha fazla.`,
  zeroNote:
    "Seçilen veri anlık görüntüsünde bu ilçe için uygun proje kaydı bulunamadı. Bu, burada veri merkezi planlanmadığı anlamına gelmez; yalnızca bu kaynakta belgelenmiş bir kayıt olmadığını gösterir.",
  similarLine: "“Benzer”, ABD’nin herhangi bir yerinde nüfus ve nüfus yoğunluğu bakımından en yakın ilçeler demektir. En benzer olanlar: <list/>.",
  operatingNote: (n) => `Ayrıca burada faaliyette olan ${n} veri merkezi kayıtlı (yukarıdaki sayıya dahil değildir).`,
  stateLine: (state, withSites, counties) =>
    `${state} eyaletindeki ${counties} ilçenin ${withSites} tanesinde geliştirme aşamasında en az bir kayıtlı saha var.`,
  findLink: "Belirli bir projeyi mi duydunuz? Sayılıp sayılmadığına bakın",

  share: "Paylaş",
  shareOptions: "Paylaşım seçenekleri",
  copyLink: "Bağlantıyı kopyala",
  printSummary: "Özeti yazdır",
  downloadSimilar: "Benzer ilçeleri indir (CSV)",
  downloadSites: "Geliştirme aşamasındaki sahaları indir (CSV)",
  embedAction: "Bir web sitesine yerleştir…",
  linkCopied: "Bağlantı kopyalandı",
  copyFailed: "Burada kopyalama yapılamıyor; metni seçip kendiniz kopyalayın",
  downloadStarted: "İndirme başladı",
  embedTitle: "Bu karşılaştırmayı yerleştir",
  embedHelp: (name) =>
    `Bunu sayfanıza yapıştırın. ${name} için karşılaştırmayı veri tarihi ve kaynak bilgisiyle gösterir ve sitenin tamamına bağlantı verir.`,
  embedCodeLabel: "Yerleştirme kodu",
  copyCode: "Kodu kopyala",
  embedCopied: "Yerleştirme kodu kopyalandı",

  explainTitle: "Bu sayılar ne anlama geliyor?",
  qCounted: "“Geliştirme aşamasındaki saha” olarak ne sayılır?",
  aCounted:
    "Kamuya açık araştırma envanteri Compute Atlas’ın doğrulanmış veya basında yer almış kaynaklarla <b>önerilen</b>, <b>izinli</b> (onaylanmış) ya da <b>inşa halinde</b> olarak listelediği bir veri merkezi sahası. Faaliyetteki veri merkezleri ayrı sayılır ve yalnızca bağlam olarak gösterilir. Her sayı, belgelenmiş saha kayıtlarının sayısıdır; doğrulanmış bina sayısıyla aynı şey değildir.",
  qSimilar: "“Benzer ilçeler” hangileri?",
  aSimilar: (total, name) =>
    `Hem nüfus hem de nüfus yoğunluğu (kara alanının mil karesi başına kişi) bakımından ${name} ile en çok benzeşen ${total} ABD ilçesi. Seçimde veri merkezi faaliyeti kullanılmaz; bu yüzden bu büyüklük ve yoğunluktaki yerlerde neyin olağan olduğunu gösterirler. Herhangi bir eyalette olabilirler.`,
  qRead: "“Daha az, aynı, daha fazla” nasıl okunur?",
  aRead: (name, fewer, same, more, total) =>
    `Her benzer ilçe ${name} ile karşılaştırılır: ${fewer} ilçede kayıtlı saha daha az, ${same} ilçede aynı sayıda, ${more} ilçede daha fazladır. “Çoğu” yarıdan fazla, yani ${total} ilçeden en az 21’i demektir. Tipik benzer ilçe, ${total} ilçenin tamamı sayılarına göre sıralandığında ortada kalandır (medyan).`,
  qZero: "Sıfır ne anlama gelir?",
  aZero:
    "Bu veri anlık görüntüsünde uygun bir kayıt bulunamadığı anlamına gelir. Hiç veri merkezi planlanmadığı anlamına gelmez: envanter eksiktir ve daha iyi belgelenmiş yerlerde daha fazla kayıt görülebilir.",
  qJudge: "Bu, buradaki gelişimin iyi, kötü veya olası olup olmadığını söyler mi?",
  aJudge:
    "Hayır. Araç yalnızca belgelenmiş kayıtları sayar ve benzer yerlerle karşılaştırır. Çevresel veya ekonomik etkileri ölçmez, bir ilçede neden daha çok veya daha az kayıt olduğunu açıklamaz ve gelecekteki projeleri tahmin etmez.",
  qCurrent: "Bu veriler ne kadar güncel?",
  aCurrent: (snapshot, popDate) =>
    `Kayıtlar ${snapshot} tarihli Compute Atlas anlık görüntüsünden alınmıştır; sonradan duyurulan veya değiştirilen projeler dahil değildir. Site her hafta daha yeni bir anlık görüntü olup olmadığını kontrol eder. Nüfus rakamları ${popDate} tarihli nüfus sayımı tahminleridir.`,
  fullMethodology: "Ayrıntılı yöntem ve kaynaklar",

  mapTitle: "Harita",
  mapViewAria: "Harita görünümü",
  mapAria: "İlçe haritası. Karşılaştırmak için bir ilçe seçin.",
  view: { county: "Bu ilçe", similar: "Benzer ilçeler", shaded: "Tüm ilçeler" },
  thisCounty: "Bu ilçe",
  sitesInDev: (n) => `Geliştirme aşamasında ${n} saha`,
  hoverSimilar: {
    fewer: (name) => `Benzer ilçe · ${name} ile kıyasla daha az`,
    same: (name) => `Benzer ilçe · ${name} ile aynı`,
    more: (name) => `Benzer ilçe · ${name} ile kıyasla daha fazla`,
  },
  clickToCompare: "Karşılaştırmak için tıklayın",
  exactLocation: "Kesin konum",
  approxLocation: "Yaklaşık konum, gerçek saha değil",
  approxArea: (n) => `Bu yaklaşık bölgede ${n} saha`,
  andMore: (n) => `ve ${n} tane daha`,
  approxLocations: "Yaklaşık konumlar, gerçek sahalar değil",
  legendSimilarWith: "Benzer ilçeler:",
  legend: {
    fewer: (n) => `daha az (${n})`,
    same: (n) => `aynı (${n})`,
    more: (n) => `daha fazla (${n})`,
  },
  legendSites: "Geliştirme aşamasındaki sahalar",
  legendThisCounty: "bu ilçe",
  legendExact: (n) => `Kesin konum (${n})`,
  legendApprox: (n) => `Yaklaşık bölge (${n})`,
  zoomHint: "Sahaların yerini görmek için yakınlaştırın.",
  offMap: (list) => `Bu görünümün dışında kalan diğer benzer ilçeler: ${list}.`,

  chartTitle: (name) => `${name}: 40 benzer ilçe arasındaki yeri`,
  chartHelp: (date, name) =>
    `Her nokta bir benzer ilçedir; geliştirme aşamasındaki kayıtlı saha sayısına (${date}) göre yerleştirilir ve ${name} ile kıyasla daha az, aynı veya daha fazla olmasına göre renklendirilir. Ayrıntılar için üzerine gelin; karşılaştırmak için tıklayın.`,
  chartAria: (label, n, fewer, same, more) =>
    `Nokta grafiği: ${label} için ${n}; benzer ilçelerden ${fewer} tanesinde daha az, ${same} tanesinde aynı, ${more} tanesinde daha fazla.`,
  axisLabel: "Geliştirme aşamasındaki kayıtlı veri merkezi sahaları",
  typicalMark: (phrase) => `Tipik: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} kişi · mil² başına ${density} kişi`,
  clickToCompareCounty: "Bu ilçeyi karşılaştırmak için tıklayın",

  recordsTitle: (name, n) => `${name}: geliştirme aşamasındaki kayıtlı sahalar (${n})`,
  recordsHelp: (date) =>
    `${date} tarihli Compute Atlas anlık görüntüsünde belgelenmiş önerilen, izinli veya inşa halindeki veri merkezi sahaları ve özgün kaynaklarına bağlantılar. Bir kaydın “Son güncelleme” tarihi, kaynak bilgisinin en son ne zaman düzeltildiğini gösterir.`,
  noRecords: "Seçilen veri anlık görüntüsünde bu ilçe için uygun proje kaydı bulunamadı.",
  operatingSummary: (n) => `Faaliyette olan ${n} veri merkezi (yalnızca bağlam, yukarıdaki sayıya dahil değildir)`,
  reportFoot: "Eksik bir saha mı var ya da bir hata mı gördünüz? Bu sitenin kaynağı olan <a>Compute Atlas’a bildirin</a>.",
  field: {
    operator: "İşletmeci",
    status: "Durum",
    confidence: "Güvenilirlik",
    location: "Konum",
    assignment: "İlçe ataması",
    updated: "Son güncelleme",
  },
  recordId: (id) => `Compute Atlas kaydı: ${id}`,
  confidence: { confirmed: "doğrulanmış", reported: "basında yer almış", rumored: "söylenti" },
  status: {
    proposed: "Önerilen",
    permitted: "İzinli",
    under_construction: "İnşa halinde",
    operational: "Faaliyette",
    cancelled: "İptal edildi",
  },
  precision: { exact: "Kesin koordinatlar", approximate: "Yaklaşık konum" },
  assignment: {
    spatial_join: "İlçe, harita koordinatlarından",
    spatial_nearest_name_confirmed: "İlçe, koordinatlardan (kıyı şeridi); ad doğrulandı",
    source_name_match: "İlçe, kaynakta belirtilen addan",
  },
  reasons: {
    "status:operational": "Zaten faaliyette (bağlam olarak ayrıca gösterilir)",
    "status:cancelled": "İptal edildi",
    "facility_type:power_generation": "Bir enerji üretim projesi, veri merkezi değil",
    "facility_type:crypto_mining": "Bir kripto para madenciliği tesisi, veri merkezi değil",
    "confidence:rumored": "Yalnızca söylenti (düşük güvenilirlik)",
    "assignment:outside_geographic_scope": "50 eyalet ve Washington DC dışında",
    "assignment:unresolved_multi_site": "Tek bir ilçesi olmayan birden çok sahayı kapsıyor",
    "assignment:approximate_without_source_county": "İlçe adı belirtilmemiş yaklaşık konum",
    "assignment:ambiguous_source_county_name": "Belirtilen ilçe adı birden fazla ilçeyle eşleşiyor",
    "assignment:unrecognized_source_county_name": "Belirtilen ilçe adı 2025 nüfus sayımındaki bir ilçe değil",
    "assignment:conflict_point_county_vs_source_county": "Haritadaki konum ile belirtilen ilçe uyuşmuyor",
    "assignment:conflict_point_state_vs_source_state": "Haritadaki konum ile belirtilen eyalet uyuşmuyor",
    "assignment:point_outside_county_polygons": "Haritadaki konum hiçbir ilçenin içinde değil",
    "assignment:point_on_county_boundary_ambiguous": "Tam olarak ilçe sınırı üzerinde",
  },

  findTitle: "Proje bulun",
  findHelp:
    "Belirli bir projeyi mi duydunuz? Sayılıp sayılmadığını, sayılmıyorsa nedenini görmek için anlık görüntüdeki tüm kayıtlarda ad, şirket veya yere göre arama yapın.",
  findLabel: "Projelerde ara",
  findPlaceholder: "ör. Meta, Project Mica, Abilene",
  findLoading: "2.000’den fazla proje kaydı yükleniyor…",
  findError: "Proje listesi yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.",
  findNone: (q) => `“${q}” ile eşleşen proje yok. Compute Atlas bunu henüz listelememiş olabilir; <a>Compute Atlas’a bildirebilirsiniz</a>.`,
  source: "Kaynak",
  projectType: { data_center: "Veri merkezi", crypto_mining: "Kripto para madenciliği", power_generation: "Enerji üretimi" },
  countedHere: "Burada sayılıyor",
  countedHereNote: "Bu ilçenin sayısına dahil.",
  counted: "Sayılıyor",
  countedIn: (where) => `Sayıldığı yer: ${where}.`,
  compareCounty: (name) => `Karşılaştır: ${name}`,
  operating: "Faaliyette",
  operatingContext: (where) => (where ? `Bağlam olarak gösteriliyor (${where}), sayıya dahil değil.` : "Bağlam olarak gösteriliyor, sayıya dahil değil."),
  notCounted: "Sayılmıyor",
  findFoot: "Eksik veya hatalı bir proje mi biliyorsunuz? Bu sitenin kaynağı olan <a>Compute Atlas’a bildirin</a>.",

  peersTitle: "40 benzer ilçe (en benzerden başlayarak)",
  peersRange: (p0, p1, d0, d1) =>
    `Nüfusları ${p0} ile ${p1} arasında, nüfus yoğunlukları mil² başına ${d0} ile ${d1} kişi arasındadır. O ilçeyi karşılaştırmak için bir ad seçin.`,
  col: {
    rank: "Sıra",
    county: "İlçe",
    state: "Eyalet",
    population: "Nüfus (2025)",
    density: "Mil² başına kişi",
    sites: (date) => `Geliştirme aşamasındaki sahalar (${date})`,
  },
  showFewer: (n) => `Yalnızca en benzer ${n} ilçeyi göster`,
  showAll: (n) => `${n} benzer ilçenin tümünü göster`,

  summaryTitle: "Özet",
  aiChip: "Yapay zekânın yazdığı açıklama · önceden oluşturulmuş ve kontrol edilmiş",
  aiEnglishOnly: "Bu açıklama yalnızca İngilizce olarak sunulmaktadır.",
  aiNote: (model, date, status) =>
    `${model} tarafından bu ilçenin ${date} tarihli anlık görüntüdeki rakamlarından bir kez yazılmış, ardından her sayı tek tek kontrol edilmiştir (${status}). Canlı olarak üretilmez. İstem, girdi ve kontroller AI_EVALUATION.md dosyasındadır.`,
  templateChip: "Otomatik özet · hesaplanan rakamlardan sabit şablon (yapay zekâ yazmadı)",
  aiExamples: "Yapay zekânın yazdığı örnekler:",
  sum: {
    zero1: (name, date) => `Seçilen veri anlık görüntüsünde (${date}) ${name} için uygun proje kaydı bulunamadı.`,
    zero2: (same, total, more, typical, median, mean) =>
      `Sayısı (sıfır), ${total} benzer ilçeden ${same} tanesiyle aynı ve ${more} tanesinden az. Tipik benzer ilçe: ${typical} (medyan ${median}; ortalama ${mean}).`,
    some1: (name, n, date) =>
      `${date} tarihli veri anlık görüntüsünde ${name} için ${n} uygun, belgelenmiş veri merkezi proje kaydı var (önerilen, izinli veya inşa halinde).`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Bu, ${total} benzer ilçeden ${fewer} tanesinden fazla, ${same} tanesiyle aynı ve ${more} tanesinden az. Tipik benzer ilçe: ${typical} (medyan ${median}; ortalama ${mean}).`,
    noPeers: (total) => `Bu anlık görüntüde ${total} benzer ilçenin hiçbirinde uygun kayıt yok.`,
    peers: (n, total, pct) => `${total} benzer ilçeden ${n} tanesinde (%${pct}) en az bir uygun kayıt var.`,
    caveat:
      "Benzer ilçeler, nüfus ve nüfus yoğunluğu bakımından en yakın olanlardır; seçimde veri merkezi faaliyeti kullanılmaz. Sayılar, eksik olan tek bir veri anlık görüntüsündeki belgelenmiş kayıtları yansıtır; bu nedenle karşılaştırma betimleyicidir ve nedenleri, etkileri veya istatistiksel anlamlılığı göstermez.",
  },

  embedNote: (date) =>
    `Benzer ilçeler, nüfus ve nüfus yoğunluğu bakımından en yakın 40 ilçedir. Veriler ${date} tarihi itibarıyla Compute Atlas (Edward Kubiak, CC BY 4.0) ve ABD Nüfus Sayım Bürosu kaynaklıdır. Yalnızca belgelenmiş kayıtlar; tüm projelerin sayısı değildir.`,
  seeFull: "Karşılaştırmanın tamamını görün",
  errorTitle: "Bir sorun oluştu",
  errorBody: "Sayfa yüklenmeyi tamamlayamadı. Bu, site güncellendikten hemen sonra olabilir. Yenilemek genellikle sorunu çözer; ilçeniz adreste korunur.",
  reload: "Yenile",
};

export default tr;
