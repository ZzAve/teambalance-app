package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BUNQ_PUBLIC_OAUTH
import com.bunq.sdk.BUNQ_SANDBOX_OAUTH
import com.bunq.sdk.BunqApiException
import com.bunq.sdk.BunqServer
import com.bunq.sdk.OAuthServer
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.sun.net.httpserver.HttpServer
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import io.kotest.matchers.string.shouldStartWith
import java.io.IOException
import java.net.InetSocketAddress
import java.net.ServerSocket
import java.net.URI
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import java.time.Clock
import java.time.Duration
import java.time.ZoneId

private const val CLIENT_ID = "test-client-id"
private const val CLIENT_SECRET = "test-client-secret"
private const val REDIRECT_URI = "https://api.example/api/bunq/oauth/callback"
private const val OK = 200
private const val BAD_REQUEST = 400
private val CALL_PROPERTIES =
    BunqCallProperties(Duration.ofSeconds(5), Duration.ofSeconds(30), Duration.ofSeconds(1), Duration.ofSeconds(60))
private val CIPHER = TokenCipher.fromBase64Key("dGVhbWJhbGFuY2UtdGVzdC1idW5xLXRva2VuLWtleTE=", "test")

/** The OAuth half never touches the stored API context. */
private object NoContexts : BunqApiContextRepository {
    override fun find(): EncryptedToken? = null

    override fun save(context: EncryptedToken) = false
}

class RealBunqGatewayAdapterTest : FunSpec({

    fun adapter(server: OAuthServer = BUNQ_SANDBOX_OAUTH): RealBunqGatewayAdapter {
        val calls = BunqCalls(CALL_PROPERTIES, Clock.systemUTC())
        val sessions = BunqSessions(BunqServer("http://127.0.0.1:1/v1/", ""), "TeamBalance test", NoContexts, CIPHER, calls)
        return RealBunqGatewayAdapter(CLIENT_ID, CLIENT_SECRET, server, sessions, calls, ZoneId.of("Europe/Amsterdam"))
    }

    context("authorization url") {
        test("sandbox sends the Admin to the sandbox OAuth server with our client, redirect and state, and no scope") {
            val url = adapter().authorizationUrl("the-state", REDIRECT_URI)

            url shouldStartWith "https://oauth.sandbox.bunq.com/auth?"
            val query = queryOf(url)
            query shouldBe mapOf(
                "response_type" to "code",
                "client_id" to CLIENT_ID,
                "redirect_uri" to REDIRECT_URI,
                "state" to "the-state",
            )
            url shouldNotContain "scope"
        }

        test("production sends the Admin to the public OAuth server") {
            adapter(BUNQ_PUBLIC_OAUTH).authorizationUrl("s", REDIRECT_URI) shouldStartWith "https://oauth.bunq.com/auth?"
        }

        test("the environment picks the OAuth server") {
            fun created(environment: BunqEnvironment) = RealBunqGatewayAdapter.create(
                BunqClientProperties(environment, CLIENT_ID, CLIENT_SECRET, "TeamBalance"),
                CALL_PROPERTIES,
                NoContexts,
                CIPHER,
                Clock.systemUTC(),
            )

            created(BunqEnvironment.SANDBOX).authorizationUrl("s", REDIRECT_URI) shouldStartWith "https://oauth.sandbox.bunq.com/auth?"
            created(BunqEnvironment.PRODUCTION).authorizationUrl("s", REDIRECT_URI) shouldStartWith "https://oauth.bunq.com/auth?"
        }
    }

    context("code exchange") {
        test("a 200 with an access token returns the grant, sending our client and the code to the token endpoint") {
            val seen = mutableListOf<URI>()
            withTokenServer(OK, """{"access_token":"issued-token","token_type":"bearer"}""", seen) { server ->
                adapter(server).exchangeCode(BunqAuthorizationCode("the-code"), REDIRECT_URI) shouldBe BunqGrant("issued-token")
            }

            seen.single().path shouldBe "/v1/token"
            queryOf(seen.single().toString()) shouldBe mapOf(
                "grant_type" to "authorization_code",
                "code" to "the-code",
                "redirect_uri" to REDIRECT_URI,
                "client_id" to CLIENT_ID,
                "client_secret" to CLIENT_SECRET,
            )
        }

        test("a 400 invalid_grant stays an exception that carries no secret") {
            withTokenServer(BAD_REQUEST, """{"error":"invalid_grant"}""") { server ->
                val failure = shouldThrow<BunqApiException> { adapter(server).exchangeCode(BunqAuthorizationCode("used"), REDIRECT_URI) }

                failure.status shouldBe BAD_REQUEST
                failure.message!! shouldContain "invalid_grant"
                failure.message!! shouldNotContain CLIENT_SECRET
            }
        }
    }

    test("a token endpoint nobody listens on fails without the client secret in the message or its causes") {
        val closedPort = ServerSocket(0).use { it.localPort }
        val server = OAuthServer("", "http://127.0.0.1:$closedPort/v1/token")

        val failure = shouldThrow<IOException> { adapter(server).exchangeCode(BunqAuthorizationCode("the-code"), REDIRECT_URI) }

        generateSequence<Throwable>(failure) { it.cause }.forEach { it.message.orEmpty() shouldNotContain CLIENT_SECRET }
    }
})

private fun queryOf(url: String): Map<String, String> =
    URI(url).rawQuery.split('&').associate { pair ->
        val (key, value) = pair.split('=', limit = 2)
        key to URLDecoder.decode(value, StandardCharsets.UTF_8)
    }

private fun withTokenServer(status: Int, body: String, seen: MutableList<URI> = mutableListOf(), block: (OAuthServer) -> Unit) {
    val server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0)
    server.createContext("/") { exchange ->
        seen += exchange.requestURI
        val bytes = body.toByteArray()
        exchange.sendResponseHeaders(status, bytes.size.toLong())
        exchange.responseBody.write(bytes)
        exchange.close()
    }
    server.start()
    try {
        block(OAuthServer("", "http://127.0.0.1:${server.address.port}/v1/token"))
    } finally {
        server.stop(0)
    }
}
