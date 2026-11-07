#!/usr/bin/env bash
# Usage: registry-cleanup.sh   (env: SCW_DEFAULT_REGION; DRY_RUN=1 prints the decisions and deletes nothing)
#
# Deletes old tags of the API images in the `teambalance` registry namespace. CI pushes `api:<sha>` and
# `api-stg:<sha>` on every run, so without this the registry only grows. A tag whose commit is on
# origin/main is kept 90 days, any other tag (PR, deploy* branch, hand-pushed) 7 days. The repo
# squash-merges, so a PR's commit never lands on main. A tag that a Serverless Container runs is
# always kept: Scaleway pulls the image again on a cold start. Needs full git history (fetch-depth: 0).
set -euo pipefail
region="${SCW_DEFAULT_REGION:-fr-par}"
dry_run="${DRY_RUN:-0}"

in_use="$(scw container container list region="$region" -o json | jq -r '.[] | .image // .registry_image // empty')"
# Fail safe: an empty list (e.g. a renamed field) must stop the run, not let it delete a running image.
[ -n "$in_use" ] || { echo "::error::found no image in use by any container; deleting nothing"; exit 1; }
namespace_id="$(scw registry namespace list name=teambalance region="$region" -o json | jq -r '.[0].id')"

scw registry image list namespace-id="$namespace_id" region="$region" -o json |
  jq -r '.[] | select(.name == "api" or .name == "api-stg") | "\(.id) \(.name)"' |
  while read -r image_id image_name; do
    scw registry tag list image-id="$image_id" region="$region" -o json |
      jq -r '.[] | "\(.id) \(.name) \((now - (.created_at | sub("\\.[0-9]+"; "") | fromdateiso8601)) / 86400 | floor)"' |
      while read -r tag_id tag_name age_days; do
        ref="rg.${region}.scw.cloud/teambalance/${image_name}:${tag_name}"
        keep_days=7
        if commit="$(git rev-parse --verify -q "${tag_name}^{commit}")" &&
          git merge-base --is-ancestor "$commit" origin/main; then
          keep_days=90
        fi
        if grep -qxF "$ref" <<<"$in_use"; then
          echo "keep   ${image_name}:${tag_name} (${age_days}d, running)"
        elif [ "$age_days" -lt "$keep_days" ]; then
          echo "keep   ${image_name}:${tag_name} (${age_days}d < ${keep_days}d)"
        else
          echo "delete ${image_name}:${tag_name} (${age_days}d >= ${keep_days}d)"
          [ "$dry_run" = 1 ] || scw registry tag delete "$tag_id" region="$region" >/dev/null
        fi
      done
  done
