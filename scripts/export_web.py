"""Write the static files the website reads (public/data/).

  counties.geojson   display polygons (coverage-simplified so neighbours still share edges), EPSG:4326
  states.geojson     state outlines dissolved from the same display polygons
  county_metrics.json, county_peers.json, facilities.json, metadata.json

Display geometry is for drawing only; county assignment used the unsimplified 500k polygons.
"""
from __future__ import annotations

import sys
from datetime import datetime, timezone

import geopandas as gpd
import numpy as np
import pandas as pd
import shapely
from shapely.affinity import translate
from shapely.geometry import MultiPolygon, Polygon, mapping

from common import (
    ACCEPTED_CONFIDENCE, COMPUTE_ATLAS_TAG, DISTANCE_METHOD, FACILITY_TYPE, N_PEERS, OPERATIONAL_STATUS,
    PIPELINE_STATUSES, PROCESSED, PUBLIC_DATA, RAW, SOURCES, data_version, read_json, write_json,
)

DISPLAY_TOLERANCE_DEG = 0.004
COORD_DECIMALS = 4
# Demonstration county shown on first load. Chosen because it has several qualifying records;
# its numbers are calculated like every other county's.
DEFAULT_GEOID = "51107"  # Loudoun County, Virginia


def shift_antimeridian(geom):
    """Move polygon parts in the eastern hemisphere (Aleutians) west by 360° so Alaska draws contiguously."""
    parts = list(geom.geoms) if isinstance(geom, MultiPolygon) else [geom]
    moved = [translate(p, xoff=-360) if p.bounds[0] > 0 else p for p in parts]
    return MultiPolygon(moved) if len(moved) > 1 else moved[0]


def rounded_feature(geom, props: dict) -> dict:
    geom = shapely.set_precision(geom, 10 ** -COORD_DECIMALS)
    return {"type": "Feature", "properties": props, "geometry": mapping(geom)}


def feature_collection(features: list[dict]) -> dict:
    return {"type": "FeatureCollection", "features": features}


def main() -> int:
    polys = gpd.read_file(PROCESSED / "counties_500k.gpkg").sort_values("geoid").reset_index(drop=True)
    if polys.crs.to_epsg() != 4326:
        print("ERROR: processed polygons are not EPSG:4326", file=sys.stderr)
        return 1
    simple = shapely.coverage_simplify(polys.geometry.values, DISPLAY_TOLERANCE_DEG)
    simple = [shapely.make_valid(g) if not g.is_valid else g for g in simple]
    simple = [shift_antimeridian(g) if gid.startswith("02") else g for g, gid in zip(simple, polys["geoid"])]
    county_features = [rounded_feature(g, {"geoid": gid}) for g, gid in zip(simple, polys["geoid"])]
    write_json(PUBLIC_DATA / "counties.geojson", feature_collection(county_features), compact=True)

    sgdf = gpd.GeoDataFrame({"state_fips": polys["geoid"].str[:2]}, geometry=simple, crs=4326)
    state_features = []
    for fips, grp in sgdf.groupby("state_fips"):
        g = shapely.coverage_union_all(grp.geometry.values)
        if not isinstance(g, (Polygon, MultiPolygon)):
            g = shapely.make_valid(g)
        state_features.append(rounded_feature(g, {"state_fips": fips}))
    write_json(PUBLIC_DATA / "states.geojson", feature_collection(state_features), compact=True)

    m = pd.read_csv(PROCESSED / "county_metrics.csv", dtype={"geoid": str, "state_fips": str})
    metrics = []
    for r in m.itertuples():
        rec = {
            "geoid": r.geoid, "county_name": r.county_name, "state": r.state, "state_name": r.state_name,
            "population_2025": int(r.population_2025), "land_area_sqmi": round(float(r.land_area_sqmi), 2),
            "density_per_sqmi": round(float(r.density_per_sqmi), 2) if bool(r.eligible) else None,
            "pipeline_count": int(r.pipeline_count), "operational_count": int(r.operational_count),
            "eligible": bool(r.eligible),
        }
        if bool(r.eligible):
            rec["z_ln_population"] = round(float(r.z_ln_population), 4)
            rec["z_ln_density"] = round(float(r.z_ln_density), 4)
        metrics.append(rec)
    write_json(PUBLIC_DATA / "county_metrics.json", metrics, compact=True)

    peers = read_json(PROCESSED / "county_peers.json")
    write_json(PUBLIC_DATA / "county_peers.json", peers, compact=True)

    facilities = read_json(PROCESSED / "facilities_included.json")
    write_json(PUBLIC_DATA / "facilities.json", facilities, compact=True)

    manifest = read_json(RAW / "manifest.json")
    ca_meta = read_json(RAW / SOURCES["compute_atlas_meta"]["file"])
    qc_f = read_json(PROCESSED / "qc_facilities.json")
    qc_c = read_json(PROCESSED / "qc_counties.json")
    by_geoid = {r["geoid"]: r for r in metrics}
    if DEFAULT_GEOID not in peers["peers"]:
        print(f"ERROR: default county {DEFAULT_GEOID} is not in the eligible universe", file=sys.stderr)
        return 1

    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    metadata = {
        "title": "How Unusual Is My County?",
        "data_version": data_version(),
        "generated_at": generated_at,
        "snapshot_date": ca_meta["asOf"][:10],
        "default_geoid": DEFAULT_GEOID,
        # Every date a visitor needs to judge how current the figures are; all shown on the site.
        "data_dates": {
            "facility_snapshot_as_of": ca_meta["asOf"],
            "facility_file_retrieved_at": manifest["compute_atlas_facilities"].get("retrieved_at"),
            "population_reference_date": "2025-07-01",
            "population_vintage": "Vintage 2025 estimates",
            "geography_vintage": "2025",
            "site_data_built_at": generated_at,
        },
        "sources": {k: {kk: v.get(kk) for kk in ("url", "retrieved_at", "sha256", "bytes", "note") if v.get(kk) is not None}
                    for k, v in manifest.items()},
        "compute_atlas": {
            "repository": "https://github.com/ek33450505/compute-atlas",
            "tag": COMPUTE_ATLAS_TAG,
            "snapshot_as_of": ca_meta.get("asOf"),
            "source_release": ca_meta.get("sourceRelease"),
            "record_count": ca_meta.get("recordCount"),
            "schema_version": ca_meta.get("schemaVersion"),
            "license": "CC BY 4.0",
            "license_url": "https://creativecommons.org/licenses/by/4.0/",
            "attribution": "Compute-infrastructure data from Compute Atlas by Edward Kubiak, licensed under CC BY 4.0 — "
                           "https://github.com/ek33450505/compute-atlas",
            "transformations": "Filtered to data-center pipeline and operational records, assigned to 2025 Census counties, "
                               "counted per county, and reduced to a subset of fields. No records were edited or added.",
        },
        "census": {
            "population": "Vintage 2025 county population estimates (POPESTIMATE2025, July 1, 2025)",
            "land_area": "2025 Gazetteer county file, ALAND_SQMI (land only; water excluded)",
            "boundaries": "2025 cartographic boundary file cb_2025_us_county_500k (NAD83, reprojected to WGS84)",
            "license": "U.S. Census Bureau data are public domain",
        },
        "geographic_scope": "Counties and county equivalents in the 50 states and the District of Columbia. "
                            "Puerto Rico and other territories are excluded in this version.",
        "filters": {
            "facility_type": FACILITY_TYPE,
            "pipeline_statuses": list(PIPELINE_STATUSES),
            "operational_status": OPERATIONAL_STATUS,
            "confidence": list(ACCEPTED_CONFIDENCE),
            "announcement_date_filter": None,
        },
        "peer_method": {
            "n_peers": N_PEERS,
            "distance_method": DISTANCE_METHOD,
            "description": "Euclidean distance on z-scored ln(population 2025) and ln(population density); "
                           "population standard deviation (ddof=0) over all eligible counties; self excluded; "
                           "ties broken by GEOID ascending. Data-center counts are not used to select peers.",
            "standardization": peers["standardization"],
        },
        "counties": {
            "universe": qc_c["universe_size"], "eligible": qc_c["eligible_size"],
            "with_pipeline_records": int(sum(1 for r in metrics if r["pipeline_count"] > 0)),
        },
        "facility_qc": qc_f,
        "caveats": [
            "Counts are documented site records in one dataset snapshot, not verified counts of buildings or all real projects.",
            "A zero means no qualifying record was found in this snapshot, not that no development is proposed.",
            "Compute Atlas coverage is incomplete and uneven; better-documented places may show more records.",
            "Records with only approximate coordinates are assigned by their source county name, never by the map point.",
            "Peer comparisons are descriptive. They do not show causes, impacts, or statistical significance.",
        ],
    }
    write_json(PUBLIC_DATA / "metadata.json", metadata)
    sizes = {p.name: f"{p.stat().st_size / 1e6:.2f} MB" for p in sorted(PUBLIC_DATA.glob("*.json*"))}
    print("Exported:", sizes)
    print(f"Default county: {by_geoid[DEFAULT_GEOID]['county_name']}, {by_geoid[DEFAULT_GEOID]['state']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
