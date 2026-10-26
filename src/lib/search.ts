import type { CountyMetric } from "../types";

export interface SearchEntry {
  geoid: string;
  label: string; // "Loudoun County, VA"
  stateName: string;
  key: string; // normalized county name, e.g. "loudoun county"
  stateAbbr: string; // "va"
  stateKey: string; // normalized state name, e.g. "virginia"
}

export function normalize(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\bsaint\b/g, "st")
    .replace(/[.'’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildIndex(metrics: CountyMetric[]): SearchEntry[] {
  return metrics
    .map((m) => ({
      geoid: m.geoid,
      label: `${m.county_name}, ${m.state}`,
      stateName: m.state_name,
      key: normalize(m.county_name),
      stateAbbr: m.state.toLowerCase(),
      stateKey: normalize(m.state_name),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function stateMatches(e: SearchEntry, s: string): boolean {
  return s === e.stateAbbr || (s.length >= 3 && e.stateKey.startsWith(s));
}

function rank(key: string, q: string): number {
  if (!q) return 0;
  if (key === q) return 4;
  if (key.startsWith(q)) return 3;
  if (key.split(/[\s-]/).some((w) => w.startsWith(q))) return 2;
  if (key.includes(q)) return 1;
  return 0;
}

/**
 * Match "loudoun", "loudoun va", "Washington County, Oregon", "orleans parish" or a 5-digit GEOID.
 * Exact and prefix matches on the county name rank above word-prefix and substring matches.
 */
export function searchCounties(index: SearchEntry[], query: string, limit = 12): SearchEntry[] {
  const q = normalize(query);
  if (!q) return [];
  if (/^\d{5}$/.test(q)) return index.filter((e) => e.geoid === q);

  // Candidate (county part, state part) splits: "a, b" or trailing words as a state ("loudoun va").
  const splits: [string, string][] = [];
  if (q.includes(",")) {
    const [c, s] = q.split(",", 2).map((x) => x.trim());
    splits.push([c, s]);
  } else {
    splits.push([q, ""]);
    const words = q.split(" ");
    for (let i = words.length - 1; i > 0; i--) splits.push([words.slice(0, i).join(" "), words.slice(i).join(" ")]);
  }

  const scored: { e: SearchEntry; score: number }[] = [];
  for (const e of index) {
    let best = 0;
    for (const [c, s] of splits) {
      if (s && !stateMatches(e, s)) continue;
      best = Math.max(best, rank(e.key, c));
    }
    if (best > 0) scored.push({ e, score: best });
  }
  scored.sort((a, b) => b.score - a.score || a.e.label.localeCompare(b.e.label));
  return scored.slice(0, limit).map((s) => s.e);
}
