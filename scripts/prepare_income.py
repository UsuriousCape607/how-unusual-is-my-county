"""County median household income (ACS 5-year, table B19013), shown beside the similar counties for context.

Context only: calculate_peers.py never reads this file, so income cannot influence which counties count as similar.
Counties the Census could not estimate (an annotation code instead of a value) are kept with no value, never filled in.

Input:  data/raw/acsdt5y<ACS_VINTAGE>-b19013.dat (official summary file), data/processed/counties.csv
Output: data/processed/county_income.csv, data/processed/qc_income.json
"""
from __future__ import annotations

import sys

import pandas as pd

from common import ACS_INCOME_TABLE, ACS_PERIOD, PROCESSED, RAW, SOURCES, write_json

EST, MOE = f"{ACS_INCOME_TABLE}_E001", f"{ACS_INCOME_TABLE}_M001"


def main() -> int:
    path = RAW / SOURCES["census_acs5_income"]["file"]
    if not path.exists():
        print(f"ERROR: {path} is missing; run scripts/download_data.py first", file=sys.stderr)
        return 1
    acs = pd.read_csv(path, sep="|", dtype=str, keep_default_na=False)
    missing_cols = {"GEO_ID", EST, MOE} - set(acs.columns)
    if missing_cols:
        print(f"ERROR: {path.name} is missing columns {sorted(missing_cols)}", file=sys.stderr)
        return 1
    acs = acs[acs["GEO_ID"].str.startswith("0500000US")].assign(geoid=lambda d: d["GEO_ID"].str[9:])

    universe = pd.read_csv(PROCESSED / "counties.csv", dtype={"geoid": str})["geoid"]
    acs = acs[acs["geoid"].isin(set(universe))]
    absent = sorted(set(universe) - set(acs["geoid"]))
    if absent:
        print(f"ERROR: {len(absent)} counties have no ACS row (e.g. {absent[:5]}); not filling them in", file=sys.stderr)
        return 1

    est = acs[EST].astype(int)
    moe = acs[MOE].astype(int)
    ok = est > 0
    out = pd.DataFrame({
        "geoid": acs["geoid"],
        "median_household_income": est.where(ok).astype("Int64"),
        "median_household_income_moe": moe.where(ok & (moe >= 0)).astype("Int64"),
        "acs_annotation": est.where(~ok).astype("Int64"),
    }).sort_values("geoid")
    out.to_csv(PROCESSED / "county_income.csv", index=False)

    qc = {
        "source_file": path.name,
        "period": ACS_PERIOD,
        "counties": int(len(out)),
        "with_estimate": int(ok.sum()),
        "not_available": {g: int(c) for g, c in zip(out.loc[out["acs_annotation"].notna(), "geoid"],
                                                    out.loc[out["acs_annotation"].notna(), "acs_annotation"])},
        "min": int(est[ok].min()), "median": int(est[ok].median()), "max": int(est[ok].max()),
    }
    write_json(PROCESSED / "qc_income.json", qc)
    print(f"Median household income ({ACS_PERIOD} ACS 5-year): {qc['with_estimate']} of {qc['counties']} counties; "
          f"not available: {qc['not_available']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
