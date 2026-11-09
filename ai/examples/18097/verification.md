# Verification: Marion County, IN (18097)

Checked 2026-11-09 against `input.json` (data version compute-atlas-v1.35.1-asof-2026-11-01_census-v2025).
Regenerated with the same prompt (ai/prompt.md, version 1) after the update to Compute Atlas v1.35.1.

| Statement in output | Input field | Match |
|---|---|---|
| snapshot of November 1, 2026 | `snapshot_date` | ✓ |
| 3 qualifying documented pipeline records | `pipeline_count` 3 | ✓ |
| 32 fewer, 5 same, 3 more (of 40) | `n_peers_fewer` 32, `n_peers_equal` 5, `n_peers_greater` 3 | ✓ (sums to 40) |
| peer median 1, peer mean 1.25 | `peer_median` 1.0, `peer_mean` 1.25 | ✓ |
| 26 of the 40 peers have at least one record | `n_peers_with_at_least_one_record` 26 | ✓ |
| populations from 678,179 to 1,636,630 | `peer_population_range` | ✓ |
| matched only on population and density | `peer_method` | ✓ |
| limitations sentence | `limitations` 1, 3, 5 | ✓ |

No harm, price, demographic, political or causal claims; it says the comparison does not explain the count.
