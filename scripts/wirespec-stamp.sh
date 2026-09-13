#!/usr/bin/env bash
# Is the generated API client current with the Wirespec contracts?
#
#   wirespec-stamp.sh write    record the contracts' hash (run by `make wirespec`)
#   wirespec-stamp.sh check    exit 0 if current, 1 if stale/absent, 2 if never stamped
#
# Why a content hash and not file mtimes: Gradle's wirespec tasks are content-addressed, so a
# `git checkout`/rebase that rewrites a `.ws` file with identical bytes moves its mtime while the
# task stays UP-TO-DATE and regenerates nothing. An mtime check calls that stale and `make wirespec`
# cannot clear it — a warning nobody can act on, which is worse than no warning. A hash of the
# contracts answers the question the build actually asks.
#
# This matters because `app/src/shared/api/generated/` is gitignored: a fresh clone has no client
# at all, and a pull that changed a contract leaves an old one. Neither state fails `make test-app`
# — Vitest typechecks only what a test imports — but `tsc -b` in `make build` and in CI fails on
# the real contract. That asymmetry is how a green local run turns into a red CI build.
set -uo pipefail

cd "$(dirname "$0")/.."

STAMP=app/src/shared/api/generated/.wirespec-stamp
CONTRACTS=api/src/main/wirespec

# Sorted by path so the digest is stable across filesystems, and over content only — never names
# alone — so an edit inside a contract counts.
contracts_hash() {
  find "$CONTRACTS" -name '*.ws' -type f -print0 \
    | sort -z \
    | xargs -0 cat 2>/dev/null \
    | sha256sum \
    | cut -d' ' -f1
}

case "${1:-check}" in
  write)
    [ -d app/src/shared/api/generated ] || { echo "wirespec-stamp: nothing generated yet" >&2; exit 1; }
    contracts_hash > "$STAMP"
    ;;
  check)
    [ -d app/src/shared/api/generated ] || exit 1
    [ -f "$STAMP" ] || exit 2
    [ "$(cat "$STAMP")" = "$(contracts_hash)" ] || exit 1
    ;;
  *)
    echo "usage: $0 [write|check]" >&2; exit 64
    ;;
esac
