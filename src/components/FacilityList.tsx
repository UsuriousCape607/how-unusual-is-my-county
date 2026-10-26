import type { CountyMetric, Facility } from "../types";
import { assignmentLabel, fmtDate, fmtDateShort, plural, precisionLabel, statusLabel } from "../lib/format";

interface Props {
  county: CountyMetric;
  facilities: Facility[];
  snapshotDate: string;
}

function FacilityItem({ f }: { f: Facility }) {
  // Only fields present in the source are shown; nothing is filled in.
  const facts: [string, string | undefined][] = [
    ["Operator", f.operator],
    ["Status", statusLabel(f.status)],
    ["Confidence", f.confidence],
    ["Location", precisionLabel(f.location_precision)],
    ["County assignment", assignmentLabel(f.assignment_method)],
    ["Last updated", f.last_updated ? fmtDate(f.last_updated) : undefined],
  ];
  return (
    <li className="facility">
      <h4>{f.name ?? f.source_id}</h4>
      <dl>
        {facts
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      {f.source_links.length > 0 && (
        <ul className="sources">
          {f.source_links.map((s, i) => (
            <li key={i}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label ?? s.url}
              </a>
              {s.publisher && <span className="muted"> — {s.publisher}</span>}
            </li>
          ))}
        </ul>
      )}
      <p className="muted tiny">Compute Atlas record: {f.source_id}</p>
    </li>
  );
}

export default function FacilityList({ county, facilities, snapshotDate }: Props) {
  const pipeline = facilities.filter((f) => f.metric === "pipeline");
  const operational = facilities.filter((f) => f.metric === "operational");
  return (
    <section className="card" aria-labelledby="records-title">
      <h3 id="records-title">
        Qualifying pipeline records in {county.county_name}, {county.state} ({pipeline.length})
      </h3>
      <p className="muted small">
        As documented in the Compute Atlas snapshot of {fmtDateShort(snapshotDate)}. Each record&apos;s own &ldquo;Last updated&rdquo; date
        shows when its source information was last revised.
      </p>
      {pipeline.length === 0 ? (
        <p>No qualifying pipeline records were found in this county in the selected dataset snapshot.</p>
      ) : (
        <ul className="facility-list">
          {pipeline.map((f) => (
            <FacilityItem key={f.source_id} f={f} />
          ))}
        </ul>
      )}
      {operational.length > 0 && (
        <details className="operational">
          <summary>
            {operational.length} operational {plural(operational.length, "record", "records")} (context only, not in the pipeline count)
          </summary>
          <ul className="facility-list">
            {operational.map((f) => (
              <FacilityItem key={f.source_id} f={f} />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
