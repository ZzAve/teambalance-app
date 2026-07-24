# API Startup-Time Optimization Plan

**Goal:** Cut the `api/` Spring Boot cold-start (`Started TeamBalanceApplication in …`)
from ~40s to **under 10s** on the production 1-vCPU Scaleway Serverless Container —
ideally toward 5s — **on the JVM**, without a GraalVM native image. Native image and
in-process→out-of-process Flyway decoupling are held as explicitly deferred escape hatches.

**Status:** Phases 0, 1, and 3 implemented (code landed on `claude/startup-time-optimization-39nsfc`;
prod before/after numbers pending a redeploy). Phase 2 (AOT + CDS) is owned by a parallel effort and
untouched here. Phase 4 remains a deferred escape hatch.

---

## Diagnosis (evidence-based, agreed)

Measured on prod (`SPRING_PROFILES_ACTIVE=prod`, 1 vCPU, no CPU boost, **warm DB still ~40s**),
from container logs. The 40s is **classload/bootstrap-bound on one core — not I/O waiting on
migrations**.

Attributed timeline (UTC stamps from a real boot):

| Phase | Window | Duration | Nature |
|---|---|---|---|
| JVM launch → `Starting …` | 55.7 → 56.6 | ~0.9s | JVM |
| profile active → **silent gap** → first repo line | 56.66 → 07.27 | **~10.6s** | component scan + auto-config condition eval + fat-jar nested classloading, serialized on 1 core (**pre-DB**) |
| Spring Data JPA scan (8 repos) | 07.27 → 08.28 | ~1.0s | classloading |
| Spring Data **Redis** bootstrap → "Found **0** Redis repository interfaces" | 08.60 → 08.78 | waste | dead classpath weight forces "multiple-modules strict mode" |
| Web context `initialization completed in 15705 ms` | @12.87 | 15.7s cum. | — |
| Hibernate ORM 7.2.7 init → PersistenceUnitInfo | 14.17 → … | few s | classloading + metamodel |
| **HikariPool start** (warm DB) | 17.90 → 22.98 | **~5.1s** | **I/O** — almost certainly Serverless-SQL cold resume (a redeploy after minutes-idle = asleep DB); CDS/AOT cannot touch this |
| Hibernate metamodel + tail → `Started` | 23.5 → ~36 | ~13s | classloading + JIT + Tomcat |

**Three fat targets:** (1) the ~10.6s front classload/condition gap, (2) the ~5.1s DB resume on
the critical path, (3) Hibernate metamodel + general tail. Plus dead weight: Redis/Spring-Session
on the classpath (zero references in `api/src/main`).

**Why <10s (not a guaranteed 5s) on the JVM:** 5s is reachable only if we both cut JVM
classload/bootstrap work (CDS + Spring-AOT) **and** stop paying the ~5s DB resume serially. On
1 vCPU, <10s is the honest committed bar; 5s is the stretch.

## Tech stack

Kotlin 2.3, Spring Boot 4 (Spring Framework 7), JDK 25 (Temurin), Hibernate ORM 7.2, Flyway,
HikariCP, Tomcat 11, Wirespec + Jackson. Runtime: `java -jar app.jar` on `eclipse-temurin:25-jre`,
Scaleway Serverless Container, 1 vCPU. Prod DB: Scaleway Serverless SQL (Postgres 16, scale-to-zero).

---

## Phase 0 — Baseline & proof harness

**Status: IMPLEMENTED** (code landed; prod baseline numbers pending a redeploy). `main()` now builds
an explicit `SpringApplication` with `BufferingApplicationStartup(2048)`, and `startup` is exposed on
the internal actuator base path in the base config. Note: `InternalEndpointGuardFilter` 403s
everything under `/internal/` except `/internal/actuator/health` in prod, and `application-prod.yml`
narrows exposure to `health` only — so `/internal/actuator/startup` is a local/dev tool; the
canonical prod metric stays the `Started … in X seconds` log line.

**Files:** `api/src/main/kotlin/.../TeamBalanceApplication.kt`, `application.yml`

- Register `BufferingApplicationStartup` on the `SpringApplication` and expose
  `startup` on the internal actuator base path (`/internal/actuator/startup`) so we get a
  machine-readable per-step timing tree, not just eyeballed log stamps.
- Define the canonical metric: the Spring `Started … in X seconds` line, captured from a **cold
  container** (fresh instance), recorded **warm-DB and cold-DB separately**, N≥3 runs, report
  median + worst.

**Target:** a repeatable measurement + a per-step attribution export. This is the scoreboard every
later phase is judged against.
**Proof:** baseline table committed to this doc under "Results".

## Phase 1 — Classpath & config hygiene (low risk, no build change)

**Status: IMPLEMENTED** (code landed; prod numbers pending a redeploy). Removed
`spring-boot-starter-data-redis` + `spring-session-data-redis` and every dead Redis property
(`management.health.redis` in prod, `spring.data.redis` in dev/e2e); added
`spring.data.jpa.repositories.bootstrap-mode: deferred`; added `-XX:+UseSerialGC
-XX:TieredStopAtLevel=1` to the Dockerfile ENTRYPOINT.

**Files:** `api/build.gradle.kts`, `application.yml`, `application-prod.yml`, `api/Dockerfile`

- Remove `spring-boot-starter-data-redis` and `spring-session-data-redis` (no main-code refs).
  Eliminates "multiple-modules strict mode" + the Redis repo bootstrap + Redis auto-config, and
  lets us delete the now-moot `management.health.redis.enabled: false` in `application-prod.yml`.
- `spring.data.jpa.repositories.bootstrap-mode: deferred` — initialize JPA repositories on a
  background thread rather than on the boot critical path.
- JVM flags tuned for a single core, via `JAVA_TOOL_OPTIONS`/`ENTRYPOINT` in the Dockerfile:
  `-XX:+UseSerialGC` (no multi-threaded GC to spin up on 1 vCPU) and `-XX:TieredStopAtLevel=1`
  (C1-only JIT — cheaper warmup, negligible peak-throughput loss for this workload).

**Target:** shave a few seconds, remove the Redis strict-mode tax and log noise.
**Proof:** re-measure vs Phase 0 baseline; confirm the Redis log lines and "multiple modules" line
are gone; full test suite (`make test`) green.

## Phase 2 — AppCDS + Spring AOT (the big JVM lever)

**Files:** `api/build.gradle.kts`, `api/Dockerfile`

- Enable Spring AOT: wire the Boot `processAot` task and run the app with
  `-Dspring.aot.enabled=true`. **Gotcha:** AOT fixes the bean set for a chosen profile at build
  time — the `@Profile("prod")` `ScalewayTemEmailSender` must be AOT-processed under the `prod`
  profile (run `processAot` with `spring.profiles.active=prod`), or its bean definition won't be
  generated. Verify the prod bean graph post-AOT.
- Bake an AppCDS archive at image-build time (Spring training run, e.g.
  `-Dspring.context.exit=onRefresh -XX:ArchiveClassesAtExit=app.jsa`), then run with
  `-XX:SharedArchiveFile=app.jsa`. The training run touches the DB during refresh; use a throwaway
  Postgres in the build stage, or fall back to a classload-only archive that still covers the
  pre-DB ~10.6s gap. On JDK 25, evaluate the newer Leyden AOT-cache workflow
  (`-XX:AOTCache`, JEP 483) as an alternative/superset.
- Multi-stage Dockerfile: add a training/bake step; ship the archive + AOT jar in the runtime image.

**Target:** 30–45% off the JVM (classload + condition-eval + Hibernate init) portion → roughly
3–6s of JVM boot.
**Proof:** re-measure; `make test` + a real container boot green; verify AOT prod bean graph.

## Phase 3 — Parallel DB warm-up on boot (overlap, don't decouple)

**Status: IMPLEMENTED** (code landed; cold-DB numbers pending a redeploy). `DatabaseWarmupListener`
(new, registered on the `SpringApplication`) fires on `ApplicationEnvironmentPreparedEvent`, and —
prod profile only — spawns a daemon `db-warmup` thread that opens/validates/closes one throwaway
JDBC connection. Fire-and-forget: never blocks boot, swallows failures to a warning.

**Files:** new `…/infrastructure/startup/DatabaseWarmupListener.kt` (or `spring.factories` listener)

- On `ApplicationEnvironmentPreparedEvent` (fires ~10s before Hikari starts), read
  `spring.datasource.url/username/password` from the bound `Environment` and spawn a **daemon
  thread** that opens then immediately closes one throwaway JDBC connection — kicking the
  Serverless-SQL resume **in parallel with** the ~10.6s classload gap that runs anyway.
  Fire-and-forget; swallow/log errors; never block boot.
- By the time HikariPool starts (~15s in), the DB is already awake → the ~5s resume no longer
  sits serially on the critical path.

**Target:** remove the ~5s DB-resume floor from the boot path.
**Proof:** re-measure cold-DB boot specifically; the HikariPool `Starting…→Start completed` gap
should collapse toward warm-connection latency.

## Phase 4 — Deferred escape hatches (only if still short)

- **GraalVM native image** — guaranteed sub-second, but signs us up for reflection/resource hints
  (Hibernate, Flyway, Postgres driver, Wirespec, Jackson), multi-minute native compiles in CI, and
  Testcontainers ITs staying JVM-only. **Trigger:** only if the JVM path cannot break 10s.
- **Out-of-process Flyway** — run migrations as a separate deploy step (`spring.flyway.enabled=false`
  in the serving container) + lazy datasource. Considered later; not needed if Phase 3 overlap works.
- **CRaC** — almost certainly blocked: Scaleway Serverless Containers won't grant the CRIU
  privileges a checkpoint/restore needs. Noted, not pursued.
- **`min-instances=1`** — zero-risk fallback that eliminates cold start entirely at the cost of one
  always-on container. Kept in reserve if we stall above target.

---

## Results

_(populated as phases land — baseline first)_

## Deviations

- **Phase 3 uses parallel warm-up, not Flyway decoupling.** The DB-resume cost is removed from the
  critical path by *overlapping* the Serverless-SQL resume with the classload gap (a daemon warm-up
  connection), not by moving migrations out-of-process (that stays a Phase-4 escape hatch). The
  serving container still runs Flyway in-process.
- **Prod before/after measurement must be done on redeploy.** Cold-start timing is inherently a
  property of a fresh 1-vCPU Scaleway container hitting the scale-to-zero DB; it cannot be measured
  from CI or a local dev box. The `Started … in X seconds` log line (N≥3 cold containers, warm-DB
  and cold-DB separately) is captured after the next prod deploy and recorded under "Results".
