package com.github.zzave.teambalance.api.infrastructure.demo

import com.github.zzave.teambalance.api.domain.port.DemoResetGateway
import com.github.zzave.teambalance.api.domain.port.PlatformProvisioningGateway
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import javax.sql.DataSource

internal fun requireLoopbackDatabase(jdbcUrl: String) =
    check(isLoopbackOnly(jdbcUrl)) { "The demo reset refuses to drop on a database that is not on a loopback host" }

/**
 * Drops every tenant schema and `public` (which takes the Flyway histories and the Spring Session tables with
 * it), then provisions the platform schema and the demo team again. No Flyway `clean()`: it is disabled by
 * default and a JDBC drop leaves `migrate()` an empty schema to start from V001.
 *
 * Fail-closed: a reset in the wrong environment deletes every team, so it needs [DemoGuard.safeToReset],
 * on top of the switch check that keeps the demo session service from calling it.
 */
@Component
class DemoResetAdapter(
    private val dataSource: DataSource,
    private val platformProvisioningGateway: PlatformProvisioningGateway,
    private val seeder: DemoTeamSeeder,
    private val guard: DemoGuard,
) : DemoResetGateway {
    private val log = LoggerFactory.getLogger(DemoResetAdapter::class.java)

    override fun reset() {
        check(guard.safeToReset) { "The demo reset needs teambalance.demo.enabled and a passing demo boot check" }
        dropAllSchemas()
        platformProvisioningGateway.provisionPlatformSchema()
        seeder.seed()
        log.info("Demo database reset")
    }

    private fun dropAllSchemas() = dataSource.connection.use { conn ->
        // Checked on the connection that drops, not on the property: whatever the pool really connected to.
        requireLoopbackDatabase(conn.metaData.url)
        conn.autoCommit = false
        conn.createStatement().use { st ->
            // A DROP blocked by a long query fails after 5 s and the next login retries, instead of queueing every login.
            st.execute("SET LOCAL lock_timeout = '5s'")
            val tenants = st.executeQuery("SELECT nspname FROM pg_namespace WHERE nspname LIKE 'team\\_%'").use { rs ->
                generateSequence { if (rs.next()) rs.getString(1) else null }.toList()
            }
            tenants.forEach { st.execute("DROP SCHEMA \"$it\" CASCADE") }
            st.execute("DROP SCHEMA public CASCADE")
            st.execute("CREATE SCHEMA public")
        }
        conn.commit()
    }
}
