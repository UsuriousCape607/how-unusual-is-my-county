"""Find the newest Compute Atlas release; with --apply, move the pinned tag in common.py forward to it.

Usage: python scripts/check_compute_atlas_release.py [--apply]

Only well-formed version tags (vX.Y.Z) that are newer than the current pin are accepted, so the pin never moves
backwards. In GitHub Actions the result is written to $GITHUB_OUTPUT as changed / current_tag / latest_tag.
"""
from __future__ import annotations

import os
import re
import sys

import requests

from common import COMPUTE_ATLAS_TAG, ROOT

API = "https://api.github.com/repos/ek33450505/compute-atlas"
TAG_RE = re.compile(r"^v(\d+)\.(\d+)\.(\d+)$")
PIN_RE = re.compile(r'^COMPUTE_ATLAS_TAG = "v\d+\.\d+\.\d+"$', re.M)


def parse(tag: str) -> tuple[int, int, int] | None:
    m = TAG_RE.match(tag or "")
    return tuple(int(x) for x in m.groups()) if m else None  # type: ignore[return-value]


def bump_pin(text: str, new_tag: str) -> str:
    if not parse(new_tag):
        raise ValueError(f"not a version tag: {new_tag!r}")
    new, n = PIN_RE.subn(f'COMPUTE_ATLAS_TAG = "{new_tag}"', text)
    if n != 1:
        raise ValueError("expected exactly one COMPUTE_ATLAS_TAG assignment in common.py")
    return new


def latest_tag(session: requests.Session) -> str:
    r = session.get(f"{API}/releases/latest", timeout=30)
    if r.status_code == 200 and parse(r.json().get("tag_name", "")):
        return r.json()["tag_name"]
    r = session.get(f"{API}/tags", params={"per_page": 100}, timeout=30)
    r.raise_for_status()
    tags = [t["name"] for t in r.json() if parse(t.get("name", ""))]
    if not tags:
        raise RuntimeError("no version tags found")
    return max(tags, key=parse)


def main() -> int:
    session = requests.Session()
    session.headers["Accept"] = "application/vnd.github+json"
    if os.environ.get("GITHUB_TOKEN"):
        session.headers["Authorization"] = f"Bearer {os.environ['GITHUB_TOKEN']}"
    latest = latest_tag(session)
    changed = parse(latest) > parse(COMPUTE_ATLAS_TAG)
    if changed and "--apply" in sys.argv:
        path = ROOT / "scripts" / "common.py"
        path.write_text(bump_pin(path.read_text(encoding="utf-8"), latest), encoding="utf-8")
    print(f"pinned {COMPUTE_ATLAS_TAG}; latest release {latest}; {'newer release available' if changed else 'up to date'}")
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as f:
            f.write(f"changed={'true' if changed else 'false'}\ncurrent_tag={COMPUTE_ATLAS_TAG}\nlatest_tag={latest}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
