"""Plan step 0.4: check that the YouTube Data API key works.

Makes one search.list call (uses 1 of the 100 daily search calls) and one
videos.list call (1 unit). Prints only status codes and counts, never titles,
and saves nothing, so no YouTube data is stored.

Run from the backend folder:
    uv run python ../tools/check_youtube_api.py
"""

import sys
from pathlib import Path

import httpx

ENV_FILE = Path(__file__).resolve().parent.parent / "backend" / ".env"
API = "https://www.googleapis.com/youtube/v3"


def read_key() -> str:
    if not ENV_FILE.exists():
        sys.exit(f"No {ENV_FILE}. Copy backend/.env.example to backend/.env and add the key.")
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        name, _, value = line.partition("=")
        if name.strip() == "YOUTUBE_API_KEY" and value.strip():
            return value.strip()
    sys.exit("YOUTUBE_API_KEY is empty in backend/.env.")


def main() -> None:
    key = read_key()
    with httpx.Client(timeout=15) as client:
        search = client.get(
            f"{API}/search",
            params={
                "part": "id",
                "q": "linear regression lecture",
                "type": "video",
                "safeSearch": "strict",
                "maxResults": 5,
                "key": key,
            },
        )
        print(f"search.list: HTTP {search.status_code}")
        if search.status_code != 200:
            sys.exit(f"Error: {search.json().get('error', {}).get('message', 'unknown')}")
        ids = [item["id"]["videoId"] for item in search.json().get("items", [])]
        print(f"search.list: {len(ids)} results")

        videos = client.get(
            f"{API}/videos",
            params={"part": "contentDetails,status", "id": ",".join(ids), "key": key},
        )
        print(f"videos.list: HTTP {videos.status_code}")
        if videos.status_code != 200:
            sys.exit(f"Error: {videos.json().get('error', {}).get('message', 'unknown')}")
        print(f"videos.list: {len(videos.json().get('items', []))} videos")
    print("OK: the key works for both calls.")


if __name__ == "__main__":
    main()
