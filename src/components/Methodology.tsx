import type { Metadata } from "../types";
import { fmtDate, fmtInt } from "../lib/format";
import { STALE_DAYS } from "./DataFreshness";
import { REASON_LABELS } from "../lib/reasons";


const METHOD_LABELS: Record<string, string> = {
  spatial_join: "Exact coordinates inside a county polygon",
  spatial_nearest_name_confirmed: "Exact coordinates just offshore, nearest county confirmed by name",
  source_name_match: "Approximate location, assigned by its named county",
};

function Table({ rows, caption }: { rows: [string, number][]; caption: string }) {
  return (
    <table className="compact">
      <caption>{caption}</caption>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}>
            <td>{k}</td>
            <td className="num">{fmtInt(v)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Methodology({ metadata }: { metadata: Metadata }) {
  const qc = metadata.facility_qc;
  const ca = metadata.compute_atlas;
  const exclusions = Object.entries(qc.headline_exclusions_by_reason)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => [REASON_LABELS[k] ?? k, v] as [string, number]);
  const methods = Object.entries(qc.pipeline_assignment_methods).map(([k, v]) => [METHOD_LABELS[k] ?? k, v] as [string, number]);

  return (
    <section id="methodology" className="card methodology" aria-labelledby="method-title">
      <h2 id="method-title">Methodology, limitations, and sources</h2>

      <h3>The question</h3>
      <p>
        Does a county have more documented data-center development than other U.S. counties with similar populations and population
        densities? The tool compares counts of documented records. It does not estimate environmental, economic, or political effects.
      </p>

      <h3>What is counted</h3>
      <p>
        A <strong>qualifying pipeline record</strong> is a Compute Atlas record with facility type <code>{metadata.filters.facility_type}</code>,
        status {metadata.filters.pipeline_statuses.map((s) => <code key={s}>{s}</code>).reduce((a, b) => <>{a}, {b}</>)}, confidence{" "}
        {metadata.filters.confidence.map((s) => <code key={s}>{s}</code>).reduce((a, b) => <>{a} or {b}</>)}, and one defensible
        county. There is no announcement-date filter: the count is the pipeline as documented on {fmtDate(metadata.snapshot_date)}.
        A record is a documented site entry, not necessarily a separate building, and the inventory does not capture every project.
      </p>
      <p>
        Of {fmtInt(qc.total_records)} records in the snapshot, {fmtInt(qc.pipeline_candidates_before_assignment)} met the type, status,
        and confidence filters and {fmtInt(qc.headline_included)} were assigned to a county and counted.{" "}
        {fmtInt(metadata.counties.with_pipeline_records)} of {fmtInt(metadata.counties.eligible)} counties have at least one.
      </p>
      <div className="tables">
        <Table caption="Records not in the headline count, by first reason" rows={exclusions} />
        <Table caption="How counted records were assigned to counties" rows={methods} />
      </div>

      <h3>Assigning records to counties</h3>
      <ul>
        <li>Records with exact coordinates are placed in a county by point-in-polygon on the 2025 Census 1:500,000 boundaries, then checked against the county named in the source. Disagreements are excluded and logged for review, not guessed.</li>
        <li>Records with approximate coordinates are assigned only when the named county and state match exactly one 2025 county. Their map points are representative, so they are drawn as dashed rings, not precise pins.</li>
        <li>Multi-site aggregates, records without a usable county, and territories are excluded.</li>
      </ul>

      <h3>Choosing the 40 peers</h3>
      <p>
        For every county we take the natural log of its 2025 population and of its population density (people per square mile of
        land; water excluded). Each is converted to a z-score across all {fmtInt(metadata.counties.eligible)} counties, using the
        population standard deviation. The peers are the 40 counties at the smallest Euclidean distance:
      </p>
      <p className="formula">distance(A, B) = √[(zPop<sub>A</sub> − zPop<sub>B</sub>)² + (zDensity<sub>A</sub> − zDensity<sub>B</sub>)²]</p>
      <p>
        A county is never its own peer, exact ties are broken by county code, and the data-center count is never used to choose
        peers. We report how many similar counties have fewer, the same, and more records, plus their median and mean. The
        headline restates these counts in words: &ldquo;all&rdquo; means 40 of 40 and &ldquo;most&rdquo; means more than half (21 or more).
        We do not compute ratios, indexes, or significance tests.
      </p>

      <h3>Reading the result</h3>
      <ul>
        {metadata.caveats.map((c) => (
          <li key={c}>{c}</li>
        ))}
        <li>{metadata.geographic_scope}</li>
      </ul>

      <h3>Data dates</h3>
      <table className="compact dates">
        <tbody>
          <tr><td>Facility records (Compute Atlas snapshot {ca.tag})</td><td>as of {fmtDate(metadata.data_dates.facility_snapshot_as_of)}</td></tr>
          {metadata.data_dates.facility_file_retrieved_at && (
            <tr><td>Snapshot file downloaded</td><td>{fmtDate(metadata.data_dates.facility_file_retrieved_at)}</td></tr>
          )}
          <tr><td>Population ({metadata.data_dates.population_vintage})</td><td>{fmtDate(metadata.data_dates.population_reference_date)}</td></tr>
          <tr><td>Land area and county boundaries</td><td>{metadata.data_dates.geography_vintage} Census vintage</td></tr>
          <tr><td>Site data last rebuilt</td><td>{fmtDate(metadata.data_dates.site_data_built_at)}</td></tr>
        </tbody>
      </table>
      <p className="small">
        Records are not fetched live: the site shows one dated snapshot so every figure can be traced and reproduced. The banner at
        the top of the page flags any snapshot older than {STALE_DAYS} days.
      </p>

      <h3>Sources and attribution</h3>
      <ul className="sources-list">
        <li>
          <strong>Facility records:</strong> {ca.attribution}. Snapshot {ca.tag} (data as of {fmtDate(ca.snapshot_as_of)}),{" "}
          <a href={ca.license_url}>CC BY 4.0</a>. {ca.transformations}
        </li>
        <li><strong>Population:</strong> {metadata.census.population}.</li>
        <li><strong>Land area:</strong> {metadata.census.land_area}.</li>
        <li><strong>Boundaries:</strong> {metadata.census.boundaries}. {metadata.census.license}.</li>
      </ul>
      <details>
        <summary>File provenance (URLs, retrieval dates, SHA-256)</summary>
        <table className="compact provenance">
          <tbody>
            {Object.entries(metadata.sources).map(([k, s]) => (
              <tr key={k}>
                <td><a href={s.url}>{k}</a></td>
                <td>{s.retrieved_at ? fmtDate(s.retrieved_at) : "supplied locally"}</td>
                <td><code>{s.sha256?.slice(0, 16)}…</code></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted small">Data version <code>{metadata.data_version}</code>, built {fmtDate(metadata.generated_at)}.</p>
      </details>

      <h3>About the AI explanations</h3>
      <p>
        Every county gets the fixed-template summary, computed from the figures above. Three counties also show a short explanation
        that an AI model wrote once from the same structured figures; each number in it was checked against its input. An AI
        explanation is shown only if it was written from the snapshot currently on the site. The AI never calculates figures, and
        the site makes no live AI calls.
      </p>
    </section>
  );
}
