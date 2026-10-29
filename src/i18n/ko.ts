import type { Translation } from "./en";

/**
 * Korean (Hangul). Written with AI; review by a native speaker welcome. County names stay in English, so sentences
 * avoid particles whose form depends on the name's last sound (은/는, 이/가, 와/과) right after a name.
 */
const ko: Translation = {
  siteTitle: "우리 카운티는 얼마나 특별할까?",
  subtitle: "미국 전역에서 비슷한 카운티와 기록된 데이터 센터 개발 현황을 비교해 보세요.",
  methodologyLink: "방법론 및 출처",
  langNote: "AI로 번역되었으며 전문 번역가나 원어민의 검토를 거치지 않아 오류가 있을 수 있습니다. 카운티와 지명은 영어로 표시됩니다.",
  printUrl: (url) => `인터랙티브 버전: ${url}`,
  loadErrorTitle: "데이터 파일을 불러오지 못했습니다.",
  loadErrorHelp: "페이지를 새로 고쳐 다시 시도하세요. 사이트를 로컬에서 실행 중이라면 먼저 <code>python scripts/build_all.py</code>를 실행하세요.",
  loadingCounties: (n) => `카운티 ${n}곳의 데이터를 불러오는 중…`,
  loading: "불러오는 중…",
  embedLoadError: "이 비교 결과를 불러오지 못했습니다.",
  comparing: (name) => `<b>${name}</b> 비교 중`,
  examplesAria: "예시 카운티",
  tryLabel: "예시:",
  notFound: (code) => `카운티 코드 ${code}을(를) 찾을 수 없어 예시 카운티를 표시합니다.`,
  srShowing: (name, verdict) => `${name} 표시 중: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} 가공 내용: ${transformations} 인구, 육지 면적, 카운티 경계: 미국 인구조사국(퍼블릭 도메인). 데이터 버전 <code>${version}</code>.`,
  footerFallback: "시설 데이터: Edward Kubiak의 Compute Atlas(CC BY 4.0). 카운티 데이터: 미국 인구조사국.",
  methodologyEnglish: "이 섹션은 영어로만 제공됩니다.",

  language: "언어",
  languageButton: (name) => `언어: ${name}`,
  languagePanelNote:
    "번역은 AI로 작성되었으며 전문 번역가나 원어민의 검토를 거치지 않아 오류가 있을 수 있습니다. 카운티와 지명은 영어로 표시되므로 영어로 검색하세요.",
  done: "완료",

  freshnessAria: "데이터 기준 시점",
  dataAsOf: (date) => `데이터 기준일 <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `시설 기록은 Compute Atlas 스냅숏 ${tag}에서 가져왔으며, 그 이후에 발표되거나 변경된 프로젝트는 포함되지 않습니다. 인구: ${popDate} 기준 인구조사 추정치. 경계 및 면적: ${geoVintage}년 인구조사 파일. 사이트 데이터 최종 갱신: ${built}.`,
  stale: (days) =>
    `이 스냅숏은 ${days}일 이상 지나 더 새로운 기록이 있을 수 있습니다. 최신 목록은 <a>compute-atlas.com</a>에서 볼 수 있습니다.`,

  findCounty: "카운티 찾기",
  searchPlaceholder: "영어로 입력, 예: Loudoun County, VA",
  matchingCounties: "일치하는 카운티",
  noCountyMatch: (q) => `“${q}”에 해당하는 카운티가 없습니다. 영어 카운티 이름, “이름, 주 약자” 또는 5자리 카운티 코드로 검색해 보세요.`,

  facts: (pop, density, geoid) => `인구 ${pop}명 · 제곱마일당 ${density}명 · 카운티 코드 ${geoid}`,
  shortAnswer: "한눈에 보는 답",
  verdict: {
    moreAll: (total) => `비슷한 카운티 ${total}곳 모두보다 기록된 데이터 센터 개발이 많습니다`,
    lessAll: (total) => `비슷한 카운티 ${total}곳 모두보다 기록된 데이터 센터 개발이 적습니다`,
    moreMost: "비슷한 카운티 대부분보다 기록된 데이터 센터 개발이 많습니다",
    lessMost: "비슷한 카운티 대부분보다 기록된 데이터 센터 개발이 적습니다",
    sameZero: "비슷한 카운티 대부분처럼, 기록된 개발 중인 데이터 센터 부지가 없습니다",
    same: "비슷한 카운티 대부분과 기록된 데이터 센터 개발 수준이 같습니다",
    middle: "비슷한 카운티들 가운데 중간 수준입니다",
  },
  heroLabel: () => "곳의 개발 중인 데이터 센터 부지(기록 기준)",
  heroAsOf: (date) => ` (${date} 기준)`,
  statusAria: "스냅숏에 기재된 이 부지들의 상태",
  statusLine: { under_construction: "건설 중", permitted: "허가됨", proposed: "제안됨" },
  typicalSimilar: "비슷한 카운티의 일반적인 수",
  similarWithAny: "부지가 있는 비슷한 카운티",
  nOf: (n, total) => `${total}곳 중 ${n}곳`,
  averageSimilar: "비슷한 카운티 평균",
  typical: {
    none: "없음",
    sites: (n) => `${n}곳`,
    range: (a, b) => `${a}~${b}곳`,
  },
  comparedWith: (total) => `가장 비슷한 카운티 ${total}곳과 비교`,
  cmp: {
    fewer: (n) => `더 적음 <b>${n}</b>곳`,
    same: (n) => `같음 <b>${n}</b>곳`,
    more: (n) => `더 많음 <b>${n}</b>곳`,
  },
  barAria: (total, fewer, name, same, more) =>
    `비슷한 카운티 ${total}곳 중 ${fewer}곳은 ${name}보다 기록된 부지가 적고, ${same}곳은 같으며, ${more}곳은 많습니다.`,
  zeroNote:
    "선택한 데이터 스냅숏에서 이 카운티의 해당 프로젝트 기록을 찾지 못했습니다. 이곳에 계획된 데이터 센터가 없다는 뜻이 아니라, 이 출처에 기록된 것이 없다는 뜻입니다.",
  similarLine: "‘비슷한’ 카운티란 미국 어디에 있든 인구와 인구 밀도가 가장 가까운 카운티를 말합니다. 가장 비슷한 곳은 <list/>입니다.",
  operatingNote: (n) => `이와 별도로 운영 중인 데이터 센터 ${n}곳이 기록되어 있습니다(위 숫자에는 포함되지 않음).`,
  stateLine: (state, withSites, counties) =>
    `${state}에서는 카운티 ${counties}곳 중 ${withSites}곳에 개발 중인 부지가 하나 이상 기록되어 있습니다.`,
  findLink: "특정 프로젝트 소식을 들으셨나요? 집계에 포함되는지 확인하세요",

  share: "공유",
  shareOptions: "공유 옵션",
  copyLink: "링크 복사",
  printSummary: "요약 인쇄",
  downloadSimilar: "비슷한 카운티 다운로드(CSV)",
  downloadSites: "개발 중인 부지 다운로드(CSV)",
  embedAction: "웹사이트에 삽입…",
  linkCopied: "링크를 복사했습니다",
  copyFailed: "여기서는 복사할 수 없습니다. 텍스트를 선택해 직접 복사하세요",
  downloadStarted: "다운로드를 시작했습니다",
  embedTitle: "이 비교 결과 삽입",
  embedHelp: (name) =>
    `이 코드를 페이지에 붙여 넣으세요. ${name}의 비교 결과가 데이터 기준일, 출처 표기와 함께 표시되며 전체 사이트로 연결됩니다.`,
  embedCodeLabel: "삽입 코드",
  copyCode: "코드 복사",
  embedCopied: "삽입 코드를 복사했습니다",

  explainTitle: "이 숫자들은 무슨 뜻인가요?",
  qCounted: "‘개발 중인 부지’에는 무엇이 포함되나요?",
  aCounted:
    "공개 연구용 목록인 Compute Atlas에 <b>제안됨</b>, <b>허가됨</b>(승인), 또는 <b>건설 중</b>으로 올라 있고, 확인되었거나 보도된 출처가 있는 데이터 센터 부지입니다. 운영 중인 데이터 센터는 따로 세며 참고용으로만 보여 줍니다. 각 숫자는 기록된 부지 항목의 수이며, 검증된 건물 수와는 다릅니다.",
  qSimilar: "‘비슷한 카운티’는 어디인가요?",
  aSimilar: (total, name) =>
    `인구와 인구 밀도(육지 1제곱마일당 인구) 모두 ${name}에 가장 가까운 미국 카운티 ${total}곳입니다. 데이터 센터 활동은 선정에 쓰지 않으므로, 이 정도 규모와 밀도의 지역에서 흔한 수준을 보여 줍니다. 어느 주에 있든 상관없습니다.`,
  qRead: "‘더 적음, 같음, 더 많음’은 어떻게 읽나요?",
  aRead: (name, fewer, same, more, total) =>
    `비슷한 카운티를 하나씩 ${name} 기준으로 비교한 결과입니다. ${fewer}곳은 기록된 부지가 더 적고, ${same}곳은 같으며, ${more}곳은 더 많습니다. ‘대부분’은 절반 초과, 즉 ${total}곳 중 21곳 이상을 뜻합니다. 비슷한 카운티의 일반적인 수는 ${total}곳을 숫자 순으로 줄 세웠을 때 가운데 값(중앙값)입니다.`,
  qZero: "0은 무슨 뜻인가요?",
  aZero:
    "이 데이터 스냅숏에서 해당 기록을 찾지 못했다는 뜻입니다. 계획된 데이터 센터가 없다는 뜻은 아닙니다. 목록은 불완전하며, 기록이 잘 된 지역일수록 더 많이 나타날 수 있습니다.",
  qJudge: "이곳의 개발이 좋은지, 나쁜지, 일어날지를 알려 주나요?",
  aJudge:
    "아닙니다. 이 도구는 기록된 항목을 세어 비슷한 지역과 비교할 뿐입니다. 환경적·경제적 영향을 측정하거나, 기록이 많거나 적은 이유를 설명하거나, 앞으로의 프로젝트를 예측하지 않습니다.",
  qCurrent: "얼마나 최신 정보인가요?",
  aCurrent: (snapshot, popDate) =>
    `기록은 ${snapshot} 기준 Compute Atlas 스냅숏에서 가져왔으며, 이후에 발표되거나 변경된 프로젝트는 포함되지 않습니다. 사이트는 매주 새 스냅숏이 있는지 확인합니다. 인구는 ${popDate} 기준 인구조사 추정치입니다.`,
  fullMethodology: "전체 방법론 및 출처",

  mapTitle: "지도",
  mapViewAria: "지도 보기",
  mapAria: "카운티 지도. 카운티를 선택하면 비교합니다.",
  view: { county: "이 카운티", similar: "비슷한 카운티", shaded: "모든 카운티" },
  thisCounty: "이 카운티",
  sitesInDev: (n) => `개발 중인 부지 ${n}곳`,
  hoverSimilar: {
    fewer: (name) => `비슷한 카운티 · ${name} 대비 적음`,
    same: (name) => `비슷한 카운티 · ${name} 대비 같음`,
    more: (name) => `비슷한 카운티 · ${name} 대비 많음`,
  },
  clickToCompare: "클릭하여 비교",
  exactLocation: "정확한 위치",
  approxLocation: "대략적인 위치이며 실제 부지가 아님",
  approxArea: (n) => `이 대략적인 지역의 부지 ${n}곳`,
  andMore: (n) => `외 ${n}곳`,
  approxLocations: "대략적인 위치이며 실제 부지가 아님",
  legendSimilarWith: "비슷한 카운티:",
  legend: {
    fewer: (n) => `더 적음 (${n})`,
    same: (n) => `같음 (${n})`,
    more: (n) => `더 많음 (${n})`,
  },
  legendSites: "개발 중인 부지",
  legendThisCounty: "이 카운티",
  legendExact: (n) => `정확한 위치 (${n})`,
  legendApprox: (n) => `대략적인 지역 (${n})`,
  zoomHint: "확대하면 부지 위치가 보입니다.",
  offMap: (list) => `이 화면 밖의 비슷한 카운티: ${list}.`,

  chartTitle: (name) => `비슷한 카운티 40곳 가운데 ${name}의 위치`,
  chartHelp: (date, name) =>
    `점 하나가 비슷한 카운티 한 곳입니다. 기록된 개발 중 부지 수(${date})에 따라 놓이며, ${name} 대비 적은지, 같은지, 많은지에 따라 색이 다릅니다. 마우스를 올리면 자세히 보이고, 클릭하면 비교합니다.`,
  chartAria: (label, n, fewer, same, more) =>
    `점 그래프: ${label}의 부지는 ${n}곳. 비슷한 카운티 중 ${fewer}곳은 더 적고, ${same}곳은 같으며, ${more}곳은 더 많습니다.`,
  axisLabel: "기록된 개발 중 데이터 센터 부지 수",
  typicalMark: (phrase) => `일반적: ${phrase}`,
  peopleDensity: (pop, density) => `인구 ${pop}명 · 제곱마일당 ${density}명`,
  clickToCompareCounty: "클릭하여 이 카운티와 비교",

  recordsTitle: (name, n) => `${name}의 기록된 개발 중 부지 (${n})`,
  recordsHelp: (date) =>
    `${date} 기준 Compute Atlas 스냅숏에 기록된 제안·허가·건설 중인 데이터 센터 부지와 원 출처 링크입니다. 각 기록의 ‘최종 업데이트’ 날짜는 출처 정보가 마지막으로 수정된 시점입니다.`,
  noRecords: "선택한 데이터 스냅숏에서 이 카운티의 해당 프로젝트 기록을 찾지 못했습니다.",
  operatingSummary: (n) => `운영 중인 데이터 센터 ${n}곳 (참고용, 위 숫자에는 포함되지 않음)`,
  reportFoot: "빠진 부지나 오류가 있나요? 이 사이트의 출처인 <a>Compute Atlas에 알려 주세요</a>.",
  field: {
    operator: "운영사",
    status: "상태",
    confidence: "신뢰도",
    location: "위치",
    assignment: "카운티 배정",
    updated: "최종 업데이트",
  },
  recordId: (id) => `Compute Atlas 기록: ${id}`,
  confidence: { confirmed: "확인됨", reported: "보도됨", rumored: "소문" },
  status: {
    proposed: "제안됨",
    permitted: "허가됨",
    under_construction: "건설 중",
    operational: "운영 중",
    cancelled: "취소됨",
  },
  precision: { exact: "정확한 좌표", approximate: "대략적인 위치" },
  assignment: {
    spatial_join: "지도 좌표로 카운티 배정",
    spatial_nearest_name_confirmed: "좌표(해안선)로 배정, 이름 확인됨",
    source_name_match: "출처에 적힌 카운티 이름으로 배정",
  },
  reasons: {
    "status:operational": "이미 운영 중(참고용으로 따로 표시)",
    "status:cancelled": "취소됨",
    "facility_type:power_generation": "데이터 센터가 아닌 발전 프로젝트",
    "facility_type:crypto_mining": "데이터 센터가 아닌 암호화폐 채굴 시설",
    "confidence:rumored": "소문뿐임(신뢰도 낮음)",
    "assignment:outside_geographic_scope": "50개 주와 DC 밖에 있음",
    "assignment:unresolved_multi_site": "여러 부지를 묶은 기록이라 카운티를 하나로 정할 수 없음",
    "assignment:approximate_without_source_county": "대략적인 위치이며 카운티 이름이 없음",
    "assignment:ambiguous_source_county_name": "카운티 이름이 둘 이상의 카운티와 일치함",
    "assignment:unrecognized_source_county_name": "카운티 이름이 2025년 인구조사 카운티가 아님",
    "assignment:conflict_point_county_vs_source_county": "지도 위치와 적힌 카운티가 서로 다름",
    "assignment:conflict_point_state_vs_source_state": "지도 위치와 적힌 주가 서로 다름",
    "assignment:point_outside_county_polygons": "지도 위치가 어느 카운티에도 속하지 않음",
    "assignment:point_on_county_boundary_ambiguous": "카운티 경계선 바로 위에 있음",
  },

  findTitle: "프로젝트 찾기",
  findHelp: "특정 프로젝트 소식을 들으셨나요? 스냅숏의 모든 기록을 이름, 회사, 지역으로 검색해 집계에 포함되는지, 아니라면 왜인지 확인하세요.",
  findLabel: "프로젝트 검색",
  findPlaceholder: "예: Meta, Project Mica, Abilene",
  findLoading: "프로젝트 기록 2,000여 건을 불러오는 중…",
  findError: "프로젝트 목록을 불러오지 못했습니다. 연결 상태를 확인하고 다시 시도하세요.",
  findNone: (q) => `“${q}”에 해당하는 프로젝트가 없습니다. Compute Atlas에 아직 없을 수 있습니다. <a>Compute Atlas에 알려 주세요</a>.`,
  source: "출처",
  projectType: { data_center: "데이터 센터", crypto_mining: "암호화폐 채굴", power_generation: "발전" },
  countedHere: "여기에 집계됨",
  countedHereNote: "이 카운티의 숫자에 포함되어 있습니다.",
  counted: "집계됨",
  countedIn: (where) => `${where}에 포함.`,
  compareCounty: (name) => `${name} 비교하기`,
  operating: "운영 중",
  operatingContext: (where) => (where ? `${where}에서 참고용으로 표시되며 숫자에는 포함되지 않습니다.` : "참고용으로 표시되며 숫자에는 포함되지 않습니다."),
  notCounted: "집계 제외",
  findFoot: "빠졌거나 잘못된 프로젝트를 알고 계신가요? 이 사이트의 출처인 <a>Compute Atlas에 알려 주세요</a>.",

  peersTitle: "비슷한 카운티 40곳 (비슷한 순)",
  peersRange: (p0, p1, d0, d1) =>
    `인구는 ${p0}~${p1}명, 인구 밀도는 제곱마일당 ${d0}~${d1}명입니다. 이름을 선택하면 그 카운티로 비교합니다.`,
  col: {
    rank: "순위",
    county: "카운티",
    state: "주",
    population: "인구(2025)",
    density: "제곱마일당 인구",
    sites: (date) => `개발 중인 부지 (${date})`,
  },
  showFewer: (n) => `가장 비슷한 ${n}곳만 보기`,
  showAll: (n) => `비슷한 카운티 ${n}곳 모두 보기`,

  summaryTitle: "요약",
  aiChip: "AI가 작성한 설명 · 미리 생성하고 검증함",
  aiEnglishOnly: "이 설명은 영어로만 제공됩니다.",
  aiNote: (model, date, status) =>
    `${model}이(가) ${date} 스냅숏의 이 카운티 수치를 바탕으로 한 번 작성했고, 이후 숫자 하나하나를 검증했습니다(${status}). 실시간으로 생성되지 않습니다. 프롬프트, 입력, 검증 내용은 AI_EVALUATION.md에 있습니다.`,
  templateChip: "자동 요약 · 계산된 수치로 만든 고정 템플릿(AI 작성 아님)",
  aiExamples: "AI가 작성한 예시:",
  sum: {
    zero1: (name, date) => `선택한 데이터 스냅숏(${date})에서 ${name}의 해당 프로젝트 기록을 찾지 못했습니다.`,
    zero2: (same, total, more, typical, median, mean) =>
      `비슷한 카운티 ${total}곳 중 ${same}곳과 같은 수(0)이며, ${more}곳보다 적습니다. 비슷한 카운티의 일반적인 기록 수: ${typical}(중앙값 ${median}, 평균 ${mean}).`,
    some1: (name, n, date) =>
      `${date} 데이터 스냅숏에서 ${name}에는 해당하는 데이터 센터 프로젝트 기록(제안·허가·건설 중)이 ${n}건 있습니다.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `비슷한 카운티 ${total}곳 중 ${fewer}곳보다 많고, ${same}곳과 같으며, ${more}곳보다 적습니다. 비슷한 카운티의 일반적인 기록 수: ${typical}(중앙값 ${median}, 평균 ${mean}).`,
    noPeers: (total) => `이 스냅숏에서 비슷한 카운티 ${total}곳 중 해당 기록이 있는 곳은 없습니다.`,
    peers: (n, total, pct) => `비슷한 카운티 ${total}곳 중 ${n}곳(${pct}%)에 해당 기록이 하나 이상 있습니다.`,
    caveat:
      "비슷한 카운티는 인구와 인구 밀도가 가장 가까운 카운티이며, 선정에 데이터 센터 활동은 쓰지 않습니다. 숫자는 불완전한 하나의 데이터 스냅숏에 기록된 항목을 반영하므로, 이 비교는 서술적이며 원인, 영향, 통계적 유의성을 보여 주지 않습니다.",
  },

  embedNote: (date) =>
    `비슷한 카운티는 인구와 인구 밀도가 가장 가까운 40곳입니다. ${date} 기준 데이터, 출처: Compute Atlas(Edward Kubiak, CC BY 4.0) 및 미국 인구조사국. 기록된 항목만 포함하며 전체 프로젝트 수가 아닙니다.`,
  seeFull: "전체 비교 보기",
  errorTitle: "문제가 발생했습니다",
  errorBody: "페이지를 끝까지 불러오지 못했습니다. 사이트가 업데이트된 직후에 생길 수 있습니다. 새로 고치면 대개 해결되며, 선택한 카운티는 주소에 남아 있습니다.",
  reload: "새로 고침",
};

export default ko;
