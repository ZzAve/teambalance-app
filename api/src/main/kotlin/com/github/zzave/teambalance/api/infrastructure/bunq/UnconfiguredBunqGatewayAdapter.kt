package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import java.time.LocalDate

/** Production placeholder until the real Bunq adapter exists: every call fails, so the pool reads as unavailable. */
@Component
@Profile("prod")
class UnconfiguredBunqGatewayAdapter : BunqGateway {

    override fun authorizationUrl(state: String, redirectUri: String): String = unavailable()

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant = unavailable()

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> = unavailable()

    override fun fetchBalance(grant: BunqGrant, account: BunqAccountId): Money = unavailable()

    override fun fetchPayments(grant: BunqGrant, account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> = unavailable()

    private fun unavailable(): Nothing = error("Bunq is not configured")
}
