package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.shouldBe
import org.flywaydb.core.Flyway
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.jdbc.core.JdbcTemplate
import javax.sql.DataSource

private const val WITHOUT_GRANT = "bunq_pick_pending_without_grant"
private const val WITH_GRANT = "bunq_pick_pending_with_grant"

/**
 * V021 makes the grant mandatory and the account optional. A connection row without a grant (the dev
 * demo seed wrote one) cannot be used any more, so it is deleted; a row with a grant stays as it was.
 * Every tenant is migrated at startup, so the migration must not fail on either.
 */
class BunqConnectionPickPendingMigrationIT : TeamBalanceIT() {

    @Autowired
    lateinit var dataSource: DataSource

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        test("deletes a connection without a grant, keeps one with a grant, and then allows no account but no missing grant") {
            migrateToV020(WITHOUT_GRANT)
            migrateToV020(WITH_GRANT)
            jdbcTemplate.update(
                "INSERT INTO $WITHOUT_GRANT.bunq_connection (id, bunq_account_id, connected_at) VALUES (1, 'demo-account', now())",
            )
            jdbcTemplate.update(
                "INSERT INTO $WITH_GRANT.bunq_connection (id, bunq_account_id, connected_at, access_token_encrypted, connected_by) " +
                    "VALUES (1, 'acc-1', now(), 'sealed', gen_random_uuid())",
            )

            tenantSchemaAdapter.provisionTenantSchema(WITHOUT_GRANT)
            tenantSchemaAdapter.provisionTenantSchema(WITH_GRANT)

            rows(WITHOUT_GRANT) shouldBe 0
            rows(WITH_GRANT) shouldBe 1
            jdbcTemplate.update(
                "INSERT INTO $WITHOUT_GRANT.bunq_connection (id, bunq_account_id, connected_at, access_token_encrypted, connected_by) " +
                    "VALUES (1, NULL, now(), 'sealed', gen_random_uuid())",
            )
            shouldThrow<DataIntegrityViolationException> {
                jdbcTemplate.update("UPDATE $WITHOUT_GRANT.bunq_connection SET access_token_encrypted = NULL WHERE id = 1")
            }
        }
    }

    private fun migrateToV020(schema: String) {
        jdbcTemplate.execute("DROP SCHEMA IF EXISTS $schema CASCADE")
        jdbcTemplate.execute("CREATE SCHEMA $schema")
        Flyway.configure()
            .dataSource(dataSource)
            .schemas(schema)
            .locations("classpath:db/tenant-migration")
            .table("flyway_tenant_schema_history")
            .target("20")
            .load()
            .migrate()
    }

    private fun rows(schema: String) =
        jdbcTemplate.queryForObject("SELECT count(*) FROM $schema.bunq_connection", Int::class.java)!!
}
