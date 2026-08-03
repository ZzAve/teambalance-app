package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import org.springframework.beans.factory.InitializingBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.jdbc.core.JdbcTemplate
import java.util.UUID

/**
 * Slice 1 — the startup tenant-migration runner iterates `public.teams` and migrates every tenant
 * schema to head on boot, so no team schema drifts behind (retires the manual docker-Flyway step).
 *
 * This test owns only the runner's unique behavior: that it reaches into `public.teams` and brings
 * *each* team's schema to head. The "a provisioned schema has all the right tables" contract is owned
 * one layer down by [TenantSchemaManagerTest] (the runner delegates to the same provisioning path),
 * so we don't re-assert table structure here.
 *
 * The behavior is driven through the runner's public entry point (not full boot) so the same harness
 * carries the isolate-and-continue / fail-fast cases; provisioning is idempotent so re-invoking is
 * safe. A separate case asserts the boot wiring: that the runner actually ran during context refresh.
 */
class StartupTenantMigrationRunnerIT : TeamBalanceIT() {

    @Autowired
    lateinit var runner: StartupTenantMigrationRunner

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var applicationContext: ConfigurableApplicationContext

    init {
        test("migrates every tenant schema listed in public.teams to head") {
            val schemas = listOf(seedTeam(), seedTeam())

            runner.migrateAllTenantSchemas()

            val head = tenantMigrationsOnClasspath()
            for (schema in schemas) {
                appliedTenantMigrations(schema) shouldBe head
            }
        }

        test("is wired to run at startup, after the platform schema is provisioned") {
            // The runner closes the boot-time migration race, so it must run during context refresh
            // (InitializingBean) and only after PlatformSchemaInitializer has created public.teams.
            // We assert the wiring, not a DB side effect: the happy-path test above already invokes
            // migrateAllTenantSchemas() manually and provisions every team, so any schema-state signal
            // here would pass with or without the boot hook. The wiring is the only honest signal.
            runner.shouldBeInstanceOf<InitializingBean>()

            applicationContext.beanFactory
                .getBeanDefinition("startupTenantMigrationRunner")
                .dependsOn.orEmpty().toList() shouldContain "platformSchemaInitializer"
        }
    }

    /** Inserts a memberless team with a fresh, unique schema name and returns that schema name. */
    private fun seedTeam(): String {
        val token = UUID.randomUUID().toString().replace("-", "").take(12)
        val schema = "team_s1_$token"
        jdbcTemplate.update(
            "INSERT INTO public.teams (name, slug, schema_name) VALUES (?, ?, ?)",
            "Slice1 $token",
            "slice1-$token",
            schema,
        )
        return schema
    }

    /**
     * Number of versioned migrations successfully applied in [schema] (baseline excluded). Throws if
     * the schema was never provisioned — a runner that skips a team therefore fails this test loudly.
     */
    private fun appliedTenantMigrations(schema: String): Int = jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM \"$schema\".flyway_tenant_schema_history " +
            "WHERE success = true AND version IS NOT NULL AND \"type\" <> 'BASELINE'",
        Int::class.java,
    ) ?: 0

    /**
     * Parity source of truth: the versioned migrations the runner actually points at
     * (`classpath:db/tenant-migration`). Derived from the folder so adding a migration keeps this
     * test honest without editing a magic number.
     */
    private fun tenantMigrationsOnClasspath(): Int =
        PathMatchingResourcePatternResolver()
            .getResources("classpath*:db/tenant-migration/V*__*.sql")
            .size
}
