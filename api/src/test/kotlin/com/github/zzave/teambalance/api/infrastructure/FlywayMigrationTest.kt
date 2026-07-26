package com.github.zzave.teambalance.api.infrastructure

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.collections.shouldContainAll
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate

class FlywayMigrationTest : TeamBalanceIT() {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    init {
        test("platform schema is provisioned at application startup") {
            // No manual provisioning here on purpose: PlatformSchemaInitializer must have run
            // the public-schema migrations during startup. If it didn't, these tables are absent.
            val tables = jdbcTemplate.queryForList(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
                String::class.java,
            )
            tables shouldContainAll listOf(
                "users", "teams", "team_members", "invitations", "magic_link_tokens",
                "spring_session", "spring_session_attributes",
            )
        }
    }
}
