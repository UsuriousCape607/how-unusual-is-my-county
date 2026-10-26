import { useMemo } from "react";
import {
  CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import type { CountyMetric, PeerRecord } from "../types";
import { countyLabel, fmtDateShort, fmtDensity, fmtInt } from "../lib/format";
import { typicalPhrase } from "../lib/summary";
import { COLOR, comparisonOf, type Comparison } from "../lib/theme";

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
  cmp: Comparison;
}

const CMP_COLOR: Record<Comparison, string> = { fewer: COLOR.fewer, same: COLOR.same, more: COLOR.more };

function TooltipBody({ active, payload }: { active?: boolean; payload?: { payload: Pt }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="chart-tip">
      <strong>{p.label}</strong>
      {p.selected && <span className="tag">This county</span>}
      <div>{p.x} {p.x === 1 ? "site" : "sites"} in development</div>
      <div className="muted">
        {fmtInt(p.population)} people · {fmtDensity(p.density)} per sq mi
      </div>
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
          x: c.pipeline_count, y: level, geoid: c.geoid, label: countyLabel(c), population: c.population_2025,
          density: c.density_per_sqmi, selected: false, cmp: comparisonOf(c.pipeline_count, county.pipeline_count),
        };
      });
    const sel: Pt = {
      x: county.pipeline_count, y: 0, geoid: county.geoid, label: countyLabel(county), population: county.population_2025,
      density: county.density_per_sqmi, selected: true, cmp: "same",
    };
    return {
      peers: pts,
      selected: [sel],
      maxX: Math.max(county.pipeline_count, ...pts.map((p) => p.x)),
      maxStack: Math.max(...stacks.values()),
    };
  }, [county, peer, byGeoid]);

  const height = Math.min(460, Math.max(240, 110 + maxStack * 9));
  const ticks = maxX <= 15 ? Array.from({ length: maxX + 2 }, (_, i) => i) : undefined;
  // Keep labels inside the plot near either end of the axis.
  const anchorAt = (x: number) => {
    const pos = x / (maxX + 1);
    return pos < 0.2 ? "start" : pos > 0.75 ? "end" : "middle";
  };

  return (
    <section className="card" aria-labelledby="chart-title">
      <h3 id="chart-title">Where {county.county_name} falls among its 40 similar counties</h3>
      <p className="muted small">
        Each dot is one similar county, placed by its number of sites in development on record ({fmtDateShort(snapshotDate)}) and
        coloured by whether it has fewer, the same, or more than {county.county_name}. Hover for details; click to compare.
      </p>
      <figure
        className="chart"
        aria-label={`Dot plot: ${countyLabel(county)} has ${county.pipeline_count}; ${peer.n_fewer} similar counties have fewer, ${peer.n_equal} the same, ${peer.n_greater} more.`}
      >
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 28, right: 24, bottom: 30, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="#ececf0" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, maxX + 1]}
              ticks={ticks}
              allowDecimals={false}
              tick={{ fill: COLOR.muted, fontSize: 12 }}
              stroke={COLOR.separator}
              tickLine={false}
              label={{ value: "Data-center sites in development on record", position: "bottom", offset: 12, fill: COLOR.muted, fontSize: 12 }}
            />
            <YAxis type="number" dataKey="y" hide domain={[-2.6, maxStack + 1]} />
            <Tooltip content={<TooltipBody />} cursor={false} isAnimationActive={false} />
            <ReferenceLine
              x={peer.peer_median}
              stroke={COLOR.muted}
              strokeDasharray="3 4"
              label={({ viewBox }: { viewBox?: { x: number; y: number } }) => {
                const anchor = anchorAt(peer.peer_median);
                const dx = anchor === "start" ? -4 : anchor === "end" ? 4 : 0;
                return (
                  <text x={(viewBox?.x ?? 0) + dx} y={(viewBox?.y ?? 0) - 8} textAnchor={anchor} fontSize={12} fill={COLOR.muted}>
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
                  <circle cx={props.cx} cy={props.cy} r={4.5} fill={CMP_COLOR[props.payload?.cmp ?? "same"]} stroke="#fff" strokeWidth={1.5} />
                </g>
              )}
            />
            <Scatter
              data={selected}
              isAnimationActive={false}
              shape={(props: { cx?: number; cy?: number }) => {
                const cx = props.cx ?? 0;
                const cy = props.cy ?? 0;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={7.5} fill={COLOR.blue} stroke="#fff" strokeWidth={2.5} />
                    <text x={cx} y={cy + 22} textAnchor={anchorAt(county.pipeline_count)} fontSize={12} fontWeight={600} fill={COLOR.ink}>
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
