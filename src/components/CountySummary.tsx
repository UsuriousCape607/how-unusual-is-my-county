import type { CountyMetric, Facility, Metadata, PeerRecord } from "../types";
import { fmtDateShort, fmtDensity, fmtInt, fmtStat } from "../lib/format";
import { useM } from "../i18n/I18nProvider";
import { Rich } from "../i18n/Rich";
import { intlLocale } from "../i18n/state";
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
  const m = useM();
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  const parts = [
    { key: "fewer", n: peer.n_fewer, color: COLOR.fewer, label: m.cmp.fewer(peer.n_fewer) },
    { key: "same", n: peer.n_equal, color: COLOR.same, label: m.cmp.same(peer.n_equal) },
    { key: "more", n: peer.n_greater, color: COLOR.more, label: m.cmp.more(peer.n_greater) },
  ];
  return (
    <div className="compare">
      <div
        className="compare-bar"
        role="img"
        aria-label={m.barAria(total, peer.n_fewer, name, peer.n_equal, peer.n_greater)}
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
            <Rich text={x.label} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The closest counties as a list in the reader's language ("A, B, and C" / "A、B、C"), each a button. */
function ClosestList({ closest, onSelect }: { closest: CountyMetric[]; onSelect: (geoid: string) => void }) {
  let k = 0;
  const parts = new Intl.ListFormat(intlLocale(), { type: "conjunction" }).formatToParts(closest.map((c) => `${c.county_name}, ${c.state}`));
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "literal") return <span key={i}>{part.value}</span>;
        const c = closest[k++];
        return (
          <button key={i} type="button" className="linkish" onClick={() => onSelect(c.geoid)}>
            {part.value}
          </button>
        );
      })}
    </>
  );
}

export default function CountySummary({ county, peer, metadata, byGeoid, facilities, onSelect }: Props) {
  const m = useM();
  const n = county.pipeline_count;
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  const v = verdict(county, peer);
  const closest = peer.peer_geoids.slice(0, 3).map((g) => byGeoid.get(g)!);
  const st = metadata.state_context?.[county.state];
  // What's in the count: statuses as listed in the snapshot (precomputed in Python), only when there is a mix to show.
  const s = county.pipeline_by_status;
  const parts = s
    ? [
        { n: s.under_construction, label: m.statusLine.under_construction },
        { n: s.permitted, label: m.statusLine.permitted },
        { n: s.proposed, label: m.statusLine.proposed },
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
            {m.facts(fmtInt(county.population_2025), fmtDensity(county.density_per_sqmi), county.geoid)}
          </p>
        </div>
        <ShareMenu county={county} peer={peer} byGeoid={byGeoid} facilities={facilities} snapshotDate={metadata.snapshot_date} />
      </div>

      <p className="eyebrow">{m.shortAnswer}</p>
      <p key={`v-${county.geoid}`} className="verdict fade-in">{v.headline}</p>

      <div key={`h-${county.geoid}`} className="hero-row fade-in">
        <div className="hero-block">
          <div className="hero">
            <span className="hero-value">{n}</span>
            <span className="hero-label">
              {m.heroLabel(n)}
              <span className="muted">{m.heroAsOf(fmtDateShort(metadata.snapshot_date))}</span>
            </span>
          </div>
          {n >= 2 && parts.length > 0 && (
            <p className="status-line" aria-label={m.statusAria}>
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
            <dt>{m.typicalSimilar}</dt>
            <dd>{typicalPhrase(peer.peer_median)}</dd>
          </div>
          <div>
            <dt>{m.similarWithAny}</dt>
            <dd>{m.nOf(peer.n_peers_with_pipeline, total)}</dd>
          </div>
          <div>
            <dt>{m.averageSimilar}</dt>
            <dd>{fmtStat(peer.peer_mean, 2)}</dd>
          </div>
        </dl>
      </div>

      <h3 className="compare-title">{m.comparedWith(total)}</h3>
      <ComparisonBar peer={peer} name={county.county_name} />

      {n === 0 && (
        <p className="zero-note">{m.zeroNote}</p>
      )}

      <p className="similar-line small">
        <Rich text={m.similarLine} list={<ClosestList closest={closest} onSelect={onSelect} />} />
        {county.operational_count > 0 && <> {m.operatingNote(county.operational_count)}</>}
      </p>
      {st && (
        <p className="state-line small">
          {m.stateLine(st.state_name, st.with_pipeline, st.counties)}
        </p>
      )}
      <p className="small find-link">
        <a href="#find-project">{m.findLink}</a>
      </p>
    </section>
  );
}
