package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.port.TeamRepository
import org.springframework.beans.factory.InitializingBean
import org.springframework.context.annotation.DependsOn
import org.springframework.stereotype.Component

/**
 * Brings every team's tenant schema up to head at startup, so no schema drifts behind (retires the
 * manual docker-Flyway step for existing teams). Provisioning is idempotent, so running it repeatedly
 * — or against schemas that are already current — is safe.
 *
 * Runs during context refresh as an [InitializingBean] (mirroring [PlatformSchemaInitializer]) so it
 * completes before boot is "done", closing the startup race. `@DependsOn` orders it after
 * [PlatformSchemaInitializer], which creates `public.teams` — the source of truth this reads.
 */
@Component
@DependsOn("platformSchemaInitializer")
class StartupTenantMigrationRunner(
    private val teamRepository: TeamRepository,
    private val tenantSchemaManager: TenantSchemaManager,
) : InitializingBean {

    override fun afterPropertiesSet() = migrateAllTenantSchemas()

    fun migrateAllTenantSchemas() {
        teamRepository.findAllSchemaNames().forEach(tenantSchemaManager::provisionTenantSchema)
    }
}
