#!/usr/bin/env bash
set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ -n "${OPENAI_API_KEY:-}" ]; then
  python - <<'PY'
from pathlib import Path

path = Path('.env')
content = path.read_text().splitlines()
out = []
seen_key = False
seen_model = False
for line in content:
    if line.startswith('OPENAI_API_KEY='):
        out.append(f'OPENAI_API_KEY="{__import__("os").environ.get("OPENAI_API_KEY", "")}"')
        seen_key = True
    elif line.startswith('OPENAI_MODEL='):
        out.append(f'OPENAI_MODEL="{__import__("os").environ.get("OPENAI_MODEL", "gpt-4.1-mini")}"')
        seen_model = True
    else:
        out.append(line)
if not seen_key:
    out.append(f'OPENAI_API_KEY="{__import__("os").environ.get("OPENAI_API_KEY", "")}"')
if not seen_model:
    out.append(f'OPENAI_MODEL="{__import__("os").environ.get("OPENAI_MODEL", "gpt-4.1-mini")}"')
path.write_text("\n".join(out) + "\n")
PY
fi

npm install
npx prisma migrate deploy || true
npm run db:seed || true
