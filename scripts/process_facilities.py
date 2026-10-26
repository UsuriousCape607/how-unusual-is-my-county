"""Filter Compute Atlas records and assign each one to at most one county, deterministically.

Assignment rules (METHODOLOGY.md section 3):
  * out-of-scope state (territories)          -> unassigned: outside_geographic_scope
  * precision == representative_multi_site or a multiSite block -> unassigned: unresolved_multi_site
  * precision == exact: point-in-polygon on the 500k county polygons, cross-checked against the source
    county name. A source name that resolves to a *different* county is a conflict (unassigned, logged).
    Points that fall just outside every polygon (shoreline generalisation) are accepted only when the
    nearest county is within NEAREST_TOLERANCE_M and matches the source county name.
  * precision == approximate: accepted only when source county + state resolve to exactly one GEOID.
    The representative coordinate is never used to choose a county.

Outputs (data/processed/): facilities_processed.csv, assignment_review.csv, facilities_included.json,
qc_facilities.json
"""
from __future__ import annotations

import math
import sys
from collections import Counter, defaultdict

import geopandas as gpd
import pandas as pd
from pyproj import Geod
from shapely.geometry import Point
from shapely.ops import nearest_points

from common import (
    ACCEPTED_CONFIDENCE, FACILITY_TYPE, IN_SCOPE_USPS, OPERATIONAL_STATUS, PIPELINE_STATUSES, PROCESSED, RAW,
    SOURCES, norm_name, read_json, split_suffix, write_json,
)

NEAREST_TOLERANCE_M = 1000.0
GEOD = Geod(ellps="WGS84")


class CountyIndex:
    """Resolve a (state, source county name) pair to candidate GEOIDs using Census names only."""

    def __init__(self, counties: pd.DataFrame):
        self.by_full: dict[tuple[str, str], list[str]] = defaultdict(list)
        self.by_base: dict[tuple[str, str], list[str]] = defaultdict(list)
        self.state_of: dict[str, str] = {}
        for r in counties.itertuples():
            self.by_full[(r.state, norm_name(r.cb_namelsad))].append(r.geoid)
            self.by_base[(r.state, norm_name(r.cb_name))].append(r.geoid)
            self.state_of[r.geoid] = r.state

    def candidates(self, state: str, raw: str | None) -> list[str]:
        if not raw or not raw.strip():
            return []
        full = norm_name(raw)
        if (state, full) in self.by_full:  # "Fairfax County", "Baltimore city"
            return sorted(self.by_full[(state, full)])
        if (state, full) in self.by_base:  # bare names: "Loudoun", "James City", "Fairfax" (may be 2)
            return sorted(self.by_base[(state, full)])
        base, suffix = split_suffix(raw)
        if suffix:  # suffix that differs from Census LSAD, e.g. "Juneau Borough"
            return sorted(self.by_base.get((state, norm_name(base)), []))
        return []


def valid_coord(lat, lon) -> bool:
    return (
        isinstance(lat, (int, float)) and isinstance(lon, (int, float))
        and math.isfinite(lat) and math.isfinite(lon) and -90 <= lat <= 90 and -180 <= lon <= 180
    )


def spatial_lookup(records: list[dict], polys: gpd.GeoDataFrame) -> tuple[dict, dict]:
    """Return {id: [geoids intersecting point]} and {id: (nearest geoid, metres)} for points in no polygon."""
    pts = [(r["id"], r["location"]["lon"], r["location"]["lat"]) for r in records
           if valid_coord(r["location"].get("lat"), r["location"].get("lon"))]
    gpts = gpd.GeoDataFrame({"id": [p[0] for p in pts]}, geometry=[Point(p[1], p[2]) for p in pts], crs=4326)
    joined = gpd.sjoin(gpts, polys, how="left", predicate="intersects")
    hits: dict[str, list[str]] = defaultdict(list)
    for rid, geoid in zip(joined["id"], joined["geoid"]):
        if isinstance(geoid, str):
            hits[rid].append(geoid)
    nearest: dict[str, tuple[str, float]] = {}
    for rid, geom in zip(gpts["id"], gpts.geometry):
        if rid in hits:
            continue
        idx = polys.sindex.nearest(geom, return_all=False)[1][0]
        poly = polys.geometry.iloc[idx]
        q = nearest_points(geom, poly)[1]
        _, _, dist = GEOD.inv(geom.x, geom.y, q.x, q.y)
        nearest[rid] = (polys["geoid"].iloc[idx], float(dist))
    return {k: sorted(set(v)) for k, v in hits.items()}, nearest


def assign(rec: dict, idx: CountyIndex, hits: dict, nearest: dict) -> dict:
    loc = rec.get("location") or {}
    state = (loc.get("state") or "").strip().upper()
    precision = loc.get("precision") or "exact"  # schema default when the field is absent
    src_county = loc.get("county")
    cands = idx.candidates(state, src_county) if state in IN_SCOPE_USPS else []
    point = hits.get(rec["id"], [])
    out = {
        "state": state, "source_county": src_county, "location_precision": precision,
        "name_candidates": "|".join(cands), "point_county": "|".join(point),
        "county_geoid": None, "assignment_method": "unassigned", "name_check": None, "assignment_issue": None,
    }

    def unassigned(issue: str) -> dict:
        out["assignment_issue"] = issue
        return out

    if state not in IN_SCOPE_USPS:
        return unassigned("outside_geographic_scope")
    if precision == "representative_multi_site" or loc.get("multiSite"):
        return unassigned("unresolved_multi_site")

    if precision == "exact":
        if not valid_coord(loc.get("lat"), loc.get("lon")):
            return unassigned("invalid_coordinates")
        if not point:
            near = nearest.get(rec["id"])
            if near and near[1] <= NEAREST_TOLERANCE_M and near[0] in cands:
                out.update(county_geoid=near[0], assignment_method="spatial_nearest_name_confirmed",
                           name_check="match", point_county=f"nearest:{near[0]}@{near[1]:.0f}m")
                return out
            return unassigned("point_outside_county_polygons")
        if len(point) > 1:  # point on a shared boundary
            both = [g for g in point if g in cands]
            if len(both) == 1:
                out.update(county_geoid=both[0], assignment_method="spatial_join", name_check="match")
                return out
            return unassigned("point_on_county_boundary_ambiguous")
        geoid = point[0]
        if idx.state_of[geoid] != state:
            return unassigned("conflict_point_state_vs_source_state")
        if not src_county:
            check = "no_source_county"
        elif geoid in cands:
            check = "match"
        elif cands:
            return unassigned("conflict_point_county_vs_source_county")
        else:
            check = "source_name_unrecognized"
        out.update(county_geoid=geoid, assignment_method="spatial_join", name_check=check)
        return out

    if precision == "approximate":
        if not src_county or not src_county.strip():
            return unassigned("approximate_without_source_county")
        if len(cands) == 1:
            out.update(county_geoid=cands[0], assignment_method="source_name_match",
                       name_check="approx_point_in_named_county" if cands[0] in point
                       else "approx_point_outside_named_county")
            return out
        if len(cands) > 1:
            return unassigned("ambiguous_source_county_name")
        return unassigned("unrecognized_source_county_name")

    return unassigned(f"unknown_precision_{precision}")


def metric_group(rec: dict, a: dict) -> tuple[str | None, str | None]:
    """Return (group, exclusion_reason) for the headline pipeline metric; group is 'pipeline'/'operational'/None."""
    ftype, status, conf = rec.get("facilityType"), rec.get("status"), rec.get("confidence")
    if ftype != FACILITY_TYPE:
        return None, f"facility_type:{ftype}"
    if conf not in ACCEPTED_CONFIDENCE:
        reason = f"confidence:{conf}"
        return None, reason if status in PIPELINE_STATUSES else f"status:{status}"
    if status in PIPELINE_STATUSES:
        return ("pipeline", None) if a["county_geoid"] else (None, f"assignment:{a['assignment_issue']}")
    if status == OPERATIONAL_STATUS:
        return ("operational" if a["county_geoid"] else None), f"status:{status}"
    return None, f"status:{status}"


def source_links(rec: dict) -> list[dict]:
    links = []
    for s in rec.get("sources") or []:
        if isinstance(s, dict) and isinstance(s.get("url"), str) and s["url"].startswith(("http://", "https://")):
            link = {"url": s["url"]}
            for k_in, k_out in (("label", "label"), ("publisher", "publisher"), ("kind", "kind"), ("retrievedAt", "retrieved_at")):
                if s.get(k_in):
                    link[k_out] = s[k_in]
            links.append(link)
    return links


def main() -> int:
    records = read_json(RAW / SOURCES["compute_atlas_facilities"]["file"])
    ids = [r.get("id") for r in records]
    if len(ids) != len(set(ids)) or any(not i for i in ids):
        print("ERROR: facility ids are missing or not unique", file=sys.stderr)
        return 1

    counties = pd.read_csv(PROCESSED / "counties.csv", dtype={"geoid": str, "state_fips": str})
    polys = gpd.read_file(PROCESSED / "counties_500k.gpkg")
    idx = CountyIndex(counties)
    hits, nearest = spatial_lookup(records, polys)

    rows, included = [], []
    for rec in records:
        a = assign(rec, idx, hits, nearest)
        group, reason = metric_group(rec, a)
        loc = rec.get("location") or {}
        row = {
            "source_id": rec["id"], "name": rec.get("name"), "operator": rec.get("operator"),
            "facility_type": rec.get("facilityType"), "status": rec.get("status"), "confidence": rec.get("confidence"),
            "latitude": loc.get("lat"), "longitude": loc.get("lon"), **a,
            "metric_group": group, "exclusion_reason": None if group == "pipeline" else reason,
            "last_updated": rec.get("lastUpdated"), "n_source_links": len(source_links(rec)),
        }
        rows.append(row)
        if group:
            item = {
                "source_id": rec["id"], "county_geoid": a["county_geoid"], "metric": group,
                "name": rec.get("name"), "operator": rec.get("operator"), "status": rec.get("status"),
                "confidence": rec.get("confidence"), "location_precision": a["location_precision"],
                "assignment_method": a["assignment_method"], "last_updated": rec.get("lastUpdated"),
                "source_links": source_links(rec),
            }
            if valid_coord(loc.get("lat"), loc.get("lon")):
                item["latitude"], item["longitude"] = round(loc["lat"], 5), round(loc["lon"], 5)
            included.append({k: v for k, v in item.items() if v not in (None, "", [])} | {"source_links": item["source_links"]})

    df = pd.DataFrame(rows)
    df.to_csv(PROCESSED / "facilities_processed.csv", index=False)

    # Review log: every record that failed assignment, plus any accepted record with a name caveat.
    in_metric_scope = df["facility_type"].eq(FACILITY_TYPE) & df["confidence"].isin(ACCEPTED_CONFIDENCE) & \
        df["status"].isin(PIPELINE_STATUSES + (OPERATIONAL_STATUS,))
    review = df[in_metric_scope & (df["assignment_issue"].notna() | df["name_check"].isin(
        ["source_name_unrecognized", "approx_point_outside_named_county"]))]
    review[["source_id", "name", "status", "state", "source_county", "location_precision", "latitude", "longitude",
            "point_county", "name_candidates", "county_geoid", "assignment_method", "name_check",
            "assignment_issue"]].sort_values(["assignment_issue", "source_id"], na_position="last").to_csv(
        PROCESSED / "assignment_review.csv", index=False)

    pipe_cand = df[df["facility_type"].eq(FACILITY_TYPE) & df["status"].isin(PIPELINE_STATUSES)
                   & df["confidence"].isin(ACCEPTED_CONFIDENCE)]
    pipe = df[df["metric_group"] == "pipeline"]
    oper = df[df["metric_group"] == "operational"]
    dup_coords = pipe[pipe["location_precision"] == "exact"].groupby(
        [pipe["latitude"].round(4), pipe["longitude"].round(4)]).size()
    qc = {
        "total_records": int(len(df)),
        "records_by_facility_type": df["facility_type"].value_counts().to_dict(),
        "records_by_status": df["status"].value_counts().to_dict(),
        "records_by_confidence": df["confidence"].value_counts().to_dict(),
        "records_by_precision": df["location_precision"].value_counts().to_dict(),
        "headline_included": int(len(pipe)),
        "headline_exclusions_by_reason": df.loc[df["metric_group"] != "pipeline", "exclusion_reason"].value_counts().to_dict(),
        "pipeline_candidates_before_assignment": int(len(pipe_cand)),
        "pipeline_candidates_by_precision": pipe_cand["location_precision"].value_counts().to_dict(),
        "pipeline_assignment_methods": pipe["assignment_method"].value_counts().to_dict(),
        "pipeline_name_checks": pipe["name_check"].value_counts().to_dict(),
        "pipeline_assignment_failures": pipe_cand["assignment_issue"].value_counts().to_dict(),
        "pipeline_included_by_status": pipe["status"].value_counts().to_dict(),
        "pipeline_included_by_confidence": pipe["confidence"].value_counts().to_dict(),
        "pipeline_included_by_precision": pipe["location_precision"].value_counts().to_dict(),
        "operational_included": int(len(oper)),
        "operational_assignment_methods": oper["assignment_method"].value_counts().to_dict(),
        "pipeline_exact_points_sharing_coordinates": int((dup_coords > 1).sum()),
        "pipeline_counties_with_records": int(pipe["county_geoid"].nunique()),
        "nearest_tolerance_m": NEAREST_TOLERANCE_M,
        "review_log_rows": int(len(review)),
    }
    write_json(PROCESSED / "qc_facilities.json", qc)
    write_json(PROCESSED / "facilities_included.json", sorted(included, key=lambda r: (r["county_geoid"], r["metric"], r["source_id"])))

    print(f"Pipeline candidates {len(pipe_cand)} -> included {len(pipe)} in {qc['pipeline_counties_with_records']} counties; "
          f"operational included {len(oper)}; review rows {len(review)}")
    print("Assignment failures (pipeline):", qc["pipeline_assignment_failures"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
