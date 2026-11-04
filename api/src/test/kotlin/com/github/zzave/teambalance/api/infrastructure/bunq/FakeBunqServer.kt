package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BunqServer
import com.bunq.sdk.BunqSigningKeysGenerator
import com.bunq.sdk.Config
import com.bunq.sdk.Context
import com.bunq.sdk.SigningKeys
import com.sun.net.httpserver.HttpServer
import java.net.InetSocketAddress
import java.security.Signature
import java.time.Duration
import java.time.Instant
import java.util.Base64
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.Executors

/** A request the fake Bunq received. */
internal class SeenRequest(val method: String, val path: String, val query: String?, val authentication: String?, val body: String)

/** What the fake answers. Bunq signs its 200 and 400 answers, and the SDK checks it. */
internal class Reply(
    val status: Int,
    val body: String,
    val headers: Map<String, String> = emptyMap(),
    val delay: Duration = Duration.ZERO,
) {
    val signed: Boolean get() = status == 200 || status == 400
}

internal fun fixture(name: String): String =
    FakeBunqServer::class.java.getResource("/bunq/$name")!!.readText().trim()

internal const val FAKE_USER_ID = 1_000_001L
internal const val FAKE_ACCOUNT_ID = 2_000_001L

/**
 * A local stand-in for the Bunq API: the installation, device and session setup, and the three reads, answering with
 * recorded sandbox bodies (identifiers replaced by obviously fake ones). Answers are signed with a key the fake hands
 * out as the server public key, as Bunq does, so the SDK's own checks run. Every request is kept in [seen].
 */
internal class FakeBunqServer : AutoCloseable {
    private val keys: SigningKeys = BunqSigningKeysGenerator.generateBunqSigningKeys()
    private val routes = CopyOnWriteArrayList<Pair<Pair<String, Regex>, () -> Reply>>()
    val seen = CopyOnWriteArrayList<SeenRequest>()

    private val http = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0).apply {
        executor = Executors.newVirtualThreadPerTaskExecutor()
        createContext("/") { exchange ->
            val requestBody = String(exchange.requestBody.readAllBytes())
            val method = exchange.requestMethod
            val path = exchange.requestURI.path
            val authentication = exchange.requestHeaders.getFirst("X-Bunq-Client-Authentication")
            seen += SeenRequest(method, path, exchange.requestURI.rawQuery, authentication, requestBody)
            val reply = routes.firstOrNull { (key, _) -> key.first == method && key.second.matches(path) }?.second?.invoke()
                ?: Reply(404, """{"Error":[{"error_description":"No such route in the fake"}]}""")
            if (!reply.delay.isZero) Thread.sleep(reply.delay)
            val bytes = reply.body.toByteArray()
            reply.headers.forEach { (name, value) -> exchange.responseHeaders.add(name, value) }
            if (reply.signed) exchange.responseHeaders.add("X-Bunq-Server-Signature", sign(bytes))
            exchange.sendResponseHeaders(reply.status, if (bytes.isEmpty()) -1 else bytes.size.toLong())
            if (bytes.isNotEmpty()) exchange.responseBody.write(bytes)
            exchange.close()
        }
        start()
    }

    val server = BunqServer("http://127.0.0.1:${http.address.port}/v1/", "")

    init {
        answer("POST", "/v1/installation") { ok(fixture("installation.json").replace("__SERVER_PUBLIC_KEY__", publicKeyJson())) }
        answer("POST", "/v1/device-server") { ok("""{"Response":[{"Id":{"id":5241225}}]}""") }
        answer("POST", "/v1/session-server") { ok(fixture("session-server.json")) }
        answer("GET", "/v1/user/$FAKE_USER_ID/monetary-account-bank") { ok(fixture("monetary-account-bank-list.json")) }
        answer("GET", "/v1/user/$FAKE_USER_ID/monetary-account-joint") { ok(EMPTY_PAGE) }
        answer("GET", "/v1/user/$FAKE_USER_ID/monetary-account-savings") { ok(EMPTY_PAGE) }
        answer("GET", "/v1/user/$FAKE_USER_ID/monetary-account/$FAKE_ACCOUNT_ID") { ok(fixture("monetary-account-read.json")) }
        answer("GET", "/v1/user/$FAKE_USER_ID/monetary-account/$FAKE_ACCOUNT_ID/payment") { ok(fixture("payment-list.json")) }
    }

    /** Replaces what the fake answers to [method] and [path] from now on. */
    fun answer(method: String, path: String, reply: () -> Reply) {
        routes.add(0, (method to Regex(Regex.escape(path))) to reply)
    }

    fun answer(method: String, path: String, reply: Reply) = answer(method, path) { reply }

    fun count(method: String, path: String) = seen.count { it.method == method && it.path == path }

    fun ok(body: String) = Reply(200, body)

    /** A session as the SDK would have kept it after setting up against this fake, valid for [validFor]. */
    fun context(apiKey: String, sessionToken: String = "restored-session-token", validFor: Duration = Duration.ofHours(1)) = Context(
        serverPublicKey = keys.publicKeyAsPem(),
        deviceId = 5_241_225,
        sessionId = 1,
        sessionToken = sessionToken,
        userId = FAKE_USER_ID,
        sessionExpiryTime = Instant.now().plus(validFor),
        installationToken = "restored-installation-token",
        config = Config(server, "TeamBalance test", apiKey, BunqSigningKeysGenerator.generateBunqSigningKeys()),
    )

    fun publicKeyJson() = keys.publicKeyAsPem().replace("\n", "\\n")

    private fun sign(bytes: ByteArray): String = Base64.getEncoder().encodeToString(
        Signature.getInstance("SHA256withRSA").apply {
            initSign(keys.privateKey())
            update(bytes)
        }.sign(),
    )

    override fun close() = http.stop(0)

    private companion object {
        const val EMPTY_PAGE = """{"Response":[],"Pagination":{"future_url":null,"newer_url":null,"older_url":null}}"""
    }
}
