"""Fetch details for a list of YouTube video IDs and write them to a CSV.

The CSV has an empty `label` column so you can hand-label each row
as `learning` or `entertainment` for the filter test set.

Usage:
    uv run fetch_videos.py data/video_ids.txt data/videos.csv
    uv run fetch_videos.py data/video_ids.txt data/videos.csv --check-shorts

Quota: videos.list costs 1 unit per call and takes up to 50 IDs,
so 1,000 videos cost about 20 units out of the default 10,000 a day.
"""

import argparse
import csv
import os
import re
import sys
from pathlib import Path

import httpx
from dotenv import load_dotenv

API_URL = "https://www.googleapis.com/youtube/v3/videos"
BATCH_SIZE = 50  # API maximum for videos.list

# Accepts a bare ID or a watch / youtu.be / shorts URL.
ID_PATTERN = re.compile(r"(?:v=|youtu\.be/|shorts/)?([A-Za-z0-9_-]{11})")

DURATION_PATTERN = re.compile(
    r"P(?:(?P<days>\d+)D)?(?:T(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?)?"
)

FIELDS = [
    "video_id",
    "title",
    "channel_title",
    "channel_id",
    "category_id",
    "tags",
    "duration_seconds",
    "has_captions",
    "live_broadcast",
    "default_language",
    "default_audio_language",
    "is_short",
    "description",
    "label",
]


def parse_duration(iso: str) -> int | None:
    """Turn an ISO 8601 duration like 'PT1H2M3S' into seconds."""
    match = DURATION_PATTERN.fullmatch(iso or "")
    if not match:
        return None
    parts = {k: int(v) for k, v in match.groupdict().items() if v}
    return (
        parts.get("days", 0) * 86400
        + parts.get("hours", 0) * 3600
        + parts.get("minutes", 0) * 60
        + parts.get("seconds", 0)
    )


def read_ids(path: Path) -> list[str]:
    """Read one ID or URL per line. Skips blanks, comments and duplicates."""
    ids: list[str] = []
    seen: set[str] = set()
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        match = ID_PATTERN.search(line)
        if not match:
            print(f"skipping, no video ID found: {line}", file=sys.stderr)
            continue
        video_id = match.group(1)
        if video_id not in seen:
            seen.add(video_id)
            ids.append(video_id)
    return ids


def fetch_details(client: httpx.Client, api_key: str, ids: list[str]) -> list[dict]:
    rows = []
    for start in range(0, len(ids), BATCH_SIZE):
        batch = ids[start : start + BATCH_SIZE]
        response = client.get(
            API_URL,
            params={
                "part": "snippet,contentDetails",
                "id": ",".join(batch),
                "key": api_key,
                "maxResults": BATCH_SIZE,
            },
        )
        response.raise_for_status()
        items = response.json().get("items", [])

        found = {item["id"] for item in items}
        for missing in set(batch) - found:
            print(f"not found (private or deleted?): {missing}", file=sys.stderr)

        for item in items:
            snippet = item["snippet"]
            details = item["contentDetails"]
            rows.append(
                {
                    "video_id": item["id"],
                    "title": snippet.get("title", ""),
                    "channel_title": snippet.get("channelTitle", ""),
                    "channel_id": snippet.get("channelId", ""),
                    "category_id": snippet.get("categoryId", ""),
                    "tags": "|".join(snippet.get("tags", [])),
                    "duration_seconds": parse_duration(details.get("duration", "")),
                    # The API returns the string "true" or "false" here.
                    "has_captions": details.get("caption") == "true",
                    "live_broadcast": snippet.get("liveBroadcastContent", ""),
                    "default_language": snippet.get("defaultLanguage", ""),
                    "default_audio_language": snippet.get("defaultAudioLanguage", ""),
                    "is_short": "",
                    "description": snippet.get("description", ""),
                    "label": "",
                }
            )
    return rows


def check_short(client: httpx.Client, video_id: str) -> bool | None:
    """Unofficial Shorts check: youtube.com/shorts/<id> answers 200 for a Short
    and redirects to /watch for a normal video. Not part of the API, so it can
    break without notice. Returns None when the answer is unclear."""
    try:
        response = client.head(
            f"https://www.youtube.com/shorts/{video_id}", follow_redirects=False
        )
    except httpx.HTTPError:
        return None
    if response.status_code == 200:
        return True
    if response.is_redirect:
        return False
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("ids_file", type=Path, help="text file, one video ID or URL per line")
    parser.add_argument("out_csv", type=Path, help="where to write the CSV")
    parser.add_argument(
        "--check-shorts",
        action="store_true",
        help="also run the unofficial /shorts/ URL check (one request per video)",
    )
    args = parser.parse_args()

    load_dotenv()
    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        sys.exit("YOUTUBE_API_KEY is not set. Copy .env.example to .env and add your key.")

    ids = read_ids(args.ids_file)
    if not ids:
        sys.exit(f"no video IDs found in {args.ids_file}")

    with httpx.Client(timeout=15) as client:
        rows = fetch_details(client, api_key, ids)
        if args.check_shorts:
            for row in rows:
                row["is_short"] = check_short(client, row["video_id"])

    args.out_csv.parent.mkdir(parents=True, exist_ok=True)
    # utf-8-sig so Excel shows Hindi titles correctly.
    with args.out_csv.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"wrote {len(rows)} videos to {args.out_csv}")


if __name__ == "__main__":
    main()
