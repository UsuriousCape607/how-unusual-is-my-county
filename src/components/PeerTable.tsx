import { useState } from "react";
import type { CountyMetric, Metadata, PeerRecord } from "../types";
import { fmtDateShort, fmtDensity, fmtInt, fmtUSD } from "../lib/format";
import { useI18n } from "../i18n/I18nProvider";
import { LANGUAGE } from "../i18n/languages";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  byGeoid: Map<string, CountyMetric>;
  snapshotDate: string;
  income?: NonNullable<Metadata["census"]["income"]>;
  onSelect: (geoid: string) => void;
}

const INITIAL_ROWS = 10;

type SortKey = "rank" | "county" | "state" | "population" | "density" | "income" | "sites";
type Sort = { key: SortKey; dir: "asc" | "desc" };
const DEFAULT_SORT: Sort = { key: "rank", dir: "asc" };
/** Names sort A→Z first; quantities biggest first (the richest, the most sites), as people usually want them. */
const FIRST_DIR: Record<SortKey, Sort["dir"]> = {
  rank: "asc", county: "asc", state: "asc", population: "desc", density: "desc", income: "desc", sites: "desc",
};
const VALUE: Record<SortKey, (c: CountyMetric, rank: number) => number | string | null | undefined> = {
  rank: (_, rank) => rank,
  county: (c) => c.county_name,
  state: (c) => c.state,
  population: (c) => c.population_2025,
  density: (c) => c.density_per_sqmi,
  income: (c) => c.median_household_income,
  sites: (c) => c.pipeline_count,
};

/** Rows in the chosen order. Missing values go last either way; ties keep the most similar first. */
function sortRows(rows: { c: CountyMetric; rank: number }[], { key, dir }: Sort, locale: string) {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = VALUE[key](a.c, a.rank);
    const vb = VALUE[key](b.c, b.rank);
    if (va == null || vb == null) return va == null && vb == null ? a.rank - b.rank : va == null ? 1 : -1;
    const d = typeof va === "string" ? va.localeCompare(vb as string, locale) : va - (vb as number);
    return d !== 0 ? sign * d : a.rank - b.rank;
  });
}

export default function PeerTable({ county, peer, byGeoid, snapshotDate, income, onSelect }: Props) {
  const { m, lang } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT);
  const isDefault = sort.key === DEFAULT_SORT.key && sort.dir === DEFAULT_SORT.dir;
  const rows = sortRows(peer.peer_geoids.map((g, i) => ({ c: byGeoid.get(g)!, rank: i + 1 })), sort, LANGUAGE[lang].intl);
  const shown = expanded ? rows : rows.slice(0, INITIAL_ROWS);
  const labels: Record<SortKey, string> = {
    rank: m.col.rank, county: m.col.county, state: m.col.state, population: m.col.population, density: m.col.density,
    income: m.col.income, sites: m.col.sites(fmtDateShort(snapshotDate)),
  };
  const columns: SortKey[] = ["rank", "county", "state", "population", "density", ...(income ? (["income"] as SortKey[]) : []), "sites"];
  const numeric = (k: SortKey) => !["county", "state"].includes(k);
  const choose = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: FIRST_DIR[key] }));
  const incomeCell = (c: CountyMetric) =>
    c.median_household_income == null ? (
      <abbr title={m.incomeNATitle}>{m.incomeNA}</abbr>
    ) : (
      fmtUSD(c.median_household_income)
    );

  return (
    <section className="card" aria-labelledby="peers-title">
      <h3 id="peers-title">{isDefault ? m.peersTitle : m.peersTitleSorted}</h3>
      <p className="muted small">
        {m.peersRange(fmtInt(peer.peer_population_min), fmtInt(peer.peer_population_max), fmtDensity(peer.peer_density_min), fmtDensity(peer.peer_density_max))}
      </p>
      {!isDefault && (
        <p className="sort-note small" role="status">
          {m.sortedBy(labels[sort.key])}{" "}
          <button type="button" className="linkish" onClick={() => setSort(DEFAULT_SORT)}>
            {m.sortReset}
          </button>
        </p>
      )}
      <div className="table-wrap">
        <table className="sortable">
          <thead>
            <tr>
              {columns.map((k) => (
                <th
                  key={k}
                  scope="col"
                  className={numeric(k) ? "num" : undefined}
                  aria-sort={sort.key === k ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                >
                  <button type="button" className="sort-btn" onClick={() => choose(k)}>
                    {labels[k]}
                    <svg viewBox="0 0 10 10" aria-hidden="true" className={`sort-arrow${sort.key === k ? ` on ${sort.dir}` : ""}`}>
                      <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="selected-row">
              <td className="num">—</td>
              <td>{county.county_name} <span className="tag">{m.thisCounty}</span></td>
              <td>{county.state}</td>
              <td className="num">{fmtInt(county.population_2025)}</td>
              <td className="num">{fmtDensity(county.density_per_sqmi)}</td>
              {income && <td className="num">{incomeCell(county)}</td>}
              <td className="num">{county.pipeline_count}</td>
            </tr>
            {shown.map(({ c, rank }) => (
              <tr key={c.geoid}>
                <td className="num">{rank}</td>
                <td>
                  <button type="button" className="linkish" onClick={() => onSelect(c.geoid)}>
                    {c.county_name}
                  </button>
                </td>
                <td>{c.state}</td>
                <td className="num">{fmtInt(c.population_2025)}</td>
                <td className="num">{fmtDensity(c.density_per_sqmi)}</td>
                {income && <td className="num">{incomeCell(c)}</td>}
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
      {income && <p className="muted small income-note">{m.incomeNote(income.period, String(income.dollars_year))}</p>}
    </section>
  );
}
