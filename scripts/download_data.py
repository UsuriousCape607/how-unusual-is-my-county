"""Download pinned source snapshots into data/raw/ and record provenance in data/raw/manifest.json.

Usage: python scripts/download_data.py [--force]

Existing files are kept (and re-hashed) unless --force is given. Any failed download stops the
pipeline: we never substitute another dataset silently.
"""
from __future__ import annotations

import argparse
import hashlib
import sys
from datetime import datetime, timezone

import requests

from common import RAW, SOURCES, read_json, write_json

MANIFEST = RAW / "manifest.json"


def sha256(path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-download files that already exist")
    args = ap.parse_args()

    RAW.mkdir(parents=True, exist_ok=True)
    manifest = read_json(MANIFEST) if MANIFEST.exists() else {}
    failures = []

    for key, src in SOURCES.items():
        dest = RAW / src["file"]
        entry = manifest.get(key, {})
        if dest.exists() and not args.force and entry.get("sha256"):
            if sha256(dest) != entry["sha256"]:
                failures.append(f"{key}: {dest.name} does not match the sha256 in manifest.json")
            else:
                print(f"[skip] {key}: {dest.name} present, checksum matches")
            continue
        if dest.exists() and not args.force:
            # Official file placed by hand (e.g. host blocked in a sandbox): register it, flagged as such.
            print(f"[reg ] {key}: registering locally supplied {dest.name}")
            manifest[key] = {
                "url": src["url"],
                "file": src["file"],
                "retrieved_at": None,
                "note": "file supplied locally, not downloaded by this script; obtained from the URL above",
                "bytes": dest.stat().st_size,
                "sha256": sha256(dest),
            }
            write_json(MANIFEST, manifest)
            continue
        print(f"[get ] {key}: {src['url']}")
        try:
            with requests.get(src["url"], stream=True, timeout=120) as r:
                r.raise_for_status()
                tmp = dest.with_suffix(dest.suffix + ".part")
                with open(tmp, "wb") as f:
                    for chunk in r.iter_content(1 << 20):
                        f.write(chunk)
                tmp.replace(dest)
                headers = {k: r.headers.get(k) for k in ("Last-Modified", "ETag", "Content-Type") if r.headers.get(k)}
        except requests.RequestException as exc:
            failures.append(f"{key}: {src['url']} -> {exc}")
            continue
        manifest[key] = {
            "url": src["url"],
            "file": src["file"],
            "retrieved_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "bytes": dest.stat().st_size,
            "sha256": sha256(dest),
            "response_headers": headers,
        }
        write_json(MANIFEST, manifest)

    if failures:
        print("\nDownload failures (no substitute data was used):", file=sys.stderr)
        for f in failures:
            print("  - " + f, file=sys.stderr)
        print(
            "\nIf a host is blocked by your network (e.g. www2.census.gov in a sandbox), allow it or place the\n"
            "official file under data/raw/ with the expected name and rerun.",
            file=sys.stderr,
        )
        return 1
    print(f"Manifest: {MANIFEST}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
