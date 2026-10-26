import { useState } from "react";
import type { CountyMetric, PeerRecord } from "../types";
import { fmtDateShort, fmtDensity, fmtInt } from "../lib/format";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  byGeoid: Map<string, CountyMetric>;
  snapshotDate: string;
  onSelect: (geoid: string) => void;
}

const INITIAL_ROWS = 10;

export default function PeerTable({ county, peer, byGeoid, snapshotDate, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const rows = peer.peer_geoids.map((g) => byGeoid.get(g)!);
  const shown = expanded ? rows : rows.slice(0, INITIAL_ROWS);

  return (
    <section className="card" aria-labelledby="peers-title">
      <h3 id="peers-title">The 40 similar counties, most similar first</h3>
      <p className="muted small">
        They range from {fmtInt(peer.peer_population_min)} to {fmtInt(peer.peer_population_max)} people and from{" "}
        {fmtDensity(peer.peer_density_min)} to {fmtDensity(peer.peer_density_max)} people per sq mi. Select a name to compare that
        county instead.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col" className="num">Rank</th>
              <th scope="col">County</th>
              <th scope="col">State</th>
              <th scope="col" className="num">Population (2025)</th>
              <th scope="col" className="num">People per sq mi</th>
              <th scope="col" className="num">Sites in development ({fmtDateShort(snapshotDate)})</th>
            </tr>
          </thead>
          <tbody>
            <tr className="selected-row">
              <td className="num">—</td>
              <td>{county.county_name} <span className="tag">This county</span></td>
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
          {expanded ? `Show only the ${INITIAL_ROWS} most similar` : `Show all ${rows.length} similar counties`}
        </button>
      )}
    </section>
  );
}
