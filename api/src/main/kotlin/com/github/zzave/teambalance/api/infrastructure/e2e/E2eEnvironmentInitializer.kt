package com.github.zzave.teambalance.api.infrastructure.e2e

import com.github.zzave.teambalance.api.domain.port.TenantProvisioner
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Profile
import org.springframework.core.io.ClassPathResource
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator
import org.springframework.stereotype.Component
import javax.sql.DataSource

/**
 * E2e-profile-only bootstrap for full-stack Playwright runs.
 *
 * Provisions the `team_test` tenant schema through the real code path
 * ([TenantProvisioner.provisionTenant]) and applies the pure-INSERT seed fixture
 * (known team + user + membership). Runs as an [ApplicationRunner] so it is guaranteed to
 * execute after context initialization — i.e. after [PlatformSchemaInitializer] has run the
 * platform Flyway migrations. Ordering: Flyway → provision → seed.
 *
 * Interim mechanism: once an admin API for team/tenant provisioning exists, the SQL fixture
 * is replaced by API calls in Playwright global-setup and this hook is absorbed into the
 * "create team" endpoint.
 */
@Component
@Profile("e2e")
class E2eEnvironmentInitializer(
    private val tenantProvisioner: TenantProvisioner,
    private val dataSource: DataSource,
) : ApplicationRunner {
    private val log = LoggerFactory.getLogger(E2eEnvironmentInitializer::class.java)

    override fun run(args: ApplicationArguments) {
        log.info("Provisioning e2e tenant schema 'team_test' and applying seed fixture")
        tenantProvisioner.provisionTenant("team_test")
        ResourceDatabasePopulator(ClassPathResource("db/e2e/seed.sql")).execute(dataSource)
    }
}
