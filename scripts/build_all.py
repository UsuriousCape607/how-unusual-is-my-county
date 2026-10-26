"""Run the full data pipeline: download -> counties -> facilities -> peers -> web export -> validation."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

STEPS = ["download_data.py", "prepare_counties.py", "process_facilities.py", "calculate_peers.py",
         "export_web.py", "validate_data.py"]


def main() -> int:
    here = Path(__file__).resolve().parent
    extra = sys.argv[1:]  # e.g. --force is passed to download_data.py
    for step in STEPS:
        print(f"\n=== {step} ===", flush=True)
        args = [sys.executable, str(here / step)] + (extra if step == "download_data.py" else [])
        if subprocess.run(args, cwd=here.parent).returncode != 0:
            print(f"Pipeline stopped at {step}", file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
