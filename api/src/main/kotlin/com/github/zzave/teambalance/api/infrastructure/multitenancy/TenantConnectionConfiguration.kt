package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.jooq.ConnectionProvider
import org.jooq.impl.DataSourceConnectionProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.transaction.PlatformTransactionManager
import javax.sql.DataSource

/**
 * The single transaction manager routes each transaction's connection to the current tenant (see
 * [TenantRoutingTransactionManager]); the jOOQ `DSLContext` gets connections that join those
 * transactions or, outside one, are routed on their own (see [TenantRoutingDataSource]). The shared
 * [DataSource] stays untouched for Flyway, Spring Session and the `JdbcTemplate` adapters.
 */
@Configuration
class TenantConnectionConfiguration {

    @Bean
    fun transactionManager(dataSource: DataSource): PlatformTransactionManager =
        TenantRoutingTransactionManager(dataSource)

    @Bean
    fun jooqConnectionProvider(dataSource: DataSource): ConnectionProvider =
        DataSourceConnectionProvider(TenantRoutingDataSource(dataSource))
}
