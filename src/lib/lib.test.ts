import { describe, expect, it } from "vitest";
import type { CountyMetric, PeerRecord } from "../types";
import { buildIndex, searchCounties } from "./search";
import { templateSummary } from "./summary";
import { daysSince, fmtAgo, fmtDateShort } from "./format";

// Small hand-made inputs for logic tests only (not app data).
const m = (geoid: string, county_name: string, state: string, state_name: string, pipeline_count = 0): CountyMetric => ({
  geoid, county_name, state, state_name, population_2025: 1000, land_area_sqmi: 10, density_per_sqmi: 100,
  pipeline_count, operational_count: 0, eligible: true,
});
const metrics = [
  m("51107", "Loudoun County", "VA", "Virginia", 12),
  m("51059", "Fairfax County", "VA", "Virginia"),
  m("51600", "Fairfax city", "VA", "Virginia"),
  m("41067", "Washington County", "OR", "Oregon"),
  m("12123", "Taylor County", "FL", "Florida"),
  m("53000", "Washington County", "WA", "Washington"),
  m("22071", "Orleans Parish", "LA", "Louisiana"),
  m("29510", "St. Louis city", "MO", "Missouri"),
  m("35013", "Doña Ana County", "NM", "New Mexico"),
];
const index = buildIndex(metrics);
const labels = (q: string) => searchCounties(index, q).map((e) => e.label);

describe("county search", () => {
  it("finds counties by prefix and keeps duplicate names distinct by state", () => {
    expect(labels("washington")).toEqual(["Washington County, OR", "Washington County, WA"]);
    expect(labels("fairfax")).toEqual(["Fairfax city, VA", "Fairfax County, VA"]);
  });
  it("filters by state abbreviation or name", () => {
    expect(labels("washington, or")).toEqual(["Washington County, OR"]);
    expect(labels("Washington County, Oregon")).toEqual(["Washington County, OR"]);
    expect(labels("loudoun va")).toEqual(["Loudoun County, VA"]);
  });
  it("handles county equivalents, accents, Saint, and GEOIDs", () => {
    expect(labels("orleans parish")).toEqual(["Orleans Parish, LA"]);
    expect(labels("dona ana")).toEqual(["Doña Ana County, NM"]);
    expect(labels("saint louis")).toEqual(["St. Louis city, MO"]);
    expect(labels("51107")).toEqual(["Loudoun County, VA"]);
    expect(labels("")).toEqual([]);
  });
});

const peer = (o: Partial<PeerRecord>): PeerRecord => ({
  selected_geoid: "x", peer_geoids: [], peer_median: 0, peer_mean: 0, n_fewer: 0, n_equal: 0,
  n_greater: 0, n_peers_with_pipeline: 0, pct_peers_with_pipeline: 0, peer_population_min: 0, peer_population_max: 0,
  peer_density_min: 0, peer_density_max: 0, distance_method: "", data_version: "", ...o,
});

describe("template summary", () => {
  it("uses the required zero-count wording and never claims absence of projects", () => {
    const text = templateSummary(metrics[1], peer({ n_equal: 30, n_greater: 10, n_peers_with_pipeline: 10, pct_peers_with_pipeline: 25, peer_mean: 0.4 }), "2026-10-02").join(" ");
    expect(text).toContain("No qualifying pipeline records were found in Fairfax County, VA in the selected dataset snapshot");
    expect(text).not.toMatch(/has no (proposed )?data centers/i);
    expect(text).toContain("10 of the 40 peers (25%)");
  });
  it("states fewer/equal/greater from the record", () => {
    const text = templateSummary(metrics[0], peer({ n_fewer: 31, n_equal: 4, n_greater: 5, peer_median: 1.5, peer_mean: 2.125, n_peers_with_pipeline: 22, pct_peers_with_pipeline: 55 }), "2026-10-02").join(" ");
    expect(text).toContain("12 qualifying documented data-center pipeline records");
    expect(text).toContain("more than 31 of its 40 peer counties, the same as 4, and fewer than 5");
    expect(text).toContain("peer median is 1.5");
    expect(text).toContain("does not show causes");
  });
});

describe("data-date helpers", () => {
  it("counts whole days since the snapshot and formats them", () => {
    const now = new Date("2026-10-26T15:00:00Z");
    expect(daysSince("2026-10-02", now)).toBe(24);
    expect(daysSince("2026-10-02T18:14:01.267Z", now)).toBe(23);
    expect(fmtAgo(0)).toBe("today");
    expect(fmtAgo(1)).toBe("1 day ago");
    expect(fmtAgo(24)).toBe("24 days ago");
    expect(fmtAgo(120)).toBe("about 4 months ago");
    expect(fmtDateShort("2026-10-02")).toBe("Oct 2, 2026");
  });
});
