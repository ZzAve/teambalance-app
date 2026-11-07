package com.github.zzave.teambalance.api.infrastructure.demo

import com.github.zzave.teambalance.api.application.DemoPersona
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.port.TenantProvisioningGateway
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.ApplicationRunner
import org.springframework.core.io.ClassPathResource
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator
import org.springframework.stereotype.Component
import javax.sql.DataSource

/**
 * Seeds the guest-login demo team "VC De Smashers" (ADR-0043) when `teambalance.demo.enabled` is on.
 * A runtime switch rather than a profile: Spring AOT fixes profile-conditional beans at build time and
 * the demo runs the prod jar. An [ApplicationRunner], so it runs after Flyway and the platform schema.
 */
@Component
class DemoTeamSeeder(
    private val tenantProvisioningGateway: TenantProvisioningGateway,
    private val dataSource: DataSource,
    @param:Value("\${teambalance.demo.enabled:false}") private val enabled: Boolean,
) : ApplicationRunner {
    private val log = LoggerFactory.getLogger(DemoTeamSeeder::class.java)

    override fun run(args: ApplicationArguments) {
        if (!enabled) return
        log.info("Seeding demo team 'VC De Smashers' and its tenant schema")
        tenantProvisioningGateway.provisionTenant(SchemaName(DemoPersona.SCHEMA))
        ResourceDatabasePopulator(ClassPathResource("db/seed/demo_team.sql")).execute(dataSource)
    }
}
