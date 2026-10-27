#!/bin/bash
# SessionStart hook: bring up the Docker daemon in Claude Code on the web.
#
# Remote sessions ship the Docker CLI but no init system, so /var/run/docker.sock
# is absent until dockerd is launched by hand. Testcontainers (`make test-api`)
# and the compose infra (`make db`, `make infra`, `make e2e`) all need it.
# Local machines run their own Docker, so this is a no-op there.
set -euo pipefail

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

command -v dockerd >/dev/null 2>&1 || { echo "dockerd not installed — skipping Docker startup"; exit 0; }

# Idempotent: a reachable daemon (resume/clear/compact re-fires this hook) needs nothing.
if docker info >/dev/null 2>&1; then
  echo "Docker daemon already running"
  exit 0
fi

# A container restart leaves the pid file behind, and its PID may now belong to an
# unrelated process; dockerd refuses to start while the pid file names a live process.
PIDFILE=/var/run/docker.pid
if [ -f "$PIDFILE" ] && [ "$(cat "/proc/$(cat "$PIDFILE" 2>/dev/null)/comm" 2>/dev/null)" != "dockerd" ]; then
  if rm "$PIDFILE"; then echo "Removed stale $PIDFILE"; else echo "Could not remove stale $PIDFILE"; fi
fi

LOG=/tmp/dockerd.log
nohup dockerd >"$LOG" 2>&1 &

for _ in $(seq 1 30); do
  if docker info >/dev/null 2>&1; then
    echo "Docker daemon ready ($(docker --version))"
    exit 0
  fi
  sleep 1
done

# Never fail the session over this — report and let the agent decide.
echo "Docker daemon did not become ready within 30s; see $LOG"
exit 0
