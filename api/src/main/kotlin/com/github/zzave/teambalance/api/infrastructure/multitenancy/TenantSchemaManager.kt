package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.flywaydb.core.Flyway
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class TenantSchemaManager(private val dataSource: DataSource) {

    fun provisionPlatformSchema() {
        Flyway.configure()
            .dataSource(dataSource)
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
