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

# A container restart leaves pid files behind, and their PIDs may now belong to unrelated
# processes. dockerd refuses to start while docker.pid names a live process, and waits on
# a live PID in containerd.pid as if it were containerd until it times out.
remove_stale_pidfile() {
  local pidfile=$1 expected_process=$2
  if [ -f "$pidfile" ] && [ "$(cat "/proc/$(cat "$pidfile" 2>/dev/null)/comm" 2>/dev/null)" != "$expected_process" ]; then
    if rm "$pidfile"; then echo "Removed stale $pidfile"; else echo "Could not remove stale $pidfile"; fi
  fi
}
remove_stale_pidfile /var/run/docker.pid dockerd
remove_stale_pidfile /var/run/docker/containerd/containerd.pid containerd

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
