# Data sources and provenance

Exact URLs, retrieval timestamps, sizes, SHA-256 hashes and schema-check results for the files used in a build
are recorded in `data/raw/manifest.json` (committed) and copied into `public/data/metadata.json`.
Raw files are not committed; `python scripts/download_data.py` fetches them, or `--offline` verifies official
copies placed in `data/raw/` by hand.

## Compute Atlas: facility and pipeline records
- **Author / license:** Edward Kubiak. Data licensed **CC BY 4.0** (repository `LICENSE-DATA`); code MIT.
- **Repository:** https://github.com/ek33450505/compute-atlas · site https://www.compute-atlas.com/data
- **Pinned snapshot:** tag `v1.34.1`
  - `data/facilities.json`: https://raw.githubusercontent.com/ek33450505/compute-atlas/v1.34.1/data/facilities.json
  - `data/facilities.meta.json`: `asOf` 2026-10-02T18:14:01.267Z, `recordCount` 2328,
    `sourceRelease` 1.34.0, `schemaVersion` 1
  - The repository CHANGELOG dates release 1.34.1 to 2026-10-04. The build spec's "October 22, 2026" could not
    be confirmed; the meta file's `asOf` date is used as the snapshot date.
- **Verification (2026-10-26):** fields checked against the actual records and `lib/schema.ts`. All 2,328
  records have `id, name, operator, facilityType, status, confidence, location{lat, lon, state, precision},
  sources, lastUpdated`. `location.county` is present on 2,292 records and `location.multiSite` on 3. ids are
  unique.
- **Access note:** `www.compute-atlas.com` (API and schema endpoints) was not reachable from the build
  environment. The pinned raw GitHub file is the documented public export of the same dataset.
- **Required attribution:** "Compute-infrastructure data from Compute Atlas by Edward Kubiak, licensed under
  CC BY 4.0 — https://github.com/ek33450505/compute-atlas"
- **Transformations:** records were filtered to data-center pipeline and operational records, assigned to 2025
  Census counties, counted per county, and reduced to a subset of fields (id, name, operator, status,
  confidence, precision, coordinates, last updated, source links). No record was edited or added.

## U.S. Census Bureau (public domain)
| Purpose | File | Official URL |
|---|---|---|
| Population, July 1 2025 (`POPESTIMATE2025`) | `co-est2025-alldata.csv` | https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv |
| Land area (`ALAND_SQMI`) | `2025_Gaz_counties_national.zip` | https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip |
| County polygons (1:500k) | `cb_2025_us_county_500k.zip` | https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip |

Landing page for the estimates: https://www.census.gov/data/tables/time-series/demo/popest/2020s-counties-total.html

**Access note:** in the cloud build session, the egress proxy refused `CONNECT www2.census.gov:443` with
HTTP 403 (a network policy denial, not DNS, TLS or a timeout). The pipeline therefore supports offline builds
from official copies: each file must pass a schema check (required columns, row/feature counts, shapefile
components), and its SHA-256 is recorded with `acquired: "supplied_locally"`. No older vintage, synthetic or
unofficial substitute is used.

## Map display
The map uses only the local county polygons (coverage-simplified for drawing) and Leaflet. No tile provider,
API key or external request is involved.
