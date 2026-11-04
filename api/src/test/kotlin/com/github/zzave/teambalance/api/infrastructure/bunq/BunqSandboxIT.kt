package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BUNQ_SANDBOX_SERVER
import com.bunq.sdk.send
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.StoredBunqApiContext
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import community.flock.wirespec.kotlin.Wirespec
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldNotBeEmpty
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import tools.jackson.databind.json.JsonMapper
import java.io.File
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Clock
import java.time.Duration
import java.time.LocalDate
import java.time.ZoneId
import java.util.UUID

private const val SANDBOX_API = "https://public-api.sandbox.bunq.com/v1/"
private const val CIPHER_KEY = "dGVhbWJhbGFuY2UtdGVzdC1idW5xLXRva2VuLWtleTE="
private const val NEVER_ISSUED_TOKEN = "0000000000000000000000000000000000000000000000000000000000000000"
private const val FAKE_MONEY_POLLS = 8
private val POLL_PAUSE = Duration.ofMillis(3_500)
private val READ_SPACING = Duration.ofMillis(1_200)
private val FOREVER_AGO = LocalDate.of(2000, 1, 1)
private const val PAGE = 200
private val TEAM = TeamId(UUID.fromString("5a5d0000-0000-0000-0000-000000000001"))
private val AAD = TokenCipher.aadOf(TEAM)

/** The file store stands for one team's row, so that team is always the one in scope. */
private object TeamInScope : CurrentTeamGateway {
    override fun requireCurrentTeamId(): TeamId = TEAM

    override fun findCurrentTeamId(): TeamId = TEAM
}

/**
 * The encrypted context lives in a file of the sandbox directory, outside the repository, so that a run reuses the last one.
 * [rowGrant] stands for the grant of the team's connection row, which the adapter compares with its own access token.
 */
private class FileContexts(private val file: File, private val rowGrant: EncryptedToken) : BunqApiContextRepository {
    var saves = 0

    fun stored(): EncryptedToken? = file.takeIf { it.exists() }?.readText()?.let(::EncryptedToken)

    override fun find(): StoredBunqApiContext = StoredBunqApiContext(rowGrant, stored())

    override fun save(context: EncryptedToken, ifGrant: EncryptedToken): Boolean {
        if (ifGrant != rowGrant) return false
        file.writeText(context.value)
        saves++
        return true
    }
}

/**
 * The real [RealBunqGatewayAdapter] against the Bunq sandbox, using a sandbox user's API key where a team would have
 * an OAuth access token (Bunq treats both alike once the session is set up). The OAuth approval itself needs a person
 * and is not exercised here.
 *
 * Runs only when `BUNQ_SANDBOX_IT=1`: it talks to the real Bunq sandbox, so it registers no tests in `make test` or CI.
 *
 * `BUNQ_SANDBOX_DIR` names a directory outside the repository that holds the sandbox user's `api-key` and the
 * encrypted `context.enc`. Both are created on the first run: the sandbox user once, the installation once. Setting up
 * a session is limited to about ten a day per IP, so a run reuses the stored one. Nothing secret is printed.
 */
class BunqSandboxIT : FunSpec({
    if (System.getenv("BUNQ_SANDBOX_IT") == "1") sandboxTests()
})

@Suppress("LongMethod")
private fun FunSpec.sandboxTests() {
    val dir = File(requireNotNull(System.getenv("BUNQ_SANDBOX_DIR")) { "BUNQ_SANDBOX_DIR is not set" }).also { it.mkdirs() }
    val cipher = TokenCipher.fromBase64Key(CIPHER_KEY, "test")
    val clock = Clock.system(ZoneId.of("Europe/Amsterdam"))
    val apiKeyFile = File(dir, "api-key")
    lateinit var contexts: FileContexts

    fun adapter() = RealBunqGatewayAdapter.create(
        BunqClientProperties(BunqEnvironment.SANDBOX, "sandbox-it-client", "sandbox-it-secret", "TeamBalance sandbox IT"),
        BunqCallProperties(
            Duration.ofSeconds(5),
            Duration.ofSeconds(15),
            Duration.ofSeconds(30),
            Duration.ofSeconds(1),
            Duration.ofSeconds(60),
        ),
        contexts,
        cipher,
        TeamInScope,
        clock,
    )

    fun sandboxUser(): String {
        if (!apiKeyFile.exists()) {
            val request = HttpRequest.newBuilder(URI(SANDBOX_API + "sandbox-user-person"))
                .header("Content-Type", "application/json")
                .header("Cache-Control", "no-cache")
                .header("User-Agent", "TeamBalance sandbox IT")
                .header("X-Bunq-Client-Request-Id", "teambalance-sandbox-it-user")
                .header("X-Bunq-Language", "en_US")
                .header("X-Bunq-Region", "nl_NL")
                .header("X-Bunq-Geolocation", "0 0 0 0 000")
                .POST(HttpRequest.BodyPublishers.ofString("{}"))
                .build()
            val response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString())
            check(response.statusCode() == 200) { "Creating a sandbox user answered ${response.statusCode()}" }
            val created = JsonMapper.builder().build().readTree(response.body())
            apiKeyFile.writeText(created.get("Response").get(0).get("ApiKey").get("api_key").asString())
        }
        return apiKeyFile.readText().trim()
    }

    val grant = BunqGrant(sandboxUser())
    contexts = FileContexts(File(dir, "context.enc"), cipher.encrypt(grant.accessToken, AAD))
    val firstRun = contexts.stored() == null
    var accountValue = ""
    fun account() = BunqAccountId(accountValue)

    /** Bunq allows 3 reads of an endpoint per 3 seconds (a real 429 said so), so reads of payments are spaced out. */
    fun payments(from: RealBunqGatewayAdapter): List<Payment> {
        Thread.sleep(READ_SPACING)
        return from.fetchPayments(grant, account(), FOREVER_AGO, PAGE)
    }

    /** The generated API has no request-inquiry shortcut in the adapter, and the adapter has no write calls: use the SDK directly. */
    fun postToSandbox(path: String, body: String) {
        val context = BunqApiContextCodec.decode(cipher.decrypt(contexts.stored()!!, AAD), BUNQ_SANDBOX_SERVER, "TeamBalance sandbox IT")
        val response = send(
            context.config,
            Wirespec.RawRequest(
                "POST",
                path.split('/'),
                emptyMap(),
                mapOf("X-Bunq-Client-Authentication" to listOf(context.sessionToken), "Content-Type" to listOf("application/json")),
                body.toByteArray(),
            ),
        )
        check(response.statusCode == 200) { "POST $path answered ${response.statusCode}" }
    }

    test("lists the sandbox user's accounts, setting the API context up once and storing it") {
        val accounts = adapter().listAccounts(grant)

        accounts.shouldNotBeEmpty()
        accountValue = accounts.first().id.value
        println("sandbox IT: ${accounts.size} account(s); context ${if (firstRun) "installed" else "restored"}; saves=${contexts.saves}")
        contexts.stored() shouldNotBe null
    }

    test("a second adapter restores the stored context and reads the balance without storing anything") {
        val savesBefore = contexts.saves

        val balance: Money = adapter().fetchBalance(grant, account())

        println("sandbox IT: balance read, ${balance.cents} cents")
        contexts.saves shouldBe savesBefore
    }

    test("fake money from sugardaddy arrives as an incoming payment, and the balance is the sum of the payments") {
        val adapter = adapter()
        if (payments(adapter).none { it.direction == PaymentDirection.IN }) {
            val userId = BunqApiContextCodec.decode(cipher.decrypt(contexts.stored()!!, AAD), BUNQ_SANDBOX_SERVER, "x").userId
            postToSandbox(
                "user/$userId/monetary-account/${account().value}/request-inquiry",
                """{"amount_inquired":{"value":"500.00","currency":"EUR"},""" +
                    """"counterparty_alias":{"type":"EMAIL","value":"sugardaddy@bunq.com","name":"Sugar Daddy"},""" +
                    """"description":"fake money (TeamBalance sandbox IT)","allow_bunqme":false}""",
            )
            repeat(FAKE_MONEY_POLLS) {
                if (payments(adapter).none { p -> p.direction == PaymentDirection.IN }) Thread.sleep(POLL_PAUSE)
            }
        }
        val all = payments(adapter)
        all.any { it.direction == PaymentDirection.IN } shouldBe true
        val net = all.sumOf { if (it.direction == PaymentDirection.IN) it.amount.cents else -it.amount.cents }
        adapter.fetchBalance(grant, account()) shouldBe Money(net)
    }

    test("an outgoing payment is read as outgoing with a positive amount") {
        val adapter = adapter()
        if (payments(adapter).none { it.direction == PaymentDirection.OUT }) {
            val userId = BunqApiContextCodec.decode(cipher.decrypt(contexts.stored()!!, AAD), BUNQ_SANDBOX_SERVER, "x").userId
            postToSandbox(
                "user/$userId/monetary-account/${account().value}/payment",
                """{"amount":{"value":"12.50","currency":"EUR"},""" +
                    """"counterparty_alias":{"type":"EMAIL","value":"sugardaddy@bunq.com","name":"Sugar Daddy"},""" +
                    """"description":"Beer money (TeamBalance sandbox IT)"}""",
            )
            Thread.sleep(POLL_PAUSE)
        }
        val outgoing = payments(adapter).filter { it.direction == PaymentDirection.OUT }
        outgoing.shouldNotBeEmpty()
        outgoing.all { it.amount.cents > 0 } shouldBe true
        outgoing.all { it.name.value.isNotBlank() } shouldBe true
    }

    test("a session token Bunq no longer knows is replaced by a new session and the read still works") {
        val stored = BunqApiContextCodec.decode(cipher.decrypt(contexts.stored()!!, AAD), BUNQ_SANDBOX_SERVER, "TeamBalance sandbox IT")
        val dead = stored.copy(sessionToken = NEVER_ISSUED_TOKEN)
        contexts.save(cipher.encrypt(BunqApiContextCodec.encode(dead), AAD), ifGrant = contexts.find().grant)
        val savesBefore = contexts.saves

        adapter().fetchBalance(grant, account())

        contexts.saves shouldBe savesBefore + 1
        val refreshed = BunqApiContextCodec.decode(cipher.decrypt(contexts.stored()!!, AAD), BUNQ_SANDBOX_SERVER, "x")
        refreshed.sessionToken shouldNotBe NEVER_ISSUED_TOKEN
    }

    test("an access token Bunq never issued is a rejected grant") {
        shouldThrow<BunqGrantRejectedException> { adapter().listAccounts(BunqGrant(NEVER_ISSUED_TOKEN)) }
    }
}
