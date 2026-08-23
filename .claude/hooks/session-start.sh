#!/usr/bin/env bash
# SessionStart hook — provisions a Claude Code on the web container so that
# `make build`, `make lint`, `make test` and `make e2e` all work out of the box.
#
# What the base image gives us and what it misses:
#   java     21   -> the build needs 25 (gradle.properties javaVersion, .sdkmanrc)
#   node     22   -> the app needs 24  (.nvmrc, CI)
#   docker   client only, no daemon -> Testcontainers ITs and `make infra` need one
#   chromium bundled at $PLAYWRIGHT_BROWSERS_PATH, but at the image's revision, not the
#            one @playwright/test pins (Vitest storybook project + e2e both need it)
#
# Runs synchronously: the session starts once the toolchain is actually usable.
set -euo pipefail

# Local runs already have sdkman/nvm/Docker Desktop; only provision the remote container.
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
# sun.jnu.encoding=ANSI_X3.4-1968. Gradle then fails to *write* the HTML test
# report for any test whose name contains a non-ASCII character (several api ITs
# use an em dash), turning a fully green `make test-api` into a red build.
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

# --- JDK -------------------------------------------------------------------
# Temurin (.sdkmanrc: 25.0.3-tem) is not reachable from this network policy —
# api.adoptium.net is denied by the egress proxy — so use Ubuntu's OpenJDK 25
# from noble-updates/universe. Same HotSpot VM, same language level.
if [ -x "${JAVA_HOME_DIR}/bin/javac" ]; then
  log "JDK ${JAVA_MAJOR} already installed"
else
  log "installing OpenJDK ${JAVA_MAJOR}"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq --no-install-recommends "openjdk-${JAVA_MAJOR}-jdk-headless"
fi
export JAVA_HOME="$JAVA_HOME_DIR"
export PATH="${JAVA_HOME}/bin:${PATH}"

# --- Node ------------------------------------------------------------------
if [ -x "${NODE_PREFIX}/bin/node" ]; then
  log "node ${NODE_VERSION} already installed"
else
  log "installing node ${NODE_VERSION}"
  tmp="$(mktemp -d)"
  curl -fsSL --retry 3 --retry-delay 2 \
    "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    -o "${tmp}/node.tar.xz"
  mkdir -p "$NODE_PREFIX"
  tar -xJf "${tmp}/node.tar.xz" -C "$NODE_PREFIX" --strip-components=1
  rm -rf "$tmp"
fi
export PATH="${NODE_PREFIX}/bin:${PATH}"

# --- Docker ----------------------------------------------------------------
# The api ITs run Postgres + Redis through Testcontainers, and `make infra`/`make e2e`
# use docker compose, so the container needs a live daemon.
#
# Docker Hub's blob CDN (production.cloudfront.docker.com) is denied by the egress
# proxy, so a plain `docker pull` fails halfway through the download. mirror.gcr.io
# is allowed and is a pull-through cache for Docker Hub — point the daemon at it so
# every docker.io pull (incl. Testcontainers' ryuk) resolves transparently.
mkdir -p /etc/docker
if ! grep -q 'mirror.gcr.io' /etc/docker/daemon.json 2>/dev/null; then
  log "configuring docker registry mirror"
  cat > /etc/docker/daemon.json <<'JSON'
{
  "registry-mirrors": ["https://mirror.gcr.io"]
}
JSON
  pkill dockerd 2>/dev/null || true
  sleep 2
fi

if docker info >/dev/null 2>&1; then
  log "docker daemon already running"
else
  log "starting docker daemon"
  # Inherits HTTPS_PROXY/NO_PROXY and the system CA store, which is what lets the
  # daemon reach the mirror through the egress proxy.
  nohup dockerd >/var/log/dockerd.log 2>&1 &
  for _ in $(seq 1 30); do
    docker info >/dev/null 2>&1 && break
    sleep 1
  done
  docker info >/dev/null 2>&1 || { log "ERROR: docker daemon failed to start"; tail -20 /var/log/dockerd.log; exit 1; }
fi

# The Makefile and scripts/e2e.sh call `docker-compose`; the image only ships the
# `docker compose` plugin. Shim it rather than patching the repo.
if ! command -v docker-compose >/dev/null 2>&1; then
  log "installing docker-compose shim"
  printf '#!/bin/sh\nexec docker compose "$@"\n' > /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

# Warm the images the ITs and `make infra` need, so the first test run doesn't pay
# for the pull (and cannot fail on a transient registry hiccup).
for image in postgres:17-alpine redis:7-alpine redis:8-alpine; do
  if ! docker image inspect "$image" >/dev/null 2>&1; then
    log "pulling ${image}"
    docker pull -q "$image" || log "WARN: could not pull ${image}"
  fi
done

# --- Project dependencies --------------------------------------------------
# Wirespec generates the TS client into app/src/shared/api/generated (gitignored).
# The SPA, its stories and ESLint all import it, so generate before npm work.
log "generating wirespec clients"
# Two invocations on purpose: the wirespec plugin fails ("extensionClasses cannot be cast")
# when both generators are requested in one build, exactly as the Makefile does it.
./gradlew --quiet :api:wirespec-kotlin
./gradlew --quiet :api:wirespec-typescript

log "installing app dependencies"
(cd app && npm install --no-audit --no-fund)

# --- Playwright browser ----------------------------------------------------
# The Vitest `storybook` project renders every story in headless Chromium, and the
# real e2e suite drives Chromium too, so the browser Playwright expects must exist.
#
# The image ships a Playwright browser bundle, but its revision tracks the image, not
# this repo's @playwright/test — and cdn.playwright.dev is denied by the egress proxy,
# so a mismatch cannot be downloaded away. Try the real install first (a no-op when the
# right revision is already there, and the correct fix once the CDN is reachable); if
# that is blocked, alias the bundled build to the revision Playwright looks for. The
# bundled Chromium is a few majors behind but speaks the same CDP surface the stories
# and e2e flows use.
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
