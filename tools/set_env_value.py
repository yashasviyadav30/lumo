"""Save a secret in backend/.env without showing it.

Asks for the value with hidden input, then adds or replaces the NAME line.
Every other line is kept as it is. The value is never printed.

Run from the project folder, for example:
    python tools/set_env_value.py DATABASE_URL
"""

import getpass
import re
import sys
from pathlib import Path

ENV_FILE = Path(__file__).resolve().parent.parent / "backend" / ".env"

# Quick checks so an obvious wrong paste changes nothing.
CHECKS = {
    "DATABASE_URL": (("postgresql://", "postgres://"), "a Postgres connection string"),
    "GROQ_API_KEY": (("gsk_",), "a Groq key"),
}


def main() -> None:
    if len(sys.argv) != 2 or not re.fullmatch(r"[A-Z][A-Z0-9_]*", sys.argv[1]):
        sys.exit("Usage: python tools/set_env_value.py NAME   (NAME in capitals, e.g. DATABASE_URL)")
    name = sys.argv[1]

    value = getpass.getpass(f"Paste the value for {name} (it won't show) and press Enter: ").strip()
    if not value:
        sys.exit("Nothing entered. Nothing changed.")
    if any(ch.isspace() for ch in value):
        sys.exit("The value contains spaces. Nothing changed.")
    if name in CHECKS:
        prefixes, label = CHECKS[name]
        if not value.startswith(prefixes):
            sys.exit(f"That doesn't look like {label} (should start with {' or '.join(prefixes)}). Nothing changed.")
    if "[YOUR-PASSWORD]" in value:
        sys.exit("Replace [YOUR-PASSWORD] with your real database password first. Nothing changed.")

    lines = ENV_FILE.read_text(encoding="utf-8").splitlines() if ENV_FILE.exists() else []
    new_line = f"{name}={value}"
    replaced = False
    for i, line in enumerate(lines):
        if line.split("=", 1)[0].strip() == name:
            lines[i] = new_line
            replaced = True
    if not replaced:
        lines.append(new_line)

    ENV_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{'Updated' if replaced else 'Added'} {name} in {ENV_FILE} ({len(value)} characters). Other lines unchanged.")


if __name__ == "__main__":
    main()
