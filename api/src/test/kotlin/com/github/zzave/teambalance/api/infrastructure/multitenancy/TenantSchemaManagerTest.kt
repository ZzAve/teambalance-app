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
