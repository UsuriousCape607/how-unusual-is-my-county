# Feedback round (November 2026)

The site was shown to three reviewers: a family member, a friend who wrote a detailed review, and a friend who
gave feedback in a chat. This file records what each said and what changed as a result. Each change is covered by
the automated tests (see TEST_RESULTS.md).

## What reviewers said worked
- **Comparison:** being able to compare your own county with counties of similar population density shows "how
  typical your local development really is".
- **Architecture:** every county summary is a fixed template computed from the data, and the AI wrote prose only
  for three counties from pre-checked figures ("the AI never calculates figures"). The methodology is honest about
  what a zero means.
- **Core features:** the similar-counties table, dot chart, map, AI examples and county search all work. In one spot
  check, a reviewer found St. Lawrence County, NY's three records plausible given the area's hydropower.

## Changes

Numbers in row 1 are from the snapshot reviewed (Compute Atlas v1.34.1). After the update to v1.35.1 the same table reads
2,923 − 990 = 1,933 filtered out, 990 − 969 = 21 not placeable in one county, 1,954 not counted.

| # | Feedback | What we found | Change |
|---|---|---|---|
| 1 | The "records not in the headline count" table doesn't reconcile: the county-assignment rows add to 27, but 828 − 799 = 29. | The data and the live table did reconcile. There are **seven** assignment rows (11 + 7 + 4 + 2 + 2 + 2 + 1 = 29), and the full table sums to 1,529 = 2,328 − 799. The reviewer's text view dropped one of the three rows showing "2", the same view that blanked county names. Still, checking it meant adding twelve rows by hand. | The table is now grouped, and each group's subtotal shows its own arithmetic. "Did not meet the filters (2,328 − 828)": 1,500. "Met the filters but could not be placed in one county (828 − 799)": 29. "Total not counted (2,328 − 799)": 1,529. Python computes the subtotals. `validate_data.py` checks rows, subtotals and total against each other (`exclusion_table_reconciles`), and the end-to-end test re-adds the table as shown on the page. |
| 2 | The chart caption uses the British spelling "coloured" on an American site. | One more British form was in the interface: the status label "Cancelled". | "colored" and "Canceled" (the data's status code `cancelled` is unchanged). |
| 3 | If you switched the map to "All counties" and then picked a similar county, the map should go back to "Similar counties". | — | Picking a similar county from the list, the dot chart or the table now switches an "All counties" map back to "Similar counties". Clicking the map or searching keeps the view you chose. |
| 4 | Collapse "Methodology, limitations, and sources" by default: it is dense and most people don't need it. | — | It is now a disclosure, closed by default, with a one-line hint of what's inside. It opens from the header's "Methodology & sources" link, the "Full methodology and sources" link and find-in-page. Data dates stay unmissable in the banner at the top. |
| 5 | Add the ability to sort counties by median income. | Income needed a new official source. The Census API now requires a key, so the same table comes from the Census Bureau's static summary file. | New **median household income** column (ACS 2020–2024 5-year estimates, 2024 dollars) in the similar-counties table and its CSV. Every column in the table now sorts: click a header; click again to reverse; "Sort by most similar" resets it. Income is context only and is never used to choose similar counties; the note under the table says so. De Baca County, NM shows "n/a" because the Census Bureau had too few responses to estimate it. |
| — | (Found while testing #5) On phones, scrolling the wider table sideways hid the county names. | — | The county-name column stays pinned on narrow screens. |
