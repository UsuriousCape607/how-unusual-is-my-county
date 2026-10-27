import type { CountyMetric, Metadata, PeerRecord } from "../types";
import { countyUrl } from "../lib/data";
import { fmtDate, fmtDateShort, plural } from "../lib/format";
import { verdict } from "../lib/summary";
import { ComparisonBar } from "./CountySummary";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  metadata: Metadata;
}

/** Compact card for news sites (?embed=1): the answer, its data date and credit, and a link to the full comparison. */
export default function EmbedView({ county, peer, metadata }: Props) {
  const n = county.pipeline_count;
  return (
    <main className="embed">
      <p className="embed-brand">How Unusual Is My County?</p>
      <h2>
        {county.county_name}, {county.state_name}
      </h2>
      <p className="verdict">{verdict(county, peer).headline}</p>
      <div className="hero">
        <span className="hero-value">{n}</span>
        <span className="hero-label">
          data-center {plural(n, "site", "sites")} in development on record
          <span className="muted"> as of {fmtDateShort(metadata.snapshot_date)}</span>
        </span>
      </div>
      <ComparisonBar peer={peer} name={county.county_name} />
      <p className="embed-note">
        Similar counties are the 40 closest in population and population density. Data as of {fmtDate(metadata.snapshot_date)} from
        Compute Atlas (Edward Kubiak, CC BY 4.0) and the U.S. Census Bureau. Documented records only; not a count of all projects.
      </p>
      <a className="embed-link" href={countyUrl(county.geoid)} target="_blank" rel="noopener">
        See the full comparison
      </a>
    </main>
  );
}
