"""Write the static files the website reads (public/data/).

  counties.geojson         display polygons (coverage-simplified so neighbours share edges), EPSG:4326; fills + clicks
  county_borders.geojson   every county edge exactly once (a line mesh), so borders draw crisp and even
  states.geojson           state border lines taken from the same snapped edges, so they coincide with county lines
  county_metrics.json, county_peers.json, facilities.json, metadata.json
  projects.json            every Compute Atlas record with whether (and where) it is counted, or why not
                           (loaded by the site only when someone searches for a project)

Display geometry is for drawing only; county assignment used the unsimplified 500k polygons.
"""
from __future__ import annotations

import sys
from datetime import datetime, timezone

import geopandas as gpd
import pandas as pd
import shapely
from shapely.affinity import translate
from shapely.geometry import MultiLineString, MultiPolygon, Polygon, mapping

from common import (
    ACCEPTED_CONFIDENCE, CENSUS_VINTAGE, COMPUTE_ATLAS_BASE, COMPUTE_ATLAS_TAG, DISTANCE_METHOD, FACILITY_TYPE, N_PEERS, OPERATIONAL_STATUS,
    POP_COLUMN, POP_REFERENCE_DATE,
    PIPELINE_STATUSES, PROCESSED, PUBLIC_DATA, RAW, SOURCES, data_version, read_json, write_json,
)

DISPLAY_TOLERANCE_DEG = 0.005
COORD_DECIMALS = 3  # ~100 m; display only
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


def line_features(mesh, cell_deg: float = 2.0) -> list[dict]:
    """Border lines grouped into 2°×2° tiles. A single nationwide multi-line would be redrawn in full by Leaflet's
    canvas on every small partial redraw (e.g. a hover outline); tiles keep redraws local without creating
    thousands of tiny layers."""
    parts = [p for p in (mesh.geoms if hasattr(mesh, "geoms") else [mesh]) if not p.is_empty]
    cells: dict[tuple[int, int], list] = {}
    for p in parts:
        c = p.centroid
        cells.setdefault((int(c.x // cell_deg), int(c.y // cell_deg)), []).append(p)
    return [rounded_feature(MultiLineString(v) if len(v) > 1 else v[0], {}) for _, v in sorted(cells.items())]


def feature_collection(features: list[dict]) -> dict:
    return {"type": "FeatureCollection", "features": features}


def project_index() -> list[dict]:
    """One row per Compute Atlas record: where it is counted, or the pipeline's first reason for not counting it.
    Lets visitors check a project they heard about. Statuses and reasons come straight from process_facilities."""
    raw = {r["id"]: r for r in read_json(RAW / SOURCES["compute_atlas_facilities"]["file"])}
    proc = pd.read_csv(PROCESSED / "facilities_processed.csv", dtype=str, keep_default_na=False)
    out = []
    for r in proc.itertuples():
        rec = raw[r.source_id]
        src = next((s.get("url") for s in rec.get("sources") or [] if isinstance(s, dict) and str(s.get("url", "")).startswith("http")), None)
        row = {
            "id": r.source_id, "name": r.name, "operator": r.operator, "type": r.facility_type, "status": r.status,
            "confidence": r.confidence, "state": r.state, "city": (rec.get("location") or {}).get("city"),
            "source_county": r.source_county, "county_geoid": r.county_geoid, "group": r.metric_group,
            "reason": r.exclusion_reason, "source_url": src,
        }
        out.append({k: v for k, v in row.items() if v not in (None, "")})
    return sorted(out, key=lambda x: x["id"])


def main() -> int:
    polys = gpd.read_file(PROCESSED / "counties_500k.gpkg").sort_values("geoid").reset_index(drop=True)
    if polys.crs.to_epsg() != 4326:
        print("ERROR: processed polygons are not EPSG:4326", file=sys.stderr)
        return 1
    simple = shapely.coverage_simplify(polys.geometry.values, DISPLAY_TOLERANCE_DEG)
    simple = [shapely.make_valid(g) if not g.is_valid else g for g in simple]
    simple = [shift_antimeridian(g) if gid.startswith("02") else g for g, gid in zip(simple, polys["geoid"])]
    # Snap once; every layer below is derived from these exact coordinates so lines and fills coincide.
    simple = list(shapely.set_precision(simple, 10 ** -COORD_DECIMALS))
    county_features = [rounded_feature(g, {"geoid": gid}) for g, gid in zip(simple, polys["geoid"])]
    write_json(PUBLIC_DATA / "counties.geojson", feature_collection(county_features), compact=True)

    # Drawing each polygon's own outline paints shared edges twice and lets later fills cover half of a neighbour's
    # stroke, which makes borders look uneven. A mesh with each edge once draws evenly.
    county_mesh = shapely.line_merge(shapely.union_all(shapely.boundary(simple)))
    write_json(PUBLIC_DATA / "county_borders.geojson", feature_collection(line_features(county_mesh)), compact=True)

    sgdf = gpd.GeoDataFrame({"state_fips": polys["geoid"].str[:2]}, geometry=simple, crs=4326)
    state_geoms = []
    for _, grp in sgdf.groupby("state_fips"):
        g = shapely.union_all(grp.geometry.values)  # robust union; snapping can upset the faster coverage union
        state_geoms.append(g if isinstance(g, (Polygon, MultiPolygon)) else shapely.make_valid(g))
    state_mesh = shapely.line_merge(shapely.union_all(shapely.boundary(state_geoms)))
    write_json(PUBLIC_DATA / "states.geojson", feature_collection(line_features(state_mesh)), compact=True)

    m = pd.read_csv(PROCESSED / "county_metrics.csv", dtype={"geoid": str, "state_fips": str})
    # Pipeline records per county by status, for the "what's in the count" line (statuses as listed in the snapshot).
    by_status: dict[str, dict[str, int]] = {}
    for f in read_json(PROCESSED / "facilities_included.json"):
        if f["metric"] == "pipeline":
            s = by_status.setdefault(f["county_geoid"], {k: 0 for k in PIPELINE_STATUSES})
            s[f["status"]] += 1
    metrics = []
    for r in m.itertuples():
        rec = {
            "geoid": r.geoid, "county_name": r.county_name, "state": r.state, "state_name": r.state_name,
            "population_2025": int(r.population_2025), "land_area_sqmi": round(float(r.land_area_sqmi), 2),
            "density_per_sqmi": round(float(r.density_per_sqmi), 2) if bool(r.eligible) else None,
            "pipeline_count": int(r.pipeline_count), "operational_count": int(r.operational_count),
            "eligible": bool(r.eligible),
            "pipeline_by_status": by_status.get(r.geoid, {k: 0 for k in PIPELINE_STATUSES}),
        }
        if bool(r.eligible):
            rec["z_ln_population"] = round(float(r.z_ln_population), 4)
            rec["z_ln_density"] = round(float(r.z_ln_density), 4)
        metrics.append(rec)
    write_json(PUBLIC_DATA / "county_metrics.json", metrics, compact=True)

    peers = read_json(PROCESSED / "county_peers.json")
    # Distances stay in data/processed/county_peers.json; the site does not display them.
    web_peers = {**peers, "peers": {g: {k: v for k, v in r.items() if k != "peer_distances"} for g, r in peers["peers"].items()}}
    write_json(PUBLIC_DATA / "county_peers.json", web_peers, compact=True)

    facilities = read_json(PROCESSED / "facilities_included.json")
    write_json(PUBLIC_DATA / "facilities.json", facilities, compact=True)
    write_json(PUBLIC_DATA / "projects.json", project_index(), compact=True)

    # Per-state context ("In Virginia, 22 of 133 counties have at least one"), computed here, not in the browser.
    state_context: dict[str, dict] = {}
    for r in metrics:
        s = state_context.setdefault(r["state"], {"state_name": r["state_name"], "counties": 0, "with_pipeline": 0, "pipeline_total": 0})
        s["counties"] += 1
        s["with_pipeline"] += int(r["pipeline_count"] > 0)
        s["pipeline_total"] += r["pipeline_count"]

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
            "population_reference_date": POP_REFERENCE_DATE,
            "population_vintage": f"Vintage {CENSUS_VINTAGE} estimates",
            "geography_vintage": str(CENSUS_VINTAGE),
            "site_data_built_at": generated_at,
        },
        "sources": {k: {kk: v.get(kk) for kk in ("url", "retrieved_at", "sha256", "bytes", "note") if v.get(kk) is not None}
                    for k, v in manifest.items()},
        # Credit as Compute Atlas asks (LICENSE-DATA "HOW TO ATTRIBUTE" and the site's /data and /api pages, rechecked
        # 2026-10-29): credit "Compute Atlas by Edward Kubiak", link www.compute-atlas.com (the GitHub repository is
        # only its source mirror), link the license, say what changed, and keep this site's analysis distinct from the
        # records. A tagged release is cited with its version and version-pinned URL (the /api page's "reproducible
        # snapshot" form); the concept DOI always resolves to the latest release, so it is given only as the
        # persistent identifier. Year = the snapshot's year.
        "compute_atlas": {
            "site": "https://www.compute-atlas.com",
            "repository": "https://github.com/ek33450505/compute-atlas",
            "tag": COMPUTE_ATLAS_TAG,
            "snapshot_as_of": ca_meta.get("asOf"),
            "source_release": ca_meta.get("sourceRelease"),
            "record_count": ca_meta.get("recordCount"),
            "schema_version": ca_meta.get("schemaVersion"),
            "license": "CC BY 4.0",
            "license_url": "https://creativecommons.org/licenses/by/4.0/",
            "attribution": "Data from Compute Atlas by Edward Kubiak (https://www.compute-atlas.com), licensed under "
                           "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).",
            "citation": f"Kubiak, E. ({(ca_meta.get('asOf') or '')[:4]}). Compute Atlas (Version {COMPUTE_ATLAS_TAG.lstrip('v')}) "
                        f"[Data set]. {COMPUTE_ATLAS_BASE}/data/facilities.json",
            "persistent_id": "Kubiak, E. (n.d.). Compute Atlas [Data set]. https://doi.org/10.5281/zenodo.22284476",
            "transformations": "Filtered to data-center pipeline and operational records, assigned to 2025 Census counties, "
                               "counted per county, and reduced to a subset of fields. No records were edited or added. "
                               "The county comparisons and summaries are this site's own analysis, not Compute Atlas's, "
                               "and do not imply its endorsement.",
        },
        "census": {
            "population": f"Vintage {CENSUS_VINTAGE} county population estimates ({POP_COLUMN}, July 1, {CENSUS_VINTAGE})",
            "land_area": f"{CENSUS_VINTAGE} Gazetteer county file, ALAND_SQMI (land only; water excluded)",
            "boundaries": f"{CENSUS_VINTAGE} cartographic boundary file cb_{CENSUS_VINTAGE}_us_county_500k "
                          "(NAD83, reprojected to WGS84)",
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
        "state_context": dict(sorted(state_context.items())),
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
    sizes = {p.name: f"{p.stat().st_size / 1e6:.2f} MB" for p in sorted(PUBLIC_DATA.glob("*json"))}
    print("Exported:", sizes)
    print(f"Default county: {by_geoid[DEFAULT_GEOID]['county_name']}, {by_geoid[DEFAULT_GEOID]['state']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
