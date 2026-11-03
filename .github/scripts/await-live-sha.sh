#!/usr/bin/env bash
# Usage: await-live-sha.sh <api-base-url> <expected-sha>   (env: INTERNAL_API_KEY)
#
# `scw container update` only *registers* the new image and returns immediately — Scaleway rolls it
# out asynchronously. Without this gate a container that crashes on boot (e.g. a Flyway validation
# failure) leaves the deploy job green while the old revision keeps serving. Poll the live actuator
# `info` endpoint — gated by the internal API key, so the SHA is never public — until it reports the
# exact SHA just pushed. Non-200 / mismatched SHA = the new image isn't serving yet (rollout in
# progress, or it crashed); keep waiting and fail red if it never becomes live.
set -euo pipefail
url="$1/internal/actuator/info"
expected_sha="$2"
deadline=$(( SECONDS + 360 ))
attempt=0
while [ "$SECONDS" -lt "$deadline" ]; do
  attempt=$(( attempt + 1 ))
  body="$(curl -fsS --max-time 10 -H "X-Internal-Api-Key: ${INTERNAL_API_KEY}" "$url" 2>/dev/null || true)"
  live_sha="$(printf '%s' "$body" | jq -r '.build.sha // empty' 2>/dev/null || true)"
  if [ "$live_sha" = "$expected_sha" ]; then
    echo "✓ Live build SHA ${live_sha} at $1 matches the deployed image (attempt ${attempt})."
    exit 0
  fi
  echo "… awaiting rollout (attempt ${attempt}): live='${live_sha:-<none>}' expected='${expected_sha}'"
  sleep 10
done
echo "::error::Image ${expected_sha} never became live at $1 within $(( 360 / 60 )) min — deployment NOT verified. The new container likely failed to boot; check Scaleway Cockpit logs for a crash (e.g. Flyway validation)."
exit 1
