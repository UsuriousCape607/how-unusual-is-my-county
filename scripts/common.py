"""Shared constants, paths and helpers for the data pipeline."""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"
PUBLIC_DATA = ROOT / "public" / "data"

N_PEERS = 40
DISTANCE_METHOD = "euclidean_z_ln_population_ln_density_popsd_v1"

# Pinned facility snapshot. The tag is immutable; the commit it points to is recorded in DATA_SOURCES.md.
COMPUTE_ATLAS_TAG = "v1.34.1"
COMPUTE_ATLAS_BASE = f"https://raw.githubusercontent.com/ek33450505/compute-atlas/{COMPUTE_ATLAS_TAG}"

SOURCES = {
    "compute_atlas_facilities": {
        "url": f"{COMPUTE_ATLAS_BASE}/data/facilities.json",
        "file": "compute_atlas_facilities.json",
    },
    "compute_atlas_meta": {
        "url": f"{COMPUTE_ATLAS_BASE}/data/facilities.meta.json",
        "file": "compute_atlas_facilities.meta.json",
    },
    "compute_atlas_data_license": {
        "url": f"{COMPUTE_ATLAS_BASE}/LICENSE-DATA",
        "file": "compute_atlas_LICENSE-DATA.txt",
    },
    "census_popest_2025": {
        "url": "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv",
        "file": "co-est2025-alldata.csv",
    },
    "census_gazetteer_2025": {
        "url": "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip",
        "file": "2025_Gaz_counties_national.zip",
    },
    "census_cb_counties_2025": {
        "url": "https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip",
        "file": "cb_2025_us_county_500k.zip",
    },
}

# 50 states + DC (FIPS -> USPS). Territories (PR 72, GU 66, VI 78, AS 60, MP 69) are out of scope for v1.
STATE_FIPS_TO_USPS = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", "10": "DE",
    "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
    "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
    "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
    "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
    "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
    "54": "WV", "55": "WI", "56": "WY",
}
IN_SCOPE_USPS = set(STATE_FIPS_TO_USPS.values())

# Headline-metric filters (values verified against the v1.34.1 snapshot and lib/schema.ts).
FACILITY_TYPE = "data_center"
PIPELINE_STATUSES = ("proposed", "permitted", "under_construction")
OPERATIONAL_STATUS = "operational"
ACCEPTED_CONFIDENCE = ("confirmed", "reported")

# County-equivalent suffixes as they appear in Census NAMELSAD values, longest first.
COUNTY_SUFFIXES = (
    "city and borough", "census area", "municipality", "borough", "parish", "county", "city",
)


def norm_name(text: str) -> str:
    """Normalize a place name for comparison: accents, case, 'Saint'/'St.', punctuation and spaces."""
    s = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii").lower().strip()
    s = re.sub(r"\bsainte\b", "ste", s)
    s = re.sub(r"\bsaint\b", "st", s)
    return re.sub(r"[^a-z0-9]", "", s)


def split_suffix(raw: str) -> tuple[str, str | None]:
    """Split 'Fairfax County' -> ('Fairfax', 'county'); 'City of Richmond' -> ('Richmond', 'city')."""
    s = raw.strip()
    m = re.match(r"(?i)^city of\s+(.+)$", s)
    if m:
        return m.group(1).strip(), "city"
    low = s.lower()
    for suf in COUNTY_SUFFIXES:
        if low.endswith(" " + suf):
            return s[: -len(suf) - 1].strip(), suf
    return s, None


def write_json(path: Path, obj, compact: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        if compact:
            json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        else:
            json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write("\n")


def read_json(path: Path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def data_version() -> str:
    """Short identifier of the exact inputs, e.g. 'compute-atlas-v1.34.1-asof-2026-10-02_census-v2025'."""
    meta = read_json(RAW / SOURCES["compute_atlas_meta"]["file"])
    return f"compute-atlas-{COMPUTE_ATLAS_TAG}-asof-{meta['asOf'][:10]}_census-v2025"
