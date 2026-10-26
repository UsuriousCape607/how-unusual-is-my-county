import type { CountyMetric, PeerRecord } from "../types";
import { countyLabel, fmtDate, fmtStat, plural } from "./format";

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
  } else {
    out.push(
      `${name} has ${n} qualifying documented data-center pipeline ${plural(n, "record", "records")} ` +
        `(proposed, permitted, or under construction) in the ${date} dataset snapshot.`,
    );
  }

  if (n === 0) {
    out.push(
      `It has the same count (zero) as ${p.n_equal} of its ${total} peer counties, and fewer than ${p.n_greater}. ` +
        `The peer median is ${fmtStat(p.peer_median)} and the peer mean is ${fmtStat(p.peer_mean, 2)}.`,
    );
  } else {
    out.push(
      `That is more than ${p.n_fewer} of its ${total} peer counties, the same as ${p.n_equal}, ` +
        `and fewer than ${p.n_greater}. The peer median is ${fmtStat(p.peer_median)} and the peer mean is ${fmtStat(p.peer_mean, 2)}.`,
    );
  }

  out.push(
    p.n_peers_with_pipeline === 0
      ? `None of the ${total} peers has a qualifying record in this snapshot.`
      : `${p.n_peers_with_pipeline} of the ${total} peers (${fmtStat(p.pct_peers_with_pipeline)}%) have at least one qualifying record.`,
  );

  out.push(
    "Peers are the counties most similar in population and population density; data-center activity is not used to pick them. " +
      "Counts reflect documented records in one dataset snapshot, which is incomplete, so this comparison is descriptive and " +
      "does not show causes, impacts, or statistical significance.",
  );
  return out;
}
