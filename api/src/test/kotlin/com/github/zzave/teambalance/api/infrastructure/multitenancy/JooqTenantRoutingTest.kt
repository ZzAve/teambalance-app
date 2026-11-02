package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_TYPES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.USERS
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.assertions.throwables.shouldThrowAny
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.ints.shouldBeGreaterThanOrEqual
import io.kotest.matchers.collections.shouldNotContain
import io.kotest.matchers.string.shouldContain
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
            // public carries the tenant tables here: a failure proves __no_tenant__ routing, not a missing table.
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

        test("in a transaction with no tenant, public tables are reachable and tenant tables fail closed") {
            tenantSchemaAdapter.provisionPlatformSchema()
            TenantContext.clear()

            transactions.execute { dsl.fetchCount(USERS) } shouldBeGreaterThanOrEqual 0
            shouldThrowAny { transactions.execute { eventTypeNames() } }
        }

        test("a jOOQ call in a transaction fails when the tenant changed since the transaction began") {
            tenantSchemaAdapter.provisionTenantSchema("team_alpha")
            tenantSchemaAdapter.provisionTenantSchema("team_beta")

            withTenant("team_alpha") {
                val failure = shouldThrow<IllegalStateException> {
                    transactions.executeWithoutResult {
                        TenantContext.set("team_beta")
                        eventTypeNames()
                    }
                }
                failure.message shouldContain "team_alpha"
                failure.message shouldContain "team_beta"
            }
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
