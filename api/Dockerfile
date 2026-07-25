# TeamBalance API — container image for Scaleway Serverless Containers.
# Multi-stage: build the Spring Boot fat jar, bake a JDK-25 AOT cache, then run it on a slim JRE.
# JDK/JRE 25 to match the build toolchain (gradle.properties: javaVersion=25).
# Build from the repo root: docker build -f api/Dockerfile -t teambalance-api .
#
# Startup-time optimization Phase 2 (Spring AOT + AppCDS/Leyden AOT-cache). This runs on the JVM
# (java -jar) — NO GraalVM native image. Two levers:
#   1. Spring AOT — build-time bean-definition generation. `:api:bootJar` now packages the
#      AOT-generated code automatically (the `org.springframework.boot.aot` plugin wires the `aot`
#      source set into bootJar); it is *activated* at runtime with `-Dspring.aot.enabled=true`.
#   2. JDK 25 AOT cache (JEP 483 class loading+linking, JEP 514 single-command training) — baked
#      from a Spring "training run" and loaded at runtime via `-XX:AOTCache=app.aot`.
#
# This composes with Phase 1's 1-vCPU JVM flags (-XX:+UseSerialGC, -XX:TieredStopAtLevel=1): the
# runtime ENTRYPOINT carries both sets, and the bake-stage training run uses the same GC flag so the
# AOT cache is validated (not rejected) at runtime.

# ---- build stage -------------------------------------------------------------
# Build on the native builder arch (the bootJar is platform-independent JVM bytecode),
# so a cross-arch build (e.g. --platform=linux/amd64 on an arm host) stays fast.
FROM --platform=$BUILDPLATFORM eclipse-temurin:25-jdk AS build
WORKDIR /workspace

# Wrapper + build scripts first so dependency resolution can cache across source-only changes.
# buildSrc supplies the Wirespec SpringKotlinEmitter to the build-script classpath — required
# to configure the codegen tasks in api/build.gradle.kts.
COPY gradlew settings.gradle.kts build.gradle.kts gradle.properties ./
COPY gradle ./gradle
COPY buildSrc ./buildSrc
COPY design-tokens ./design-tokens
COPY api ./api

# Daemonless, no config-cache: a one-shot container build never reuses either.
# bootJar transitively runs processAot (under the prod profile — see api/build.gradle.kts) and
# packages the AOT bean definitions into the fat jar.
RUN ./gradlew --no-daemon --no-configuration-cache :api:bootJar \
 && cp api/build/libs/*-SNAPSHOT.jar /workspace/app.jar

# ---- bake stage: JDK 25 AOT cache --------------------------------------------
# IMPORTANT: no `--platform=$BUILDPLATFORM` here. The AOT cache is architecture- and JVM-specific,
# so it MUST be produced on the *target* platform (this stage runs as $TARGETPLATFORM, under
# emulation on a cross-arch build). A mismatched cache is rejected at runtime and the app simply
# boots without it (fail-safe), so a cross-arch cache would silently waste the speedup.
#
# The training run drives a full Spring context refresh (`-Dspring.context.exit=onRefresh` exits the
# JVM cleanly the moment refresh completes). Refresh touches the DB (Flyway migrate + Hikari), so we
# spin a throwaway Postgres inside this stage — this yields a cache that also covers Hibernate
# metamodel init and repository bootstrap, not just the pre-DB classload gap. Secrets are build-time
# dummies: AOT-processed prod boot instantiates ScalewayTemEmailSender (builds a RestClient) but
# never sends mail, and the token salt is only read when a login is served.
#
# BASE MUST MATCH THE RUNTIME STAGE (eclipse-temurin:25-jre). The AOT cache records the exact JVM
# image it was built against; the runtime rejects a cache whose `lib/modules` differs. The JDK and
# JRE images ship different module sets, so baking on `:25-jdk` while running on `:25-jre` produced
# "[aot] This file is not the one used while building the shared archive file: .../lib/modules,
# size has changed" → "Unable to map shared spaces", and the app fell back to no cache (fail-safe).
FROM eclipse-temurin:25-jre AS bake
WORKDIR /app
COPY --from=build /workspace/app.jar /app/app.jar

# Keep the jar path identical to the runtime stage (/app/app.jar): the AOT cache validates the
# classpath it was recorded against.
#
# Package name: the base image is Ubuntu, whose default archive ships an UNVERSIONED `postgresql`
# meta-package (whichever major that release carries — e.g. 17 on "resolute"), NOT `postgresql-16`
# (that needs the external PGDG repo). Any recent Postgres serves a one-off training refresh fine,
# so we install the meta-package and derive the auto-created cluster's version dynamically.
#
# The ENTIRE bake is BEST-EFFORT: the whole block is wrapped so ANY failure (apt, cluster start,
# training run) degrades to an empty /app/app.aot and the image build still SUCCEEDS. At runtime
# -XX:AOTCache fails safe on a missing/empty/mismatched cache (warns, boots normally). So a broken
# bake costs only the cache-layer speedup — never the deploy. The Spring AOT bean-definition speedup
# is independent: it lives in the jar and is always active via -Dspring.aot.enabled, so it survives
# even a failed bake.
RUN set -x; \
    ( set -e; \
      apt-get update; \
      apt-get install -y --no-install-recommends postgresql; \
      rm -rf /var/lib/apt/lists/*; \
      PGVER="$(pg_lsclusters -h | awk 'NR==1{print $1}')"; \
      pg_ctlcluster "$PGVER" main start; \
      su postgres -c "psql -v ON_ERROR_STOP=1 -c \"CREATE USER tb WITH PASSWORD 'tb' SUPERUSER;\""; \
      su postgres -c "createdb -O tb teambalance"; \
      SPRING_PROFILES_ACTIVE=prod \
      SPRING_DATASOURCE_URL=jdbc:postgresql://127.0.0.1:5432/teambalance \
      SPRING_DATASOURCE_USERNAME=tb \
      SPRING_DATASOURCE_PASSWORD=tb \
      INVITATION_TOKEN_SALT=build-time-dummy-salt \
      SCALEWAY_TEM_API_KEY=build-time-dummy \
      SCALEWAY_TEM_PROJECT_ID=build-time-dummy \
      java -XX:+UseSerialGC -XX:TieredStopAtLevel=1 \
           -XX:AOTCacheOutput=/app/app.aot \
           -Dspring.aot.enabled=true \
           -Dspring.context.exit=onRefresh \
           -jar /app/app.jar; \
      pg_ctlcluster "$PGVER" main stop; \
    ) || echo "WARN: AOT-cache bake failed; runtime will boot without the cache (fail-safe)"; \
    touch /app/app.aot

# ---- runtime stage -----------------------------------------------------------
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

# Run as an unprivileged user.
RUN useradd --system --uid 1001 --home-dir /app --shell /usr/sbin/nologin app
USER app

# Jar at the SAME /app/app.jar path the cache was recorded against, plus the baked AOT cache.
COPY --from=build --chown=app:app /workspace/app.jar app.jar
COPY --from=bake  --chown=app:app /app/app.aot app.aot

EXPOSE 8080
# Runtime flags combine Phase 1 (1-vCPU startup tuning) and Phase 2 (Spring AOT + AOT cache):
#   -XX:+UseSerialGC        — no multi-threaded GC to spin up on a single core.
#   -XX:TieredStopAtLevel=1 — C1-only JIT: cheaper warmup, negligible peak-throughput loss here.
#   -XX:AOTCache=app.aot    — load the baked JDK-25 AOT cache; fails SAFE (a missing/mismatched cache
#                             only logs a warning and boots normally).
#   -Dspring.aot.enabled    — activate the AOT-generated bean definitions packaged in the jar.
# The GC flag MUST match the bake-stage training run, or the AOT cache is rejected at runtime.
# See docs/plans/2026-07-24-startup-time-optimization.md.
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-XX:AOTCache=app.aot", "-Dspring.aot.enabled=true", "-jar", "app.jar"]
