package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.StoredBunqApiContext
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
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
private val SESSION = EncryptedToken("sealed-session")
private val GRANT = EncryptedToken("sealed-grant")

/** The Bunq API session is kept on the team's connection row, in the team's tenant schema, and only while that row exists. */
class JpaBunqApiContextRepositoryAdapterIT : TeamBalanceIT() {

    @Autowired
    lateinit var contexts: BunqApiContextRepository

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

        test("a new connection is found with its grant and no session") {
            tenants.within(ROUTING) { connections.save(connection()) }

            tenants.within(ROUTING) { contexts.find() } shouldBe StoredBunqApiContext(GRANT, null)
        }

        test("a session saved for the grant the row holds is read back as it was stored") {
            tenants.within(ROUTING) { connections.save(connection()) }

            val saved = tenants.within(ROUTING) { contexts.save(SESSION, ifGrant = GRANT) }

            saved shouldBe true
            tenants.within(ROUTING) { contexts.find() } shouldBe StoredBunqApiContext(GRANT, SESSION)
        }

        test("a session made for another grant than the row holds is not written") {
            tenants.within(ROUTING) { connections.save(connection()) }

            val saved = tenants.within(ROUTING) { contexts.save(SESSION, ifGrant = EncryptedToken("sealed-other-grant")) }

            saved shouldBe false
            tenants.within(ROUTING) { contexts.find() } shouldBe StoredBunqApiContext(GRANT, null)
        }

        test("without a connection nothing is saved and nothing is found") {
            val saved = tenants.within(ROUTING) { contexts.save(SESSION, ifGrant = GRANT) }

            saved shouldBe false
            tenants.within(ROUTING) { contexts.find() } shouldBe null
            val table = "${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection"
            jdbcTemplate.queryForObject("SELECT count(*) FROM $table", Int::class.java) shouldBe 0
        }

        test("outside any tenant scope nothing is saved and nothing is found, instead of failing") {
            contexts.find() shouldBe null
            contexts.save(SESSION, ifGrant = GRANT) shouldBe false
        }

        test("connecting again drops the session, and a session made for the replaced grant can no longer be stored") {
            tenants.within(ROUTING) { connections.save(connection()) }
            tenants.within(ROUTING) { contexts.save(SESSION, ifGrant = GRANT) }

            tenants.within(ROUTING) { connections.save(connection(grant = EncryptedToken("sealed-new-grant"))) }

            tenants.within(ROUTING) { contexts.find() } shouldBe StoredBunqApiContext(EncryptedToken("sealed-new-grant"), null)
            tenants.within(ROUTING) { contexts.save(SESSION, ifGrant = GRANT) } shouldBe false
            tenants.within(ROUTING) { contexts.find()!!.context } shouldBe null
        }

        test("picking an account leaves the session alone, and saving the session leaves the connection alone") {
            tenants.within(ROUTING) { connections.save(connection()) }
            tenants.within(ROUTING) { contexts.save(SESSION, ifGrant = GRANT) }

            tenants.within(ROUTING) { connections.pickAccount(BunqAccountId("acc-1"), GRANT) } shouldBe true

            tenants.within(ROUTING) { contexts.find()!!.context } shouldBe SESSION
            tenants.within(ROUTING) { contexts.save(EncryptedToken("sealed-session-2"), ifGrant = GRANT) }
            tenants.within(ROUTING) { connections.find() } shouldBe connection(account = BunqAccountId("acc-1"))
        }
    }

    private fun connection(grant: EncryptedToken = GRANT, account: BunqAccountId? = null) = BunqConnection(
        accountId = account,
        grant = grant,
        connectedBy = ADMIN,
        connectedAt = Instant.parse("2026-10-28T12:00:00Z"),
    )

    private companion object {
        val ADMIN = UserId(UUID.fromString("b8320000-0000-0000-0000-0000000000ad"))
    }
}
