# Deploy runbook (manual, gated)

Production deploys are **manual and deliberate**, and now live **inside CI**
(`.github/workflows/ci.yml`) rather than a separate workflow. There is no auto-deploy:
the `deploy-api` / `deploy-frontend` jobs run only on a push to `main` or a `deploy*`
branch, only after `build` is green, and each **pauses for a one-click approval** via the
`production` GitHub Environment. They deploy the exact commit CI just validated
(image tag = commit SHA — no drift between what was tested and what ships).

The approval itself is waited for by a separate one-step job per side — `approve-api` /
`approve-frontend` — and `deploy-api` / `deploy-frontend` only start once their gate is
approved. See *Superseding an unapproved deploy* below for why.

## One-time setup (REQUIRED — this *is* the manual gate)

Settings → **Environments** → **New environment** named `production`:

1. Add a **Required reviewer** (yourself / the release owner). **This is the gate.**
   Without it the deploy jobs run immediately with no approval — i.e. every push to
   `main` would auto-deploy.
2. *(Optional)* Restrict **Deployment branches** to `main` and `deploy*` — the workflow
   `if:` already enforces this, so it's belt-and-suspenders.

## Trigger a deploy

1. Push to `main` (normal merge) or to a `deploy*` branch.
2. CI runs `build` (lint + all tests + real e2e). If green, `approve-api` and
   `approve-frontend` appear as **Pending — waiting for approval**.
3. In the run (or **Deployments** → `production`), click **Review deployments**, pick the
   job(s) to approve, and confirm. Each job is approved independently, so you can ship the
   API without the frontend or vice-versa. Approving releases the gate; the `deploy-*` job
   behind it then runs unattended.

There is no `dry_run` input: **not approving is the dry run.** A default push builds and
tests everything and simply waits — nothing deploys until you approve.

> **Caveat.** Because the `production` environment is bound to the *gate* job, **Deployments**
> → `production` flips to green the moment you approve, not when the rollout is verified. The
> `deploy-*` job's own red/green in the Actions run is the truth.

## Superseding an unapproved deploy

A gate waiting for approval holds its concurrency group, so an obsolete pending deploy used to
park the next push behind it: you had to approve or reject yesterday's commit before today's
could even ask. It no longer does.

- **Push to `main` while an older commit still sits unapproved** → the old `approve-*` job is
  **cancelled** (`cancel-in-progress: true`) and the new commit asks for approval instead.
  Nothing to reject by hand. The old run shows the gate as *cancelled* — expected, not a failure.
- **Push while an approved deploy is mid-rollout** → the rollout is **never** interrupted. The
  `deploy-*` jobs are `cancel-in-progress: false` on their own group, so the new deploy simply
  queues behind it and starts when it finishes.

That is the whole reason the wait and the work are two jobs: only the wait is disposable.

## What each job does

**`image`** — runs on every CI run, PRs included. Builds `api/Dockerfile` for **linux/amd64**
(the Serverless Container rejects other arches) twice, `--target prod` and `--target stg`, and
pushes `rg.fr-par.scw.cloud/teambalance/api:<sha>` and `…/api-stg:<sha>`. The stg image also gets
a `…/api-stg:head-<head sha>` tag: on a PR, `<sha>` is GitHub's temporary merge commit, so the stg
deploy looks the image up by the branch head instead. The two targets share
every stage except the last, so the second build reuses the first one's layers. The Gradle build
runs *inside* the multi-stage image, so the runner needs no JDK/Gradle. The build bakes the commit
SHA into the image (`--build-arg GIT_SHA`), surfaced at runtime on `/internal/actuator/info`
(`info.build.sha`). The build also resolves the bunq SDK from JitPack (`https://jitpack.io`, only for
that group): a JitPack outage fails the image build, not the running app.

**`deploy-api`** — after the `production` approval, does an **image-only** update of Serverless
Container `ec9dfda3-…` (fr-par) to the `api:<sha>` image that `image` pushed. The container's
cpu/memory/sandbox and its env/secret maps are left untouched — those are managed manually
in the Scaleway console. After the prod verify, the same job updates the demo container (see
[Demo](#demo-demoteambalancenl)) to `api-demo:<sha>` and verifies it the same way.

**Post-deploy verification (this is why a bad image now goes red).** `scw container update`
only *registers* the new image and returns immediately — Scaleway rolls it out
asynchronously, so a container that crashes on boot (e.g. a Flyway checksum-validation
failure) would otherwise leave the job **green** while prod keeps serving the old revision.
The final `deploy-api` step (`.github/scripts/await-live-sha.sh`) polls `https://api.teambalance.nl/internal/actuator/info` — gated
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

The container's resource and probe settings are set **manually in the Scaleway console**, not by
the deploy — the pipeline only updates the image, so nothing in the repo keeps these values in
sync. Read the live values with
`scw container container get ec9dfda3-65ca-4901-a640-895fd2f9f5f3 region=fr-par`.

Values as of 2026-10-30:

| Setting | Value | Note |
|---|---|---|
| CPU / memory | 2 vCPU / 2 GB | Set by #98; drifted to 1 vCPU / 1 GB in the console before 2026-08-30 (the audit trail goes back no further) and was restored on 2026-10-30 |
| Sandbox | gVisor v2 | |
| Min / max scale | 0 / 1 | Every wake-up is a cold start |
| Request timeout | 10 s | A request that wakes the container waits for the boot and gets a 504 if the boot takes longer; the instance keeps starting |
| Startup probe | HTTP `/internal/actuator/health`, 25 × 5 s (125 s) | Must stay above the boot time, or the instance is killed during boot |
| Liveness probe | HTTP `/internal/actuator/health`, 30 × 10 s | |

The boot is CPU-bound. `Started … in` is about 28 s on 2 vCPU (process about 30 s) and about
43 s on 1 vCPU (process about 47 s). On 1 vCPU the old startup probe of 10 × 5 s (50 s) killed
instances that were ready (outage of 2026-10-30). When you
change the CPU, re-read the `Started … in X seconds` line and keep the startup probe well above it.
`scw container container update` needs every startup-probe field, not only the changed ones:

```bash
scw container container update ec9dfda3-65ca-4901-a640-895fd2f9f5f3 region=fr-par \
  startup-probe.failure-threshold=25 startup-probe.interval=5s \
  startup-probe.timeout=1s startup-probe.http.path=/internal/actuator/health
```

## Staging API (`api.stg.teambalance.nl`)

A second Serverless Container for experiments (boot-time tuning, later migration checks) that
never touches prod. CI only builds the stg image; deploying it is a separate, on-demand workflow,
`.github/workflows/deploy-stg.yml`, with two triggers:

- **Label:** add `deploy:stg` to a PR. The job removes the label again, so it deploys once; add it
  again to redeploy. Later pushes to the PR do not redeploy.
- **Run workflow:** Actions → *Deploy staging* → **Run workflow**, with a branch name or PR number
  as `target`. From a terminal: `gh workflow run deploy-stg.yml -f target=<branch|PR number>`.

Only the repository owner can trigger it: the job is skipped unless `github.triggering_actor` is
the repository owner, re-runs included. The `staging` environment has no required reviewers, so
nothing waits for approval; it only records the deployment, which the PR shows with a link to stg.

The job resolves the head commit, fails if CI never ran for it (a branch without a PR, and not
`main` or `deploy*`, has no image), and otherwise waits up to 30 minutes for
`api-stg:head-<head sha>` while CI is still building it. It reads the image's build SHA
(`TEAMBALANCE_BUILD_SHA` in the image config), deploys `api-stg:<build sha>` and waits until
`/internal/actuator/info` reports that SHA. It does not wait for the test jobs. Rollouts share the
`deploy-stg-api` concurrency group and run one at a time. PR images built before the `head-` tag
existed have no such tag; push to the PR once to get one.

- **Image:** `api/Dockerfile --target stg` = the prod image (same jar, same AOT cache) plus Postgres
  and `api/stg-entrypoint.sh`. It runs the `prod` profile; the stg differences are environment
  variables baked into the image: `TEAMBALANCE_DEMO_DATA_ENABLED=true` (`DemoDataSeeder` adds the
  demo team *Setpoint VT*), `TEAMBALANCE_EMAIL_SEND=false` (magic links and notifications are
  logged, not sent), and the in-container datasource. Because stg runs the `prod` profile, connecting
  with the `sandbox` Bunq environment is refused there too: only `production` is accepted with
  `TEAMBALANCE_BUNQ_CONNECT_ENABLED=true`.
- **Database:** Postgres runs inside the container on its temporary disk. Every cold start begins
  empty: Flyway builds the schema from V001. Nothing persists across scale-to-zero or a redeploy.
- **Container:** same size as prod (2 vCPU / 2 GB, sandbox v2, min-scale 0). **max-scale must stay
  1**: each instance has its own database, so a second instance would not know the first one's
  logins or data. Env:
  `PLATFORM_ADMIN_EMAILS`; secret env: `INVITATION_TOKEN_SALT`, `INVITATION_TOKEN_ENCRYPTION_KEY`,
  `TEAMBALANCE_CALENDAR_LINK_SALT`, `TEAMBALANCE_CALENDAR_LINK_ENCRYPTION_KEY`,
  `TEAMBALANCE_BUNQ_TOKEN_ENCRYPTION_KEY`, `INTERNAL_API_KEY` (values unique to stg; the last one
  equals the GitHub secret `STG_INTERNAL_API_KEY`).
- **Boot numbers:** Postgres in the same gVisor sandbox costs boot time and memory, so the stg
  `Started … in X seconds` line does not equal prod's. The `Startup benchmark:` line still compares.
- **Log in:** request a magic link for a demo member (e.g. `jan@example.com`) and copy the token
  from the `Magic link for …` line in the container logs (Cockpit).

## Demo (`demo.teambalance.nl`)

A third Serverless Container, `api-demo` (`26261720-f1a3-4b35-930b-bf960855a360`, fr-par, ID in
`DEMO_CONTAINER_ID` in `ci.yml`), serves the demo team and the SPA from one host
([ADR-0043](../adr/0043-demo-team-runs-in-its-own-container.md)).

- **Image:** `api/Dockerfile --target demo` = the stg image plus the SPA built in demo mode
  (`make demo-spa` → `app/dist-demo`). Pushed by the `image` job as `rg.fr-par.scw.cloud/teambalance/api-demo:<sha>`.
- **Deploy:** the `deploy-api` job (after the `production` approval) updates the demo container to
  `api-demo:<sha>` after prod's verify step, then runs `await-live-sha.sh` against
  `https://demo.teambalance.nl` with `DEMO_INTERNAL_API_KEY`. The script polls for 6 minutes and each
  request waits up to 10 s, so the first requests wake the container and later ones wait out the
  boot (about 50 s).
- **Container:** 1000 mvCPU / 1 GB, sandbox v2, min/max scale 0 / 1 (**max 1**: each instance has
  its own database), request timeout 60 s, startup probe 40 × 5 s. Custom domain
  `demo.teambalance.nl`. Env/secret maps are set by hand like prod's; `INTERNAL_API_KEY` equals the
  GitHub secret `DEMO_INTERNAL_API_KEY`. The deploy only changes the image.
  `scw container container update` takes the memory limit with a unit, e.g. `memory-limit-bytes=1GB`,
  not a byte count.
- **Env baked into the image:** `TEAMBALANCE_DEMO_ENABLED=true`, `TEAMBALANCE_DEMO_DATA_ENABLED=false`,
  `TEAMBALANCE_PASSKEYS_ENABLED=false`, `TEAMBALANCE_BUNQ_ENVIRONMENT=fake`,
  `TEAMBALANCE_EMAIL_SEND=false`, `TEAMBALANCE_SPA_STATIC_LOCATION=file:/app/static/`,
  session timeouts 4 h, `TEAMBALANCE_CSRF_COOKIE_NAME=DEMO-XSRF-TOKEN`,
  `TEAMBALANCE_API_BASE_URL` / `TEAMBALANCE_FRONTEND_BASE_URL` / `TEAMBALANCE_CORS_ALLOWED_ORIGINS`
  = `https://demo.teambalance.nl`. The app refuses to start unless email sending is off, the Bunq
  environment is `fake` and the datasource is loopback.
- **Reset:** the demo team is rebuilt hourly (`teambalance.demo.reset-after`, default `1h`). The
  database lives in the container, so a cold start also begins empty.
- **Log in:** open `https://demo.teambalance.nl/demo` and pick a member; no magic link. The
  landing page links there.
- **Cost:** €0.0432 per awake hour at 1 vCPU / 1 GB; nothing while scaled to zero.

## Container Registry retention

CI pushes `api:<sha>`, `api-stg:<sha>` and `api-stg:head-<head sha>` on every run, so
`.github/workflows/registry-cleanup.yml` deletes old tags every night: a tag whose commit is on
`main` after **90 days**, any other tag (PR, `deploy*` branch, `head-*`, hand-pushed) after **7
days**. A tag that a Serverless Container currently runs is never deleted, since Scaleway pulls the
image again on a cold start. To preview, run the workflow by hand (`dry_run` is on by default), or
locally: `DRY_RUN=1 .github/scripts/registry-cleanup.sh`.
Rolling back to an image older than its retention means rebuilding it from that commit.

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
| `STG_INTERNAL_API_KEY` | The same, for the stg container. |
| `DEMO_INTERNAL_API_KEY` | The same, for the demo container (must equal its `INTERNAL_API_KEY` env). |
| `BUGSINK_AUTH_TOKEN` | Bugsink auth token for the SPA source map upload in `deploy-frontend`. Unset: the upload is skipped. See "Errors to Bugsink". |

Repository **variables** (same page, *Variables* tab; not secret):

| Variable | Used for |
|----------|----------|
| `BUGSINK_SPA_DSN` | The DSN of the Bugsink `teambalance-app` project, built into the prod SPA as `VITE_BUGSINK_DSN`. Unset: the SPA reports nothing. |
| `BUGSINK_URL` | The base URL of the Bugsink instance (`https://<host>/`), for the source map upload. |

> **`INTERNAL_API_KEY` must be set in two places with the same value:** as the GitHub Actions
> secret above **and** as an env/secret on the Serverless Container (Scaleway console → the
> container's env variables — same place the other runtime secrets live). Without it on the
> container, the guard fail-closes and the verify step can never read `info` → the deploy goes
> red. Generate one with e.g. `openssl rand -hex 32`. It gates the non-health `/internal`
> actuator surface (`info`/`metrics`); health stays public for Scaleway's probe.

## Bunq container env (set by hand in the Scaleway console; names only, no values)

The deploy never touches the container's env/secret maps, so these are set manually.

| Variable | Value |
|----------|-------|
| `TEAMBALANCE_BUNQ_ENVIRONMENT` | Unset or `none` (no Bunq: every Bunq call fails), `sandbox` or `production` (real adapter), `fake` (fake Bunq; startup refuses it in prod unless `TEAMBALANCE_DEMO_ENABLED=true`, only the demo container sets both). **Must not be empty**; an empty or unknown value fails startup. |
| `TEAMBALANCE_BUNQ_CLIENT_ID` | The Bunq OAuth client id. Blank with `sandbox`/`production` fails startup. |
| `TEAMBALANCE_BUNQ_CLIENT_SECRET` | The Bunq OAuth client secret (a secret env). Blank with `sandbox`/`production` fails startup. |
| `TEAMBALANCE_BUNQ_CONNECT_ENABLED` | Keep `false` (or unset) until Bunq reads and OAuth are verified for production and the production OAuth client exists. In prod, startup refuses `true` unless `TEAMBALANCE_BUNQ_ENVIRONMENT` is `production` (trimmed, case-insensitive); the refusal message names both variables. Set it last, after the environment and credentials are deployed and the app is healthy with connecting off. |
| `TEAMBALANCE_BUNQ_TOKEN_ENCRYPTION_KEY` | Required in every environment (base64, 32 bytes); fails startup when missing. |

The startup log says which gateway was wired (`Bunq gateway: real adapter, environment …` or
`unconfigured`). **Rollback:** set `TEAMBALANCE_BUNQ_CONNECT_ENABLED` to `false` (or remove it),
then set `TEAMBALANCE_BUNQ_ENVIRONMENT` to `none` (or remove it) and restart; the container then
runs as before the real adapter existed. With connecting still on, `none` fails startup in prod.

## Metrics to Scaleway Cockpit (set by hand in the Scaleway console)

The API pushes its Micrometer metrics over OTLP/HTTP to a Cockpit metrics data source, once a
minute. The push is off unless the container's env switches it on, so a container without these
variables runs as before.

| Variable | Value |
|----------|-------|
| `MANAGEMENT_OTLP_METRICS_EXPORT_ENABLED` | `true` to push. Unset or `false`: no push. |
| `MANAGEMENT_OTLP_METRICS_EXPORT_URL` | The data source's push URL plus `/otlp/v1/metrics`, e.g. `https://<data source id>.metrics.cockpit.fr-par.scw.cloud/otlp/v1/metrics`. |
| `SCALEWAY_COCKPIT_METRICS_TOKEN` | A Cockpit token with the *push metrics* permission, in the same region (a secret env). Sent as the `X-Token` header. |
| `OTEL_RESOURCE_ATTRIBUTES` | `deployment.environment.name=prod` (or `stg`, `demo`). The three containers run the same `prod` profile; this attribute tells their metrics apart. |

What to look for in Cockpit's Grafana:

- **Endpoint metrics:** `http_server_requests_milliseconds` (count, sum and buckets), with the
  labels `uri` (the route template), `method`, `status`, `outcome` and `exception`. Throughput is
  the rate of `_count`, latency comes from `_bucket` (50, 100, 250, 500, 1000 and 2500 ms; set in
  `application.yml`). These names are what the local Grafana shows; Cockpit's may differ a little.
- **Also pushed:** JVM, Hikari pool and Tomcat metrics.
- **Cost:** custom metrics are billed per million samples. Check the Cockpit usage page after the
  first days.

**Local check:** `docker compose --profile observability up -d otel-lgtm`, then run the API with
`MANAGEMENT_OTLP_METRICS_EXPORT_ENABLED=true` and
`MANAGEMENT_OTLP_METRICS_EXPORT_URL=http://localhost:4318/v1/metrics`. Grafana is at
http://localhost:3000 (Explore → Prometheus).

To stop the push, set `MANAGEMENT_OTLP_METRICS_EXPORT_ENABLED=false` (or remove it) and redeploy or
restart the container.

### Traces to Cockpit Tempo

The API traces every request (sampling `1.0`, `application.yml`) and pushes the spans over OTLP/HTTP
to a Cockpit traces data source, in batches every 5 s. The push is on only when the endpoint is set;
without it the app makes no span exporter and pushes nothing. Use a separate traces data source and
a separate token: each token has only the push permission of its own signal, so one can be revoked
without the other.

| Variable | Value |
|----------|-------|
| `MANAGEMENT_OPENTELEMETRY_TRACING_EXPORT_OTLP_ENDPOINT` | The traces data source's push URL plus `/otlp/v1/traces`, e.g. `https://<data source id>.traces.cockpit.fr-par.scw.cloud/otlp/v1/traces`. Unset: no push. |
| `SCALEWAY_COCKPIT_TRACES_TOKEN` | A Cockpit token with the *push traces* permission, in the same region (a secret env). Sent as the `X-Token` header. |

`OTEL_RESOURCE_ATTRIBUTES` (above) also tells the traces of the three containers apart.

What to look for in Cockpit's Grafana (Explore → the traces data source):

- **Request traces:** one root span per request, named `http <method> <route template>`, with the
  attributes `uri`, `method`, `status`, `outcome` and `exception`. Below it are the Spring Security
  spans (`security filterchain before`/`after`, `authorize request`, `secured request`).
- **Log correlation:** each log line of a request shows `[<traceId>-<spanId>]` after the thread name.
  Search Tempo for that trace ID to see the request, or copy a trace ID from Tempo into a log search.
- **Not traced:** the health probe (`/internal/actuator/health`). It is also not in the endpoint
  metrics. `HealthProbeObservationConfiguration` skips it.
- **Also traced:** the hourly match-feed task (`task matchFeedScheduler.checkDueFeeds`), and the
  outgoing HTTP calls to Nevobo and Scaleway TEM.
- **Cost:** custom traces are billed per GB (€0.35/GB at the time of writing; 7 days of retention
  are free). A request makes 5 to 10 spans, about 4 to 8 KB. 1,000 requests a day are about 0.2 GB a
  month. Check the Cockpit usage page after the first days.

**Local check:** with the local Grafana running (above), run the API with
`MANAGEMENT_OPENTELEMETRY_TRACING_EXPORT_OTLP_ENDPOINT=http://localhost:4318/v1/traces`. Grafana →
Explore → Tempo shows the traces.

To stop the push, remove `MANAGEMENT_OPENTELEMETRY_TRACING_EXPORT_OTLP_ENDPOINT` and redeploy or
restart the container.

## Errors to Bugsink

Bugsink (hosted, EU) receives the error events of the API and the SPA through the official Sentry
SDKs. **Only prod sends.** The stg and demo containers get no DSN, and the demo SPA is built without
one. There is one Bugsink project per side, so each has its own DSN and issue list:

| Bugsink project | Sends | Events |
|-----------------|-------|--------|
| `teambalance-api` | the prod API container | Unhandled request exceptions (the 500s), a request with a missing required query parameter (400, reported on purpose: it is a client bug), and every ERROR log line, also from scheduled tasks. A domain exception that maps to a 4xx is not an event. |
| `teambalance-app` | the prod SPA build | Uncaught errors, unhandled promise rejections, and errors caught by `RootErrorBoundary`. |

**Setup (once):**

1. In Bugsink, make the two projects above. Copy each DSN (project → settings).
2. Prod API container (Scaleway console → env variables):

   | Variable | Value |
   |----------|-------|
   | `SENTRY_DSN` | The `teambalance-api` DSN. Unset or empty: the SDK starts disabled and sends nothing. |
   | `SENTRY_ENVIRONMENT` | `prod` (also the default). |

   The release is the image's commit SHA (`TEAMBALANCE_BUILD_SHA`, set by `api/Dockerfile`); nothing
   to set.
3. GitHub: the variables `BUGSINK_SPA_DSN` and `BUGSINK_URL`, and the secret `BUGSINK_AUTH_TOKEN`
   (Bugsink → Tokens, or `bugsink-manage create_auth_token` on a self-hosted instance). See "Required
   GitHub Actions secrets".

**What each event has:**

- `environment` `prod`, and `release` = the commit SHA (the API's and the SPA's are the same value).
- API events: a `trace_id` tag with the OTel trace ID of the request. Search Cockpit Tempo for it to
  see the request. `ErrorReportingConfiguration` adds it. An ERROR log line from a task that is not
  traced has no `trace_id`.
- SPA events: the stack trace mapped to the source. `deploy-frontend` builds with hidden source maps,
  uploads them with `sentry-cli` (matched by debug ID), and deletes them before the bucket sync, so
  no map is public.

**Privacy (what is not in an event):** no member ID, email or name (`setUser` is never called), no IP
address (the SPA tells Bugsink not to infer it), no cookies, no request headers or bodies, no query
strings. The API also drops the request URL, and keeps the event's `transaction` only when it is a
route template; the SPA replaces an invite token in a path with `:token`. Calendar-feed and
magic-link tokens therefore stay out of Bugsink.

**Cost:** the free tier has a monthly event limit. A fault in a loop can use it up fast; mute the
issue in Bugsink if that happens.

**Local check:** run Bugsink in one container:

```bash
docker run -d --name bugsink -e SECRET_KEY=$(openssl rand -hex 32) \
  -e CREATE_SUPERUSER=admin@example.com:admin -e PORT=8000 -p 8000:8000 bugsink/bugsink
```

Log in at http://localhost:8000, make a project, and run the API with `SENTRY_DSN=<its DSN>` and the
`prod` profile (or `--sentry.dsn=<its DSN>` with the `dev` profile), or the SPA dev server with
`VITE_BUGSINK_DSN=<its DSN>`.

To stop the API events, remove `SENTRY_DSN` and redeploy or restart the container. To stop the SPA
events, remove the `BUGSINK_SPA_DSN` variable; the next frontend deploy has no DSN.

## Rollback

To roll back, re-deploy an earlier good commit: Actions → the CI run for that commit →
**Re-run jobs**, then approve the API gate (`approve-api`). The image tag is that commit's
SHA, and re-running all jobs re-runs `image`, so the old image is rebuilt and redeployed. (Main's
image tags stay in the registry for 90 days, see *Container Registry retention*.) Alternatively, revert the offending commit on `main` and approve
the new deploy.
