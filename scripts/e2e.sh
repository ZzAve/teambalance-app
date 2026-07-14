#!/usr/bin/env bash
# Orchestrates the real full-stack e2e suite (`make e2e`):
#   infra (Postgres/Redis) → backend via bootRun under the `e2e` profile, health-gated → Playwright.
#
# Works both locally (brings docker-compose up if nothing listens on 5432) and in CI
# (reuses the workflow's Postgres/Redis service containers already bound to localhost).
#
# Isolation note: the seed fixture is idempotent, and the login flow issues a fresh token per
# run, so re-runs against a warm DB are safe. For a truly fresh DB locally:
#   docker-compose down -v && make e2e
set -euo pipefail

cd "$(dirname "$0")/.."

HEALTH_URL="http://localhost:8080/internal/actuator/health"
BACKEND_LOG="${BACKEND_LOG:-/tmp/teambalance-e2e-backend.log}"

port_open() { (exec 3<>"/dev/tcp/localhost/$1") 2>/dev/null && exec 3>&-; }

# --- Infra ---
if ! port_open 5432; then
  echo "Postgres not detected on :5432 — starting docker-compose infra"
  docker-compose up -d
fi
for _ in $(seq 1 30); do
  port_open 5432 && port_open 6379 && break
  sleep 1
done
port_open 5432 || { echo "Postgres did not come up on :5432" >&2; exit 1; }
port_open 6379 || { echo "Redis did not come up on :6379" >&2; exit 1; }

# --- Backend (e2e profile) ---
if port_open 8080; then
  echo "Something is already listening on :8080 — stop it first (make e2e owns the backend)" >&2
  exit 1
fi

echo "Starting backend (e2e profile), logs: $BACKEND_LOG"
./gradlew :api:bootRun --args='--spring.profiles.active=e2e' >"$BACKEND_LOG" 2>&1 &
GRADLE_PID=$!

cleanup() {
  # bootRun's JVM is a child of the Gradle daemon, not of $GRADLE_PID — kill by port too.
  kill "$GRADLE_PID" 2>/dev/null || true
  lsof -ti tcp:8080 2>/dev/null | xargs kill 2>/dev/null || true
  wait "$GRADLE_PID" 2>/dev/null || true
}
trap cleanup EXIT

echo "Waiting for backend health at $HEALTH_URL"
for i in $(seq 1 120); do
  if curl -sf "$HEALTH_URL" >/dev/null; then
    echo "Backend healthy after ${i}s"
    break
  fi
  if ! kill -0 "$GRADLE_PID" 2>/dev/null; then
    echo "Backend process died during startup — last 50 log lines:" >&2
    tail -50 "$BACKEND_LOG" >&2
    exit 1
  fi
  if [ "$i" -eq 120 ]; then
    echo "Backend not healthy after 120s — last 50 log lines:" >&2
    tail -50 "$BACKEND_LOG" >&2
    exit 1
  fi
  sleep 1
done

# --- Playwright (its webServer starts Vite with MSW disabled) ---
cd app && npm run e2e:real
