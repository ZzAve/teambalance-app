#!/usr/bin/env bash
# Record a portrait phone take of a steps module, or probe it with PROBE=1 (no video, a screenshot
# per section, fast waits). Runs from app/, where Playwright is installed; call it from anywhere.
#   record.sh <steps.mjs> <out-dir> [port=4173]
# Writes <out-dir>/take.log (CAPTION_AT lines) and <out-dir>/take/*.webm, or <out-dir>/probe/*.png.
# Uses <out-dir>/voice/clips.json as NARRATION when it exists. Exits non-zero if any section failed.
set -euo pipefail
REPO=$(cd "$(dirname "$0")/../../../.." && pwd)
STEPS=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")
OUT=$(mkdir -p "$2" && cd "$2" && pwd)
PORT=${3:-4173}
CLIPS="$OUT/voice/clips.json"
[ -f "$CLIPS" ] || CLIPS=""
DIR="$OUT/take"; LOG="$OUT/take.log"
if [ "${PROBE:-}" = 1 ]; then DIR="$OUT/probe"; LOG="$OUT/probe.log"; fi
cd "$REPO/app"
WIDTH=390 HEIGHT=844 DSF=3 STEPS="$STEPS" BASE_URL="http://localhost:$PORT" VIDEO_DIR="$DIR" NARRATION="$CLIPS" \
  node "$REPO/.agents/skills/demo-video/scripts/record-harness.mjs" > "$LOG" 2>&1 || status=$?
grep -E 'SECTION_FAIL|SCREENCAST_ERROR' "$LOG" || true
echo "$(grep -c CAPTION_AT "$LOG") captions, log: $LOG"
exit "${status:-0}"
