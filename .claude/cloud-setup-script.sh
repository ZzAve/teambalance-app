#!/bin/bash
# Paste into the "Setup script" field of the cloud environment at claude.ai/code
# (environment selector -> settings icon). Nothing in this repo runs it; the file lives
# here to keep it version-controlled and reviewable.
#
# This provisions the VM once per environment — the filesystem is snapshotted afterwards,
# so what it installs is on disk at the start of every later session. The per-session
# half, including everything a snapshot cannot hold, is .claude/hooks/session-start.sh.
#
# Three constraints, all load-bearing:
#   - A non-zero exit fails the session start, so fallible commands end in `|| true`.
#   - It must finish in ~5 minutes or the cache cannot build.
#   - It is scoped to the environment and may run for a session on any repository, so it
#     never assumes this checkout exists. Anything that reads .nvmrc, gradle.properties
#     or runs ./gradlew belongs in the hook.
#
# Pinned versions can drift from the repo; the hook verifies them and reports the gap.

set -u
export DEBIAN_FRONTEND=noninteractive

JAVA_MAJOR=25          # gradle.properties javaVersion, .sdkmanrc
NODE_VERSION=24.18.1   # .nvmrc
PLAYWRIGHT_VERSION=1.62.1  # app/package.json @playwright/test
JAVA_HOME_DIR="/usr/lib/jvm/java-${JAVA_MAJOR}-openjdk-amd64"
NODE_PREFIX="/opt/node${NODE_VERSION}"
TESTCONTAINER_IMAGES="postgres:17-alpine redis:7-alpine redis:8-alpine"

log() { echo "[setup] $*"; }

refresh_ubuntu_repos_only() {
  # The base image also ships third-party PPAs (deadsnakes, ondrej/php) on
  # ppa.launchpadcontent.net, which no allowlist covers, so a plain `apt-get update`
  # fails them as "no longer signed" and exits non-zero. Nothing here is served from
  # them, so scope past them rather than widening the allowlist to reach them.
  if [ -f /etc/apt/sources.list.d/ubuntu.sources ]; then
    apt-get update -qq \
      -o Dir::Etc::sourcelist="sources.list.d/ubuntu.sources" \
      -o Dir::Etc::sourceparts="-" \
      -o APT::Get::List-Cleanup="0" || true
  else
    apt-get update -qq || true
  fi
}

install_jdk() {
  if [ -x "${JAVA_HOME_DIR}/bin/javac" ]; then
    log "JDK ${JAVA_MAJOR} already present"
    return 0
  fi
  # Ubuntu's openjdk-25 is the same 25.0.3 HotSpot build .sdkmanrc pins as Temurin,
  # which is reachable here while api.adoptium.net is not.
  log "installing OpenJDK ${JAVA_MAJOR}"
  refresh_ubuntu_repos_only
  apt-get install -y -qq --no-install-recommends "openjdk-${JAVA_MAJOR}-jdk-headless" >/dev/null || true
  if [ -x "${JAVA_HOME_DIR}/bin/javac" ]; then
    log "JDK ${JAVA_MAJOR} installed"
  else
    log "WARN: OpenJDK ${JAVA_MAJOR} install failed — sessions will start without a usable gradle"
  fi
}

install_node() {
  if [ -x "${NODE_PREFIX}/bin/node" ]; then
    log "node ${NODE_VERSION} already present"
    return 0
  fi
  log "installing node ${NODE_VERSION}"
  local tmp
  tmp="$(mktemp -d)"
  if curl -fsSL --retry 3 --retry-delay 2 \
      "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
      -o "${tmp}/node.tar.xz"; then
    mkdir -p "$NODE_PREFIX"
    tar -xJf "${tmp}/node.tar.xz" -C "$NODE_PREFIX" --strip-components=1 || true
  else
    log "WARN: node download failed"
  fi
  rm -rf "$tmp"
}

link_node_into_path() {
  # The image points these at node 20. Repointing them puts the required version on the
  # default PATH, so neither the hook nor a session has to manipulate PATH.
  for binary in node npm npx; do
    ln -sfn "${NODE_PREFIX}/bin/${binary}" "/usr/local/bin/${binary}" || true
  done
}

install_playwright_browser() {
  # Pulled into the snapshot so no session pays the ~150MB download. The hook re-runs the
  # same install against the revision the repo's own @playwright/test pins, which is a
  # no-op whenever this pin still matches.
  export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
  log "installing playwright chromium (playwright ${PLAYWRIGHT_VERSION})"
  npx --yes "playwright@${PLAYWRIGHT_VERSION}" install chromium chromium-headless-shell >/dev/null 2>&1 ||
    log "WARN: playwright browser download failed — is cdn.playwright.dev allowlisted?"
}

configure_registry_mirror() {
  # Docker Hub serves blobs from production.cloudfront.docker.com, which the Trusted
  # allowlist does not cover (it lists production.cloudflare.docker.com, a different
  # host), so an un-allowlisted environment fails mid-pull. mirror.gcr.io is a Docker Hub
  # pull-through cache under the allowlisted *.gcr.io, and is harmless when the CDN works.
  mkdir -p /etc/docker
  grep -q 'mirror.gcr.io' /etc/docker/daemon.json 2>/dev/null && return 0

  log "configuring docker registry mirror"
  cat > /etc/docker/daemon.json <<'JSON'
{
  "registry-mirrors": ["https://mirror.gcr.io"]
}
JSON
  pkill dockerd 2>/dev/null || true
  sleep 2
}

install_compose_shim() {
  # The Makefile and scripts/e2e.sh call `docker-compose`; the image ships only the
  # `docker compose` plugin.
  command -v docker-compose >/dev/null 2>&1 && return 0
  log "installing docker-compose shim"
  printf '#!/bin/sh\nexec docker compose "$@"\n' > /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose || true
}

start_docker_daemon() {
  docker info >/dev/null 2>&1 && return 0
  log "starting docker daemon"
  # Disowned so the pull wait below cannot block on the daemon.
  nohup dockerd >/var/log/dockerd.log 2>&1 &
  disown $!
  for _ in $(seq 1 30); do
    docker info >/dev/null 2>&1 && return 0
    sleep 1
  done
  return 1
}

prewarm_container_images() {
  # The snapshot keeps /var/lib/docker, so no session ever waits on these pulls.
  # Testcontainers pulls its own ryuk at test time.
  if ! start_docker_daemon; then
    log "WARN: docker daemon did not start — images not pre-pulled"
    return 0
  fi

  local pull_pids=()
  for image in $TESTCONTAINER_IMAGES; do
    if docker image inspect "$image" >/dev/null 2>&1; then
      log "${image} already pulled"
    else
      log "pulling ${image}"
      ( docker pull -q "$image" >/dev/null 2>&1 || log "WARN: could not pull ${image}" ) &
      pull_pids+=("$!")
    fi
  done
  [ "${#pull_pids[@]}" -gt 0 ] && wait "${pull_pids[@]}"
}

install_jdk & jdk_pid=$!
install_node & node_pid=$!
wait "$jdk_pid" "$node_pid"

link_node_into_path
install_playwright_browser
configure_registry_mirror
install_compose_shim
prewarm_container_images

log "done"
exit 0
