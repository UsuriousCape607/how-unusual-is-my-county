# Verification: Harris County, TX (48201), zero-count case

Checked 2026-11-09 against `input.json` (data version compute-atlas-v1.35.1-asof-2026-11-01_census-v2025).
Regenerated with the same prompt (ai/prompt.md, version 1) after the update to Compute Atlas v1.35.1.

| Statement in output | Input field | Match |
|---|---|---|
| Required zero-count sentence, verbatim | `pipeline_count` 0 | ✓ |
| snapshot of November 1, 2026 lists no qualifying site records | `snapshot_date`, `pipeline_count` 0 | ✓ |
| 13 share that count, 27 have more (of 40) | `n_peers_equal` 13, `n_peers_greater` 27, `n_peers_fewer` 0 | ✓ (sums to 40) |
| peer median 1, peer mean 2.875 | `peer_median` 1.0, `peer_mean` 2.875 | ✓ |
| 27 of the 40 peers have at least one record | `n_peers_with_at_least_one_record` 27 | ✓ |
| populations from 990,911 to 9,694,934 | `peer_population_range` | ✓ |
| does not mean no projects are proposed; inventory incomplete | `limitations` 2, 3 | ✓ |
| descriptive, not causal, not a significance test | `limitations` 5 | ✓ |

Does not say the county "has no proposed data centers". No harm, price, demographic, political or causal claims.
