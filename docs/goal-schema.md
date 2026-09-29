# Goal schema (plan 4.1)

A typed goal is turned into this structure (`ParsedGoal` in `backend/app/goals.py`). It's our own data: the user's text and our field catalogue. No YouTube data goes into it (R4).

| Field | Meaning |
|---|---|
| `text` | What the user typed, unchanged. |
| `field` | One of our field IDs (`cs-company-secretary`, `cma`, `neet`, `ai`), or `null` for any other goal. Any goal is allowed. |
| `field_label` | Readable name of the field, or the user's text for other goals. |
| `level` | Exam stage (CS: `cseet`, `exec`, `prof`; CMA: `cma-foundation`, `cma-intermediate`, `cma-final`) or subject/area (NEET: `phy`, `chem`, `bio`; AI: `ai-fnd`, `ai-ml`, `ai-dl`, `ai-llm`). |
| `topic_ids` | The paper, subject or unit from the topic map, most specific first. |
| `language` | `en`, `hi` (Devanagari) or `mixed` (Hinglish). Search queries follow it. |
| `minor_signals` | Words that suggest a school student ("class 11", "boards", a NEET/JEE year 2+ years away). Used by the 18+ re-check (step 4.6). |
| `ambiguous` + `candidates` | Set only when the goal truly has two meanings; the app asks one "Did you mean" tap. |
| `confidence`, `method` | How sure the parser is; `rules`, or `hybrid-llm` when the LLM was needed. |

## 10 goals mapped by hand

| Typed goal | field | level | topic | language | notes |
|---|---|---|---|---|---|
| CS ESG paper | cs-company-secretary | prof | cs-prof-esg | en | No question needed: "ESG" settles it. |
| CS | (asks) | | | en | Did you mean: Company Secretary (ICSI) · Computer Science |
| CMA Inter costing | cma | cma-intermediate | cma-int-p8-cost-accounting | en | |
| cma inter ka costing chapter samjhna hai | cma | cma-intermediate | cma-int-p8-cost-accounting | mixed | Query gets "hindi". |
| सीएमए इंटर कॉस्टिंग | cma | cma-intermediate | cma-int-p8-cost-accounting | hi | |
| CA inter costing | null | | | en | CA is not CMA, even though "costing" is a CMA word. |
| neet electrostatics one shot | neet | phy | neet-phy-electrostatics | en | "one shot" kept in the query. |
| NEET 2029 class 11 physics | neet | phy | neet-phy-physics | en | minor_signals: class 11, neet 2029. |
| python for machine learning | ai | ai-fnd | ai-fnd-python | en | |
| UPSC polity laxmikanth | null | | | en | Outside our fields; searched with the user's own words. |

The full test set (66 goals) is `backend/tests/data/goal_test_set.json`; `tools/eval_goals.py` scores parsers against it.
