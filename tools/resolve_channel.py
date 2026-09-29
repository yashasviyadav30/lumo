"""Look up YouTube channel IDs from handles or channel URLs.

Used to fill the curator sheet (plan step 5.1). It only turns a handle into
an ID: it doesn't read or score anything about the channel (rule R3).
Costs 1 quota unit per handle. Prints only what you ask for; never the key.

Usage:
    uv run --project backend python tools/resolve_channel.py @handle1 https://www.youtube.com/@handle2 ...
"""

import re
import sys
from pathlib import Path

import httpx

ENV_FILE = Path(__file__).resolve().parent.parent / "backend" / ".env"
API = "https://www.googleapis.com/youtube/v3/channels"
CHANNEL_ID = re.compile(r"(UC[0-9A-Za-z_-]{22})")
HANDLE = re.compile(r"@([0-9A-Za-z._-]{3,30})")


def read_key() -> str:
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        if line.startswith("YOUTUBE_API_KEY="):
            key = line.split("=", 1)[1].strip()
            if key:
                return key
    sys.exit("YOUTUBE_API_KEY is missing from backend/.env")


def main(args: list[str]) -> None:
    if not args:
        sys.exit(__doc__)
    key = read_key()
    with httpx.Client(timeout=15) as client:
        for arg in args:
            direct = CHANNEL_ID.search(arg)
            if direct:
                print(f"{arg}\t{direct.group(1)}\t(ID already in the URL)")
                continue
            handle = HANDLE.search(arg)
            if not handle:
                print(f"{arg}\tNOT FOUND\t(no @handle or channel ID in it)")
                continue
            r = client.get(API, params={"part": "id", "forHandle": "@" + handle.group(1), "key": key})
            items = r.json().get("items", []) if r.status_code == 200 else []
            if items:
                print(f"@{handle.group(1)}\t{items[0]['id']}")
            else:
                print(f"@{handle.group(1)}\tNOT FOUND\t(HTTP {r.status_code})")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main(sys.argv[1:])
