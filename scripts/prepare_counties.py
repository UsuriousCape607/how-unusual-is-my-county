"""Build the eligible county universe: Vintage 2025 population, 2025 Gazetteer land area, 2025 CB polygons.

Outputs
  data/processed/counties.csv          one row per county (5-char GEOID string key)
  data/processed/counties_500k.gpkg    500k cartographic-boundary polygons in EPSG:4326 (used for assignment)
  data/processed/qc_counties.json      reconciliation report between the three Census files
"""
from __future__ import annotations

import sys

import geopandas as gpd
import numpy as np
import pandas as pd

import zipfile

from common import PROCESSED, RAW, SOURCES, STATE_FIPS_TO_USPS, gazetteer_delimiter, norm_name, write_json

POP_COL = "POPESTIMATE2025"


def fail(msg: str) -> None:
    print("ERROR: " + msg, file=sys.stderr)
    sys.exit(1)


def read_popest() -> tuple[pd.DataFrame, str]:
    path = RAW / SOURCES["census_popest_2025"]["file"]
    for enc in ("utf-8", "latin-1"):
        try:
            df = pd.read_csv(path, dtype=str, encoding=enc, keep_default_na=False)
            break
        except UnicodeDecodeError:
            continue
    required = {"SUMLEV", "STATE", "COUNTY", "STNAME", "CTYNAME", POP_COL}
    missing = required - set(df.columns)
    if missing:
        fail(f"population file is missing expected columns {sorted(missing)}; found {list(df.columns)[:12]}...")
    sumlev_counts = df["SUMLEV"].value_counts().to_dict()
    df = df[df["SUMLEV"] == "050"].copy()  # 040 rows are state aggregates
    df["state_fips"] = df["STATE"].str.zfill(2)
    df["geoid"] = df["state_fips"] + df["COUNTY"].str.zfill(3)
    df["population_2025"] = pd.to_numeric(df[POP_COL], errors="coerce")
    df.attrs["sumlev_counts"] = sumlev_counts
    return df, enc


def read_gazetteer() -> pd.DataFrame:
    path = RAW / SOURCES["census_gazetteer_2025"]["file"]
    with zipfile.ZipFile(path) as z:
        header = z.read(z.namelist()[0]).decode("utf-8").splitlines()[0]
    df = pd.read_csv(path, sep=gazetteer_delimiter(header), dtype={"GEOID": str}, compression="zip", encoding="utf-8")
    df.columns = [c.strip() for c in df.columns]
    missing = {"GEOID", "USPS", "NAME", "ALAND", "ALAND_SQMI"} - set(df.columns)
    if missing:
        fail(f"Gazetteer is missing expected columns {sorted(missing)}; found {list(df.columns)}")
    df["GEOID"] = df["GEOID"].str.strip()
    return df


def read_boundaries() -> gpd.GeoDataFrame:
    path = RAW / SOURCES["census_cb_counties_2025"]["file"]
    gdf = gpd.read_file(path)
    missing = {"GEOID", "STATEFP", "NAME", "NAMELSAD", "STUSPS", "STATE_NAME", "ALAND"} - set(gdf.columns)
    if missing:
        fail(f"boundary file is missing expected columns {sorted(missing)}; found {list(gdf.columns)}")
    gdf.attrs["source_crs"] = gdf.crs.to_string() if gdf.crs else None
    return gdf


def main() -> int:
    pop, enc = read_popest()
    gaz = read_gazetteer()
    cb = read_boundaries()

    scope = set(STATE_FIPS_TO_USPS)
    pop_s = pop[pop["state_fips"].isin(scope)]
    gaz_s = gaz[gaz["GEOID"].str[:2].isin(scope)]
    cb_s = cb[cb["STATEFP"].isin(scope)]

    for label, keys in (("population", pop_s["geoid"]), ("gazetteer", gaz_s["GEOID"]), ("boundaries", cb_s["GEOID"])):
        if keys.duplicated().any():
            fail(f"duplicate GEOIDs in {label}: {keys[keys.duplicated()].tolist()[:10]}")
        if not keys.str.fullmatch(r"\d{5}").all():
            fail(f"non 5-digit GEOIDs in {label}")

    sp, sg, sb = set(pop_s["geoid"]), set(gaz_s["GEOID"]), set(cb_s["GEOID"])
    universe = sp & sg & sb
    recon = {
        "population_rows_by_sumlev": pop.attrs["sumlev_counts"],
        "population_file_encoding": enc,
        "in_scope_counts": {"population": len(sp), "gazetteer": len(sg), "boundaries": len(sb)},
        "only_in_population": sorted(sp - universe),
        "only_in_gazetteer": sorted(sg - universe),
        "only_in_boundaries": sorted(sb - universe),
        "excluded_out_of_scope": {
            "population": int((~pop["state_fips"].isin(scope)).sum()),
            "gazetteer": int((~gaz["GEOID"].str[:2].isin(scope)).sum()),
            "boundaries": int((~cb["STATEFP"].isin(scope)).sum()),
        },
        "boundary_source_crs": cb.attrs["source_crs"],
    }
    if universe != sp or universe != sg or universe != sb:
        print("WARNING: GEOID sets differ between Census files; see qc_counties.json", file=sys.stderr)

    df = (
        pop_s[pop_s["geoid"].isin(universe)][["geoid", "state_fips", "STNAME", "CTYNAME", "population_2025"]]
        .merge(gaz_s[["GEOID", "ALAND", "ALAND_SQMI"]].rename(columns={"GEOID": "geoid"}), on="geoid", how="inner")
        .merge(
            pd.DataFrame(cb_s.drop(columns="geometry"))[["GEOID", "NAME", "NAMELSAD", "STUSPS", "ALAND"]].rename(
                columns={"GEOID": "geoid", "ALAND": "cb_aland"}
            ),
            on="geoid",
            how="inner",
        )
    )
    df = df.rename(
        columns={
            "STNAME": "state_name",
            "CTYNAME": "county_name",
            "ALAND": "land_area_m2",
            "ALAND_SQMI": "land_area_sqmi",
            "NAME": "cb_name",
            "NAMELSAD": "cb_namelsad",
            "STUSPS": "state",
        }
    )
    if (df["state"] != df["state_fips"].map(STATE_FIPS_TO_USPS)).any():
        fail("state abbreviation mismatch between boundaries and FIPS table")

    name_mismatch = df[df["county_name"].map(norm_name) != df["cb_namelsad"].map(norm_name)]
    recon["name_mismatch_population_vs_boundaries"] = name_mismatch[["geoid", "county_name", "cb_namelsad"]].to_dict("records")
    rel = (df["land_area_m2"] - df["cb_aland"]).abs() / df["land_area_m2"].where(df["land_area_m2"] > 0)
    recon["max_rel_diff_gazetteer_vs_cb_aland"] = float(rel.max()) if len(rel) else None

    valid = (df["population_2025"] > 0) & (df["land_area_sqmi"] > 0)
    recon["invalid_population_or_area"] = df.loc[~valid, ["geoid", "county_name", "population_2025", "land_area_sqmi"]].to_dict("records")
    df["eligible"] = valid
    df["density_per_sqmi"] = np.where(valid, df["population_2025"] / df["land_area_sqmi"], np.nan)
    df["population_2025"] = df["population_2025"].astype("Int64")
    df = df.sort_values("geoid").reset_index(drop=True)
    recon["universe_size"] = int(len(df))
    recon["eligible_size"] = int(valid.sum())

    PROCESSED.mkdir(parents=True, exist_ok=True)
    df[
        ["geoid", "state_fips", "state", "state_name", "county_name", "cb_name", "cb_namelsad",
         "population_2025", "land_area_m2", "land_area_sqmi", "density_per_sqmi", "eligible"]
    ].to_csv(PROCESSED / "counties.csv", index=False)

    geo = cb_s[cb_s["GEOID"].isin(universe)][["GEOID", "geometry"]].rename(columns={"GEOID": "geoid"}).to_crs(4326)
    geo = geo.sort_values("geoid").reset_index(drop=True)
    geo.to_file(PROCESSED / "counties_500k.gpkg", driver="GPKG")
    write_json(PROCESSED / "qc_counties.json", recon)

    print(f"Counties in universe: {len(df)}  eligible: {int(valid.sum())}  (CRS {recon['boundary_source_crs']} -> EPSG:4326)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
