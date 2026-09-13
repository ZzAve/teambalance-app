#!/usr/bin/env bash
# Am I set up to work on this repo? (`make check-tooling`)
#
# Answers three questions a newcomer — or an agent starting a session — otherwise answers the
# expensive way, by running a build and reading the wreckage:
#
#   1. Are the required tools present, at the versions this repo pins?
#   2. Is the Wirespec-generated TypeScript client present and current? It is gitignored, so a
#      fresh clone has none and a pull that moved a `.ws` file leaves a stale one. Neither state
#      fails a test — `make test-app` passes happily against a stale client, because Vitest only
#      typechecks what it imports — but `tsc -b` in `make build`/CI fails on the real contract.
#      That gap is why a green local run can be followed by a red CI build. See docs/demo/README.md
#      for the same class of failure hitting a mocked backend.
#   3. Which optional toolchains do I have, for the workflows that need them (e2e, demo recording)?
#
# Exits non-zero only when something REQUIRED is missing, so it is safe in a pre-flight chain.
# Optional gaps print a hint and pass.
set -uo pipefail

cd "$(dirname "$0")/.."

RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; DIM=$'\033[2m'; OFF=$'\033[0m'
[ -t 1 ] || { RED=''; GREEN=''; YELLOW=''; DIM=''; OFF=''; }

missing=0

ok()   { printf '  %s✓%s %s\n' "$GREEN" "$OFF" "$1"; }
warn() { printf '  %s!%s %s\n' "$YELLOW" "$OFF" "$1"; [ $# -gt 1 ] && printf '      %s%s%s\n' "$DIM" "$2" "$OFF"; return 0; }
fail() { printf '  %s✗%s %s\n' "$RED" "$OFF" "$1"; [ $# -gt 1 ] && printf '      %s%s%s\n' "$DIM" "$2" "$OFF"; missing=1; }

echo
echo "Required"

# Java — the Gradle toolchain pins the version in gradle.properties, so read it rather than
# hardcoding a number that will drift.
want_java=$(sed -n 's/^javaVersion=\([0-9]*\).*/\1/p' gradle.properties)
if command -v java >/dev/null 2>&1; then
  # Not anchored to line 1: a JAVA_TOOL_OPTIONS banner (proxy/truststore setups print one) lands
  # above the version line and would leave this empty.
  have_java=$(java -version 2>&1 | sed -n 's/.* version "\([0-9][0-9]*\).*/\1/p' | head -1)
  if [ "${have_java:-0}" -ge "${want_java:-0}" ] 2>/dev/null; then
    ok "java $have_java (need $want_java+)"
  else
    # Gradle can still resolve a toolchain it downloads itself, so this is a warning, not a stop.
    warn "java $have_java, repo wants $want_java" "Gradle may auto-provision a $want_java toolchain; if the build complains, install JDK $want_java."
  fi
else
  fail "java not found" "Install JDK $want_java (the api module's Gradle toolchain)."
fi

want_node=$(cat .nvmrc 2>/dev/null | tr -d '[:space:]')
if command -v node >/dev/null 2>&1; then
  have_node=$(node --version | tr -d 'v')
  if [ "${have_node%%.*}" = "${want_node%%.*}" ]; then
    ok "node $have_node (.nvmrc pins $want_node)"
  else
    warn "node $have_node, .nvmrc pins $want_node" "Majors differ — 'nvm use' before trusting a local build."
  fi
else
  fail "node not found" "Install node $want_node (see .nvmrc)."
fi

command -v npm >/dev/null 2>&1 && ok "npm $(npm --version)" || fail "npm not found"

if command -v docker >/dev/null 2>&1; then
  if docker info >/dev/null 2>&1; then
    ok "docker (daemon reachable)"
  else
    fail "docker installed but the daemon is not reachable" "Testcontainers (make test-api) and make infra both need it running."
  fi
else
  fail "docker not found" "Needed for make infra and the Testcontainers backend tests."
fi

[ -x ./gradlew ] && ok "gradle wrapper" || fail "./gradlew missing or not executable"

echo
echo "Generated API client"

gen=app/src/shared/api/generated
if [ ! -d "$gen" ]; then
  fail "not generated yet ($gen is gitignored, so a fresh clone has none)" \
       "Run: make wirespec"
else
  # Content hash of the contracts vs the stamp `make wirespec` leaves behind — see
  # scripts/wirespec-stamp.sh for why mtimes cannot answer this.
  ./scripts/wirespec-stamp.sh check
  case $? in
    0) ok "current with api/src/main/wirespec" ;;
    2) warn "generated, but never stamped" \
            "Run: make wirespec   (stamps it, so staleness can be detected from here on)" ;;
    *) fail "stale — the contracts changed since this client was generated" \
            "Run: make wirespec   (a pull or rebase that touched a .ws does this; tsc -b in CI fails on it while make test-app still passes)" ;;
  esac
fi

if [ -d app/node_modules ]; then
  ok "app/node_modules installed"
else
  fail "app/node_modules missing" "Run: cd app && npm ci"
fi

echo
echo "Optional — per workflow"

if [ -d app/node_modules/playwright ] || [ -d app/node_modules/@playwright ]; then
  browsers=$(ls "${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}" 2>/dev/null | grep -c chromium || true)
  if [ "${browsers:-0}" -gt 0 ]; then
    ok "playwright + $browsers chromium build(s)   ${DIM}(make e2e, demo recording)${OFF}"
  else
    warn "playwright installed, no chromium browser found" "Run: cd app && npx playwright install chromium"
  fi
else
  warn "playwright not installed" "Needed for make e2e and demo recording: cd app && npm ci"
fi

if command -v ffmpeg >/dev/null 2>&1 && command -v ffprobe >/dev/null 2>&1; then
  ok "ffmpeg + ffprobe   ${DIM}(demo recording — see docs/demo/README.md)${OFF}"
else
  warn "ffmpeg/ffprobe not found" "Only needed to transcode a demo recording: apt-get install ffmpeg (or brew install ffmpeg)."
fi

echo
if [ "$missing" -ne 0 ]; then
  printf '%sSomething required is missing or stale — see ✗ above.%s\n\n' "$RED" "$OFF"
  exit 1
fi
printf '%sReady.%s\n\n' "$GREEN" "$OFF"
