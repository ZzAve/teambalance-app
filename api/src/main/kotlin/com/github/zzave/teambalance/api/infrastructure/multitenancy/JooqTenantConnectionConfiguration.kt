package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.jooq.ConnectionProvider
import org.jooq.impl.DataSourceConnectionProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource

/**
 * Gives the jOOQ `DSLContext` tenant-routed connections that join Spring transactions (see [TenantRoutingDataSource]). Replaces only
 * the connection provider of Boot's jOOQ auto-configuration; the shared [DataSource] stays untouched
 * for Hibernate and `JdbcTemplate`.
 */
@Configuration
class JooqTenantConnectionConfiguration {

    @Bean
    fun jooqConnectionProvider(dataSource: DataSource): ConnectionProvider =
        DataSourceConnectionProvider(TenantRoutingDataSource(dataSource))
}
