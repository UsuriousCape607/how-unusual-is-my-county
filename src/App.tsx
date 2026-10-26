import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppData } from "./types";
import { loadAppData, readGeoidFromUrl, writeGeoidToUrl } from "./lib/data";
import { verdict } from "./lib/summary";
import CountySearch from "./components/CountySearch";
import CountySummary from "./components/CountySummary";
import NumbersExplained from "./components/NumbersExplained";
import ComparisonChart from "./components/ComparisonChart";
import CountyMap, { type SelectionSource } from "./components/CountyMap";
import PeerTable from "./components/PeerTable";
import FacilityList from "./components/FacilityList";
import ExplanationPanel from "./components/ExplanationPanel";
import Methodology from "./components/Methodology";
import DataFreshness from "./components/DataFreshness";

// Example counties offered under the search box: a high count, the highest, a zero, and a typical case.
const EXAMPLE_GEOIDS = ["51107", "06085", "48201", "18097"];

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geoid, setGeoid] = useState<string | null>(null);
  const [source, setSource] = useState<SelectionSource>("other");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadAppData()
      .then((d) => {
        setData(d);
        const requested = readGeoidFromUrl();
        if (requested && d.peers.peers[requested]) {
          setGeoid(requested);
        } else {
          if (requested) setNotice(`County code ${requested} was not found, so an example county is shown instead.`);
          setGeoid(d.metadata.default_geoid);
          writeGeoidToUrl(d.metadata.default_geoid, true);
        }
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    const onPop = () => {
      const g = readGeoidFromUrl();
      if (g && data?.peers.peers[g]) {
        setSource("other");
        setGeoid(g);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [data]);

  const select = useCallback(
    (g: string, from: SelectionSource = "other") => {
      if (!data?.peers.peers[g] || g === geoid) return;
      setNotice(null);
      setSource(from);
      setGeoid(g);
      writeGeoidToUrl(g);
    },
    [data, geoid],
  );

  const county = geoid && data ? data.byGeoid.get(geoid) : undefined;
  const peer = geoid && data ? data.peers.peers[geoid] : undefined;
  const currentExamples = useMemo(
    () => (data ? data.aiExamples.filter((e) => e.data_version === data.metadata.data_version) : []),
    [data],
  );
  const facilities = useMemo(
    () => (data && geoid ? data.facilities.filter((f) => f.county_geoid === geoid) : []),
    [data, geoid],
  );

  return (
    <div className="app">
      <header className="site-header">
        <div className="wrap header-inner">
          <div>
            <h1>How Unusual Is My County?</h1>
            <p className="subtitle">Compare documented data-center development with similar counties across the United States.</p>
          </div>
          <div className="header-meta">
            <a href="#methodology">Methodology &amp; sources</a>
          </div>
        </div>
      </header>
      {data && <DataFreshness metadata={data.metadata} />}

      <main className="wrap">
        {error && (
          <div className="state-box error" role="alert">
            <strong>The data files could not be loaded.</strong> {error}. Reload the page to try again; if you are running the
            site locally, run <code>python scripts/build_all.py</code> first.
          </div>
        )}
        {!data && !error && (
          <div className="state-box loading" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" /> Loading data for 3,144 counties…
          </div>
        )}

        {data && county && peer && (
          <>
            {/* Floating search stays reachable while scrolling and always shows where you are (wayfinding). */}
            <div className="search-bar">
              <CountySearch metrics={data.metrics} onSelect={select} />
              <p className="comparing" aria-hidden="true">
                Comparing <strong>{county.county_name}, {county.state}</strong>
              </p>
            </div>
            <section className="search-row" aria-label="Example counties">
              <p className="examples small">
                <span className="muted">Try:</span>
                {EXAMPLE_GEOIDS.filter((g) => data.byGeoid.has(g)).map((g) => {
                  const c = data.byGeoid.get(g)!;
                  return (
                    <button key={g} type="button" className="chip" aria-pressed={g === geoid} onClick={() => select(g)}>
                      {c.county_name}, {c.state}
                    </button>
                  );
                })}
              </p>
              {notice && <p className="notice">{notice}</p>}
            </section>

            {/* Announce changes for screen-reader users. */}
            <p className="sr-only" aria-live="polite">
              Showing {county.county_name}, {county.state_name}: {verdict(county, peer).headline}.
            </p>

            <div className="layout">
              <div className="area-summary">
                <CountySummary county={county} peer={peer} metadata={data.metadata} byGeoid={data.byGeoid} onSelect={select} />
              </div>
              <aside className="area-map">
                <div className="sticky">
                  <CountyMap
                    counties={data.counties}
                    countyBorders={data.countyBorders}
                    states={data.states}
                    byGeoid={data.byGeoid}
                    selected={county.geoid}
                    peerGeoids={peer.peer_geoids}
                    facilities={facilities}
                    selectionSource={source}
                    onSelect={select}
                  />
                </div>
              </aside>
              <div className="area-rest">
                <NumbersExplained county={county} peer={peer} metadata={data.metadata} />
                <ComparisonChart county={county} peer={peer} byGeoid={data.byGeoid} snapshotDate={data.metadata.snapshot_date} onSelect={select} />
                <FacilityList county={county} facilities={facilities} snapshotDate={data.metadata.snapshot_date} />
                <PeerTable county={county} peer={peer} byGeoid={data.byGeoid} snapshotDate={data.metadata.snapshot_date} onSelect={select} />
                <ExplanationPanel
                  county={county}
                  peer={peer}
                  snapshotDate={data.metadata.snapshot_date}
                  examples={currentExamples}
                  byGeoid={data.byGeoid}
                  onSelect={select}
                />
              </div>
            </div>
          </>
        )}

        {data && <Methodology metadata={data.metadata} />}
      </main>

      <footer className="site-footer">
        <div className="wrap">
          {data ? (
            <p>
              {data.metadata.compute_atlas.attribution} (
              <a href={data.metadata.compute_atlas.license_url}>license</a>). Transformations: {data.metadata.compute_atlas.transformations}{" "}
              Population, land area and county boundaries: U.S. Census Bureau (public domain). Data version{" "}
              <code>{data.metadata.data_version}</code>.
            </p>
          ) : (
            <p>Facility data: Compute Atlas by Edward Kubiak (CC BY 4.0). County data: U.S. Census Bureau.</p>
          )}
        </div>
      </footer>
    </div>
  );
}
