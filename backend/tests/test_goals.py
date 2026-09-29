import json
from datetime import date
from pathlib import Path

import pytest

from app.goals import detect_language, minor_signals, parse_hybrid, parse_llm, parse_rules
from app.query_builder import build_query
from app.routers import goals as goals_router
from tests.goal_scoring import check

TEST_SET = json.loads((Path(__file__).parent / "data" / "goal_test_set.json").read_text(encoding="utf-8"))["goals"]


@pytest.fixture(autouse=True)
def rules_only(monkeypatch):
    # Tests never call the real LLM.
    monkeypatch.setattr(goals_router, "parser", lambda: parse_rules)


# ---------- parser ----------


def test_cs_alone_asks_did_you_mean_but_cs_esg_does_not():
    cs = parse_rules("CS")
    assert cs.ambiguous and [c.label for c in cs.candidates] == ["Company Secretary (ICSI)", "Computer Science"]
    esg = parse_rules("CS ESG paper")
    assert not esg.ambiguous and esg.field == "cs-company-secretary" and esg.topic_ids == ["cs-prof-esg"]


def test_ca_is_not_cma_and_computer_science_is_not_company_secretary():
    assert parse_rules("CA inter costing").field is None
    assert parse_rules("cs computer science").field is None
    assert parse_rules("CMA Inter costing").topic_ids == ["cma-int-p8-cost-accounting"]


def test_hindi_and_hinglish():
    assert detect_language("सीएमए इंटर कॉस्टिंग") == "hi"
    assert detect_language("neet ki taiyari physics") == "mixed"
    assert detect_language("neet physics") == "en"
    assert parse_rules("सीएमए इंटर कॉस्टिंग").topic_ids == ["cma-int-p8-cost-accounting"]


def test_minor_signals():
    today = date(2026, 9, 29)
    assert minor_signals("class 11 physics", today)
    assert minor_signals("NEET 2029 physics", today)
    assert not minor_signals("NEET 2027 botany", today)  # next year's exam: repeaters too
    assert not minor_signals("CMA Inter costing", today)


def test_rules_parser_stays_accurate_on_the_test_set():
    right = sum(all(check(parse_rules(g["text"]), g).values()) for g in TEST_SET)
    assert right / len(TEST_SET) >= 0.9, f"only {right}/{len(TEST_SET)}"


def test_llm_sees_only_the_users_text_and_our_catalogue():
    seen = {}

    def fake_llm(system, user):
        seen["system"], seen["user"] = system, user
        return json.dumps({"field": "ai", "level": "ai-ml", "topic_ids": ["ai-ml-ensembles", "not-a-real-id"], "ambiguous": False, "candidates": []})

    goal = parse_llm("random forest and xgboost", fake_llm)
    assert seen["user"] == "random forest and xgboost"
    assert "CATALOGUE" in seen["system"] and "youtube" not in seen["system"].casefold()
    assert goal.field == "ai" and goal.topic_ids == ["ai-ml-ensembles"]  # unknown IDs are dropped


def test_hybrid_uses_the_llm_only_when_rules_are_unsure_and_survives_llm_failure():
    calls = []

    def failing_llm(system, user):
        calls.append(user)
        raise RuntimeError("rate limited")

    assert parse_hybrid("CMA Inter costing", failing_llm).method == "rules"
    assert calls == []
    g = parse_hybrid("random forest and xgboost", failing_llm)
    assert calls == ["random forest and xgboost"] and g.method == "rules"  # fell back, didn't fail


# ---------- query builder ----------


@pytest.mark.parametrize(
    ("text", "query"),
    [
        ("CMA Inter costing", "CMA Inter Cost Accounting"),
        ("cma inter ka costing chapter samjhna hai", "CMA Inter Cost Accounting hindi"),
        ("cs executive capital market hindi me", "CS Executive Capital Market and Securities Laws hindi"),
        ("neet electrostatics one shot", "electrostatics neet one shot"),
        ("UPSC polity laxmikanth", "upsc polity laxmikanth"),
        ("spoken english sikhna hai", "spoken english in hindi"),
    ],
)
def test_query_builder(text, query):
    assert build_query(parse_rules(text)) == query


# ---------- API ----------


def test_set_goal_returns_topics_with_ready_queries(signed_in):
    r = signed_in.post("/api/goals", json={"text": "CMA Inter costing"})
    assert r.status_code == 201
    g = r.json()
    assert g["field"] == "cma" and g["level_label"] and g["query"] == "CMA Inter Cost Accounting"
    assert g["topics"][0]["id"] == "cma-int-p8-cost-accounting" and all(t["query"] for t in g["topics"])
    assert signed_in.get("/api/goals/active").json()["id"] == g["id"]


def test_did_you_mean_one_tap(signed_in):
    g = signed_in.post("/api/goals", json={"text": "CS"}).json()
    assert [c["label"] for c in g["did_you_mean"]] == ["Company Secretary (ICSI)", "Computer Science"]
    assert g["query"] is None and g["topics"] == []
    cs = signed_in.post(f"/api/goals/{g['id']}/choose", json={"index": 0}).json()
    assert cs["field"] == "cs-company-secretary" and cs["did_you_mean"] == [] and cs["topics"]
    g2 = signed_in.post("/api/goals", json={"text": "CS"}).json()
    comp = signed_in.post(f"/api/goals/{g2['id']}/choose", json={"index": 1}).json()
    assert comp["field"] is None and comp["query"] == "computer science"


def test_any_goal_is_accepted(signed_in):
    g = signed_in.post("/api/goals", json={"text": "guitar chords for beginners"}).json()
    assert g["field"] is None and g["query"] == "guitar chords for beginners" and g["topics"] == []


def test_goal_text_never_reaches_the_log(signed_in, db):
    from sqlalchemy import select

    from app.models import AppLog

    signed_in.post("/api/goals", json={"text": "CMA Inter costing"})
    for row in db.scalars(select(AppLog)):
        assert "costing" not in f"{row.route} {row.action}".casefold()
