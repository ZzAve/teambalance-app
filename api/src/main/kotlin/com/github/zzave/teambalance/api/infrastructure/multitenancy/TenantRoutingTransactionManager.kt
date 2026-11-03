package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.springframework.jdbc.datasource.JdbcTransactionObjectSupport
import org.springframework.jdbc.support.JdbcTransactionManager
import org.springframework.transaction.CannotCreateTransactionException
import org.springframework.transaction.TransactionDefinition
import java.sql.SQLException
import javax.sql.DataSource

/**
 * Routes the connection a transaction binds to the schema of the current tenant (see
 * [TenantContext.routingSchema], which fails closed when no tenant is set) as the transaction begins,
 * and puts it back on `public` before the pool gets it back. Everything that joins the transaction
 * through [dataSource] (`JdbcTemplate`, Spring Session, jOOQ via [TenantRoutingDataSource]) then runs on
 * the tenant's schema.
 */
class TenantRoutingTransactionManager(dataSource: DataSource) : JdbcTransactionManager(dataSource) {

    override fun doBegin(transaction: Any, definition: TransactionDefinition) {
        super.doBegin(transaction, definition)
        try {
            connectionOf(transaction)?.schema = TenantContext.routingSchema()
        } catch (e: SQLException) {
            doCleanupAfterCompletion(transaction)
            throw CannotCreateTransactionException("Could not route the transaction to the current tenant", e)
        }
    }

    override fun doCleanupAfterCompletion(transaction: Any) {
        try {
            connectionOf(transaction)?.schema = TenantContext.PUBLIC_SCHEMA
        } finally {
            super.doCleanupAfterCompletion(transaction)
        }
    }

    private fun connectionOf(transaction: Any) =
        (transaction as JdbcTransactionObjectSupport).connectionHolder?.connection
}
