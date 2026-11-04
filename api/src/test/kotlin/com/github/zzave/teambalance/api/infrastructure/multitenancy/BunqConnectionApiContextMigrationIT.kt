package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.shouldBe
import org.flywaydb.core.Flyway
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import javax.sql.DataSource

private const val SCHEMA = "bunq_api_context_migration"

/**
 * V022 adds the encrypted Bunq API session to the connection row. It is optional, so a connection made before it exists
 * keeps working: its row is untouched, and the first read after the migration sets the session up and stores it.
 */
class BunqConnectionApiContextMigrationIT : TeamBalanceIT() {

    @Autowired
    lateinit var dataSource: DataSource

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("an existing connection keeps every column and gets an empty session that can be written") {
            migrateToV021()
            jdbcTemplate.update(
                "INSERT INTO $SCHEMA.bunq_connection (id, bunq_account_id, connected_at, access_token_encrypted, connected_by) " +
                    "VALUES (1, 'acc-1', '2026-10-28T12:00:00Z', 'sealed-grant', '00000000-0000-4000-8000-0000000000ad')",
            )

            tenantSchemaAdapter.provisionTenantSchema(SCHEMA)

            jdbcTemplate.queryForMap("SELECT bunq_account_id, access_token_encrypted, api_context_encrypted FROM $SCHEMA.bunq_connection")
                .let { Triple(it["bunq_account_id"], it["access_token_encrypted"], it["api_context_encrypted"]) } shouldBe
                Triple("acc-1", "sealed-grant", null)
            jdbcTemplate.update("UPDATE $SCHEMA.bunq_connection SET api_context_encrypted = 'sealed-session'") shouldBe 1
            jdbcTemplate.update("UPDATE $SCHEMA.bunq_connection SET api_context_encrypted = NULL") shouldBe 1
        }

        test("a team without a connection migrates without a row appearing") {
            migrateToV021()

            tenantSchemaAdapter.provisionTenantSchema(SCHEMA)

            jdbcTemplate.queryForObject("SELECT count(*) FROM $SCHEMA.bunq_connection", Int::class.java) shouldBe 0
        }
    }

    private fun migrateToV021() {
        jdbcTemplate.execute("DROP SCHEMA IF EXISTS $SCHEMA CASCADE")
        jdbcTemplate.execute("CREATE SCHEMA $SCHEMA")
        Flyway.configure()
            .dataSource(dataSource)
            .schemas(SCHEMA)
            .locations("classpath:db/tenant-migration")
            .table("flyway_tenant_schema_history")
            .target("21")
            .load()
            .migrate()
    }
}
