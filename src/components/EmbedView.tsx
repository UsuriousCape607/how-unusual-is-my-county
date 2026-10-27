import type { CountyMetric, Metadata, PeerRecord } from "../types";
import { countyUrl } from "../lib/data";
import { fmtDate, fmtDateShort } from "../lib/format";
import { useM } from "../i18n/I18nProvider";
import { verdict } from "../lib/summary";
import { ComparisonBar } from "./CountySummary";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  metadata: Metadata;
}

/** Compact card for news sites (?embed=1): the answer, its data date and credit, and a link to the full comparison. */
export default function EmbedView({ county, peer, metadata }: Props) {
  const m = useM();
  const n = county.pipeline_count;
  return (
    <main className="embed">
      <p className="embed-brand">{m.siteTitle}</p>
      <h2>
        {county.county_name}, {county.state_name}
      </h2>
      <p className="verdict">{verdict(county, peer).headline}</p>
      <div className="hero">
        <span className="hero-value">{n}</span>
        <span className="hero-label">
          {m.heroLabel(n)}
          <span className="muted">{m.heroAsOf(fmtDateShort(metadata.snapshot_date))}</span>
        </span>
      </div>
      <ComparisonBar peer={peer} name={county.county_name} />
      <p className="embed-note">{m.embedNote(fmtDate(metadata.snapshot_date))}</p>
      <a className="embed-link" href={countyUrl(county.geoid)} target="_blank" rel="noopener">
        {m.seeFull}
      </a>
    </main>
  );
}
