package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Instant
import java.util.UUID

private val ROUTING = TenantRouting(
    TeamId(UUID.fromString(CalendarLinkFixture.ALPHA_TEAM)),
    SchemaName(CalendarLinkFixture.ALPHA_SCHEMA),
)
private val FIRST_GRANT = EncryptedToken("sealed-first")
private val ADMIN = UserId.random()

/** The pick writes the account column of the row holding the grant it validated, and only that row; this is its test. */
class JpaBunqConnectionRepositoryAdapterIT : TeamBalanceIT() {

    @Autowired
    lateinit var connections: BunqConnectionRepository

    @Autowired
    lateinit var tenants: TenantScopeGateway

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        afterTest { jdbcTemplate.update("DELETE FROM ${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection") }

        test("picking with the stored grant sets the account and leaves the rest of the row alone") {
            val saved = connection(FIRST_GRANT)
            tenants.within(ROUTING) { connections.save(saved) }

            val picked = tenants.within(ROUTING) { connections.pickAccount(BunqAccountId("acc-1"), FIRST_GRANT) }

            picked shouldBe true
            tenants.within(ROUTING) { connections.find() } shouldBe saved.copy(accountId = BunqAccountId("acc-1"))
        }

        test("picking with a grant that was replaced since changes nothing") {
            val replaced = connection(EncryptedToken("sealed-second"))
            tenants.within(ROUTING) { connections.save(replaced) }

            val picked = tenants.within(ROUTING) { connections.pickAccount(BunqAccountId("acc-1"), FIRST_GRANT) }

            picked shouldBe false
            tenants.within(ROUTING) { connections.find() } shouldBe replaced
        }

        test("picking after the connection was deleted writes no row") {
            val picked = tenants.within(ROUTING) { connections.pickAccount(BunqAccountId("acc-1"), FIRST_GRANT) }

            picked shouldBe false
            tenants.within(ROUTING) { connections.find() } shouldBe null
        }
    }

    private fun connection(grant: EncryptedToken) = BunqConnection(
        accountId = null,
        grant = grant,
        connectedBy = ADMIN,
        connectedAt = Instant.parse("2026-10-28T12:00:00Z"),
    )
}
