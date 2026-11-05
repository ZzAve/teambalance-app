package com.github.zzave.teambalance.api.infrastructure.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.session.jdbc.PostgreSqlJdbcIndexedSessionRepositoryCustomizer

/**
 * Spring Session JDBC saves an attribute the request did not load with a plain INSERT. Concurrent
 * requests on one session that each add the same attribute (the tenant memo, see
 * `TenantRoutingSession`) then collide on `spring_session_attributes_pk`. This customizer turns that
 * INSERT into an upsert, so the last request to commit wins — the same outcome as two UPDATEs.
 */
@Configuration
class SessionConfig {
    @Bean
    fun sessionAttributeUpsert() = PostgreSqlJdbcIndexedSessionRepositoryCustomizer()
}
