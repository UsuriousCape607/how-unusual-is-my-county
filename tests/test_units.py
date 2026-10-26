"""Unit tests for name matching, county assignment rules and the peer algorithm.

These use small hand-made inputs to exercise the logic; they are test fixtures, not app data.
"""
import numpy as np
import pandas as pd
import pytest

from calculate_peers import nearest_peers, peer_stats, zscore
from common import norm_name, split_suffix
from process_facilities import CountyIndex, assign, metric_group

COUNTIES = pd.DataFrame(
    [
        ("51059", "VA", "Fairfax", "Fairfax County"),
        ("51600", "VA", "Fairfax", "Fairfax city"),
        ("51107", "VA", "Loudoun", "Loudoun County"),
        ("51095", "VA", "James City", "James City County"),
        ("24510", "MD", "Baltimore", "Baltimore city"),
        ("24005", "MD", "Baltimore", "Baltimore County"),
        ("29186", "MO", "Ste. Genevieve", "Ste. Genevieve County"),
        ("35013", "NM", "Doña Ana", "Doña Ana County"),
        ("02110", "AK", "Juneau", "Juneau City and Borough"),
        ("17099", "IL", "LaSalle", "LaSalle County"),
    ],
    columns=["geoid", "state", "cb_name", "cb_namelsad"],
)
IDX = CountyIndex(COUNTIES)


def rec(precision="exact", county=None, state="VA", lat=39.0, lon=-77.5, **kw):
    r = {"id": "t1", "facilityType": "data_center", "status": "proposed", "confidence": "reported",
         "location": {"lat": lat, "lon": lon, "state": state, "precision": precision}}
    if county is not None:
        r["location"]["county"] = county
    r.update(kw)
    return r


def test_norm_name():
    assert norm_name("Prince George's") == "princegeorges"
    assert norm_name("Saint Louis") == norm_name("St. Louis") == "stlouis"
    assert norm_name("De Kalb") == norm_name("DeKalb")
    assert norm_name("Doña Ana") == "donaana"


def test_split_suffix():
    assert split_suffix("Fairfax County") == ("Fairfax", "county")
    assert split_suffix("City of Richmond") == ("Richmond", "city")
    assert split_suffix("Juneau City and Borough") == ("Juneau", "city and borough")
    assert split_suffix("Loudoun") == ("Loudoun", None)


@pytest.mark.parametrize(
    "state,name,expected",
    [
        ("VA", "Fairfax County", ["51059"]),
        ("VA", "Fairfax city", ["51600"]),
        ("VA", "Fairfax", ["51059", "51600"]),  # ambiguous: must not be guessed
        ("VA", "Loudoun", ["51107"]),
        ("VA", "James City", ["51095"]),
        ("MD", "Baltimore City", ["24510"]),
        ("MO", "Sainte Genevieve", ["29186"]),
        ("NM", "Dona Ana County", ["35013"]),
        ("AK", "Juneau Borough", ["02110"]),
        ("IL", "La Salle", ["17099"]),
        ("VA", "Nowhere", []),
        ("VA", None, []),
    ],
)
def test_county_candidates(state, name, expected):
    assert IDX.candidates(state, name) == expected


def test_exact_point_match():
    a = assign(rec(county="Loudoun"), IDX, {"t1": ["51107"]}, {})
    assert (a["county_geoid"], a["assignment_method"], a["name_check"]) == ("51107", "spatial_join", "match")


def test_exact_point_conflict_is_logged_not_guessed():
    a = assign(rec(county="Fairfax County"), IDX, {"t1": ["51107"]}, {})
    assert a["county_geoid"] is None and a["assignment_issue"] == "conflict_point_county_vs_source_county"


def test_exact_point_resolves_bare_ambiguous_name():
    a = assign(rec(county="Fairfax"), IDX, {"t1": ["51600"]}, {})
    assert a["county_geoid"] == "51600" and a["name_check"] == "match"


def test_exact_point_outside_polygons_needs_name_and_tolerance():
    ok = assign(rec(county="Loudoun"), IDX, {}, {"t1": ("51107", 300.0)})
    assert ok["county_geoid"] == "51107" and ok["assignment_method"] == "spatial_nearest_name_confirmed"
    far = assign(rec(county="Loudoun"), IDX, {}, {"t1": ("51107", 5000.0)})
    assert far["county_geoid"] is None
    unnamed = assign(rec(), IDX, {}, {"t1": ("51107", 100.0)})
    assert unnamed["county_geoid"] is None


def test_approximate_uses_name_only():
    a = assign(rec("approximate", county="Loudoun"), IDX, {"t1": ["51059"]}, {})
    assert a["county_geoid"] == "51107" and a["assignment_method"] == "source_name_match"
    assert a["name_check"] == "approx_point_outside_named_county"
    amb = assign(rec("approximate", county="Fairfax"), IDX, {"t1": ["51059"]}, {})
    assert amb["county_geoid"] is None and amb["assignment_issue"] == "ambiguous_source_county_name"
    none = assign(rec("approximate"), IDX, {"t1": ["51107"]}, {})
    assert none["assignment_issue"] == "approximate_without_source_county"


def test_multi_site_and_territory_excluded():
    assert assign(rec("representative_multi_site", county="Loudoun"), IDX, {"t1": ["51107"]}, {})["county_geoid"] is None
    t = assign(rec(county="Guam", state="GU"), IDX, {}, {})
    assert t["assignment_issue"] == "outside_geographic_scope"


def test_metric_group_filters():
    assigned = {"county_geoid": "51107", "assignment_issue": None}
    assert metric_group(rec(), assigned) == ("pipeline", None)
    assert metric_group(rec(status="operational"), assigned)[0] == "operational"
    assert metric_group(rec(status="cancelled"), assigned) == (None, "status:cancelled")
    assert metric_group(rec(confidence="rumored"), assigned) == (None, "confidence:rumored")
    assert metric_group(rec(facilityType="crypto_mining"), assigned) == (None, "facility_type:crypto_mining")
    failed = {"county_geoid": None, "assignment_issue": "ambiguous_source_county_name"}
    assert metric_group(rec(), failed) == (None, "assignment:ambiguous_source_county_name")


def test_nearest_peers_excludes_self_and_breaks_ties_by_geoid():
    geoids = np.array([f"{i:05d}" for i in range(50)])
    z = np.zeros((50, 2))  # every distance ties at 0
    idx, dist = nearest_peers(geoids, z, k=40)
    assert 0 not in idx[0] and list(idx[0]) == list(range(1, 41))
    assert list(idx[10][:3]) == [0, 1, 2] and 10 not in idx[10]
    assert (dist == 0).all()


def test_nearest_peers_orders_by_distance():
    geoids = np.array(["00001", "00002", "00003", "00004"])
    z = np.array([[0, 0], [3, 0], [1, 0], [0, 2]], dtype=float)
    idx, dist = nearest_peers(geoids, z, k=3)
    assert list(geoids[idx[0]]) == ["00003", "00004", "00002"]
    assert np.allclose(dist[0], [1, 2, 3])


def test_nearest_peers_requires_sorted_geoids():
    with pytest.raises(ValueError):
        nearest_peers(np.array(["00002", "00001"]), np.zeros((2, 2)), k=1)


def test_peer_stats_sum_and_zero_case():
    counts = np.array([0] * 30 + [1] * 6 + [2] * 3 + [7])
    s = peer_stats(0, counts)
    assert (s["n_fewer"], s["n_equal"], s["n_greater"]) == (0, 30, 10)
    assert s["peer_median"] == 0 and s["n_peers_with_pipeline"] == 10
    s = peer_stats(2, counts)
    assert (s["n_fewer"], s["n_equal"], s["n_greater"]) == (36, 3, 1)
    assert s["n_fewer"] + s["n_equal"] + s["n_greater"] == 40


def test_zscore_uses_population_sd():
    x = np.array([1.0, 2.0, 3.0, 4.0])
    assert np.isclose(zscore(x).std(ddof=0), 1.0)
