package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.port.TenantProvisioningGateway
import org.flywaydb.core.Flyway
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class TenantSchemaAdapter(private val dataSource: DataSource) : TenantProvisioningGateway {

    /** Port method for create-team; delegates to the existing idempotent provisioning primitive. */
    override fun provisionTenant(schemaName: String) = provisionTenantSchema(schemaName)

    fun provisionPlatformSchema() {
        Flyway.configure()
            .dataSource(dataSource)
            // Pin the platform schema explicitly. Without this, Flyway targets the connection's
            // ambient search_path, which in prod defaulted to a tenant schema (left over from manual
            // tenant provisioning) — so a new platform migration landed in that tenant schema instead
            // of `public`. Pinning makes it deterministic, mirroring provisionTenantSchema's .schemas().
            .schemas("public")
            .locations("classpath:db/migration")
            .baselineOnMigrate(true)
            .baselineVersion("0")
            .load()
            .migrate()
    }

    fun provisionTenantSchema(schemaName: String) {
        // Create the schema
        dataSource.connection.use { conn ->
            conn.createStatement().execute("CREATE SCHEMA IF NOT EXISTS \"$schemaName\"")
        }

        // Run tenant-specific migrations (separate history table avoids conflict with the platform Flyway).
        // baselineOnMigrate allows running against a non-empty schema (e.g. "public" which also holds platform tables).
        Flyway.configure()
            .dataSource(dataSource)
            .schemas(schemaName)
            .locations("classpath:db/tenant-migration")
            .table("flyway_tenant_schema_history")
            .baselineOnMigrate(true)
            .baselineVersion("0")
            .load()
            .migrate()
    }
}
