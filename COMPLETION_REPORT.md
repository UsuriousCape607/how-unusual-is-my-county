# Completion report: How Unusual Is My County? v1.0

Date: 2026-10-26 · Data version `compute-atlas-v1.34.1-asof-2026-10-02_census-v2025`

## Result in numbers
- **Counties:** 3,144 counties and equivalents (50 states + DC), all eligible. The three Census files reconcile
  exactly.
- **Compute Atlas snapshot:** 2,328 records. 828 meet the type, status and confidence filters, and **799 are
  counted**, in **458 counties**. The other 29 are excluded with a logged reason:
  - 11 exact pins in a different county than the source names
  - 7 approximate records with no county named
  - 4 legacy Connecticut county names
  - 2 multi-site aggregates
  - 2 exact pins in a different state than the source names
  - 2 ambiguous names: a bare "Fairfax" and a bare "Baltimore", each of which could mean a county or an independent
    city
  - 1 exact pin outside every county polygon
- **How the 799 were assigned:** 240 by exact coordinates (all agreeing with the source's county name) and 559 by
  the source county name, since their coordinates are only approximate.
- **Distribution:** 2,686 counties have zero records. The highest counts are Santa Clara, CA (27), Maricopa, AZ
  (20), Cook, IL (14), Licking, OH (10), Spotsylvania, VA (10) and Loudoun, VA (9).

## Definition of done (spec section 13)
| # | Requirement | Status |
|---|---|---|
| 1 | Search any eligible county | ✅ Accessible combobox over all 3,144 counties; duplicate names shown with state; county code search |
| 2 | View documented pipeline records | ✅ Record list with name, operator, status, confidence, precision, assignment method, last updated, sources |
| 3 | Reproducible 40-peer comparison | ✅ Python; independently recomputed in validation |
| 4 | Fewer/equal/greater breakdown | ✅ Summary card, dot plot, template text |
| 5 | National map | ✅ Leaflet with local polygons only: selected and peer highlighting, optional shading, click to select, exact vs approximate markers |
| 6 | Facility source links | ✅ 94 links for Santa Clara alone; every counted record has at least one |
| 7 | Qualified explanation | ✅ Deterministic template for every county |
| 8 | 3 checked AI examples | ✅ Loudoun VA, Marion IN, Harris TX (zero-count); see AI_EVALUATION.md |
| 9 | Methodology, limitations, attribution | ✅ In-app section + METHODOLOGY.md, DATA_SOURCES.md |
| 10 | Runnable app with passing tests | ✅ See TEST_RESULTS.md |

## Shipped
- Reproducible Python pipeline: `build_all.py`, plus `--offline` builds from official files with schema checks and
  SHA-256 provenance.
- Static website (React + TypeScript + Vite, Leaflet, Recharts) with no backend, database, API keys or external
  requests.
- **Prominent data dates (owner request):**
  - a "Data as of" banner showing the snapshot age;
  - as-of dates next to every count;
  - a Data dates table in the methodology;
  - a neutral notice when the snapshot is more than 45 days old;
  - AI examples shown only when they match the current snapshot.
- Documentation: README, METHODOLOGY, DATA_SOURCES, AI_EVALUATION, TEST_RESULTS, NOTES (implementation log), CLAUDE.md
  (notes for agents), and screenshots in `docs/screenshots/`.

## Not shipped / deviations
- **Deployment:** the GitHub Actions workflow (weekly refresh + GitHub Pages deploy, publishing only if every check
  passes) is in place. It goes live once the owner makes the repo public and sets the Pages source to GitHub
  Actions. The spec lists continuous ingestion as a non-goal, so the weekly refresh is documented as an
  owner-approved extension.
- **Census download in the cloud sandbox:** blocked by network policy, so the owner supplied the official files and
  the hashes are recorded. On a normal network, `build_all.py` downloads them itself.
- **Compute Atlas API/schema endpoints** (`compute-atlas.com`) were unreachable; the pinned GitHub release file and
  the repository's `lib/schema.ts` were used to verify the schema.
- **Snapshot date:** the spec's candidate date (October 22, 2026) did not match the release metadata. The site uses
  the file's own `asOf` (2026-10-02).
- **AI examples** were written by the same assistant that built the pipeline (see the independence caveat in
  AI_EVALUATION.md). The owner should give them a final read.
- **Not tested:** whether external source links still resolve, screen readers, and non-Chromium browsers.

## Decisions for the owner to review
1. **Strict exclusions reduce some well-known projects' visibility.** About eleven records have exact coordinates
   that fall in a different county than their source names (e.g. Meta New Albany, OH; Google, Clay County, MO;
   Switch Citadel, NV). The spec says to log and not guess, so they are not counted. See `assignment_review.csv`.
2. **Bare "Fairfax"/"Baltimore" names** are not guessed (1 pipeline record each), and neither are legacy Connecticut
   county names (4 pipeline records).
3. Default demo county: **Loudoun County, VA** (9 records, more than all 40 peers).
