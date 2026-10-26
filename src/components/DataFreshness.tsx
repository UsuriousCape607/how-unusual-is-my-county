import type { Metadata } from "../types";
import { daysSince, fmtAgo, fmtDate, fmtDateShort } from "../lib/format";

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
          <span className="freshness-pill">
            Data as of <strong>{fmtDate(metadata.snapshot_date)}</strong>
          </span>
          <span className="freshness-age">{fmtAgo(age)}</span>
        </p>
        <p className="freshness-sub">
          Facility records come from the Compute Atlas snapshot {metadata.compute_atlas.tag}; projects announced or changed after
          that date are not included. Population: Census estimates for {fmtDate(d.population_reference_date)}. Boundaries and land
          area: {d.geography_vintage} Census files. Site data last rebuilt {fmtDateShort(d.site_data_built_at)}.
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
