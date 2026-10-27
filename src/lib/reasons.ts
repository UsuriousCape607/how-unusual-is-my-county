/** Plain-language labels for the pipeline's exclusion reasons (codes come from process_facilities.py). */
export const REASON_LABELS: Record<string, string> = {
  "status:operational": "Already operating (shown separately as context)",
  "status:cancelled": "Cancelled",
  "facility_type:power_generation": "A power-generation project, not a data center",
  "facility_type:crypto_mining": "A crypto-mining site, not a data center",
  "confidence:rumored": "Only rumored (low confidence)",
  "assignment:outside_geographic_scope": "Outside the 50 states and DC",
  "assignment:unresolved_multi_site": "Covers several sites with no single county",
  "assignment:approximate_without_source_county": "Approximate location with no county named",
  "assignment:ambiguous_source_county_name": "Its county name matches more than one county",
  "assignment:unrecognized_source_county_name": "Its county name isn't a 2025 Census county",
  "assignment:conflict_point_county_vs_source_county": "Its map location and named county disagree",
  "assignment:conflict_point_state_vs_source_state": "Its map location and named state disagree",
  "assignment:point_outside_county_polygons": "Its map location falls outside every county",
  "assignment:point_on_county_boundary_ambiguous": "It sits exactly on a county boundary",
};

export function reasonLabel(code?: string): string {
  if (!code) return "Not counted";
  return REASON_LABELS[code] ?? code;
}
