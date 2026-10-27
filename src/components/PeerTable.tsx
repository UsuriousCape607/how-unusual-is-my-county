import { useState } from "react";
import type { CountyMetric, PeerRecord } from "../types";
import { fmtDateShort, fmtDensity, fmtInt } from "../lib/format";
import { useM } from "../i18n/I18nProvider";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  byGeoid: Map<string, CountyMetric>;
  snapshotDate: string;
  onSelect: (geoid: string) => void;
}

const INITIAL_ROWS = 10;

export default function PeerTable({ county, peer, byGeoid, snapshotDate, onSelect }: Props) {
  const m = useM();
  const [expanded, setExpanded] = useState(false);
  const rows = peer.peer_geoids.map((g) => byGeoid.get(g)!);
  const shown = expanded ? rows : rows.slice(0, INITIAL_ROWS);

  return (
    <section className="card" aria-labelledby="peers-title">
      <h3 id="peers-title">{m.peersTitle}</h3>
      <p className="muted small">
        {m.peersRange(fmtInt(peer.peer_population_min), fmtInt(peer.peer_population_max), fmtDensity(peer.peer_density_min), fmtDensity(peer.peer_density_max))}
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col" className="num">{m.col.rank}</th>
              <th scope="col">{m.col.county}</th>
              <th scope="col">{m.col.state}</th>
              <th scope="col" className="num">{m.col.population}</th>
              <th scope="col" className="num">{m.col.density}</th>
              <th scope="col" className="num">{m.col.sites(fmtDateShort(snapshotDate))}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="selected-row">
              <td className="num">—</td>
              <td>{county.county_name} <span className="tag">{m.thisCounty}</span></td>
              <td>{county.state}</td>
              <td className="num">{fmtInt(county.population_2025)}</td>
              <td className="num">{fmtDensity(county.density_per_sqmi)}</td>
              <td className="num">{county.pipeline_count}</td>
            </tr>
            {shown.map((c, i) => (
              <tr key={c.geoid}>
                <td className="num">{i + 1}</td>
                <td>
                  <button type="button" className="linkish" onClick={() => onSelect(c.geoid)}>
                    {c.county_name}
                  </button>
                </td>
                <td>{c.state}</td>
                <td className="num">{fmtInt(c.population_2025)}</td>
                <td className="num">{fmtDensity(c.density_per_sqmi)}</td>
                <td className="num">{c.pipeline_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > INITIAL_ROWS && (
        <button type="button" className="secondary" aria-expanded={expanded} onClick={() => setExpanded((e) => !e)}>
          {expanded ? m.showFewer(INITIAL_ROWS) : m.showAll(rows.length)}
        </button>
      )}
    </section>
  );
}
