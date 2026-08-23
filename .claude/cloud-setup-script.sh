#!/bin/bash
# TeamBalance — cloud environment setup script.
#
# PASTE THIS into the "Setup script" field of the cloud environment at claude.ai/code
# (environment selector -> settings icon). Nothing in this repo executes it; the file
# lives here so the script is version-controlled and reviewable. Editing it has no
# effect until the new version is pasted into the dialog.
#
# WHY THIS EXISTS ALONGSIDE THE HOOK
# The setup script runs once per environment, before Claude Code launches, and the
# filesystem is snapshotted afterwards — so what it installs is on disk at the start of
# every later session for free. The SessionStart hook runs on every session and resume
# and is NOT cached. So the split is:
#
#   here  -> provision the VM: toolchains missing from the base image, the docker
#            daemon's registry config, the container images the suites need
#   hook  -> per-session and per-project work: start dockerd (the cache keeps files,
#            not processes), export the session env, wirespec codegen, npm install
#
# The hook re-checks everything this script does and installs whatever is missing, so a
# session still works if this script was never pasted, if the cache expired, or if the
# repo bumps .nvmrc / gradle.properties past what is pinned below. It just pays for it.
#
# RULES THIS SCRIPT MUST OBEY (per the cloud-environments docs)
#   - Exit 0. A non-zero exit means the session fails to start, so every fallible
#     command ends in `|| true` and the script ends in `exit 0`.
#   - Finish in ~5 minutes or the cache can't build; the independent installs run in
#     parallel with & / wait.
#   - It is scoped to the ENVIRONMENT, not to this repository, and may run for a session
#     on any repo. So it never assumes the checkout exists: anything that reads .nvmrc or
#     gradle.properties, or runs ./gradlew, belongs in the hook instead.
#
# NETWORK: assumes Custom access with the Trusted defaults plus
#   api.adoptium.net  cdn.playwright.dev  production.cloudfront.docker.com
# Without those the script still exits 0 and the hook's fallbacks take over.
#
# Cache rebuilds when this script changes, when the allowed domains change, or after
# roughly seven days. Resuming a session never re-runs it.

set -u
export DEBIAN_FRONTEND=noninteractive

# Pinned to match the repo. The hook reads the real values from gradle.properties and
# .nvmrc and corrects any drift, so a stale pin here costs a slow session, not a break.
JAVA_MAJOR=25
NODE_VERSION=24.18.1

log() { echo "[setup] $*"; }

# --- OpenJDK ---------------------------------------------------------------
# The base image ships OpenJDK 21; the Gradle build needs 25. Ubuntu noble-updates
# carries openjdk-25 (25.0.3), matching the Temurin build .sdkmanrc pins.
install_jdk() {
  if [ -x "/usr/lib/jvm/java-${JAVA_MAJOR}-openjdk-amd64/bin/javac" ]; then
    log "JDK ${JAVA_MAJOR} already present"
    return 0
  fi
  log "installing OpenJDK ${JAVA_MAJOR}"
  apt-get update -qq || true
  apt-get install -y -qq --no-install-recommends "openjdk-${JAVA_MAJOR}-jdk-headless" || true
}

# --- Node ------------------------------------------------------------------
# The image ships node 20/21/22; the SPA needs 24. Installed beside them under /opt,
# left off PATH here — the hook puts it on PATH per session via CLAUDE_ENV_FILE.
install_node() {
  local prefix="/opt/node${NODE_VERSION}"
  if [ -x "${prefix}/bin/node" ]; then
    log "node ${NODE_VERSION} already present"
    return 0
  fi
  log "installing node ${NODE_VERSION}"
  local tmp
  tmp="$(mktemp -d)"
  if curl -fsSL --retry 3 --retry-delay 2 \
      "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
      -o "${tmp}/node.tar.xz"; then
    mkdir -p "$prefix"
    tar -xJf "${tmp}/node.tar.xz" -C "$prefix" --strip-components=1 || true
  else
    log "WARN: node download failed — the hook will retry"
  fi
  rm -rf "$tmp"
}

install_jdk & jdk_pid=$!
install_node & node_pid=$!
wait "$jdk_pid" "$node_pid"

# --- Docker ----------------------------------------------------------------
# Testcontainers ITs, `make infra` and `make e2e` all need a daemon and these images.
# The snapshot keeps /var/lib/docker, so pulling here means no session ever waits on a
# pull; it does NOT keep the daemon process, which the hook starts each session.
#
# The registry mirror is a hedge: Docker Hub serves blobs from
# production.cloudfront.docker.com, which the Trusted allowlist does not cover (it lists
# production.cloudflare.docker.com — a different host), so an un-allowlisted environment
# fails mid-pull. mirror.gcr.io is a Docker Hub pull-through cache under the allowlisted
# *.gcr.io, and is harmless when the CDN is reachable.
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

# The Makefile and scripts/e2e.sh call `docker-compose`; the image ships only the
# `docker compose` plugin.
if ! command -v docker-compose >/dev/null 2>&1; then
  log "installing docker-compose shim"
  printf '#!/bin/sh\nexec docker compose "$@"\n' > /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose || true
fi

if ! docker info >/dev/null 2>&1; then
  log "starting docker daemon"
  # disown it: a bare `wait` would otherwise block on the daemon forever, which burns
  # the script's five-minute budget and fails the session start.
  nohup dockerd >/var/log/dockerd.log 2>&1 &
  disown $!
  for _ in $(seq 1 30); do
    docker info >/dev/null 2>&1 && break
    sleep 1
  done
fi

if docker info >/dev/null 2>&1; then
  # postgres:17-alpine + redis:7-alpine back the Testcontainers ITs; redis:8-alpine is
  # what docker-compose.yml starts. ryuk is pulled by Testcontainers at test time.
  pull_pids=()
  for image in postgres:17-alpine redis:7-alpine redis:8-alpine; do
    if docker image inspect "$image" >/dev/null 2>&1; then
      log "${image} already pulled"
    else
      log "pulling ${image}"
      ( docker pull -q "$image" >/dev/null 2>&1 || log "WARN: could not pull ${image}" ) &
      pull_pids+=("$!")
    fi
  done
  # Wait by PID, never bare: a bare `wait` would also wait on dockerd and hang.
  [ "${#pull_pids[@]}" -gt 0 ] && wait "${pull_pids[@]}"
else
  log "WARN: docker daemon did not start — the hook will retry"
fi

log "done"
exit 0
