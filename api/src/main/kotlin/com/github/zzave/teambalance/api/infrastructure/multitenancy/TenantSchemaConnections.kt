package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.zaxxer.hikari.HikariDataSource
import org.slf4j.LoggerFactory
import java.sql.Connection
import java.sql.SQLException
import javax.sql.DataSource

private val log = LoggerFactory.getLogger("app.teambalance.TenantSchemaConnections")

/** Switches a freshly obtained connection to [schema]; if that fails it is closed, not leaked from the pool. */
internal fun Connection.routeTo(schema: String): Connection {
    try {
        this.schema = schema
    } catch (e: SQLException) {
        closeSuppressing(e)
        throw e
    }
    return this
}

/**
 * Resets the search path to `public` before the pool gets the connection back, and always closes it.
 * If the reset fails the connection may still be on a tenant schema, so [evict] removes it from the pool
 * instead of letting it be reused, and the failure is logged: it must not fail a caller whose work
 * has already completed.
 */
internal fun Connection.resetAndClose(evict: (Connection) -> Unit) {
    try {
        schema = TenantContext.PUBLIC_SCHEMA
    } catch (e: SQLException) {
        evict(this)
        log.warn("Could not reset a released connection to {}; evicted it from the pool", TenantContext.PUBLIC_SCHEMA, e)
    } finally {
        close()
    }
}

/** Removes [connection] from the pool when the pool is Hikari; the connection is closed afterwards by its owner. */
internal fun DataSource.evictFromPool(connection: Connection) {
    if (isWrapperFor(HikariDataSource::class.java)) unwrap(HikariDataSource::class.java).evictConnection(connection)
}

private fun Connection.closeSuppressing(cause: Exception) {
    try {
        close()
    } catch (closeFailure: SQLException) {
        cause.addSuppressed(closeFailure)
    }
}
