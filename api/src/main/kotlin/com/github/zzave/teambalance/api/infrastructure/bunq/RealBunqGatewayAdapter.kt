package com.github.zzave.teambalance.api.infrastructure.bunq

import com.bunq.sdk.BUNQ_PUBLIC_OAUTH
import com.bunq.sdk.BUNQ_SANDBOX_OAUTH
import com.bunq.sdk.OAuthServer
import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import java.time.LocalDate
import com.bunq.sdk.authorizeUrl as sdkAuthorizeUrl
import com.bunq.sdk.exchangeCode as sdkExchangeCode

/**
 * The platform's OAuth client at the real Bunq (sandbox or production, by `teambalance.bunq.environment`),
 * built on the bunq SDK.
 *
 * Only the OAuth half exists so far: [authorizationUrl] and [exchangeCode]. [listAccounts], [fetchBalance]
 * and [fetchPayments] are not built yet and throw [UnsupportedOperationException], which the money pool
 * reads as Bunq being unavailable. A failed [exchangeCode] is a [com.bunq.sdk.BunqApiException], and the
 * callback turns any exception into an error redirect. The SDK sets no timeout on the token request.
 *
 * The OAuth servers are a constructor parameter so tests can point the token exchange at a local server.
 */
class RealBunqGatewayAdapter internal constructor(
    private val clientId: String,
    private val clientSecret: String,
    private val oauthServer: OAuthServer,
) : BunqGateway {

    constructor(properties: BunqClientProperties) :
        this(properties.clientId, properties.clientSecret, oauthServerOf(properties.environment))

    override fun authorizationUrl(state: String, redirectUri: String): String =
        sdkAuthorizeUrl(oauthServer, clientId, redirectUri, state)

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant =
        BunqGrant(sdkExchangeCode(oauthServer, clientId, clientSecret, redirectUri, code.value))

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> = notImplementedYet()

    override fun fetchBalance(grant: BunqGrant, account: BunqAccountId): Money = notImplementedYet()

    override fun fetchPayments(grant: BunqGrant, account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> =
        notImplementedYet()

    private fun notImplementedYet(): Nothing = throw UnsupportedOperationException("Reading from Bunq is not implemented yet")

    private companion object {
        fun oauthServerOf(environment: BunqEnvironment): OAuthServer = when (environment) {
            BunqEnvironment.SANDBOX -> BUNQ_SANDBOX_OAUTH
            BunqEnvironment.PRODUCTION -> BUNQ_PUBLIC_OAUTH
            BunqEnvironment.NONE -> throw IllegalArgumentException("There is no Bunq OAuth server for environment $environment")
        }
    }
}
