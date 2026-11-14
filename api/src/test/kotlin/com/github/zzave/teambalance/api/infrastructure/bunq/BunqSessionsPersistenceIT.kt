package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.BunqGrantSeal
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import com.github.zzave.teambalance.api.infrastructure.config.BunqGrantCipherConfiguration
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.UUID
import javax.crypto.AEADBadTagException

private const val ACCESS_TOKEN = "access-token-of-the-persistence-it"
private val ALPHA = TeamId(UUID.fromString(CalendarLinkFixture.ALPHA_TEAM))
private val BETA = TeamId(UUID.fromString(CalendarLinkFixture.BETA_TEAM))
private val ROUTING = TenantRouting(ALPHA, SchemaName(CalendarLinkFixture.ALPHA_SCHEMA))
private val BETA_ROUTING = TenantRouting(BETA, SchemaName(CalendarLinkFixture.BETA_SCHEMA))
private val NOW = Instant.parse("2026-10-28T12:00:00Z")

/**
 * `BunqSessions` end to end with the real persistence adapter and the real cipher: the ciphertext of the row's grant that
 * `find()` hands over is the one `save()` must match, which a double of the port cannot show. Two tenant schemas, because
 * what the team id as AAD guards against only exists with a second team: a value of one team's row in another's.
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
    lateinit var currentTeam: CurrentTeamGateway

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        afterTest {
            jdbcTemplate.update("DELETE FROM ${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection")
            jdbcTemplate.update("DELETE FROM ${CalendarLinkFixture.BETA_SCHEMA}.bunq_connection")
        }

        fun properties() = BunqCallProperties(
            Duration.ofSeconds(5),
            Duration.ofSeconds(15),
            Duration.ofSeconds(30),
            Duration.ofSeconds(1),
            Duration.ofSeconds(60),
        )

        fun sessions(fake: FakeBunqServer) =
            BunqSessions(
                fake.server,
                "TeamBalance IT",
                contexts,
                BunqGrantSeal(cipher),
                cipher,
                currentTeam,
                BunqCalls(properties(), Clock.systemUTC()),
            )

        fun grantOf(team: TeamId, token: String = ACCESS_TOKEN) = cipher.encrypt(token, TokenCipher.aadOf(team, Purpose.BUNQ_GRANT))

        fun connect(routing: TenantRouting, grant: EncryptedToken) {
            tenants.within(routing) { connections.save(BunqConnection(null, grant, UserId.random(), NOW)) }
        }

        fun readIn(routing: TenantRouting, sessions: BunqSessions, grant: BunqGrant = BunqGrant(ACCESS_TOKEN)) {
            tenants.within(routing) { sessions.persistIfChanged(sessions.sessionFor(grant)) }
        }

        fun rowIn(routing: TenantRouting) = tenants.within(routing) { contexts.find() }

        test("a session set up by one BunqSessions is stored encrypted on the row and restored by another without setting up again") {
            FakeBunqServer().use { fake ->
                val grant = BunqGrant(ACCESS_TOKEN)
                connect(ROUTING, grantOf(ALPHA))

                val first = sessions(fake)
                readIn(ROUTING, first)

                val stored = rowIn(ROUTING)!!.context!!
                cipher.decrypt(stored, TokenCipher.aadOf(ALPHA, Purpose.BUNQ_API_CONTEXT)) shouldContain ACCESS_TOKEN
                fake.count("POST", "/v1/installation") shouldBe 1

                val second = sessions(fake)
                tenants.within(ROUTING) { second.sessionFor(grant) }

                fake.count("POST", "/v1/installation") shouldBe 1
            }
        }

        test("the stored session opens with the id of the team whose row holds it and with no other") {
            FakeBunqServer().use { fake ->
                connect(ROUTING, grantOf(ALPHA))

                readIn(ROUTING, sessions(fake))

                val stored = rowIn(ROUTING)!!.context!!
                shouldThrow<AEADBadTagException> { cipher.decrypt(stored, TokenCipher.aadOf(BETA, Purpose.BUNQ_API_CONTEXT)) }
                shouldThrow<AEADBadTagException> { cipher.decrypt(stored, TokenCipher.NO_AAD) }
            }
        }

        test("a row copied from Alpha into Beta is not restored or written over in Beta's scope, and the read does not fail") {
            FakeBunqServer().use { fake ->
                connect(ROUTING, grantOf(ALPHA))
                readIn(ROUTING, sessions(fake))
                jdbcTemplate.update(
                    "INSERT INTO ${CalendarLinkFixture.BETA_SCHEMA}.bunq_connection " +
                        "SELECT * FROM ${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection",
                )
                val copied = rowIn(BETA_ROUTING)
                val installations = fake.count("POST", "/v1/installation")

                readIn(BETA_ROUTING, sessions(fake))

                fake.count("POST", "/v1/installation") shouldBe installations + 1
                rowIn(BETA_ROUTING) shouldBe copied
            }
        }

        // A write in one tenant must leave the other tenant's row alone: the one test the PR that introduced
        // the Context storage was missing.
        test("a session stored in Alpha's scope leaves Beta's row as it was") {
            FakeBunqServer().use { fake ->
                connect(ROUTING, grantOf(ALPHA))
                connect(BETA_ROUTING, grantOf(BETA, "the-token-of-beta"))
                val betaBefore = rowIn(BETA_ROUTING)

                readIn(ROUTING, sessions(fake))

                rowIn(ROUTING)!!.context shouldNotBe null
                rowIn(BETA_ROUTING) shouldBe betaBefore
            }
        }

        // SessionTenantContextFilter routes the callback to the Admin's Active Team, which can be another team than the one
        // the grant is for. The read there finds a row that is not this grant's, writes nothing, and the first read in the
        // grant's own team stores the session, bound to that team.
        test("a session made while another team's tenant was in scope is stored by the first read in the grant's own team") {
            FakeBunqServer().use { fake ->
                connect(ROUTING, grantOf(ALPHA))
                connect(BETA_ROUTING, grantOf(BETA, "the-token-of-beta"))
                val betaBefore = rowIn(BETA_ROUTING)
                val sessions = sessions(fake)

                readIn(BETA_ROUTING, sessions)

                rowIn(ROUTING)!!.context shouldBe null
                rowIn(BETA_ROUTING) shouldBe betaBefore

                readIn(ROUTING, sessions)

                fake.count("POST", "/v1/installation") shouldBe 1
                val stored = rowIn(ROUTING)!!.context!!
                cipher.decrypt(stored, TokenCipher.aadOf(ALPHA, Purpose.BUNQ_API_CONTEXT)) shouldContain ACCESS_TOKEN
                shouldThrow<AEADBadTagException> { cipher.decrypt(stored, TokenCipher.aadOf(BETA, Purpose.BUNQ_API_CONTEXT)) }
                rowIn(BETA_ROUTING) shouldBe betaBefore
            }
        }

        // The next two tests write the wrong-purpose value themselves, with the plaintext that is right for its column, so
        // that only the purpose differs. With the purpose ignored both would pass through BunqSessions as valid.
        fun setColumns(grant: EncryptedToken?, context: EncryptedToken?) {
            jdbcTemplate.update(
                "UPDATE ${CalendarLinkFixture.ALPHA_SCHEMA}.bunq_connection SET access_token_encrypted = ?, api_context_encrypted = ?",
                grant?.value ?: rowIn(ROUTING)!!.grant.value, context?.value,
            )
        }

        test("a grant made for the API context in the grant column gets no session written, and the read does not fail") {
            FakeBunqServer().use { fake ->
                connect(ROUTING, grantOf(ALPHA))
                // No stored Context, so the session the read sets up is one that wants to be stored.
                setColumns(cipher.encrypt(ACCESS_TOKEN, TokenCipher.aadOf(ALPHA, Purpose.BUNQ_API_CONTEXT)), null)
                val before = rowIn(ROUTING)

                readIn(ROUTING, sessions(fake))

                fake.count("POST", "/v1/installation") shouldBe 1
                rowIn(ROUTING) shouldBe before
            }
        }

        test("a Context made for the grant in the Context column is not restored, and is replaced by a new session") {
            FakeBunqServer().use { fake ->
                connect(ROUTING, grantOf(ALPHA))
                readIn(ROUTING, sessions(fake))
                val grantColumn = rowIn(ROUTING)!!.grant
                val validContext = cipher.decrypt(rowIn(ROUTING)!!.context!!, TokenCipher.aadOf(ALPHA, Purpose.BUNQ_API_CONTEXT))
                val installations = fake.count("POST", "/v1/installation")
                setColumns(grantColumn, cipher.encrypt(validContext, TokenCipher.aadOf(ALPHA, Purpose.BUNQ_GRANT)))

                readIn(ROUTING, sessions(fake))

                fake.count("POST", "/v1/installation") shouldBe installations + 1
                rowIn(ROUTING)!!.grant shouldBe grantColumn
                cipher.decrypt(rowIn(ROUTING)!!.context!!, TokenCipher.aadOf(ALPHA, Purpose.BUNQ_API_CONTEXT)) shouldContain ACCESS_TOKEN
            }
        }

        test("a row made before the AAD existed gets no session written, and the read does not fail") {
            FakeBunqServer().use { fake ->
                connect(ROUTING, cipher.encrypt(ACCESS_TOKEN, TokenCipher.NO_AAD))
                val before = rowIn(ROUTING)

                readIn(ROUTING, sessions(fake))

                rowIn(ROUTING) shouldBe before
            }
        }
    }
}
