import type { Metadata } from "../types";
import { daysSince, fmtAgo, fmtDate, fmtDateShort } from "../lib/format";
import { useM } from "../i18n/I18nProvider";
import { Rich } from "../i18n/Rich";

/** Snapshots older than this get a visible "may be out of date" note. */
export const STALE_DAYS = 45;

/** Always-visible statement of when every dataset on the page is from. */
export default function DataFreshness({ metadata }: { metadata: Metadata }) {
  const m = useM();
  const d = metadata.data_dates;
  const age = daysSince(metadata.snapshot_date);
  return (
    <section className="freshness" aria-label={m.freshnessAria}>
      <div className="wrap">
        <p className="freshness-main">
          <span className="freshness-pill">
            <Rich text={m.dataAsOf(fmtDate(metadata.snapshot_date))} />
          </span>
          <span className="freshness-age">{fmtAgo(age)}</span>
        </p>
        <p className="freshness-sub">
          {m.freshnessSub(metadata.compute_atlas.tag, fmtDate(d.population_reference_date), String(d.geography_vintage), fmtDateShort(d.site_data_built_at))}
        </p>
        {age > STALE_DAYS && (
          <p className="freshness-stale">
            <Rich text={m.stale(STALE_DAYS)} a={(label) => <a href="https://www.compute-atlas.com">{label}</a>} />
          </p>
        )}
      </div>
    </section>
  );
}
