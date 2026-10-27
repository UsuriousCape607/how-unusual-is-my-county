import type { CountyMetric, PeerRecord } from "../types";
import { countyLabel, fmtDate, fmtStat } from "./format";
import { getM } from "../i18n/state";

export type VerdictTone = "more" | "less" | "same" | "middle";

/**
 * One-line answer to "how unusual is my county?", restating the precomputed fewer/equal/greater counts in words.
 * "Most" means more than half of the 40 similar counties (21 or more). No new statistic is computed here.
 */
export function verdict(c: CountyMetric, p: PeerRecord): { headline: string; tone: VerdictTone } {
  const v = getM().verdict;
  const total = p.n_fewer + p.n_equal + p.n_greater;
  const half = total / 2;
  if (p.n_fewer === total) return { headline: v.moreAll(total), tone: "more" };
  if (p.n_greater === total) return { headline: v.lessAll(total), tone: "less" };
  if (p.n_fewer > half) return { headline: v.moreMost, tone: "more" };
  if (p.n_greater > half) return { headline: v.lessMost, tone: "less" };
  if (p.n_equal > half) return { headline: c.pipeline_count === 0 ? v.sameZero : v.same, tone: "same" };
  return { headline: v.middle, tone: "middle" };
}

/** Median of whole-number counts in words: 1 -> "1 site", 0.5 -> "0 to 1 sites", 0 -> "none". */
export function typicalPhrase(median: number): string {
  const t = getM().typical;
  if (median === 0) return t.none;
  if (Number.isInteger(median)) return t.sites(median);
  return t.range(Math.floor(median), Math.ceil(median));
}

/**
 * Deterministic plain-language summary built only from precomputed, validated metrics.
 * No numbers are calculated here; every figure comes straight from the exported JSON.
 */
export function templateSummary(c: CountyMetric, p: PeerRecord, snapshotDate: string): string[] {
  const t = getM().sum;
  const name = countyLabel(c);
  const date = fmtDate(snapshotDate);
  const n = c.pipeline_count;
  const total = p.n_fewer + p.n_equal + p.n_greater;
  const typical = typicalPhrase(p.peer_median);
  const median = fmtStat(p.peer_median);
  const mean = fmtStat(p.peer_mean, 2);
  return [
    ...(n === 0
      ? [t.zero1(name, date), t.zero2(p.n_equal, total, p.n_greater, typical, median, mean)]
      : [t.some1(name, n, date), t.some2(p.n_fewer, total, p.n_equal, p.n_greater, typical, median, mean)]),
    p.n_peers_with_pipeline === 0 ? t.noPeers(total) : t.peers(p.n_peers_with_pipeline, total, fmtStat(p.pct_peers_with_pipeline)),
    t.caveat,
  ];
}
