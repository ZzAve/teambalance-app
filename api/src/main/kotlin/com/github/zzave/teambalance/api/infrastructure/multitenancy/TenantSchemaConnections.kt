package com.github.zzave.teambalance.api.infrastructure.multitenancy

import java.sql.Connection
import java.sql.SQLException

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

/** Resets the search path to `public` before the pool gets the connection back, and always closes it. */
internal fun Connection.resetAndClose() {
    try {
        schema = TenantContext.PUBLIC_SCHEMA
    } finally {
        close()
    }
}

private fun Connection.closeSuppressing(cause: Exception) {
    try {
        close()
    } catch (closeFailure: SQLException) {
        cause.addSuppressed(closeFailure)
    }
}
