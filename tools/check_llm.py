"""Plan step 0.5: check that the Groq key works.

Sends one short, made-up goal (no personal data, no YouTube data) to a
GPT-OSS model on Groq and prints the reply length and time taken.

Run from the backend folder:
    uv run python ../tools/check_llm.py
"""

import sys
import time
from pathlib import Path

import httpx

ENV_FILE = Path(__file__).resolve().parent.parent / "backend" / ".env"
URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "openai/gpt-oss-20b"


def read_key() -> str:
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        name, _, value = line.partition("=")
        if name.strip() == "GROQ_API_KEY" and value.strip():
            return value.strip()
    sys.exit("GROQ_API_KEY is empty in backend/.env.")


def main() -> None:
    # The Windows console can't print some characters the model uses (e.g. non-breaking hyphens).
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    key = read_key()
    start = time.perf_counter()
    response = httpx.post(
        URL,
        headers={"Authorization": f"Bearer {key}"},
        json={
            "model": MODEL,
            "messages": [
                {"role": "user", "content": "In one line: what exam is 'CMA Inter costing' about?"}
            ],
            "max_tokens": 200,
        },
        timeout=30,
    )
    elapsed = time.perf_counter() - start
    print(f"HTTP {response.status_code} in {elapsed:.2f} s")
    if response.status_code != 200:
        sys.exit(f"Error: {response.text[:300]}")
    reply = response.json()["choices"][0]["message"]["content"]
    print(f"Reply: {reply.strip()[:200]}")
    print("OK: the Groq key works.")


if __name__ == "__main__":
    main()
