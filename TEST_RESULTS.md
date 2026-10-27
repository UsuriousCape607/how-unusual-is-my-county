# Test results

Run on 2026-10-27 against data version `compute-atlas-v1.34.1-asof-2026-10-02_census-v2025`.

| Suite | Command | Result |
|---|---|---|
| Python logic + input-schema + output checks | `python -m pytest -q` | **35 passed** |
| Data & comparison validation | `python scripts/validate_data.py` | **26/26 passed** |
| AI explanation checks | `python scripts/build_ai_examples.py check` | **3/3 passed** |
| Frontend unit tests | `npm test` | **11 passed** |
| Type check + production build | `npm run build` | **passes** |
| End-to-end (Playwright, Chromium, desktop + 390 px mobile) | `npm run test:e2e` | **66/66 passed** (`docs/e2e-results.json`) |

## What is covered (spec section 12)
**Data:** 5-digit GEOIDs with leading zeros (e.g. `01001`); no duplicate or invalid keys; valid population and land
area for all 3,144 counties; the three Census files agree exactly (0 GEOIDs in only one file, 0 name mismatches,
Gazetteer and boundary land areas identical); no facility counted twice; every counted record has at least one
http(s) source link; every assignment failure is in `data/processed/assignment_review.csv`; county totals reconcile
with facility records (pipeline and operational); approximate records are never assigned by their map point;
multi-site aggregates are excluded; display GeoJSON is WGS84 lon/lat.

**Comparison:** exactly 40 distinct peers for every county; never self; fewer + equal + greater = 40; every peer
group matches an independent full-matrix recomputation with (distance, GEOID) ordering; medians and means match
Python `statistics`; zero-count (e.g. Autauga County, AL) and top-count (Santa Clara County, CA, 27) counties work.

**AI:** every digit in each output appears in its input JSON; no banned topics or causal wording; the zero-count
sentence is used; limitations are present; the inputs match the current data (stale examples are hidden).

**Interface:**
- Keyboard search selects by GEOID, and duplicate names are listed with their states.
- A map click selects the county whose name shows in the hover tooltip, **without moving the camera**; choosing a
  county from search glides the map to it. Both are measured from the map's published centre and zoom.
- The plain-language verdict restates the counts; example chips and the "What do these numbers mean?" panel work.
- "Similar counties" zooms out to frame the peers and settles fully visible after its cross-fade; the hover card
  appears inside the map frame; chart dots and the map legend match the fewer/same/more counts.
- Desktop wheel/trackpad zoom is continuous (the map moves in nearly every frame, at most 2 redraw freezes per
  gesture), a second gesture works immediately after the first, and the point under the cursor stays fixed.
- Share menu (keyboard + Escape), copy link, similar-counties CSV (county + 40 peers), embed code; `?embed=1` card;
  print layout; status line (shown for 2+ records, hidden for 1); state context; "Find a project" covers counted
  here / counted elsewhere (switches county) / operating / not counted with reason; report link. Validation adds:
  project index covers all records and matches the counted set, every uncounted record has a reason, status
  breakdown sums to the count, state context reconciles.
- County addresses and link previews: the app shows each county at `c/<GEOID>/` (search, map, chips, Back, an
  older `?county=` link all land there); the county page is the app itself, refreshes in place and names the county
  in the tab; its `og:title` is the county and `og:description` leads with the verdict and data date; image URLs are
  absolute, there's a theme colour and no image alt badge; the home preview carries the data date; both favicons
  are served. On a 390 px phone the Share menu stays fully on screen.
- The chart shows 40 peer dots; the summary breakdown, facility list and legend counts match the data.
- The peer table expands from 10 to 40 rows, and selecting a peer refocuses the app.
- Zero-count wording appears and "has no proposed data centers" never does.
- Share URLs, browser Back, an invalid GEOID and a data-load failure all behave sensibly.
- Refresh after a deploy: data requests carry the build ID; old-shaped cached data still renders; a render crash
  shows "Something went wrong" with a Reload button instead of a blank page.
- The data-as-of banner and attribution are visible.
- There are **no external network requests** (no API keys, tiles or CDNs), no console errors, and no horizontal
  overflow at 390 px.

## Bugs found by these tests and fixed
- The 2025 Gazetteer is **pipe-delimited** (earlier vintages used tabs); the input schema check caught it. The
  delimiter is now detected from the header.
- Map: facility markers drew on a second Leaflet canvas stacked above the counties, which blocked county hover and
  click. Markers now share the county canvas.
- Map: Leaflet drops zoom requests issued during an animated zoom, so "Zoom to county" right after a selection did
  nothing. Zoom animation is now off.
- Map: fixed-size record rings piled up at national zoom and hid the selected county. They now appear from zoom 6.

## Not covered automatically
- Whether external source links still resolve: the build sandbox cannot reach most outside hosts. The tests check
  only that every link is a well-formed http(s) URL.
- Screen-reader testing with assistive technology. Keyboard paths and ARIA roles are implemented but were not tested
  with NVDA or VoiceOver.
- Browsers other than Chromium.
