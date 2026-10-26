# Verification: Marion County, IN (18097)

Checked 2026-10-26 against `input.json` (data version compute-atlas-v1.34.1-asof-2026-10-02_census-v2025).

| Statement in output | Input field | Match |
|---|---|---|
| snapshot of October 2, 2026 | `snapshot_date` | ✓ |
| 3 qualifying documented pipeline records | `pipeline_count` 3 | ✓ |
| 33 fewer, 5 same, 2 more (of 40) | `n_peers_fewer` 33, `n_peers_equal` 5, `n_peers_greater` 2 | ✓ (sums to 40) |
| peer median 1, peer mean 1.075 | `peer_median` 1.0, `peer_mean` 1.075 | ✓ |
| 23 of the 40 peers have at least one record | `n_peers_with_at_least_one_record` 23 | ✓ |
| populations from 678,179 to 1,636,630 | `peer_population_range` | ✓ |
| matched only on population and density | `peer_method` | ✓ |
| limitations sentence | `limitations` 1, 3, 5 | ✓ |

Revision: manual review removed "similar size and settlement pattern" (an interpretation not in the input) and replaced it
with "similar population and density".
