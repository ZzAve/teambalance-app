# TeamBalance API — container image for Scaleway Serverless Containers.
# Multi-stage: build the Spring Boot fat jar with the Gradle wrapper, then run it on a slim JRE.
# JDK/JRE 25 to match the build toolchain (gradle.properties: javaVersion=25).
# Build from the repo root: docker build -f api/Dockerfile -t teambalance-api .

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
RUN ./gradlew --no-daemon --no-configuration-cache :api:bootJar

# ---- runtime stage -----------------------------------------------------------
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

# Run as an unprivileged user.
RUN useradd --system --uid 1001 --home-dir /app --shell /usr/sbin/nologin app
USER app

# The Spring Boot plugin emits exactly one executable jar (the *-plain.jar is non-executable).
COPY --from=build --chown=app:app /workspace/api/build/libs/*-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
