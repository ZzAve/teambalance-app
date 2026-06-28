# Design: Migrate Tests to Kotest FunSpec + Shared TeamBalanceIT Base Class

**Date:** 2026-03-21
**Issue:** [#4](https://github.com/ZzAve/teambalance-app/issues/4)
**Status:** Approved

## Context

The four existing integration tests each duplicate the same `companion object` boilerplate: a `PostgreSQLContainer`, a `@DynamicPropertySource` binding its URL/credentials into Spring, and a Redis bypass (`spring.session.store-type=none`). Redis is never actually tested. The goal is to:

1. Replace JUnit 5 `@Test` with Kotest `FunSpec` across all test files.
2. Consolidate the Testcontainers/Spring wiring into a single abstract base class `TeamBalanceIT`.
3. Spin up real Postgres and Redis containers (dynamic ports) shared across all integration tests.
4. Promote Spring context reuse so the application context is started once per suite.

## Approach

**Approach 2 — `@ApplyExtension` on the abstract class.**

Containers are JVM singletons in `TeamBalanceIT`'s `companion object`, started once via `.also { it.start() }`. Spring property injection is handled by an inner `Initializer` class implementing `ApplicationContextInitializer`, referenced via `@ContextConfiguration(initializers)`. Because every subclass inherits the same annotations and the same initializer, Spring's context cache sees a single cache key and reuses the context.

`ArchitectureTest` is a plain `FunSpec` — no Spring, no containers.

## Dependencies

Add to `api/build.gradle.kts` `testImplementation`:

| Artifact | Purpose |
|---|---|
| `io.kotest:kotest-runner-junit5` | Kotest JUnit 5 runner (keeps `useJUnitPlatform()`) |
| `io.kotest:kotest-assertions-core` | Kotest assertions (replaces `kotlin.test`) |
| `io.kotest.extensions:kotest-extensions-spring` | `SpringExtension` + `@ApplyExtension` |
| `org.testcontainers:redis` | Redis Testcontainer (via existing BOM) |

Remove: `testImplementation(kotlin("test"))` — replaced by `kotest-assertions-core`.

Add `kotestVersion` to `gradle.properties`.

## TeamBalanceIT

```kotlin
package com.github.zzave.teambalance.api

import io.kotest.core.spec.style.FunSpec
import io.kotest.extensions.spring.SpringExtension
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.ApplicationContextInitializer
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.test.context.ContextConfiguration
import org.testcontainers.containers.GenericContainer
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

@SpringBootTest
@ApplyExtension(SpringExtension::class)
@ContextConfiguration(initializers = [TeamBalanceIT.Initializer::class])
abstract class TeamBalanceIT : FunSpec() {

    companion object {
        val postgres = PostgreSQLContainer("postgres:17-alpine").also { it.start() }
        val redis = GenericContainer(DockerImageName.parse("redis:7-alpine"))
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
- `withExposedPorts(6379)` causes Testcontainers to bind a **random free host port** at startup — no port conflicts.
- `getMappedPort(6379)` retrieves that dynamic host port for Spring injection.
- `companion object` guarantees containers start once for the JVM process lifetime.

## Per-File Migration

| File | Base class | Notes |
|---|---|---|
| `ArchitectureTest` | `FunSpec()` directly | No Spring, no containers; each `@Test` → `test("...")` block |
| `FlywayMigrationTest` | `TeamBalanceIT()` | Single smoke test — Spring startup = migrations ran |
| `TenantSchemaManagerTest` | `TeamBalanceIT()` | `@Autowired` → constructor injection via `@Autowired lateinit var` retained |
| `HealthControllerTest` | `TeamBalanceIT()` | Add `@AutoConfigureMockMvc` on subclass; `@Autowired lateinit var mockMvc` retained |

## Assertions

- `ArchitectureTest`: Kotest has no direct ArchUnit assertion sugar — keep plain ArchUnit `check(classes)` calls inside `test` blocks (they throw on violation, which Kotest handles).
- `TenantSchemaManagerTest`: Replace `kotlin.test.assertTrue` with `kotest-assertions-core` `shouldContain` / `shouldBe`.
- `HealthControllerTest`: MockMvc assertions stay unchanged (Spring's own DSL, no dependency on JUnit).

## Spring Context Reuse

All three `TeamBalanceIT` subclasses inherit identical `@SpringBootTest` + `@ContextConfiguration(initializers = [TeamBalanceIT.Initializer::class])`. Spring's `SmartContextLoader` caches by the full context configuration key; identical keys share one context. No `@DirtiesContext` needed.

## Out of Scope

- Adding new tests beyond the four listed in the issue.
- Migrating `detekt` or ArchUnit versions.
- Redis-specific test assertions (containers are wired; tests exercising Redis behaviour can be added later).