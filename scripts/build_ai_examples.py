"""Inputs, automated checks and packaging for the three pre-generated AI explanations.

  python scripts/build_ai_examples.py inputs 51107 48113 ...   # write ai/examples/<geoid>/input.json
  python scripts/build_ai_examples.py check                     # verify every output.md against its input.json
  python scripts/build_ai_examples.py assemble                  # write public/data/ai_examples.json (runs check)

The model output (`output.md`) and the human verification notes (`verification.md`) are written by hand
into each example folder; this script never calls a model.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from common import N_PEERS, PROCESSED, PUBLIC_DATA, ROOT, read_json, write_json

AI_DIR = ROOT / "ai" / "examples"
MODEL_LABEL = "Anthropic Claude (via Claude Code)"

BANNED = [
    r"\bharm", r"\bpollut", r"\bwater\b", r"electric", r"\bprices?\b", r"\bjobs?\b", r"\btax", r"\bracial",
    r"\bdiscriminat", r"\boppos", r"\bsupport(s|ed|ing)?\b", r"\bbecause\b", r"\bcaus(e|ed|es|ing)\b",
    r"\bdue to\b", r"\bdriv(en|es|ing) by\b", r"statistically significant", r"has no (proposed )?data cent",
]


def build_input(geoid: str) -> dict:
    metrics = {m["geoid"]: m for m in read_json(PUBLIC_DATA / "county_metrics.json")}
    peers = read_json(PUBLIC_DATA / "county_peers.json")["peers"]
    meta = read_json(PUBLIC_DATA / "metadata.json")
    c, p = metrics[geoid], peers[geoid]
    qc = meta["facility_qc"]
    return {
        "county": {"name": c["county_name"], "state": c["state_name"], "geoid": geoid,
                   "population_2025": c["population_2025"], "density_per_sqmi": c["density_per_sqmi"]},
        "metric": "qualifying documented data-center pipeline site records (proposed, permitted or under construction; "
                  "confirmed or reported confidence)",
        "pipeline_count": c["pipeline_count"],
        "peer_method": "40 counties nearest in standardized log population and log population density; "
                       "data-center counts are not used to choose peers",
        "n_peers": N_PEERS,
        "peer_population_range": [p["peer_population_min"], p["peer_population_max"]],
        "peer_density_range_per_sqmi": [p["peer_density_min"], p["peer_density_max"]],
        "peer_median": p["peer_median"],
        "peer_mean": p["peer_mean"],
        "n_peers_fewer": p["n_fewer"],
        "n_peers_equal": p["n_equal"],
        "n_peers_greater": p["n_greater"],
        "n_peers_with_at_least_one_record": p["n_peers_with_pipeline"],
        "snapshot_date": meta["snapshot_date"],
        "data_version": meta["data_version"],
        "limitations": meta["caveats"],
        "quality_indicators": {
            "records_in_snapshot": qc["total_records"],
            "pipeline_records_counted_nationally": qc["headline_included"],
            "pipeline_candidates_not_assignable_to_one_county": qc["pipeline_candidates_before_assignment"] - qc["headline_included"],
        },
    }


def numbers_in(obj) -> set[str]:
    found: set[str] = set()
    if isinstance(obj, dict):
        for v in obj.values():
            found |= numbers_in(v)
    elif isinstance(obj, list):
        for v in obj:
            found |= numbers_in(v)
    elif isinstance(obj, bool):
        pass
    elif isinstance(obj, (int, float)):
        found.add(canon(str(obj)))
    elif isinstance(obj, str):
        found |= {canon(n) for n in re.findall(r"\d[\d,]*(?:\.\d+)?", obj)}
    return found


def canon(n: str) -> str:
    n = n.replace(",", "")
    return str(float(n)).rstrip("0").rstrip(".") if "." in n else str(int(n))


def check_example(folder: Path) -> list[str]:
    """Automated checks: digits must appear in the input; length; banned topics; required caveats.
    Spelled-out numbers and meaning are checked by hand (verification.md)."""
    inp = read_json(folder / "input.json")
    out = (folder / "output.md").read_text(encoding="utf-8").strip()
    problems = []
    allowed = numbers_in(inp) | {"40"}
    stated = {canon(n) for n in re.findall(r"\d[\d,]*(?:\.\d+)?", out)}
    for n in sorted(stated - allowed):
        problems.append(f"number {n} does not appear in the input JSON")
    words = len(out.split())
    if not 90 <= words <= 165:
        problems.append(f"length {words} words (target 100-150)")
    for pat in BANNED:
        if re.search(pat, out, re.I):
            problems.append(f"contains disallowed wording /{pat}/")
    if inp["pipeline_count"] == 0 and "No qualifying pipeline records were found" not in out:
        problems.append("zero-count county without the required wording")
    for need in (r"descriptive|not.*caus", r"snapshot|incomplete"):
        if not re.search(need, out, re.I):
            problems.append(f"missing limitation language /{need}/")
    return problems


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    cmd = sys.argv[1]
    if cmd == "inputs":
        for g in sys.argv[2:]:
            write_json(AI_DIR / g / "input.json", build_input(g))
            print(f"wrote {AI_DIR / g / 'input.json'}")
        return 0
    folders = sorted(p for p in AI_DIR.iterdir() if (p / "input.json").exists())
    report, ok = {}, True
    for f in folders:
        if not (f / "output.md").exists():
            report[f.name] = ["output.md missing"]
            ok = False
            continue
        if build_input(f.name) != read_json(f / "input.json"):
            report[f.name] = ["input.json is stale: it no longer matches the exported data"]
            ok = False
            continue
        report[f.name] = check_example(f)
        ok &= not report[f.name]
    for g, probs in report.items():
        print(f"[{'PASS' if not probs else 'FAIL'}] {g}" + "".join(f"\n    - {p}" for p in probs))
    write_json(PROCESSED / "ai_check_report.json", report)
    if cmd == "check":
        return 0 if ok else 1
    if cmd == "assemble":
        if not ok or len(folders) != 3:
            print("Not assembling: need exactly 3 examples that pass all checks.", file=sys.stderr)
            return 1
        examples = []
        for f in folders:
            inp = read_json(f / "input.json")
            meta = json.loads((f / "meta.json").read_text()) if (f / "meta.json").exists() else {}
            examples.append({
                "geoid": f.name,
                "label": f"{inp['county']['name']}, {inp['county']['state']}",
                "model": meta.get("model", MODEL_LABEL),
                "generated_at": meta.get("generated_at", ""),
                "output": (f / "output.md").read_text(encoding="utf-8").strip(),
                "verification_status": "automated checks passed; manually reviewed",
                "verification_summary": meta.get("verification_summary", ""),
            })
        write_json(PUBLIC_DATA / "ai_examples.json", {"prompt_version": 1, "examples": examples})
        print(f"wrote {PUBLIC_DATA / 'ai_examples.json'}")
        return 0
    print(f"unknown command {cmd}", file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
