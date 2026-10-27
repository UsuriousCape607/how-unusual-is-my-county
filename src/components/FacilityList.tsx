import type { CountyMetric, Facility } from "../types";
import { assignmentLabel, confidenceLabel, fmtDate, fmtDateShort, precisionLabel, statusLabel } from "../lib/format";
import { useM } from "../i18n/I18nProvider";
import { Rich } from "../i18n/Rich";
import { REPORT_URL } from "./FindProject";

interface Props {
  county: CountyMetric;
  facilities: Facility[];
  snapshotDate: string;
}

function FacilityItem({ f }: { f: Facility }) {
  const m = useM();
  // Only fields present in the source are shown; nothing is filled in.
  const facts: [string, string | undefined][] = [
    [m.field.operator, f.operator],
    [m.field.status, statusLabel(f.status)],
    [m.field.confidence, confidenceLabel(f.confidence)],
    [m.field.location, precisionLabel(f.location_precision)],
    [m.field.assignment, assignmentLabel(f.assignment_method)],
    [m.field.updated, f.last_updated ? fmtDate(f.last_updated) : undefined],
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
      <p className="muted tiny">{m.recordId(f.source_id)}</p>
    </li>
  );
}

export default function FacilityList({ county, facilities, snapshotDate }: Props) {
  const m = useM();
  const pipeline = facilities.filter((f) => f.metric === "pipeline");
  const operational = facilities.filter((f) => f.metric === "operational");
  return (
    <section className="card" aria-labelledby="records-title">
      <h3 id="records-title">{m.recordsTitle(`${county.county_name}, ${county.state}`, pipeline.length)}</h3>
      <p className="muted small">{m.recordsHelp(fmtDateShort(snapshotDate))}</p>
      {pipeline.length === 0 ? (
        <p>{m.noRecords}</p>
      ) : (
        <ul className="facility-list">
          {pipeline.map((f) => (
            <FacilityItem key={f.source_id} f={f} />
          ))}
        </ul>
      )}
      {operational.length > 0 && (
        <details className="operational">
          <summary>{m.operatingSummary(operational.length)}</summary>
          <ul className="facility-list">
            {operational.map((f) => (
              <FacilityItem key={f.source_id} f={f} />
            ))}
          </ul>
        </details>
      )}
      <p className="small find-foot">
        <Rich text={m.reportFoot} a={(label) => <a href={REPORT_URL}>{label}</a>} />
      </p>
    </section>
  );
}
