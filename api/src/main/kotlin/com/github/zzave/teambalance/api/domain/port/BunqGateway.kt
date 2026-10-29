package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import java.time.LocalDate

/**
 * The platform's OAuth client at Bunq. A call that takes a [BunqGrant] throws
 * [com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException] when Bunq no longer
 * accepts it; any other exception means Bunq did not answer.
 */
interface BunqGateway {
    /** The Bunq page where an Admin approves access; Bunq returns the browser to [redirectUri] carrying [state]. */
    fun authorizationUrl(state: String, redirectUri: String): String

    /** Exchanges the code from the callback for a grant. [redirectUri] must be the one authorization used. */
    fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant

    /** The accounts the grant covers. */
    fun listAccounts(grant: BunqGrant): List<BunqAccount>

    fun fetchBalance(grant: BunqGrant, account: BunqAccountId): Money

    /** Payments dated on or after [since], newest first, at most [limit]. */
    fun fetchPayments(grant: BunqGrant, account: BunqAccountId, since: LocalDate, limit: Int): List<Payment>
}
