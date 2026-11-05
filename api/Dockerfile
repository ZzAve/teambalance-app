# TeamBalance API — container image for Scaleway Serverless Containers.
# Multi-stage: build the Spring Boot fat jar, bake a JDK-25 AOT cache, then run it on a slim JRE.
# JDK/JRE 25 to match the build toolchain (gradle.properties: javaVersion=25).
# Build from the repo root: docker build -f api/Dockerfile -t teambalance-api .
# Staging image (prod image + in-container Postgres + demo data, see the `stg` stage):
#   docker build -f api/Dockerfile --target stg -t teambalance-api-stg .
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
FROM --platform=$BUILDPLATFORM eclipse-temurin:25-jdk@sha256:e787e08ef76f4c16866108cd7f9fcd96a68eef3ac6cc76866897d4d02d5a2262 AS build
WORKDIR /workspace

# Postgres for jOOQ codegen: Ubuntu's default package, while local/test codegen uses postgres:17 (Testcontainers).
# Its own layer, ahead of the COPYs, so source changes do not reinstall it.
RUN set -e; \
    apt-get update; \
    apt-get install -y --no-install-recommends postgresql; \
    rm -rf /var/lib/apt/lists/*

# Wrapper + build scripts first so dependency resolution can cache across source-only changes.
# buildSrc supplies the Wirespec Spring extension (SpringMappingAnnotationsExtension) to the
# build-script classpath — required to configure the codegen tasks in api/build.gradle.kts.
COPY gradlew settings.gradle.kts build.gradle.kts gradle.properties ./
COPY gradle ./gradle
COPY buildSrc ./buildSrc
COPY design-tokens ./design-tokens
COPY api ./api

# Daemonless, no config-cache: a one-shot container build never reuses either.
# bootJar transitively runs processAot (under the prod profile — see api/build.gradle.kts) and
# packages the AOT bean definitions into the fat jar.
#
# jOOQ classes are generated from the Flyway migrations against a real Postgres (the :api:jooqCodegen
# task, a dependency of compileKotlin). This stage has no Docker socket for Testcontainers, so, like the
# bake stage, it starts the Postgres installed above and hands Gradle its JDBC URL.
RUN set -e; \
    PGVER="$(pg_lsclusters -h | awk 'NR==1{print $1}')"; \
    pg_ctlcluster "$PGVER" main start; \
    su postgres -c "psql -v ON_ERROR_STOP=1 -c \"CREATE USER tb WITH PASSWORD 'tb' SUPERUSER;\""; \
    su postgres -c "createdb -O tb jooq_codegen"; \
    JOOQ_CODEGEN_JDBC_URL=jdbc:postgresql://127.0.0.1:5432/jooq_codegen \
    JOOQ_CODEGEN_JDBC_USER=tb \
    JOOQ_CODEGEN_JDBC_PASSWORD=tb \
    ./gradlew --no-daemon --no-configuration-cache :api:bootJar; \
    pg_ctlcluster "$PGVER" main stop; \
    cp api/build/libs/*-SNAPSHOT.jar /workspace/app.jar; \
    java -Djarmode=tools -jar /workspace/app.jar extract --destination /workspace/extracted; \
    touch -d @318211200 /workspace/extracted/app.jar
# The JVM's AOT cache cannot store classes loaded from jars nested in the fat jar, so bake and run
# the extracted layout (extracted/app.jar + extracted/lib/) instead.
# The jars in lib/ carry Spring Boot's fixed date 1980-02-01 (epoch 318211200); app.jar gets it too.
# CI exports with SOURCE_DATE_EPOCH=318211200 and rewrite-timestamp, which clamps every newer
# timestamp to that date. The AOT cache checks jar mtimes, so no jar may be newer than it.

# ---- bake stage: JDK 25 AOT cache --------------------------------------------
# IMPORTANT: no `--platform=$BUILDPLATFORM` here. The AOT cache is architecture- and JVM-specific,
# so it MUST be produced on the *target* platform (this stage runs as $TARGETPLATFORM, under
# emulation on a cross-arch build). A mismatched cache is rejected at runtime and the app simply
# boots without it (fail-safe), so a cross-arch cache would silently waste the speedup.
#
# The training run drives a full Spring context refresh (`-Dspring.context.exit=onRefresh` exits the
# JVM cleanly the moment refresh completes). Refresh touches the DB (Flyway migrate + Hikari), so we
# spin a throwaway Postgres inside this stage — this yields a cache that also covers jOOQ, Flyway
# and connection-pool init, not just the pre-DB classload gap. Secrets are build-time
# dummies: AOT-processed prod boot instantiates ScalewayTemEmailSender (builds a RestClient) but
# never sends mail, and the token salt is only read when a login is served.
#
# BASE MUST MATCH THE RUNTIME STAGE (eclipse-temurin:25-jre). The AOT cache records the exact JVM
# image it was built against; the runtime rejects a cache whose `lib/modules` differs. The JDK and
# JRE images ship different module sets, so baking on `:25-jdk` while running on `:25-jre` produced
# "[aot] This file is not the one used while building the shared archive file: .../lib/modules,
# size has changed" → "Unable to map shared spaces", and the app fell back to no cache (fail-safe).
FROM eclipse-temurin:25-jre@sha256:f9e65324a37f28209ce7dd0e5149a7aa954520ed936fb87813cf6ded2400a112 AS bake
WORKDIR /app
COPY --from=build /workspace/extracted/ /app/

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
      INVITATION_TOKEN_ENCRYPTION_KEY=YnVpbGQtdGltZS1kdW1teS1rZXktMzItYnl0ZXMhISE= \
      TEAMBALANCE_CALENDAR_LINK_SALT=build-time-dummy-salt \
      TEAMBALANCE_CALENDAR_LINK_ENCRYPTION_KEY=YnVpbGQtdGltZS1kdW1teS1rZXktMzItYnl0ZXMhISE= \
      TEAMBALANCE_BUNQ_TOKEN_ENCRYPTION_KEY=YnVpbGQtdGltZS1kdW1teS1rZXktMzItYnl0ZXMhISE= \
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
FROM eclipse-temurin:25-jre@sha256:f9e65324a37f28209ce7dd0e5149a7aa954520ed936fb87813cf6ded2400a112 AS runtime
WORKDIR /app

# Run as an unprivileged user.
RUN useradd --system --uid 1001 --home-dir /app --shell /usr/sbin/nologin app
USER app

# Jar at the SAME /app/app.jar path the cache was recorded against, plus the baked AOT cache.
# Dependencies in their own layer: with CI's fixed timestamps its digest only changes with a dependency.
COPY --from=build --chown=app:app /workspace/extracted/lib/ lib/
COPY --from=build --chown=app:app /workspace/extracted/app.jar app.jar
COPY --from=bake  --chown=app:app /app/app.aot app.aot

EXPOSE 8080

# ---- stg stage ---------------------------------------------------------------
# The prod jar and AOT cache plus a Postgres cluster in /app/pgdata, initialised here and owned by the
# app user, so a cold start only has to start it (api/stg-entrypoint.sh). Its data lives on the
# container's temporary disk: every cold start begins empty, Flyway builds the schema from V001 and
# DemoDataSeeder adds the demo team. Runs the `prod` profile (the AOT bean set is prod's); the
# differences are runtime switches: seed demo data, and log email instead of sending it via TEM.
FROM runtime AS stg
USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends postgresql \
 && rm -rf /var/lib/apt/lists/* \
 && ln -s "$(ls -d /usr/lib/postgresql/*/bin | head -n1)" /usr/local/pgbin \
 && install -d -o app -g app -m 700 /app/pgdata
ENV PATH=/usr/local/pgbin:$PATH \
    SPRING_PROFILES_ACTIVE=prod \
    SPRING_DATASOURCE_URL=jdbc:postgresql://127.0.0.1:5432/teambalance \
    SPRING_DATASOURCE_USERNAME=teambalance \
    TEAMBALANCE_DEMO_DATA_ENABLED=true \
    TEAMBALANCE_EMAIL_SEND=false \
    SCALEWAY_TEM_API_KEY=unused-on-stg \
    SCALEWAY_TEM_PROJECT_ID=unused-on-stg \
    TEAMBALANCE_API_BASE_URL=https://api.stg.teambalance.nl
USER app
# trust auth: Postgres only listens on 127.0.0.1 inside this container. mmap shared memory and a /tmp
# socket avoid /dev/shm and /var/run/postgresql, which the sandbox or the non-root user may not have.
RUN initdb -D /app/pgdata -U teambalance --auth=trust \
 && printf "%s\n" "listen_addresses = '127.0.0.1'" "unix_socket_directories = '/tmp'" \
      "dynamic_shared_memory_type = mmap" "shared_buffers = 64MB" >> /app/pgdata/postgresql.conf \
 && pg_ctl -D /app/pgdata -w start \
 && createdb -h 127.0.0.1 -U teambalance teambalance \
 && pg_ctl -D /app/pgdata -w stop
COPY --chown=app:app --chmod=755 api/stg-entrypoint.sh /app/stg-entrypoint.sh
ARG GIT_SHA=unknown
ENV TEAMBALANCE_BUILD_SHA=$GIT_SHA
ENTRYPOINT ["/app/stg-entrypoint.sh"]

# ---- demo stage: stg + the SPA, served from the same host (ADR-0043) ---------
# Guest login (/demo) on, Setpoint VT seed off, SPA files served by the app (`make demo-image` builds
# app/dist-demo first). The app refuses to start unless email.send=false, bunq.environment=none and the
# datasource is loopback (DemoGuard); stg already sets those. Build: docker build -f api/Dockerfile --target demo .
FROM stg AS demo
ENV TEAMBALANCE_DEMO_ENABLED=true \
    TEAMBALANCE_PASSKEYS_ENABLED=false \
    TEAMBALANCE_DEMO_DATA_ENABLED=false \
    TEAMBALANCE_SPA_STATIC_LOCATION=file:/app/static/ \
    SERVER_SERVLET_SESSION_TIMEOUT=4h \
    TEAMBALANCE_SESSION_ABSOLUTE_TIMEOUT=4h \
    TEAMBALANCE_CSRF_COOKIE_NAME=DEMO-XSRF-TOKEN \
    TEAMBALANCE_CSRF_COOKIE_DOMAIN= \
    TEAMBALANCE_API_BASE_URL=https://demo.teambalance.nl \
    TEAMBALANCE_FRONTEND_BASE_URL=https://demo.teambalance.nl
COPY --chown=app:app app/dist-demo/ /app/static/

# ---- prod stage (default target: keep it last) ---------------------------------
FROM runtime AS prod

# Build SHA of this image, surfaced at runtime on /internal/actuator/info (info.build.sha) so the deploy
# pipeline can confirm the exact pushed image is serving. Declared last: it changes every commit, and
# only the cheap EXPOSE/ENTRYPOINT metadata layers follow, so the expensive build/bake COPYs stay cached.
# Defaults to `unknown` for a plain local `docker build` with no --build-arg.
ARG GIT_SHA=unknown
ENV TEAMBALANCE_BUILD_SHA=$GIT_SHA

# Runtime flags combine Phase 1 (1-vCPU startup tuning) and Phase 2 (Spring AOT + AOT cache):
#   -XX:+UseSerialGC        — no multi-threaded GC to spin up on a single core.
#   -XX:TieredStopAtLevel=1 — C1-only JIT: cheaper warmup, negligible peak-throughput loss here.
#   -XX:AOTCache=app.aot    — load the baked JDK-25 AOT cache; fails SAFE (a missing/mismatched cache
#                             only logs a warning and boots normally).
#   -Dspring.aot.enabled    — activate the AOT-generated bean definitions packaged in the jar.
# The GC flag MUST match the bake-stage training run, or the AOT cache is rejected at runtime. Keep
# api/stg-entrypoint.sh in sync: Docker resets CMD on a new ENTRYPOINT, so stg repeats this command.
# See docs/adr/0036-jvm-startup-time-tuning-without-native-image.md.
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-XX:AOTCache=app.aot", "-Dspring.aot.enabled=true", "-jar", "app.jar"]
