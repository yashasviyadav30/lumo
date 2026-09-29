"""Field data: topic maps and curated sources (plan 4.7a, 5.1). Our own data, loaded from app/data/fields."""

import json
from functools import lru_cache
from pathlib import Path

FIELDS_DIR = Path(__file__).resolve().parent / "data" / "fields"


@lru_cache
def load_fields() -> dict[str, dict]:
    fields = {}
    for path in sorted(FIELDS_DIR.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        fields[data["field"]] = data
    return fields


@lru_cache
def curated_channel_ids() -> frozenset[str]:
    ids: set[str] = set()
    for field in load_fields().values():
        for source in field.get("sources", []):
            if source.get("channel_id"):
                ids.add(source["channel_id"])
    return frozenset(ids)
