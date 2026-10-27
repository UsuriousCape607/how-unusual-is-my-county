import { useEffect, useRef, useState } from "react";
import type { CountyMetric, Facility, PeerRecord } from "../types";
import { countyUrl } from "../lib/data";
import { downloadCSV, toCSV } from "../lib/csv";
import { assignmentLabel, precisionLabel, statusLabel } from "../lib/format";
import { useM } from "../i18n/I18nProvider";

interface Props {
  county: CountyMetric;
  peer: PeerRecord;
  byGeoid: Map<string, CountyMetric>;
  facilities: Facility[];
  snapshotDate: string;
}

const slug = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

/** One share button (Apple share-sheet style) instead of a row of separate actions. */
export default function ShareMenu({ county, peer, byGeoid, facilities, snapshotDate }: Props) {
  const m = useM();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const wrap = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const base = `${slug(county.county_name)}-${county.state.toLowerCase()}`;
  const embedCode = `<iframe src="${countyUrl(county.geoid, true)}" title="${m.siteTitle} ${county.county_name}, ${county.state}" width="100%" height="460" style="border:0" loading="lazy"></iframe>`;

  const flash = (msg: string) => {
    setStatus(msg);
    window.setTimeout(() => setStatus(""), 2500);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLButtonElement>("[role=menuitem]")?.focus();
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onMenuKey = (e: React.KeyboardEvent) => {
    const items = Array.from(menu.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]") ?? []);
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") items[(i + 1) % items.length]?.focus();
    else if (e.key === "ArrowUp") items[(i - 1 + items.length) % items.length]?.focus();
    else if (e.key === "Escape") close();
    else return;
    e.preventDefault();
  };

  const copy = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(done);
    } catch {
      flash(m.copyFailed);
    }
  };

  const actions: { label: string; run: () => void; keepFocus?: boolean }[] = [
    { label: m.copyLink, run: () => copy(countyUrl(county.geoid), m.linkCopied) },
    { label: m.printSummary, run: () => window.setTimeout(() => window.print(), 50) },
    {
      label: m.downloadSimilar,
      run: () => {
        const row = (c: CountyMetric, rank: string) => [rank, c.county_name, c.state, c.geoid, c.population_2025, c.density_per_sqmi, c.pipeline_count];
        const rows = [row(county, "this county"), ...peer.peer_geoids.map((g, i) => row(byGeoid.get(g)!, String(i + 1)))];
        downloadCSV(`${base}-similar-counties-${snapshotDate}.csv`, toCSV(
          ["similarity_rank", "county", "state", "geoid", "population_2025", "people_per_sq_mi", `sites_in_development_${snapshotDate}`], rows));
        flash(m.downloadStarted);
      },
    },
    {
      label: m.downloadSites,
      run: () => {
        const rows = facilities.filter((f) => f.metric === "pipeline").map((f) => [
          f.name, f.operator, statusLabel(f.status), f.confidence, precisionLabel(f.location_precision),
          assignmentLabel(f.assignment_method), f.last_updated, f.source_links.map((l) => l.url).join(" "), f.source_id,
        ]);
        downloadCSV(`${base}-sites-in-development-${snapshotDate}.csv`, toCSV(
          ["name", "operator", "status", "confidence", "location", "county_assignment", "last_updated", "sources", "compute_atlas_id"], rows));
        flash(m.downloadStarted);
      },
    },
    { label: m.embedAction, run: () => dialog.current?.showModal(), keepFocus: true },
  ];

  return (
    <span className="share" ref={wrap}>
      <button
        ref={button}
        type="button"
        className="share-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="share-icon">
          <path d="M8 1.5v8.5M5 4.5l3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 7H4a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {m.share}
      </button>
      {open && (
        <div className="menu" role="menu" aria-label={m.shareOptions} ref={menu} onKeyDown={onMenuKey}>
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              role="menuitem"
              onClick={() => {
                close(!a.keepFocus); // the embed dialog takes focus itself
                a.run();
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
      <span role="status" aria-live="polite" className="share-status">
        {status}
      </span>
      <dialog ref={dialog} className="sheet" aria-labelledby="embed-title" onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="sheet-body">
          <h3 id="embed-title">{m.embedTitle}</h3>
          <p className="muted small">{m.embedHelp(`${county.county_name}, ${county.state}`)}</p>
          <textarea readOnly value={embedCode} rows={4} onFocus={(e) => e.currentTarget.select()} aria-label={m.embedCodeLabel} />
          <div className="sheet-actions">
            <button type="button" className="secondary" onClick={() => dialog.current?.close()}>
              {m.done}
            </button>
            <button type="button" className="primary" onClick={() => copy(embedCode, m.embedCopied)}>
              {m.copyCode}
            </button>
          </div>
        </div>
      </dialog>
    </span>
  );
}
