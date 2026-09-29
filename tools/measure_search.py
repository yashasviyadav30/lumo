"""Measure real search speed (plan 3.7): 20 searches through the real service, twice (cold, then cached).

Uses about 20 search calls from the day's 100 and ~20 general units. Prints timings and hidden counts only;
no titles are printed. Results are cached in the database like normal searches (purged after 30 days).

Usage: uv run --project backend python tools/measure_search.py
"""

import statistics
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.config import get_settings  # noqa: E402
from app.db import session_factory  # noqa: E402
from app.fields import curated_channel_ids  # noqa: E402
from app.filters import UserRules  # noqa: E402
from app.search import run_search  # noqa: E402
from app.youtube import YouTubeClient  # noqa: E402

QUERIES = [
    ("cs executive company law lecture", "en"),
    ("cs professional esg principles and practice", "en"),
    ("cseet business communication", "en"),
    ("cs executive jigl hindi", "hi"),
    ("cma inter cost accounting", "en"),
    ("cma inter costing hindi lecture", "hi"),
    ("cma final strategic cost management", "en"),
    ("cma foundation business mathematics", "en"),
    ("neet physics laws of motion", "en"),
    ("neet chemistry chemical bonding one shot", "hi"),
    ("neet biology human physiology", "en"),
    ("neet botany plant kingdom hindi", "hi"),
    ("machine learning linear regression", "en"),
    ("neural networks from scratch", "en"),
    ("transformers attention explained", "en"),
    ("python for machine learning hindi", "hi"),
    ("probability for data science", "en"),
    ("gradient descent intuition", "en"),
    ("deep learning cnn lecture", "en"),
    ("large language models introduction", "en"),
]


def pct(values: list[int], p: float) -> int:
    values = sorted(values)
    k = max(0, min(len(values) - 1, round(p * (len(values) - 1))))
    return values[k]


def main() -> None:
    settings = get_settings()
    yt = YouTubeClient(settings.youtube_api_key)
    rules = UserRules(trusted_channels=set(curated_channel_ids()))
    factory = session_factory()
    for label in ("cold", "cached"):
        totals, searches, details, shown, hidden = [], [], [], [], []
        modes: dict[str, int] = {}
        with factory() as db:
            for q, lang in QUERIES:
                out = run_search(db, yt, q, lang, rules)
                totals.append(out.timings_ms["total"])
                searches.append(out.timings_ms["search"])
                details.append(out.timings_ms["details"])
                shown.append(len(out.results))
                hidden.append(len(out.hidden))
                modes[out.mode] = modes.get(out.mode, 0) + 1
            left = out.searches_left
        print(f"== {label}: {len(QUERIES)} searches, modes {modes}, searches left today {left}")
        print(f"   total ms   p50 {pct(totals, .5)}  p95 {pct(totals, .95)}  max {max(totals)}")
        print(f"   search ms  p50 {pct(searches, .5)}  p95 {pct(searches, .95)}")
        print(f"   details ms p50 {pct(details, .5)}  p95 {pct(details, .95)}")
        print(f"   shown per search: median {statistics.median(shown)}, hidden per search: median {statistics.median(hidden)}, max {max(hidden)}")


if __name__ == "__main__":
    main()
