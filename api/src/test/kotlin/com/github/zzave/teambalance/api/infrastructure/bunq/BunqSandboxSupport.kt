package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BUNQ_SANDBOX_SERVER
import com.bunq.sdk.Context
import com.bunq.sdk.send
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.StoredBunqApiContext
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import community.flock.wirespec.kotlin.Wirespec
import tools.jackson.databind.JsonNode
import tools.jackson.databind.json.JsonMapper
import java.io.File
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.file.Files
import java.nio.file.attribute.PosixFilePermissions
import java.time.Clock
import java.time.Duration
import java.time.LocalDate
import java.time.ZoneId
import java.util.UUID

internal const val SANDBOX_API = "https://public-api.sandbox.bunq.com/v1/"
internal const val SANDBOX_SERVICE_NAME = "TeamBalance sandbox IT"
internal const val SANDBOX_PAGE = 200
internal val FOREVER_AGO: LocalDate = LocalDate.of(2000, 1, 1)
internal val POLL_PAUSE: Duration = Duration.ofMillis(3_500)
private val OWNER_ONLY = PosixFilePermissions.fromString("rw-------")
private const val CIPHER_KEY = "dGVhbWJhbGFuY2UtdGVzdC1idW5xLXRva2VuLWtleTE="
private const val FAKE_MONEY_POLLS = 20
private val READ_SPACING = Duration.ofMillis(1_200)
private val TEAM = TeamId(UUID.fromString("5a5d0000-0000-0000-0000-000000000001"))
private val GRANT_AAD = TokenCipher.aadOf(TEAM, Purpose.BUNQ_GRANT)
internal val CONTEXT_AAD = TokenCipher.aadOf(TEAM, Purpose.BUNQ_API_CONTEXT)
private val json = JsonMapper.builder().build()

/** The file store stands for one team's row, so that team is always the one in scope. */
private object TeamInScope : CurrentTeamGateway {
    override fun requireCurrentTeamId(): TeamId = TEAM

    override fun findCurrentTeamId(): TeamId = TEAM
}

/**
 * The encrypted context lives in a file of the sandbox directory, outside the repository, so that a run reuses the last one.
 * [rowGrant] stands for the grant of the team's connection row, which the adapter compares with its own access token.
 */
internal class FileContexts(private val file: File, private val rowGrant: EncryptedToken) : BunqApiContextRepository {
    var saves = 0

    fun stored(): EncryptedToken? = file.takeIf { it.exists() }?.readText()?.let(::EncryptedToken)

    override fun find(): StoredBunqApiContext = StoredBunqApiContext(rowGrant, stored())

    override fun save(context: EncryptedToken, ifGrant: EncryptedToken): Boolean {
        if (ifGrant != rowGrant) return false
        writePrivately(file, context.value)
        saves++
        return true
    }
}

/** A sandbox user as the sandbox answers its creation. [apiKey] is a secret; the rest is dummy data of a sandbox. */
internal class SandboxUser(val apiKey: String, val loginCode: String, val displayName: String, val aliases: Map<String, String>)

/** The elements of a JSON array node (a missing node has none). */
internal fun JsonNode.items(): List<JsonNode> = (0 until size()).map { get(it) }

/** A sandbox answer: the status, and the JSON body (a missing node when there is none). */
internal class SandboxReply(val status: Int, val body: JsonNode) {
    /** Bunq's own description of a refusal. It names no secret. */
    fun errorDescription(): String = body.path("Error").path(0).path("error_description").asString("no description")
}

/** Creates a sandbox user (doc page "Creating a sandbox user and getting an API key"). */
internal fun createSandboxUser(requestLabel: String): SandboxUser {
    val request = HttpRequest.newBuilder(URI(SANDBOX_API + "sandbox-user-person"))
        .header("Content-Type", "application/json")
        .header("Cache-Control", "no-cache")
        .header("User-Agent", SANDBOX_SERVICE_NAME)
        .header("X-Bunq-Client-Request-Id", "teambalance-$requestLabel-${UUID.randomUUID()}")
        .header("X-Bunq-Language", "en_US")
        .header("X-Bunq-Region", "nl_NL")
        .header("X-Bunq-Geolocation", "0 0 0 0 000")
        .POST(HttpRequest.BodyPublishers.ofString("{}"))
        .build()
    val response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString())
    check(response.statusCode() == 200) { "Creating a sandbox user answered ${response.statusCode()}" }
    val created = json.readTree(response.body()).path("Response").path(0).path("ApiKey")
    val person = created.path("user").path("UserPerson")
    return SandboxUser(
        apiKey = created.path("api_key").asString(),
        loginCode = created.path("login_code").asString(""),
        displayName = person.path("display_name").asString(""),
        aliases = person.path("alias").items().associate { it.path("type").asString() to it.path("value").asString() },
    )
}

/** Writes a file that only its owner can read: created with that mode, or narrowed to it before the content replaces the old. */
internal fun writePrivately(file: File, content: String) {
    val path = file.toPath()
    if (!Files.exists(path)) Files.createFile(path, PosixFilePermissions.asFileAttribute(OWNER_ONLY))
    Files.setPosixFilePermissions(path, OWNER_ONLY)
    Files.writeString(path, content)
}

/**
 * The sandbox user of [dir] (`api-key`, created on the first run) and the API context stored for it (`context.enc`,
 * created by the first read), shared by the opt-in specs [BunqSandboxIT] and [BunqSandboxSetupIT]. Setting up a session is
 * limited to about ten a day per IP, so a run reuses the stored one. Both files are private to their owner. [dir] must be
 * absolute, because a relative one would land in the Gradle test working directory, inside the repository. Nothing here prints a secret.
 */
internal class SandboxSession(private val dir: File) {
    init {
        require(dir.isAbsolute) { "BUNQ_SANDBOX_DIR must be an absolute path outside the repository" }
    }

    val cipher: TokenCipher = TokenCipher.fromBase64Key(CIPHER_KEY, "test")
    private val clock = Clock.system(ZoneId.of("Europe/Amsterdam"))
    private val apiKeyFile = File(dir, "api-key")
    val grant = BunqGrant(apiKey())
    val contexts = FileContexts(File(dir, "context.enc"), cipher.encrypt(grant.accessToken, GRANT_AAD))
    val firstRun = contexts.stored() == null

    private fun apiKey(): String {
        dir.mkdirs()
        if (!apiKeyFile.exists()) writePrivately(apiKeyFile, createSandboxUser("sandbox-it-user").apiKey)
        return apiKeyFile.readText().trim()
    }

    fun adapter() = RealBunqGatewayAdapter.create(
        BunqClientProperties(BunqEnvironment.SANDBOX, "sandbox-it-client", "sandbox-it-secret", SANDBOX_SERVICE_NAME),
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

    /** The stored context, which exists once the adapter has read something. */
    fun context(): Context =
        BunqApiContextCodec.decode(cipher.decrypt(contexts.stored()!!, CONTEXT_AAD), BUNQ_SANDBOX_SERVER, SANDBOX_SERVICE_NAME)

    val userId: Long get() = context().userId

    /** Bunq allows 3 reads of an endpoint per 3 seconds (a real 429 said so), so reads of payments are spaced out. */
    fun payments(from: RealBunqGatewayAdapter, account: BunqAccountId): List<Payment> {
        Thread.sleep(READ_SPACING)
        return from.fetchPayments(grant, account, FOREVER_AGO, SANDBOX_PAGE)
    }

    /** A signed call with the stored session. The adapter has no write calls and no shortcut for these paths, so this uses the SDK. */
    fun call(method: String, path: String, body: String? = null): SandboxReply {
        val context = context()
        val response = send(
            context.config,
            Wirespec.RawRequest(
                method,
                path.split('/'),
                emptyMap(),
                mapOf("X-Bunq-Client-Authentication" to listOf(context.sessionToken), "Content-Type" to listOf("application/json")),
                (body ?: "").toByteArray(),
            ),
        )
        val text = response.body?.decodeToString().orEmpty()
        return SandboxReply(response.statusCode, if (text.isBlank()) json.missingNode() else json.readTree(text))
    }

    /** A write that must succeed. The message carries Bunq's own error text, never a response body. */
    fun post(path: String, body: String) {
        val reply = call("POST", path, body)
        check(reply.status == 200) { "POST $path answered ${reply.status}: ${reply.errorDescription()}" }
    }

    /** Asks Sugar Daddy for EUR 500 unless the account already has an incoming payment (a sandbox user has none at first). */
    fun ensureFakeMoney(adapter: RealBunqGatewayAdapter, account: BunqAccountId) {
        fun arrived() = payments(adapter, account).any { it.direction == PaymentDirection.IN }
        if (arrived()) return
        post(
            "user/$userId/monetary-account/${account.value}/request-inquiry",
            """{"amount_inquired":{"value":"500.00","currency":"EUR"},""" +
                """"counterparty_alias":{"type":"EMAIL","value":"sugardaddy@bunq.com","name":"Sugar Daddy"},""" +
                """"description":"fake money (TeamBalance sandbox IT)","allow_bunqme":false}""",
        )
        repeat(FAKE_MONEY_POLLS) {
            if (arrived()) return
            Thread.sleep(POLL_PAUSE)
        }
    }
}
