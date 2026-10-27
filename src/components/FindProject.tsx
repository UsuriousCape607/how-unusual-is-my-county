import { useMemo, useState } from "react";
import type { CountyMetric, Project } from "../types";
import { loadProjects } from "../lib/data";
import { searchProjects } from "../lib/projects";
import { reasonLabel } from "../lib/reasons";
import { statusLabel } from "../lib/format";
import { useM } from "../i18n/I18nProvider";
import { Rich } from "../i18n/Rich";

export const REPORT_URL = "https://www.compute-atlas.com/contribute";

interface Props {
  selected: string;
  byGeoid: Map<string, CountyMetric>;
  onSelect: (geoid: string) => void;
}

function Verdict({ p, selected, byGeoid, onSelect }: { p: Project } & Props) {
  const m = useM();
  const c = p.county_geoid ? byGeoid.get(p.county_geoid) : undefined;
  const where = c ? `${c.county_name}, ${c.state}` : null;
  if (p.group === "pipeline" && p.county_geoid === selected) {
    return <><span className="pill pill-blue">{m.countedHere}</span><span className="muted">{m.countedHereNote}</span></>;
  }
  if (p.group === "pipeline" && c) {
    return (
      <>
        <span className="pill pill-blue">{m.counted}</span>
        <span className="muted">
          {m.countedIn(where!)}{" "}
          <button type="button" className="linkish" onClick={() => onSelect(c.geoid)}>
            {m.compareCounty(c.county_name)}
          </button>
        </span>
      </>
    );
  }
  if (p.group === "operational") {
    return <><span className="pill">{m.operating}</span><span className="muted">{m.operatingContext(where)}</span></>;
  }
  return <><span className="pill">{m.notCounted}</span><span className="muted">{reasonLabel(p.reason)}.</span></>;
}

/** "Heard about a project? Is it counted?" — searches every Compute Atlas record in the snapshot. */
export default function FindProject(props: Props) {
  const m = useM();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Project[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  const ensureLoaded = () => {
    if (index || state === "loading") return;
    setState("loading");
    loadProjects()
      .then((p) => {
        setIndex(p);
        setState("idle");
      })
      .catch(() => setState("error"));
  };
  const results = useMemo(() => (index ? searchProjects(index, query) : []), [index, query]);
  const q = query.trim();

  return (
    <section className="card find" id="find-project" aria-labelledby="find-title">
      <h3 id="find-title">{m.findTitle}</h3>
      <p className="muted small">{m.findHelp}</p>
      <div className="search find-search">
        <label htmlFor="find-input" className="sr-only">
          {m.findLabel}
        </label>
        <svg className="search-icon" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          id="find-input"
          type="search"
          placeholder={m.findPlaceholder}
          autoComplete="off"
          value={query}
          onFocus={ensureLoaded}
          onChange={(e) => {
            ensureLoaded();
            setQuery(e.target.value);
          }}
        />
      </div>

      <div aria-live="polite">
        {state === "loading" && q && <p className="muted small find-msg">{m.findLoading}</p>}
        {state === "error" && <p className="muted small find-msg">{m.findError}</p>}
        {index && q.length >= 2 && results.length === 0 && (
          <p className="muted small find-msg">
            <Rich text={m.findNone(q)} a={(label) => <a href={REPORT_URL}>{label}</a>} />
          </p>
        )}
      </div>

      {results.length > 0 && (
        <ul className="find-results">
          {results.map((p) => (
            <li key={p.id}>
              <div className="find-row-head">
                <strong>{p.name ?? p.id}</strong>
                {p.source_url && (
                  <a className="small" href={p.source_url} target="_blank" rel="noopener noreferrer">
                    {m.source}
                  </a>
                )}
              </div>
              <p className="find-meta small">
                {[p.operator, [p.city, p.state].filter(Boolean).join(", "), statusLabel(p.status), p.type && p.type !== "data_center" ? m.projectType[p.type] ?? p.type : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="find-verdict small">
                <Verdict p={p} {...props} />
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="small find-foot">
        <Rich text={m.findFoot} a={(label) => <a href={REPORT_URL}>{label}</a>} />
      </p>
    </section>
  );
}
