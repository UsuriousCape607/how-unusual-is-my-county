import type { Translation } from "./en";

/** Spanish (U.S. conventions). Written with AI; review by a native speaker welcome. */
const sitio = (n: number) => (n === 1 ? "sitio" : "sitios");
const condado = (n: number) => (n === 1 ? "condado" : "condados");

const es: Translation = {
  siteTitle: "¿Qué tan inusual es mi condado?",
  subtitle: "Compara el desarrollo documentado de centros de datos con el de condados similares de todo Estados Unidos.",
  methodologyLink: "Metodología y fuentes",
  langNote: "Traducción hecha con IA, sin revisión de traductores profesionales ni de hablantes nativos; puede contener errores. Los nombres de condados y lugares se muestran en inglés.",
  printUrl: (url) => `Versión interactiva: ${url}`,
  loadErrorTitle: "No se pudieron cargar los archivos de datos.",
  loadErrorHelp: "Vuelve a cargar la página para intentarlo de nuevo; si ejecutas el sitio localmente, ejecuta primero <code>python scripts/build_all.py</code>.",
  loadingCounties: (n) => `Cargando datos de ${n} condados…`,
  loading: "Cargando…",
  embedLoadError: "No se pudo cargar esta comparación.",
  comparing: (name) => `Comparando <b>${name}</b>`,
  examplesAria: "Condados de ejemplo",
  tryLabel: "Prueba:",
  notFound: (code) => `No se encontró el código de condado ${code}, así que se muestra un condado de ejemplo.`,
  srShowing: (name, verdict) => `Mostrando ${name}: ${verdict}.`,
  footer: (attribution, transformations, version) =>
    `${attribution} (<a>licencia</a>). Transformaciones: ${transformations} Población, superficie terrestre y límites de condados: Oficina del Censo de EE. UU. (dominio público). Versión de datos <code>${version}</code>.`,
  footerFallback: "Datos de instalaciones: Compute Atlas, de Edward Kubiak (CC BY 4.0). Datos de condados: Oficina del Censo de EE. UU.",
  methodologyEnglish: "Esta sección solo está disponible en inglés.",

  language: "Idioma",
  languageButton: (name) => `Idioma: ${name}`,
  languagePanelNote:
    "Las traducciones se hicieron con IA y no las han revisado traductores profesionales ni hablantes nativos, así que pueden contener errores. Los nombres de condados y lugares están en inglés, así que busca en inglés.",
  done: "Listo",

  freshnessAria: "De cuándo son estos datos",
  dataAsOf: (date) => `Datos al <b>${date}</b>`,
  freshnessSub: (tag, popDate, geoVintage, built) =>
    `Los registros de instalaciones provienen de la instantánea ${tag} de Compute Atlas; no incluyen proyectos anunciados o modificados después de esa fecha. Población: estimaciones del Censo al ${popDate}. Límites y superficie: archivos del Censo de ${geoVintage}. Datos del sitio regenerados por última vez el ${built}.`,
  stale: (days) =>
    `Esta instantánea tiene más de ${days} días, así que puede haber registros más recientes. El inventario actualizado está en <a>compute-atlas.com</a>.`,

  findCounty: "Buscar un condado",
  searchPlaceholder: "p. ej., Loudoun County, VA",
  matchingCounties: "Condados que coinciden",
  noCountyMatch: (q) => `Ningún condado coincide con “${q}”. Prueba con el nombre del condado en inglés, “Nombre, ST” o un código de condado de 5 dígitos.`,

  facts: (pop, density, geoid) => `${pop} habitantes · ${density} por mi² · código de condado ${geoid}`,
  shortAnswer: "La respuesta corta",
  verdict: {
    moreAll: (total) => `Más desarrollo documentado de centros de datos que cualquiera de sus ${total} condados similares`,
    lessAll: (total) => `Menos desarrollo documentado de centros de datos que cualquiera de sus ${total} condados similares`,
    moreMost: "Más desarrollo documentado de centros de datos que la mayoría de los condados similares",
    lessMost: "Menos desarrollo documentado de centros de datos que la mayoría de los condados similares",
    sameZero: "Como la mayoría de los condados similares, ningún sitio de centro de datos en desarrollo documentado",
    same: "El mismo desarrollo documentado de centros de datos que la mayoría de los condados similares",
    middle: "En un punto intermedio frente a los condados similares",
  },
  heroLabel: (n) => `${sitio(n)} de centros de datos en desarrollo registrados`,
  heroAsOf: (date) => ` al ${date}`,
  statusAria: "Estado de estos sitios, según la instantánea",
  statusLine: { under_construction: "en construcción", permitted: "con permiso", proposed: "propuestos" },
  typicalSimilar: "Condado similar típico",
  similarWithAny: "Condados similares con alguno",
  nOf: (n, total) => `${n} de ${total}`,
  averageSimilar: "Promedio entre similares",
  typical: {
    none: "ninguno",
    sites: (n) => `${n} ${sitio(n)}`,
    range: (a, b) => `de ${a} a ${b} sitios`,
  },
  comparedWith: (total) => `Comparado con los ${total} condados más similares`,
  cmp: {
    fewer: (n) => `<b>${n}</b> tienen menos`,
    same: (n) => `<b>${n}</b> igual`,
    more: (n) => `<b>${n}</b> tienen más`,
  },
  barAria: (total, fewer, name, same, more) =>
    `De ${total} condados similares, ${fewer} tienen menos sitios registrados que ${name}, ${same} tienen la misma cantidad y ${more} tienen más.`,
  zeroNote:
    "No se encontraron registros de proyectos que califiquen en este condado en la instantánea de datos seleccionada. Eso no significa que aquí no se propongan centros de datos, solo que esta fuente no documenta ninguno.",
  similarLine: "“Similar” significa más cercano en población y densidad de población, en cualquier parte de EE. UU. Los más similares son <list/>.",
  operatingNote: (n) =>
    n === 1
      ? `Aparte, aquí hay registrado 1 centro de datos en funcionamiento (no se cuenta arriba).`
      : `Aparte, aquí hay registrados ${n} centros de datos en funcionamiento (no se cuentan arriba).`,
  stateLine: (state, withSites, counties) =>
    `En ${state}, ${withSites} de ${counties} ${condado(counties)} tienen al menos un sitio en desarrollo registrado.`,
  findLink: "¿Oíste hablar de un proyecto concreto? Mira si se cuenta",

  share: "Compartir",
  shareOptions: "Opciones para compartir",
  copyLink: "Copiar enlace",
  printSummary: "Imprimir resumen",
  downloadSimilar: "Descargar condados similares (CSV)",
  downloadSites: "Descargar sitios en desarrollo (CSV)",
  embedAction: "Insertar en un sitio web…",
  linkCopied: "Enlace copiado",
  copyFailed: "Aquí no se puede copiar; selecciona el texto y cópialo manualmente",
  downloadStarted: "Descarga iniciada",
  embedTitle: "Insertar esta comparación",
  embedHelp: (name) =>
    `Pega esto en tu página. Muestra la comparación de ${name}, con la fecha de los datos y el crédito de la fuente, y enlaza al sitio completo.`,
  embedCodeLabel: "Código para insertar",
  copyCode: "Copiar código",
  embedCopied: "Código copiado",

  explainTitle: "¿Qué significan estas cifras?",
  qCounted: "¿Qué se cuenta como “sitio en desarrollo”?",
  aCounted:
    "Un sitio de centro de datos que el inventario público de investigación Compute Atlas registra como <b>propuesto</b>, <b>con permiso</b> (aprobado) o <b>en construcción</b>, con fuentes confirmadas o reportadas. Los centros de datos en funcionamiento se cuentan aparte y solo se muestran como contexto. Cada cifra es el número de registros de sitios documentados, que no es lo mismo que un conteo verificado de edificios.",
  qSimilar: "¿Quiénes son los “condados similares”?",
  aSimilar: (total, name) =>
    `Los ${total} condados de EE. UU. más cercanos a ${name} tanto en población como en densidad de población (personas por milla cuadrada de tierra). La actividad de centros de datos no se usa para elegirlos, así que muestran lo habitual en lugares de este tamaño y densidad. Pueden estar en cualquier estado.`,
  qRead: "¿Cómo leo “menos, igual, más”?",
  aRead: (name, fewer, same, more, total) =>
    `Cada condado similar se compara con ${name}: ${fewer} tienen menos sitios registrados, ${same} tienen la misma cantidad y ${more} tienen más. “La mayoría” significa más de la mitad, es decir, al menos 21 de ${total}. El condado similar típico es el del medio cuando los ${total} se ordenan según su cifra (la mediana).`,
  qZero: "¿Qué significa un cero?",
  aZero:
    "Que no se encontró ningún registro que califique en esta instantánea de datos. No significa que no se proponga ningún centro de datos: el inventario está incompleto y los lugares mejor documentados pueden mostrar más registros.",
  qJudge: "¿Dice esto si el desarrollo aquí es bueno, malo o probable?",
  aJudge:
    "No. La herramienta solo cuenta registros documentados y los compara con lugares similares. No mide efectos ambientales ni económicos, no explica por qué un condado tiene más o menos registros y no predice proyectos futuros.",
  qCurrent: "¿Qué tan actuales son estos datos?",
  aCurrent: (snapshot, popDate) =>
    `Los registros provienen de la instantánea de Compute Atlas del ${snapshot}; no se incluyen proyectos anunciados o modificados después. El sitio busca cada semana una instantánea más reciente. Las cifras de población son estimaciones del Censo al ${popDate}.`,
  fullMethodology: "Metodología completa y fuentes",

  mapTitle: "Mapa",
  mapViewAria: "Vista del mapa",
  mapAria: "Mapa de condados. Selecciona un condado para compararlo.",
  view: { county: "Este condado", similar: "Condados similares", shaded: "Todos los condados" },
  thisCounty: "Este condado",
  sitesInDev: (n) => `${n} ${sitio(n)} en desarrollo`,
  hoverSimilar: {
    fewer: (name) => `Condado similar · menos que ${name}`,
    same: (name) => `Condado similar · igual que ${name}`,
    more: (name) => `Condado similar · más que ${name}`,
  },
  clickToCompare: "Haz clic para comparar",
  exactLocation: "Ubicación exacta",
  approxLocation: "Ubicación aproximada, no el sitio real",
  approxArea: (n) => `${n} sitios en esta zona aproximada`,
  andMore: (n) => `y ${n} más`,
  approxLocations: "Ubicaciones aproximadas, no los sitios reales",
  legendSimilarWith: "Condados similares con",
  legend: {
    fewer: (n) => `menos (${n})`,
    same: (n) => `igual (${n})`,
    more: (n) => `más (${n})`,
  },
  legendSites: "Sitios en desarrollo",
  legendThisCounty: "este condado",
  legendExact: (n) => `Ubicación exacta (${n})`,
  legendApprox: (n) => `Zona aproximada (${n})`,
  zoomHint: "Acerca el mapa para ver dónde están los sitios.",
  offMap: (list) => `También similares, fuera de esta vista: ${list}.`,

  chartTitle: (name) => `Dónde se ubica ${name} entre sus 40 condados similares`,
  chartHelp: (date, name) =>
    `Cada punto es un condado similar, colocado según su número de sitios en desarrollo registrados (${date}) y coloreado según tenga menos, igual o más que ${name}. Pasa el cursor para ver detalles; haz clic para comparar.`,
  chartAria: (label, n, fewer, same, more) =>
    `Gráfico de puntos: ${label} tiene ${n}; ${fewer} condados similares tienen menos, ${same} igual y ${more} más.`,
  axisLabel: "Sitios de centros de datos en desarrollo registrados",
  typicalMark: (phrase) => `Típico: ${phrase}`,
  peopleDensity: (pop, density) => `${pop} habitantes · ${density} por mi²`,
  clickToCompareCounty: "Haz clic para comparar este condado",

  recordsTitle: (name, n) => `Sitios en desarrollo registrados en ${name} (${n})`,
  recordsHelp: (date) =>
    `Sitios de centros de datos propuestos, con permiso o en construcción documentados en la instantánea de Compute Atlas del ${date}, con enlaces a las fuentes originales. La fecha de “Última actualización” de un registro indica cuándo se revisó por última vez la información de su fuente.`,
  noRecords: "No se encontraron registros de proyectos que califiquen en este condado en la instantánea de datos seleccionada.",
  operatingSummary: (n) => `${n} ${n === 1 ? "centro de datos en funcionamiento" : "centros de datos en funcionamiento"} (solo contexto, no se cuentan arriba)`,
  reportFoot: "¿Falta un sitio o ves un error? <a>Repórtalo a Compute Atlas</a>, la fuente que usa este sitio.",
  field: {
    operator: "Operador",
    status: "Estado",
    confidence: "Confianza",
    location: "Ubicación",
    assignment: "Asignación de condado",
    updated: "Última actualización",
  },
  recordId: (id) => `Registro de Compute Atlas: ${id}`,
  confidence: { confirmed: "confirmado", reported: "reportado", rumored: "rumor" },
  status: {
    proposed: "Propuesto",
    permitted: "Con permiso",
    under_construction: "En construcción",
    operational: "En funcionamiento",
    cancelled: "Cancelado",
  },
  precision: { exact: "Coordenadas exactas", approximate: "Ubicación aproximada" },
  assignment: {
    spatial_join: "Condado según las coordenadas del mapa",
    spatial_nearest_name_confirmed: "Condado según las coordenadas (costa), nombre confirmado",
    source_name_match: "Condado según el nombre indicado en la fuente",
  },
  reasons: {
    "status:operational": "Ya está en funcionamiento (se muestra aparte como contexto)",
    "status:cancelled": "Cancelado",
    "facility_type:power_generation": "Un proyecto de generación de energía, no un centro de datos",
    "facility_type:crypto_mining": "Un sitio de minería de criptomonedas, no un centro de datos",
    "confidence:rumored": "Solo es un rumor (confianza baja)",
    "assignment:outside_geographic_scope": "Fuera de los 50 estados y DC",
    "assignment:unresolved_multi_site": "Abarca varios sitios sin un único condado",
    "assignment:approximate_without_source_county": "Ubicación aproximada sin condado indicado",
    "assignment:ambiguous_source_county_name": "Su nombre de condado coincide con más de un condado",
    "assignment:unrecognized_source_county_name": "Su nombre de condado no es un condado del Censo de 2025",
    "assignment:conflict_point_county_vs_source_county": "Su ubicación en el mapa y el condado indicado no coinciden",
    "assignment:conflict_point_state_vs_source_state": "Su ubicación en el mapa y el estado indicado no coinciden",
    "assignment:point_outside_county_polygons": "Su ubicación en el mapa queda fuera de todos los condados",
    "assignment:point_on_county_boundary_ambiguous": "Está justo en el límite entre condados",
  },

  findTitle: "Buscar un proyecto",
  findHelp:
    "¿Oíste hablar de un proyecto concreto? Busca entre todos los registros de la instantánea por nombre, empresa o lugar para ver si se cuenta y, si no, por qué.",
  findLabel: "Buscar proyectos",
  findPlaceholder: "p. ej., Meta, Project Mica, Abilene",
  findLoading: "Cargando los más de 2,000 registros de proyectos…",
  findError: "No se pudo cargar la lista de proyectos. Revisa tu conexión e inténtalo de nuevo.",
  findNone: (q) => `Ningún proyecto coincide con “${q}”. Puede que Compute Atlas aún no lo registre; puedes <a>reportarlo a Compute Atlas</a>.`,
  source: "Fuente",
  projectType: { data_center: "Centro de datos", crypto_mining: "Minería de criptomonedas", power_generation: "Generación de energía" },
  countedHere: "Se cuenta aquí",
  countedHereNote: "Incluido en la cifra de este condado.",
  counted: "Se cuenta",
  countedIn: (where) => `En ${where}.`,
  compareCounty: (name) => `Comparar ${name}`,
  operating: "En funcionamiento",
  operatingContext: (where) => (where ? `Se muestra como contexto en ${where}, no en la cifra.` : "Se muestra como contexto, no en la cifra."),
  notCounted: "No se cuenta",
  findFoot: "¿Sabes de un proyecto que falta o tiene errores? <a>Repórtalo a Compute Atlas</a>, la fuente que usa este sitio.",

  peersTitle: "Los 40 condados similares, del más al menos parecido",
  peersRange: (p0, p1, d0, d1) =>
    `Van de ${p0} a ${p1} habitantes y de ${d0} a ${d1} habitantes por mi². Selecciona un nombre para comparar ese condado.`,
  col: {
    rank: "Puesto",
    county: "Condado",
    state: "Estado",
    population: "Población (2025)",
    density: "Habitantes por mi²",
    sites: (date) => `Sitios en desarrollo (${date})`,
  },
  showFewer: (n) => `Mostrar solo los ${n} más similares`,
  showAll: (n) => `Mostrar los ${n} condados similares`,

  summaryTitle: "Resumen",
  aiChip: "Explicación escrita por IA · generada de antemano y verificada",
  aiEnglishOnly: "Esta explicación solo está disponible en inglés.",
  aiNote: (model, date, status) =>
    `Escrita una sola vez por ${model} a partir de las cifras de este condado en la instantánea del ${date}, y luego verificada número por número (${status}). No se genera en vivo. La instrucción, los datos de entrada y las verificaciones están en AI_EVALUATION.md.`,
  templateChip: "Resumen automático · plantilla fija a partir de las cifras calculadas (no escrito por IA)",
  aiExamples: "Ejemplos escritos por IA:",
  sum: {
    zero1: (name, date) => `No se encontraron registros de proyectos que califiquen en ${name} en la instantánea de datos seleccionada (${date}).`,
    zero2: (same, total, more, typical, median, mean) =>
      `Tiene la misma cifra (cero) que ${same} de sus ${total} condados similares, y menos que ${more}. Condado similar típico: ${typical} (mediana ${median}; promedio ${mean}).`,
    some1: (name, n, date) =>
      `${name} tiene ${n} ${n === 1 ? "registro documentado" : "registros documentados"} de proyectos de centros de datos que califican (propuestos, con permiso o en construcción) en la instantánea de datos del ${date}.`,
    some2: (fewer, total, same, more, typical, median, mean) =>
      `Es más que ${fewer} de sus ${total} condados similares, igual que ${same} y menos que ${more}. Condado similar típico: ${typical} (mediana ${median}; promedio ${mean}).`,
    noPeers: (total) => `Ninguno de los ${total} condados similares tiene un registro que califique en esta instantánea.`,
    peers: (n, total, pct) => `${n} de los ${total} condados similares (${pct} %) tienen al menos un registro que califica.`,
    caveat:
      "Los condados similares son los más cercanos en población y densidad de población; la actividad de centros de datos no se usa para elegirlos. Las cifras reflejan registros documentados en una sola instantánea de datos, que está incompleta, así que esta comparación es descriptiva y no muestra causas, impactos ni significancia estadística.",
  },

  embedNote: (date) =>
    `Los condados similares son los 40 más cercanos en población y densidad de población. Datos al ${date} de Compute Atlas (Edward Kubiak, CC BY 4.0) y la Oficina del Censo de EE. UU. Solo registros documentados; no es un conteo de todos los proyectos.`,
  seeFull: "Ver la comparación completa",
  errorTitle: "Algo salió mal",
  errorBody:
    "La página no terminó de cargarse. Esto puede pasar justo después de actualizar el sitio. Volver a cargar suele solucionarlo; tu condado se conserva en la dirección.",
  reload: "Volver a cargar",
};

export default es;
