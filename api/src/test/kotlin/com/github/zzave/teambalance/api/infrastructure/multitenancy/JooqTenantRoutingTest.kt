package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_TYPES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.USERS
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.ints.shouldBeGreaterThanOrEqual
import io.kotest.matchers.collections.shouldNotContain
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.BadSqlGrammarException
import java.sql.Connection
import javax.sql.DataSource
import org.springframework.transaction.support.TransactionTemplate
import java.util.UUID

class JooqTenantRoutingTest : TeamBalanceIT() {

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var dsl: DSLContext

    @Autowired
    lateinit var dataSource: DataSource

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

            shouldThrow<BadSqlGrammarException> { eventTypeNames() }
        }

        test("every jOOQ statement of a transaction that throws is rolled back") {
            tenantSchemaAdapter.provisionTenantSchema("team_alpha")
            val firstName = "Rolled-back-first-${UUID.randomUUID()}"
            val secondName = "Rolled-back-second-${UUID.randomUUID()}"

            withTenant("team_alpha") {
                shouldThrow<IllegalStateException> {
                    transactions.executeWithoutResult {
                        insertEventType(firstName)
                        insertEventType(secondName)
                        eventTypeNames() shouldContain secondName
                        throw IllegalStateException("boom")
                    }
                }
                eventTypeNames()
            }.let {
                it shouldNotContain firstName
                it shouldNotContain secondName
            }
        }

        test("a committed transaction's writes are visible in its own tenant and invisible in another") {
            tenantSchemaAdapter.provisionTenantSchema("team_alpha")
            tenantSchemaAdapter.provisionTenantSchema("team_beta")
            val alphaOnlyName = "Alpha-tx-${UUID.randomUUID()}"

            withTenant("team_alpha") {
                transactions.executeWithoutResult {
                    insertEventType(alphaOnlyName)
                    eventTypeNames() shouldContain alphaOnlyName
                }
            }

            withTenant("team_beta") { transactions.execute { eventTypeNames() } } shouldNotContain alphaOnlyName
            withTenant("team_alpha") { transactions.execute { eventTypeNames() } } shouldContain alphaOnlyName
        }

        test("evictFromPool removes the physical connection from the real Hikari pool") {
            val connection = dataSource.connection
            val backendPid = connection.backendPid()

            dataSource.evictFromPool(connection)
            connection.close()

            val deadline = System.nanoTime() + 10_000_000_000L
            while (backendIsAlive(backendPid) && System.nanoTime() < deadline) Thread.sleep(50)
            backendIsAlive(backendPid) shouldBe false
        }

        test("connections go back to the pool on public after committed, rolled-back and tenant-less transactions") {
            tenantSchemaAdapter.provisionTenantSchema("team_alpha")
            withTenant("team_alpha") {
                transactions.executeWithoutResult { eventTypeNames() }
                shouldThrow<IllegalStateException> { transactions.executeWithoutResult { throw IllegalStateException("boom") } }
                eventTypeNames()
            }
            transactions.executeWithoutResult { dsl.fetchCount(USERS) }

            val poolSize = 8
            val connections = List(poolSize) { dataSource.connection }
            try {
                connections.map { it.currentSchema() }.distinct() shouldBe listOf(TenantContext.PUBLIC_SCHEMA)
            } finally {
                connections.forEach { it.close() }
            }
        }

        test("in a transaction with no tenant, public tables are reachable and tenant tables fail closed") {
            // public carries the tenant tables here: a failure proves __no_tenant__ routing, not a missing table.
            tenantSchemaAdapter.provisionPlatformSchema()
            tenantSchemaAdapter.provisionTenantSchema(TenantContext.PUBLIC_SCHEMA)
            TenantContext.clear()

            transactions.execute { dsl.fetchCount(USERS) } shouldBeGreaterThanOrEqual 0
            shouldThrow<BadSqlGrammarException> { transactions.execute { eventTypeNames() } }
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

    private fun Connection.backendPid(): Int =
        createStatement().use { statement ->
            statement.executeQuery("SELECT pg_backend_pid()").use { rows ->
                rows.next()
                rows.getInt(1)
            }
        }

    private fun backendIsAlive(pid: Int): Boolean =
        dsl.fetchCount(DSL.table("pg_stat_activity"), DSL.field("pid").eq(pid)) > 0

    private fun Connection.currentSchema(): String =
        createStatement().use { statement ->
            statement.executeQuery("SELECT current_schema()").use { rows ->
                rows.next()
                rows.getString(1)
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
