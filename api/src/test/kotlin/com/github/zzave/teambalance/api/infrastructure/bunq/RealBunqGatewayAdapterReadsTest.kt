package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BUNQ_SANDBOX_OAUTH
import com.github.zzave.teambalance.api.application.TokenCipher
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
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
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

private class InMemoryContexts : BunqApiContextRepository {
    var stored: EncryptedToken? = null
    var inTenantScope = true
    var saves = 0

    override fun find(): EncryptedToken? = if (inTenantScope) stored else null

    override fun save(context: EncryptedToken): Boolean {
        if (!inTenantScope) return false
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
) {
    private val properties = BunqCallProperties(callTimeout, Duration.ofSeconds(30), Duration.ofSeconds(1), Duration.ofSeconds(60))

    /** A new adapter is a new process: nothing is remembered except what [contexts] holds. */
    fun adapter(): RealBunqGatewayAdapter {
        val calls = BunqCalls(properties, clock)
        val sessions = BunqSessions(fake.server, "TeamBalance test", contexts, CIPHER, calls)
        return RealBunqGatewayAdapter("client-id", CLIENT_SECRET, BUNQ_SANDBOX_OAUTH, sessions, calls, AMSTERDAM)
    }

    fun storeSession(apiKey: String = ACCESS_TOKEN, validFor: Duration = Duration.ofHours(1)) {
        contexts.stored = CIPHER.encrypt(BunqApiContextCodec.encode(fake.context(apiKey, validFor = validFor)))
    }

    fun storedContext(): String = CIPHER.decrypt(contexts.stored!!)
}

private fun <T> withFake(setup: (FakeBunqServer) -> Setup = { Setup(it) }, block: (Setup) -> T): T =
    FakeBunqServer().use { fake -> block(setup(fake)) }

private fun messagesOf(failure: Throwable) = generateSequence(failure) { it.cause }.joinToString(" | ") { it.message.orEmpty() }

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

                    val failure = shouldThrow<Exception> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

                    (failure is BunqGrantRejectedException) shouldBe false
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

                val failure = shouldThrow<Exception> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

                (failure is BunqGrantRejectedException) shouldBe false
            }
        }

        test("a refused access token while setting up the context is a rejected grant, and nothing is stored") {
            withFake { s ->
                s.fake.answer("POST", "/v1/device-server", Reply(400, BAD_CREDENTIALS_BODY))

                shouldThrow<BunqGrantRejectedException> { s.adapter().listAccounts(GRANT) }

                s.contexts.stored shouldBe null
            }
        }

        test("a server nobody listens on is Bunq not answering") {
            val setup = FakeBunqServer().use { fake -> Setup(fake).also { it.storeSession() } }

            val failure = shouldThrow<Exception> { setup.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

            (failure is BunqGrantRejectedException) shouldBe false
            (failure is IOException || failure is BunqUnavailableException) shouldBe true
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

        test("setting up the context is bound by the timeout too") {
            withFake({ Setup(it, callTimeout = Duration.ofMillis(300)) }) { s ->
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

    context("secrets") {
        val failures = mapOf<String, (FakeBunqServer) -> Unit>(
            "401" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(401, "{}")) },
            "403" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(403, FORBIDDEN_BODY)) },
            "429" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(429, RATE_LIMITED_BODY)) },
            "500" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(500, "{}")) },
            "400" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(400, """{"Error":[{"error_description":"Nope."}]}""")) },
            "not json" to { f -> f.answer("GET", ACCOUNT_PATH, Reply(200, "nonsense")) },
        )
        failures.forEach { (name, arrange) ->
            test("a $name failure carries neither token, the client secret nor the context in its message or causes") {
                withFake { s ->
                    s.storeSession()
                    arrange(s.fake)

                    val failure = shouldThrow<Exception> { s.adapter().fetchBalance(GRANT, TEAMKAS_ID) }

                    val text = messagesOf(failure) + failure.toString()
                    listOf(ACCESS_TOKEN, CLIENT_SECRET, RESTORED_SESSION, "restored-installation-token", "PRIVATE KEY").forEach {
                        text shouldNotContain it
                    }
                }
            }
        }
    }
})
