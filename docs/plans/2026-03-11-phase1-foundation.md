# Phase 1 — Foundation Implementation Plan

**Status:** ✅ Complete (merged 2026-03-20)

**Deviations from plan:**
- Kotlin upgraded from 2.1 to 2.3 (required for detekt 2.0 compatibility)
- detekt upgraded from 1.23.7 (`io.gitlab.arturbosch.detekt`) to 2.0.0-alpha.2 (`dev.detekt`) — 1.x incompatible with Kotlin 2.1+
- `community.flock.detekt:flock-detekt` removed — artifact does not exist
- Wirespec comments (`//`) removed from `.ws` files — not supported by parser
- `spring-boot-starter-webmvc-test` added — Spring Boot 4 moved `AutoConfigureMockMvc` to new package
- ArchUnit rules use `allowEmptyShould(true)` — required when packages have no classes yet
- Dependency versions extracted to `gradle.properties` (`wirespecVersion`, `testcontainersVersion`, `archunitVersion`)
- Package renamed to `com.github.zzave.teambalance.api`
- ESLint boundaries rule changed from `element-types` to `dependencies` (eslint-plugin-boundaries v5 API)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold the TeamBalance monorepo from scratch with a working backend, frontend, landing page, design tokens, Wirespec pipeline, and all guardrails — so Phase 2 (core event loop) can start building features immediately.

**Architecture:** Gradle monorepo with four modules: `api` (Kotlin Spring Boot 4 backend), `app` (Vite + React SPA), `www` (plain HTML landing page), and `design-tokens` (shared CSS + Tailwind preset). Backend follows hexagonal DDD. Frontend follows Feature-Sliced Design. API contracts are defined in Wirespec and code-generated for both Kotlin and TypeScript.

**Tech Stack:**
- Backend: Kotlin 2.1, Spring Boot 4.0, Hibernate/JPA, Flyway, Gradle 9.4, PostgreSQL
- Frontend: Vite 6, React 19, TypeScript 5, Tailwind CSS 4, Shadcn UI, TanStack Query, Zustand
- Contracts: Wirespec (Gradle plugin `community.flock.wirespec.plugin.gradle`)
- Guardrails: flock-detekt, ArchUnit, ESLint + eslint-plugin-boundaries
- Auth (Phase 5 prep): Spring Session + Redis, Auth0 OAuth (research note on pricing)

**New repo location:** `/Users/julius.van.dis/IdeaProjects/Personal/teambalance-app`

**Research notes (not blocking Phase 1):**
- Auth0 pricing: Research free tier limits and pricing before Phase 5. Alternatives: Keycloak (self-hosted), Zitadel (EU-based OSS).
- Deployment: Research European cloud alternatives to Google Cloud Run before Phase 6. Candidates: Scaleway (FR), Hetzner Cloud (DE), Exoscale (CH), Fly.io (has EU regions).

---

## Task 1: Create repo and Gradle root project

**Files:**
- Create: `teambalance-app/` (repo root)
- Create: `teambalance-app/build.gradle.kts`
- Create: `teambalance-app/settings.gradle.kts`
- Create: `teambalance-app/gradle.properties`
- Create: `teambalance-app/.gitignore`

**Step 1: Initialize git repo and directory structure**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal
mkdir teambalance-app
cd teambalance-app
git init
mkdir -p api/src/main/kotlin/app/teambalance
mkdir -p api/src/main/resources
mkdir -p api/src/main/wirespec
mkdir -p api/src/test/kotlin/app/teambalance
mkdir -p app/src
mkdir -p www
mkdir -p design-tokens
```

**Step 2: Create `.gitignore`**

```gitignore
# Gradle
.gradle/
build/
!gradle/wrapper/

# IDE
.idea/
*.iml
.vscode/

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local

# Node
node_modules/
dist/

# Generated
api/build/generated/
app/src/shared/api/generated/
```

**Step 3: Create `gradle.properties`**

```properties
kotlin.code.style=official
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.jvmargs=-Xmx2g -XX:+UseParallelGC
```

**Step 4: Create `settings.gradle.kts`**

```kotlin
rootProject.name = "teambalance"

include("api")
include("design-tokens")
```

**Step 5: Create root `build.gradle.kts`**

```kotlin
plugins {
    kotlin("jvm") version "2.1.20" apply false
    kotlin("plugin.spring") version "2.1.20" apply false
    kotlin("plugin.jpa") version "2.1.20" apply false
    id("org.springframework.boot") version "4.0.0" apply false
    id("io.spring.dependency-management") version "1.1.7" apply false
    id("community.flock.wirespec.plugin.gradle") version "0.14.3" apply false
}

allprojects {
    group = "app.teambalance"
    version = "0.1.0-SNAPSHOT"

    repositories {
        mavenCentral()
    }
}
```

**Step 6: Verify Gradle wrapper setup**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app
gradle wrapper --gradle-version 8.12
./gradlew --version
```

Expected: Gradle 8.12 prints its version info.

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: initialize Gradle monorepo structure"
```

---

## Task 2: Design tokens

**Files:**
- Create: `design-tokens/tokens.css`
- Create: `design-tokens/tailwind-preset.js`
- Create: `design-tokens/build.gradle.kts`

**Step 1: Create `design-tokens/tokens.css`**

These tokens are the single source of truth for colors, typography, spacing, and animation — consumed by `app/`, `www/`, and any future consumer.

```css
:root {
  /* Brand Colors */
  --color-blue: #225C9C;
  --color-blue-light: #2D6FB5;
  --color-blue-dark: #1A4A7D;
  --color-green: #249E6C;
  --color-green-light: #2DB87E;
  --color-green-dark: #1D7F57;
  --color-gold: #F4B400;
  --color-gold-light: #FFD54F;
  --color-gold-dark: #C89200;
  --color-red: #D93025;
  --color-red-light: #EF5350;
  --color-red-dark: #B71C1C;

  /* Surfaces */
  --color-background: #F8F6F0;
  --color-card: #FEFDFB;
  --color-card-hover: #FDFCF8;

  /* Text */
  --color-text-primary: #1E293B;
  --color-text-secondary: #64748B;
  --color-text-muted: #94A3B8;
  --color-text-inverse: #FFFFFF;

  /* Semantic (attendance) */
  --color-attending: var(--color-green);
  --color-maybe: var(--color-gold);
  --color-absent: var(--color-red);
  --color-no-response: #94A3B8;

  /* Typography */
  --font-display: 'Grandstander', cursive;
  --font-body: 'DM Sans', sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows (warm-tinted) */
  --shadow-sm: 0 1px 2px rgba(120, 80, 40, 0.06);
  --shadow-md: 0 4px 6px rgba(120, 80, 40, 0.08);
  --shadow-lg: 0 10px 15px rgba(120, 80, 40, 0.1);
  --shadow-card: 0 2px 8px rgba(120, 80, 40, 0.06);
  --shadow-card-hover: 0 8px 24px rgba(120, 80, 40, 0.12);

  /* Animation */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;

  /* Z-index */
  --z-dropdown: 50;
  --z-sticky: 100;
  --z-nav: 200;
  --z-modal: 300;
  --z-toast: 400;
}
```

**Step 2: Create `design-tokens/tailwind-preset.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#225C9C',
          light: '#2D6FB5',
          dark: '#1A4A7D',
        },
        green: {
          DEFAULT: '#249E6C',
          light: '#2DB87E',
          dark: '#1D7F57',
        },
        gold: {
          DEFAULT: '#F4B400',
          light: '#FFD54F',
          dark: '#C89200',
        },
        red: {
          DEFAULT: '#D93025',
          light: '#EF5350',
          dark: '#B71C1C',
        },
        background: '#F8F6F0',
        card: {
          DEFAULT: '#FEFDFB',
          hover: '#FDFCF8',
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8',
          inverse: '#FFFFFF',
        },
        attending: '#249E6C',
        maybe: '#F4B400',
        absent: '#D93025',
        'no-response': '#94A3B8',
      },
      fontFamily: {
        display: ['Grandstander', 'cursive'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(120, 80, 40, 0.06)',
        md: '0 4px 6px rgba(120, 80, 40, 0.08)',
        lg: '0 10px 15px rgba(120, 80, 40, 0.1)',
        card: '0 2px 8px rgba(120, 80, 40, 0.06)',
        'card-hover': '0 8px 24px rgba(120, 80, 40, 0.12)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
}
```

**Step 3: Create `design-tokens/build.gradle.kts`**

This is a minimal Gradle module so design-tokens is recognized in the monorepo. It has no Kotlin dependencies — it just holds static assets.

```kotlin
// design-tokens is a static asset module — no compilation needed.
// Consumed directly by app/ (via Tailwind preset) and www/ (via tokens.css).
```

**Step 4: Commit**

```bash
git add design-tokens/
git commit -m "feat: add design tokens (CSS custom properties + Tailwind preset)"
```

---

## Task 3: Backend Spring Boot 4 skeleton

**Files:**
- Create: `api/build.gradle.kts`
- Create: `api/src/main/kotlin/app/teambalance/TeamBalanceApplication.kt`
- Create: `api/src/main/resources/application.yml`
- Create: `api/src/main/resources/application-dev.yml`

**Step 1: Create `api/build.gradle.kts`**

```kotlin
plugins {
    kotlin("jvm")
    kotlin("plugin.spring")
    kotlin("plugin.jpa")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
    id("community.flock.wirespec.plugin.gradle")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Spring Session + Redis (auth infrastructure for Phase 5)
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springframework.session:spring-session-data-redis")

    // Flyway
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")

    // Database
    runtimeOnly("org.postgresql:postgresql")

    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    // Caching
    implementation("com.github.ben-manes.caffeine:caffeine")

    // Wirespec runtime
    implementation("community.flock.wirespec.integration:spring-jvm:0.14.3")

    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("com.tngtech.archunit:archunit-junit5:1.3.0")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// Wirespec code generation — configured fully in Task 9
```

**Step 2: Create `api/src/main/kotlin/app/teambalance/TeamBalanceApplication.kt`**

```kotlin
package app.teambalance

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TeamBalanceApplication

fun main(args: Array<String>) {
    runApplication<TeamBalanceApplication>(*args)
}
```

**Step 3: Create `api/src/main/resources/application.yml`**

```yaml
spring:
  application:
    name: teambalance-api
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        default_schema: public
  flyway:
    enabled: true
    locations: classpath:db/migration
  jackson:
    default-property-inclusion: non_null

server:
  port: 8080
  shutdown: graceful

management:
  endpoints:
    web:
      base-path: /internal/actuator
      exposure:
        include: health,info,metrics
```

**Step 4: Create `api/src/main/resources/application-dev.yml`**

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/teambalance
    username: teambalance
    password: teambalance
  flyway:
    schemas:
      - public
  data:
    redis:
      host: localhost
      port: 6379

logging:
  level:
    app.teambalance: DEBUG
    org.hibernate.SQL: DEBUG
```

**Step 5: Verify it compiles**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 6: Commit**

```bash
git add api/
git commit -m "feat: add Spring Boot 4 backend skeleton with JPA, Flyway, Redis"
```

---

## Task 4: Flyway — initial platform schema migration

**Files:**
- Create: `api/src/main/resources/db/migration/V001__platform_schema.sql`

**Step 1: Write the migration**

This creates the platform-level tables (shared across all tenants) in the `public` schema. These tables are referenced in the design doc under "Platform schema."

```sql
-- Platform schema: shared across all tenants
-- Tenant-specific data lives in per-team schemas (created dynamically)

CREATE TABLE teams (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    slug          VARCHAR(100) NOT NULL UNIQUE,
    sport         VARCHAR(50)  NOT NULL,
    schema_name   VARCHAR(100) NOT NULL UNIQUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    display_name  VARCHAR(100) NOT NULL,
    avatar_url    VARCHAR(500),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE team_members (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id       UUID         NOT NULL REFERENCES teams(id),
    user_id       UUID         NOT NULL REFERENCES users(id),
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER',
    team_role     VARCHAR(50),
    active        BOOLEAN      NOT NULL DEFAULT true,
    joined_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE(team_id, user_id),
    CONSTRAINT valid_role CHECK (role IN ('USER', 'ADMIN'))
);

CREATE TABLE invitations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id       UUID         NOT NULL REFERENCES teams(id),
    token         VARCHAR(100) NOT NULL UNIQUE,
    created_by    UUID         NOT NULL REFERENCES users(id),
    expires_at    TIMESTAMPTZ  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_team  ON invitations(team_id);
```

**Step 2: Write a test to verify migration runs against a real database**

Create: `api/src/test/kotlin/app/teambalance/infrastructure/FlywayMigrationTest.kt`

```kotlin
package app.teambalance.infrastructure

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@SpringBootTest
@Testcontainers
class FlywayMigrationTest {

    companion object {
        @Container
        @JvmStatic
        val postgres = PostgreSQLContainer("postgres:17-alpine")

        @DynamicPropertySource
        @JvmStatic
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.data.redis.host") { "localhost" }
            registry.add("spring.data.redis.port") { "6379" }
            registry.add("spring.session.store-type") { "none" }
        }
    }

    @Test
    fun `flyway migrations run successfully`() {
        // If we get here, Spring Boot started and Flyway ran all migrations
    }
}
```

**Step 3: Run the test**

```bash
./gradlew api:test --tests "app.teambalance.infrastructure.FlywayMigrationTest"
```

Expected: PASS — Flyway applies V001 migration to Testcontainers PostgreSQL.

**Step 4: Commit**

```bash
git add api/src/main/resources/db/migration/ api/src/test/kotlin/
git commit -m "feat: add initial platform schema migration (teams, users, members, invitations)"
```

---

## Task 5: Flyway — tenant schema baseline migration

**Files:**
- Create: `api/src/main/resources/db/tenant-migration/V001__tenant_baseline.sql`
- Create: `api/src/main/kotlin/app/teambalance/infrastructure/multitenancy/TenantSchemaManager.kt`
- Create: `api/src/main/kotlin/app/teambalance/infrastructure/multitenancy/TenantContext.kt`
- Create: `api/src/main/kotlin/app/teambalance/infrastructure/multitenancy/TenantFilter.kt`

**Step 1: Create tenant baseline migration**

This is the template applied to each tenant schema when a team is created.

```sql
-- Tenant schema: one copy per team
-- Run by TenantSchemaManager when a team is provisioned

CREATE TABLE event_types (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    color         VARCHAR(7),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type_id   UUID          NOT NULL REFERENCES event_types(id),
    title           VARCHAR(200)  NOT NULL,
    description     TEXT,
    start_time      TIMESTAMPTZ   NOT NULL,
    end_time        TIMESTAMPTZ,
    location        VARCHAR(500),
    recurring_group UUID,
    created_by      UUID          NOT NULL,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE attendances (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL,
    state       VARCHAR(20) NOT NULL DEFAULT 'NOT_RESPONDED',
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(event_id, user_id),
    CONSTRAINT valid_state CHECK (state IN ('ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED'))
);

CREATE TABLE event_audience (
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL,
    PRIMARY KEY (event_id, user_id)
);

CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id     VARCHAR(255),
    amount_cents    INTEGER      NOT NULL,
    counterparty    VARCHAR(200) NOT NULL,
    description     VARCHAR(500),
    timestamp       TIMESTAMPTZ  NOT NULL,
    excluded        BOOLEAN      NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_type ON events(event_type_id);
CREATE INDEX idx_attendances_event ON attendances(event_id);
CREATE INDEX idx_attendances_user ON attendances(user_id);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
```

**Step 2: Create `TenantContext.kt`**

```kotlin
package app.teambalance.infrastructure.multitenancy

object TenantContext {
    private val current = InheritableThreadLocal<String>()

    fun set(schemaName: String) = current.set(schemaName)
    fun get(): String = current.get() ?: "public"
    fun clear() = current.remove()
}
```

**Step 3: Create `TenantFilter.kt`**

```kotlin
package app.teambalance.infrastructure.multitenancy

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class TenantFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val tenantHeader = request.getHeader("X-Team-Id")
        if (tenantHeader != null) {
            // Schema name is stored on the team record; for now use header directly
            // Phase 5 will resolve this from the authenticated user's team context
            TenantContext.set("team_$tenantHeader")
        }
        try {
            filterChain.doFilter(request, response)
        } finally {
            TenantContext.clear()
        }
    }
}
```

**Step 4: Create `TenantSchemaManager.kt`**

```kotlin
package app.teambalance.infrastructure.multitenancy

import org.flywaydb.core.Flyway
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class TenantSchemaManager(private val dataSource: DataSource) {

    fun provisionTenantSchema(schemaName: String) {
        // Create the schema
        dataSource.connection.use { conn ->
            conn.createStatement().execute("CREATE SCHEMA IF NOT EXISTS \"$schemaName\"")
        }

        // Run tenant-specific migrations
        Flyway.configure()
            .dataSource(dataSource)
            .schemas(schemaName)
            .locations("classpath:db/tenant-migration")
            .baselineOnMigrate(false)
            .load()
            .migrate()
    }
}
```

**Step 5: Write a test for tenant schema provisioning**

Create: `api/src/test/kotlin/app/teambalance/infrastructure/multitenancy/TenantSchemaManagerTest.kt`

```kotlin
package app.teambalance.infrastructure.multitenancy

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import kotlin.test.assertTrue

@SpringBootTest
@Testcontainers
class TenantSchemaManagerTest {

    companion object {
        @Container
        @JvmStatic
        val postgres = PostgreSQLContainer("postgres:17-alpine")

        @DynamicPropertySource
        @JvmStatic
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.data.redis.host") { "localhost" }
            registry.add("spring.data.redis.port") { "6379" }
            registry.add("spring.session.store-type") { "none" }
        }
    }

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Test
    fun `provisioning a tenant creates schema with all tables`() {
        tenantSchemaManager.provisionTenantSchema("team_test_team")

        val tables = jdbcTemplate.queryForList(
            """
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'team_test_team'
            ORDER BY table_name
            """,
            String::class.java,
        )

        assertTrue(tables.contains("events"), "Expected 'events' table in tenant schema")
        assertTrue(tables.contains("attendances"), "Expected 'attendances' table in tenant schema")
        assertTrue(tables.contains("transactions"), "Expected 'transactions' table in tenant schema")
        assertTrue(tables.contains("event_types"), "Expected 'event_types' table in tenant schema")
    }
}
```

**Step 6: Run the test**

```bash
./gradlew api:test --tests "app.teambalance.infrastructure.multitenancy.TenantSchemaManagerTest"
```

Expected: PASS

**Step 7: Commit**

```bash
git add api/src/
git commit -m "feat: add multitenancy infrastructure (tenant schema provisioning, context, filter)"
```

---

## Task 6: ArchUnit guardrails

**Files:**
- Create: `api/src/test/kotlin/app/teambalance/ArchitectureTest.kt`

**Step 1: Write the ArchUnit test**

```kotlin
package app.teambalance

import com.tngtech.archunit.core.importer.ClassFileImporter
import com.tngtech.archunit.core.importer.ImportOption
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class ArchitectureTest {

    companion object {
        private val classes by lazy {
            ClassFileImporter()
                .withImportOption(ImportOption.DoNotIncludeTests())
                .importPackages("app.teambalance")
        }
    }

    @Test
    fun `domain must not depend on infrastructure`() {
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .check(classes)
    }

    @Test
    fun `domain must not depend on interfaces`() {
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAPackage("..interfaces..")
            .check(classes)
    }

    @Test
    fun `domain must not depend on Spring`() {
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAPackage("org.springframework..")
            .check(classes)
    }

    @Test
    fun `application must not depend on infrastructure`() {
        noClasses()
            .that().resideInAPackage("..application..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .check(classes)
    }

    @Test
    fun `application must not depend on interfaces`() {
        noClasses()
            .that().resideInAPackage("..application..")
            .should().dependOnClassesThat().resideInAPackage("..interfaces..")
            .check(classes)
    }

    @Test
    fun `interfaces must not depend on infrastructure`() {
        noClasses()
            .that().resideInAPackage("..interfaces..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .check(classes)
    }
}
```

**Step 2: Run the tests**

```bash
./gradlew api:test --tests "app.teambalance.ArchitectureTest"
```

Expected: PASS (all rules pass because no violating code exists yet).

**Step 3: Commit**

```bash
git add api/src/test/kotlin/app/teambalance/ArchitectureTest.kt
git commit -m "feat: add ArchUnit tests enforcing hexagonal DDD layer boundaries"
```

---

## Task 7: flock-detekt setup

**Files:**
- Modify: `api/build.gradle.kts` (add detekt plugin + flock-detekt dependency)
- Create: `api/detekt.yml`

**Step 1: Add detekt plugin to root `build.gradle.kts`**

Add to the `plugins` block in root `build.gradle.kts`:

```kotlin
id("io.gitlab.arturbosch.detekt") version "1.23.7" apply false
```

**Step 2: Add detekt configuration to `api/build.gradle.kts`**

Append to `api/build.gradle.kts`:

```kotlin
plugins {
    // ... existing plugins ...
    id("io.gitlab.arturbosch.detekt")
}

// ... existing config ...

detekt {
    buildUponDefaultConfig = true
    config.setFrom(files("$projectDir/detekt.yml"))
}

dependencies {
    // ... existing dependencies ...
    detektPlugins("community.flock.detekt:flock-detekt:0.3.0")
}
```

Note: The full `api/build.gradle.kts` should have the detekt plugin added to the plugins block and the detektPlugins dependency added to the dependencies block alongside the existing content from Task 3.

**Step 3: Create `api/detekt.yml`**

```yaml
build:
  maxIssues: 0

complexity:
  LongMethod:
    threshold: 30
  LongParameterList:
    functionThreshold: 8
    constructorThreshold: 10

style:
  MaxLineLength:
    maxLineLength: 140

# flock-detekt rules are auto-enabled via the plugin dependency
```

**Step 4: Run detekt**

```bash
./gradlew api:detekt
```

Expected: BUILD SUCCESSFUL (no violations in the minimal codebase).

**Step 5: Commit**

```bash
git add api/build.gradle.kts api/detekt.yml build.gradle.kts
git commit -m "feat: add flock-detekt for Kotlin static analysis"
```

---

## Task 8: Health check endpoint (verify the backend serves requests)

**Files:**
- Create: `api/src/main/kotlin/app/teambalance/interfaces/HealthController.kt`
- Create: `api/src/test/kotlin/app/teambalance/interfaces/HealthControllerTest.kt`

**Step 1: Write the failing test**

```kotlin
package app.teambalance.interfaces

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class HealthControllerTest {

    companion object {
        @Container
        @JvmStatic
        val postgres = PostgreSQLContainer("postgres:17-alpine")

        @DynamicPropertySource
        @JvmStatic
        fun configureProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.data.redis.host") { "localhost" }
            registry.add("spring.data.redis.port") { "6379" }
            registry.add("spring.session.store-type") { "none" }
        }
    }

    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun `GET api health returns 200`() {
        mockMvc.get("/api/health")
            .andExpect {
                status { isOk() }
                jsonPath("$.status") { value("UP") }
            }
    }
}
```

**Step 2: Run test to verify it fails**

```bash
./gradlew api:test --tests "app.teambalance.interfaces.HealthControllerTest"
```

Expected: FAIL — no handler for `/api/health`.

**Step 3: Write the controller**

```kotlin
package app.teambalance.interfaces

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthController {

    @GetMapping("/api/health")
    fun health() = mapOf("status" to "UP")
}
```

**Step 4: Run test to verify it passes**

```bash
./gradlew api:test --tests "app.teambalance.interfaces.HealthControllerTest"
```

Expected: PASS

**Step 5: Commit**

```bash
git add api/src/main/kotlin/app/teambalance/interfaces/ api/src/test/kotlin/app/teambalance/interfaces/
git commit -m "feat: add health check endpoint"
```

---

## Task 9: Wirespec pipeline

**Files:**
- Create: `api/src/main/wirespec/health.ws`
- Modify: `api/build.gradle.kts` (add Wirespec compile tasks)

**Step 1: Create the first Wirespec definition**

```wirespec
// Health check — verifies API is reachable and running
endpoint HealthCheck GET /api/health -> {
    200 -> HealthStatus
}

type HealthStatus {
    status: String
}
```

Create: `api/src/main/wirespec/health.ws`

**Step 2: Configure Wirespec Gradle tasks in `api/build.gradle.kts`**

Add after existing configuration:

```kotlin
import community.flock.wirespec.plugin.gradle.CompileWirespecTask
import community.flock.wirespec.plugin.Language

tasks.register<CompileWirespecTask>("wirespec-kotlin") {
    description = "Compile Wirespec to Kotlin"
    group = "wirespec"
    input = layout.projectDirectory.dir("src/main/wirespec")
    output = layout.buildDirectory.dir("generated/wirespec/kotlin")
    packageName.set("app.teambalance.interfaces.generated")
    languages.set(listOf(Language.Kotlin))
    shared.set(true)
    strict.set(true)
}

tasks.register<CompileWirespecTask>("wirespec-typescript") {
    description = "Compile Wirespec to TypeScript"
    group = "wirespec"
    input = layout.projectDirectory.dir("src/main/wirespec")
    // Output goes to the frontend project's generated directory
    output = rootProject.layout.projectDirectory.dir("app/src/shared/api/generated")
    languages.set(listOf(Language.TypeScript))
    shared.set(true)
    strict.set(true)
}

sourceSets {
    main {
        kotlin {
            srcDir(layout.buildDirectory.dir("generated/wirespec/kotlin"))
        }
    }
}

tasks.named("compileKotlin") {
    dependsOn("wirespec-kotlin")
}
```

**Step 3: Generate Kotlin code**

```bash
./gradlew api:wirespec-kotlin
```

Expected: BUILD SUCCESSFUL — generated Kotlin interfaces in `api/build/generated/wirespec/kotlin/`.

**Step 4: Generate TypeScript types**

```bash
./gradlew api:wirespec-typescript
```

Expected: BUILD SUCCESSFUL — generated TypeScript in `app/src/shared/api/generated/`.

**Step 5: Verify backend still compiles with generated code**

```bash
./gradlew api:compileKotlin
```

Expected: BUILD SUCCESSFUL

**Step 6: Commit**

```bash
git add api/src/main/wirespec/ api/build.gradle.kts
git commit -m "feat: add Wirespec pipeline with Kotlin + TypeScript generation"
```

---

## Task 10: Frontend — Vite + React skeleton with FSD

**Files:**
- Create: `app/package.json`
- Create: `app/tsconfig.json`
- Create: `app/vite.config.ts`
- Create: `app/index.html`
- Create: `app/src/app/index.tsx` (entry point)
- Create: `app/src/app/App.tsx`
- Create: `app/src/app/providers/index.tsx`
- Create: `app/src/app/styles/global.css`
- Create: FSD directory structure

**Step 1: Create `app/package.json`**

```json
{
  "name": "@teambalance/app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.62.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "eslint": "^9.17.0",
    "@eslint/js": "^9.17.0",
    "typescript-eslint": "^8.18.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-boundaries": "^5.0.0",
    "globals": "^15.14.0"
  }
}
```

**Step 2: Create `app/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "paths": {
      "@app/*": ["./src/app/*"],
      "@pages/*": ["./src/pages/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@shared/*": ["./src/shared/*"]
    },
    "baseUrl": "."
  },
  "include": ["src"]
}
```

**Step 3: Create `app/vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@widgets': resolve(__dirname, 'src/widgets'),
      '@features': resolve(__dirname, 'src/features'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

**Step 4: Create `app/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TeamBalance</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Grandstander:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/app/index.tsx"></script>
  </body>
</html>
```

**Step 5: Create FSD directory structure and entry files**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app/app
mkdir -p src/app/providers src/app/styles
mkdir -p src/pages
mkdir -p src/widgets
mkdir -p src/features
mkdir -p src/entities
mkdir -p src/shared/api/generated src/shared/ui src/shared/lib src/shared/config
```

Create `app/src/app/styles/global.css`:

```css
@import "tailwindcss";
@import "../../../../design-tokens/tokens.css";

@theme {
  --font-display: 'Grandstander', cursive;
  --font-body: 'DM Sans', sans-serif;
  --color-background: #F8F6F0;
  --color-card: #FEFDFB;
  --color-blue: #225C9C;
  --color-green: #249E6C;
  --color-gold: #F4B400;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-text-primary, #1E293B);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

Create `app/src/app/providers/index.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

Create `app/src/app/App.tsx`:

```tsx
import { Providers } from './providers'

export function App() {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-md px-4 py-8">
          <h1 className="font-display text-4xl font-bold text-blue">
            Team<span className="text-green">Balance</span>
          </h1>
          <p className="mt-4 text-text-secondary">
            Foundation is up and running.
          </p>
        </main>
      </div>
    </Providers>
  )
}
```

Create `app/src/app/index.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Step 6: Install dependencies and verify it builds**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app/app
npm install
npm run build
```

Expected: Build succeeds, outputs to `dist/`.

**Step 7: Commit**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app
git add app/
git commit -m "feat: add Vite + React frontend skeleton with FSD structure and design tokens"
```

---

## Task 11: ESLint with FSD boundary enforcement

**Files:**
- Create: `app/eslint.config.js`

**Step 1: Create `app/eslint.config.js`**

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import boundaries from 'eslint-plugin-boundaries'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'src/shared/api/generated'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/*' },
        { type: 'pages', pattern: 'src/pages/*' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'entities', pattern: 'src/entities/*' },
        { type: 'shared', pattern: 'src/shared/*' },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // FSD: layers can only import from same layer or layers below
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // app can import from anything
            { from: 'app', allow: ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] },
            // pages can import from widgets, features, entities, shared
            { from: 'pages', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
            // widgets can import from features, entities, shared
            { from: 'widgets', allow: ['widgets', 'features', 'entities', 'shared'] },
            // features can import from entities, shared
            { from: 'features', allow: ['features', 'entities', 'shared'] },
            // entities can import from shared only
            { from: 'entities', allow: ['entities', 'shared'] },
            // shared can only import from shared
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },
)
```

**Step 2: Run lint**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app/app
npx eslint .
```

Expected: No errors.

**Step 3: Commit**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app
git add app/eslint.config.js
git commit -m "feat: add ESLint config with FSD boundary enforcement via eslint-plugin-boundaries"
```

---

## Task 12: Landing page (www)

**Files:**
- Create: `www/index.html`
- Create: `www/style.css`

**Step 1: Create `www/index.html`**

A minimal landing page that uses the shared design tokens.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TeamBalance — Team Management for Sports Clubs</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Grandstander:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../design-tokens/tokens.css" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main class="hero">
      <h1 class="wordmark">Team<span class="green">Balance</span></h1>
      <p class="tagline">Event attendance and shared money pool for sports teams.</p>
      <a href="https://app.teambalance.app" class="cta">Open App</a>
    </main>
  </body>
</html>
```

**Step 2: Create `www/style.css`**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}

.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.wordmark {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-blue);
}

.wordmark .green {
  color: var(--color-green);
}

.tagline {
  margin-top: 1rem;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  max-width: 28rem;
}

.cta {
  margin-top: 2rem;
  display: inline-block;
  padding: 0.875rem 2rem;
  background-color: var(--color-blue);
  color: var(--color-text-inverse);
  font-weight: 600;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background-color var(--duration-fast) ease;
  box-shadow: var(--shadow-md);
}

.cta:hover {
  background-color: var(--color-blue-light);
  box-shadow: var(--shadow-lg);
}
```

**Step 3: Open in browser to verify**

```bash
open /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app/www/index.html
```

Expected: Centered landing page with "TeamBalance" wordmark in Grandstander, tagline, and blue CTA button on warm cream background.

**Step 4: Commit**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app
git add www/
git commit -m "feat: add minimal landing page with shared design tokens"
```

---

## Task 13: Makefile + Docker Compose for local dev

**Files:**
- Create: `Makefile`
- Create: `docker-compose.yml`

**Step 1: Create `docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: teambalance
      POSTGRES_USER: teambalance
      POSTGRES_PASSWORD: teambalance
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

**Step 2: Create `Makefile`**

```makefile
.PHONY: *

# The first command will be invoked with `make` only and should be `build`
build: ## Build everything
	./gradlew build
	cd app && npm run build

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# --- Infrastructure ---

db: ## Start PostgreSQL only
	docker compose up -d postgres

infra: ## Start all local infrastructure (PostgreSQL + Redis)
	docker compose up -d

infra-down: ## Stop local infrastructure
	docker compose down

# --- Run ---

api: ## Run the backend API
	./gradlew :api:bootRun --args='--spring.profiles.active=dev'

app: ## Run the frontend dev server
	cd app && npm run dev

run-local: infra ## Start infra + backend + frontend (backend in background)
	$(MAKE) api &
	$(MAKE) app

www: ## Open the landing page
	open www/index.html

# --- Test & Lint ---

test: ## Run all tests
	./gradlew :api:test
	cd app && npm test

test-api: ## Run backend tests only
	./gradlew :api:test

test-app: ## Run frontend tests only
	cd app && npm test

lint: ## Lint everything
	./gradlew :api:detekt
	cd app && npm run lint

format: ## Auto-format code
	./gradlew :api:detekt --auto-correct
	cd app && npm run lint -- --fix

# --- Code generation ---

wirespec: ## Generate code from Wirespec definitions
	./gradlew :api:generateWirespec

# --- Shortcuts ---

yolo: ## Fast build, skip tests and linting
	./gradlew build -x test -x detekt
	cd app && npm run build

clean: ## Clean build artifacts
	./gradlew clean
	cd app && rm -rf dist node_modules/.vite

update: ## Check for dependency updates
	./gradlew dependencyUpdates
	cd app && npx npm-check-updates
```

**Step 3: Verify**

```bash
make help
```

Expected: Prints all targets with descriptions.

**Step 4: Commit**

```bash
git add Makefile docker-compose.yml
git commit -m "feat: add Makefile and Docker Compose for local development"
```

---

## Task 14: Smoke test — full stack verification

This task verifies everything works end-to-end.

**Step 1: Run all backend tests**

```bash
./gradlew api:test
```

Expected: All tests pass (FlywayMigrationTest, TenantSchemaManagerTest, ArchitectureTest, HealthControllerTest).

**Step 2: Run detekt**

```bash
./gradlew api:detekt
```

Expected: BUILD SUCCESSFUL, no violations.

**Step 3: Run frontend build + lint**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app/app
npm run build && npm run lint && npm run typecheck
```

Expected: All pass.

**Step 4: Run Wirespec generation**

```bash
cd /Users/julius.van.dis/IdeaProjects/Personal/teambalance-app
make wirespec
```

Expected: Both Kotlin and TypeScript generated.

**Step 5: Commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: smoke test fixes"
```

Only commit if there were actual fixes. Skip if everything passed cleanly.

---

## Summary

| Task | What it delivers |
|------|-----------------|
| 1 | Gradle monorepo with git, modules, wrapper |
| 2 | Design tokens (CSS + Tailwind preset) |
| 3 | Spring Boot 4 backend skeleton |
| 4 | Platform schema migration (teams, users, members) |
| 5 | Tenant schema + multitenancy infra |
| 6 | ArchUnit hexagonal DDD guardrails |
| 7 | flock-detekt static analysis |
| 8 | Health check endpoint (TDD) |
| 9 | Wirespec pipeline (Kotlin + TypeScript) |
| 10 | Vite + React + FSD skeleton |
| 11 | ESLint with FSD boundary rules |
| 12 | Landing page (plain HTML) |
| 13 | Makefile + Docker Compose |
| 14 | Full-stack smoke test |

After Phase 1, Phase 2 (Core Event Loop) can immediately start building the event domain, API endpoints, and frontend pages.