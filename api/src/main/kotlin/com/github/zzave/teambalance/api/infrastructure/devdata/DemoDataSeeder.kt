package com.github.zzave.teambalance.api.infrastructure.devdata

import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.port.TenantProvisioningGateway
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.ClassPathResource
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator
import org.springframework.stereotype.Component
import javax.sql.DataSource

/**
 * Demo data so `make api` (and the stg container, whose in-container Postgres starts empty on every
 * cold start) shows a realistic team instead of an empty DB. Off unless `teambalance.demo-data.enabled`
 * is set: dev sets it in application-dev.yml, stg via TEAMBALANCE_DEMO_DATA_ENABLED. A runtime switch,
 * not a profile, because Spring AOT fixes the profile-conditional beans at build time and stg runs the
 * prod jar.
 *
 * Provisions the demo team's tenant schema through the real code path
 * ([TenantProvisioningGateway.provisionTenant]) and applies the idempotent seed. Runs as an
 * [ApplicationRunner] so it executes after context initialization — i.e. after
 * PlatformSchemaInitializer has run the platform migrations. Ordering: Flyway → provision → seed.
 *
 * Prod never seeds: the switch is off there and the seed SQL lives under db/seed (not in the
 * db/migration path that provisionPlatformSchema applies). The Kotest ITs get the same fixture via
 * src/test/resources/db/migration/V1_1__seed_demo_data.sql (test-classpath overlay).
 */
@Component
class DemoDataSeeder(
    private val tenantProvisioningGateway: TenantProvisioningGateway,
    private val dataSource: DataSource,
    @Value("\${teambalance.demo-data.enabled:false}") private val enabled: Boolean,
) : ApplicationRunner {
    private val log = LoggerFactory.getLogger(DemoDataSeeder::class.java)

    override fun run(args: ApplicationArguments) {
        if (!enabled) return
        log.info("Seeding demo team 'Setpoint VT' and its tenant schema")
        tenantProvisioningGateway.provisionTenant(SchemaName("team_setpoint_vt"))
        ResourceDatabasePopulator(ClassPathResource("db/seed/demo_data.sql")).execute(dataSource)
    }
}
