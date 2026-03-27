# Kotest Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace JUnit 5 with Kotest `FunSpec` across all four test files and introduce a shared `TeamBalanceIT` abstract base class that boots Spring + real Postgres/Redis Testcontainers once per suite.

**Architecture:** `TeamBalanceIT` carries `@SpringBootTest`, `@ApplyExtension(SpringExtension::class)`, and a `@ContextConfiguration(initializers)` that wires dynamic container ports into Spring before the context starts. Postgres and Redis containers live as JVM singletons in a `companion object` — started once, reused by all subclasses. Spring's context cache sees the same initializer key across subclasses and reuses the application context. `ArchitectureTest` stays a plain `FunSpec` with no Spring or containers.

**Tech Stack:** Kotlin 2.3, Spring Boot 4, Kotest 5.x (`FunSpec`, `kotest-runner-junit5`, `kotest-assertions-core`), `kotest-extensions-spring`, Testcontainers (`PostgreSQLContainer`, `GenericContainer` for Redis).

---

### Task 1: Add Kotest dependencies

**Files:**
- Modify: `gradle.properties`
- Modify: `api/build.gradle.kts`

**Step 1: Add `kotestVersion` to `gradle.properties`**

Append after the `archunitVersion` line:

```properties
kotestVersion=5.9.1
kotestSpringExtensionVersion=1.3.0
```

> Check [Maven Central](https://central.sonatype.com/artifact/io.kotest/kotest-runner-junit5) for the latest stable `5.x` version before using these.

**Step 2: Replace/add test dependencies in `api/build.gradle.kts`**

Replace the testing block (lines 54-62) with:

```kotlin
    // Testing — Kotest
    val kotestVersion: String by project
    val kotestSpringExtensionVersion: String by project
    testImplementation("io.kotest:kotest-runner-junit5:$kotestVersion")
    testImplementation("io.kotest:kotest-assertions-core:$kotestVersion")
    testImplementation("io.kotest.extensions:kotest-extensions-spring:$kotestSpringExtensionVersion")

    // Testing — Spring + Testcontainers
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation(platform("org.testcontainers:testcontainers-bom:$testcontainersVersion"))
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:testcontainers")  // GenericContainer for Redis
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")

    // Testing — ArchUnit
    testImplementation("com.tngtech.archunit:archunit-junit5:$archunitVersion")
```

Note: `kotlin("test")` is removed — `kotest-assertions-core` replaces it.

**Step 3: Verify the build compiles**

```bash
cd api && ./gradlew compileTestKotlin
```

Expected: `BUILD SUCCESSFUL` — no source changes yet, just new dependencies resolved.

**Step 4: Commit**

```bash
git add gradle.properties api/build.gradle.kts
git commit -m "chore: add Kotest and Redis testcontainers dependencies"
```

---

### Task 2: Create `TeamBalanceIT` abstract base class

**Files:**
- Create: `api/src/test/kotlin/com/github/zzave/teambalance/api/TeamBalanceIT.kt`

**Step 1: Create the file**

```kotlin
package com.github.zzave.teambalance.api

import io.kotest.core.annotation.ApplyExtension
import io.kotest.core.spec.style.FunSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.support.TestPropertyValues
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

@SpringBootTest
@ApplyExtension(SpringExtension::class)
@ContextConfiguration(initializers = [TeamBalanceIT.Initializer::class])
abstract class TeamBalanceIT : FunSpec() {

    companion object {
        val postgres: PostgreSQLContainer<*> = PostgreSQLContainer("postgres:17-alpine")
            .also { it.start() }

        val redis: GenericContainer<*> = GenericContainer(DockerImageName.parse("redis:7-alpine"))
            .withExposedPorts(6379)
            .also { it.start() }
    }

    class Initializer : ApplicationContextInitializer<ConfigurableApplicationContext> {
        override fun initialize(ctx: ConfigurableApplicationContext) {
            TestPropertyValues.of(
                "spring.datasource.url=${postgres.jdbcUrl}",
                "spring.datasource.username=${postgres.username}",
                "spring.datasource.password=${postgres.password}",
                "spring.data.redis.host=${redis.host}",
                "spring.data.redis.port=${redis.getMappedPort(6379)}",
            ).applyTo(ctx)
        }
    }
}
```

Key points:
- `companion object` values are JVM statics — containers start once for the entire test process.
- `withExposedPorts(6379)` binds a random free host port; `getMappedPort(6379)` returns it.
- `TestPropertyValues.of(...).applyTo(ctx)` is Spring Test's equivalent of `@DynamicPropertySource` for `ApplicationContextInitializer`.
- `Initializer` references `postgres` and `redis` from the companion (accessible as `TeamBalanceIT.postgres` / `TeamBalanceIT.redis` statically).

**Step 2: Verify compilation**

```bash
cd api && ./gradlew compileTestKotlin
```

Expected: `BUILD SUCCESSFUL`

**Step 3: Commit**

```bash
git add api/src/test/kotlin/com/github/zzave/teambalance/api/TeamBalanceIT.kt
git commit -m "feat: add TeamBalanceIT abstract base class with Kotest + Spring + Testcontainers"
```

---

### Task 3: Migrate `ArchitectureTest`

**Files:**
- Modify: `api/src/test/kotlin/com/github/zzave/teambalance/api/ArchitectureTest.kt`

This test has no Spring context and no containers. It is a pure ArchUnit check. Each `@Test` method becomes a `test("...")` block inside an `init {}`.

**Step 1: Replace the file content**

```kotlin
package com.github.zzave.teambalance.api

import com.tngtech.archunit.core.importer.ClassFileImporter
import com.tngtech.archunit.core.importer.ImportOption
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses
import io.kotest.core.spec.style.FunSpec

class ArchitectureTest : FunSpec() {

    companion object {
        private val classes by lazy {
            ClassFileImporter()
                .withImportOption(ImportOption.DoNotIncludeTests())
                .importPackages("com.github.zzave.teambalance.api")
        }
    }

    init {
        test("domain must not depend on infrastructure") {
            noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("domain must not depend on interfaces") {
            noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat().resideInAPackage("..interfaces..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("domain must not depend on Spring") {
            noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat().resideInAPackage("org.springframework..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("application must not depend on infrastructure") {
            noClasses()
                .that().resideInAPackage("..application..")
                .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("application must not depend on interfaces") {
            noClasses()
                .that().resideInAPackage("..application..")
                .should().dependOnClassesThat().resideInAPackage("..interfaces..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("interfaces must not depend on infrastructure") {
            noClasses()
                .that().resideInAPackage("..interfaces..")
                .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
                .allowEmptyShould(true)
                .check(classes)
        }
    }
}
```

Note: ArchUnit violations throw exceptions — Kotest treats any thrown exception as a test failure, so no special assertion wrapper is needed.

**Step 2: Run just this test**

```bash
cd api && ./gradlew test --tests "com.github.zzave.teambalance.api.ArchitectureTest"
```

Expected: `BUILD SUCCESSFUL`, 6 tests pass.

**Step 3: Commit**

```bash
git add api/src/test/kotlin/com/github/zzave/teambalance/api/ArchitectureTest.kt
git commit -m "refactor: migrate ArchitectureTest to Kotest FunSpec"
```

---

### Task 4: Migrate `FlywayMigrationTest`

**Files:**
- Modify: `api/src/test/kotlin/com/github/zzave/teambalance/api/infrastructure/FlywayMigrationTest.kt`

**Step 1: Replace the file content**

```kotlin
package com.github.zzave.teambalance.api.infrastructure

import com.github.zzave.teambalance.api.TeamBalanceIT

class FlywayMigrationTest : TeamBalanceIT() {

    init {
        test("flyway migrations run successfully") {
            // If we get here, Spring Boot started and Flyway ran all migrations
        }
    }
}
```

All `@SpringBootTest`, `@Testcontainers`, `@Container`, `@DynamicPropertySource` boilerplate is gone — inherited from `TeamBalanceIT`.

**Step 2: Run just this test**

```bash
cd api && ./gradlew test --tests "com.github.zzave.teambalance.api.infrastructure.FlywayMigrationTest"
```

Expected: `BUILD SUCCESSFUL`, 1 test passes. Spring context should start (you'll see Testcontainer logs on first run).

**Step 3: Commit**

```bash
git add api/src/test/kotlin/com/github/zzave/teambalance/api/infrastructure/FlywayMigrationTest.kt
git commit -m "refactor: migrate FlywayMigrationTest to Kotest + TeamBalanceIT"
```

---

### Task 5: Migrate `TenantSchemaManagerTest`

**Files:**
- Modify: `api/src/test/kotlin/com/github/zzave/teambalance/api/infrastructure/multitenancy/TenantSchemaManagerTest.kt`

**Step 1: Replace the file content**

Assertions change from `kotlin.test.assertTrue` to `kotest-assertions-core` `shouldContain`.

```kotlin
package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.collections.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate

class TenantSchemaManagerTest : TeamBalanceIT() {

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    init {
        test("provisioning a tenant creates schema with all tables") {
            tenantSchemaManager.provisionTenantSchema("team_test_team")

            val tables = jdbcTemplate.queryForList(
                """
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = 'team_test_team'
                ORDER BY table_name
                """,
                String::class.java,
            )

            tables shouldContain "events"
            tables shouldContain "attendances"
            tables shouldContain "transactions"
            tables shouldContain "event_types"
        }
    }
}
```

Note: `@Autowired lateinit var` works as-is with Kotest's `SpringExtension` — Spring injects into fields after context creation.

**Step 2: Run just this test**

```bash
cd api && ./gradlew test --tests "com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaManagerTest"
```

Expected: `BUILD SUCCESSFUL`, 1 test passes.

**Step 3: Commit**

```bash
git add api/src/test/kotlin/com/github/zzave/teambalance/api/infrastructure/multitenancy/TenantSchemaManagerTest.kt
git commit -m "refactor: migrate TenantSchemaManagerTest to Kotest + TeamBalanceIT"
```

---

### Task 6: Migrate `HealthControllerTest`

**Files:**
- Modify: `api/src/test/kotlin/com/github/zzave/teambalance/api/interfaces/HealthControllerTest.kt`

**Step 1: Replace the file content**

`@AutoConfigureMockMvc` is added on the subclass — Spring picks it up because `SpringExtension` processes annotations on the spec class.

```kotlin
package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@AutoConfigureMockMvc
class HealthControllerTest : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("GET api/health returns 200") {
            mockMvc.get("/api/health")
                .andExpect {
                    status { isOk() }
                    jsonPath("$.status") { value("UP") }
                }
        }
    }
}
```

> **Important:** `@AutoConfigureMockMvc` on a subclass changes the Spring context configuration key, which means Spring will create a **separate** context for this test (with MockMvc configured). This is expected and correct — the Flyway/TenantSchema tests don't need MockMvc, and `HealthControllerTest` does. Two contexts will start total (both reused if more tests are added to either group).

**Step 2: Run just this test**

```bash
cd api && ./gradlew test --tests "com.github.zzave.teambalance.api.interfaces.HealthControllerTest"
```

Expected: `BUILD SUCCESSFUL`, 1 test passes.

**Step 3: Commit**

```bash
git add api/src/test/kotlin/com/github/zzave/teambalance/api/interfaces/HealthControllerTest.kt
git commit -m "refactor: migrate HealthControllerTest to Kotest + TeamBalanceIT"
```

---

### Task 7: Full suite verification and cleanup

**Step 1: Run the complete test suite**

```bash
cd api && ./gradlew test
```

Expected: `BUILD SUCCESSFUL`, all tests pass. You should see Testcontainers start Postgres and Redis once (not once per test class for the shared-context group).

**Step 2: Verify no JUnit annotations remain in test sources**

```bash
grep -r "org.junit.jupiter.api.Test" api/src/test/
```

Expected: no output (no matches).

**Step 3: Verify no old Testcontainers JUnit annotations remain**

```bash
grep -r "@Testcontainers\|@Container\|@DynamicPropertySource" api/src/test/
```

Expected: no output.

**Step 4: Close GitHub issue**

```bash
gh issue close 4 --repo ZzAve/teambalance-app --comment "Migrated all tests to Kotest FunSpec. TeamBalanceIT base class wires real Postgres + Redis Testcontainers with dynamic ports. Spring context reused across subclasses."
```

**Step 5: Final commit (if any cleanup was needed)**

```bash
git add -A
git commit -m "chore: verify full Kotest migration — all tests green"
```