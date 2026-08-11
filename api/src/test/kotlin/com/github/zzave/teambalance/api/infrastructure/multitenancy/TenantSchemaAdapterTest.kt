package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate

class TenantSchemaAdapterTest : TeamBalanceIT() {

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    init {
        test("provisioning a tenant creates schema with all tables") {
            tenantSchemaAdapter.provisionTenantSchema("team_test_team")

            val tables = jdbcTemplate.queryForList(
                """
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = 'team_test_team'
                ORDER BY table_name
                """,
                String::class.java,
            )

            tables.shouldContainExactlyInAnyOrder(
                "attendances",
                "event_audience",
                "event_references",
                "event_types",
                "events",
                "flyway_tenant_schema_history",
                "team_settings",
                "transactions",
            )
        }
    }
}
