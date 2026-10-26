/**
 * One colour system for the whole site (Apple system colours, accessible variants).
 * Meanings are fixed everywhere: blue = this county; purple / grey / orange = similar counties with
 * fewer / the same / more sites on record. Pairs validated with the dataviz palette checker
 * (all-pairs colour-blind ΔE >= 9, contrast >= 3:1 on white). Keep styles.css :root in sync.
 */
export const COLOR = {
  ink: "#1d1d1f",
  ink2: "#424245",
  muted: "#6e6e73",
  separator: "#d2d2d7",
  canvas: "#f5f5f7",
  card: "#ffffff",
  blue: "#0071e3", // this county, links, primary actions
  fewer: "#8944ab", // similar counties with fewer
  same: "#8e8e93", // similar counties with the same number
  more: "#c96e00", // similar counties with more
} as const;

/** Map styling: warm land on soft water, like Apple Maps' light appearance. */
export const MAP = {
  water: "#dfe9f2",
  land: "#fbfaf7",
  countyLine: "#dcd8d0",
  stateLine: "#aaa59b",
  hover: COLOR.ink,
} as const;

/** Sequential single-hue ramp for "All counties" shading (more = darker). */
export const RAMP: { min: number; label: string; color: string }[] = [
  { min: 0, label: "0", color: MAP.land },
  { min: 1, label: "1", color: "#d6e6f8" },
  { min: 2, label: "2–3", color: "#a3c6ef" },
  { min: 4, label: "4–9", color: "#5f9be2" },
  { min: 10, label: "10+", color: "#1f66c4" },
];

export type Comparison = "fewer" | "same" | "more";

export function comparisonOf(peerCount: number, ownCount: number): Comparison {
  return peerCount < ownCount ? "fewer" : peerCount > ownCount ? "more" : "same";
}
