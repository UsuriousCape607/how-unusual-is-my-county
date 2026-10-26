import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppData } from "./types";
import { loadAppData, readGeoidFromUrl, writeGeoidToUrl } from "./lib/data";
import { fmtDate } from "./lib/format";
import CountySearch from "./components/CountySearch";
import CountySummary from "./components/CountySummary";
import ComparisonChart from "./components/ComparisonChart";
import CountyMap from "./components/CountyMap";
import PeerTable from "./components/PeerTable";
import FacilityList from "./components/FacilityList";
import ExplanationPanel from "./components/ExplanationPanel";
import Methodology from "./components/Methodology";

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geoid, setGeoid] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadAppData()
      .then((d) => {
        setData(d);
        const requested = readGeoidFromUrl();
        if (requested && d.peers.peers[requested]) {
          setGeoid(requested);
        } else {
          if (requested) setNotice(`County code ${requested} was not found, so a demonstration county is shown instead.`);
          setGeoid(d.metadata.default_geoid);
          writeGeoidToUrl(d.metadata.default_geoid, true);
        }
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    const onPop = () => {
      const g = readGeoidFromUrl();
      if (g && data?.peers.peers[g]) setGeoid(g);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [data]);

  const select = useCallback(
    (g: string) => {
      if (!data?.peers.peers[g] || g === geoid) return;
      setNotice(null);
      setGeoid(g);
      writeGeoidToUrl(g);
    },
    [data, geoid],
  );

  const county = geoid && data ? data.byGeoid.get(geoid) : undefined;
  const peer = geoid && data ? data.peers.peers[geoid] : undefined;
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
            {data && (
              <span>
                Data snapshot: {fmtDate(data.metadata.snapshot_date)} · Compute Atlas {data.metadata.compute_atlas.tag}
              </span>
            )}
            <a href="#methodology">Methodology &amp; sources</a>
          </div>
        </div>
      </header>

      <main className="wrap">
        {error && (
          <div className="state-box error" role="alert">
            <strong>The data files could not be loaded.</strong> {error}. Reload the page to try again; if you are running the
            site locally, run <code>python scripts/build_all.py</code> first.
          </div>
        )}
        {!data && !error && (
          <div className="state-box" role="status" aria-live="polite">
            Loading county data…
          </div>
        )}

        {data && county && peer && (
          <>
            <section className="search-row" aria-label="Choose a county">
              <CountySearch metrics={data.metrics} onSelect={select} />
              {notice && <p className="notice">{notice}</p>}
            </section>

            <div className="grid">
              <div className="col-main">
                <CountySummary county={county} peer={peer} metadata={data.metadata} />
                <ComparisonChart county={county} peer={peer} byGeoid={data.byGeoid} onSelect={select} />
                <ExplanationPanel
                  county={county}
                  peer={peer}
                  snapshotDate={data.metadata.snapshot_date}
                  examples={data.aiExamples}
                  byGeoid={data.byGeoid}
                  onSelect={select}
                />
              </div>
              <div className="col-side">
                <CountyMap
                  counties={data.counties}
                  states={data.states}
                  byGeoid={data.byGeoid}
                  selected={county.geoid}
                  peerGeoids={peer.peer_geoids}
                  facilities={facilities}
                  onSelect={select}
                />
              </div>
            </div>

            <PeerTable county={county} peer={peer} byGeoid={data.byGeoid} onSelect={select} />
            <FacilityList county={county} facilities={facilities} />
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
