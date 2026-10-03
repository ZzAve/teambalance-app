package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.shouldBe
import org.flywaydb.core.Flyway
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import javax.sql.DataSource

private const val SCHEMA = "substitute_name_migration"

/**
 * V011 adds a unique index on a Substitute's name, but slices 1 and 2 of #359 shipped without that
 * rule, so a Team may already hold "Jan" twice. Every tenant is migrated at startup, so a failing
 * V011 would stop the app from booting. This spec stops a schema at V010, writes the duplicates the
 * old code allowed, and runs the rest the way startup does.
 */
class SubstituteNameMigrationIT : TeamBalanceIT() {

    @Autowired
    lateinit var dataSource: DataSource

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("names already on the list twice are told apart before the unique index is created") {
            jdbcTemplate.execute("DROP SCHEMA IF EXISTS $SCHEMA CASCADE")
            jdbcTemplate.execute("CREATE SCHEMA $SCHEMA")
            Flyway.configure()
                .dataSource(dataSource)
                .schemas(SCHEMA)
                .locations("classpath:db/tenant-migration")
                .table("flyway_tenant_schema_history")
                .target("10")
                .load()
                .migrate()
            listOf("Jan", "jan", "Sam", "JAN").forEachIndexed { i, name ->
                jdbcTemplate.update(
                    "INSERT INTO $SCHEMA.substitutes (id, name, created_by, created_at) " +
                        "VALUES (gen_random_uuid(), ?, gen_random_uuid(), TIMESTAMPTZ '2026-09-01 12:00' + make_interval(mins => ?))",
                    name,
                    i,
                )
            }

            tenantSchemaAdapter.provisionTenantSchema(SCHEMA)

            jdbcTemplate.queryForList("SELECT name FROM $SCHEMA.substitutes ORDER BY created_at", String::class.java) shouldBe
                listOf("Jan", "jan (2)", "Sam", "JAN (3)")
        }
    }
}
