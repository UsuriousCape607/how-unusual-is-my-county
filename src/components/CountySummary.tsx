import { useState } from "react";
import type { CountyMetric, Metadata, PeerRecord } from "../types";
import { fmtDateShort, fmtDensity, fmtInt, fmtStat, plural } from "../lib/format";
import { typicalPhrase, verdict } from "../lib/summary";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  metadata: Metadata;
  byGeoid: Map<string, CountyMetric>;
  onSelect: (geoid: string) => void;
}

// Diverging pair validated with the dataviz palette checker (CVD ΔE 22, contrast ≥ 3:1); grey is the neutral middle.
export const FEWER_COLOR = "#3d6aa6";
export const SAME_COLOR = "#d3d8de";
export const MORE_COLOR = "#b5822e";

function ComparisonBar({ peer, name }: { peer: PeerRecord; name: string }) {
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  const parts = [
    { key: "fewer", n: peer.n_fewer, color: FEWER_COLOR, label: "have fewer" },
    { key: "same", n: peer.n_equal, color: SAME_COLOR, label: "the same" },
    { key: "more", n: peer.n_greater, color: MORE_COLOR, label: "have more" },
  ];
  return (
    <div className="compare">
      <div
        className="compare-bar"
        role="img"
        aria-label={`Of ${total} similar counties, ${peer.n_fewer} have fewer sites on record than ${name}, ${peer.n_equal} have the same number, and ${peer.n_greater} have more.`}
      >
        {parts
          .filter((x) => x.n > 0)
          .map((x) => (
            <span key={x.key} style={{ flexGrow: x.n, background: x.color }} />
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

function ShareButton() {
  const [msg, setMsg] = useState("");
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMsg("Link copied");
    } catch {
      setMsg("Copy the address from your browser bar to share");
    }
    window.setTimeout(() => setMsg(""), 2500);
  };
  return (
    <span className="share">
      <button type="button" className="secondary small-btn" onClick={share}>
        Copy link to this county
      </button>
      <span role="status" aria-live="polite" className="muted small">
        {msg}
      </span>
    </span>
  );
}

export default function CountySummary({ county, peer, metadata, byGeoid, onSelect }: Props) {
  const n = county.pipeline_count;
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  const v = verdict(county, peer);
  const closest = peer.peer_geoids.slice(0, 3).map((g) => byGeoid.get(g)!);

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
        <ShareButton />
      </div>

      <p className={`verdict tone-${v.tone}`}>{v.headline}</p>

      <div className="hero-row">
        <div className="hero">
          <span className="hero-value">{n}</span>
          <span className="hero-label">
            data-center {plural(n, "site", "sites")} in development on record
            <span className="muted"> as of {fmtDateShort(metadata.snapshot_date)}</span>
          </span>
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
    </section>
  );
}
