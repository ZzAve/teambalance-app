package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.flywaydb.core.Flyway
import org.springframework.stereotype.Component
import javax.sql.DataSource

@Component
class TenantSchemaManager(private val dataSource: DataSource) {

    fun provisionTenantSchema(schemaName: String) {
        // Create the schema
        dataSource.connection.use { conn ->
            conn.createStatement().execute("CREATE SCHEMA IF NOT EXISTS \"$schemaName\"")
        }

        // Run tenant-specific migrations
        Flyway.configure()
            .dataSource(dataSource)
            .schemas(schemaName)
            .locations("classpath:db/tenant-migration")
            .baselineOnMigrate(false)
            .load()
            .migrate()
    }
}
