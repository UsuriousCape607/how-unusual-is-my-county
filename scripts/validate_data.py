"""Validate the exported website data against the data contracts and comparison rules.

Peer groups and statistics are recomputed here with an independent implementation (full distance matrix,
lexicographic sort on (distance, GEOID), Python `statistics`) and compared with the exported values.
Writes data/processed/validation_report.json; exits non-zero if any check fails.
"""
from __future__ import annotations

import re
import statistics
import sys
from collections import Counter

import numpy as np
import pandas as pd

from common import ACCEPTED_CONFIDENCE, FACILITY_TYPE, N_PEERS, PIPELINE_STATUSES, PROCESSED, PUBLIC_DATA, read_json, write_json

GEOID_RE = re.compile(r"^\d{5}$")


def load():
    return {
        "metrics": read_json(PUBLIC_DATA / "county_metrics.json"),
        "peers": read_json(PUBLIC_DATA / "county_peers.json"),
        "facilities": read_json(PUBLIC_DATA / "facilities.json"),
        "geojson": read_json(PUBLIC_DATA / "counties.geojson"),
        "metadata": read_json(PUBLIC_DATA / "metadata.json"),
        "processed": pd.read_csv(PROCESSED / "facilities_processed.csv", dtype=str, keep_default_na=False),
        "review": pd.read_csv(PROCESSED / "assignment_review.csv", dtype=str, keep_default_na=False),
    }


def geojson_coords(geom):
    def walk(c):
        if isinstance(c[0], (int, float)):
            yield c
        else:
            for x in c:
                yield from walk(x)
    yield from walk(geom["coordinates"])


def run_checks(d) -> dict[str, tuple[bool, str]]:
    res: dict[str, tuple[bool, str]] = {}
    metrics, peers, fac = d["metrics"], d["peers"]["peers"], d["facilities"]
    by = {m["geoid"]: m for m in metrics}

    geoids = [m["geoid"] for m in metrics]
    res["geoids_are_5_digit_strings"] = (all(isinstance(g, str) and GEOID_RE.match(g) for g in geoids)
                                         and all(GEOID_RE.match(f["county_geoid"]) for f in fac)
                                         and all(GEOID_RE.match(g) for g in peers), "")
    res["leading_zeros_kept"] = (any(g.startswith("0") for g in geoids) and "01001" in by, "Autauga County, AL is 01001")
    dup = [g for g, c in Counter(geoids).items() if c > 1]
    res["no_duplicate_county_keys"] = (not dup, f"duplicates: {dup[:5]}")
    geo_ids = [f["properties"]["geoid"] for f in d["geojson"]["features"]]
    res["geojson_matches_metrics"] = (sorted(geo_ids) == sorted(geoids) and len(set(geo_ids)) == len(geo_ids),
                                      f"{len(geo_ids)} features vs {len(geoids)} counties")
    bad = [m["geoid"] for m in metrics if m["eligible"] and not (m["population_2025"] > 0 and m["land_area_sqmi"] > 0)]
    res["valid_population_and_land_area"] = (not bad, f"invalid: {bad[:5]}")
    res["universe_is_50_states_plus_dc"] = (len({g[:2] for g in geoids}) == 51, f"{len({g[:2] for g in geoids})} state codes")

    lon_ok = lat_ok = True
    for f in d["geojson"]["features"]:
        for x, y in geojson_coords(f["geometry"]):
            lon_ok &= -190 <= x <= -60
            lat_ok &= 15 <= y <= 72
    res["geojson_is_wgs84_lonlat"] = (lon_ok and lat_ok, "coordinates within U.S. lon/lat bounds")

    ids = [f["source_id"] for f in fac]
    res["no_facility_counted_twice"] = (len(ids) == len(set(ids)), "")
    res["included_facilities_traceable"] = (all(f["source_links"] and all(l["url"].startswith("http") for l in f["source_links"])
                                                for f in fac if f["metric"] == "pipeline"), "every pipeline record has >=1 http(s) source link")
    res["facility_counties_in_universe"] = (all(f["county_geoid"] in by for f in fac), "")
    for metric, field in (("pipeline", "pipeline_count"), ("operational", "operational_count")):
        c = Counter(f["county_geoid"] for f in fac if f["metric"] == metric)
        mism = [g for g in by if by[g][field] != c.get(g, 0)]
        res[f"{metric}_totals_reconcile"] = (not mism, f"mismatched counties: {mism[:5]}")
    qc = d["metadata"]["facility_qc"]
    n_pipe = sum(1 for f in fac if f["metric"] == "pipeline")
    res["headline_total_matches_qc"] = (n_pipe == qc["headline_included"] == sum(m["pipeline_count"] for m in metrics), f"{n_pipe}")

    p = d["processed"]
    cand = p[(p["facility_type"] == FACILITY_TYPE) & p["status"].isin(PIPELINE_STATUSES) & p["confidence"].isin(ACCEPTED_CONFIDENCE)]
    unassigned = cand[cand["county_geoid"] == ""]
    res["pipeline_candidates_included_or_explained"] = (
        bool((cand["county_geoid"] != "").sum() == n_pipe and (unassigned["assignment_issue"] != "").all()), "")
    res["assignment_failures_logged"] = (set(unassigned["source_id"]) <= set(d["review"]["source_id"]), f"{len(unassigned)} unassigned candidates")
    res["approximate_never_assigned_by_point"] = (
        bool((cand[(cand["location_precision"] == "approximate") & (cand["county_geoid"] != "")]["assignment_method"] == "source_name_match").all()), "")
    res["multi_site_excluded"] = (
        bool((cand[cand["location_precision"] == "representative_multi_site"]["county_geoid"] == "").all()), "")

    # --- comparison checks with an independent recomputation ---
    elig = sorted(g for g in by if by[g]["eligible"])
    res["peers_for_every_eligible_county"] = (sorted(peers) == elig, f"{len(peers)} peer records / {len(elig)} eligible")
    errs = []
    for g, r in peers.items():
        pg = r["peer_geoids"]
        if len(pg) != N_PEERS or len(set(pg)) != N_PEERS:
            errs.append(f"{g}: not {N_PEERS} distinct peers")
        if g in pg:
            errs.append(f"{g}: self in peers")
        if r["n_fewer"] + r["n_equal"] + r["n_greater"] != N_PEERS:
            errs.append(f"{g}: fewer+equal+greater != {N_PEERS}")
        own = by[g]["pipeline_count"]
        counts = [by[x]["pipeline_count"] for x in pg]
        if (r["n_fewer"], r["n_equal"], r["n_greater"]) != (sum(c < own for c in counts), sum(c == own for c in counts), sum(c > own for c in counts)):
            errs.append(f"{g}: fewer/equal/greater mismatch")
        if abs(r["peer_median"] - statistics.median(counts)) > 1e-9 or abs(r["peer_mean"] - statistics.fmean(counts)) > 1e-4:
            errs.append(f"{g}: median/mean mismatch")
        if r["n_peers_with_pipeline"] != sum(c > 0 for c in counts):
            errs.append(f"{g}: n_peers_with_pipeline mismatch")
    res["peer_records_internally_consistent"] = (not errs, "; ".join(errs[:5]))

    # Independent nearest-neighbour recomputation from raw population and land area.
    pop = np.array([by[g]["population_2025"] for g in elig], dtype=float)
    m = pd.read_csv(PROCESSED / "county_metrics.csv", dtype={"geoid": str}).set_index("geoid").loc[elig]
    den = m["population_2025"].to_numpy(float) / m["land_area_sqmi"].to_numpy(float)
    lp, ld = np.log(pop), np.log(den)
    zp, zd = (lp - lp.mean()) / lp.std(), (ld - ld.mean()) / ld.std()
    D = np.sqrt((zp[:, None] - zp[None, :]) ** 2 + (zd[:, None] - zd[None, :]) ** 2)
    np.fill_diagonal(D, np.inf)
    rank = np.arange(len(elig))  # elig is sorted by GEOID, so index order == GEOID order
    mism = []
    for i, g in enumerate(elig):
        order = np.lexsort((rank, D[i]))[:N_PEERS]
        if [elig[j] for j in order] != peers[g]["peer_geoids"]:
            mism.append(g)
    res["peers_match_independent_recomputation"] = (not mism, f"mismatches: {mism[:5]}")

    zero = [g for g in elig if by[g]["pipeline_count"] == 0]
    top = max(elig, key=lambda g: (by[g]["pipeline_count"], g))
    res["zero_and_outlier_counties_work"] = (bool(zero) and peers[zero[0]]["n_fewer"] == 0 and peers[top]["n_greater"] == 0,
                                             f"zero example {zero[0] if zero else None}; max {top} ({by[top]['pipeline_count']})")
    return res


def main() -> int:
    res = run_checks(load())
    report = {k: {"pass": ok, "detail": det} for k, (ok, det) in res.items()}
    write_json(PROCESSED / "validation_report.json", report)
    failed = [k for k, (ok, _) in res.items() if not ok]
    for k, (ok, det) in res.items():
        print(f"[{'PASS' if ok else 'FAIL'}] {k}" + (f" — {det}" if det and not ok else ""))
    print(f"{len(res) - len(failed)}/{len(res)} checks passed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
