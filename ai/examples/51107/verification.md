# Verification: Loudoun County, VA (51107)

Checked 2026-11-09 against `input.json` (data version compute-atlas-v1.35.1-asof-2026-11-01_census-v2025).
Regenerated with the same prompt (ai/prompt.md, version 1) after the update to Compute Atlas v1.35.1.

| Statement in output | Input field | Match |
|---|---|---|
| snapshot of November 1, 2026 | `snapshot_date` 2026-11-01 | ✓ |
| 9 qualifying documented pipeline records | `pipeline_count` 9 | ✓ |
| proposed, permitted or under construction; confirmed or reported | `metric` | ✓ |
| 40 peer counties | `n_peers` 40 | ✓ |
| 39 have fewer, 1 has the same number, none has more | `n_peers_fewer` 39, `n_peers_equal` 1, `n_peers_greater` 0 | ✓ (sums to 40) |
| peer median 0.5, peer mean 1.425 | `peer_median` 0.5, `peer_mean` 1.425 | ✓ |
| 20 of the 40 peers have at least one record | `n_peers_with_at_least_one_record` 20 | ✓ |
| populations from 324,411 to 611,708 | `peer_population_range` | ✓ |
| chosen only for population and density, not data-center activity | `peer_method` | ✓ |
| one incomplete snapshot, not verified buildings; descriptive, not causal, not a significance test | `limitations` 1, 3, 5 | ✓ |

No harm, price, demographic, political or causal claims. It explicitly says it does not show why the count is higher.
Change from the v1.34.1 version: one peer now has the same count (9), so "more than all 40" became "39 have fewer, 1 has
the same number". The peer mean moved from 1.25 to 1.425.
