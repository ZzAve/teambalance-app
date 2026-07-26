# Deploy runbook (manual, gated)

Production deploys are **manual and deliberate**, and now live **inside CI**
(`.github/workflows/ci.yml`) rather than a separate workflow. There is no auto-deploy:
the `deploy-api` / `deploy-frontend` jobs run only on a push to `main` or a `deploy*`
branch, only after `build` is green, and each **pauses for a one-click approval** via the
`production` GitHub Environment. They deploy the exact commit CI just validated
(image tag = commit SHA — no drift between what was tested and what ships).

## One-time setup (REQUIRED — this *is* the manual gate)

Settings → **Environments** → **New environment** named `production`:

1. Add a **Required reviewer** (yourself / the release owner). **This is the gate.**
   Without it the deploy jobs run immediately with no approval — i.e. every push to
   `main` would auto-deploy.
2. *(Optional)* Restrict **Deployment branches** to `main` and `deploy*` — the workflow
   `if:` already enforces this, so it's belt-and-suspenders.

## Trigger a deploy

1. Push to `main` (normal merge) or to a `deploy*` branch.
2. CI runs `build` (lint + all tests + real e2e). If green, `deploy-api` and
   `deploy-frontend` appear as **Pending — waiting for approval**.
3. In the run (or **Deployments** → `production`), click **Review deployments**, pick the
   job(s) to approve, and confirm. Each job is approved independently, so you can ship the
   API without the frontend or vice-versa.

There is no `dry_run` input: **not approving is the dry run.** A default push builds and
tests everything and simply waits — nothing deploys until you approve.

## What each job does

**`deploy-api`** — builds `api/Dockerfile` for **linux/amd64** (the Serverless Container
rejects other arches), pushes to `rg.fr-par.scw.cloud/teambalance/api:<sha>`, and does an
**image-only** update of Serverless Container `ec9dfda3-…` (fr-par). The container's
cpu/memory/sandbox and its env/secret maps are left untouched — those are managed manually
in the Scaleway console. The Gradle build runs *inside* the multi-stage image, so the
runner needs no JDK/Gradle.

**`deploy-frontend`** — builds the SPA (`vite build` auto-loads `app/.env.production` →
`VITE_API_URL=https://api.teambalance.nl`), syncs `app/dist` → `s3://teambalance-spa`
(hashed assets `immutable`, `index.html` `no-cache`) and the landing page + design tokens
→ `s3://teambalance-www`, then purges both Edge Services pipelines. S3 uses the **dedicated
Object Storage IAM key** (`SCW_S3_*`).

## Container resource config

The container's **cpu / memory / sandbox** (2 vCPU, 2 GB, gVisor v2) are set **manually in
the Scaleway console**, not by the deploy — the pipeline only updates the image. To A/B the
cold start, change the vCPU in the console (e.g. 4 vCPU) and re-read the `Started … in X
seconds` line. Console fields: CPU in vCPU, memory in MB, sandbox v1/v2.

## Required GitHub Actions secrets

Settings → Secrets and variables → Actions (names only — never commit values):

| Secret | Used for |
|--------|----------|
| `SCW_ACCESS_KEY` | scw CLI auth (container update, Edge purge). |
| `SCW_SECRET_KEY` | scw CLI auth **and** Container Registry `docker login` (user `nologin`). |
| `SCW_DEFAULT_PROJECT_ID` | scw CLI default project (`teambalance`). |
| `SCW_DEFAULT_ORGANIZATION_ID` | scw CLI default organization. |
| `SCW_S3_ACCESS_KEY` | Object Storage sync — dedicated `teambalance-object-storage` IAM key. |
| `SCW_S3_SECRET_KEY` | Object Storage sync — its secret. |

## Rollback

To roll back, re-deploy an earlier good commit: Actions → the CI run for that commit →
**Re-run jobs**, then approve `deploy-api`. The image tag is that commit's SHA, so the old
image is rebuilt/redeployed deterministically. (Old image tags are also retained in the
registry.) Alternatively, revert the offending commit on `main` and approve the new deploy.
