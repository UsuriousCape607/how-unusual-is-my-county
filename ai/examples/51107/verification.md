# Verification: Loudoun County, VA (51107)

Checked 2026-10-26 against `input.json` (data version compute-atlas-v1.34.1-asof-2026-10-02_census-v2025).

| Statement in output | Input field | Match |
|---|---|---|
| snapshot of October 2, 2026 | `snapshot_date` 2026-10-02 | ✓ |
| 9 qualifying documented pipeline records | `pipeline_count` 9 | ✓ |
| proposed, permitted or under construction; confirmed or reported | `metric` | ✓ |
| 40 peer counties | `n_peers` 40 | ✓ |
| more records than all 40; none has the same count or more | `n_peers_fewer` 40, `n_peers_equal` 0, `n_peers_greater` 0 | ✓ |
| peer median 0.5, peer mean 1.25 | `peer_median` 0.5, `peer_mean` 1.25 | ✓ |
| 20 of the 40 peers have at least one record | `n_peers_with_at_least_one_record` 20 | ✓ |
| populations from 324,411 to 611,708 | `peer_population_range` | ✓ |
| chosen only for population and density, not data-center activity | `peer_method` | ✓ |
| one incomplete snapshot, not verified buildings; descriptive, not causal, not a significance test | `limitations` 1, 3, 5 | ✓ |

No harm, price, demographic, political or causal claims. It explicitly says it does not show why the count is higher.
Revision: the first draft said "informative because…"; the automated check flags "because", so it was reworded.
