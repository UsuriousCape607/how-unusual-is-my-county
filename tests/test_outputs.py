"""Data and comparison checks on the real exported datasets (run the pipeline first)."""
import pytest

from common import PUBLIC_DATA

pytestmark = pytest.mark.skipif(not (PUBLIC_DATA / "metadata.json").exists(), reason="pipeline outputs not built")


@pytest.fixture(scope="module")
def results():
    from validate_data import load, run_checks
    return run_checks(load())


def test_all_validation_checks_pass(results):
    failed = {k: det for k, (ok, det) in results.items() if not ok}
    assert not failed, failed


def test_expected_check_coverage(results):
    for name in ["geoids_are_5_digit_strings", "no_duplicate_county_keys", "no_facility_counted_twice",
                 "pipeline_totals_reconcile", "assignment_failures_logged", "peers_match_independent_recomputation",
                 "peer_records_internally_consistent", "zero_and_outlier_counties_work", "geojson_is_wgs84_lonlat"]:
        assert name in results
