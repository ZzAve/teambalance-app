package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_TYPES
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.assertions.throwables.shouldThrowAny
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldNotContain
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.support.TransactionTemplate
import java.util.UUID

class JooqTenantRoutingTest : TeamBalanceIT() {

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var dsl: DSLContext

    @Autowired
    lateinit var transactions: TransactionTemplate

    init {
        test("jOOQ writes land in the tenant schema resolved from TenantContext and are isolated per schema") {
            tenantSchemaAdapter.provisionTenantSchema("team_alpha")
            tenantSchemaAdapter.provisionTenantSchema("team_beta")
            val alphaOnlyName = "Alpha-only-${UUID.randomUUID()}"

            withTenant("team_alpha") { insertEventType(alphaOnlyName) }

            withTenant("team_beta") { eventTypeNames() } shouldNotContain alphaOnlyName
            withTenant("team_alpha") { eventTypeNames() } shouldContain alphaOnlyName
        }

        test("with no tenant resolved, jOOQ tenant-table access fails closed instead of silently hitting public") {
            tenantSchemaAdapter.provisionPlatformSchema()
            tenantSchemaAdapter.provisionTenantSchema(TenantContext.PUBLIC_SCHEMA)

            TenantContext.clear()

            shouldThrowAny { eventTypeNames() }
        }

        test("a jOOQ write inside a transaction that throws is rolled back") {
            tenantSchemaAdapter.provisionTenantSchema("team_alpha")
            val rolledBackName = "Rolled-back-${UUID.randomUUID()}"

            withTenant("team_alpha") {
                shouldThrow<IllegalStateException> {
                    transactions.executeWithoutResult {
                        insertEventType(rolledBackName)
                        throw IllegalStateException("boom")
                    }
                }
                eventTypeNames()
            } shouldNotContain rolledBackName
        }
    }

    private fun insertEventType(name: String) =
        dsl.insertInto(EVENT_TYPES).set(EVENT_TYPES.NAME, name).execute()

    private fun eventTypeNames(): List<String> = dsl.select(EVENT_TYPES.NAME).from(EVENT_TYPES).fetch(EVENT_TYPES.NAME)

    private fun <T> withTenant(schema: String, block: () -> T): T {
        TenantContext.set(schema)
        try {
            return block()
        } finally {
            TenantContext.clear()
        }
    }
}
