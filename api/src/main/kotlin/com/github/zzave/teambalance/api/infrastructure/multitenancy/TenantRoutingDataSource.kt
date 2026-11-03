package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.springframework.jdbc.datasource.DelegatingDataSource
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy
import org.springframework.transaction.support.TransactionSynchronizationManager
import java.sql.Connection
import javax.sql.DataSource

/**
 * The jOOQ counterpart of [SchemaMultiTenantConnectionProvider]: switches each connection to the
 * schema resolved by [TenantIdentifierResolver] (so an unset tenant fails closed the same way) and
 * resets it to `public` when the connection is closed. Only the jOOQ `DSLContext` uses it.
 *
 * Inside a Spring transaction it hands out the connection the transaction manager bound to the
 * underlying [dataSource], which Hibernate already routed to the tenant when the transaction began.
 * That binding is keyed by [dataSource] itself, so a [TransactionAwareDataSourceProxy] around this
 * class would never find it and jOOQ would run each statement on its own auto-committed connection.
 */
class TenantRoutingDataSource(private val dataSource: DataSource) : DelegatingDataSource(dataSource) {

    private val tenantResolver = TenantIdentifierResolver()
    private val transactionAwareDataSource = TransactionAwareDataSourceProxy(dataSource)

    override fun getConnection(): Connection =
        if (inTransaction()) transactionConnection() else routedConnection()

    override fun getConnection(username: String, password: String): Connection =
        throw UnsupportedOperationException("Connections must be routed to a tenant; credentials are not supported")

    private fun routedConnection(): Connection = ResettingConnection(super.getConnection().routeTo(currentTenant()))

    private fun inTransaction() = TransactionSynchronizationManager.hasResource(dataSource)

    private fun currentTenant() = tenantResolver.resolveCurrentTenantIdentifier()

    private fun transactionConnection(): Connection {
        val connection = transactionAwareDataSource.connection
        val tenant = currentTenant()
        // Postgres reports no schema when the search_path names one that does not exist: that is how a
        // transaction without a tenant looks (__no_tenant__), and it is allowed, since public tables are
        // qualified and unqualified tenant tables then fail with "relation does not exist".
        val boundSchema = connection.schema ?: TenantContext.NO_TENANT_SCHEMA
        if (boundSchema != tenant) {
            connection.close()
            error("Transaction is bound to schema '$boundSchema' but the current tenant is '$tenant'")
        }
        return connection
    }
}

private class ResettingConnection(private val delegate: Connection) : Connection by delegate {
    override fun close() = delegate.resetAndClose()
}
