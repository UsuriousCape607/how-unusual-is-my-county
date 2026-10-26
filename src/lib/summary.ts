import type { CountyMetric, PeerRecord } from "../types";
import { countyLabel, fmtDate, fmtStat, plural } from "./format";

export type VerdictTone = "more" | "less" | "same" | "middle";

/**
 * One-line answer to "how unusual is my county?", restating the precomputed fewer/equal/greater counts in words.
 * "Most" means more than half of the 40 similar counties (21 or more). No new statistic is computed here.
 */
export function verdict(c: CountyMetric, p: PeerRecord): { headline: string; tone: VerdictTone } {
  const total = p.n_fewer + p.n_equal + p.n_greater;
  const half = total / 2;
  if (p.n_fewer === total) return { headline: `More documented data-center development than all ${total} similar counties`, tone: "more" };
  if (p.n_greater === total) return { headline: `Less documented data-center development than all ${total} similar counties`, tone: "less" };
  if (p.n_fewer > half) return { headline: "More documented data-center development than most similar counties", tone: "more" };
  if (p.n_greater > half) return { headline: "Less documented data-center development than most similar counties", tone: "less" };
  if (p.n_equal > half) {
    return c.pipeline_count === 0
      ? { headline: "Like most similar counties, no documented data-center sites in development", tone: "same" }
      : { headline: "The same documented data-center development as most similar counties", tone: "same" };
  }
  return { headline: "In the middle compared with similar counties", tone: "middle" };
}

/** Median of whole-number counts in words: 1 -> "1 site", 0.5 -> "0 to 1 sites", 0 -> "none". */
export function typicalPhrase(median: number): string {
  if (median === 0) return "none";
  if (Number.isInteger(median)) return `${median} ${plural(median, "site", "sites")}`;
  return `${Math.floor(median)} to ${Math.ceil(median)} sites`;
}

/**
 * Deterministic plain-language summary built only from precomputed, validated metrics.
 * No numbers are calculated here; every figure comes straight from the exported JSON.
 */
export function templateSummary(c: CountyMetric, p: PeerRecord, snapshotDate: string): string[] {
  const name = countyLabel(c);
  const date = fmtDate(snapshotDate);
  const n = c.pipeline_count;
  const total = p.n_fewer + p.n_equal + p.n_greater;
  const out: string[] = [];

  if (n === 0) {
    out.push(`No qualifying pipeline records were found in ${name} in the selected dataset snapshot (${date}).`);
    out.push(
      `It has the same count (zero) as ${p.n_equal} of its ${total} similar counties, and fewer than ${p.n_greater}. ` +
        `A typical similar county has ${typicalPhrase(p.peer_median)} on record (median ${fmtStat(p.peer_median)}; average ${fmtStat(p.peer_mean, 2)}).`,
    );
  } else {
    out.push(
      `${name} has ${n} qualifying documented data-center pipeline ${plural(n, "record", "records")} ` +
        `(proposed, permitted, or under construction) in the ${date} dataset snapshot.`,
    );
    out.push(
      `That is more than ${p.n_fewer} of its ${total} similar counties, the same as ${p.n_equal}, and fewer than ${p.n_greater}. ` +
        `A typical similar county has ${typicalPhrase(p.peer_median)} on record (median ${fmtStat(p.peer_median)}; average ${fmtStat(p.peer_mean, 2)}).`,
    );
  }

  out.push(
    p.n_peers_with_pipeline === 0
      ? `None of the ${total} similar counties has a qualifying record in this snapshot.`
      : `${p.n_peers_with_pipeline} of the ${total} similar counties (${fmtStat(p.pct_peers_with_pipeline)}%) have at least one qualifying record.`,
  );

  out.push(
    "Similar counties are the ones closest in population and population density; data-center activity is not used to pick them. " +
      "Counts reflect documented records in one dataset snapshot, which is incomplete, so this comparison is descriptive and " +
      "does not show causes, impacts, or statistical significance.",
  );
  return out;
}
