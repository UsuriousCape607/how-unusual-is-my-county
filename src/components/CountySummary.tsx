import type { CountyMetric, Facility, Metadata, PeerRecord } from "../types";
import { fmtDateShort, fmtDensity, fmtInt, fmtStat, plural } from "../lib/format";
import { typicalPhrase, verdict } from "../lib/summary";
import { COLOR } from "../lib/theme";
import ShareMenu from "./ShareMenu";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  metadata: Metadata;
  byGeoid: Map<string, CountyMetric>;
  facilities: Facility[];
  onSelect: (geoid: string) => void;
}


export function ComparisonBar({ peer, name }: { peer: PeerRecord; name: string }) {
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  const parts = [
    { key: "fewer", n: peer.n_fewer, color: COLOR.fewer, label: "have fewer" },
    { key: "same", n: peer.n_equal, color: COLOR.same, label: "the same" },
    { key: "more", n: peer.n_greater, color: COLOR.more, label: "have more" },
  ];
  return (
    <div className="compare">
      <div
        className="compare-bar"
        role="img"
        aria-label={`Of ${total} similar counties, ${peer.n_fewer} have fewer sites on record than ${name}, ${peer.n_equal} have the same number, and ${peer.n_greater} have more.`}
      >
        {/* All three segments always render so a change of county morphs the split (zero-width when empty). */}
        {parts.map((x, i) => (
          <span
            key={x.key}
            className={x.n === 0 ? "empty" : undefined}
            style={{ flexGrow: x.n, background: x.color, marginLeft: x.n > 0 && parts.slice(0, i).some((y) => y.n > 0) ? 2 : 0 }}
          />
        ))}
      </div>
      <ul className="compare-labels" aria-hidden="true">
        {parts.map((x) => (
          <li key={x.key} className={x.n === 0 ? "zero" : undefined}>
            <i style={{ background: x.color }} />
            <strong>{x.n}</strong> {x.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CountySummary({ county, peer, metadata, byGeoid, facilities, onSelect }: Props) {
  const n = county.pipeline_count;
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  const v = verdict(county, peer);
  const closest = peer.peer_geoids.slice(0, 3).map((g) => byGeoid.get(g)!);
  const st = metadata.state_context?.[county.state];
  // What's in the count: statuses as listed in the snapshot (precomputed in Python), only when there is a mix to show.
  const s = county.pipeline_by_status;
  const parts = s
    ? [
        { n: s.under_construction, label: "under construction" },
        { n: s.permitted, label: "permitted" },
        { n: s.proposed, label: "proposed" },
      ].filter((x) => x.n > 0)
    : [];

  return (
    <section className="card answer" aria-labelledby="summary-title">
      <div className="answer-head">
        <div>
          <h2 id="summary-title">
            {county.county_name}, {county.state_name}
          </h2>
          <p className="muted small facts">
            {fmtInt(county.population_2025)} people · {fmtDensity(county.density_per_sqmi)} per sq mi · county code {county.geoid}
          </p>
        </div>
        <ShareMenu county={county} peer={peer} byGeoid={byGeoid} facilities={facilities} snapshotDate={metadata.snapshot_date} />
      </div>

      <p className="eyebrow">The short answer</p>
      <p key={`v-${county.geoid}`} className="verdict fade-in">{v.headline}</p>

      <div key={`h-${county.geoid}`} className="hero-row fade-in">
        <div className="hero-block">
          <div className="hero">
            <span className="hero-value">{n}</span>
            <span className="hero-label">
              data-center {plural(n, "site", "sites")} in development on record
              <span className="muted"> as of {fmtDateShort(metadata.snapshot_date)}</span>
            </span>
          </div>
          {n >= 2 && parts.length > 0 && (
            <p className="status-line" aria-label="Status of these sites, as listed in the snapshot">
              {parts.map((x, i) => (
                <span key={x.label}>
                  {i > 0 && <span className="sep"> · </span>}
                  <strong>{x.n}</strong> {x.label}
                </span>
              ))}
            </p>
          )}
        </div>
        <dl className="side-facts">
          <div>
            <dt>Typical similar county</dt>
            <dd>{typicalPhrase(peer.peer_median)}</dd>
          </div>
          <div>
            <dt>Similar counties with any</dt>
            <dd>
              {peer.n_peers_with_pipeline} of {total}
            </dd>
          </div>
          <div>
            <dt>Average among similar</dt>
            <dd>{fmtStat(peer.peer_mean, 2)}</dd>
          </div>
        </dl>
      </div>

      <h3 className="compare-title">Compared with the {total} most similar counties</h3>
      <ComparisonBar peer={peer} name={county.county_name} />

      {n === 0 && (
        <p className="zero-note">
          No qualifying pipeline records were found in this county in the selected dataset snapshot. That does not mean no data
          centers are proposed here, only that none is documented in this source.
        </p>
      )}

      <p className="similar-line small">
        “Similar” means closest in population and population density, anywhere in the U.S. The most similar are{" "}
        {closest.map((c, i) => (
          <span key={c.geoid}>
            <button type="button" className="linkish" onClick={() => onSelect(c.geoid)}>
              {c.county_name}, {c.state}
            </button>
            {i < closest.length - 2 ? ", " : i === closest.length - 2 ? " and " : ""}
          </span>
        ))}
        .
        {county.operational_count > 0 && (
          <>
            {" "}
            Separately, {county.operational_count} operating data-center {plural(county.operational_count, "site is", "sites are")} on
            record here (not counted above).
          </>
        )}
      </p>
      {st && (
        <p className="state-line small">
          In {st.state_name}, {st.with_pipeline} of {st.counties} {plural(st.counties, "county", "counties")} have at least one site in
          development on record.
        </p>
      )}
      <p className="small find-link">
        <a href="#find-project">Heard about a specific project? See whether it’s counted</a>
      </p>
    </section>
  );
}
