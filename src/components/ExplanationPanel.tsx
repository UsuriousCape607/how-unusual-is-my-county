import type { AIExample, CountyMetric, PeerRecord } from "../types";
import { templateSummary } from "../lib/summary";
import { fmtDate } from "../lib/format";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  snapshotDate: string;
  examples: AIExample[];
  byGeoid: Map<string, CountyMetric>;
  onSelect: (geoid: string) => void;
}

export default function ExplanationPanel({ county, peer, snapshotDate, examples, byGeoid, onSelect }: Props) {
  const ai = examples.find((e) => e.geoid === county.geoid);
  const paragraphs = templateSummary(county, peer, snapshotDate);
  return (
    <section className="card" aria-labelledby="explain-title">
      <h3 id="explain-title">What this comparison shows</h3>

      {ai && (
        <div className="ai-block">
          <p className="label-chip">AI-written explanation · pre-generated and checked</p>
          {ai.output.split(/\n\s*\n/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="muted small">
            Written once by {ai.model} from this county's figures in the {fmtDate(ai.snapshot_date)} snapshot, then checked number by
            number ({ai.verification_status}). It is not generated live. Prompt, input, and checks are in AI_EVALUATION.md.
          </p>
        </div>
      )}

      <div className="template-block">
        <p className="label-chip neutral">Automated summary · fixed template from the calculated figures (not AI-written)</p>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {examples.length > 0 && (
        <p className="small">
          AI-written examples:{" "}
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
