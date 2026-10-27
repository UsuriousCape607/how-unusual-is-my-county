import { useMemo, useState } from "react";
import type { CountyMetric, Project } from "../types";
import { loadProjects } from "../lib/data";
import { searchProjects } from "../lib/projects";
import { reasonLabel } from "../lib/reasons";
import { statusLabel } from "../lib/format";

export const REPORT_URL = "https://www.compute-atlas.com/contribute";

interface Props {
  selected: string;
  byGeoid: Map<string, CountyMetric>;
  onSelect: (geoid: string) => void;
}

const TYPE_LABEL: Record<string, string> = { data_center: "Data center", crypto_mining: "Crypto mining", power_generation: "Power generation" };

function Verdict({ p, selected, byGeoid, onSelect }: { p: Project } & Props) {
  const c = p.county_geoid ? byGeoid.get(p.county_geoid) : undefined;
  const where = c ? `${c.county_name}, ${c.state}` : undefined;
  if (p.group === "pipeline" && p.county_geoid === selected) {
    return <><span className="pill pill-blue">Counted here</span><span className="muted">Included in this county’s number.</span></>;
  }
  if (p.group === "pipeline" && c) {
    return (
      <>
        <span className="pill pill-blue">Counted</span>
        <span className="muted">
          In {where}.{" "}
          <button type="button" className="linkish" onClick={() => onSelect(c.geoid)}>
            Compare {c.county_name}
          </button>
        </span>
      </>
    );
  }
  if (p.group === "operational") {
    return <><span className="pill">Operating</span><span className="muted">Shown as context{where ? ` in ${where}` : ""}, not in the count.</span></>;
  }
  return <><span className="pill">Not counted</span><span className="muted">{reasonLabel(p.reason)}.</span></>;
}

/** "Heard about a project? Is it counted?" — searches every Compute Atlas record in the snapshot. */
export default function FindProject(props: Props) {
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
      <h3 id="find-title">Find a project</h3>
      <p className="muted small">
        Heard about a specific project? Search every record in the snapshot by name, company, or place to see whether it’s counted,
        and if not, why.
      </p>
      <div className="search find-search">
        <label htmlFor="find-input" className="sr-only">
          Search projects
        </label>
        <svg className="search-icon" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          id="find-input"
          type="search"
          placeholder="e.g. Meta, Project Mica, Abilene"
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
        {state === "loading" && q && <p className="muted small find-msg">Loading all 2,000+ project records…</p>}
        {state === "error" && <p className="muted small find-msg">The project list couldn’t be loaded. Check your connection and try again.</p>}
        {index && q.length >= 2 && results.length === 0 && (
          <p className="muted small find-msg">
            No project matches “{q}”. Compute Atlas may not list it yet; you can <a href={REPORT_URL}>report it to Compute Atlas</a>.
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
                    Source
                  </a>
                )}
              </div>
              <p className="find-meta small">
                {[p.operator, [p.city, p.state].filter(Boolean).join(", "), statusLabel(p.status), p.type && p.type !== "data_center" ? TYPE_LABEL[p.type] : null]
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
        Know of a project that’s missing or wrong? <a href={REPORT_URL}>Report it to Compute Atlas</a>, the source this site uses.
      </p>
    </section>
  );
}
