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
- Map: single shared Leaflet canvas (a second canvas blocks county events); record markers only at zoom >= 6.
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
- Owner's `apple-design` skill applied: instant press feedback on controls; floating translucent search bar
  (sticky, blur, solid under reduced transparency) that always shows "Comparing <county>"; verdict/hero cross-fade
  and a morphing comparison bar (all three segments always rendered); system font with size-specific tracking;
  reduced-motion/transparency/contrast media queries. Map motion was already interruptible.

- Apple visual pass 2 (2026-10-26): one colour system in `src/lib/theme.ts` mirrored by `styles.css :root` —
  blue #0071e3 = this county; purple #8944ab / grey #8e8e93 / orange #c96e00 = similar counties with fewer / same /
  more (validated: all-pairs CVD ΔE ≥ 9, contrast ≥ 3:1). Same meanings in bar, dot plot and map. Borderless cards
  on #f5f5f7, Apple segmented control, filled search field, chevron disclosures, no callout bars/italics/caps labels.
- Map pass 2: `county_borders.geojson` (each edge once) + `states.geojson` as border lines on the same snapped edges
  (fills have no stroke) → even, crisp borders. Translucent highlights; exact site = blue dot, approximate =
  accuracy halo. Hover info in a frosted card inside `.map-frame` (Leaflet tooltips were clipped by the map edge).
  Large reframes (e.g. Similar counties) cross-fade instead of flying (Leaflet scales the old canvas during flights,
  so big zoom-outs showed blank map); small moves glide. Zoom control bottom-right; soft maxBounds; map 5:4.
  Focus ring on the map only for keyboard users (`.kbd` class set on Tab).

- Desktop zoom (2026-10-27): Leaflet's wheel zoom made discrete animated steps, dropped input during each step and
  redrew ~3,000 counties after every step (7 freezes of 105–177 ms per trackpad gesture). Replaced with
  `src/lib/smoothWheelZoom.ts`: pinch-style continuous zoom around the cursor, one redraw at the end (measured:
  map moves in 58/59 frames, 1 freeze). Never call public `map.stop()`: it snaps fractional zoom with an animation
  that aborted the next gesture and swallowed camera moves; use internal `_stop()`. Border meshes are grouped into
  2° tiles so small redraws (hover) stay local. e2e covers continuity, repeat gestures and cursor anchoring.

- Feature bundle (2026-10-27, owner-approved): status line under the count (only for 2+ records; precomputed
  `pipeline_by_status`); state context (`metadata.state_context`); one Share menu (copy link, print summary, CSV of
  similar counties and of records, embed code in a native <dialog>); `?embed=1` compact card (skips map geometry);
  "Find a project" over `projects.json` (all records with group/reason from process_facilities; lazy-loaded) with
  "Counted here / Counted in X / Operating / Not counted: reason"; "Report it to Compute Atlas" →
  https://www.compute-atlas.com/contribute (documented in their README; not reachable from the sandbox to verify).
  Print stylesheet: page 1 answer + chart, then records and the 10 most similar counties.
  Not built (discussed, not approved yet): robustness badge (20/40/80 peers), change-over-time, Spanish.

- Blank page on refresh (2026-10-27): GitHub Pages lets browsers reuse files for 10 min; JS has hashed names but data
  files don't, so a refresh after a deploy ran new code on old cached JSON (missing `state_context`) and crashed.
  Fix: every data fetch adds `?v=<build id>` (`__BUILD_ID__` defined in vite.config.ts); an ErrorBoundary shows
  "Something went wrong / Reload" instead of a blank page; post-v1 fields are read defensively. e2e simulates
  stale data and a render crash.

- Icon + link previews (2026-10-27, owner request): favicon / apple-touch-icon from the owner's image
  (`public/favicon*.png`, `apple-touch-icon.png`). Discord & co. read <meta> tags without running JS, and GitHub
  Pages serves one page for every `?county=`, so a pasted address-bar link showed only the generic card. Now each
  county's address is `c/<GEOID>/`: the `county-pages` plugin (vite.config.ts, build only) writes the built app
  again per county with asset paths moved two folders up and that county's tags between `<!--preview-->` markers
  (og:title = county, og:description = verdict() + count + as-of date + fewer/same/more; theme-color blue for the
  Discord stripe; no og:image:alt, which Discord shows as an "ALT" badge). `sitePreview` fills the generic tags in
  index.html (with the data date). `countyUrl()` gives `c/<GEOID>/` in production (dev keeps `?county=`; embeds keep
  `?county=…&embed=1`), `readGeoidFromUrl()` accepts both, old `?county=` links are rewritten on load, and data
  is fetched from `siteRoot()` (resolved from the script URL, since pages now sit two folders deep). Absolute URLs
  come from `SITE_URL` (default: the GitHub Pages address). Mobile: Share menu anchors left at ≤520 px.

- Large preview images (2026-10-27, owner request: rich cards on X/Facebook/WhatsApp/iMessage): the link-preview
  plugins moved to `previews/plugin.ts`; `previews/card.html` is the 1200 × 630 template (county name, verdict,
  count + as-of date, the fewer/same/more bar, state locator map with the county in blue — Alaska wraps at 180°,
  tiny counties get a ring — sources and host). The build renders it per county with headless Chromium (4 tabs,
  ~3.5 min cold), quantises to a 128-colour PNG with sharp (~37 KB; 124 MB total) and caches by content hash in
  `.cache/share-images/` (rebuild with unchanged data: <1 s; CI caches it too). Inter (OFL, @fontsource-variable)
  is embedded so cards look the same anywhere. No browser outside CI → warning + small icon card; in CI → error.
  CI now installs Playwright before the build. D.C. shows once ("District of Columbia"), not twice.

- Languages (2026-10-27, owner request): en + es, ko, ko-Kore (國漢文混用), zh-TW, zh-CN, ja, hu, pl, sv. `src/i18n/`:
  `en.ts` is the typed source (strings or functions for plurals/params; `<b>/<a>/<code>/<list/>` markup rendered by
  `Rich.tsx`, never as HTML); translations are `Partial` and lazy-loaded (~6 KB gz each), merged over English.
  `state.ts` holds the active language for non-React helpers (format.ts, verdict(), error page); the build's link
  previews never set it, so they stay English. Language = `?lang=` → localStorage → `navigator.languages` → en
  (mixed-script Korean only by choice); the address carries `?lang=` and `countyUrl()` adds it to copied/embed links.
  Formatting via Intl (dates, numbers, plural rules, relative time, list joins); ko-Kore dates as 2026年 10月 2日;
  English output unchanged (unit tests). Sentences avoid suffixes/particles on English names (hu, ko) and Polish verbs
  agree with numerals. CJK: per-script system fonts by `:lang()`, no negative tracking, `keep-all` (ko) /
  `auto-phrase` (ja). Search Enter/arrows ignored during IME composition. Picker (`LanguagePicker.tsx`): popover
  (`dialog.show()`) ≥ 521 px, bottom sheet (`showModal()`) on phones with grabber, Done, backdrop tap, Escape, swipe-down
  (1:1 tracking, momentum projection, rubber-band). Methodology + AI examples stay English with a note. Translations
  are AI-written and unreviewed: worth a native-speaker pass. Also fixed: map hover said "the same than".
  CI caught a 2 px phone overflow that local runs missed: Linux CI renders system-ui as DejaVu Sans (wider than the
  Inter installed here), and a long source URL in Methodology widened the page. Phones widen the layout viewport to fit
  overflow, so `scrollWidth - innerWidth` stays 0; e2e now measures against the device width (390) and repeats the
  390 px check for every language with DejaVu forced. Fixes: `overflow-wrap: anywhere` on methodology/footer; on
  phones the map's segmented control lets long labels wrap (balanced) instead of widening the page.

## Next steps
1. Owner: give the three AI examples (ai/examples/*/output.md) a final read.
2. (Done 2026-10-26) Repo public, Pages source = GitHub Actions. Live at
   https://usuriouscape607.github.io/how-unusual-is-my-county/ (first CI build + deploy succeeded).
   Still to do: one manual run with rebuild_data ticked, to exercise the weekly refresh path.
3. (Done) Post-MVP (approved): `.github/workflows/rebuild.yml` (schedule + manual trigger; Python + Node; build_all →
   pytest → npm build → e2e → deploy Pages only on success; cache Census files, which change yearly). Bump
   `COMPUTE_ATLAS_TAG` automatically only to a newer release tag, recorded in the manifest.
