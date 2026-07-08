package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.InitializingBean
import org.springframework.stereotype.Component

/**
 * Runs the platform (`public`) schema migrations once at application startup.
 *
 * Spring's auto-Flyway is not used for the platform schema (the app owns migration
 * explicitly so it can also provision per-tenant schemas — see [TenantSchemaManager]).
 * Without this hook the platform schema is only ever migrated from tests, so every
 * persistence call in a real run fails with `relation "public...." does not exist`.
 */
@Component
class PlatformSchemaInitializer(
    private val tenantSchemaManager: TenantSchemaManager,
) : InitializingBean {
    private val log = LoggerFactory.getLogger(PlatformSchemaInitializer::class.java)

    override fun afterPropertiesSet() {
        log.info("Provisioning platform (public) schema")
        tenantSchemaManager.provisionPlatformSchema()
    }
}
