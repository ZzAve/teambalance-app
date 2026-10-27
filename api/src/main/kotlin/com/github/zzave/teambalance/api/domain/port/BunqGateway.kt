package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import java.time.LocalDate

interface BunqGateway {
    /** The Bunq page where an Admin approves access; Bunq returns the browser to [redirectUri] carrying [state]. */
    fun authorizationUrl(state: String, redirectUri: String): String

    /** Exchanges the code from the callback for a grant. [redirectUri] must be the one authorization used. */
    fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant

    /** The accounts the grant covers. */
    fun listAccounts(grant: BunqGrant): List<BunqAccount>

    fun fetchBalance(account: BunqAccountId): Money

    /** Payments dated on or after [since], newest first, at most [limit]. */
    fun fetchPayments(account: BunqAccountId, since: LocalDate, limit: Int): List<Payment>
}
