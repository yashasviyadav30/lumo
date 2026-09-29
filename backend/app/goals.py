"""Goal understanding (plan 4.1, 4.4, 4.5). Works only on the user's own text and our field data (R4).

ParsedGoal is the goal schema. Three parsers, compared in tools/eval_goals.py:
- parse_rules: aliases, level words and topic matching on our own topic names and search terms. Free, instant.
- parse_llm: the LLM with our field catalogue (Groq, zero retention).
- parse_hybrid: rules first; the LLM only when the rules aren't confident.
"""

import json
import math
import re
from dataclasses import asdict, dataclass, field
from datetime import date

from app.fields import load_fields

# ---------- schema ----------


@dataclass
class Candidate:
    field: str | None
    label: str


@dataclass
class ParsedGoal:
    text: str
    field: str | None  # one of our field IDs, or None for any other goal (still allowed)
    field_label: str
    level: str | None
    topic_ids: list[str]
    language: str  # "en" | "hi" | "mixed"
    minor_signals: list[str]
    ambiguous: bool = False
    candidates: list[Candidate] = field(default_factory=list)
    confidence: float = 0.0
    method: str = "rules"

    def to_dict(self) -> dict:
        return asdict(self)


# ---------- text helpers ----------

# A few Devanagari words mapped to the Latin forms our aliases use. A transliterator (IndicXlit) is the
# fuller fix later (step 6.2); this covers the common exam words.
DEVANAGARI = {
    "सीएमए": "cma",
    "सीएस": "cs",
    "इंटर": "inter",
    "कॉस्टिंग": "costing",
    "नीट": "neet",
    "जीव विज्ञान": "biology",
    "भौतिकी": "physics",
    "रसायन": "chemistry",
    "मशीन लर्निंग": "machine learning",
    "यूपीएससी": "upsc",
    "इतिहास": "history",
    "कक्षा": "class",
}
HINGLISH_MARKERS = {"ki", "ka", "ke", "hai", "kaise", "kare", "karna", "seekhna", "sikhna", "samjhna", "padhai", "taiyari", "tayari", "hindi", "me", "mein", "wala", "chahiye"}
STOP = {"and", "the", "for", "of", "in", "to", "a", "an", "paper", "papers", "exam", "course", "lecture", "lectures", "learn",
        "preparation", "prep", "one", "shot", "chapter", "full", "complete", "from", "scratch", "with", "basics", "part",
        "practice", "principles", "hindi", "english"} | HINGLISH_MARKERS
OTHER_EXAMS = {"ca", "upsc", "ssc", "jee", "gate", "ibps", "cat", "clat", "cbse", "acca", "cfa", "cgl", "bank"}
COMPUTER_SCIENCE = {"computer", "harvard", "cs50", "50", "programming", "coding", "dsa", "algorithms", "algorithm", "btech"}

LEVEL_WORDS: dict[str, dict[str, list[str]]] = {
    "cs-company-secretary": {"cseet": ["cseet", "entrance test"], "exec": ["executive", "exe", "exec"], "prof": ["professional", "prof"]},
    "cma": {"cma-foundation": ["foundation"], "cma-intermediate": ["inter", "intermediate"], "cma-final": ["final"]},
    "neet": {"phy": ["physics", "phy"], "chem": ["chemistry", "chem", "organic", "inorganic"], "bio": ["biology", "bio", "botany", "zoology", "physiology"]},
    "ai": {
        "ai-llm": ["llm", "llms", "transformer", "transformers", "generative", "gen ai", "genai", "gpt", "prompt engineering"],
        "ai-dl": ["deep learning", "neural", "neural networks", "cnn", "rnn", "lstm"],
        "ai-ml": ["machine learning", "ml", "regression", "classification", "random forest", "xgboost", "clustering"],
        "ai-fnd": ["python", "probability", "statistics", "linear algebra", "calculus", "numpy", "pandas"],
    },
}


def normalise(text: str) -> str:
    t = text.casefold()
    for dev, latin in DEVANAGARI.items():
        t = t.replace(dev, f" {latin} ")
    t = re.sub(r"[^\w\s]", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def tokens(text: str) -> list[str]:
    return normalise(text).split()


def has_phrase(norm_text: str, phrase: str) -> bool:
    p = normalise(phrase)
    return bool(p) and re.search(rf"(?<!\w){re.escape(p)}(?!\w)", norm_text) is not None


def detect_language(text: str) -> str:
    if re.search(r"[ऀ-ॿ]", text):
        return "hi"
    return "mixed" if HINGLISH_MARKERS & set(tokens(text)) else "en"


def minor_signals(text: str, today: date | None = None) -> list[str]:
    year = (today or date.today()).year
    norm = normalise(text)
    found = []
    for m in re.finditer(r"\bclass (6|7|8|9|10|11|12)\b|\b(9|10|11|12)th\b|\bboards?\b|\bcbse\b|\bicse\b", norm):
        found.append(m.group(0))
    for m in re.finditer(r"\b(neet|jee)(?: ug| main| mains| advanced)? (20\d\d)\b", norm):
        if int(m.group(2)) >= year + 2:  # an exam 2+ years away is usually taken by a school student
            found.append(m.group(0))
    return found


def _stem(w: str) -> str:
    return w[:-1] if len(w) > 3 and w.endswith("s") and not w.endswith("ss") else w


def _similar(a: str, b: str) -> bool:
    a, b = _stem(a), _stem(b)
    if a == b:
        return True
    return len(a) >= 4 and len(b) >= 4 and (a.startswith(b) or b.startswith(a))


# ---------- rules parser ----------


def _field_scores(norm: str, toks: set[str]) -> dict[str, float]:
    scores: dict[str, float] = {}
    for fid, f in load_fields().items():
        best = 0.0
        for alias in f.get("aliases", []):
            a = normalise(alias)
            if a and has_phrase(norm, a):
                best = max(best, 1.0 + 0.1 * len(a))
        if best:
            scores[fid] = best
    # Generic words like "costing" also fit other exams: drop them if another exam is named.
    if toks & OTHER_EXAMS and "cma" not in toks and "cma" in scores:
        del scores["cma"]
    return scores


def _level(fid: str, norm: str) -> str | None:
    for level, words in LEVEL_WORDS.get(fid, {}).items():
        if any(has_phrase(norm, w) for w in words):
            return level
    return None


# Phrases that name the field itself; removed before topic matching so their words don't count as topic words.
IDENTITY_PHRASES = ["company secretaryship", "company secretary", "cost and management accountant", "cost management accounting",
                    "medical entrance", "mbbs entrance", "artificial intelligence", "machine learning", "deep learning",
                    "data science"]
IDENTITY_TOKENS = {"cs", "cma", "icsi", "icmai", "icwa", "icwai", "neet", "ug", "nta", "ai", "ml", "dl", "dropper", "repeater", "mbbs", "india"}
# CS and CMA levels are exam stages (pure level words). NEET and AI "levels" are subjects whose words are also topic words.
STAGE_FIELDS = {"cs-company-secretary", "cma"}


def _topic_words(topic: dict) -> tuple[set[str], set[str]]:
    """(words in the topic's name and id, words in its search terms)."""
    name = {t for t in tokens(topic["name"] + " " + topic["id"].replace("-", " ")) if t not in STOP and len(t) > 1}
    terms = set()
    for ts in topic.get("search_terms", {}).values():
        terms |= {t for t in tokens(" ".join(ts)) if t not in STOP and len(t) > 1}
    return name, terms


def _query_words(fid: str, norm: str) -> list[str]:
    for phrase in IDENTITY_PHRASES:
        norm = re.sub(rf"(?<!\w){re.escape(phrase)}(?!\w)", " ", norm)
    if fid in STAGE_FIELDS:
        for words in LEVEL_WORDS[fid].values():
            for w in words:
                norm = re.sub(rf"(?<!\w){re.escape(normalise(w))}(?!\w)", " ", norm)
    return [t for t in norm.split() if t not in STOP and t not in IDENTITY_TOKENS and not t.isdigit() and len(t) > 1]


def _topics(fid: str, level: str | None, norm: str) -> list[str]:
    f = load_fields()[fid]
    candidates = [t for t in f["topics"] if not level or t["level"] == level]
    words = {t["id"]: _topic_words(t) for t in candidates}
    # Rarer words say more: weight each query word by how few topics contain it (IDF).
    n = max(1, len(candidates))
    query = _query_words(fid, norm)
    digits = set(re.findall(r"\b\d{1,2}[a-c]?\b", norm))
    best: tuple[float, int, str] | None = None
    for topic in candidates:
        name, terms = words[topic["id"]]
        score = 0.0
        for q in query:
            df = sum(1 for nm, tm in words.values() if any(_similar(q, w) for w in nm | tm)) or 1
            idf = math.log(1 + n / df)
            if any(_similar(q, w) for w in name):
                score += 2 * idf
            elif any(_similar(q, w) for w in terms):
                score += idf
        score += sum(3.0 for d in digits if re.search(rf"\bpaper {d}\b", topic["name"].casefold()))
        if score <= 0:
            continue
        depth = 1 if topic.get("parent") else 0
        key = (round(score, 6), -depth, topic["id"])  # on a tie, prefer the broader topic
        if best is None or key[:2] > best[:2]:
            best = key
    if best:
        return [best[2]]
    # No topic words: for fields with one top topic per level (NEET subjects, AI levels), use that.
    if level:
        tops = [t["id"] for t in f["topics"] if t["level"] == level and not t.get("parent")]
        if len(tops) == 1:
            return tops
    return []


def parse_rules(text: str) -> ParsedGoal:
    norm = normalise(text)
    toks = tokens(text)
    tokset = set(toks)
    lang = detect_language(text)
    minors = minor_signals(text)
    fields = load_fields()
    scores = _field_scores(norm, tokset)

    # "CS" is Company Secretary or Computer Science.
    cs_only_short = "cs-company-secretary" in scores and not any(
        has_phrase(norm, a) for a in fields["cs-company-secretary"]["aliases"] if normalise(a) != "cs"
    )
    if cs_only_short and tokset & COMPUTER_SCIENCE:
        del scores["cs-company-secretary"]
        cs_only_short = False

    if not scores:
        other = bool(tokset & OTHER_EXAMS) or bool(tokset & COMPUTER_SCIENCE)
        return ParsedGoal(text, None, text.strip(), None, [], lang, minors, confidence=0.8 if other else 0.5)

    fid = max(scores, key=scores.get)
    topic_level = {t["id"]: t["level"] for t in fields[fid]["topics"]}
    if fid in STAGE_FIELDS:
        level = _level(fid, norm)  # exam stage first (Executive, Inter…), then the paper inside it
        topic_ids = _topics(fid, level, norm)
    else:
        topic_ids = _topics(fid, None, norm)  # subject topics first; their level follows
        level = topic_level[topic_ids[0]] if topic_ids else _level(fid, norm)
        if topic_ids and not topic_ids[0].startswith(fid.split("-")[0]):
            pass
        if not topic_ids and level:
            topic_ids = _topics(fid, level, norm)
    if not level and topic_ids:
        level = topic_level[topic_ids[0]]

    if fid == "cs-company-secretary" and cs_only_short and not level and not topic_ids:
        return ParsedGoal(
            text, None, text.strip(), None, [], lang, minors, ambiguous=True,
            candidates=[Candidate("cs-company-secretary", "Company Secretary (ICSI)"), Candidate(None, "Computer Science")],
            confidence=0.5,
        )

    confidence = 0.6 + (0.2 if level else 0) + (0.2 if topic_ids else 0)
    return ParsedGoal(text, fid, fields[fid]["display_name"], level, topic_ids, lang, minors, confidence=confidence)


# ---------- LLM parser ----------


def catalogue() -> str:
    """Our field data in a compact form for the LLM prompt (our data, not YouTube's)."""
    lines = []
    for fid, f in load_fields().items():
        lines.append(f"FIELD {fid}: {f['display_name']} | aliases: {', '.join(f['aliases'][:12])}")
        lines.append("  levels: " + "; ".join(f"{lv['id']}={lv['name']}" for lv in f["levels"]))
        for t in f["topics"]:
            lines.append(f"  {'  ' if t.get('parent') else ''}{t['id']} [{t['level']}]: {t['name']}")
    return "\n".join(lines)


SYSTEM_PROMPT = """You map a learner's typed goal to our catalogue. Reply with JSON only:
{"field": field id or null, "level": level id or null, "topic_ids": [0-2 topic ids],
 "ambiguous": true/false, "candidates": [{"field": field id or null, "label": "short label"}]}
Rules: use only ids from the catalogue. field null means the goal is outside our fields (still valid, e.g. UPSC, CA, guitar).
"CA" (chartered accountant) is not CMA. "CS" alone is ambiguous: Company Secretary or Computer Science; set ambiguous
true with both candidates. Only set ambiguous when truly unclear. Prefer the most specific topic that fits."""


def parse_llm(text: str, llm) -> ParsedGoal:
    """llm: callable(system, user) -> str (JSON). Only the user's text and our catalogue are sent (R4)."""
    raw = llm(SYSTEM_PROMPT + "\n\nCATALOGUE:\n" + catalogue(), text)
    data = json.loads(raw)
    fields = load_fields()
    fid = data.get("field") if data.get("field") in fields else None
    level_ids = {lv["id"] for lv in fields[fid]["levels"]} if fid else set()
    topic_index = {t["id"]: t for t in fields[fid]["topics"]} if fid else {}
    level = data.get("level") if data.get("level") in level_ids else None
    topic_ids = [t for t in data.get("topic_ids", []) if t in topic_index][:2]
    if not level and topic_ids:
        level = topic_index[topic_ids[0]]["level"]
    candidates = [
        Candidate(c.get("field") if c.get("field") in fields else None, str(c.get("label", ""))[:60])
        for c in data.get("candidates", [])
        if isinstance(c, dict)
    ][:3]
    ambiguous = bool(data.get("ambiguous")) and len(candidates) >= 2
    return ParsedGoal(
        text, None if ambiguous else fid, fields[fid]["display_name"] if fid and not ambiguous else text.strip(),
        None if ambiguous else level, [] if ambiguous else topic_ids, detect_language(text), minor_signals(text),
        ambiguous=ambiguous, candidates=candidates if ambiguous else [], confidence=0.7, method="llm",
    )


def parse_hybrid(text: str, llm, threshold: float = 0.6) -> ParsedGoal:
    goal = parse_rules(text)
    if goal.confidence >= threshold or goal.ambiguous:
        return goal
    try:
        g = parse_llm(text, llm)
    except Exception:
        return goal  # the LLM is optional; never fail the user because of it
    g.method = "hybrid-llm"
    return g
