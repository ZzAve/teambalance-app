package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import io.kotest.matchers.collections.shouldContain

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

        tables shouldContain "events"
        tables shouldContain "attendances"
        tables shouldContain "transactions"
        tables shouldContain "event_types"
    }
}
