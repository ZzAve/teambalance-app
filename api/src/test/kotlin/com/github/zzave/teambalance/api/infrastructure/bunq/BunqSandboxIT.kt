package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldNotBeEmpty
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import java.io.File

private const val NEVER_ISSUED_TOKEN = "0000000000000000000000000000000000000000000000000000000000000000"

/**
 * The real [RealBunqGatewayAdapter] against the Bunq sandbox, using a sandbox user's API key where a team would have
 * an OAuth access token (Bunq treats both alike once the session is set up). The OAuth approval itself needs a person
 * and is not exercised here.
 *
 * Runs only when `BUNQ_SANDBOX_IT=1`: it talks to the real Bunq sandbox, so it registers no tests in `make test` or CI.
 *
 * `BUNQ_SANDBOX_DIR` names an absolute directory that holds the sandbox user's `api-key` and the encrypted `context.enc`.
 * Keep it outside the repository. Both files are created on the first run: the sandbox user once, the installation once.
 * Setting up a session is limited to about ten a day per IP, so a run reuses the stored one. Nothing secret is printed.
 */
class BunqSandboxIT : FunSpec({
    if (System.getenv("BUNQ_SANDBOX_IT") == "1") sandboxTests()
})

@Suppress("LongMethod")
private fun FunSpec.sandboxTests() {
    val session = SandboxSession(File(requireNotNull(System.getenv("BUNQ_SANDBOX_DIR")) { "BUNQ_SANDBOX_DIR is not set" }))
    val cipher = session.cipher
    val contexts = session.contexts
    val grant = session.grant
    val firstRun = session.firstRun
    var accountValue = ""
    fun account() = BunqAccountId(accountValue)

    fun adapter() = session.adapter()

    fun payments(from: RealBunqGatewayAdapter) = session.payments(from, account())

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
        session.ensureFakeMoney(adapter, account())
        val all = payments(adapter)
        all.any { it.direction == PaymentDirection.IN } shouldBe true
        val net = all.sumOf { if (it.direction == PaymentDirection.IN) it.amount.cents else -it.amount.cents }
        adapter.fetchBalance(grant, account()) shouldBe Money(net)
    }

    test("an outgoing payment is read as outgoing with a positive amount") {
        val adapter = adapter()
        if (payments(adapter).none { it.direction == PaymentDirection.OUT }) {
            session.post(
                "user/${session.userId}/monetary-account/${account().value}/payment",
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
        val stored = session.context()
        val dead = stored.copy(sessionToken = NEVER_ISSUED_TOKEN)
        contexts.save(cipher.encrypt(BunqApiContextCodec.encode(dead), CONTEXT_AAD), ifGrant = contexts.find().grant)
        val savesBefore = contexts.saves

        adapter().fetchBalance(grant, account())

        contexts.saves shouldBe savesBefore + 1
        val refreshed = session.context()
        refreshed.sessionToken shouldNotBe NEVER_ISSUED_TOKEN
    }

    test("an access token Bunq never issued is a rejected grant") {
        shouldThrow<BunqGrantRejectedException> { adapter().listAccounts(BunqGrant(NEVER_ISSUED_TOKEN)) }
    }
}
