#!/usr/bin/env bash
# Poll Watch for new changes since the last cursor. MIT licensed.
# Usage: WATCH_KEY=wk_... ./poll-changes.sh   (cursor kept in ./.watch-cursor)
set -euo pipefail
since=$(cat .watch-cursor 2>/dev/null || echo 0)
resp=$(curl -fsS -H "Authorization: Bearer $WATCH_KEY" "https://watch.darmousseh.com/v1/changes?since=$since")
echo "$resp"
next=$(printf '%s' "$resp" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("cursor",""))')
[ -n "$next" ] && echo "$next" > .watch-cursor
