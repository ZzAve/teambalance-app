#!/usr/bin/env bash
# SessionStart hook — the per-session half of cloud provisioning.
#
# The VM itself is provisioned by .claude/cloud-setup-script.sh, pasted into the cloud
# environment's "Setup script" field: OpenJDK 25, node 24, the docker registry config
# and the container images. That runs once per environment and is snapshotted, so it is
# already on disk when a session starts. This hook deliberately does NOT duplicate it.
#
# What is left for every session, because a filesystem snapshot cannot hold it:
#   - the docker daemon: the cache keeps files, not processes
#   - the session's environment (locale, JAVA_HOME, PATH) via CLAUDE_ENV_FILE
#   - project setup that must run locally as well: wirespec codegen and npm install
#   - the Playwright browser revision, which is pinned by app/node_modules
#
# If the toolchain is missing, this hook reports it and stops rather than installing it:
# a session that quietly reinstalls a JDK every time hides a broken environment config.
set -euo pipefail

# Local runs already have sdkman/nvm/Docker Desktop; only touch the remote container.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$REPO_DIR"

JAVA_MAJOR="$(sed -n 's/^javaVersion=\([0-9]*\).*/\1/p' gradle.properties | head -1)"
JAVA_MAJOR="${JAVA_MAJOR:-25}"
NODE_VERSION="$(tr -d '[:space:]' < .nvmrc 2>/dev/null || true)"
NODE_VERSION="${NODE_VERSION:-24.18.1}"
NODE_PREFIX="/opt/node${NODE_VERSION}"
JAVA_HOME_DIR="/usr/lib/jvm/java-${JAVA_MAJOR}-openjdk-amd64"

log() { echo "[session-start] $*"; }

# The base image runs in the POSIX locale, which leaves the JVM with
# sun.jnu.encoding=ANSI_X3.4-1968. Gradle then fails to *write* the HTML test report for
# any test whose name contains a non-ASCII character (several api ITs use an em dash),
# turning a fully green `make test-api` into a red build.
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

# --- Toolchain check -------------------------------------------------------
# Versions come from gradle.properties and .nvmrc, so this also catches the case where
# the repo moved past what the setup script pins.
missing=""
[ -x "${JAVA_HOME_DIR}/bin/javac" ] || missing="${missing}\n  - OpenJDK ${JAVA_MAJOR} at ${JAVA_HOME_DIR} (gradle.properties javaVersion)"
[ -x "${NODE_PREFIX}/bin/node" ]    || missing="${missing}\n  - node ${NODE_VERSION} at ${NODE_PREFIX} (.nvmrc)"

if [ -n "$missing" ]; then
  log "ERROR: this environment is missing part of the toolchain:"
  printf '%b\n' "$missing"
  log "Fix it in the environment, not here: paste .claude/cloud-setup-script.sh into the"
  log "cloud environment's Setup script field at claude.ai/code (environment selector ->"
  log "settings icon). If it is already there, the pinned versions have drifted from the"
  log "repo — update the script and let the cache rebuild."
  exit 1
fi

export JAVA_HOME="$JAVA_HOME_DIR"
export PATH="${JAVA_HOME}/bin:${NODE_PREFIX}/bin:${PATH}"

# --- Docker daemon ---------------------------------------------------------
# Testcontainers ITs, `make infra` and `make e2e` need a running daemon. The setup
# script's snapshot carries /etc/docker/daemon.json and the pulled images, but not the
# process, so it starts here every session.
if docker info >/dev/null 2>&1; then
  log "docker daemon already running"
else
  log "starting docker daemon"
  # Inherits HTTPS_PROXY/NO_PROXY and the system CA store, which is what lets the daemon
  # reach the registry through the egress proxy. Disowned so no later `wait` blocks on it.
  nohup dockerd >/var/log/dockerd.log 2>&1 &
  disown $!
  for _ in $(seq 1 30); do
    docker info >/dev/null 2>&1 && break
    sleep 1
  done
  docker info >/dev/null 2>&1 || {
    log "ERROR: docker daemon failed to start — Testcontainers ITs and make e2e will fail"
    tail -20 /var/log/dockerd.log
    exit 1
  }
fi

# --- Project dependencies --------------------------------------------------
# Wirespec generates the TS client into app/src/shared/api/generated (gitignored).
# The SPA, its stories and ESLint all import it, so generate before npm work.
log "generating wirespec clients"
# Two invocations on purpose: the wirespec plugin fails ("extensionClasses cannot be
# cast") when both generators are requested in one build, exactly as the Makefile does it.
./gradlew --quiet :api:wirespec-kotlin
./gradlew --quiet :api:wirespec-typescript

log "installing app dependencies"
(cd app && npm install --no-audit --no-fund)

# --- Playwright browser ----------------------------------------------------
# The Vitest `storybook` project renders every story in headless Chromium, and the real
# e2e suite drives Chromium too. The required revision is pinned by the installed
# @playwright/test, so this belongs here rather than in the setup script, which runs
# without the repo.
#
# Try the real install first. When cdn.playwright.dev is not allowlisted it fails, and
# the image's bundled build is aliased to the revision Playwright looks for — a few
# Chromium majors behind, but the same CDP surface the stories and e2e flows use.
setup_playwright_browsers() {
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

  local have
  have="$(find "$pw_dir" -maxdepth 1 -name 'chromium-*' -type d -printf '%f\n' 2>/dev/null \
    | sed 's/^chromium-//' | grep -vx "$want" | sort -n | tail -1)"
  if [ -z "$have" ] || [ ! -d "${pw_dir}/chromium-${have}" ]; then
    log "WARN: cdn.playwright.dev is blocked and no bundled chromium to alias — story/e2e runs will fail"
    return 0
  fi

  log "cdn.playwright.dev blocked — aliasing bundled chromium ${have} as ${want}"
  # Old bundles lay the browser out as chrome-linux/, Chrome-for-Testing ones as chrome-linux64/.
  local chrome_dir="${pw_dir}/chromium-${have}/chrome-linux"
  [ -d "${pw_dir}/chromium-${have}/chrome-linux64" ] && chrome_dir="${pw_dir}/chromium-${have}/chrome-linux64"
  mkdir -p "${pw_dir}/chromium-${want}"
  ln -sfn "$chrome_dir" "${pw_dir}/chromium-${want}/chrome-linux64"
  touch "${pw_dir}/chromium-${want}/INSTALLATION_COMPLETE" "${pw_dir}/chromium-${want}/DEPENDENCIES_VALIDATED"

  local shell_dir="${pw_dir}/chromium_headless_shell-${have}/chrome-linux"
  if [ -d "$shell_dir" ]; then
    # The old bundle calls it headless_shell; Playwright now looks for chrome-headless-shell.
    [ -e "${shell_dir}/chrome-headless-shell" ] || ln -sfn headless_shell "${shell_dir}/chrome-headless-shell"
    mkdir -p "${pw_dir}/chromium_headless_shell-${want}"
    ln -sfn "$shell_dir" "${pw_dir}/chromium_headless_shell-${want}/chrome-headless-shell-linux64"
    touch "${pw_dir}/chromium_headless_shell-${want}/INSTALLATION_COMPLETE" \
          "${pw_dir}/chromium_headless_shell-${want}/DEPENDENCIES_VALIDATED"
  fi
}
setup_playwright_browsers

# --- Persist environment for the session -----------------------------------
if [ -n "${CLAUDE_ENV_FILE:-}" ] && ! grep -q 'teambalance session-start' "$CLAUDE_ENV_FILE" 2>/dev/null; then
  {
    echo "# teambalance session-start"
    echo "export LANG=C.UTF-8"
    echo "export LC_ALL=C.UTF-8"
    echo "export JAVA_HOME=\"${JAVA_HOME_DIR}\""
    echo "export PATH=\"${JAVA_HOME_DIR}/bin:${NODE_PREFIX}/bin:\$PATH\""
  } >> "$CLAUDE_ENV_FILE"
fi

log "ready — java $(java -version 2>&1 | sed -n 's/.*version "\([^"]*\)".*/\1/p' | head -1), node $(node -v), docker $(docker version --format '{{.Server.Version}}')"
