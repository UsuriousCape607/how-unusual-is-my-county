import type { Metadata } from "../types";
import { daysSince, fmtAgo, fmtDate } from "../lib/format";

/** Snapshots older than this get a visible "may be out of date" note. */
export const STALE_DAYS = 45;

/** Always-visible statement of when every dataset on the page is from. */
export default function DataFreshness({ metadata }: { metadata: Metadata }) {
  const d = metadata.data_dates;
  const age = daysSince(metadata.snapshot_date);
  return (
    <section className="freshness" aria-label="When this data is from">
      <div className="wrap">
        <p className="freshness-main">
          <span className="freshness-label">Data as of</span>{" "}
          <strong>{fmtDate(metadata.snapshot_date)}</strong> <span className="muted">({fmtAgo(age)})</span>
          <span className="freshness-detail">
            {" "}
            Facility records come from the Compute Atlas snapshot {metadata.compute_atlas.tag}. Projects announced or changed after this
            date are not included.
          </span>
        </p>
        <p className="freshness-sub">
          Population: Census estimates for {fmtDate(d.population_reference_date)} · Land area and boundaries: {d.geography_vintage} Census
          files · Site data last rebuilt {fmtDate(d.site_data_built_at)}
        </p>
        {age > STALE_DAYS && (
          <p className="freshness-stale">
            This snapshot is more than {STALE_DAYS} days old, so newer records may exist. The live inventory is at{" "}
            <a href="https://www.compute-atlas.com">compute-atlas.com</a>.
          </p>
        )}
      </div>
    </section>
  );
}
