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

## Settled decisions (do not reopen)
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
- Data dates must be unmissable: the "Data as of" banner (`DataFreshness.tsx`) under the header, as-of dates next to
  every count, a Data dates table in Methodology, and a neutral notice when the snapshot is > 45 days old.
- No live fetching in the browser. Owner-approved post-MVP extension (2026-10-26): a scheduled GitHub Actions rebuild
  (weekly and/or on a new Compute Atlas release) that runs the full pipeline + validation and deploys to GitHub Pages
  only if every check passes. AI examples are shown only when their `data_version` matches the site's.
- AI: three pre-generated explanations only (`public/data/ai_examples.json`, `ai/`); everything else uses a
  deterministic template. No API key needed. Do not write model identifiers into repo files.

## Environment gotchas
- Cloud sessions may block `www2.census.gov`; `download_data.py` fails loudly rather than substituting data.
- GitHub `raw.githubusercontent.com` worked; `github.com`/`api.github.com` did not.

## Progress
See `NOTES.md` for the running implementation log and next steps.
