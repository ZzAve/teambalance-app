package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BUNQ_SANDBOX_OAUTH
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAccountName
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.model.StoredBunqApiContext
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import io.kotest.matchers.string.shouldStartWith
import java.io.IOException
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.ZoneOffset
import java.util.UUID
import javax.crypto.AEADBadTagException

private const val CLIENT_SECRET = "client-secret-never-in-a-message"
private const val ACCESS_TOKEN = "access-token-never-in-a-message"
private const val CONTEXT_KEY = "dGVhbWJhbGFuY2UtdGVzdC1idW5xLXRva2VuLWtleTE="
private const val RESTORED_SESSION = "restored-session-token"
private const val FORBIDDEN_BODY = """{"Error":[{"error_description":"Not allowed to do that."}]}"""
private const val STALE_SESSION_BODY = """{"Error":[{"error_description":"Insufficient authentication."}]}"""
private const val RATE_LIMITED_BODY =
    """{"Error":[{"error_description":"Too many requests. You can do a maximum of 3 calls per 3 second to this endpoint."}]}"""
private const val BAD_CREDENTIALS_BODY =
    """{"Error":[{"error_description":"User credentials are incorrect. Incorrect API key or IP address."}]}"""
private const val ACCOUNT_PATH = "/v1/user/$FAKE_USER_ID/monetary-account/$FAKE_ACCOUNT_ID"
private val GRANT = BunqGrant(ACCESS_TOKEN)
private val TEAMKAS_ID = BunqAccountId(FAKE_ACCOUNT_ID.toString())
private val AMSTERDAM = ZoneId.of("Europe/Amsterdam")
private val SINCE_FOREVER = LocalDate.of(2000, 1, 1)
private const val LIMIT = 200

private val CIPHER = TokenCipher.fromBase64Key(CONTEXT_KEY, "test")
private val TEAM = TeamId(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
private val OTHER_TEAM = TeamId(UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"))

/** The grant the store holds for [team]: encrypted with the key and the AAD of that team and of a grant. */
private fun sealedGrant(plain: String, team: TeamId = TEAM) = CIPHER.encrypt(plain, TokenCipher.aadOf(team, Purpose.BUNQ_GRANT))

/** The API context the store holds for [team]: the same, with the AAD of a context. */
private fun sealedContext(plain: String, team: TeamId = TEAM) = CIPHER.encrypt(plain, TokenCipher.aadOf(team, Purpose.BUNQ_API_CONTEXT))

/**
 * The row of the tenant in scope as the adapter sees it: the grant it holds and the stored context. A null grant is no row.
 * The row lives in the schema of [TEAM], which is also the team in scope while [inTenantScope].
 */
private class InMemoryContexts : BunqApiContextRepository {
    var rowGrant: EncryptedToken? = sealedGrant(ACCESS_TOKEN)
    var stored: EncryptedToken? = null
    var inTenantScope = true

    val currentTeam = object : CurrentTeamGateway {
        override fun requireCurrentTeamId(): TeamId = findCurrentTeamId() ?: error("no team in scope")
        override fun findCurrentTeamId(): TeamId? = TEAM.takeIf { inTenantScope }
    }
    var saves = 0
    var finds = 0
    var saveAttempts = 0
    var findFails = false
    var saveFails = false

    override fun find(): StoredBunqApiContext? {
        finds++
        check(!findFails) { "the store is down" }
        return if (inTenantScope) rowGrant?.let { StoredBunqApiContext(it, stored) } else null
    }

    override fun save(context: EncryptedToken, ifGrant: EncryptedToken): Boolean {
        saveAttempts++
        check(!saveFails) { "the store is down" }
        if (!inTenantScope || rowGrant == null || rowGrant != ifGrant) return false
        stored = context
        saves++
        return true
    }
}

private class TestClock(var now: Instant = Instant.parse("2026-11-03T12:00:00Z")) : Clock() {
    override fun getZone(): ZoneId = ZoneOffset.UTC
    override fun withZone(zone: ZoneId): Clock = this
    override fun instant(): Instant = now
}

private class Setup(
    val fake: FakeBunqServer,
    val contexts: InMemoryContexts = InMemoryContexts(),
    val clock: TestClock = TestClock(),
    callTimeout: Duration = Duration.ofSeconds(5),
    setupTimeout: Duration = Duration.ofSeconds(15),
) {
    private val properties =
        BunqCallProperties(callTimeout, setupTimeout, Duration.ofSeconds(30), Duration.ofSeconds(1), Duration.ofSeconds(60))

    /** A new adapter is a new process: nothing is remembered except what [contexts] holds. */
    fun adapter(): RealBunqGatewayAdapter {
        val calls = BunqCalls(properties, clock)
        val sessions = BunqSessions(fake.server, "TeamBalance test", contexts, CIPHER, contexts.currentTeam, calls)
        return RealBunqGatewayAdapter("client-id", CLIENT_SECRET, BUNQ_SANDBOX_OAUTH, sessions, calls, AMSTERDAM)
    }

    fun storeSession(apiKey: String = ACCESS_TOKEN, validFor: Duration = Duration.ofHours(1)) {
        contexts.stored = sealedContext(BunqApiContextCodec.encode(fake.context(apiKey, validFor = validFor)))
    }

    fun storedContext(): String = CIPHER.decrypt(contexts.stored!!, TokenCipher.aadOf(TEAM, Purpose.BUNQ_API_CONTEXT))
}

private fun <T> withFake(setup: (FakeBunqServer) -> Setup = { Setup(it) }, block: (Setup) -> T): T =
    FakeBunqServer().use { fake -> block(setup(fake)) }

private fun fixtureInstallation(s: Setup) = fixture("installation.json").replace("__SERVER_PUBLIC_KEY__", s.fake.publicKeyJson())

private fun noSecretsIn(failure: Throwable) {
    val text = messagesOf(failure) + failure.toString()
    listOf(ACCESS_TOKEN, CLIENT_SECRET, RESTORED_SESSION, "restored-installation-token", "PRIVATE KEY").forEach { text shouldNotContain it }
}

private fun messagesOf(failure: Throwable) = generateSequence(failure) { it.cause }.joinToString(" | ") { it.message.orEmpty() }

@Suppress("LargeClass") // one spec over one adapter; its helpers are private to the file
class RealBunqGatewayAdapterReadsTest : FunSpec({

    context("what a read returns") {
        test("the accounts are the active euro accounts, by id and the name the Admin gave them") {
            withFake { s ->
                s.adapter().listAccounts(GRANT) shouldBe listOf(
                    BunqAccount(BunqAccountId("2000001"), BunqAccountName("Teamkas")),
                    BunqAccount(BunqAccountId("2000002"), BunqAccountName("Privé")),
                )
                listOf("monetary-account-bank", "monetary-account-joint", "monetary-account-savings").forEach {
                    s.fake.count("GET", "/v1/user/$FAKE_USER_ID/$it") shouldBe 1
                }
            }
        }

        test("the balance is the account's balance in cents, read with the session of the user the context names") {
            withFake { s ->
                s.storeSession()

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.fake.seen.single().apply {
                    path shouldBe ACCOUNT_PATH
                    authentication shouldBe RESTORED_SESSION
                }
            }
        }

        test("payments carry the counterparty, a positive amount with its direction, and the date in the app's time zone") {
            withFake { s ->
                s.storeSession()

                s.adapter().fetchPayments(GRANT, TEAMKAS_ID, SINCE_FOREVER, LIMIT) shouldBe listOf(
                    Payment(LocalDate.of(2026, 11, 3), PaymentName("Test Counterparty"), Money(1_250), PaymentDirection.OUT),
                    Payment(LocalDate.of(2026, 11, 3), PaymentName("Test Counterparty"), Money(50_000), PaymentDirection.IN),
                    // 23:30 UTC on 31 October is already 1 November in Amsterdam
                    Payment(LocalDate.of(2026, 11, 1), PaymentName("Café Test"), Money(320), PaymentDirection.OUT),
                )
            }
        }

        test("payments before the given date are left out and the count asked of Bunq is the limit") {
            withFake { s ->
                s.storeSession()

                val payments = s.adapter().fetchPayments(GRANT, TEAMKAS_ID, LocalDate.of(2026, 11, 2), 50)

                payments.map { it.amount } shouldBe listOf(Money(1_250), Money(50_000))
                s.fake.seen.single().query!! shouldStartWith "count=50"
            }
        }

        test("more than the 200 payments Bunq allows per page is asked for as 200") {
            withFake { s ->
                s.storeSession()

                s.adapter().fetchPayments(GRANT, TEAMKAS_ID, SINCE_FOREVER, 500)

                s.fake.seen.single().query!! shouldStartWith "count=200"
            }
        }
    }

    context("the API context") {
        test("is set up once and then reused: three setup calls, then reads cost one call each") {
            withFake { s ->
                val adapter = s.adapter()

                adapter.fetchBalance(GRANT, TEAMKAS_ID)
                adapter.fetchBalance(GRANT, TEAMKAS_ID)
                adapter.fetchPayments(GRANT, TEAMKAS_ID, SINCE_FOREVER, LIMIT)

                s.fake.count("POST", "/v1/installation") shouldBe 1
                s.fake.count("POST", "/v1/device-server") shouldBe 1
                s.fake.count("POST", "/v1/session-server") shouldBe 1
                s.fake.count("GET", ACCOUNT_PATH) shouldBe 2
            }
        }

        test("is stored encrypted: the store never holds the tokens in plaintext") {
            withFake { s ->
                s.adapter().fetchBalance(GRANT, TEAMKAS_ID)

                val stored = s.contexts.stored!!.value
                stored shouldNotContain ACCESS_TOKEN
                stored shouldNotContain "sessionToken"
                s.storedContext() shouldContain ACCESS_TOKEN
                s.contexts.saves shouldBe 1
            }
        }

        test("is stored bound to the team in scope: another team's id does not open it, nor does no AAD") {
            withFake { s ->
                s.adapter().fetchBalance(GRANT, TEAMKAS_ID)

                val stored = s.contexts.stored!!
                shouldThrow<AEADBadTagException> { CIPHER.decrypt(stored, TokenCipher.aadOf(OTHER_TEAM, Purpose.BUNQ_API_CONTEXT)) }
                shouldThrow<AEADBadTagException> { CIPHER.decrypt(stored, TokenCipher.NO_AAD) }
            }
        }

        test("is restored by a new process without setting anything up again") {
            withFake { s ->
                s.adapter().fetchBalance(GRANT, TEAMKAS_ID)
                val setupCalls = s.fake.seen.count { it.method == "POST" }

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID)

                s.fake.seen.count { it.method == "POST" } shouldBe setupCalls
                s.contexts.saves shouldBe 1
            }
        }

        test("stored for another access token is not used, and is replaced") {
            withFake { s ->
                s.storeSession(apiKey = "token-of-the-previous-connection")

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID)

                s.fake.count("POST", "/v1/installation") shouldBe 1
                s.storedContext() shouldContain ACCESS_TOKEN
            }
        }

        test("copied from another team's row is not used, and is replaced bound to the team in scope") {
            withFake { s ->
                s.contexts.stored = sealedContext(BunqApiContextCodec.encode(s.fake.context(ACCESS_TOKEN)), OTHER_TEAM)

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.fake.count("POST", "/v1/installation") shouldBe 1
                s.fake.seen.none { it.authentication == RESTORED_SESSION } shouldBe true
                s.contexts.saves shouldBe 1
                s.storedContext() shouldContain ACCESS_TOKEN
            }
        }

        test("made before the AAD existed is not used, and is replaced") {
            withFake { s ->
                s.contexts.stored = CIPHER.encrypt(BunqApiContextCodec.encode(s.fake.context(ACCESS_TOKEN)), TokenCipher.NO_AAD)

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.fake.count("POST", "/v1/installation") shouldBe 1
                s.contexts.saves shouldBe 1
                s.storedContext() shouldContain ACCESS_TOKEN
            }
        }

        test("that cannot be read is replaced by a new one instead of failing the read") {
            withFake { s ->
                s.contexts.stored = EncryptedToken("bm90LWEtY29udGV4dA==")

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.fake.count("POST", "/v1/installation") shouldBe 1
                s.contexts.saves shouldBe 1
            }
        }

        test("made while there is nowhere to store it (an Admin still connecting) is stored by the first read that can") {
            withFake { s ->
                s.contexts.inTenantScope = false
                val adapter = s.adapter()
                adapter.listAccounts(GRANT)
                s.contexts.saves shouldBe 0

                s.contexts.inTenantScope = true
                adapter.fetchBalance(GRANT, TEAMKAS_ID)

                s.contexts.saves shouldBe 1
                s.fake.count("POST", "/v1/installation") shouldBe 1
                adapter.fetchBalance(GRANT, TEAMKAS_ID)
                s.contexts.saves shouldBe 1
            }
        }

        // With no team in scope there is no AAD to open a row with, and no row to find: the store is left alone.
        test("made with no team in scope does not touch the store at all") {
            withFake { s ->
                s.contexts.inTenantScope = false

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.contexts.finds shouldBe 0
                s.contexts.saveAttempts shouldBe 0
            }
        }

        test("that has expired is refreshed by the SDK and the new session is stored") {
            withFake { s ->
                s.storeSession(validFor = Duration.ZERO)

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID)

                s.fake.count("POST", "/v1/session-server") shouldBe 1
                s.fake.count("POST", "/v1/installation") shouldBe 0
                s.fake.seen.last().authentication shouldNotContain RESTORED_SESSION
                s.storedContext() shouldNotContain RESTORED_SESSION
                s.contexts.saves shouldBe 1
            }
        }
    }

    context("what Bunq's refusals and failures become") {
        fun readsFail(s: Setup) = listOf<Pair<String, () -> Any>>(
            "listAccounts" to { s.adapter().listAccounts(GRANT) },
            "fetchBalance" to { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) },
            "fetchPayments" to { s.adapter().fetchPayments(GRANT, TEAMKAS_ID, SINCE_FOREVER, LIMIT) },
        )

        test("401 on a read means the grant is rejected, on every kind of read") {
            withFake { s ->
                s.storeSession()
                listOf("monetary-account-bank", "monetary-account-joint", "monetary-account-savings").forEach {
                    s.fake.answer("GET", "/v1/user/$FAKE_USER_ID/$it", Reply(401, """{"Error":[{"error_description":"Invalid token."}]}"""))
                }
                s.fake.answer("GET", ACCOUNT_PATH, Reply(401, """{"Error":[{"error_description":"Invalid token."}]}"""))
                s.fake.answer("GET", "$ACCOUNT_PATH/payment", Reply(401, """{"Error":[{"error_description":"Invalid token."}]}"""))

                readsFail(s).forEach { (_, read) -> shouldThrow<BunqGrantRejectedException> { read() } }
            }
        }

        test("403 where a new session works is a refusal of this read: rejected") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, FORBIDDEN_BODY))

                shouldThrow<BunqGrantRejectedException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
                s.fake.count("POST", "/v1/session-server") shouldBe 1
            }
        }

        test("403 where Bunq also refuses a new session for these credentials is rejected") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, FORBIDDEN_BODY))
                s.fake.answer("POST", "/v1/session-server", Reply(400, BAD_CREDENTIALS_BODY))

                shouldThrow<BunqGrantRejectedException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
            }
        }

        test("403 'Insufficient authentication' that a new session cures was a stale session: Bunq is unavailable this once") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, STALE_SESSION_BODY))
                s.fake.answer("POST", "/v1/session-server", Reply(500, "{}"))
                val adapter = s.adapter()
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }

                s.fake.answer("POST", "/v1/session-server") { s.fake.ok(fixture("session-server.json")) }
                s.fake.answer("GET", ACCOUNT_PATH) { s.fake.ok(fixture("monetary-account-read.json")) }

                adapter.fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)
            }
        }

        test("403 where the new session is met with 429 is unavailable, not rejected, and starts the pause") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, FORBIDDEN_BODY))
                s.fake.answer("POST", "/v1/session-server", Reply(429, RATE_LIMITED_BODY))
                val adapter = s.adapter()

                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }

                val before = s.fake.seen.size
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }
                s.fake.seen.size shouldBe before
            }
        }

        listOf(500, 502, 503, 491, 466).forEach { status ->
            test("$status is Bunq not answering, never a rejected grant") {
                withFake { s ->
                    s.storeSession()
                    s.fake.answer("GET", ACCOUNT_PATH, Reply(status, "{}"))

                    shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
                }
            }
        }

        test("a 400 on a read says what Bunq said and is not a rejected grant") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(400, """{"Error":[{"error_description":"Invalid monetary account."}]}"""))

                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
                    .message!! shouldContain "Invalid monetary account."
            }
        }

        test("a body that is not Bunq's is Bunq not answering") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(200, "<html>captive portal</html>"))

                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
            }
        }

        test("a refused access token while setting up the context is a rejected grant, and nothing is stored") {
            withFake { s ->
                s.fake.answer("POST", "/v1/device-server", Reply(400, BAD_CREDENTIALS_BODY))

                shouldThrow<BunqGrantRejectedException> { s.adapter().listAccounts(GRANT) }

                s.contexts.stored shouldBe null
            }
        }

        test("a server nobody listens on is Bunq not answering, with the IOException as the cause") {
            val setup = FakeBunqServer().use { fake -> Setup(fake).also { it.storeSession() } }

            val failure = shouldThrow<BunqUnavailableException> { setup.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

            generateSequence<Throwable>(failure) { it.cause }.any { it is IOException } shouldBe true
        }
    }

    context("timeouts") {
        test("a call that outlasts the timeout ends as unavailable, at the timeout and not when Bunq finally answers") {
            withFake({ Setup(it, callTimeout = Duration.ofMillis(300)) }) { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(200, fixture("monetary-account-read.json"), delay = Duration.ofSeconds(10)))

                val started = System.nanoTime()
                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

                (Duration.ofNanos(System.nanoTime() - started) < Duration.ofSeconds(5)) shouldBe true
            }
        }

        test("setting up the context is bound by the setup timeout") {
            withFake({ Setup(it, setupTimeout = Duration.ofMillis(300)) }) { s ->
                s.fake.answer("POST", "/v1/installation", Reply(200, fixture("installation.json"), delay = Duration.ofSeconds(10)))

                val started = System.nanoTime()
                shouldThrow<BunqUnavailableException> { s.adapter().listAccounts(GRANT) }

                (Duration.ofNanos(System.nanoTime() - started) < Duration.ofSeconds(5)) shouldBe true
            }
        }
    }

    context("429") {
        test("pauses Bunq for the window the message names, then asks again") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(429, RATE_LIMITED_BODY))
                val adapter = s.adapter()

                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }
                val asked = s.fake.count("GET", ACCOUNT_PATH)

                s.clock.now = s.clock.now.plusSeconds(2)
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }
                s.fake.count("GET", ACCOUNT_PATH) shouldBe asked

                s.clock.now = s.clock.now.plusSeconds(1)
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }
                s.fake.count("GET", ACCOUNT_PATH) shouldBe asked + 1
            }
        }

        test("a Retry-After header is ignored (the SDK does not pass headers on): the message decides") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(429, RATE_LIMITED_BODY, headers = mapOf("Retry-After" to "50")))
                val adapter = s.adapter()
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }

                s.clock.now = s.clock.now.plusSeconds(3)
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }

                s.fake.count("GET", ACCOUNT_PATH) shouldBe 2
            }
        }

        test("a message with no window pauses for the configured fallback") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(429, """{"Error":[{"error_description":"Slow down."}]}"""))
                val adapter = s.adapter()
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }

                s.clock.now = s.clock.now.plusSeconds(29)
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }
                s.fake.count("GET", ACCOUNT_PATH) shouldBe 1
                s.clock.now = s.clock.now.plusSeconds(1)
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }
                s.fake.count("GET", ACCOUNT_PATH) shouldBe 2
            }
        }

        test("applies to every Bunq call from every team, not only the endpoint that was limited") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(429, RATE_LIMITED_BODY))
                val adapter = s.adapter()
                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }
                val before = s.fake.seen.size

                shouldThrow<BunqUnavailableException> { adapter.fetchPayments(GRANT, TEAMKAS_ID, SINCE_FOREVER, LIMIT) }
                shouldThrow<BunqUnavailableException> { adapter.listAccounts(BunqGrant("another-teams-token")) }

                s.fake.seen.size shouldBe before
            }
        }
    }

    context("a session is stored only on the connection it was made for") {
        test("a read made while another team's connection is in scope does not write there, and writes once its own row is in scope") {
            withFake { s ->
                s.contexts.rowGrant = sealedGrant("the-grant-of-the-other-team")
                val adapter = s.adapter()

                adapter.listAccounts(GRANT)

                s.contexts.saves shouldBe 0
                s.contexts.stored shouldBe null

                s.contexts.rowGrant = sealedGrant(ACCESS_TOKEN)
                adapter.fetchBalance(GRANT, TEAMKAS_ID)

                s.contexts.saves shouldBe 1
                s.storedContext() shouldContain ACCESS_TOKEN
                s.fake.count("POST", "/v1/installation") shouldBe 1
            }
        }

        // The row was copied from another team's schema: its grant does not open with this team's id, so it
        // is not this session's row, even though the plaintext inside is this very token.
        test("a read does not write over a row whose grant was copied from another team, and does not fail") {
            withFake { s ->
                s.contexts.rowGrant = sealedGrant(ACCESS_TOKEN, OTHER_TEAM)
                val adapter = s.adapter()

                adapter.fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.contexts.saves shouldBe 0
                s.contexts.stored shouldBe null
            }
        }

        test("a read does not write over a row made before the AAD existed, and does not fail") {
            withFake { s ->
                s.contexts.rowGrant = CIPHER.encrypt(ACCESS_TOKEN, TokenCipher.NO_AAD)

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.contexts.saves shouldBe 0
                s.contexts.stored shouldBe null
            }
        }

        // Same key, same team, other purpose.
        test("a read does not write over a row whose grant column holds a value made for the API context") {
            withFake { s ->
                s.contexts.rowGrant = CIPHER.encrypt(ACCESS_TOKEN, TokenCipher.aadOf(TEAM, Purpose.BUNQ_API_CONTEXT))

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.contexts.saves shouldBe 0
                s.contexts.stored shouldBe null
            }
        }

        test("a context column holding a value made for the grant is not used, and is replaced") {
            withFake { s ->
                s.contexts.stored = sealedGrant(BunqApiContextCodec.encode(s.fake.context(ACCESS_TOKEN)))

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.fake.count("POST", "/v1/installation") shouldBe 1
                s.storedContext() shouldContain ACCESS_TOKEN
            }
        }

        test("a reconnect that clears the row leaves the session of the new grant to be stored by the first read after it") {
            withFake { s ->
                s.contexts.rowGrant = sealedGrant("the-previous-grant")
                s.contexts.stored = sealedContext("the-previous-context")
                val adapter = s.adapter()
                adapter.listAccounts(GRANT)
                s.contexts.stored = null
                s.contexts.rowGrant = sealedGrant(ACCESS_TOKEN)

                adapter.fetchBalance(GRANT, TEAMKAS_ID)

                s.storedContext() shouldContain ACCESS_TOKEN
                s.contexts.saves shouldBe 1
            }
        }

        test("a read that was running when the grant was replaced does not store its session over the new connection") {
            withFake { s ->
                s.fake.answer("GET", ACCOUNT_PATH) {
                    s.contexts.rowGrant = sealedGrant("the-grant-of-the-reconnect")
                    s.contexts.stored = null
                    s.fake.ok(fixture("monetary-account-read.json"))
                }

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.contexts.stored shouldBe null
                s.contexts.saves shouldBe 0
            }
        }
    }

    context("what is listed") {
        fun bankAccount(id: Int, status: String) =
            """{"MonetaryAccountBank":{"id":$id,"description":"Account $id","status":"$status","currency":"EUR","balance":{"currency":"EUR","value":"1.00"}}}"""

        test("accounts beyond Bunq's default page of ten are listed too, because the page size is asked for") {
            withFake { s ->
                val all = (1..10).map { bankAccount(it, "CANCELLED") } + (11..12).map { bankAccount(it, "ACTIVE") }
                s.fake.answer("GET", "/v1/user/$FAKE_USER_ID/monetary-account-bank") {
                    val count = s.fake.seen.last().query.orEmpty().substringAfter("count=", "").substringBefore('&').toIntOrNull() ?: 10
                    val page = """{"future_url":null,"newer_url":null,"older_url":null}"""
                    s.fake.ok("""{"Response":[${all.take(count).joinToString(",")}],"Pagination":$page}""")
                }

                s.adapter().listAccounts(GRANT).map { it.id.value } shouldBe listOf("11", "12")
                listOf("monetary-account-bank", "monetary-account-joint", "monetary-account-savings").forEach { list ->
                    s.fake.seen.single { it.path.endsWith(list) }.query!! shouldStartWith "count=200"
                }
            }
        }

        test("joint and savings accounts are listed with the bank accounts, and read for their balance") {
            withFake { s ->
                val user = "/v1/user/$FAKE_USER_ID"
                s.fake.answer("GET", "$user/monetary-account-joint", s.fake.ok(fixture("monetary-account-joint-list.json")))
                s.fake.answer("GET", "$user/monetary-account-savings", s.fake.ok(fixture("monetary-account-savings-list.json")))
                s.fake.answer("GET", "$user/monetary-account/2000005", s.fake.ok(fixture("monetary-account-joint-read.json")))
                s.fake.answer("GET", "$user/monetary-account/2000006", s.fake.ok(fixture("monetary-account-savings-read.json")))
                val adapter = s.adapter()

                adapter.listAccounts(GRANT).map { it.id.value to it.name.value } shouldBe listOf(
                    "2000001" to "Teamkas",
                    "2000002" to "Privé",
                    "2000005" to "Gezamenlijk",
                    "2000006" to "Spaarpot",
                )
                adapter.fetchBalance(GRANT, BunqAccountId("2000005")) shouldBe Money(7_525)
                adapter.fetchBalance(GRANT, BunqAccountId("2000006")) shouldBe Money(30_000)
            }
        }

        test("a user without accounts has an empty list") {
            withFake { s ->
                s.fake.answer("GET", "/v1/user/$FAKE_USER_ID/monetary-account-bank") {
                    s.fake.ok("""{"Response":[],"Pagination":{"future_url":null,"newer_url":null,"older_url":null}}""")
                }

                s.adapter().listAccounts(GRANT) shouldBe emptyList()
            }
        }
    }

    context("payments, edges") {
        test("a payment dated exactly on the since date is included") {
            withFake { s ->
                s.storeSession()

                val payments = s.adapter().fetchPayments(GRANT, TEAMKAS_ID, LocalDate.of(2026, 11, 3), LIMIT)

                payments.map { it.date }.distinct() shouldBe listOf(LocalDate.of(2026, 11, 3))
                payments.size shouldBe 2
            }
        }

        test("with more payments than the limit, the newest ones are returned") {
            withFake { s ->
                s.storeSession()

                val newest = s.adapter().fetchPayments(GRANT, TEAMKAS_ID, SINCE_FOREVER, 2)

                newest.map { it.amount } shouldBe listOf(Money(1_250), Money(50_000))
            }
        }

        test("a limit above Bunq's page of 200 is capped to one page of 200, so older payments are silently not returned") {
            withFake { s ->
                s.storeSession()

                s.adapter().fetchPayments(GRANT, TEAMKAS_ID, SINCE_FOREVER, 1_000).size shouldBe 3

                s.fake.seen.single().query!! shouldStartWith "count=200"
            }
        }
    }

    context("sessions of different grants") {
        test("two access tokens each get their own session and read with it") {
            withFake { s ->
                val adapter = s.adapter()
                val otherGrant = BunqGrant("the-access-token-of-another-team")
                var installations = 0
                s.fake.answer("POST", "/v1/installation") {
                    installations++
                    val token = "installation-$installations".padEnd(64, '0')
                    s.fake.ok(fixtureInstallation(s).replace("0".repeat(64), token))
                }
                var sessions = 0
                s.fake.answer("POST", "/v1/session-server") {
                    sessions++
                    s.fake.ok(fixture("session-server.json").replace("0".repeat(64), "session-$sessions".padEnd(64, '0')))
                }

                adapter.fetchBalance(GRANT, TEAMKAS_ID)
                adapter.fetchBalance(otherGrant, TEAMKAS_ID)
                adapter.fetchBalance(GRANT, TEAMKAS_ID)

                s.fake.count("POST", "/v1/installation") shouldBe 2
                s.fake.seen.filter { it.method == "GET" }.map { it.authentication!!.substringBefore('0') } shouldBe
                    listOf("session-1", "session-2", "session-1")
            }
        }

        test("many readers of one new grant set up one session between them") {
            withFake { s ->
                val adapter = s.adapter()
                val readers = (1..8).map { Thread.ofVirtual().start { adapter.fetchBalance(GRANT, TEAMKAS_ID) } }

                readers.forEach { it.join() }

                s.fake.count("POST", "/v1/installation") shouldBe 1
            }
        }
    }

    context("a failed read or a failing store") {
        test("a read that fails still stores the session it had to set up, so the next read does not repeat the setup") {
            withFake { s ->
                s.fake.answer("GET", ACCOUNT_PATH, Reply(500, "{}"))
                val adapter = s.adapter()

                shouldThrow<BunqUnavailableException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }

                s.contexts.saves shouldBe 1
                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
                s.fake.count("POST", "/v1/installation") shouldBe 1
            }
        }

        test("a rejected grant is forgotten: the same token reading again sets up a new session") {
            withFake { s ->
                s.contexts.inTenantScope = false
                s.fake.answer("GET", ACCOUNT_PATH, Reply(401, "{}"))
                val adapter = s.adapter()

                shouldThrow<BunqGrantRejectedException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }
                shouldThrow<BunqGrantRejectedException> { adapter.fetchBalance(GRANT, TEAMKAS_ID) }

                s.fake.count("POST", "/v1/installation") shouldBe 2
            }
        }

        test("a store that cannot be written does not fail the read") {
            withFake { s ->
                s.contexts.saveFails = true

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)
            }
        }

        test("a store that cannot be read does not fail the read; the session is set up instead") {
            withFake { s ->
                s.contexts.findFails = true

                s.adapter().fetchBalance(GRANT, TEAMKAS_ID) shouldBe Money(50_000)

                s.fake.count("POST", "/v1/installation") shouldBe 1
            }
        }
    }

    context("403, by the kind of body") {
        test("a 403 that is not a Bunq error, such as a proxy's HTML page, is Bunq being unavailable and never costs a new session") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, "<html><body>Forbidden by the gateway</body></html>"))

                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

                s.fake.count("POST", "/v1/session-server") shouldBe 0
            }
        }

        test("a 403 whose body is a JSON object with no Error array is not a Bunq refusal either") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, """{"message":"blocked"}"""))

                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
            }
        }

        test("a 403 whose Error is not an array is not a Bunq refusal either") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, """{"Error":"blocked"}"""))

                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
            }
        }

        test("the new session asked for after a 403 stops at the call time limit and is unavailable, not rejected") {
            withFake({ Setup(it, callTimeout = Duration.ofMillis(300)) }) { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, FORBIDDEN_BODY))
                s.fake.answer("POST", "/v1/session-server", Reply(200, fixture("session-server.json"), delay = Duration.ofSeconds(10)))

                val started = System.nanoTime()
                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

                (Duration.ofNanos(System.nanoTime() - started) < Duration.ofSeconds(5)) shouldBe true
            }
        }

        test("a 403 on the new session after a 403 on the read is a rejected grant when Bunq says so in JSON") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, FORBIDDEN_BODY))
                s.fake.answer("POST", "/v1/session-server", Reply(403, FORBIDDEN_BODY))

                shouldThrow<BunqGrantRejectedException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
            }
        }

        test("a 403 on the new session that is a proxy's HTML page is unavailable") {
            withFake { s ->
                s.storeSession()
                s.fake.answer("GET", ACCOUNT_PATH, Reply(403, FORBIDDEN_BODY))
                s.fake.answer("POST", "/v1/session-server", Reply(403, "<html>Forbidden</html>"))

                shouldThrow<BunqUnavailableException> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }
            }
        }
    }

    context("setting the session up") {
        test("a 429 on the installation is unavailable and starts the pause") {
            withFake { s ->
                s.fake.answer("POST", "/v1/installation", Reply(429, RATE_LIMITED_BODY))
                val adapter = s.adapter()

                shouldThrow<BunqUnavailableException> { adapter.listAccounts(GRANT) }
                val before = s.fake.seen.size
                shouldThrow<BunqUnavailableException> { adapter.listAccounts(GRANT) }

                s.fake.seen.size shouldBe before
            }
        }

        test("a 429 on the device is unavailable and starts the pause") {
            withFake { s ->
                s.fake.answer("POST", "/v1/device-server", Reply(429, RATE_LIMITED_BODY))
                val adapter = s.adapter()

                shouldThrow<BunqUnavailableException> { adapter.listAccounts(GRANT) }
                val before = s.fake.seen.size
                shouldThrow<BunqUnavailableException> { adapter.listAccounts(GRANT) }

                s.fake.seen.size shouldBe before
            }
        }

        test("a 400 on the installation is unavailable, not a rejected grant, and the installation request does not carry the token") {
            withFake { s ->
                s.fake.answer("POST", "/v1/installation", Reply(400, """{"Error":[{"error_description":"Invalid public key."}]}"""))

                shouldThrow<BunqUnavailableException> { s.adapter().listAccounts(GRANT) }

                s.contexts.stored shouldBe null
                val installation = s.fake.seen.single { it.path == "/v1/installation" }
                (installation.body + installation.query + installation.authentication) shouldNotContain ACCESS_TOKEN
            }
        }

        test("a setup that failed is tried again by the next read on the same adapter") {
            withFake { s ->
                var failing = true
                s.fake.answer("POST", "/v1/installation") {
                    if (failing) Reply(500, "{}") else s.fake.ok(fixtureInstallation(s))
                }
                val adapter = s.adapter()
                shouldThrow<BunqUnavailableException> { adapter.listAccounts(GRANT) }

                failing = false

                adapter.listAccounts(GRANT).isNotEmpty() shouldBe true
            }
        }

        test("a 500 on the installation is unavailable") {
            withFake { s ->
                s.fake.answer("POST", "/v1/installation", Reply(500, "{}"))

                shouldThrow<BunqUnavailableException> { s.adapter().listAccounts(GRANT) }
            }
        }

        test("a slow setup may take longer than a read may: it has its own time limit") {
            withFake({ Setup(it, callTimeout = Duration.ofMillis(300), setupTimeout = Duration.ofSeconds(10)) }) { s ->
                s.fake.answer("POST", "/v1/installation", Reply(200, fixtureInstallation(s), delay = Duration.ofMillis(800)))

                s.adapter().listAccounts(GRANT).isNotEmpty() shouldBe true

                s.fake.count("POST", "/v1/installation") shouldBe 1
            }
        }
    }

    context("secrets") {
        val failures = mapOf<String, (FakeBunqServer) -> Unit>(
            "401" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(401, "{}")) },
            "403" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(403, FORBIDDEN_BODY)) },
            "429" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(429, RATE_LIMITED_BODY)) },
            "500" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(500, "{}")) },
            "400" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(400, """{"Error":[{"error_description":"Nope."}]}""")) },
            "not json" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(200, "nonsense")) },
            "connection refused" to { f -> f.close() },
        )
        failures.forEach { (name, arrange) ->
            test("a $name failure carries neither token, the client secret nor the context in its message or causes") {
                withFake { s ->
                    s.storeSession()
                    arrange(s.fake)

                    val failure = shouldThrow<Exception> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

                    noSecretsIn(failure)
                }
            }
        }

        val setupFailures = mapOf<String, (FakeBunqServer) -> Unit>(
            "installation 500" to { f -> f.answer("POST", "/v1/installation", Reply(500, "{}")) },
            "installation 429" to { f -> f.answer("POST", "/v1/installation", Reply(429, RATE_LIMITED_BODY)) },
            "device 400" to { f -> f.answer("POST", "/v1/device-server", Reply(400, BAD_CREDENTIALS_BODY)) },
            "session 500" to { f -> f.answer("POST", "/v1/session-server", Reply(500, "{}")) },
            "connection refused" to { f -> f.close() },
        )
        setupFailures.forEach { (name, arrange) ->
            test("a $name failure while setting the session up carries neither token, the client secret nor the context") {
                withFake { s ->
                    arrange(s.fake)

                    val failure = shouldThrow<Exception> { s.adapter().listAccounts(GRANT) }

                    noSecretsIn(failure)
                }
            }
        }
    }
})
