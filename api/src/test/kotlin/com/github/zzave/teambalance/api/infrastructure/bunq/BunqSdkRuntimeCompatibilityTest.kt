package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BunqApiException
import com.bunq.sdk.BunqServer
import com.bunq.sdk.BunqSigningKeysGenerator
import com.bunq.sdk.Config
import com.bunq.sdk.Context
import com.bunq.sdk.bunqClient
import com.bunq.sdk.generated.endpoint.ListAllMonetaryAccountBankForUser
import com.sun.net.httpserver.HttpServer
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import kotlinx.coroutines.runBlocking
import java.net.InetSocketAddress
import java.security.Signature
import java.time.Instant
import java.util.Base64

private const val USER_ID = 3_000_001L
private const val SESSION_VALID_SECONDS = 3_600L
private const val OK = 200
private const val FORBIDDEN = 403
private const val TEAMKAS_ID = 11L
private const val PRIVE_ID = 12L

/** A recorded-shape Bunq list response: the item wrapper key, the `Response` envelope and the `Pagination` block. */
private val MONETARY_ACCOUNT_LIST = """
    {"Response":[
      {"MonetaryAccountBank":{"id":$TEAMKAS_ID,"description":"Teamkas","status":"ACTIVE","balance":{"value":"187.50","currency":"EUR"},"unknown_field":true}},
      {"MonetaryAccountBank":{"id":$PRIVE_ID,"description":"Privé","status":"ACTIVE","balance":{"value":"42.35","currency":"EUR"}}}
    ],
    "Pagination":{"future_url":null,"newer_url":null,"older_url":"/v1/user/$USER_ID/monetary-account-bank?older_id=$PRIVE_ID"}}
""".trimIndent()

/**
 * The SDK is built against Jackson 3.2.3 and Wirespec 0.22.4; this app resolves Jackson 3.1.4 and Wirespec 0.22.5.
 * These calls run the SDK's own client, request signing, response-signature check and Jackson (de)serialisation
 * on the resolved versions, against a local server that answers with Bunq-shaped JSON signed by a key it hands the client.
 */
class BunqSdkRuntimeCompatibilityTest : FunSpec({

    test("the SDK client reads a signed Bunq monetary-account list through Jackson and Wirespec") {
        withSignedBunq(OK, MONETARY_ACCOUNT_LIST) { context ->
            val response = runBlocking { bunqClient(context).listAllMonetaryAccountBankForUser(USER_ID, null, null, null) }

            val page = response.shouldBeInstanceOf<ListAllMonetaryAccountBankForUser.Response200>().body
            page.Response.map { it.id } shouldBe listOf(TEAMKAS_ID, PRIVE_ID)
            page.Response.map { it.description } shouldBe listOf("Teamkas", "Privé")
            page.Response.map { it.balance?.value } shouldBe listOf("187.50", "42.35")
            page.Pagination.older_url shouldBe "/v1/user/$USER_ID/monetary-account-bank?older_id=$PRIVE_ID"
        }
    }

    test("a status other than 200 and 400 is a BunqApiException carrying the status") {
        withSignedBunq(FORBIDDEN, """{"Error":[{"error_description":"Nope."}]}""") { context ->
            val failure = shouldThrow<BunqApiException> {
                runBlocking { bunqClient(context).listAllMonetaryAccountBankForUser(USER_ID, null, null, null) }
            }

            failure.status shouldBe FORBIDDEN
        }
    }
})

private fun withSignedBunq(status: Int, body: String, block: (Context) -> Unit) {
    val serverKeys = BunqSigningKeysGenerator.generateBunqSigningKeys()
    val server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0)
    server.createContext("/") { exchange ->
        val bytes = body.toByteArray()
        val signature = Signature.getInstance("SHA256withRSA").apply {
            initSign(serverKeys.privateKey())
            update(bytes)
        }.sign()
        exchange.responseHeaders.add("X-Bunq-Server-Signature", Base64.getEncoder().encodeToString(signature))
        exchange.sendResponseHeaders(status, bytes.size.toLong())
        exchange.responseBody.write(bytes)
        exchange.close()
    }
    server.start()
    try {
        val config = Config(
            bunqServer = BunqServer("http://127.0.0.1:${server.address.port}/v1/", ""),
            serviceName = "TeamBalance test",
            apiKey = "test-api-key",
            signingKeys = BunqSigningKeysGenerator.generateBunqSigningKeys(),
        )
        val context = Context(
            serverPublicKey = serverKeys.publicKeyAsPem(),
            deviceId = 1,
            sessionId = 1,
            sessionToken = "test-session-token",
            userId = USER_ID,
            sessionExpiryTime = Instant.now().plusSeconds(SESSION_VALID_SECONDS),
            installationToken = "test-installation-token",
            config = config,
        )
        block(context)
    } finally {
        server.stop(0)
    }
}
