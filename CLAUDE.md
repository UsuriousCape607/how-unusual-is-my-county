# How Unusual Is My County? — agent notes

**Purpose:** a static web GIS app that answers one question: does a U.S. county have more
*documented data-center pipeline site records* than its 40 most similar counties
(matched on log population and log population density)? Descriptive, not causal; politically neutral.
The full build spec lives outside the repo; this file and METHODOLOGY.md capture the settled decisions.

## Architecture
`scripts/download_data.py → prepare_counties.py → process_facilities.py → calculate_peers.py → export_web.py → validate_data.py`
(run all with `python scripts/build_all.py`). Python computes every statistic and writes static JSON/GeoJSON to
`public/data/`. The React + TypeScript + Vite frontend (`src/`, Leaflet + Recharts) only reads and displays it.
There is no backend, database, auth, paid tiles, or live LLM.
Interface text: `src/i18n/en.ts` (source of truth) + one lazy-loaded file per language (21: es, ko, ko-Kore, zh-TW, zh-CN,
ja, hu, pl, sv, el, el-x-kathar, az-Latn, mn-Cyrl, la-x-eccl, xno, pdc, ht, nv, it, tr, hi; AI-written, unreviewed, see
TRANSLATION_REVIEW.md); written-out dates for languages without browser data in `src/i18n/formats.ts`; methodology and
AI examples stay English. Link previews: `previews/` (Vite plugin
writes `c/<GEOID>/` pages and 1200×630 `og/<GEOID>.png` cards with headless Chromium at build time).

## Settled decisions (do not reopen)
- Attribution follows Compute Atlas's current `LICENSE-DATA` "HOW TO ATTRIBUTE": "Data from Compute Atlas by Edward Kubiak
  (https://www.compute-atlas.com), licensed under CC BY 4.0 (…)" — link the site, never the GitHub mirror; note the changes;
  keep our analysis distinct. Citation = the pinned release's snapshot form, "Kubiak, E. (2026). Compute Atlas (Version 1.34.1)
  [Data set]. <version-pinned raw URL>" (generated from the tag); the concept DOI 10.5281/zenodo.22284476 resolves to the
  latest release, so it is only the persistent identifier. All of it is built in `scripts/export_web.py` → metadata.json;
  footer, Methodology, map and CSVs read it.
- Sources: Compute Atlas `v1.34.1` raw GitHub snapshot (`data/facilities.json`, asOf 2026-10-02, CC BY 4.0, Edward Kubiak);
  Census Vintage 2025 county pop (`co-est2025-alldata.csv`, POPESTIMATE2025), 2025 Gazetteer (ALAND_SQMI),
  `cb_2025_us_county_500k`. Scope: 50 states + DC; territories excluded.
- Pipeline metric: `facilityType=data_center` AND status ∈ {proposed, permitted, under_construction}
  AND confidence ∈ {confirmed, reported} AND one defensible county. Status spelling in data is `cancelled`.
- Assignment: exact precision → point-in-polygon on the 500k polygons, cross-checked against source county name
  (conflict ⇒ excluded + logged). Approximate → only if source county + state reconcile to exactly one GEOID.
  `representative_multi_site` ⇒ excluded. Never guess; log to `data/processed/assignment_review.csv`.
- Peers: z-scores (population SD, ddof=0) of ln(pop) and ln(density) over the eligible universe; Euclidean distance;
  40 nearest, self excluded, ties broken by GEOID ascending. The data-center count is never used for matching.
- Census vintage is set once (`CENSUS_VINTAGE` in `scripts/common.py`); URLs, the required population column and the
  dates shown on the site derive from it. Changing it is a deliberate, manual step (re-verify schemas).
- Data dates must be unmissable: the "Data as of" banner (`DataFreshness.tsx`) under the header, as-of dates next to
  every count, a Data dates table in Methodology, and a neutral notice when the snapshot is > 45 days old.
- No live fetching in the browser. Owner-approved post-MVP extension (2026-10-26): a scheduled GitHub Actions rebuild
  (weekly and/or on a new Compute Atlas release) that runs the full pipeline + validation and deploys to GitHub Pages
  only if every check passes. AI examples are shown only when their `data_version` matches the site's.
- AI: three pre-generated explanations only (`public/data/ai_examples.json`, `ai/`); everything else uses a
  deterministic template. No API key needed. Do not write model identifiers into repo files.

## Deployment
`.github/workflows/rebuild-and-deploy.yml`: weekly check for a newer Compute Atlas release
(`scripts/check_compute_atlas_release.py --apply` moves the pin forward only), full rebuild + all tests, commit data
to main, deploy to GitHub Pages. Push to main = test + deploy committed data. Census files are cached in Actions.

## Environment gotchas
- Cloud sessions may block `www2.census.gov`; `download_data.py` fails loudly rather than substituting data.
- GitHub `raw.githubusercontent.com` worked; `github.com`/`api.github.com` did not. The session can push but cannot
  change repository settings (visibility, Pages); the owner does those.

## Progress
See `NOTES.md` for the running implementation log and next steps.
