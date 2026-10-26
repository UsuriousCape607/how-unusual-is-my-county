# Methodology

**Question:** Does a county have more documented data-center development than other U.S. counties with similar
populations and population densities? Every statistic is computed in Python (`scripts/`) and exported as static
JSON. The website only displays those values.

## 1. County universe
- Counties and county equivalents in the 50 states and DC (parishes, boroughs, census areas, Virginia
  independent cities, Connecticut planning regions, etc.). Puerto Rico and other territories are excluded in v1.
- Key: five-character GEOID string = 2-digit state FIPS + 3-digit county FIPS, zero-padded. Counties are
  never joined by name.
- A county is in the universe only if it appears in all three Census files (population, Gazetteer, boundaries).
  Mismatches are reported in `data/processed/qc_counties.json`.
- **Population:** `POPESTIMATE2025` (July 1, 2025) from Vintage 2025 `co-est2025-alldata.csv`, rows with
  `SUMLEV == "050"` (state aggregate rows, `040`, are dropped).
- **Land area:** `ALAND_SQMI` from the 2025 Gazetteer county file. Water area is excluded.
- **Density** = population ÷ land area (sq mi).
- **Eligible** = population > 0 and land area > 0. No values are imputed.

## 2. What is counted (headline metric)
A **qualifying pipeline record** is a Compute Atlas record (snapshot `v1.34.1`) with all of:

| Field | Accepted values |
|---|---|
| `facilityType` | `data_center` |
| `status` | `proposed`, `permitted`, `under_construction` |
| `confidence` | `confirmed`, `reported` |
| county | exactly one defensible county assignment (section 3) |

These values were checked against the snapshot and the project's Zod schema (`lib/schema.ts`; note the
source spells `cancelled` with two Ls). Excluded from the headline count: operational, cancelled,
`crypto_mining`, `power_generation`, `rumored`, territories, multi-site aggregates and unassignable records.
Each excluded record is counted under its first failing reason, in the order type → status → confidence →
assignment. The counts are in `metadata.json → facility_qc.headline_exclusions_by_reason`. No
announcement-date filter is applied: the metric is the documented pipeline at the snapshot date.

**Operational count (secondary):** the same rules with `status == operational`. It is shown as context only
and never enters the comparison.

A record is a documented *site record*, not necessarily a separate physical building, and the inventory is
incomplete.

## 3. Assigning records to counties (deterministic)
1. Names are normalised for comparison: accents removed, case folded, "Saint" → "St", punctuation and spaces
   dropped. Source county names are matched to the Census `NAMELSAD` (e.g. "Fairfax County", "Fairfax city")
   first, then to the bare `NAME`. A suffix that differs from the Census one (e.g. "Juneau Borough") is
   matched by the bare name.
2. **Exact coordinates** (`location.precision == "exact"`): point-in-polygon on the *unsimplified* 2025
   1:500,000 county polygons (NAD83 reprojected to WGS84).
   - The source county name is cross-checked. If it names a different real county, the record is a
     **conflict**: it is excluded and logged.
   - If the source name is missing, the record is accepted (`name_check = no_source_county`).
   - If the source name matches no 2025 county, the record is accepted and flagged
     `source_name_unrecognized` (for example, legacy Connecticut county names).
   - A point on a shared boundary is accepted only if exactly one of the touching counties matches the
     source name.
   - A point outside every polygon (shoreline generalisation) is accepted only if the nearest county is
     ≤ 1 km away (geodesic) *and* matches the source county name.
   - The point's state must equal the record's state.
3. **Approximate coordinates:** assigned only when source county + state resolve to exactly one GEOID. The
   representative point is never used to choose a county. Its agreement with the named county is recorded
   for review only (`approx_point_in_named_county` / `approx_point_outside_named_county`). Ambiguous names
   (e.g. a bare "Fairfax" in Virginia, which matches two county equivalents) and unrecognised names are
   excluded and logged.
4. `representative_multi_site` records, and any record with a `multiSite` block, are excluded.
5. Every processed record keeps `assignment_method` and `location_precision`
   (`data/processed/facilities_processed.csv`). Failed and flagged cases go to
   `data/processed/assignment_review.csv`.

## 4. Peer selection
For each eligible county *i*:

```
x_i = ln(population_i)          y_i = ln(density_i)
zPop_i = (x_i − mean(x)) / sd(x)    zDensity_i = (y_i − mean(y)) / sd(y)
```

- Means and standard deviations are taken over all eligible counties. **sd is the population standard
  deviation (ddof = 0).** The fitted values are in `metadata.json → peer_method.standardization`.
- `distance(A, B) = sqrt((zPop_A − zPop_B)² + (zDensity_A − zDensity_B)²)`
- Peers are the **40** counties with the smallest distance. The county itself is excluded, and exact distance
  ties are broken by GEOID ascending (a stable sort over GEOID-ordered rows).
- The data-center count is never used to select peers.

## 5. Reported statistics (per county)
Selected count; peer median; peer mean; number of peers with fewer, equal and more records
(fewer + equal + greater = 40); and the number and percent of peers with at least one record.
No count/median ratios, indexes or significance tests are computed.

## 6. Verification
`scripts/validate_data.py` independently recomputes every peer group from raw population and land area
(full distance matrix, lexicographic sort on distance then GEOID) and every statistic (Python `statistics`).
It also checks GEOID formatting, duplicates, reconciliation of county totals with facility records,
traceability of sources, CRS bounds, and that all assignment failures are logged. The pytest suite wraps
these checks; see `TEST_RESULTS.md`.

## 7. Limitations
- **Coverage:** Compute Atlas is a curated public inventory and does not list every project. Coverage is
  uneven: places with more press or permitting visibility may show more records.
- **Zero:** "No qualifying pipeline records were found in this county in the selected dataset snapshot" does
  not mean no development is proposed.
- **Precision:** most pipeline records have approximate coordinates and are assigned by their named county.
  Map points for these records are drawn as dashed rings, not pins.
- **Snapshot:** the counts reflect one dated snapshot; statuses change.
- **Descriptive only:** similar population and density do not make counties alike in land, power, fiber,
  water, tax policy or zoning. The comparison shows how unusual a count is among demographically similar
  counties. It does not show why, whether it matters, or any environmental, economic or political effect.
- **Population estimates** are model-based Census estimates.
