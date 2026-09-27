"""Save the Groq API key in backend/.env without showing it.

Asks for the key with hidden input, then adds or replaces the GROQ_API_KEY
line. Every other line (such as YOUTUBE_API_KEY) is kept as it is. The key
is never printed.

Run from the project folder:
    python tools/set_groq_key.py
"""

import getpass
import sys
from pathlib import Path

ENV_FILE = Path(__file__).resolve().parent.parent / "backend" / ".env"
NAME = "GROQ_API_KEY"


def main() -> None:
    key = getpass.getpass("Paste your Groq API key (it won't show) and press Enter: ").strip()
    if not key:
        sys.exit("No key entered. Nothing changed.")
    if any(ch.isspace() for ch in key) or not key.startswith("gsk_"):
        sys.exit("That doesn't look like a Groq key (they start with 'gsk_'). Nothing changed.")

    lines = ENV_FILE.read_text(encoding="utf-8").splitlines() if ENV_FILE.exists() else []
    new_line = f"{NAME}={key}"
    replaced = False
    for i, line in enumerate(lines):
        if line.split("=", 1)[0].strip() == NAME:
            lines[i] = new_line
            replaced = True
    if not replaced:
        lines.append(new_line)

    ENV_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    action = "Updated" if replaced else "Added"
    print(f"{action} {NAME} in {ENV_FILE} ({len(key)} characters). Other lines unchanged.")


if __name__ == "__main__":
    main()
