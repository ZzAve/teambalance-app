package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BUNQ_PUBLIC_OAUTH
import com.bunq.sdk.BUNQ_SANDBOX_OAUTH
import com.bunq.sdk.BunqApiException
import com.bunq.sdk.OAuthServer
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqEnvironment
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.sun.net.httpserver.HttpServer
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import io.kotest.matchers.string.shouldStartWith
import java.net.InetSocketAddress
import java.net.URI
import java.net.URLDecoder
import java.nio.charset.StandardCharsets
import java.time.LocalDate

private const val CLIENT_ID = "test-client-id"
private const val CLIENT_SECRET = "test-client-secret"
private const val REDIRECT_URI = "https://api.example/api/bunq/oauth/callback"
private const val OK = 200
private const val BAD_REQUEST = 400
private const val LIMIT = 10
private val GRANT = BunqGrant("test-grant")
private val ACCOUNT = BunqAccountId("1")

class RealBunqGatewayAdapterTest : FunSpec({

    fun adapter(server: OAuthServer = BUNQ_SANDBOX_OAUTH) = RealBunqGatewayAdapter(CLIENT_ID, CLIENT_SECRET, server)

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
            fun properties(environment: BunqEnvironment) = BunqClientProperties(environment, CLIENT_ID, CLIENT_SECRET, "TeamBalance")

            RealBunqGatewayAdapter(properties(BunqEnvironment.SANDBOX)).authorizationUrl("s", REDIRECT_URI) shouldStartWith
                "https://oauth.sandbox.bunq.com/auth?"
            RealBunqGatewayAdapter(properties(BunqEnvironment.PRODUCTION)).authorizationUrl("s", REDIRECT_URI) shouldStartWith
                "https://oauth.bunq.com/auth?"
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

    context("reads are not built yet") {
        test("listing accounts, reading a balance and reading payments say so") {
            val unsupported = listOf<() -> Any>(
                { adapter().listAccounts(GRANT) },
                { adapter().fetchBalance(GRANT, ACCOUNT) },
                { adapter().fetchPayments(GRANT, ACCOUNT, LocalDate.of(2026, 1, 1), LIMIT) },
            )

            unsupported.forEach { read ->
                shouldThrow<UnsupportedOperationException> { read() }.message!! shouldContain "not implemented yet"
            }
        }
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
