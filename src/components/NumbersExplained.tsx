import type { CountyMetric, Metadata, PeerRecord } from "../types";
import { fmtDate } from "../lib/format";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  metadata: Metadata;
}

/** Plain-language answers to the questions a first-time visitor has, one click away (progressive disclosure). */
export default function NumbersExplained({ county, peer, metadata }: Props) {
  const name = county.county_name;
  const total = peer.n_fewer + peer.n_equal + peer.n_greater;
  return (
    <section className="card explain" aria-labelledby="explain-numbers-title">
      <h3 id="explain-numbers-title">What do these numbers mean?</h3>
      <details>
        <summary>What is counted as a “site in development”?</summary>
        <p>
          A data-center site that the public research inventory Compute Atlas lists as <strong>proposed</strong>,{" "}
          <strong>permitted</strong> (approved), or <strong>under construction</strong>, with confirmed or reported sources. Operating
          data centers are counted separately and shown only as context. Each count is the number of documented site records, which is
          not the same as a verified count of buildings.
        </p>
      </details>
      <details>
        <summary>Who are the “similar counties”?</summary>
        <p>
          The {total} U.S. counties closest to {name} in both population and population density (people per square mile of land).
          Data-center activity is not used to choose them, so they show what is common for places of this size and density. They can
          be in any state.
        </p>
      </details>
      <details>
        <summary>How do I read “fewer, the same, more”?</summary>
        <p>
          Each similar county is compared with {name}: {peer.n_fewer} have fewer sites on record, {peer.n_equal} have the same number,
          and {peer.n_greater} have more. “Most” means more than half, so at least 21 of {total}. The typical similar county is the
          middle one when all {total} are lined up by their counts (the median).
        </p>
      </details>
      <details>
        <summary>What does a zero mean?</summary>
        <p>
          That no qualifying record was found in this dataset snapshot. It does not mean no data center is proposed: the inventory is
          incomplete, and better-documented places may show more records.
        </p>
      </details>
      <details>
        <summary>Does this say whether development here is good, bad, or likely?</summary>
        <p>
          No. The tool only counts documented records and compares them with similar places. It does not measure environmental or
          economic effects, explain why a county has more or fewer records, or predict future projects.
        </p>
      </details>
      <details>
        <summary>How current is this?</summary>
        <p>
          The records are from the Compute Atlas snapshot of {fmtDate(metadata.snapshot_date)}; projects announced or changed later are
          not included. The site checks weekly for a newer snapshot. Population figures are Census estimates for{" "}
          {fmtDate(metadata.data_dates.population_reference_date)}.
        </p>
      </details>
      <p className="small">
        <a href="#methodology">Full methodology and sources</a>
      </p>
    </section>
  );
}
