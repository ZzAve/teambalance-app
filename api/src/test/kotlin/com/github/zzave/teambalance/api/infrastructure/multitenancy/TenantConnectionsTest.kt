package com.github.zzave.teambalance.api.infrastructure.multitenancy

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.lang.reflect.Proxy
import java.sql.Connection
import java.sql.SQLException
import javax.sql.DataSource

class TenantConnectionsTest : FunSpec({
    test("routeTo closes the connection and rethrows when setting the schema fails") {
        val failure = SQLException("cannot set schema")
        var closed = false
        val connection = Proxy.newProxyInstance(
            Connection::class.java.classLoader,
            arrayOf(Connection::class.java),
        ) { _, method, _ ->
            when (method.name) {
                "setSchema" -> throw failure
                "close" -> closed = true
            }
            null
        } as Connection

        shouldThrow<SQLException> { connection.routeTo("team_alpha") } shouldBe failure

        closed shouldBe true
    }

    test("the jOOQ data source has no credentials-taking connection path that would skip tenant routing") {
        val dataSource = Proxy.newProxyInstance(
            DataSource::class.java.classLoader,
            arrayOf(DataSource::class.java),
        ) { _, _, _ -> error("must not reach the underlying data source") } as DataSource

        shouldThrow<UnsupportedOperationException> { TenantRoutingDataSource(dataSource).getConnection("user", "password") }
    }
})
