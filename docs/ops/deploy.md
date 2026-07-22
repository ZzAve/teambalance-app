# Deploy runbook (manual)

Production deploys are **manual and deliberate**. There is no auto-deploy on push to
`main`. The `.github/workflows/deploy.yml` workflow codifies the proven by-hand steps
so a human can trigger them reproducibly from the Actions tab.

## Trigger

Actions → **Deploy (manual)** → *Run workflow*. Inputs:

| Input | Default | Meaning |
|-------|---------|---------|
| `target` | `both` | `api`, `frontend`, or `both` — the two jobs are independent. |
| `image_tag` | *(empty)* | API image tag. Empty → the 12-char commit SHA. Use a semantic tag (e.g. `v3`) for release deploys you want to roll back to. |
| `dry_run` | **`true`** | Safety gate. `true` **builds** the artifacts (proving the build) but pushes/deploys/syncs **nothing**. Set to `false` for a real deploy. |

> A default run (dry_run=true) is a no-op deploy: it verifies both builds and prints
> what *would* happen. **A real deploy requires explicitly setting `dry_run: false`.**

## What it does (mirrors the manual process)

**`deploy-api`** — builds `api/Dockerfile` for **linux/amd64** (the Serverless Container
rejects other arches), pushes to `rg.fr-par.scw.cloud/teambalance/api:<tag>`, then updates
Serverless Container `ec9dfda3-65ca-4901-a640-895fd2f9f5f3` (fr-par) to that image. The
Gradle build (buildSrc + Java 25 toolchain) runs *inside* the multi-stage image, so the
runner needs no JDK/Gradle. An **image-only** container update leaves the container's
environment and secret maps untouched — only the map you pass is replaced.

**`deploy-frontend`** — builds the SPA (`vite build` auto-loads `app/.env.production` →
`VITE_API_URL=https://api.teambalance.nl`), syncs `app/dist` → `s3://teambalance-spa`
(hashed assets `immutable`, `index.html` `no-cache`) and the landing page + design tokens
→ `s3://teambalance-www`, then purges both Edge Services pipelines. S3 uses the **dedicated
Object Storage IAM key** (`SCW_S3_*`), because buckets live in the API key's own default
project and only that key's project is `teambalance`.

## Required GitHub Actions secrets

Set these in **Settings → Secrets and variables → Actions** (names only — never commit values):

| Secret | Used for |
|--------|----------|
| `SCW_ACCESS_KEY` | scw CLI auth (container update, Edge purge). |
| `SCW_SECRET_KEY` | scw CLI auth **and** Container Registry `docker login` (user `nologin`). |
| `SCW_DEFAULT_PROJECT_ID` | scw CLI default project (`teambalance`, `5eb5484d-…`). |
| `SCW_DEFAULT_ORGANIZATION_ID` | scw CLI default organization. |
| `SCW_S3_ACCESS_KEY` | Object Storage sync — dedicated `teambalance-object-storage` IAM key. |
| `SCW_S3_SECRET_KEY` | Object Storage sync — its secret. |

The first four may be a general Scaleway key with Registry + Serverless Containers +
Edge Services rights. The `SCW_S3_*` pair must be the dedicated Object-Storage key whose
default project is `teambalance` (see the frontend-deploy notes).

## Rollback

Re-run with `target: api`, `image_tag:` set to a previously deployed tag (e.g. `v1`),
`dry_run: false`. Old image tags are retained in the registry for exactly this.

## Notes / hardening ideas

- The `v*` git-tag trigger was intentionally **omitted** to keep deploy strictly a
  deliberate `workflow_dispatch` action. Add it later if release-tag = deploy is wanted.
- For an extra approval gate, attach the jobs to a protected GitHub `environment`.
