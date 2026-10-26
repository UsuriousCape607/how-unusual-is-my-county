"""Schema checks applied to raw inputs before the pipeline accepts them (tiny hand-made files)."""
import zipfile

import geopandas as gpd
import pytest
from shapely.geometry import box

import download_data as dd


@pytest.fixture(autouse=True)
def small_minimum(monkeypatch):
    monkeypatch.setattr(dd, "MIN_COUNTY_ROWS", 2)


def write_popest(path, header="SUMLEV,STATE,COUNTY,STNAME,CTYNAME,POPESTIMATE2025", pop="58805"):
    rows = [header, f"040,01,000,Alabama,Alabama,5100000",
            f"050,01,001,Alabama,Autauga County,{pop}", "050,01,003,Alabama,Baldwin County,253507"]
    path.write_text("\n".join(rows) + "\n", encoding="latin-1")


def test_popest_accepts_expected_schema(tmp_path):
    p = tmp_path / "co-est2025-alldata.csv"
    write_popest(p)
    assert dd.check_popest(p)["county_rows"] == 2


def test_popest_rejects_wrong_vintage(tmp_path):
    p = tmp_path / "co-est2024-alldata.csv"
    write_popest(p, header="SUMLEV,STATE,COUNTY,STNAME,CTYNAME,POPESTIMATE2024")
    with pytest.raises(dd.SchemaError, match="POPESTIMATE2025"):
        dd.check_popest(p)


def test_popest_rejects_non_integer_population(tmp_path):
    p = tmp_path / "x.csv"
    write_popest(p, pop="N/A")
    with pytest.raises(dd.SchemaError):
        dd.check_popest(p)


def test_gazetteer_checks_columns(tmp_path):
    good = tmp_path / "gaz.zip"
    with zipfile.ZipFile(good, "w") as z:
        z.writestr("2025_Gaz_counties_national.txt",
                   "USPS\tGEOID\tANSICODE\tNAME\tALAND\tAWATER\tALAND_SQMI\tAWATER_SQMI\tINTPTLAT\tINTPTLONG   \n"
                   "AL\t01001\t1\tAutauga County\t1\t1\t594.4\t1\t32.5\t-86.6\n"
                   "AL\t01003\t1\tBaldwin County\t1\t1\t1589.8\t1\t30.7\t-87.7\n")
    assert dd.check_gazetteer(good)["rows"] == 2
    bad = tmp_path / "bad.zip"
    with zipfile.ZipFile(bad, "w") as z:
        z.writestr("x.txt", "USPS\tGEOID\tNAME\n")
    with pytest.raises(dd.SchemaError, match="ALAND_SQMI"):
        dd.check_gazetteer(bad)


def test_boundaries_require_shapefile_fields(tmp_path):
    gdf = gpd.GeoDataFrame(
        {"GEOID": ["01001", "01003"], "STATEFP": ["01", "01"], "COUNTYFP": ["001", "003"], "NAME": ["A", "B"],
         "NAMELSAD": ["A County", "B County"], "STUSPS": ["AL", "AL"], "STATE_NAME": ["Alabama"] * 2, "ALAND": [1, 2]},
        geometry=[box(0, 0, 1, 1), box(1, 0, 2, 1)], crs=4269)
    shp_dir = tmp_path / "shp"
    shp_dir.mkdir()
    gdf.to_file(shp_dir / "cb_test.shp")
    zp = tmp_path / "cb_test.zip"
    with zipfile.ZipFile(zp, "w") as z:
        for f in shp_dir.iterdir():
            z.write(f, f.name)
    assert dd.check_boundaries(zp)["features"] == 2
    with zipfile.ZipFile(tmp_path / "nodbf.zip", "w") as z:
        z.write(shp_dir / "cb_test.shp", "cb_test.shp")
    with pytest.raises(dd.SchemaError, match=".shx"):
        dd.check_boundaries(tmp_path / "nodbf.zip")
