package com.github.zzave.teambalance.api.infrastructure.multitenancy

import io.kotest.assertions.throwables.shouldNotThrowAny
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import org.springframework.transaction.CannotCreateTransactionException
import org.springframework.transaction.support.TransactionTemplate
import java.lang.reflect.Proxy
import java.sql.Connection
import java.sql.SQLException
import javax.sql.DataSource

class TenantRoutingTransactionManagerTest : FunSpec({
    afterTest { TenantContext.clear() }

    test("a connection whose reset to public fails is evicted and the completed transaction still succeeds") {
        val pool = FakePool(failSchemaChangeTo = TenantContext.PUBLIC_SCHEMA)
        TenantContext.set("team_alpha")

        shouldNotThrowAny {
            TransactionTemplate(TenantRoutingTransactionManager(pool.dataSource, pool::evict)).executeWithoutResult {}
        }

        pool.evicted shouldBe 1
        pool.closed shouldBe 1
    }

    test("a connection that resets to public is returned to the pool, not evicted") {
        val pool = FakePool(failSchemaChangeTo = null)
        TenantContext.set("team_alpha")

        TransactionTemplate(TenantRoutingTransactionManager(pool.dataSource, pool::evict)).executeWithoutResult {}

        pool.schemaChanges.shouldContainExactly("team_alpha", TenantContext.PUBLIC_SCHEMA)
        pool.evicted shouldBe 0
        pool.closed shouldBe 1
    }

    test("a transaction that cannot be routed to its tenant fails to begin and releases the connection") {
        val pool = FakePool(failSchemaChangeTo = "team_alpha")
        TenantContext.set("team_alpha")

        shouldThrow<CannotCreateTransactionException> {
            TransactionTemplate(TenantRoutingTransactionManager(pool.dataSource, pool::evict)).executeWithoutResult {}
        }

        pool.closed shouldBe 1
        pool.schemaChanges.shouldContainExactly(TenantContext.PUBLIC_SCHEMA)
    }

    test("a non-transactional jOOQ connection whose reset fails is evicted and closed without failing the caller") {
        val pool = FakePool(failSchemaChangeTo = TenantContext.PUBLIC_SCHEMA)
        TenantContext.set("team_alpha")

        shouldNotThrowAny { TenantRoutingDataSource(pool.dataSource, pool::evict).connection.close() }

        pool.evicted shouldBe 1
        pool.closed shouldBe 1
    }
})

private class FakePool(private val failSchemaChangeTo: String?) {
    val schemaChanges = mutableListOf<String>()
    var closed = 0
    var evicted = 0

    @Suppress("UNUSED_PARAMETER")
    fun evict(connection: Connection) {
        evicted++
    }

    private val connection = Proxy.newProxyInstance(
        Connection::class.java.classLoader,
        arrayOf(Connection::class.java),
    ) { _, method, args ->
        when (method.name) {
            "setSchema" -> {
                if (args[0] == failSchemaChangeTo) throw SQLException("cannot set schema")
                schemaChanges += args[0] as String
            }
            "close" -> closed++
            "getAutoCommit" -> return@newProxyInstance true
        }
        when (method.returnType) {
            Boolean::class.javaPrimitiveType -> false
            Int::class.javaPrimitiveType -> 0
            else -> null
        }
    } as Connection

    val dataSource = Proxy.newProxyInstance(
        DataSource::class.java.classLoader,
        arrayOf(DataSource::class.java),
    ) { proxy, method, args ->
        when (method.name) {
            "getConnection" -> connection
            "hashCode" -> System.identityHashCode(proxy)
            "equals" -> proxy === args[0]
            else -> null
        }
    } as DataSource
}
