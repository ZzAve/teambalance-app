package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.port.TeamRepository
import org.springframework.stereotype.Component

/**
 * Brings every team's tenant schema up to head, so no schema drifts behind (retires the manual
 * docker-Flyway step for existing teams). Provisioning is idempotent, so running it repeatedly — or
 * against schemas that are already current — is safe.
 */
@Component
class StartupTenantMigrationRunner(
    private val teamRepository: TeamRepository,
    private val tenantSchemaManager: TenantSchemaManager,
) {
    fun migrateAllTenantSchemas() {
        teamRepository.findAllSchemaNames().forEach(tenantSchemaManager::provisionTenantSchema)
    }
}
