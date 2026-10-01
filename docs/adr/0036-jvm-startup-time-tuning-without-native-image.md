# ADR-0036: Cut API cold start on the JVM — classpath and config trimming, Spring AOT with an AOT cache, and a parallel DB warm-up

- Status: Accepted
- Date: 2026-07-24
- Recorded 2026-09-29 from the implementation plan (docs/plans, local only).
- Relates to: [ADR-0022](0022-jdbc-backed-shared-sessions-survive-restart.md) (sessions in Postgres, no Redis),
  [ADR-0037](0037-in-memory-rate-limiting-defer-redis.md) (Redis stays un-wired)

## Context

The API runs on a Scaleway Serverless Container with 1 vCPU and scales to zero, against Scaleway
Serverless SQL (Postgres 16), which also scales to zero. Every deploy and every wake-up is a cold
start. Measured on prod (profile `prod`, 1 vCPU, no CPU boost, DB already awake), `Started
TeamBalanceApplication in …` took about 40s. The time is spent loading classes and bootstrapping on
one core, not waiting on migrations.

Attribution from one real boot:

| Phase | Duration | Nature |
|---|---|---|
| Profile active until first repository log line | ~10.6s | component scan, auto-configuration condition evaluation, fat-jar classloading; before any DB access |
| Spring Data JPA scan (8 repositories) | ~1.0s | classloading |
| Spring Data Redis bootstrap ("Found 0 Redis repository interfaces") | small | dead classpath weight; puts Spring Data into multiple-modules strict mode |
| Hikari pool start | ~5.1s | I/O; the Serverless SQL resume after idle (a redeploy after minutes of idle finds the DB asleep) |
| Hibernate metamodel and the rest until `Started` | ~13s | classloading, JIT, Tomcat |

The goal is under 10s on the JVM (5s as a stretch), without a GraalVM native image. Under 10s is the
committed bar because 5s needs both less JVM bootstrap work and taking the ~5s DB resume off the
serial path.

## Decision

1. **Trim the classpath and config.** `spring-boot-starter-data-redis` and
   `spring-session-data-redis` are removed (nothing in `main` referenced them), along with their
   properties. `spring.data.jpa.repositories.bootstrap-mode` is `deferred` (repositories initialize
   on a background thread, still complete before the context is ready, so wiring errors surface at
   startup). The Hibernate dialect is pinned to `PostgreSQLDialect` and
   `hibernate.boot.allow_jdbc_metadata_access` is `false`, which skips the boot-time JDBC metadata
   probe; the two must be set together, and every environment is PostgreSQL.
2. **Single-core JVM flags** in the `api/Dockerfile` ENTRYPOINT: `-XX:+UseSerialGC` and
   `-XX:TieredStopAtLevel=1` (C1 only: cheaper warm-up, negligible peak-throughput loss here).
3. **Spring AOT plus a JDK 25 AOT cache.** `bootJar` packages the AOT-generated bean definitions,
   activated with `-Dspring.aot.enabled=true`. A bake stage in the Dockerfile runs a Spring training
   run (`-Dspring.context.exit=onRefresh`) against a throwaway Postgres and writes `app.aot`, which
   the runtime loads with `-XX:AOTCache=app.aot`. Constraints: the bake stage must use the same JRE
   base image and the same GC flag as the runtime stage, or the cache is rejected. The bake is
   best-effort; a failure leaves an empty `app.aot` and the image still builds, since
   `-XX:AOTCache` fails safe by logging a warning and booting normally. AOT fixes the bean set per
   profile, so `processAot` runs under the `prod` profile to include the `@Profile("prod")`
   `ScalewayTemEmailSender`.
4. **Overlap the DB resume with boot instead of decoupling Flyway.** `DatabaseWarmupListener` is
   registered on the `SpringApplication` and fires on `ApplicationEnvironmentPreparedEvent`, roughly
   10s before Hikari starts. In the `prod` profile only, it starts a daemon thread `db-warmup` that
   opens, validates and closes one JDBC connection from `spring.datasource.*`. It never blocks boot
   and turns any failure into a warning. The regular pool is still created the normal way. The
   serving container still runs Flyway in-process.
5. **Measure with a per-step timing tree.** `main()` sets `BufferingApplicationStartup(2048)`, and
   the `startup` actuator endpoint is registered under `/internal/actuator`. In prod it is exposed
   but `InternalEndpointGuardFilter` returns 403 unless `teambalance.startup.actuator.enabled` is
   set (issue #95). The canonical metric stays the `Started … in X seconds` log line from a fresh
   container, recorded separately for warm DB and cold DB, at least 3 runs, median and worst.

## Considered options

- **GraalVM native image.** Sub-second start, but needs reflection and resource hints (Hibernate,
  Flyway, Postgres driver, Wirespec, Jackson), multi-minute native compiles in CI, and
  Testcontainers ITs stay on the JVM. Revisit only if the JVM path cannot get under 10s.
- **Flyway out of process** (`spring.flyway.enabled=false` in the serving container plus a lazy
  datasource). Not needed while the warm-up overlap works.
- **CRaC.** Blocked: Scaleway Serverless Containers do not grant the privileges CRIU needs.
- **`min-instances=1`.** Removes cold starts entirely at the cost of one always-on container. Kept in
  reserve if start time stays above target.

## Consequences

- The 40s baseline and the attribution table above are the numbers the code comments rely on. No
  after-change prod numbers are recorded yet; they can only be measured on a fresh prod container
  and belong in a follow-up amendment.
- Redis is not on the classpath. Re-adding it would put back the dead weight measured above; this is
  why ADR-0037 rate-limits in memory.
- The warm-up connection is a second, short-lived connection at boot. It is prod-only because other
  profiles use an always-on local database.
- A profile-specific AOT build means a bean that exists only under another profile needs `processAot`
  run under that profile too.
