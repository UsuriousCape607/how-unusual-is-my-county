import type { CountyMetric, Metadata, PeerRecord } from "../types";
import { fmtDate, fmtDateShort, fmtDensity, fmtInt, fmtStat, plural } from "../lib/format";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  metadata: Metadata;
}

export default function CountySummary({ county, peer, metadata }: Props) {
  const n = county.pipeline_count;
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  return (
    <section className="card summary" aria-labelledby="summary-title">
      <p className="eyebrow">Selected county · data as of {fmtDate(metadata.snapshot_date)}</p>
      <h2 id="summary-title">
        {county.county_name}, {county.state_name}
      </h2>
      <p className="muted small">
        Population {fmtInt(county.population_2025)} (2025) · {fmtDensity(county.density_per_sqmi)} people per sq mi · County code{" "}
        {county.geoid}
      </p>

      <div className="stat-row">
        <div className="stat stat-primary">
          <span className="stat-value">{n}</span>
          <span className="stat-label">qualifying pipeline {plural(n, "record", "records")} as of {fmtDateShort(metadata.snapshot_date)}</span>
        </div>
        <div className="stat">
          <span className="stat-value">{fmtStat(peer.peer_median)}</span>
          <span className="stat-label">peer median</span>
        </div>
        <div className="stat">
          <span className="stat-value">{fmtStat(peer.peer_mean, 2)}</span>
          <span className="stat-label">peer mean</span>
        </div>
      </div>

      <div className="breakdown" aria-label="Comparison with peer counties">
        <div>
          <strong>{peer.n_fewer}</strong> peers have fewer
        </div>
        <div>
          <strong>{peer.n_equal}</strong> have the same count
        </div>
        <div>
          <strong>{peer.n_greater}</strong> have more
        </div>
        <div className="muted">
          of {total} peers · {peer.n_peers_with_pipeline} ({fmtStat(peer.pct_peers_with_pipeline)}%) have at least one record
        </div>
      </div>

      {n === 0 && (
        <p className="zero-note">
          No qualifying pipeline records were found in this county in the selected dataset snapshot. That is not the same as having
          no proposed data centers.
        </p>
      )}
      <p className="coverage small">
        Pipeline means proposed, permitted, or under construction, with confirmed or reported confidence, in the Compute Atlas
        snapshot of {fmtDate(metadata.snapshot_date)}. These are documented site records in an incomplete public inventory, not a
        verified count of buildings. {county.operational_count > 0 && (
          <>Separately, {county.operational_count} operational {plural(county.operational_count, "record is", "records are")} documented here (not counted above).</>
        )}
      </p>
    </section>
  );
}
