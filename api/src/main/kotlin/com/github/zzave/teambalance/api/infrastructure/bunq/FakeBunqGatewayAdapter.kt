package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAccountName
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Iban
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDescription
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression
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
 * Active in every profile except prod, and only with the environment `none` (or unset) or `fake`: with `sandbox` or
 * `production` the [RealBunqGatewayAdapter] takes its place (ADR-0042). In prod [BunqGatewayConfiguration] constructs it
 * for `fake` while the demo switch is on. A grant it never issued is accepted, which is how the demo team's seeded
 * connection works.
 *
 * Plays Bunq's OAuth too: [authorizationUrl] points at [FakeBunqAuthorizeController], which calls
 * [issueCode] once the user approves and sends the browser back. A code can be exchanged once, and
 * every grant covers the same two accounts. Grants are `fake:{login}:{random}` tokens, and [revoke] makes
 * every grant issued so far to a login be rejected, as a Bunq user withdrawing access would. A grant
 * the fake never issued is accepted.
 */
@Component
@Profile("!prod")
@ConditionalOnExpression("'\${teambalance.bunq.environment:none}'.matches('(?i)none|fake')")
class FakeBunqGatewayAdapter(
    private val clock: Clock,
    @param:Value("\${teambalance.api-base-url}") apiBaseUrl: String,
) : BunqGateway {

    private val authorizeUrl = "${apiBaseUrl.trimEnd('/')}$AUTHORIZE_PATH"
    private val loginByCode = ConcurrentHashMap<String, String>()
    private val grantsByLogin = ConcurrentHashMap<String, MutableSet<String>>()
    private val revokedGrants = ConcurrentHashMap.newKeySet<String>()

    override fun authorizationUrl(state: String, redirectUri: String): String =
        "$authorizeUrl?state=${urlEncode(state)}&redirect_uri=${urlEncode(redirectUri)}"

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant {
        val login = requireNotNull(loginByCode.remove(code.value)) { "Unknown or already used authorization code" }
        val grant = "fake:$login:${UUID.randomUUID()}"
        grantsByLogin.computeIfAbsent(login) { ConcurrentHashMap.newKeySet() }.add(grant)
        return BunqGrant(grant)
    }

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> = accepted(grant) { ACCOUNTS }

    /** The code Bunq would put on the callback once [login] approves. */
    fun issueCode(login: String): String = UUID.randomUUID().toString().also { loginByCode[it] = login }

    fun revoke(login: String) {
        grantsByLogin[login]?.let(revokedGrants::addAll)
    }

    private fun <T> accepted(grant: BunqGrant, read: () -> T): T =
        if (grant.accessToken in revokedGrants) throw BunqGrantRejectedException() else read()

    private fun urlEncode(value: String) = URLEncoder.encode(value, StandardCharsets.UTF_8)

    override fun fetchBalance(grant: BunqGrant, account: BunqAccountId): Money = accepted(grant) {
        Money(if (account == PRIVE_ID) PRIVE_BALANCE_CENTS else TEAMKAS_BALANCE_CENTS)
    }

    override fun fetchPayments(grant: BunqGrant, account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> =
        accepted(grant) {
            val today = LocalDate.now(clock)
            val payments = if (account == PRIVE_ID) PRIVE_PAYMENTS else TEAMKAS_PAYMENTS
            payments.map { it.on(today) }.filter { !it.date.isBefore(since) }.take(limit)
        }

    private class CannedPayment(
        val id: String,
        val daysAgo: Long,
        val name: String,
        val cents: Long,
        val direction: PaymentDirection,
        val iban: String? = null,
        val description: String? = null,
    ) {
        fun on(today: LocalDate) = Payment(
            PaymentId(id), today.minusDays(daysAgo), PaymentName(name), Money(cents), direction, iban?.let(Iban::parse),
            description?.let(::PaymentDescription),
        )
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
            CannedPayment("1001", 2, "Albert Heijn", 2_350, PaymentDirection.OUT),
            CannedPayment("1002", 9, "Marieke Dekker", 1_500, PaymentDirection.IN),
            CannedPayment("1003", 16, "Zwembad De Dolfijn", 1_200, PaymentDirection.OUT),
            CannedPayment("1004", 40, "Koen Willems", 3_000, PaymentDirection.IN),
        )

        private val TEAMKAS_PAYMENTS = listOf(
            // The description names the first member of the demo seed (db/seed/demo_data.sql), as a real top-up would.
            CannedPayment(
                "1005", 5, "Lisa de Vries", 2_000, PaymentDirection.IN, "NL91ABNA0417164300",
                "TeamBalance · Demo Team · Lisa Bakker · b0000000-0000-0000-0000-000000000002",
            ),
            CannedPayment("1006", 7, "Sporthal De Kuil", 4_500, PaymentDirection.OUT),
            CannedPayment("1007", 12, "Tom Bakker", 1_000, PaymentDirection.IN, "NL02ABNA0123456789"),
            CannedPayment("1008", 19, "Jan Jansen", 5_000, PaymentDirection.IN, "DE89370400440532013000"),
            CannedPayment("1009", 26, "Drankenhandel Smit", 3_250, PaymentDirection.OUT),
            CannedPayment("1010", 33, "Sanne Visser", 2_000, PaymentDirection.IN),
            CannedPayment("1011", 47, "Nevobo", 6_000, PaymentDirection.OUT),
            CannedPayment("1012", 61, "Mark Smits", 1_000, PaymentDirection.IN),
        )
    }
}
