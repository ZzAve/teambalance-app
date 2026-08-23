#!/usr/bin/env bash
# The per-session half of cloud provisioning. The VM itself comes from
# .claude/cloud-setup-script.sh, whose filesystem snapshot cannot carry running
# processes, the session environment, or anything pinned by app/node_modules.
set -euo pipefail

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

REPO_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$REPO_DIR"

REQUIRED_JAVA_MAJOR="$(sed -n 's/^javaVersion=\([0-9]*\).*/\1/p' gradle.properties | head -1)"
REQUIRED_JAVA_MAJOR="${REQUIRED_JAVA_MAJOR:-25}"
REQUIRED_NODE_VERSION="$(tr -d '[:space:]' < .nvmrc 2>/dev/null || true)"
REQUIRED_NODE_VERSION="${REQUIRED_NODE_VERSION:-24.18.1}"
JAVA_HOME_DIR="/usr/lib/jvm/java-${REQUIRED_JAVA_MAJOR}-openjdk-amd64"
NODE_PREFIX="/opt/node${REQUIRED_NODE_VERSION}"
DOCKER_LOG=/var/log/dockerd.log

log() { echo "[session-start] $*"; }

use_utf8_locale() {
  # A POSIX locale leaves the JVM with a non-UTF-8 sun.jnu.encoding, and Gradle then
  # fails to write the HTML report for tests whose names contain an em dash.
  export LANG=C.UTF-8
  export LC_ALL=C.UTF-8
}

require_toolchain() {
  local missing=""
  [ -x "${JAVA_HOME_DIR}/bin/javac" ] ||
    missing="${missing}\n  - OpenJDK ${REQUIRED_JAVA_MAJOR} at ${JAVA_HOME_DIR} (gradle.properties javaVersion)"
  [ -x "${NODE_PREFIX}/bin/node" ] ||
    missing="${missing}\n  - node ${REQUIRED_NODE_VERSION} at ${NODE_PREFIX} (.nvmrc)"
  [ -n "$missing" ] || return 0

  # Reporting beats reinstalling: a session that silently re-provisions every time hides
  # a broken environment config.
  log "ERROR: this environment is missing part of the toolchain:"
  printf '%b\n' "$missing"
  log "Fix it in the environment, not here: paste .claude/cloud-setup-script.sh into the"
  log "cloud environment's Setup script field at claude.ai/code (environment selector ->"
  log "settings icon). If it is already there, the pinned versions have drifted from the"
  log "repo — update the script and let the cache rebuild."
  exit 1
}

put_toolchain_on_path() {
  export JAVA_HOME="$JAVA_HOME_DIR"
  export PATH="${JAVA_HOME}/bin:${NODE_PREFIX}/bin:${PATH}"
}

start_docker_daemon() {
  if docker info >/dev/null 2>&1; then
    log "docker daemon already running"
    return 0
  fi

  log "starting docker daemon"
  # Inheriting HTTPS_PROXY and the system CA store is what lets the daemon reach the
  # registry through the egress proxy. Disowned so no later `wait` can block on it.
  nohup dockerd >"$DOCKER_LOG" 2>&1 &
  disown $!

  for _ in $(seq 1 30); do
    docker info >/dev/null 2>&1 && return 0
    sleep 1
  done

  log "ERROR: docker daemon failed to start — Testcontainers ITs and make e2e will fail"
  tail -20 "$DOCKER_LOG"
  exit 1
}

generate_wirespec_clients() {
  log "generating wirespec clients"
  # One task per invocation: the plugin fails with "extensionClasses cannot be cast" when
  # both generators are requested in the same build.
  ./gradlew --quiet :api:wirespec-kotlin
  ./gradlew --quiet :api:wirespec-typescript
}

install_app_dependencies() {
  log "installing app dependencies"
  (cd app && npm install --no-audit --no-fund)
}

alias_bundled_chromium_as() {
  local pw_dir="$1" want="$2" have="$3"

  # Bundles before Chrome-for-Testing lay the browser out under chrome-linux/.
  local chrome_dir="${pw_dir}/chromium-${have}/chrome-linux"
  [ -d "${pw_dir}/chromium-${have}/chrome-linux64" ] && chrome_dir="${pw_dir}/chromium-${have}/chrome-linux64"
  mkdir -p "${pw_dir}/chromium-${want}"
  ln -sfn "$chrome_dir" "${pw_dir}/chromium-${want}/chrome-linux64"
  touch "${pw_dir}/chromium-${want}/INSTALLATION_COMPLETE" "${pw_dir}/chromium-${want}/DEPENDENCIES_VALIDATED"

  local shell_dir="${pw_dir}/chromium_headless_shell-${have}/chrome-linux"
  [ -d "$shell_dir" ] || return 0
  # Those bundles name the binary headless_shell; Playwright now looks for chrome-headless-shell.
  [ -e "${shell_dir}/chrome-headless-shell" ] || ln -sfn headless_shell "${shell_dir}/chrome-headless-shell"
  mkdir -p "${pw_dir}/chromium_headless_shell-${want}"
  ln -sfn "$shell_dir" "${pw_dir}/chromium_headless_shell-${want}/chrome-headless-shell-linux64"
  touch "${pw_dir}/chromium_headless_shell-${want}/INSTALLATION_COMPLETE" \
        "${pw_dir}/chromium_headless_shell-${want}/DEPENDENCIES_VALIDATED"
}

ensure_playwright_chromium() {
  local pw_dir="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
  local want
  want="$(jq -r '.browsers[] | select(.name=="chromium") | .revision' \
    app/node_modules/playwright-core/browsers.json 2>/dev/null || true)"
  if [ -z "$want" ] || [ "$want" = "null" ]; then
    log "WARN: could not read the required chromium revision — skipping browser setup"
    return 0
  fi
  if [ -e "${pw_dir}/chromium-${want}/INSTALLATION_COMPLETE" ]; then
    log "playwright chromium ${want} present"
    return 0
  fi

  log "installing playwright chromium ${want}"
  if (cd app && npx --no-install playwright install chromium chromium-headless-shell >/dev/null 2>&1); then
    log "playwright chromium ${want} downloaded"
    return 0
  fi

  # The image bundles a Chromium at the image's revision, not the one @playwright/test
  # pins, and cdn.playwright.dev is not allowlisted. The bundled build is a few majors
  # behind but speaks the CDP surface the stories and e2e flows use.
  local have
  have="$(find "$pw_dir" -maxdepth 1 -name 'chromium-*' -type d -printf '%f\n' 2>/dev/null \
    | sed 's/^chromium-//' | grep -vx "$want" | sort -n | tail -1)"
  if [ -z "$have" ] || [ ! -d "${pw_dir}/chromium-${have}" ]; then
    log "WARN: cdn.playwright.dev is blocked and no bundled chromium to alias — story/e2e runs will fail"
    return 0
  fi

  log "cdn.playwright.dev blocked — aliasing bundled chromium ${have} as ${want}"
  alias_bundled_chromium_as "$pw_dir" "$want" "$have"
}

persist_session_environment() {
  [ -n "${CLAUDE_ENV_FILE:-}" ] || return 0
  grep -q 'teambalance session-start' "$CLAUDE_ENV_FILE" 2>/dev/null && return 0
  {
    echo "# teambalance session-start"
    echo "export LANG=C.UTF-8"
    echo "export LC_ALL=C.UTF-8"
    echo "export JAVA_HOME=\"${JAVA_HOME_DIR}\""
    echo "export PATH=\"${JAVA_HOME_DIR}/bin:${NODE_PREFIX}/bin:\$PATH\""
  } >> "$CLAUDE_ENV_FILE"
}

report_ready() {
  local java_version
  java_version="$(java -version 2>&1 | sed -n 's/.*version "\([^"]*\)".*/\1/p' | head -1)"
  log "ready — java ${java_version}, node $(node -v), docker $(docker version --format '{{.Server.Version}}')"
}

use_utf8_locale
require_toolchain
put_toolchain_on_path
start_docker_daemon
generate_wirespec_clients
install_app_dependencies
ensure_playwright_chromium
persist_session_environment
report_ready
