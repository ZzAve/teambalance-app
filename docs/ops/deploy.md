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
runner needs no JDK/Gradle. The build bakes the commit SHA into the image (`--build-arg
GIT_SHA`), surfaced at runtime on `/internal/actuator/info` (`info.build.sha`).

**Post-deploy verification (this is why a bad image now goes red).** `scw container update`
only *registers* the new image and returns immediately — Scaleway rolls it out
asynchronously, so a container that crashes on boot (e.g. a Flyway checksum-validation
failure) would otherwise leave the job **green** while prod keeps serving the old revision.
The final `deploy-api` step polls `https://api.teambalance.nl/internal/actuator/info` — gated
by the internal API key, so the SHA is never public — until it reports the exact SHA just
pushed, and **fails the job (red) if the new version isn't live within ~6 min**. This proves
the new image is actually up regardless of *why* an unhealthy one would fail to boot. On a red
verify: check **Scaleway Cockpit** container logs for the boot crash, fix forward or roll back
(below).

**`deploy-frontend`** — builds the SPA (`vite build` auto-loads `app/.env.production` →
`VITE_API_URL=https://api.teambalance.nl`), syncs `app/dist` → `s3://teambalance-spa`
(hashed assets `immutable` and **retained across deploys — no `--delete`**, see *Object Storage
lifecycle* below; `index.html` `no-cache`, and the PWA shell: icons cached a day,
`sw.js` / `registerSW.js` / `manifest.webmanifest` `no-cache` so an installed client is never
pinned to a previous deploy's precache) and the landing page + design tokens
→ `s3://teambalance-www` (`index.html` **and** its unhashed `style.css` / `tokens.css` all
`no-cache`, so the root-referenced CSS revalidates in lockstep with the HTML and can't be served
stale), then purges both Edge Services pipelines. S3 uses the **dedicated
Object Storage IAM key** (`SCW_S3_*`).

## Container resource config

The container's **cpu / memory / sandbox** (2 vCPU, 2 GB, gVisor v2) are set **manually in
the Scaleway console**, not by the deploy — the pipeline only updates the image. To A/B the
cold start, change the vCPU in the console (e.g. 4 vCPU) and re-read the `Started … in X
seconds` line. Console fields: CPU in vCPU, memory in MB, sandbox v1/v2.

## Object Storage lifecycle (assets retention — console/IaC, not in-repo)

The `assets/` sync intentionally runs **without `--delete`**: content-hashed chunks from the
*previous* deploy must survive, because a client still on the old shell (a long-open tab, the
installed PWA, or a stale service-worker precache) keeps requesting those old hashes. Pruning
them the instant a new deploy lands 404s those clients into a blank screen. Because the chunks
are content-addressed and `immutable`, re-uploading unchanged hashes is a harmless no-op and
stale hashes never collide — so retaining them costs only storage, which a lifecycle rule
reclaims.

**Required rule — apply once, in the Scaleway console (Object Storage → `teambalance-spa` →
Lifecycle rules) or via IaC.** This is **not** in this repo (bucket config lives outside the
codebase) and must be set by someone with console access:

- **Prefix:** `assets/`
- **Action:** expire (delete) objects **90 days** after last modification.

**Why 90 days.** It comfortably outlives how long any client realistically stays on a stale
shell, and it stays safe once the app is stable and deploys are infrequent: a low deploy cadence
means an old-but-still-referenced hash may need to survive a long gap between releases, so the
retention window must exceed that gap. A shorter window (e.g. 30 days) is only safe during heavy
development, where a fresh build lands often and no hash stays referenced for long. Leave it at 90
unless the deploy cadence changes.

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
| `INTERNAL_API_KEY` | Post-deploy verify — sent as `X-Internal-Api-Key` to read `/internal/actuator/info`. **Must equal the container's `INTERNAL_API_KEY` env** (see below). |

> **`INTERNAL_API_KEY` must be set in two places with the same value:** as the GitHub Actions
> secret above **and** as an env/secret on the Serverless Container (Scaleway console → the
> container's env variables — same place the other runtime secrets live). Without it on the
> container, the guard fail-closes and the verify step can never read `info` → the deploy goes
> red. Generate one with e.g. `openssl rand -hex 32`. It gates the non-health `/internal`
> actuator surface (`info`/`metrics`); health stays public for Scaleway's probe.

## Rollback

To roll back, re-deploy an earlier good commit: Actions → the CI run for that commit →
**Re-run jobs**, then approve `deploy-api`. The image tag is that commit's SHA, so the old
image is rebuilt/redeployed deterministically. (Old image tags are also retained in the
registry.) Alternatively, revert the offending commit on `main` and approve the new deploy.
