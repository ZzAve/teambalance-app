package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BUNQ_PUBLIC_OAUTH
import com.bunq.sdk.BUNQ_PUBLIC_SERVER
import com.bunq.sdk.BUNQ_SANDBOX_OAUTH
import com.bunq.sdk.BUNQ_SANDBOX_SERVER
import com.bunq.sdk.BunqServer
import com.bunq.sdk.OAuthServer
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.port.BunqApiContextRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.bunq.sdk.BunqApiException
import com.bunq.sdk.generated.model.MonetaryAccountBankPage
import com.bunq.sdk.generated.model.MonetaryAccountJointPage
import com.bunq.sdk.generated.model.MonetaryAccountRead
import com.bunq.sdk.generated.model.MonetaryAccountSavingsPage
import com.bunq.sdk.generated.model.PaymentListing
import com.bunq.sdk.generated.model.PaymentPage
import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.PaymentName
import kotlinx.coroutines.runBlocking
import java.time.Clock
import java.time.LocalDate
import java.time.ZoneId
import kotlin.math.abs
import kotlin.math.min
import com.bunq.sdk.authorizeUrl as sdkAuthorizeUrl
import com.bunq.sdk.exchangeCode as sdkExchangeCode

/**
 * The platform's OAuth client at the real Bunq (sandbox or production, by `teambalance.bunq.environment`),
 * built on the bunq SDK.
 *
 * [authorizationUrl] and [exchangeCode] are the OAuth half; the SDK sets no timeout on the token request.
 * The three reads go through a per-access-token API session ([BunqSessions]) and a call wrapper that bounds each call
 * in time and pauses all of Bunq after a 429 ([BunqCalls]).
 *
 * What a failure means to the caller: [BunqGrantRejectedException] when Bunq refuses the access token itself (401, a 403 that
 * a new session does not cure, or a refusal to set up a session for it), [BunqUnavailableException] for everything else.
 * Bunq's error bodies reach the exception text; the access token, session and client secret never do.
 *
 * The OAuth servers are a constructor parameter so tests can point the token exchange at a local server.
 */
class RealBunqGatewayAdapter internal constructor(
    private val clientId: String,
    private val clientSecret: String,
    private val oauthServer: OAuthServer,
    private val sessions: BunqSessions,
    private val calls: BunqCalls,
    private val zone: ZoneId,
) : BunqGateway {

    override fun authorizationUrl(state: String, redirectUri: String): String =
        sdkAuthorizeUrl(oauthServer, clientId, redirectUri, state)

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant =
        BunqGrant(sdkExchangeCode(oauthServer, clientId, clientSecret, redirectUri, code.value))

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> = reading(grant) { session ->
        val client = session.client
        val user = session.userId
        val banks = client.listAllMonetaryAccountBankForUser(user, PAGE_SIZE, null, null).ok<MonetaryAccountBankPage>().Response
            .map { AccountRow(it.id, it.description, it.status, it.currency) }
        val joints = client.listAllMonetaryAccountJointForUser(user, PAGE_SIZE, null, null).ok<MonetaryAccountJointPage>().Response
            .map { AccountRow(it.id, it.description, it.status, it.currency) }
        val savings = client.listAllMonetaryAccountSavingsForUser(user, PAGE_SIZE, null, null).ok<MonetaryAccountSavingsPage>().Response
            .map { AccountRow(it.id, it.description, it.status, it.currency) }
        (banks + joints + savings).mapNotNull(AccountRow::toAccount)
    }

    override fun fetchBalance(grant: BunqGrant, account: BunqAccountId): Money = reading(grant) { session ->
        val read = session.client.readMonetaryAccountForUser(session.userId, idOf(account)).ok<MonetaryAccountRead>()
        moneyOf((read.MonetaryAccountBank?.balance ?: read.MonetaryAccountJoint?.balance ?: read.MonetaryAccountSavings?.balance))
    }

    override fun fetchPayments(grant: BunqGrant, account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> =
        reading(grant) { session ->
            val count = min(limit.toLong(), PAGE_SIZE)
            val page = session.client.listAllPaymentForUserMonetaryAccount(session.userId, idOf(account), count, null, null)
            page.ok<PaymentPage>().Response.map(::paymentOf).filter { !it.date.isBefore(since) }.take(limit)
        }

    /**
     * Runs one read against the grant's session, which is set up first if this is the first read with the grant. A failure
     * is [BunqGrantRejectedException] only when Bunq refuses the grant itself, and [BunqUnavailableException] for everything else.
     */
    @Suppress("TooGenericExceptionCaught")
    private fun <T> reading(grant: BunqGrant, read: suspend (BunqSession) -> T): T {
        calls.requireOpen()
        var session: BunqSession? = null
        try {
            val opened = sessions.sessionFor(grant).also { session = it }
            return calls.run { runBlocking { read(opened) } }
        } catch (e: Exception) {
            throw outcomeOf(grant, session, e)
        } finally {
            session?.let(sessions::persistIfChanged)
        }
    }

    private fun outcomeOf(grant: BunqGrant, session: BunqSession?, failure: Exception): Exception = when {
        failure is BunqApiException && failure.status == UNAUTHORIZED -> rejected(grant)
        failure is BunqApiException && failure.status == FORBIDDEN && session != null && isBunqError(failure.body) ->
            afterForbidden(grant, session, failure)
        failure is IllegalStateException && SETUP_REFUSED.any { failure.message.orEmpty().startsWith(it) } -> rejected(grant)
        failure is BunqUnavailableException -> failure
        failure is BunqApiException -> BunqUnavailableException("Bunq answered ${failure.status}", failure)
        else -> BunqUnavailableException("Bunq could not be read (${failure.javaClass.simpleName})", failure)
    }

    /**
     * A 403 is either a session Bunq has dropped, or the grant not being allowed this read. The SDK already tried one new
     * session for the first, and hides why that failed, so one is made here to tell them apart: if Bunq refuses it too, or
     * accepts it and still said no before, the grant is rejected; if it fails some other way, or the 403 was a dropped session
     * that now works, Bunq is unavailable this time.
     */
    @Suppress("TooGenericExceptionCaught")
    private fun afterForbidden(grant: BunqGrant, session: BunqSession, forbidden: BunqApiException): Exception =
        try {
            sessions.refresh(session)
            if (forbidden.body.contains(DROPPED_SESSION)) {
                BunqUnavailableException("Bunq had dropped the session", forbidden)
            } else {
                rejected(grant)
            }
        } catch (e: Exception) {
            if (e is BunqApiException && e.status == FORBIDDEN && isBunqError(e.body)) rejected(grant) else outcomeOf(grant, null, e)
        }

    private fun rejected(grant: BunqGrant): BunqGrantRejectedException {
        sessions.forget(grant)
        return BunqGrantRejectedException()
    }

    private fun idOf(account: BunqAccountId): Long =
        account.value.toLongOrNull() ?: throw BunqUnavailableException("Not a Bunq account id: ${account.value}")

    private fun paymentOf(listing: PaymentListing): Payment {
        val signed = moneyOf(listing.amount).cents
        return Payment(
            id = PaymentId(checkNotNull(listing.id) { "Bunq listed a payment without an id" }.toString()),
            date = dateOf(listing.created, zone),
            name = PaymentName(listing.counterparty_alias?.display_name.orEmpty()),
            amount = Money(abs(signed)),
            direction = if (signed < 0) PaymentDirection.OUT else PaymentDirection.IN,
        )
    }

    companion object {
        private const val UNAUTHORIZED = 401
        private const val FORBIDDEN = 403
        /** The most Bunq returns in a page. Without a count it returns ten, and a user can have more accounts than that. */
        private const val PAGE_SIZE = 200L
        private const val DROPPED_SESSION = "Insufficient authentication."
        private val SETUP_REFUSED = listOf("Cannot create device server", "Cannot create session server")

        fun create(
            properties: BunqClientProperties,
            callProperties: BunqCallProperties,
            contexts: BunqApiContextRepository,
            contextCipher: TokenCipher,
            currentTeam: CurrentTeamGateway,
            clock: Clock,
        ): RealBunqGatewayAdapter {
            val calls = BunqCalls(callProperties, clock)
            val sessions = BunqSessions(
                apiServerOf(properties.environment),
                properties.serviceName,
                contexts,
                contextCipher,
                currentTeam,
                calls,
            )
            return RealBunqGatewayAdapter(
                properties.clientId,
                properties.clientSecret,
                oauthServerOf(properties.environment),
                sessions,
                calls,
                clock.zone,
            )
        }

        private fun oauthServerOf(environment: BunqEnvironment): OAuthServer = when (environment) {
            BunqEnvironment.SANDBOX -> BUNQ_SANDBOX_OAUTH
            BunqEnvironment.PRODUCTION -> BUNQ_PUBLIC_OAUTH
            BunqEnvironment.NONE, BunqEnvironment.FAKE ->
                throw IllegalArgumentException("There is no Bunq OAuth server for environment $environment")
        }

        private fun apiServerOf(environment: BunqEnvironment): BunqServer = when (environment) {
            BunqEnvironment.SANDBOX -> BUNQ_SANDBOX_SERVER
            BunqEnvironment.PRODUCTION -> BUNQ_PUBLIC_SERVER
            BunqEnvironment.NONE, BunqEnvironment.FAKE ->
                throw IllegalArgumentException("There is no Bunq server for environment $environment")
        }
    }
}
