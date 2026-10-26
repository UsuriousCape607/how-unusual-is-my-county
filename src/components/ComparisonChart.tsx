import { useMemo } from "react";
import {
  CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import type { CountyMetric, PeerRecord } from "../types";
import { countyLabel, fmtDensity, fmtInt, fmtStat } from "../lib/format";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  byGeoid: Map<string, CountyMetric>;
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

const NAVY = "#13294b";
const TEAL = "#2b8a8c";

function TooltipBody({ active, payload }: { active?: boolean; payload?: { payload: Pt }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="chart-tip">
      <strong>{p.label}</strong>
      {p.selected && <span className="tag">Selected</span>}
      <div>Pipeline records: {p.x}</div>
      <div>Population: {fmtInt(p.population)}</div>
      <div>Density: {fmtDensity(p.density)} per sq mi</div>
    </div>
  );
}

export default function ComparisonChart({ county, peer, byGeoid, onSelect }: Props) {
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

  const height = Math.min(440, Math.max(220, 90 + maxStack * 9));
  const ticks = maxX <= 15 ? Array.from({ length: maxX + 2 }, (_, i) => i) : undefined;

  return (
    <section className="card" aria-labelledby="chart-title">
      <h3 id="chart-title">Pipeline records: this county vs. its 40 peers</h3>
      <p className="muted small">
        Each teal dot is one peer county; dots with the same count are stacked. The navy diamond is {countyLabel(county)}. The dashed
        line marks the peer median ({fmtStat(peer.peer_median)}). Select a dot to switch counties. The peer table below lists the same
        values.
      </p>
      <figure
        className="chart"
        aria-label={`Dot plot: ${countyLabel(county)} has ${county.pipeline_count} records; ${peer.n_fewer} peers have fewer, ${peer.n_equal} the same, ${peer.n_greater} more.`}
      >
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 12, right: 16, bottom: 28, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="#e3e8ee" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, maxX + 1]}
              ticks={ticks}
              allowDecimals={false}
              tick={{ fill: "#4a5a70", fontSize: 12 }}
              label={{ value: "Qualifying pipeline records", position: "bottom", offset: 10, fill: "#4a5a70", fontSize: 12 }}
            />
            <YAxis type="number" dataKey="y" hide domain={[-1, maxStack + 1]} />
            <Tooltip content={<TooltipBody />} cursor={false} isAnimationActive={false} />
            <ReferenceLine x={peer.peer_median} stroke={NAVY} strokeDasharray="4 4" strokeOpacity={0.6} />
            <Scatter
              data={peers}
              isAnimationActive={false}
              shape={(props: { cx?: number; cy?: number; payload?: Pt }) => (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={4.5}
                  fill={TEAL}
                  fillOpacity={0.85}
                  stroke="#fff"
                  strokeWidth={1}
                  style={{ cursor: "pointer" }}
                  onClick={() => props.payload && onSelect(props.payload.geoid)}
                />
              )}
            />
            <Scatter
              data={selected}
              isAnimationActive={false}
              shape={(props: { cx?: number; cy?: number }) => {
                const cx = props.cx ?? 0;
                const cy = props.cy ?? 0;
                return <path d={`M${cx},${cy - 8} L${cx + 8},${cy} L${cx},${cy + 8} L${cx - 8},${cy} Z`} fill={NAVY} stroke="#fff" strokeWidth={1.5} />;
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </figure>
    </section>
  );
}
