"""Acquire and verify the pinned source files in data/raw/, recording provenance in data/raw/manifest.json.

Usage:
  python scripts/download_data.py            # use files already in data/raw/, download only missing ones
  python scripts/download_data.py --offline  # never touch the network; fail if a file is missing
  python scripts/download_data.py --force    # re-download everything

Every file, whether downloaded or supplied by hand, must pass a schema check before it is accepted.
The manifest records each file's official URL, SHA-256, size, how it was acquired and the check result.
A failed download stops the pipeline: no other dataset is substituted.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import sys
import zipfile
from datetime import datetime, timezone

from common import POP_COLUMN, RAW, SOURCES, gazetteer_delimiter, read_json, write_json

MANIFEST = RAW / "manifest.json"
MIN_COUNTY_ROWS = 3000  # 3,144 counties in the 50 states + DC; guards against truncated files


class SchemaError(Exception):
    pass


def sha256(path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _require(cols, required, label):
    missing = sorted(set(required) - set(cols))
    if missing:
        raise SchemaError(f"{label}: missing columns {missing}; found {list(cols)[:15]}")


def check_compute_atlas_facilities(path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list) or not data:
        raise SchemaError("facilities.json is not a non-empty JSON array")
    for i, r in enumerate(data):
        _require(r.keys(), ["id", "facilityType", "status", "confidence", "location", "sources"], f"record {i}")
        _require(r["location"].keys(), ["lat", "lon", "state"], f"record {i} location")
    return {"records": len(data)}


def check_compute_atlas_meta(path) -> dict:
    meta = json.loads(path.read_text(encoding="utf-8"))
    _require(meta.keys(), ["asOf", "recordCount"], "facilities.meta.json")
    return {"asOf": meta["asOf"], "recordCount": meta["recordCount"]}


def check_license(path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    if "CC BY 4.0" not in text and "Creative Commons Attribution 4.0" not in text:
        raise SchemaError("data license file does not state CC BY 4.0")
    return {"license": "CC BY 4.0"}


def check_popest(path) -> dict:
    raw = path.read_bytes()
    for enc in ("utf-8", "latin-1"):
        try:
            text = raw.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    reader = csv.DictReader(io.StringIO(text))
    _require(reader.fieldnames or [], ["SUMLEV", "STATE", "COUNTY", "STNAME", "CTYNAME", POP_COLUMN], path.name)
    rows = [r for r in reader if r["SUMLEV"] == "050"]
    if len(rows) < MIN_COUNTY_ROWS:
        raise SchemaError(f"{path.name}: only {len(rows)} county (SUMLEV 050) rows")
    if any(not r[POP_COLUMN].strip().isdigit() for r in rows):
        raise SchemaError(f"{path.name}: non-integer {POP_COLUMN} values")
    return {"encoding": enc, "county_rows": len(rows), "columns": len(reader.fieldnames)}


def check_gazetteer(path) -> dict:
    with zipfile.ZipFile(path) as z:
        members = [n for n in z.namelist() if n.lower().endswith(".txt")]
        if len(members) != 1:
            raise SchemaError(f"{path.name}: expected one .txt member, found {z.namelist()}")
        text = z.read(members[0]).decode("utf-8", errors="replace")
    lines = text.splitlines()
    sep = gazetteer_delimiter(lines[0])
    cols = [c.strip() for c in lines[0].split(sep)]
    _require(cols, ["USPS", "GEOID", "NAME", "ALAND", "AWATER", "ALAND_SQMI"], members[0])
    if len(lines) - 1 < MIN_COUNTY_ROWS:
        raise SchemaError(f"{members[0]}: only {len(lines) - 1} rows")
    return {"member": members[0], "rows": len(lines) - 1, "delimiter": "pipe" if sep == "|" else "tab"}


def check_boundaries(path) -> dict:
    import pyogrio

    with zipfile.ZipFile(path) as z:
        names = z.namelist()
    for ext in (".shp", ".shx", ".dbf", ".prj"):
        if not any(n.lower().endswith(ext) for n in names):
            raise SchemaError(f"{path.name}: missing {ext} component")
    info = pyogrio.read_info(path)
    _require(info["fields"], ["GEOID", "STATEFP", "COUNTYFP", "NAME", "NAMELSAD", "STUSPS", "STATE_NAME", "ALAND"], path.name)
    if info["features"] < MIN_COUNTY_ROWS:
        raise SchemaError(f"{path.name}: only {info['features']} features")
    return {"features": int(info["features"]), "crs": info["crs"], "geometry_type": info["geometry_type"]}


CHECKS = {
    "compute_atlas_facilities": check_compute_atlas_facilities,
    "compute_atlas_meta": check_compute_atlas_meta,
    "compute_atlas_data_license": check_license,
    "census_popest_2025": check_popest,
    "census_gazetteer_2025": check_gazetteer,
    "census_cb_counties_2025": check_boundaries,
}


def download(url, dest) -> dict:
    import requests

    headers = {"User-Agent": "how-unusual-is-my-county data pipeline (+https://github.com/UsuriousCape607/how-unusual-is-my-county)"}
    with requests.get(url, stream=True, timeout=120, headers=headers) as r:
        r.raise_for_status()
        tmp = dest.with_suffix(dest.suffix + ".part")
        with open(tmp, "wb") as f:
            for chunk in r.iter_content(1 << 20):
                f.write(chunk)
        tmp.replace(dest)
        return {k: r.headers.get(k) for k in ("Last-Modified", "ETag", "Content-Type") if r.headers.get(k)}


def main() -> int:
    ap = argparse.ArgumentParser()
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--force", action="store_true", help="re-download files that already exist")
    mode.add_argument("--offline", action="store_true", help="never use the network; only verify local files")
    args = ap.parse_args()

    RAW.mkdir(parents=True, exist_ok=True)
    manifest = read_json(MANIFEST) if MANIFEST.exists() else {}
    failures, missing = [], []

    for key, src in SOURCES.items():
        dest = RAW / src["file"]
        old = manifest.get(key, {})
        entry = {"url": src["url"], "file": src["file"]}

        if dest.exists() and not args.force:
            was_downloaded = old.get("acquired", "downloaded" if old.get("retrieved_at") else None) == "downloaded"
            if old.get("sha256") and was_downloaded and sha256(dest) == old["sha256"]:
                entry.update(acquired="downloaded", retrieved_at=old.get("retrieved_at"),
                             response_headers=old.get("response_headers"))
            else:
                entry.update(acquired="supplied_locally", retrieved_at=None,
                             registered_at=old.get("registered_at") if old.get("sha256") == sha256(dest)
                             else datetime.now(timezone.utc).isoformat(timespec="seconds"),
                             note="Official file placed in data/raw/ by hand; obtained from the URL above.")
            action = "local"
        elif args.offline:
            missing.append((key, src))
            continue
        else:
            try:
                headers = download(src["url"], dest)
            except Exception as exc:  # network or HTTP failure
                failures.append(f"{key}: download failed ({exc.__class__.__name__}: {str(exc)[:160]})")
                missing.append((key, src))
                continue
            entry.update(acquired="downloaded", retrieved_at=datetime.now(timezone.utc).isoformat(timespec="seconds"),
                         response_headers=headers)
            action = "download"

        try:
            details = CHECKS[key](dest)
        except (SchemaError, zipfile.BadZipFile, json.JSONDecodeError, UnicodeDecodeError, OSError) as exc:
            failures.append(f"{key}: {dest.name} failed schema check: {exc}")
            continue
        entry.update(bytes=dest.stat().st_size, sha256=sha256(dest), schema_check="passed", schema_details=details)
        if old.get("sha256") and old["sha256"] != entry["sha256"]:
            entry["previous_sha256"] = old["sha256"]
            print(f"[warn] {key}: file differs from the previously recorded version", file=sys.stderr)
        manifest[key] = {k: v for k, v in entry.items() if v is not None or k == "retrieved_at"}
        write_json(MANIFEST, manifest)
        print(f"[ok  ] {key}: {dest.name} ({action}; sha256 {entry['sha256'][:12]}…; {details})")

    if failures or missing:
        print("\nSource files are not ready. No substitute data was used.", file=sys.stderr)
        for f in failures:
            print("  - " + f, file=sys.stderr)
        if missing:
            print(f"\nDownload these official files and save them in {RAW} with exactly these names:", file=sys.stderr)
            for key, src in missing:
                print(f"  {src['file']}\n      from {src['url']}", file=sys.stderr)
            print("Then rerun: python scripts/build_all.py --offline", file=sys.stderr)
        return 1
    print(f"All {len(SOURCES)} source files verified. Manifest: {MANIFEST}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
