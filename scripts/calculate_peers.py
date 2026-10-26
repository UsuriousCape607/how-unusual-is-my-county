"""County metrics and 40-nearest-peer comparisons.

Matching uses only ln(population) and ln(density), each z-scored over the eligible universe with the
population standard deviation (ddof=0). The data-center count is never used to choose peers.
Exact distance ties are broken by GEOID ascending, so results are deterministic.

Outputs (data/processed/): county_metrics.csv, county_peers.json
"""
from __future__ import annotations

import sys

import numpy as np
import pandas as pd

from common import DISTANCE_METHOD, N_PEERS, PROCESSED, data_version, read_json, write_json


def zscore(x: np.ndarray) -> np.ndarray:
    return (x - x.mean()) / x.std(ddof=0)


def nearest_peers(geoids: np.ndarray, z: np.ndarray, k: int = N_PEERS) -> tuple[np.ndarray, np.ndarray]:
    """For each row return the indices and distances of its k nearest other rows (ties -> GEOID order).

    `geoids` must be sorted ascending so a stable sort on distance breaks ties by GEOID.
    """
    if not (geoids[:-1] < geoids[1:]).all():
        raise ValueError("geoids must be unique and sorted ascending")
    n = len(geoids)
    out_idx = np.empty((n, k), dtype=np.int64)
    out_dist = np.empty((n, k), dtype=np.float64)
    for i in range(n):
        d = np.sqrt(((z - z[i]) ** 2).sum(axis=1))
        d[i] = np.inf  # never your own peer
        order = np.argsort(d, kind="stable")[:k]
        out_idx[i], out_dist[i] = order, d[order]
    return out_idx, out_dist


def peer_stats(own: int, peer_counts: np.ndarray) -> dict:
    return {
        "peer_median": float(np.median(peer_counts)),
        "peer_mean": round(float(peer_counts.mean()), 4),
        "n_fewer": int((peer_counts < own).sum()),
        "n_equal": int((peer_counts == own).sum()),
        "n_greater": int((peer_counts > own).sum()),
        "n_peers_with_pipeline": int((peer_counts > 0).sum()),
    }


def main() -> int:
    counties = pd.read_csv(PROCESSED / "counties.csv", dtype={"geoid": str, "state_fips": str})
    facilities = read_json(PROCESSED / "facilities_included.json")
    meta_version = data_version()

    fac = pd.DataFrame(facilities)
    counts = fac.groupby(["county_geoid", "metric"]).size().unstack(fill_value=0)
    counties["pipeline_count"] = counties["geoid"].map(counts.get("pipeline", pd.Series(dtype=int))).fillna(0).astype(int)
    counties["operational_count"] = counties["geoid"].map(counts.get("operational", pd.Series(dtype=int))).fillna(0).astype(int)
    unknown = set(fac["county_geoid"]) - set(counties["geoid"])
    if unknown:
        print(f"ERROR: facilities assigned to GEOIDs outside the universe: {sorted(unknown)}", file=sys.stderr)
        return 1

    elig = counties[counties["eligible"]].sort_values("geoid").reset_index(drop=True)
    ln_pop = np.log(elig["population_2025"].to_numpy(dtype=float))
    ln_den = np.log(elig["density_per_sqmi"].to_numpy(dtype=float))
    stats = {
        "ln_population_mean": float(ln_pop.mean()), "ln_population_sd": float(ln_pop.std(ddof=0)),
        "ln_density_mean": float(ln_den.mean()), "ln_density_sd": float(ln_den.std(ddof=0)),
        "n_eligible": int(len(elig)),
    }
    elig["z_ln_population"] = zscore(ln_pop)
    elig["z_ln_density"] = zscore(ln_den)
    z = elig[["z_ln_population", "z_ln_density"]].to_numpy()
    geoids = elig["geoid"].to_numpy()
    idx, dist = nearest_peers(geoids, z)

    pc = elig["pipeline_count"].to_numpy()
    pop = elig["population_2025"].to_numpy(dtype=float)
    den = elig["density_per_sqmi"].to_numpy(dtype=float)
    peers = {}
    for i, g in enumerate(geoids):
        p = idx[i]
        rec = {
            "selected_geoid": g,
            "peer_geoids": geoids[p].tolist(),
            "peer_distances": [round(float(x), 4) for x in dist[i]],
            **peer_stats(int(pc[i]), pc[p]),
            "peer_population_min": int(pop[p].min()), "peer_population_max": int(pop[p].max()),
            "peer_density_min": round(float(den[p].min()), 2), "peer_density_max": round(float(den[p].max()), 2),
            "distance_method": DISTANCE_METHOD,
            "data_version": meta_version,
        }
        rec["pct_peers_with_pipeline"] = round(100 * rec["n_peers_with_pipeline"] / N_PEERS, 1)
        peers[g] = rec

    out = counties.merge(elig[["geoid", "z_ln_population", "z_ln_density"]], on="geoid", how="left")
    out.to_csv(PROCESSED / "county_metrics.csv", index=False)
    write_json(PROCESSED / "county_peers.json", {"standardization": stats, "n_peers": N_PEERS,
                                                 "distance_method": DISTANCE_METHOD, "peers": peers}, compact=True)
    print(f"Peers computed for {len(peers)} eligible counties; pipeline total {int(counties['pipeline_count'].sum())}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
