# Implementation log

## Status (2026-10-26)
- [x] Phase 1 audit of Compute Atlas `v1.34.1` (raw GitHub): 2,328 records, ids unique, schema matches
  `lib/schema.ts` (schemaVersion 1). facilityType ∈ {data_center 1811, power_generation 320, crypto_mining 197};
  status ∈ {operational, proposed, under_construction, permitted, cancelled}; confidence ∈ {confirmed, reported,
  rumored}; precision ∈ {exact 746, approximate 1573, representative_multi_site 9}; `multiSite` on 3 records;
  `county` missing on 36. Candidate pipeline records (type+status+confidence): 828 (254 exact, 572 approximate,
  2 multi-site). Source county names are inconsistent ("Maricopa" vs "Maricopa County") → normalised matching.
  Data license CC BY 4.0 (LICENSE-DATA); code MIT. meta: asOf 2026-10-02T18:14:01Z, sourceRelease 1.34.0;
  CHANGELOG dates tag v1.34.1 to 2026-10-04.
- [x] Pipeline scripts, unit tests (26 logic + 5 input-schema), validation step written.
- [ ] **Blocked: Census files.** The cloud session's egress proxy answers HTTP 403 to `CONNECT www2.census.gov:443`
  (policy denial; not DNS/TLS/timeout). `download_data.py` supports offline builds: put the three official files in
  `data/raw/` with the exact names below and run `python scripts/build_all.py --offline`.
    - `co-est2025-alldata.csv` ← https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv
    - `2025_Gaz_counties_national.zip` ← https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_counties_national.zip
    - `cb_2025_us_county_500k.zip` ← https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip
- [x] Frontend (React/Vite/Leaflet/Recharts): all components written, `tsc -b` clean, vitest 5/5. Not yet run
  against real data.
- [x] AI tooling (`ai/prompt.md`, `scripts/build_ai_examples.py inputs|check|assemble`), README, METHODOLOGY,
  DATA_SOURCES, Playwright smoke test (`tests/e2e/smoke.mjs`).
- [ ] Pending real data: pipeline run, 3 AI examples + AI_EVALUATION.md, TEST_RESULTS.md, e2e run, screenshots.
- [ ] No git remote yet: owner to create `UsuriousCape607/how-unusual-is-my-county` (this session cannot create
  repos), then attach with add_repo (push) and push `main`.

## Decisions made during implementation
- Exact points whose source county name is *unrecognised* (not a different real county) keep the spatial result
  and are flagged `source_name_unrecognized` in the review log (e.g. legacy Connecticut county names vs 2025
  planning regions). A source name that resolves to a different county is a conflict and is excluded.
- Exact points just outside every 500k polygon (shoreline generalisation) are accepted only if the nearest county
  is ≤1 km away and matches the source county name.
- Bare names that match two county equivalents (e.g. "Fairfax" → Fairfax County / Fairfax city) are not guessed
  for approximate records.
- Display polygons use `shapely.coverage_simplify` (tolerance 0.004°) so neighbours share edges; Aleutian parts
  east of 180° are shifted −360° for display only.
- Default demo county: Loudoun County, VA (51107), to be confirmed once real counts exist.

## Next steps
1. Obtain Census files → `python scripts/build_all.py --offline` → review `data/processed/qc_*.json` and
   `assignment_review.csv`.
2. Finish components, build, run Playwright smoke test (`npm run test:e2e`).
3. Generate the three AI examples from real input JSON, verify, write docs.
