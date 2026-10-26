import { useMemo } from "react";
import {
  CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import type { CountyMetric, PeerRecord } from "../types";
import { countyLabel, fmtDateShort, fmtDensity, fmtInt } from "../lib/format";
import { typicalPhrase } from "../lib/summary";
import { NAVY, PEER_FILL, PEER_STROKE } from "./CountyMap";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  byGeoid: Map<string, CountyMetric>;
  snapshotDate: string;
  onSelect: (geoid: string) => void;
}

interface Pt {
  x: number;
  y: number;
  geoid: string;
  label: string;
  population: number;
  density: number | null;
  selected: boolean;
}

const INK_2 = "#3d4f68";

function TooltipBody({ active, payload }: { active?: boolean; payload?: { payload: Pt }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="chart-tip">
      <strong>{p.label}</strong>
      {p.selected && <span className="tag">This county</span>}
      <div>Sites in development: {p.x}</div>
      <div>Population: {fmtInt(p.population)}</div>
      <div>People per sq mi: {fmtDensity(p.density)}</div>
      {!p.selected && <div className="muted">Click to compare this county</div>}
    </div>
  );
}

export default function ComparisonChart({ county, peer, byGeoid, snapshotDate, onSelect }: Props) {
  const { peers, selected, maxX, maxStack } = useMemo(() => {
    const stacks = new Map<number, number>();
    const pts: Pt[] = peer.peer_geoids
      .map((g) => byGeoid.get(g)!)
      .sort((a, b) => a.pipeline_count - b.pipeline_count || a.geoid.localeCompare(b.geoid))
      .map((c) => {
        const level = (stacks.get(c.pipeline_count) ?? 0) + 1;
        stacks.set(c.pipeline_count, level);
        return {
          x: c.pipeline_count, y: level, geoid: c.geoid, label: countyLabel(c),
          population: c.population_2025, density: c.density_per_sqmi, selected: false,
        };
      });
    const sel: Pt = {
      x: county.pipeline_count, y: 0, geoid: county.geoid, label: countyLabel(county),
      population: county.population_2025, density: county.density_per_sqmi, selected: true,
    };
    return {
      peers: pts,
      selected: [sel],
      maxX: Math.max(county.pipeline_count, ...pts.map((p) => p.x)),
      maxStack: Math.max(...stacks.values()),
    };
  }, [county, peer, byGeoid]);

  const height = Math.min(460, Math.max(240, 110 + maxStack * 9));
  // Keep the selected county's label inside the plot near either end of the axis.
  const pos = county.pipeline_count / (maxX + 1);
  const labelAnchor = pos < 0.2 ? "start" : pos > 0.75 ? "end" : "middle";
  const ticks = maxX <= 15 ? Array.from({ length: maxX + 2 }, (_, i) => i) : undefined;

  return (
    <section className="card" aria-labelledby="chart-title">
      <h3 id="chart-title">Where {county.county_name} falls among its 40 similar counties</h3>
      <p className="muted small">
        Each teal dot is one similar county, placed by its number of sites in development on record ({fmtDateShort(snapshotDate)}).
        Counties with the same number are stacked. Hover or tap a dot for details; click one to compare it instead. The table below
        lists the same numbers.
      </p>
      <figure
        className="chart"
        aria-label={`Dot plot: ${countyLabel(county)} has ${county.pipeline_count}; ${peer.n_fewer} similar counties have fewer, ${peer.n_equal} the same, ${peer.n_greater} more.`}
      >
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 28, right: 24, bottom: 30, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="#e6eaef" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, maxX + 1]}
              ticks={ticks}
              allowDecimals={false}
              tick={{ fill: "#4a5a70", fontSize: 12 }}
              stroke="#c5ced8"
              label={{ value: "Data-center sites in development on record", position: "bottom", offset: 12, fill: "#4a5a70", fontSize: 12 }}
            />
            <YAxis type="number" dataKey="y" hide domain={[-2.6, maxStack + 1]} />
            <Tooltip content={<TooltipBody />} cursor={false} isAnimationActive={false} />
            <ReferenceLine
              x={peer.peer_median}
              stroke={INK_2}
              strokeDasharray="4 4"
              strokeOpacity={0.7}
              label={({ viewBox }: { viewBox?: { x: number; y: number } }) => {
                // Anchor the label away from the plot edge so it is never clipped.
                const medPos = peer.peer_median / (maxX + 1);
                const anchor = medPos < 0.25 ? "start" : medPos > 0.75 ? "end" : "middle";
                const dx = anchor === "start" ? -4 : anchor === "end" ? 4 : 0;
                return (
                  <text x={(viewBox?.x ?? 0) + dx} y={(viewBox?.y ?? 0) - 8} textAnchor={anchor} fontSize={12} fill={INK_2}>
                    Typical: {typicalPhrase(peer.peer_median)}
                  </text>
                );
              }}
            />
            <Scatter
              data={peers}
              isAnimationActive={false}
              shape={(props: { cx?: number; cy?: number; payload?: Pt }) => (
                <g style={{ cursor: "pointer" }} onClick={() => props.payload && onSelect(props.payload.geoid)}>
                  <circle cx={props.cx} cy={props.cy} r={10} fill="transparent" />
                  <circle cx={props.cx} cy={props.cy} r={4.5} fill={PEER_FILL} stroke={PEER_STROKE} strokeWidth={1.2} />
                </g>
              )}
            />
            <Scatter
              data={selected}
              isAnimationActive={false}
              shape={(props: { cx?: number; cy?: number; payload?: Pt }) => {
                const cx = props.cx ?? 0;
                const cy = props.cy ?? 0;
                return (
                  <g>
                    <path d={`M${cx},${cy - 8} L${cx + 8},${cy} L${cx},${cy + 8} L${cx - 8},${cy} Z`} fill={NAVY} stroke="#fff" strokeWidth={2} />
                    <text x={cx} y={cy + 20} textAnchor={labelAnchor} fontSize={12} fontWeight={600} fill={NAVY}>
                      {county.county_name}: {county.pipeline_count}
                    </text>
                  </g>
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </figure>
    </section>
  );
}
