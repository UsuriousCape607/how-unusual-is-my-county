import type { FeatureCollection } from "geojson";

export interface CountyMetric {
  geoid: string;
  county_name: string;
  state: string;
  state_name: string;
  population_2025: number;
  land_area_sqmi: number;
  density_per_sqmi: number | null;
  pipeline_count: number;
  operational_count: number;
  eligible: boolean;
  pipeline_by_status?: { proposed: number; permitted: number; under_construction: number }; // added after v1; optional so older data degrades
  z_ln_population?: number;
  z_ln_density?: number;
}

export interface PeerRecord {
  selected_geoid: string;
  peer_geoids: string[];
  peer_median: number;
  peer_mean: number;
  n_fewer: number;
  n_equal: number;
  n_greater: number;
  n_peers_with_pipeline: number;
  pct_peers_with_pipeline: number;
  peer_population_min: number;
  peer_population_max: number;
  peer_density_min: number;
  peer_density_max: number;
  distance_method: string;
  data_version: string;
}

export interface PeersFile {
  n_peers: number;
  distance_method: string;
  standardization: Record<string, number>;
  peers: Record<string, PeerRecord>;
}

export interface SourceLink {
  url: string;
  label?: string;
  publisher?: string;
  kind?: string;
  retrieved_at?: string;
}

export interface Facility {
  source_id: string;
  county_geoid: string;
  metric: "pipeline" | "operational";
  name?: string;
  operator?: string;
  status?: string;
  confidence?: string;
  location_precision?: string;
  assignment_method?: string;
  last_updated?: string;
  latitude?: number;
  longitude?: number;
  source_links: SourceLink[];
}

export interface Metadata {
  title: string;
  data_version: string;
  generated_at: string;
  snapshot_date: string;
  default_geoid: string;
  data_dates: {
    facility_snapshot_as_of: string;
    facility_file_retrieved_at: string | null;
    population_reference_date: string;
    population_vintage: string;
    geography_vintage: string;
    site_data_built_at: string;
  };
  sources: Record<string, { url: string; retrieved_at?: string; sha256?: string; bytes?: number; note?: string }>;
  compute_atlas: {
    repository: string;
    tag: string;
    snapshot_as_of: string;
    source_release?: string;
    record_count?: number;
    license: string;
    license_url: string;
    attribution: string;
    transformations: string;
  };
  census: Record<string, string>;
  geographic_scope: string;
  filters: { facility_type: string; pipeline_statuses: string[]; operational_status: string; confidence: string[] };
  peer_method: { n_peers: number; distance_method: string; description: string; standardization: Record<string, number> };
  counties: { universe: number; eligible: number; with_pipeline_records: number };
  state_context?: Record<string, { state_name: string; counties: number; with_pipeline: number; pipeline_total: number }>; // added after v1
  facility_qc: Record<string, unknown> & {
    total_records: number;
    headline_included: number;
    pipeline_candidates_before_assignment: number;
    headline_exclusions_by_reason: Record<string, number>;
    pipeline_assignment_methods: Record<string, number>;
    pipeline_assignment_failures: Record<string, number>;
    pipeline_included_by_precision: Record<string, number>;
    operational_included: number;
  };
  caveats: string[];
}

export interface AIExample {
  geoid: string;
  label: string;
  model: string;
  generated_at: string;
  snapshot_date: string;
  data_version: string;
  output: string;
  verification_status: string;
  verification_summary: string;
}

export interface AppData {
  metrics: CountyMetric[];
  byGeoid: Map<string, CountyMetric>;
  peers: PeersFile;
  facilities: Facility[];
  metadata: Metadata;
  aiExamples: AIExample[];
  counties: FeatureCollection;
  countyBorders: FeatureCollection;
  states: FeatureCollection;
}

/** One Compute Atlas record in the "Find a project" index (public/data/projects.json, loaded on demand). */
export interface Project {
  id: string;
  name?: string;
  operator?: string;
  type?: string;
  status?: string;
  confidence?: string;
  state?: string;
  city?: string;
  source_county?: string;
  county_geoid?: string;
  group?: "pipeline" | "operational";
  reason?: string;
  source_url?: string;
}
