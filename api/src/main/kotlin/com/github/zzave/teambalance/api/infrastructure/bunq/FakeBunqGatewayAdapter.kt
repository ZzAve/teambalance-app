package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAccountName
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.time.Clock
import java.time.LocalDate
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

/**
 * Dev/test/e2e adapter serving a canned balance and payment history for any account.
 * Active in every profile except prod, where [UnconfiguredBunqGatewayAdapter] stands in until the
 * real Bunq adapter exists (ADR-0042).
 *
 * Plays Bunq's OAuth too: [authorizationUrl] points at [FakeBunqAuthorizeController], which calls
 * [issueCode] once the user approves and sends the browser back. A code can be exchanged once, and
 * every grant covers the same two accounts.
 */
@Component
@Profile("!prod")
class FakeBunqGatewayAdapter(
    private val clock: Clock,
    @param:Value("\${teambalance.api-base-url}") apiBaseUrl: String,
) : BunqGateway {

    private val authorizeUrl = "${apiBaseUrl.trimEnd('/')}$AUTHORIZE_PATH"
    private val loginByCode = ConcurrentHashMap<String, String>()

    override fun authorizationUrl(state: String, redirectUri: String): String =
        "$authorizeUrl?state=${urlEncode(state)}&redirect_uri=${urlEncode(redirectUri)}"

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant {
        val login = requireNotNull(loginByCode.remove(code.value)) { "Unknown or already used authorization code" }
        return BunqGrant("fake:$login:${UUID.randomUUID()}")
    }

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> = ACCOUNTS

    /** The code Bunq would put on the callback once [login] approves. */
    fun issueCode(login: String): String = UUID.randomUUID().toString().also { loginByCode[it] = login }

    private fun urlEncode(value: String) = URLEncoder.encode(value, StandardCharsets.UTF_8)

    override fun fetchBalance(account: BunqAccountId): Money =
        Money(if (account == PRIVE_ID) PRIVE_BALANCE_CENTS else TEAMKAS_BALANCE_CENTS)

    override fun fetchPayments(account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> {
        val today = LocalDate.now(clock)
        val payments = if (account == PRIVE_ID) PRIVE_PAYMENTS else TEAMKAS_PAYMENTS
        return payments.map { it.on(today) }.filter { !it.date.isBefore(since) }.take(limit)
    }

    private class CannedPayment(val daysAgo: Long, val name: String, val cents: Long, val direction: PaymentDirection) {
        fun on(today: LocalDate) = Payment(today.minusDays(daysAgo), PaymentName(name), Money(cents), direction)
    }

    companion object {
        const val AUTHORIZE_PATH = "/internal/fake-bunq/authorize"

        private const val TEAMKAS_BALANCE_CENTS = 18_750L
        private const val PRIVE_BALANCE_CENTS = 4_235L

        private val TEAMKAS_ID = BunqAccountId("fake-account-1")
        private val PRIVE_ID = BunqAccountId("fake-account-2")

        private val ACCOUNTS = listOf(
            BunqAccount(TEAMKAS_ID, BunqAccountName("Teamkas")),
            BunqAccount(PRIVE_ID, BunqAccountName("Privé")),
        )

        // Any account but Privé reads as Teamkas, so tests and demos that name an arbitrary account id keep working.
        private val PRIVE_PAYMENTS = listOf(
            CannedPayment(2, "Albert Heijn", 2_350, PaymentDirection.OUT),
            CannedPayment(9, "Marieke Dekker", 1_500, PaymentDirection.IN),
            CannedPayment(16, "Zwembad De Dolfijn", 1_200, PaymentDirection.OUT),
            CannedPayment(40, "Koen Willems", 3_000, PaymentDirection.IN),
        )

        private val TEAMKAS_PAYMENTS = listOf(
            CannedPayment(5, "Lisa de Vries", 2_000, PaymentDirection.IN),
            CannedPayment(7, "Sporthal De Kuil", 4_500, PaymentDirection.OUT),
            CannedPayment(12, "Tom Bakker", 1_000, PaymentDirection.IN),
            CannedPayment(19, "Jan Jansen", 5_000, PaymentDirection.IN),
            CannedPayment(26, "Drankenhandel Smit", 3_250, PaymentDirection.OUT),
            CannedPayment(33, "Sanne Visser", 2_000, PaymentDirection.IN),
            CannedPayment(47, "Nevobo", 6_000, PaymentDirection.OUT),
            CannedPayment(61, "Mark Smits", 1_000, PaymentDirection.IN),
        )
    }
}
