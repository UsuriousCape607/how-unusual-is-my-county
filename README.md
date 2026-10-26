# How Unusual Is My County?

Compare documented data-center development with similar counties across the United States.

Pick any county in the 50 states or DC. The site shows how many qualifying data-center pipeline records
(proposed, permitted or under construction) are documented there in a pinned
[Compute Atlas](https://github.com/ek33450505/compute-atlas) snapshot. It compares that count with the
40 counties most similar in population and population density, and explains the result in plain language.
Everything is precomputed in Python and served as static files: there is no backend, database, API key or
live AI.

- How the numbers are made: [METHODOLOGY.md](METHODOLOGY.md)
- Sources, versions, licenses: [DATA_SOURCES.md](DATA_SOURCES.md)
- AI explanations and their checks: [AI_EVALUATION.md](AI_EVALUATION.md)
- Test results: [TEST_RESULTS.md](TEST_RESULTS.md) · implementation log: [NOTES.md](NOTES.md)

## Requirements
- Python 3.11+ with the packages in `requirements.txt` (pandas, GeoPandas, Shapely ≥ 2.1, pyogrio, pyproj,
  requests, pytest)
- Node.js 18+ and npm

## Build the data
```bash
pip install -r requirements.txt
python scripts/build_all.py            # download → counties → facilities → peers → export → validate
```
If your network cannot reach `www2.census.gov`, download the three Census files listed in
[DATA_SOURCES.md](DATA_SOURCES.md) by hand, save them in `data/raw/` under the listed names, and run:
```bash
python scripts/build_all.py --offline  # never touches the network; verifies schemas and records SHA-256
```
Outputs go to `public/data/`. QC reports go to `data/processed/` (`qc_counties.json`, `qc_facilities.json`,
`assignment_review.csv`, `validation_report.json`).

## Run the website
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```
Share a county with `?county=<GEOID>`, e.g. `?county=51107`.

## Tests
```bash
python -m pytest -q          # logic tests + data/comparison checks on the built outputs
npm test                     # search and template-summary tests
npm run build && npm run test:e2e   # Playwright smoke test (desktop + mobile)
```

## Deploy (any static host)
`npm run build` produces a self-contained `dist/` folder (relative paths, data included). Upload it to GitHub
Pages, Netlify, Cloudflare Pages, S3 or any web server. No environment variables or credentials are needed.

## Repository layout
```
scripts/   download_data, prepare_counties, process_facilities, calculate_peers, export_web,
           validate_data, build_all, build_ai_examples, common
data/raw/  manifest.json (source files are downloaded here, not committed)
data/processed/  intermediate tables and QC reports
public/data/     counties.geojson, states.geojson, county_metrics.json, county_peers.json,
                 facilities.json, metadata.json, ai_examples.json
ai/        prompt and the three example inputs/outputs/verification notes
src/       React + TypeScript app (components/, lib/)
tests/     pytest suites and tests/e2e/smoke.mjs
```

## Attribution
Compute-infrastructure data from Compute Atlas by Edward Kubiak, licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — https://github.com/ek33450505/compute-atlas.
The data were filtered, assigned to counties and counted (see DATA_SOURCES.md). Population, land area and
boundaries: U.S. Census Bureau (public domain). Map rendering: Leaflet. Charts: Recharts.
