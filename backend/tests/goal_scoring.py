"""Scoring for the goal test set, shared by tests/test_goals.py and tools/eval_goals.py."""

from app.fields import load_fields


def check(goal, exp) -> dict[str, bool]:
    res: dict[str, bool] = {}
    if exp.get("ambiguous"):
        res["ambiguous"] = goal.ambiguous
        return res
    res["field"] = (not goal.ambiguous) and goal.field == exp.get("field")
    if "level" in exp:
        res["level"] = goal.level == exp["level"]
    if "topic" in exp:
        # A unit inside the expected paper counts as right.
        parents = {tp["id"]: tp.get("parent") for tp in load_fields().get(goal.field or "", {}).get("topics", [])}
        got = goal.topic_ids[0] if goal.topic_ids else None
        res["topic"] = got in exp["topic"] or parents.get(got) in exp["topic"]
    if "topic_contains" in exp:
        names = {t["id"]: t["name"] for t in load_fields().get(goal.field or "", {}).get("topics", [])}
        sub = exp["topic_contains"].casefold()
        res["topic"] = bool(goal.topic_ids) and (sub in goal.topic_ids[0] or sub in names.get(goal.topic_ids[0], "").casefold())
    res["minor"] = bool(goal.minor_signals) == bool(exp.get("minor"))
    res["lang"] = goal.language == exp.get("lang", goal.language)
    return res
