import type { ReactNode } from "react";
import type { CountyMetric, Metadata, PeerRecord } from "../types";
import { fmtDate } from "../lib/format";
import { useM } from "../i18n/I18nProvider";
import { Rich } from "../i18n/Rich";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  metadata: Metadata;
}

/** Plain-language answers to the questions a first-time visitor has, one click away (progressive disclosure). */
export default function NumbersExplained({ county, peer, metadata }: Props) {
  const m = useM();
  const name = county.county_name;
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  const qa: [string, ReactNode][] = [
    [m.qCounted, <Rich text={m.aCounted} />],
    [m.qSimilar, m.aSimilar(total, name)],
    [m.qRead, m.aRead(name, peer.n_fewer, peer.n_equal, peer.n_greater, total)],
    [m.qZero, m.aZero],
    [m.qJudge, m.aJudge],
    [m.qCurrent, m.aCurrent(fmtDate(metadata.snapshot_date), fmtDate(metadata.data_dates.population_reference_date))],
  ];
  return (
    <section className="card explain" aria-labelledby="explain-numbers-title">
      <h3 id="explain-numbers-title">{m.explainTitle}</h3>
      {qa.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
      <p className="small">
        <a href="#methodology">{m.fullMethodology}</a>
      </p>
    </section>
  );
}
