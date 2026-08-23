package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider
import java.sql.Connection
import javax.sql.DataSource

/**
 * Routes every Hibernate connection to the tenant's Postgres schema via `SET search_path`
 * (JDBC `Connection.setSchema`), rather than maintaining one physical DataSource per tenant.
 * Public-schema entities (users, team_members, ...) are unaffected — they're mapped with an
 * explicit `@Table(schema = "public")`, so Hibernate always qualifies them regardless of search_path.
 */
class SchemaMultiTenantConnectionProvider(
    private val dataSource: DataSource,
) : MultiTenantConnectionProvider<String> {

    override fun getAnyConnection(): Connection = dataSource.connection

    override fun releaseAnyConnection(connection: Connection) = connection.close()

    override fun getConnection(tenantIdentifier: String): Connection =
        dataSource.connection.also { it.schema = tenantIdentifier }

    override fun releaseConnection(tenantIdentifier: String, connection: Connection) {
        // Reset the search_path before returning the connection to the pool, but always close it —
        // if the reset throws (e.g. an aborted connection) skipping close() would leak it from the pool.
        try {
            connection.schema = TenantContext.PUBLIC_SCHEMA
        } finally {
            connection.close()
        }
    }

    override fun supportsAggressiveRelease(): Boolean = false

    override fun isUnwrappableAs(unwrapType: Class<*>): Boolean = false

    override fun <T : Any> unwrap(unwrapType: Class<T>): T? = null
}
