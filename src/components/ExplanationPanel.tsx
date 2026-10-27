import type { AIExample, CountyMetric, PeerRecord } from "../types";
import { templateSummary } from "../lib/summary";
import { fmtDate } from "../lib/format";
import { useM } from "../i18n/I18nProvider";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  snapshotDate: string;
  examples: AIExample[];
  byGeoid: Map<string, CountyMetric>;
  onSelect: (geoid: string) => void;
}

export default function ExplanationPanel({ county, peer, snapshotDate, examples, byGeoid, onSelect }: Props) {
  const m = useM();
  const ai = examples.find((e) => e.geoid === county.geoid);
  const paragraphs = templateSummary(county, peer, snapshotDate);
  return (
    <section className="card" aria-labelledby="explain-title">
      <h3 id="explain-title">{m.summaryTitle}</h3>

      {ai && (
        <div className="ai-block">
          <p className="label-chip">{m.aiChip}</p>
          {m.aiEnglishOnly && <p className="muted small">{m.aiEnglishOnly}</p>}
          <div lang="en">
            {ai.output.split(/\n\s*\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="muted small">{m.aiNote(ai.model, fmtDate(ai.snapshot_date), ai.verification_status)}</p>
        </div>
      )}

      <div className="template-block">
        <p className="label-chip neutral">{m.templateChip}</p>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {examples.length > 0 && (
        <p className="small">
          {m.aiExamples}{" "}
          {examples.map((e, i) => {
            const c = byGeoid.get(e.geoid);
            return (
              <span key={e.geoid}>
                {i > 0 && " · "}
                {e.geoid === county.geoid ? (
                  <strong>{c ? `${c.county_name}, ${c.state}` : e.label}</strong>
                ) : (
                  <button type="button" className="linkish" onClick={() => onSelect(e.geoid)}>
                    {c ? `${c.county_name}, ${c.state}` : e.label}
                  </button>
                )}
              </span>
            );
          })}
        </p>
      )}
    </section>
  );
}
