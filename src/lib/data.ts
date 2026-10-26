import type { FeatureCollection } from "geojson";
import type { AIExample, AppData, CountyMetric, Facility, Metadata, PeersFile } from "../types";

async function getJSON<T>(file: string): Promise<T> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/${file}`);
  if (!res.ok) throw new Error(`Could not load ${file} (HTTP ${res.status})`);
  return (await res.json()) as T;
}

export async function loadAppData(): Promise<AppData> {
  const [metrics, peers, facilities, metadata, counties, states, ai] = await Promise.all([
    getJSON<CountyMetric[]>("county_metrics.json"),
    getJSON<PeersFile>("county_peers.json"),
    getJSON<Facility[]>("facilities.json"),
    getJSON<Metadata>("metadata.json"),
    getJSON<FeatureCollection>("counties.geojson"),
    getJSON<FeatureCollection>("states.geojson"),
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
    states,
  };
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
