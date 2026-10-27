import type { Translation } from "./en";

/**
 * Korean in mixed script (國漢文混用): Sino-Korean words in hanja, native words, particles and loanwords (카운티,
 * 데이터 센터) in hangul. Follows ./ko.ts sentence by sentence. Written with AI; review by a native reader welcome.
 */
const koKore: Translation = {
  siteTitle: "우리 카운티는 얼마나 特別할까?",
  subtitle: "美國 全域에서 類似한 카운티와 記錄된 데이터 센터 開發 現況을 比較해 보세요.",
  methodologyLink: "方法論 및 出處",
  langNote: "AI로 飜譯되었으며 專門 飜譯家나 原語民의 檢討를 거치지 않아 誤謬가 있을 수 있습니다. 카운티와 地名은 英語로 表示됩니다.",
  printUrl: (url) => `인터랙티브 版: ${url}`,
  loadErrorTitle: "데이터 파일을 불러오지 못했습니다.",
  loadErrorHelp: "페이지를 새로 고쳐 다시 試圖하세요. 사이트를 로컬에서 實行 中이라면 먼저 <code>python scripts/build_all.py</code>를 實行하세요.",
  loadingCounties: (n) => `카운티 ${n}곳의 데이터를 불러오는 中…`,
  loading: "불러오는 中…",
  embedLoadError: "이 比較 結果를 불러오지 못했습니다.",
  comparing: (name) => `<b>${name}</b> 比較 中`,
  examplesAria: "例示 카운티",
  tryLabel: "例示:",
  notFound: (code) => `카운티 코드 ${code}을(를) 찾을 수 없어 例示 카운티를 表示합니다.`,
  srShowing: (name, verdict) => `${name} 表示 中: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>라이선스</a>). 加工 內容: ${transformations} 人口, 陸地 面積, 카운티 境界: 美國 人口調査局(퍼블릭 도메인). 데이터 버전 <code>${version}</code>.`,
  footerFallback: "施設 데이터: Edward Kubiak의 Compute Atlas(CC BY 4.0). 카운티 데이터: 美國 人口調査局.",
  methodologyEnglish: "이 섹션은 英語로만 提供됩니다.",

  language: "言語",
  languageButton: (name) => `言語: ${name}`,
  languagePanelNote:
    "飜譯은 AI로 作成되었으며 專門 飜譯家나 原語民의 檢討를 거치지 않아 誤謬가 있을 수 있습니다. 카운티와 地名은 英語로 表示되므로 英語로 檢索하세요.",
  done: "完了",

  freshnessAria: "데이터 基準 時點",
  dataAsOf: (date) => `데이터 基準日 <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `施設 記錄은 Compute Atlas 스냅숏 ${tag}에서 가져왔으며, 그 以後에 發表되거나 變更된 프로젝트는 包含되지 않습니다. 人口: ${popDate} 基準 人口調査 推定値. 境界 및 面積: ${geoVintage}年 人口調査 파일. 사이트 데이터 最終 更新: ${built}.`,
  stale: (days) =>
    `이 스냅숏은 ${days}日 以上 지나 더 새로운 記錄이 있을 수 있습니다. 最新 目錄은 <a>compute-atlas.com</a>에서 볼 수 있습니다.`,

  findCounty: "카운티 찾기",
  searchPlaceholder: "英語로 入力, 例: Loudoun County, VA",
  matchingCounties: "一致하는 카운티",
  noCountyMatch: (q) => `“${q}”에 該當하는 카운티가 없습니다. 英語 카운티 이름, “이름, 州 略字” 또는 5자리 카운티 코드로 檢索해 보세요.`,

  facts: (pop, density, geoid) => `人口 ${pop}名 · 제곱마일당 ${density}名 · 카운티 코드 ${geoid}`,
  shortAnswer: "한눈에 보는 答",
  verdict: {
    moreAll: (total) => `類似한 카운티 ${total}곳 모두보다 記錄된 데이터 센터 開發이 많습니다`,
    lessAll: (total) => `類似한 카운티 ${total}곳 모두보다 記錄된 데이터 센터 開發이 적습니다`,
    moreMost: "類似한 카운티 大部分보다 記錄된 데이터 센터 開發이 많습니다",
    lessMost: "類似한 카운티 大部分보다 記錄된 데이터 센터 開發이 적습니다",
    sameZero: "類似한 카운티 大部分처럼, 記錄된 開發 中인 데이터 센터 敷地가 없습니다",
    same: "類似한 카운티 大部分과 記錄된 데이터 센터 開發 水準이 같습니다",
    middle: "類似한 카운티들 가운데 中間 水準입니다",
  },
  heroLabel: () => "곳의 開發 中인 데이터 센터 敷地(記錄 基準)",
  heroAsOf: (date) => ` (${date} 基準)`,
  statusAria: "스냅숏에 記載된 이 敷地들의 狀態",
  statusLine: { under_construction: "建設 中", permitted: "許可됨", proposed: "提案됨" },
  typicalSimilar: "類似 카운티의 一般的인 數",
  similarWithAny: "敷地가 있는 類似 카운티",
  nOf: (n, total) => `${total}곳 中 ${n}곳`,
  averageSimilar: "類似 카운티 平均",
  typical: {
    none: "없음",
    sites: (n) => `${n}곳`,
    range: (a, b) => `${a}~${b}곳`,
  },
  comparedWith: (total) => `가장 類似한 카운티 ${total}곳과 比較`,
  cmp: {
    fewer: (n) => `더 적음 <b>${n}</b>곳`,
    same: (n) => `같음 <b>${n}</b>곳`,
    more: (n) => `더 많음 <b>${n}</b>곳`,
  },
  barAria: (total, fewer, name, same, more) =>
    `類似한 카운티 ${total}곳 中 ${fewer}곳은 ${name}보다 記錄된 敷地가 적고, ${same}곳은 같으며, ${more}곳은 많습니다.`,
  zeroNote:
    "選擇한 데이터 스냅숏에서 이 카운티의 該當 프로젝트 記錄을 찾지 못했습니다. 이곳에 計劃된 데이터 센터가 없다는 뜻이 아니라, 이 出處에 記錄된 것이 없다는 뜻입니다.",
  similarLine: "‘類似한’ 카운티란 美國 어디에 있든 人口와 人口 密度가 가장 가까운 카운티를 말합니다. 가장 類似한 곳은 <list/>입니다.",
  operatingNote: (n) => `이와 別途로 運營 中인 데이터 센터 ${n}곳이 記錄되어 있습니다(위 數字에는 包含되지 않음).`,
  stateLine: (state, withSites, counties) =>
    `${state}에서는 카운티 ${counties}곳 中 ${withSites}곳에 開發 中인 敷地가 하나 以上 記錄되어 있습니다.`,
  findLink: "特定 프로젝트 消息을 들으셨나요? 集計에 包含되는지 確認하세요",

  share: "共有",
  shareOptions: "共有 옵션",
  copyLink: "링크 複寫",
  printSummary: "要約 印刷",
  downloadSimilar: "類似 카운티 다운로드(CSV)",
  downloadSites: "開發 中인 敷地 다운로드(CSV)",
  embedAction: "웹사이트에 插入…",
  linkCopied: "링크를 複寫했습니다",
  copyFailed: "여기서는 複寫할 수 없습니다. 텍스트를 選擇해 直接 複寫하세요",
  downloadStarted: "다운로드를 始作했습니다",
  embedTitle: "이 比較 結果 插入",
  embedHelp: (name) =>
    `이 코드를 페이지에 붙여 넣으세요. ${name}의 比較 結果가 데이터 基準日, 出處 標記와 함께 表示되며 全體 사이트로 連結됩니다.`,
  embedCodeLabel: "插入 코드",
  copyCode: "코드 複寫",
  embedCopied: "插入 코드를 複寫했습니다",

  explainTitle: "이 數字들은 무슨 뜻인가요?",
  qCounted: "‘開發 中인 敷地’에는 무엇이 包含되나요?",
  aCounted:
    "公開 硏究用 目錄인 Compute Atlas에 <b>提案됨</b>, <b>許可됨</b>(承認), 또는 <b>建設 中</b>으로 올라 있고, 確認되었거나 報道된 出處가 있는 데이터 센터 敷地입니다. 運營 中인 데이터 센터는 따로 세며 參考用으로만 보여 줍니다. 各 數字는 記錄된 敷地 項目의 數이며, 檢證된 建物 數와는 다릅니다.",
  qSimilar: "‘類似한 카운티’는 어디인가요?",
  aSimilar: (total, name) =>
    `人口와 人口 密度(陸地 1제곱마일당 人口) 모두 ${name}에 가장 가까운 美國 카운티 ${total}곳입니다. 데이터 센터 活動은 選定에 쓰지 않으므로, 이 程度 規模와 密度의 地域에서 흔한 水準을 보여 줍니다. 어느 州에 있든 相關없습니다.`,
  qRead: "‘더 적음, 같음, 더 많음’은 어떻게 읽나요?",
  aRead: (name, fewer, same, more, total) =>
    `類似한 카운티를 하나씩 ${name} 基準으로 比較한 結果입니다. ${fewer}곳은 記錄된 敷地가 더 적고, ${same}곳은 같으며, ${more}곳은 더 많습니다. ‘大部分’은 折半 超過, 즉 ${total}곳 中 21곳 以上을 뜻합니다. 類似 카운티의 一般的인 數는 ${total}곳을 數字 順으로 줄 세웠을 때 가운데 값(中央값)입니다.`,
  qZero: "0은 무슨 뜻인가요?",
  aZero:
    "이 데이터 스냅숏에서 該當 記錄을 찾지 못했다는 뜻입니다. 計劃된 데이터 센터가 없다는 뜻은 아닙니다. 目錄은 不完全하며, 記錄이 잘 된 地域일수록 더 많이 나타날 수 있습니다.",
  qJudge: "이곳의 開發이 좋은지, 나쁜지, 일어날지를 알려 주나요?",
  aJudge:
    "아닙니다. 이 道具는 記錄된 項目을 세어 類似한 地域과 比較할 뿐입니다. 環境的·經濟的 影響을 測定하거나, 記錄이 많거나 적은 理由를 說明하거나, 앞으로의 프로젝트를 豫測하지 않습니다.",
  qCurrent: "얼마나 最新 情報인가요?",
  aCurrent: (snapshot, popDate) =>
    `記錄은 ${snapshot} 基準 Compute Atlas 스냅숏에서 가져왔으며, 以後에 發表되거나 變更된 프로젝트는 包含되지 않습니다. 사이트는 每週 새 스냅숏이 있는지 確認합니다. 人口는 ${popDate} 基準 人口調査 推定値입니다.`,
  fullMethodology: "全體 方法論 및 出處",

  mapTitle: "地圖",
  mapViewAria: "地圖 보기",
  mapAria: "카운티 地圖. 카운티를 選擇하면 比較합니다.",
  view: { county: "이 카운티", similar: "類似 카운티", shaded: "모든 카운티" },
  thisCounty: "이 카운티",
  sitesInDev: (n) => `開發 中인 敷地 ${n}곳`,
  hoverSimilar: {
    fewer: (name) => `類似 카운티 · ${name} 對比 적음`,
    same: (name) => `類似 카운티 · ${name} 對比 같음`,
    more: (name) => `類似 카운티 · ${name} 對比 많음`,
  },
  clickToCompare: "클릭하여 比較",
  exactLocation: "正確한 位置",
  approxLocation: "大略的인 位置이며 實際 敷地가 아님",
  approxArea: (n) => `이 大略的인 地域의 敷地 ${n}곳`,
  andMore: (n) => `外 ${n}곳`,
  approxLocations: "大略的인 位置이며 實際 敷地가 아님",
  legendSimilarWith: "類似 카운티:",
  legend: {
    fewer: (n) => `더 적음 (${n})`,
    same: (n) => `같음 (${n})`,
    more: (n) => `더 많음 (${n})`,
  },
  legendSites: "開發 中인 敷地",
  legendThisCounty: "이 카운티",
  legendExact: (n) => `正確한 位置 (${n})`,
  legendApprox: (n) => `大略的인 地域 (${n})`,
  zoomHint: "擴大하면 敷地 位置가 보입니다.",
  offMap: (list) => `이 畫面 밖의 類似 카운티: ${list}.`,

  chartTitle: (name) => `類似한 카운티 40곳 가운데 ${name}의 位置`,
  chartHelp: (date, name) =>
    `點 하나가 類似한 카운티 한 곳입니다. 記錄된 開發 中 敷地 數(${date})에 따라 놓이며, ${name} 對比 적은지, 같은지, 많은지에 따라 色이 다릅니다. 마우스를 올리면 仔細히 보이고, 클릭하면 比較합니다.`,
  chartAria: (label, n, fewer, same, more) =>
    `點 그래프: ${label}의 敷地는 ${n}곳. 類似 카운티 中 ${fewer}곳은 더 적고, ${same}곳은 같으며, ${more}곳은 더 많습니다.`,
  axisLabel: "記錄된 開發 中 데이터 센터 敷地 數",
  typicalMark: (phrase) => `一般的: ${phrase}`,
  peopleDensity: (pop, density) => `人口 ${pop}名 · 제곱마일당 ${density}名`,
  clickToCompareCounty: "클릭하여 이 카운티와 比較",

  recordsTitle: (name, n) => `${name}의 記錄된 開發 中 敷地 (${n})`,
  recordsHelp: (date) =>
    `${date} 基準 Compute Atlas 스냅숏에 記錄된 提案·許可·建設 中인 데이터 센터 敷地와 原 出處 링크입니다. 各 記錄의 ‘最終 업데이트’ 날짜는 出處 情報가 마지막으로 修正된 時點입니다.`,
  noRecords: "選擇한 데이터 스냅숏에서 이 카운티의 該當 프로젝트 記錄을 찾지 못했습니다.",
  operatingSummary: (n) => `運營 中인 데이터 센터 ${n}곳 (參考用, 위 數字에는 包含되지 않음)`,
  reportFoot: "빠진 敷地나 誤謬가 있나요? 이 사이트의 出處인 <a>Compute Atlas에 알려 주세요</a>.",
  field: {
    operator: "運營社",
    status: "狀態",
    confidence: "信賴度",
    location: "位置",
    assignment: "카운티 配定",
    updated: "最終 업데이트",
  },
  recordId: (id) => `Compute Atlas 記錄: ${id}`,
  confidence: { confirmed: "確認됨", reported: "報道됨", rumored: "所聞" },
  status: {
    proposed: "提案됨",
    permitted: "許可됨",
    under_construction: "建設 中",
    operational: "運營 中",
    cancelled: "取消됨",
  },
  precision: { exact: "正確한 座標", approximate: "大略的인 位置" },
  assignment: {
    spatial_join: "地圖 座標로 카운티 配定",
    spatial_nearest_name_confirmed: "座標(海岸線)로 配定, 이름 確認됨",
    source_name_match: "出處에 적힌 카운티 이름으로 配定",
  },
  reasons: {
    "status:operational": "이미 運營 中(參考用으로 따로 表示)",
    "status:cancelled": "取消됨",
    "facility_type:power_generation": "데이터 센터가 아닌 發電 프로젝트",
    "facility_type:crypto_mining": "데이터 센터가 아닌 暗號貨幣 採掘 施設",
    "confidence:rumored": "所聞뿐임(信賴度 낮음)",
    "assignment:outside_geographic_scope": "50個 州와 DC 밖에 있음",
    "assignment:unresolved_multi_site": "여러 敷地를 묶은 記錄이라 카운티를 하나로 定할 수 없음",
    "assignment:approximate_without_source_county": "大略的인 位置이며 카운티 이름이 없음",
    "assignment:ambiguous_source_county_name": "카운티 이름이 둘 以上의 카운티와 一致함",
    "assignment:unrecognized_source_county_name": "카운티 이름이 2025年 人口調査 카운티가 아님",
    "assignment:conflict_point_county_vs_source_county": "地圖 位置와 적힌 카운티가 서로 다름",
    "assignment:conflict_point_state_vs_source_state": "地圖 位置와 적힌 州가 서로 다름",
    "assignment:point_outside_county_polygons": "地圖 位置가 어느 카운티에도 屬하지 않음",
    "assignment:point_on_county_boundary_ambiguous": "카운티 境界線 바로 위에 있음",
  },

  findTitle: "프로젝트 찾기",
  findHelp: "特定 프로젝트 消息을 들으셨나요? 스냅숏의 모든 記錄을 이름, 會社, 地域으로 檢索해 集計에 包含되는지, 아니라면 왜인지 確認하세요.",
  findLabel: "프로젝트 檢索",
  findPlaceholder: "例: Meta, Project Mica, Abilene",
  findLoading: "프로젝트 記錄 2,000餘 件을 불러오는 中…",
  findError: "프로젝트 目錄을 불러오지 못했습니다. 連結 狀態를 確認하고 다시 試圖하세요.",
  findNone: (q) => `“${q}”에 該當하는 프로젝트가 없습니다. Compute Atlas에 아직 없을 수 있습니다. <a>Compute Atlas에 알려 주세요</a>.`,
  source: "出處",
  projectType: { data_center: "데이터 센터", crypto_mining: "暗號貨幣 採掘", power_generation: "發電" },
  countedHere: "여기에 集計됨",
  countedHereNote: "이 카운티의 數字에 包含되어 있습니다.",
  counted: "集計됨",
  countedIn: (where) => `${where}에 包含.`,
  compareCounty: (name) => `${name} 比較하기`,
  operating: "運營 中",
  operatingContext: (where) => (where ? `${where}에서 參考用으로 表示되며 數字에는 包含되지 않습니다.` : "參考用으로 表示되며 數字에는 包含되지 않습니다."),
  notCounted: "集計 除外",
  findFoot: "빠졌거나 잘못된 프로젝트를 알고 계신가요? 이 사이트의 出處인 <a>Compute Atlas에 알려 주세요</a>.",

  peersTitle: "類似한 카운티 40곳 (類似한 順)",
  peersRange: (p0, p1, d0, d1) =>
    `人口는 ${p0}~${p1}名, 人口 密度는 제곱마일당 ${d0}~${d1}名입니다. 이름을 選擇하면 그 카운티로 比較합니다.`,
  col: {
    rank: "順位",
    county: "카운티",
    state: "州",
    population: "人口(2025)",
    density: "제곱마일당 人口",
    sites: (date) => `開發 中인 敷地 (${date})`,
  },
  showFewer: (n) => `가장 類似한 ${n}곳만 보기`,
  showAll: (n) => `類似한 카운티 ${n}곳 모두 보기`,

  summaryTitle: "要約",
  aiChip: "AI가 作成한 說明 · 미리 生成하고 檢證함",
  aiEnglishOnly: "이 說明은 英語로만 提供됩니다.",
  aiNote: (model, date, status) =>
    `${model}이(가) ${date} 스냅숏의 이 카운티 數値를 바탕으로 한 番 作成했고, 以後 數字 하나하나를 檢證했습니다(${status}). 實時間으로 生成되지 않습니다. 프롬프트, 入力, 檢證 內容은 AI_EVALUATION.md에 있습니다.`,
  templateChip: "自動 要約 · 計算된 數値로 만든 固定 템플릿(AI 作成 아님)",
  aiExamples: "AI가 作成한 例示:",
  sum: {
    zero1: (name, date) => `選擇한 데이터 스냅숏(${date})에서 ${name}의 該當 프로젝트 記錄을 찾지 못했습니다.`,
    zero2: (same, total, more, typical, median, mean) =>
      `類似한 카운티 ${total}곳 中 ${same}곳과 같은 數(0)이며, ${more}곳보다 적습니다. 類似 카운티의 一般的인 記錄 數: ${typical}(中央값 ${median}, 平均 ${mean}).`,
    some1: (name, n, date) =>
      `${date} 데이터 스냅숏에서 ${name}에는 該當하는 데이터 센터 프로젝트 記錄(提案·許可·建設 中)이 ${n}件 있습니다.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `類似한 카운티 ${total}곳 中 ${fewer}곳보다 많고, ${same}곳과 같으며, ${more}곳보다 적습니다. 類似 카운티의 一般的인 記錄 數: ${typical}(中央값 ${median}, 平均 ${mean}).`,
    noPeers: (total) => `이 스냅숏에서 類似한 카운티 ${total}곳 中 該當 記錄이 있는 곳은 없습니다.`,
    peers: (n, total, pct) => `類似한 카운티 ${total}곳 中 ${n}곳(${pct}%)에 該當 記錄이 하나 以上 있습니다.`,
    caveat:
      "類似한 카운티는 人口와 人口 密度가 가장 가까운 카운티이며, 選定에 데이터 센터 活動은 쓰지 않습니다. 數字는 不完全한 하나의 데이터 스냅숏에 記錄된 項目을 反映하므로, 이 比較는 敍述的이며 原因, 影響, 統計的 有意性을 보여 주지 않습니다.",
  },

  embedNote: (date) =>
    `類似한 카운티는 人口와 人口 密度가 가장 가까운 40곳입니다. ${date} 基準 데이터, 出處: Compute Atlas(Edward Kubiak, CC BY 4.0) 및 美國 人口調査局. 記錄된 項目만 包含하며 全體 프로젝트 數가 아닙니다.`,
  seeFull: "全體 比較 보기",
  errorTitle: "問題가 發生했습니다",
  errorBody: "페이지를 끝까지 불러오지 못했습니다. 사이트가 업데이트된 直後에 생길 수 있습니다. 새로 고치면 大槪 解決되며, 選擇한 카운티는 住所에 남아 있습니다.",
  reload: "새로 고침",
};

export default koKore;
