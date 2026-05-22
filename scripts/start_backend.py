"""
scripts/start_backend.py
------------------------
Helper script used by Electron to spawn the Python backend.
Can also be run directly: python scripts/start_backend.py
"""

import os
import subprocess
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    python = sys.executable
    server_module = os.path.join(PROJECT_ROOT, "server", "main.py")

    print(f"Starting night-sky-intel backend on http://127.0.0.1:7842 ...")

    proc = subprocess.run(
        [python, server_module],
        cwd=PROJECT_ROOT,
    )
    sys.exit(proc.returncode)


if __name__ == "__main__":
    main()