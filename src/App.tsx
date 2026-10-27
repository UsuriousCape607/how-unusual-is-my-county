import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppData } from "./types";
import { countyUrl, isEmbed, loadAppData, readGeoidFromUrl, writeGeoidToUrl } from "./lib/data";
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
import FindProject from "./components/FindProject";
import EmbedView from "./components/EmbedView";
import LanguagePicker from "./components/LanguagePicker";
import { useM } from "./i18n/I18nProvider";
import { Rich } from "./i18n/Rich";
import { fmtInt } from "./lib/format";

// Example counties offered under the search box: a high count, the highest, a zero, and a typical case.
const EXAMPLE_GEOIDS = ["51107", "06085", "48201", "18097"];

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geoid, setGeoid] = useState<string | null>(null);
  const [source, setSource] = useState<SelectionSource>("other");
  const [missing, setMissing] = useState<string | null>(null); // a requested county code that does not exist
  const m = useM();
  const embed = useMemo(isEmbed, []);

  useEffect(() => {
    loadAppData({ geometry: !embed })
      .then((d) => {
        setData(d);
        const requested = readGeoidFromUrl();
        if (requested && d.peers.peers[requested]) {
          setGeoid(requested);
          if (!embed) writeGeoidToUrl(requested, true); // older ?county= links become the county's own page address
        } else {
          if (requested) setMissing(requested);
          setGeoid(d.metadata.default_geoid);
          if (!embed) writeGeoidToUrl(d.metadata.default_geoid, true);
        }
      })
      .catch((e: Error) => setError(e.message));
  }, [embed]);

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
      setMissing(null);
      setSource(from);
      setGeoid(g);
      writeGeoidToUrl(g);
    },
    [data, geoid],
  );

  const county = geoid && data ? data.byGeoid.get(geoid) : undefined;
  const peer = geoid && data ? data.peers.peers[geoid] : undefined;
  useEffect(() => {
    if (county && !embed) document.title = `${county.county_name}, ${county.state} · ${m.siteTitle}`;
  }, [county, embed, m]);
  const currentExamples = useMemo(
    () => (data ? data.aiExamples.filter((e) => e.data_version === data.metadata.data_version) : []),
    [data],
  );
  const facilities = useMemo(
    () => (data && geoid ? data.facilities.filter((f) => f.county_geoid === geoid) : []),
    [data, geoid],
  );

  if (embed) {
    return data && county && peer ? (
      <EmbedView county={county} peer={peer} metadata={data.metadata} />
    ) : (
      <main className="embed">
        <p className="muted">{error ? m.embedLoadError : m.loading}</p>
      </main>
    );
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="wrap header-inner">
          <div>
            <h1>{m.siteTitle}</h1>
            {geoid && <p className="print-only small">{m.printUrl(countyUrl(geoid))}</p>}
            <p className="subtitle">{m.subtitle}</p>
            {m.langNote && <p className="lang-note small">{m.langNote}</p>}
          </div>
          <div className="header-meta">
            <LanguagePicker />
            <a href="#methodology">{m.methodologyLink}</a>
          </div>
        </div>
      </header>
      {data && <DataFreshness metadata={data.metadata} />}

      <main className="wrap">
        {error && (
          <div className="state-box error" role="alert">
            <strong>{m.loadErrorTitle}</strong> {error}. <Rich text={m.loadErrorHelp} />
          </div>
        )}
        {!data && !error && (
          <div className="state-box loading" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" /> {m.loadingCounties(fmtInt(3144))}
          </div>
        )}

        {data && county && peer && (
          <>
            {/* Floating search stays reachable while scrolling and always shows where you are (wayfinding). */}
            <div className="search-bar">
              <CountySearch metrics={data.metrics} onSelect={select} />
              <p className="comparing" aria-hidden="true">
                <Rich text={m.comparing(`${county.county_name}, ${county.state}`)} />
              </p>
            </div>
            <section className="search-row" aria-label={m.examplesAria}>
              <p className="examples small">
                <span className="muted">{m.tryLabel}</span>
                {EXAMPLE_GEOIDS.filter((g) => data.byGeoid.has(g)).map((g) => {
                  const c = data.byGeoid.get(g)!;
                  return (
                    <button key={g} type="button" className="chip" aria-pressed={g === geoid} onClick={() => select(g)}>
                      {c.county_name}, {c.state}
                    </button>
                  );
                })}
              </p>
              {missing && <p className="notice">{m.notFound(missing)}</p>}
            </section>

            {/* Announce changes for screen-reader users. */}
            <p className="sr-only" aria-live="polite">
              {m.srShowing(`${county.county_name}, ${county.state_name}`, verdict(county, peer).headline)}
            </p>

            <div className="layout">
              <div className="area-summary">
                <CountySummary county={county} peer={peer} metadata={data.metadata} byGeoid={data.byGeoid} facilities={facilities} onSelect={select} />
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
                <FindProject selected={county.geoid} byGeoid={data.byGeoid} onSelect={select} />
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
              <Rich
                text={m.footer(data.metadata.compute_atlas.attribution, data.metadata.compute_atlas.transformations, data.metadata.data_version)}
                a={(label) => <a href={data.metadata.compute_atlas.license_url}>{label}</a>}
              />
            </p>
          ) : (
            <p>{m.footerFallback}</p>
          )}
        </div>
      </footer>
    </div>
  );
}
