package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.InitializingBean
import org.springframework.stereotype.Component

/**
 * Runs the platform (`public`) schema migrations once at application startup.
 *
 * Both this hook and Spring Boot's auto-Flyway migrate `classpath:db/migration`; both are pinned
 * to the `public` schema (`spring.flyway.schemas` for auto-Flyway, `.schemas("public")` here). The
 * pin is essential: without it Flyway targets the connection's ambient search_path, which in prod
 * defaulted to a tenant schema — and a platform migration then lands in the wrong schema (see the
 * incident that added the pin). This explicit hook also owns per-tenant provisioning via
 * [TenantSchemaAdapter]; it baselines so it runs cleanly against the already-populated schema.
 */
@Component
class PlatformSchemaInitializer(
    private val tenantSchemaAdapter: TenantSchemaAdapter,
) : InitializingBean {
    private val log = LoggerFactory.getLogger(PlatformSchemaInitializer::class.java)

    override fun afterPropertiesSet() {
        log.info("Provisioning platform (public) schema")
        tenantSchemaAdapter.provisionPlatformSchema()
    }
}
