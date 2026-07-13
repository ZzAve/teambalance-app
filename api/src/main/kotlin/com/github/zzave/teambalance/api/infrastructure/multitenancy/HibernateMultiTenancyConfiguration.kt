package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.hibernate.cfg.MultiTenancySettings
import org.springframework.boot.hibernate.autoconfigure.HibernatePropertiesCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource

/**
 * Wires schema-based Hibernate multi-tenancy: every session's physical connection is switched
 * to the tenant schema resolved by [TenantIdentifierResolver] (which reads [TenantContext]).
 */
@Configuration
class HibernateMultiTenancyConfiguration(private val dataSource: DataSource) {

    @Bean
    fun multiTenancyHibernatePropertiesCustomizer(): HibernatePropertiesCustomizer =
        HibernatePropertiesCustomizer { properties ->
            properties[MultiTenancySettings.MULTI_TENANT_CONNECTION_PROVIDER] =
                SchemaMultiTenantConnectionProvider(dataSource)
            properties[MultiTenancySettings.MULTI_TENANT_IDENTIFIER_RESOLVER] =
                TenantIdentifierResolver()
        }
}
