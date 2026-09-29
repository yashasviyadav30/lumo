"""Compare goal parsers on the goal test set (plan 4.2-4.5).

Usage:
    uv run --project backend python tools/eval_goals.py rules
    uv run --project backend python tools/eval_goals.py rules llm hybrid
Sends only the test goals (our data) and our field catalogue to Groq. Prints scores and misses; no secrets.
"""

import json
import statistics
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))

from app.goals import parse_hybrid, parse_llm, parse_rules  # noqa: E402
from app.llm import groq_json  # noqa: E402
from tests.goal_scoring import check  # noqa: E402

TEST_SET = ROOT / "backend" / "tests" / "data" / "goal_test_set.json"


def run(name: str, parse) -> None:
    goals = json.loads(TEST_SET.read_text(encoding="utf-8"))["goals"]
    per_check: dict[str, list[bool]] = {}
    all_right, times, misses, llm_calls = 0, [], [], 0
    for exp in goals:
        t = time.perf_counter()
        try:
            goal = parse(exp["text"])
        except Exception as e:  # count a crash as a miss
            misses.append(f"  CRASH {exp['text']!r}: {e}")
            continue
        times.append((time.perf_counter() - t) * 1000)
        llm_calls += goal.method != "rules"
        res = check(goal, exp)
        for k, v in res.items():
            per_check.setdefault(k, []).append(v)
        if all(res.values()):
            all_right += 1
        else:
            wrong = [k for k, v in res.items() if not v]
            misses.append(f"  {exp['text']!r}: wrong {wrong} -> field={goal.field} level={goal.level} topic={goal.topic_ids} amb={goal.ambiguous} minor={goal.minor_signals}")
        if name != "rules":
            time.sleep(1.0)  # stay well inside Groq's free rate limit
    print(f"== {name}: fully right {all_right}/{len(goals)} ({100 * all_right // len(goals)}%), LLM calls {llm_calls}")
    for k, v in per_check.items():
        print(f"   {k:9s} {sum(v)}/{len(v)}")
    if times:
        print(f"   time ms: median {statistics.median(times):.0f}, max {max(times):.0f}")
    print("\n".join(misses))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parsers = {
        "rules": parse_rules,
        "llm": lambda text: parse_llm(text, groq_json),
        "hybrid": lambda text: parse_hybrid(text, groq_json),
    }
    for arg in sys.argv[1:] or ["rules"]:
        run(arg, parsers[arg])
