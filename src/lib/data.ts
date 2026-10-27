import type { FeatureCollection } from "geojson";
import type { AIExample, AppData, CountyMetric, Facility, Metadata, PeersFile, Project } from "../types";

declare const __BUILD_ID__: string;

async function getJSON<T>(file: string): Promise<T> {
  // ?v= ties each data file to this build, so a refresh never mixes new code with old cached data.
  const res = await fetch(`${import.meta.env.BASE_URL}data/${file}?v=${__BUILD_ID__}`);
  if (!res.ok) throw new Error(`Could not load ${file} (HTTP ${res.status})`);
  return (await res.json()) as T;
}

const EMPTY: FeatureCollection = { type: "FeatureCollection", features: [] };

/** Load everything the page shows. Embeds skip the map geometry, which they do not display. */
export async function loadAppData(opts: { geometry?: boolean } = {}): Promise<AppData> {
  const geo = opts.geometry ?? true;
  const [metrics, peers, facilities, metadata, counties, countyBorders, states, ai] = await Promise.all([
    getJSON<CountyMetric[]>("county_metrics.json"),
    getJSON<PeersFile>("county_peers.json"),
    getJSON<Facility[]>("facilities.json"),
    getJSON<Metadata>("metadata.json"),
    geo ? getJSON<FeatureCollection>("counties.geojson") : EMPTY,
    geo ? getJSON<FeatureCollection>("county_borders.geojson") : EMPTY,
    geo ? getJSON<FeatureCollection>("states.geojson") : EMPTY,
    getJSON<{ examples: AIExample[] }>("ai_examples.json").catch(() => ({ examples: [] as AIExample[] })),
  ]);
  return {
    metrics,
    byGeoid: new Map(metrics.map((m) => [m.geoid, m])),
    peers,
    facilities,
    metadata,
    aiExamples: ai.examples,
    counties,
    countyBorders,
    states,
  };
}

let projectsPromise: Promise<Project[]> | null = null;

/** The "Find a project" index is fetched only the first time someone searches for a project. */
export function loadProjects(): Promise<Project[]> {
  projectsPromise ??= getJSON<Project[]>("projects.json").catch((e) => {
    projectsPromise = null; // allow a retry
    throw e;
  });
  return projectsPromise;
}

export function isEmbed(): boolean {
  return new URLSearchParams(window.location.search).get("embed") === "1";
}

/** Shareable address of the full site for a county (never includes the embed flag). */
export function countyUrl(geoid: string, embed = false): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("county", geoid);
  if (embed) url.searchParams.set("embed", "1");
  return url.toString();
}

/** Link for sharing: the county's preview page (c/<GEOID>/, built for link previews such as Discord) in production. */
export function shareUrl(geoid: string): string {
  if (!import.meta.env.PROD) return countyUrl(geoid); // preview pages are generated only by the production build
  return new URL(`c/${geoid}/`, new URL("./", window.location.href)).toString();
}

export function readGeoidFromUrl(): string | null {
  const g = new URLSearchParams(window.location.search).get("county");
  return g && /^\d{5}$/.test(g) ? g : null;
}

export function writeGeoidToUrl(geoid: string, replace = false): void {
  const url = new URL(window.location.href);
  url.searchParams.set("county", geoid);
  if (replace) window.history.replaceState({ geoid }, "", url);
  else window.history.pushState({ geoid }, "", url);
}
