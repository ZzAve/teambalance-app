#!/usr/bin/env bash
# Per-session setup for cloud sessions. The toolchain itself comes from
# .claude/cloud-setup-script.sh, whose snapshot carries neither a running daemon nor the
# repo's gitignored generated sources.
#
# LANG, LC_ALL and JAVA_HOME are set in the environment's own variables field, so nothing
# here touches PATH: the setup script points /usr/local/bin/node at the required version
# and OpenJDK's update-alternatives already owns /usr/bin/java.
set -euo pipefail

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

log() { echo "[session-start] $*"; }

start_docker_daemon() {
  docker info >/dev/null 2>&1 && return 0

  log "starting docker daemon"
  # The daemon is not answering, so any pidfile here is stale — most likely captured in
  # the environment snapshot. dockerd refuses to start when the PID it names happens to
  # be live in the restored container, so clear it rather than inherit that deadlock.
  rm -f /var/run/docker.pid
  # Disowned so nothing downstream can end up waiting on the daemon.
  nohup dockerd >/var/log/dockerd.log 2>&1 &
  disown $!
  for _ in $(seq 1 60); do
    docker info >/dev/null 2>&1 && return 0
    sleep 1
  done

  # Not fatal: only Testcontainers ITs and make e2e need docker, and aborting here would
  # cost the build as well.
  log "WARN: docker daemon did not start — make test-api and make e2e will fail"
  tail -20 /var/log/dockerd.log
}

install_playwright_browser() {
  # Stories and the e2e suite both drive Chromium, at the revision the installed
  # @playwright/test pins — which is why this can only run once node_modules exists.
  (cd app && npx --no-install playwright install chromium chromium-headless-shell) || {
    log "ERROR: could not install the pinned Chromium. Is cdn.playwright.dev in the"
    log "       environment's allowed domains? Storybook and e2e runs need it."
    exit 1
  }
}

start_docker_daemon

# Generates the gitignored wirespec clients (build dependsOn wirespec-typescript) and
# installs app dependencies, then proves the tree still builds.
log "building"
make yolo

log "installing playwright browser"
install_playwright_browser
