package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.application.BunqConnectionService
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldNotBeEmpty
import io.kotest.matchers.shouldBe
import tools.jackson.databind.JsonNode
import java.io.File
import java.net.URI

private const val FUNDED_MARKER = "funded: yes"
private val CONTRIBUTIONS = listOf("120.00" to "Contribution Jan", "45.50" to "Contribution Lisa", "30.00" to "Contribution Tom")

/**
 * Prepares the Bunq sandbox for the real 4.2 run (tracer 4.2 of #10): everything the owner would otherwise click together.
 * Run it on your own machine, then `source` the env file it writes and start the app. It needs no person except for the
 * consent at Bunq's authorize page, which is a phone step (the sandbox app).
 *
 * What it does, each step safe to repeat:
 * 1. the sandbox user of `BUNQ_SANDBOX_DIR` (the same one [BunqSandboxIT] uses) is created if missing and gets its API
 *    session, and Sugar Daddy's EUR 500 if it has no incoming payment yet. This user, A, owns the OAuth client.
 * 2. a second sandbox user, B, is created once and paid a few contributions by A. B is the end user who gives the consent
 *    in the sandbox app: Bunq documents that a sandbox user passes its security checks only on the first API call made for
 *    it, so B's API key is never stored and no call is ever made as B. Its login alias and code are kept in `end-user.txt`
 *    of the sandbox directory for the app login.
 * 3. A's OAuth client is created if missing and `BUNQ_SANDBOX_REDIRECT_URL` is registered on it as a callback URL.
 * 4. the OAuth client id and secret go to the env file (`BUNQ_SANDBOX_ENV_FILE`, default `~/.teambalance-bunq-sandbox.env`,
 *    mode 600), as `export` lines for the app. Only non-secret facts are printed, on lines that start with `sandbox setup:`.
 *
 * Runs only when `BUNQ_SANDBOX_IT=1`: it talks to the real Bunq sandbox, so it registers no tests in `make test` or CI.
 * Needs `BUNQ_SANDBOX_DIR` (outside the repository) and `BUNQ_SANDBOX_REDIRECT_URL`, the callback URL of the app as the
 * browser reaches it: `https://<tunnel host>/api/bunq/oauth/callback`.
 *
 * Gradle does not see environment variables as inputs, so pass `--rerun` to run it again, and `-i` to see the printed facts.
 */
class BunqSandboxSetupIT : FunSpec({
    if (System.getenv("BUNQ_SANDBOX_IT") == "1") setupTests()
})

@Suppress("LongMethod")
private fun FunSpec.setupTests() {
    val dir = File(requireNotNull(System.getenv("BUNQ_SANDBOX_DIR")) { "BUNQ_SANDBOX_DIR is not set" })
    val redirectUrl = requireNotNull(System.getenv("BUNQ_SANDBOX_REDIRECT_URL")) { "BUNQ_SANDBOX_REDIRECT_URL is not set" }
    val envFile = File(System.getenv("BUNQ_SANDBOX_ENV_FILE") ?: "${System.getProperty("user.home")}/.teambalance-bunq-sandbox.env")
    require(envFile.isAbsolute) { "BUNQ_SANDBOX_ENV_FILE must be an absolute path outside the repository" }
    val appOrigins = AppOrigins.of(redirectUrl)
    val session = SandboxSession(dir)
    val endUserFile = File(dir, "end-user.txt")
    var account = BunqAccountId("")

    fun userPath() = "user/${session.userId}"

    test("the sandbox user has an API session and an account") {
        val accounts = session.adapter().listAccounts(session.grant)

        accounts.shouldNotBeEmpty()
        account = accounts.first().id
        println("sandbox setup: API session ${if (session.firstRun) "installed" else "restored"}, ${accounts.size} account(s)")
    }

    test("the account has fake money from Sugar Daddy") {
        val adapter = session.adapter()

        session.ensureFakeMoney(adapter, account)

        session.payments(adapter, account).any { it.direction == PaymentDirection.IN } shouldBe true
    }

    test("an end user for the sandbox app exists and has been paid a few contributions") {
        val known = endUserFile.takeIf { it.exists() }?.readText()
        val email: String
        if (known == null) {
            val endUser = createSandboxUser("sandbox-end-user")
            email = endUser.aliases["EMAIL"] ?: error("The new sandbox user has no email alias")
            val aliases = endUser.aliases.entries.joinToString("\n") { "alias ${it.key}: ${it.value}" }
            writePrivately(endUserFile, "name: ${endUser.displayName}\n$aliases\nlogin code: ${endUser.loginCode}\n")
            println("sandbox setup: end user ${endUser.displayName} created; login details in ${endUserFile.absolutePath}")
        } else {
            email = requireNotNull(Regex("alias EMAIL: (.+)").find(known)) { "${endUserFile.name} has no email alias" }.groupValues[1]
        }
        if (known?.contains(FUNDED_MARKER) == true) {
            println("sandbox setup: end user was already paid its contributions")
            return@test
        }
        CONTRIBUTIONS.forEach { (amount, description) ->
            session.post(
                "${userPath()}/monetary-account/${account.value}/payment",
                """{"amount":{"value":"$amount","currency":"EUR"},""" +
                    """"counterparty_alias":{"type":"EMAIL","value":"$email","name":"TeamBalance sandbox end user"},""" +
                    """"description":"$description (TeamBalance sandbox IT)"}""",
            )
            Thread.sleep(POLL_PAUSE)
        }
        endUserFile.appendText("$FUNDED_MARKER\n")
        println("sandbox setup: end user paid ${CONTRIBUTIONS.size} contributions")
    }

    test("the OAuth client exists and has the redirect URL registered") {
        session.adapter().listAccounts(session.grant)
        val clients = "${userPath()}/oauth-client"
        var client = existingClient(session.call("GET", clients))
        if (client == null) {
            session.post(clients, """{"status":"ACTIVE"}""")
            client = existingClient(session.call("GET", clients))
        }
        val registered = requireNotNull(client) { "The OAuth client cannot be read back after creating it" }
        val clientPath = "$clients/${registered.path("id").asLong()}"
        if (registered.path("callback_url").items().none { it.path("url").asString() == redirectUrl }) {
            session.post("$clientPath/callback-url", """{"url":"$redirectUrl"}""")
        }
        val callbackUrls = session.call("GET", "$clientPath/callback-url").body.path("Response").items()
            .map { it.path("OauthCallbackUrl").path("url").asString() }
        callbackUrls.contains(redirectUrl) shouldBe true
        writePrivately(
            envFile,
            """
            export TEAMBALANCE_BUNQ_ENVIRONMENT='sandbox'
            export TEAMBALANCE_BUNQ_CLIENT_ID='${registered.path("client_id").asString()}'
            export TEAMBALANCE_BUNQ_CLIENT_SECRET='${registered.path("secret").asString()}'
            export TEAMBALANCE_API_BASE_URL='${appOrigins.api}'
            export TEAMBALANCE_FRONTEND_BASE_URL='${appOrigins.frontend}'
            """.trimIndent() + "\n",
        )
        println("sandbox setup: OAuth client id ${registered.path("id").asLong()} of user ${session.userId}")
        println("sandbox setup: registered redirect URLs: ${callbackUrls.joinToString()}")
        println("sandbox setup: env file written (mode 600): ${envFile.absolutePath}")
    }

    test("the account summary") {
        val adapter = session.adapter()
        val payments = session.payments(adapter, account)
        val balance = adapter.fetchBalance(session.grant, account)
        println(
            "sandbox setup: account ${account.value}: balance ${balance.cents} cents, " +
                "${payments.count { it.direction == PaymentDirection.IN }} incoming and " +
                "${payments.count { it.direction == PaymentDirection.OUT }} outgoing payment(s)",
        )
        println("sandbox setup: the account the app will read is the end user's, in the sandbox app, not this one")
    }
}

/** The OAuth client in a list answer, which holds at most one per user (doc page "Register OAuth Client"). */
private fun existingClient(reply: SandboxReply): JsonNode? {
    check(reply.status == 200) { "Listing the OAuth client answered ${reply.status}: ${reply.errorDescription()}" }
    return reply.body.path("Response").items().map { it.path("OauthClient") }.firstOrNull { it.has("client_id") }
}

/** The origins the app is reached at, taken from the redirect URL, which must be the app's own callback path. */
internal class AppOrigins(val api: String, val frontend: String) {
    companion object {
        fun of(redirectUrl: String): AppOrigins {
            val uri = URI(redirectUrl)
            require(uri.path == BunqConnectionService.CALLBACK_PATH && uri.query == null) {
                "BUNQ_SANDBOX_REDIRECT_URL must end in ${BunqConnectionService.CALLBACK_PATH}, with no query"
            }
            require(uri.scheme == "https" || uri.host == "localhost") { "BUNQ_SANDBOX_REDIRECT_URL must be https (or localhost)" }
            val origin = "${uri.scheme}://${uri.authority}"
            return AppOrigins(origin, if (uri.host == "localhost") "http://localhost:5173" else origin)
        }
    }
}
