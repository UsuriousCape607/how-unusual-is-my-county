# Implementation log

## Status (2026-10-26): MVP complete
- All phases done on real data. See COMPLETION_REPORT.md for results and TEST_RESULTS.md for test runs
  (pytest 34, validate 21/21, AI 3/3, vitest 6, e2e 26/26).
- Census files were supplied by the owner (cloud egress blocks www2.census.gov); hashes are in DATA_SOURCES.md and
  data/raw/manifest.json. Rebuild with `python scripts/build_all.py --offline` once they are in data/raw/.
- Compute Atlas audit facts: 2,328 records; 828 pipeline candidates; 799 counted in 458 counties.
- Remote: https://github.com/UsuriousCape607/how-unusual-is-my-county (`main`).

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
- Owner decision (2026-10-26): no live data fetching; keep dated snapshots and make dates very prominent (done:
  freshness banner, as-of dates on summary/chart/table/records, Data dates table, >45-day stale notice).
  Approved post-MVP: scheduled rebuild + GitHub Pages deploy. Spec lists continuous ingestion as a non-goal, so
  document it as an owner-approved extension.

- 2025 Gazetteer is pipe-delimited; delimiter auto-detected (`common.gazetteer_delimiter`).
- Map: single shared Leaflet canvas (a second canvas blocks county events); `zoomAnimation: false` (Leaflet drops zoom
  requests mid-animation); record markers only at zoom >= 6.
- Web export drops `peer_distances` (kept in data/processed) and rounds display coords to 3 decimals (~2 MB gzip total).

- Weekly refresh + Pages deploy workflow added (2026-10-26). The owner must make the repo public and set Pages
  source = GitHub Actions; the session's GitHub access cannot change settings.

- UI redesign (2026-10-26), following Apple HIG "charting data" (headline first, simple chart, details on demand),
  Material/Fluent hierarchy, NN/g progressive disclosure, GOV.UK plain numbers, and the dataviz skill:
  plain verdict sentence (`summary.verdict`: "all" = 40/40, "most" = more than half), hero count, diverging
  fewer/same/more bar (validated colours #3d6aa6 / #d3d8de / #b5822e), "What do these numbers mean?" Q&A,
  example chips, copy-link, UI wording "similar counties" / "sites in development".
- Map camera rules: map clicks never move the camera; search/table/chart selections glide (interruptible
  flyTo, instant under reduced motion); views = This county (default) | Similar counties (lower 48; AK/HI peers
  listed) | All counties (shaded). The map exposes `data-view="lat,lng,zoom"` for the e2e camera checks.
- The owner's `apple-design` skill was added after this session started and could not be loaded here; apply it in
  a new session (or from pasted content).

## Next steps
1. Owner: give the three AI examples (ai/examples/*/output.md) a final read.
2. (Done 2026-10-26) Repo public, Pages source = GitHub Actions. Live at
   https://usuriouscape607.github.io/how-unusual-is-my-county/ (first CI build + deploy succeeded).
   Still to do: one manual run with rebuild_data ticked, to exercise the weekly refresh path.
3. (Done) Post-MVP (approved): `.github/workflows/rebuild.yml` (schedule + manual trigger; Python + Node; build_all →
   pytest → npm build → e2e → deploy Pages only on success; cache Census files, which change yearly). Bump
   `COMPUTE_ATLAS_TAG` automatically only to a newer release tag, recorded in the manifest.
