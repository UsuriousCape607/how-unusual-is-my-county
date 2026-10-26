const intFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function fmtInt(n: number): string {
  return intFmt.format(n);
}

/** Density with sensible precision: 0.3, 12.4, 1,234 people per sq mi. */
export function fmtDensity(n: number | null): string {
  if (n === null) return "n/a";
  if (n < 10) return n.toFixed(1);
  if (n < 100) return n.toFixed(1);
  return intFmt.format(n);
}

/** Median of integer counts is a whole or half number; show it without trailing zeros. */
export function fmtStat(n: number, digits = 1): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(digits).replace(/\.0$/, "");
}

export function fmtDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

export function countyLabel(c: { county_name: string; state: string }): string {
  return `${c.county_name}, ${c.state}`;
}

const STATUS_LABELS: Record<string, string> = {
  proposed: "Proposed",
  permitted: "Permitted",
  under_construction: "Under construction",
  operational: "Operational",
  cancelled: "Cancelled",
};

export function statusLabel(s?: string): string | undefined {
  return s ? STATUS_LABELS[s] ?? s : undefined;
}

export function precisionLabel(p?: string): string | undefined {
  if (!p) return undefined;
  if (p === "exact") return "Exact coordinates";
  if (p === "approximate") return "Approximate location";
  return p;
}

export function assignmentLabel(m?: string): string | undefined {
  if (!m) return undefined;
  if (m === "spatial_join") return "County from map coordinates";
  if (m === "spatial_nearest_name_confirmed") return "County from coordinates (shoreline), name confirmed";
  if (m === "source_name_match") return "County from source county name";
  return m;
}
