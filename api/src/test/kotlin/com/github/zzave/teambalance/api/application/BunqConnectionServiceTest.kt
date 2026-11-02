package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.BunqConnectDisabledException
import com.github.zzave.teambalance.api.domain.exception.BunqConnectionChangedException
import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.exception.BunqNotConnectedException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.UnknownBunqAccountException
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAccountName
import com.github.zzave.teambalance.api.domain.model.BunqAccounts
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.BunqOAuthState
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.BunqOAuthStateRepository
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import java.net.URI
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.util.Base64
import java.util.UUID

private class SteppingClock(var now: Instant) : Clock() {
    override fun instant(): Instant = now
    override fun getZone() = ZoneOffset.UTC
    override fun withZone(zone: java.time.ZoneId): Clock = this
    fun advance(by: Duration) {
        now = now.plus(by)
    }
}

private class InMemoryOAuthStates : BunqOAuthStateRepository {
    val byHash = mutableMapOf<TokenHash, BunqOAuthState>()
    var failLookups = false
    var failConsumes = false

    override fun save(state: BunqOAuthState) {
        byHash[state.tokenHash] = state
    }

    override fun findByTokenHash(tokenHash: TokenHash): BunqOAuthState? {
        check(!failLookups) { "database down" }
        return byHash[tokenHash]
    }

    override fun consume(id: UUID, now: Instant): Boolean {
        check(!failConsumes) { "database down" }
        val state = byHash.values.first { it.id == id }
        if (state.usedAt != null) return false
        byHash[state.tokenHash] = state.copy(usedAt = now)
        return true
    }

    override fun deleteExpiredBefore(cutoff: Instant) {
        byHash.values.removeIf { it.expiresAt.isBefore(cutoff) }
    }
}

/** One connection slot per tenant schema, selected by the scope the service is working in. */
private class TenantScopedConnections : TenantScopeGateway, BunqConnectionRepository {
    private val perSchema = mutableMapOf<SchemaName, BunqConnection>()
    private var scope: SchemaName? = null

    /** The schema the request itself is routed to, which is not the schema the callback must write to. */
    fun requestSchema(schema: SchemaName?) {
        scope = schema
    }

    fun connectionIn(schema: SchemaName): BunqConnection? = perSchema[schema]

    fun hasNoConnections() = perSchema.isEmpty()

    fun putConnectionIn(schema: SchemaName, connection: BunqConnection) {
        perSchema[schema] = connection
    }

    var failSaves = false

    override fun <T> within(routing: TenantRouting, block: () -> T): T {
        val before = scope
        scope = routing.schemaName
        try {
            return block()
        } finally {
            scope = before
        }
    }

    override fun find() = perSchema[scope ?: error("no tenant in scope")]

    override fun save(connection: BunqConnection) {
        check(!failSaves) { "database down" }
        perSchema[scope ?: error("no tenant in scope")] = connection
    }

    override fun pickAccount(accountId: BunqAccountId, ifGrant: EncryptedToken): Boolean {
        val schema = scope ?: error("no tenant in scope")
        val stored = perSchema[schema]?.takeIf { it.grant == ifGrant } ?: return false
        perSchema[schema] = stored.copy(accountId = accountId)
        return true
    }

    override fun delete() {
        perSchema.remove(scope ?: error("no tenant in scope"))
    }
}

/** Notes which teams were evicted, and runs [onEvict] at that moment. */
private class RecordingMoneyPoolCache : MoneyPoolCacheGateway {
    val evicted = mutableListOf<TeamId>()
    var onEvict: () -> Unit = {}

    override fun read(teamId: TeamId, account: BunqAccountId, load: () -> MoneyPool): MoneyPool = error("not used")

    override fun evict(teamId: TeamId) {
        evicted += teamId
        onEvict()
    }
}

private class ScriptedBunq : BunqGateway {
    var accounts = listOf(
        BunqAccount(BunqAccountId("acc-1"), BunqAccountName("Teamkas")),
        BunqAccount(BunqAccountId("acc-2"), BunqAccountName("Privé")),
    )
    var exchanges = 0
    var lastState: String? = null
    var lastRedirectUri: String? = null
    var listedWith: BunqGrant? = null
    var listFailure: Exception? = null

    /** Runs while a listing is in flight, to let something else happen to the team during the Bunq call. */
    var whileListing: () -> Unit = {}

    override fun authorizationUrl(state: String, redirectUri: String): String {
        lastState = state
        lastRedirectUri = redirectUri
        return "https://bunq.test/authorize?state=$state"
    }

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant {
        exchanges++
        check(code.value != "refused") { "Bunq refused the code" }
        return BunqGrant("token-for-${code.value}")
    }

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> {
        listedWith = grant
        whileListing()
        listFailure?.let { throw it }
        return accounts
    }

    override fun fetchBalance(grant: BunqGrant, account: BunqAccountId): Money = error("not used")

    override fun fetchPayments(grant: BunqGrant, account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> =
        error("not used")
}

private const val CALLBACK = "https://api.test/api/bunq/oauth/callback"
private val START = Instant.parse("2026-10-11T10:00:00Z")

class BunqConnectionServiceTest : FunSpec() {
    init {
        val admin = UserId.random()
        val member = UserId.random()
        val otherAdmin = UserId.random()
        val operator = UserId.random()

        class Fixture(connectEnabled: Boolean = true, actingOperator: UserId? = null) {
            val directory = TeamDirectory()
            val team = directory.addTeam("Setpoint VT", "setpoint-vt")
            val otherTeam = directory.addTeam("Dames 5", "dames-5")
            val clock = SteppingClock(START)
            val states = InMemoryOAuthStates()
            val tenants = TenantScopedConnections()
            val bunq = ScriptedBunq()
            val cache = RecordingMoneyPoolCache()
            val cipher = TokenCipher.fromBase64Key(
                Base64.getEncoder().encodeToString(ByteArray(32) { (it + 7).toByte() }),
                "test-key",
            )
            var service: BunqConnectionService
            private val actAsGateway: FakeActAsGateway
            private val episodes: InMemoryActAsRepository

            init {
                directory.join(admin, team, Role.ADMIN)
                directory.join(member, team, Role.USER)
                directory.join(otherAdmin, otherTeam, Role.ADMIN)
                val actAsGrant = actingOperator?.let { ActAs.enter(it, team, START) }
                episodes = InMemoryActAsRepository().also { repo -> actAsGrant?.let(repo::save) }
                actAsGateway = FakeActAsGateway(actAsGrant)
                service = buildService(connectEnabled)
                // The request that carries the callback is routed to some other team's schema.
                tenants.requestSchema(directory.schemaOf(otherTeam))
            }

            /** The same service over the same stores, with connecting switched on or off. */
            fun switchConnecting(enabled: Boolean) {
                service = buildService(enabled)
            }

            private fun buildService(connectEnabled: Boolean) =
                BunqConnectionService(
                    connectionRepository = tenants,
                    stateRepository = states,
                    bunqGateway = bunq,
                    tenantScopeGateway = tenants,
                    teamRepository = directory.teamRepository(),
                    teamMemberRepository = directory.teamMemberRepository(),
                    actAsService = directory.actAsService(
                        RecordingTenantRoutingGateway(), episodes, clock, setOf(operator), actAsGateway,
                    ),
                    authorizationService = AuthorizationService(directory.teamMemberRepository(), actAsGateway),
                    clock = clock,
                    connectConfig = if (connectEnabled) BunqConnectConfig(cipher, CALLBACK) else null,
                    moneyPoolCache = cache,
                )

            /** The callback as the browser delivers it: by default with the starting Admin's session. */
            fun complete(state: String?, code: String?, error: String?, sessionUser: UserId? = admin) =
                service.complete(state, code, error, sessionUser)

            val teamSchema get() = directory.schemaOf(team)
            val teamSlug = Slug("setpoint-vt")

            /** Starts as [asAdmin] and returns the plaintext state Bunq would hand back. */
            fun startFlow(asAdmin: UserId = admin): String {
                service.start(asAdmin, team)
                return bunq.lastState!!
            }

            fun grantIn(schema: SchemaName) = tenants.connectionIn(schema)?.grant?.let(cipher::decrypt)

            /** A connected team, as the Admin's own requests see it. */
            fun connected(code: String = "abc") {
                complete(startFlow(), code, null).result shouldBe BunqConnectResult.CONNECTED
                tenants.requestSchema(teamSchema)
            }

            /** The stored grant stops decrypting, as after the encryption key was replaced. */
            fun rotateKey() {
                val newKey = TokenCipher.fromBase64Key(Base64.getEncoder().encodeToString(ByteArray(32) { it.toByte() }), "other-key")
                val stored = tenants.connectionIn(teamSchema)!!
                tenants.putConnectionIn(teamSchema, stored.copy(grant = newKey.encrypt(cipher.decrypt(stored.grant))))
            }

            fun pickedAccount() = tenants.connectionIn(teamSchema)?.accountId
        }

        context("starting") {
            test("returns the Bunq page for the state and stores only the state's hash, valid for 10 minutes") {
                val f = Fixture()

                val url = f.service.start(admin, f.team)

                val state = f.bunq.lastState!!
                url shouldBe "https://bunq.test/authorize?state=$state"
                f.bunq.lastRedirectUri shouldBe CALLBACK
                val stored = f.states.byHash.values.single()
                stored.teamId shouldBe f.team
                stored.adminUserId shouldBe admin
                stored.expiresAt shouldBe START.plus(Duration.ofMinutes(10))
                stored.usedAt shouldBe null
                stored.tokenHash.value.length shouldBe 64
                state shouldNotContain stored.tokenHash.value
                Base64.getUrlDecoder().decode(state).size shouldBe 32
            }

            test("every start mints a different state") {
                val f = Fixture()

                f.startFlow() shouldNotBe f.startFlow()
            }

            test("a member who is no admin is refused and nothing is stored") {
                val f = Fixture()

                shouldThrow<NotTeamAdminException> { f.service.start(member, f.team) }

                f.states.byHash.size shouldBe 0
            }

            test("is not found when connecting is switched off, whoever asks") {
                val f = Fixture(connectEnabled = false)

                shouldThrow<BunqConnectDisabledException> { f.service.start(admin, f.team) }
                shouldThrow<BunqConnectDisabledException> { f.service.start(member, f.team) }
                f.states.byHash.size shouldBe 0
            }

            test("clears states that expired more than a day ago") {
                val f = Fixture()
                f.startFlow()
                f.clock.advance(Duration.ofDays(2))

                f.service.start(admin, f.team)

                f.states.byHash.size shouldBe 1
            }
        }

        context("the callback") {
            test("exchanges the code and stores the encrypted grant in the team that started it, not in the request's tenant") {
                val f = Fixture()
                val state = f.startFlow()

                val outcome = f.complete(state, "abc", null)

                outcome shouldBe BunqConnectOutcome(BunqConnectResult.CONNECTED, f.teamSlug)
                val stored = f.tenants.connectionIn(f.teamSchema)!!
                f.cipher.decrypt(stored.grant) shouldBe "token-for-abc"
                stored.grant.value shouldNotContain "token-for-abc"
                stored.connectedBy shouldBe admin
                stored.connectedAt shouldBe START
                stored.accountId shouldBe null
                f.tenants.connectionIn(f.directory.schemaOf(f.otherTeam)) shouldBe null
            }

            test("evicts the cached money pool of the team that started the flow, after the new grant is stored") {
                val f = Fixture()
                val state = f.startFlow()
                var grantWhenEvicted: String? = null
                f.cache.onEvict = { grantWhenEvicted = f.grantIn(f.teamSchema) }

                f.complete(state, "abc", null).result shouldBe BunqConnectResult.CONNECTED

                f.cache.evicted shouldBe listOf(f.team)
                grantWhenEvicted shouldBe "token-for-abc"
            }

            test("a failed connection evicts nothing") {
                val f = Fixture()
                f.complete(f.startFlow(), "refused", null).result shouldBe BunqConnectResult.FAILED
                f.tenants.failSaves = true
                f.complete(f.startFlow(), "abc", null).result shouldBe BunqConnectResult.FAILED

                f.cache.evicted shouldBe emptyList()
            }

            test("without a session it fails, spends the state and writes nothing") {
                val f = Fixture()
                val state = f.startFlow()

                f.complete(state, "abc", null, sessionUser = null) shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, f.teamSlug)

                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
                f.complete(state, "abc", null).result shouldBe BunqConnectResult.FAILED
            }

            test("a state minted before connecting was switched off fails and writes nothing") {
                val f = Fixture()
                val state = f.startFlow()
                f.switchConnecting(false)

                f.complete(state, "abc", null) shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, f.teamSlug)

                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
            }

            test("a failure writing the connection is a failed outcome, not an exception") {
                val f = Fixture()
                val state = f.startFlow()
                f.tenants.failSaves = true

                f.complete(state, "abc", null) shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, f.teamSlug)

                f.tenants.hasNoConnections() shouldBe true
            }

            test("a state lookup that throws is a failed outcome, never an exception") {
                val f = Fixture()
                val state = f.startFlow()
                f.states.failLookups = true

                f.complete(state, "abc", null) shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, null)

                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
            }

            test("spending the state failing is a failed outcome that still names the team") {
                val f = Fixture()
                val state = f.startFlow()
                f.states.failConsumes = true

                f.complete(state, "abc", null) shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, f.teamSlug)

                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
            }

            test("works when the session belongs to the admin who started it") {
                val f = Fixture()

                f.service.complete(f.startFlow(), "abc", null, sessionUser = admin).result shouldBe BunqConnectResult.CONNECTED
            }

            test("a second use of the same state fails and exchanges nothing more") {
                val f = Fixture()
                val state = f.startFlow()
                f.complete(state, "abc", null)

                val outcome = f.complete(state, "second", null)

                outcome shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, f.teamSlug)
                f.bunq.exchanges shouldBe 1
                f.grantIn(f.teamSchema) shouldBe "token-for-abc"
            }

            test("an expired state fails without exchanging or writing") {
                val f = Fixture()
                val state = f.startFlow()
                f.clock.advance(Duration.ofMinutes(10).plusSeconds(1))

                val outcome = f.complete(state, "abc", null)

                outcome shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, f.teamSlug)
                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
            }

            test("an unknown, blank or missing state fails without naming a team") {
                val f = Fixture()
                f.startFlow()

                listOf("not-a-state", "", null).forEach {
                    f.complete(it, "abc", null) shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, null)
                }
                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
            }

            test("access_denied is a decline: the state is spent and nothing is written") {
                val f = Fixture()
                val state = f.startFlow()

                f.complete(state, null, "access_denied") shouldBe
                    BunqConnectOutcome(BunqConnectResult.DECLINED, f.teamSlug)

                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
                f.complete(state, "abc", null).result shouldBe BunqConnectResult.FAILED
            }

            test("any other error, or no code, fails") {
                val f = Fixture()

                f.complete(f.startFlow(), null, "server_error").result shouldBe BunqConnectResult.FAILED
                f.complete(f.startFlow(), null, null).result shouldBe BunqConnectResult.FAILED
                f.tenants.hasNoConnections() shouldBe true
            }

            test("an admin demoted since the start connects nothing") {
                val f = Fixture()
                val state = f.startFlow()
                f.directory.join(admin, f.team, Role.USER)

                f.complete(state, "abc", null) shouldBe BunqConnectOutcome(BunqConnectResult.FAILED, f.teamSlug)

                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
            }

            test("an admin who left the team since the start connects nothing") {
                val f = Fixture()
                val state = f.startFlow()
                f.directory.leave(admin, f.team)

                f.complete(state, "abc", null).result shouldBe BunqConnectResult.FAILED

                f.tenants.hasNoConnections() shouldBe true
            }

            test("a session of another user fails, spends the state and writes nothing") {
                val f = Fixture()
                val state = f.startFlow()

                f.service.complete(state, "abc", null, sessionUser = otherAdmin).result shouldBe BunqConnectResult.FAILED

                f.bunq.exchanges shouldBe 0
                f.tenants.hasNoConnections() shouldBe true
                f.service.complete(state, "abc", null, sessionUser = admin).result shouldBe BunqConnectResult.FAILED
            }

            test("a code Bunq refuses fails and writes nothing") {
                val f = Fixture()

                f.complete(f.startFlow(), "refused", null) shouldBe
                    BunqConnectOutcome(BunqConnectResult.FAILED, f.teamSlug)

                f.tenants.hasNoConnections() shouldBe true
            }

            test("a Platform Admin acting as the team connects it, because act-as grants Admin") {
                val f = Fixture(actingOperator = operator)
                val state = f.startFlow(operator)

                f.service.complete(state, "abc", null, sessionUser = operator).result shouldBe BunqConnectResult.CONNECTED

                f.grantIn(f.teamSchema) shouldBe "token-for-abc"
                f.tenants.connectionIn(f.teamSchema)!!.connectedBy shouldBe operator
            }

            test("reconnecting replaces the grant") {
                val f = Fixture()
                f.complete(f.startFlow(), "first", null)

                f.complete(f.startFlow(), "second", null).result shouldBe BunqConnectResult.CONNECTED

                f.grantIn(f.teamSchema) shouldBe "token-for-second"
            }

            test("reconnecting keeps the picked account while the new grant still covers it") {
                val f = Fixture()
                f.connected("first")
                f.service.pickAccount(admin, f.team, BunqAccountId("acc-2"))

                f.complete(f.startFlow(), "second", null).result shouldBe BunqConnectResult.CONNECTED

                f.pickedAccount() shouldBe BunqAccountId("acc-2")
                f.grantIn(f.teamSchema) shouldBe "token-for-second"
            }

            test("reconnecting drops the picked account when the new grant no longer covers it") {
                val f = Fixture()
                f.connected("first")
                f.service.pickAccount(admin, f.team, BunqAccountId("acc-2"))
                f.bunq.accounts = f.bunq.accounts.filter { it.id == BunqAccountId("acc-1") }

                f.complete(f.startFlow(), "second", null).result shouldBe BunqConnectResult.CONNECTED

                f.pickedAccount() shouldBe null
                f.grantIn(f.teamSchema) shouldBe "token-for-second"
            }
        }

        context("status") {
            test("walks from not connected to connected to an account picked") {
                val f = Fixture()
                f.tenants.requestSchema(f.teamSchema)

                f.service.status(admin, f.team) shouldBe
                    BunqConnectionStatus(connectAvailable = true, connected = false, accountPicked = false)
                f.connected()
                f.service.status(admin, f.team) shouldBe
                    BunqConnectionStatus(connectAvailable = true, connected = true, accountPicked = false)
                f.service.pickAccount(admin, f.team, BunqAccountId("acc-1"))
                f.service.status(admin, f.team) shouldBe
                    BunqConnectionStatus(connectAvailable = true, connected = true, accountPicked = true)
            }

            test("says connecting is unavailable when switched off, and is for admins only") {
                val f = Fixture(connectEnabled = false)

                f.service.status(admin, f.team).connectAvailable shouldBe false
                shouldThrow<NotTeamAdminException> { f.service.status(member, f.team) }
            }
        }

        context("listing the accounts") {
            test("shows the accounts the grant covers and no selection before a pick") {
                val f = Fixture()
                f.connected()

                f.service.listAccounts(admin, f.team) shouldBe BunqAccounts(f.bunq.accounts, selected = null)
            }

            test("shows the picked account as selected") {
                val f = Fixture()
                f.connected()
                f.service.pickAccount(admin, f.team, BunqAccountId("acc-2"))

                f.service.listAccounts(admin, f.team).selected shouldBe BunqAccountId("acc-2")
            }

            test("asks Bunq with the decrypted grant") {
                val f = Fixture()
                f.connected("abc")

                f.service.listAccounts(admin, f.team)

                f.bunq.listedWith shouldBe BunqGrant("token-for-abc")
            }

            test("is not found while the team is not connected") {
                val f = Fixture()
                f.tenants.requestSchema(f.teamSchema)

                shouldThrow<BunqNotConnectedException> { f.service.listAccounts(admin, f.team) }
            }

            test("is for admins only") {
                val f = Fixture()
                f.connected()

                shouldThrow<NotTeamAdminException> { f.service.listAccounts(member, f.team) }
            }

            test("a Platform Admin acting as the team may list") {
                val f = Fixture(actingOperator = operator)
                f.service.complete(f.startFlow(operator), "abc", null, sessionUser = operator)
                f.tenants.requestSchema(f.teamSchema)

                f.service.listAccounts(operator, f.team).accounts shouldBe f.bunq.accounts
            }

            test("a grant that does not decrypt is BUNQ_REJECTED") {
                val f = Fixture()
                f.connected()
                f.rotateKey()

                shouldThrow<BunqGrantRejectedException> { f.service.listAccounts(admin, f.team) }
            }

            test("is not found when connecting is switched off, because the cipher is only there while it is on") {
                val f = Fixture()
                f.connected()
                f.switchConnecting(false)

                shouldThrow<BunqConnectDisabledException> { f.service.listAccounts(admin, f.team) }
            }

            test("a grant that does not decrypt evicts the cached money pool, so the next read finds out") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()
                f.rotateKey()

                shouldThrow<BunqGrantRejectedException> { f.service.listAccounts(admin, f.team) }

                f.cache.evicted shouldBe listOf(f.team)
            }

            test("a grant Bunq rejects evicts the cached money pool") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()
                f.bunq.listFailure = BunqGrantRejectedException()

                shouldThrow<BunqGrantRejectedException> { f.service.listAccounts(admin, f.team) }

                f.cache.evicted shouldBe listOf(f.team)
            }

            test("a Bunq failure that is no rejection evicts nothing") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()
                f.bunq.listFailure = IllegalStateException("bunq down")

                shouldThrow<IllegalStateException> { f.service.listAccounts(admin, f.team) }

                f.cache.evicted shouldBe emptyList()
            }

            test("an admin who may not list evicts nothing") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()
                f.rotateKey()

                shouldThrow<NotTeamAdminException> { f.service.listAccounts(member, f.team) }

                f.cache.evicted shouldBe emptyList()
            }
        }

        context("picking an account") {
            test("stores the pick and keeps the grant") {
                val f = Fixture()
                f.connected()
                val before = f.tenants.connectionIn(f.teamSchema)!!

                f.service.pickAccount(admin, f.team, BunqAccountId("acc-1"))

                f.tenants.connectionIn(f.teamSchema) shouldBe before.copy(accountId = BunqAccountId("acc-1"))
            }

            test("changing the pick replaces it") {
                val f = Fixture()
                f.connected()
                f.service.pickAccount(admin, f.team, BunqAccountId("acc-1"))

                f.service.pickAccount(admin, f.team, BunqAccountId("acc-2"))

                f.pickedAccount() shouldBe BunqAccountId("acc-2")
            }

            test("an id outside the grant is refused and nothing is written") {
                val f = Fixture()
                f.connected()

                shouldThrow<UnknownBunqAccountException> { f.service.pickAccount(admin, f.team, BunqAccountId("not-mine")) }

                f.pickedAccount() shouldBe null
            }

            test("is not found while the team is not connected") {
                val f = Fixture()
                f.tenants.requestSchema(f.teamSchema)

                shouldThrow<BunqNotConnectedException> { f.service.pickAccount(admin, f.team, BunqAccountId("acc-1")) }
            }

            test("is for admins only and writes nothing") {
                val f = Fixture()
                f.connected()

                shouldThrow<NotTeamAdminException> { f.service.pickAccount(member, f.team, BunqAccountId("acc-1")) }

                f.pickedAccount() shouldBe null
            }

            test("a Disconnect during the Bunq call leaves no connection, and the pick says the connection changed") {
                val f = Fixture()
                f.connected()
                f.bunq.whileListing = { f.service.disconnect(admin, f.team) }

                shouldThrow<BunqConnectionChangedException> { f.service.pickAccount(admin, f.team, BunqAccountId("acc-1")) }

                f.tenants.hasNoConnections() shouldBe true
            }

            test("a reconnect during the Bunq call keeps the new grant, and the pick says the connection changed") {
                val f = Fixture()
                f.connected("first")
                f.bunq.whileListing = {
                    f.bunq.whileListing = {}
                    f.complete(f.startFlow(), "second", null).result shouldBe BunqConnectResult.CONNECTED
                }

                shouldThrow<BunqConnectionChangedException> { f.service.pickAccount(admin, f.team, BunqAccountId("acc-1")) }

                f.grantIn(f.teamSchema) shouldBe "token-for-second"
                f.pickedAccount() shouldBe null
            }

            test("a grant that does not decrypt is BUNQ_REJECTED and nothing is written") {
                val f = Fixture()
                f.connected()
                f.rotateKey()

                shouldThrow<BunqGrantRejectedException> { f.service.pickAccount(admin, f.team, BunqAccountId("acc-1")) }

                f.pickedAccount() shouldBe null
            }

            test("a successful pick evicts the cached money pool, so the next read uses the new account") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()

                f.service.pickAccount(admin, f.team, BunqAccountId("acc-1"))

                f.cache.evicted shouldBe listOf(f.team)
            }

            test("a pick that is refused evicts nothing") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()

                shouldThrow<UnknownBunqAccountException> { f.service.pickAccount(admin, f.team, BunqAccountId("not-mine")) }
                shouldThrow<NotTeamAdminException> { f.service.pickAccount(member, f.team, BunqAccountId("acc-1")) }

                f.cache.evicted shouldBe emptyList()
            }

            test("a pick that finds the connection changed evicts nothing") {
                val f = Fixture()
                f.connected()
                f.bunq.whileListing = {
                    f.service.disconnect(admin, f.team)
                    f.cache.evicted.clear()
                }

                shouldThrow<BunqConnectionChangedException> { f.service.pickAccount(admin, f.team, BunqAccountId("acc-1")) }

                f.cache.evicted shouldBe emptyList()
            }

            test("a grant that does not decrypt evicts the cached money pool") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()
                f.rotateKey()

                shouldThrow<BunqGrantRejectedException> { f.service.pickAccount(admin, f.team, BunqAccountId("acc-1")) }

                f.cache.evicted shouldBe listOf(f.team)
            }

            test("a grant Bunq rejects evicts the cached money pool") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()
                f.bunq.listFailure = BunqGrantRejectedException()

                shouldThrow<BunqGrantRejectedException> { f.service.pickAccount(admin, f.team, BunqAccountId("acc-1")) }

                f.cache.evicted shouldBe listOf(f.team)
            }
        }

        context("disconnecting") {
            test("deletes the whole connection, grant included") {
                val f = Fixture()
                f.connected()
                f.service.pickAccount(admin, f.team, BunqAccountId("acc-1"))

                f.service.disconnect(admin, f.team)

                f.tenants.connectionIn(f.teamSchema) shouldBe null
                f.service.status(admin, f.team) shouldBe
                    BunqConnectionStatus(connectAvailable = true, connected = false, accountPicked = false)
            }

            test("evicts the cached money pool") {
                val f = Fixture()
                f.connected()
                f.cache.evicted.clear()

                f.service.disconnect(admin, f.team)

                f.cache.evicted shouldBe listOf(f.team)
            }

            test("does nothing while the team is not connected") {
                val f = Fixture()
                f.tenants.requestSchema(f.teamSchema)

                f.service.disconnect(admin, f.team)

                f.tenants.hasNoConnections() shouldBe true
            }

            test("is for admins only and deletes nothing") {
                val f = Fixture()
                f.connected()

                f.cache.evicted.clear()

                shouldThrow<NotTeamAdminException> { f.service.disconnect(member, f.team) }

                f.tenants.connectionIn(f.teamSchema) shouldNotBe null
                f.cache.evicted shouldBe emptyList()
            }

            test("still works when connecting is switched off, because it needs no cipher") {
                val f = Fixture()
                f.connected()
                f.switchConnecting(false)

                f.service.disconnect(admin, f.team)

                f.tenants.hasNoConnections() shouldBe true
            }

            test("a Platform Admin acting as the team may disconnect") {
                val f = Fixture(actingOperator = operator)
                f.service.complete(f.startFlow(operator), "abc", null, sessionUser = operator)
                f.tenants.requestSchema(f.teamSchema)

                f.service.disconnect(operator, f.team)

                f.tenants.hasNoConnections() shouldBe true
            }
        }
    }
}
