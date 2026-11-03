package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import com.github.zzave.teambalance.api.infrastructure.config.BunqGrantCipherConfiguration
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.UUID

private const val ACCESS_TOKEN = "access-token-of-the-persistence-it"
private val ROUTING = TenantRouting(
    TeamId(UUID.fromString(CalendarLinkFixture.ALPHA_TEAM)),
    SchemaName(CalendarLinkFixture.ALPHA_SCHEMA),
)

/**
 * `BunqSessions` end to end with the real persistence adapter and the real cipher: the ciphertext of the row's grant that
 * `find()` hands over is the one `save()` must match, which a double of the port cannot show.
 */
class BunqSessionsPersistenceIT : TeamBalanceIT() {

    @Autowired
    lateinit var contexts: BunqApiContextRepository

    @Autowired
    lateinit var connections: BunqConnectionRepository

    @Autowired
    lateinit var tenants: TenantScopeGateway

    @Autowired
    @Qualifier(BunqGrantCipherConfiguration.BEAN_NAME)
    lateinit var cipher: TokenCipher

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        afterTest { jdbcTemplate.update("DELETE FROM ${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection") }

        test("a session set up by one BunqSessions is stored encrypted on the row and restored by another without setting up again") {
            FakeBunqServer().use { fake ->
                val properties = BunqCallProperties(
                    Duration.ofSeconds(5),
                    Duration.ofSeconds(15),
                    Duration.ofSeconds(30),
                    Duration.ofSeconds(1),
                    Duration.ofSeconds(60),
                )
                fun sessions() = BunqSessions(fake.server, "TeamBalance IT", contexts, cipher, BunqCalls(properties, Clock.systemUTC()))
                val grant = BunqGrant(ACCESS_TOKEN)
                tenants.within(ROUTING) {
                    connections.save(
                        BunqConnection(null, cipher.encrypt(ACCESS_TOKEN), UserId.random(), Instant.parse("2026-10-28T12:00:00Z")),
                    )
                }

                val first = sessions()
                tenants.within(ROUTING) { first.persistIfChanged(first.sessionFor(grant)) }

                val stored = tenants.within(ROUTING) { contexts.find() }!!.context!!
                cipher.decrypt(stored) shouldContain ACCESS_TOKEN
                fake.count("POST", "/v1/installation") shouldBe 1

                val second = sessions()
                tenants.within(ROUTING) { second.sessionFor(grant) }

                fake.count("POST", "/v1/installation") shouldBe 1
            }
        }
    }
}
