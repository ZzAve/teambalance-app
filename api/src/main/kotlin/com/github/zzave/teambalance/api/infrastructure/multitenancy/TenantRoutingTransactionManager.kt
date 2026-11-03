package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.slf4j.LoggerFactory
import org.springframework.jdbc.datasource.JdbcTransactionObjectSupport
import org.springframework.jdbc.support.JdbcTransactionManager
import org.springframework.transaction.CannotCreateTransactionException
import org.springframework.transaction.TransactionDefinition
import java.sql.Connection
import java.sql.SQLException
import javax.sql.DataSource

private val log = LoggerFactory.getLogger(TenantRoutingTransactionManager::class.java)

/**
 * Routes the connection a transaction binds to the schema of the current tenant (see
 * [TenantContext.routingSchema], which fails closed when no tenant is set) as the transaction begins,
 * and puts it back on `public` before the pool gets it back. A connection that cannot be reset is
 * evicted from the pool and the failure is logged: the transaction has already completed, so it must not
 * be reported as failed. Everything that joins the transaction
 * through [dataSource] (`JdbcTemplate`, Spring Session, jOOQ via [TenantRoutingDataSource]) then runs on
 * the tenant's schema.
 */
class TenantRoutingTransactionManager(
    dataSource: DataSource,
    private val evict: (Connection) -> Unit = dataSource::evictFromPool,
) : JdbcTransactionManager(dataSource) {

    override fun doBegin(transaction: Any, definition: TransactionDefinition) {
        super.doBegin(transaction, definition)
        try {
            connectionOf(transaction)?.schema = TenantContext.routingSchema()
        } catch (e: SQLException) {
            runCatching { doCleanupAfterCompletion(transaction) }.onFailure(e::addSuppressed)
            throw CannotCreateTransactionException("Could not route the transaction to the current tenant", e)
        }
    }

    override fun doCleanupAfterCompletion(transaction: Any) {
        try {
            connectionOf(transaction)?.resetSchemaOrEvict()
        } finally {
            super.doCleanupAfterCompletion(transaction)
        }
    }

    private fun Connection.resetSchemaOrEvict() {
        try {
            schema = TenantContext.PUBLIC_SCHEMA
        } catch (e: SQLException) {
            evict(this)
            log.warn("Could not reset a released connection to {}; evicted it from the pool", TenantContext.PUBLIC_SCHEMA, e)
        }
    }

    private fun connectionOf(transaction: Any) =
        (transaction as JdbcTransactionObjectSupport).connectionHolder?.connection
}
