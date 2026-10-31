package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.infrastructure.bunq.FakeBunqGatewayAdapter
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import java.time.LocalDate
import java.util.concurrent.atomic.AtomicInteger

/**
 * The fake gateway until [failing] or [rejecting] is set, then every balance and payments call throws.
 * [reads] counts the balance calls, one per read of a money pool from Bunq.
 */
class SwitchableBunqGateway(private val delegate: BunqGateway) : BunqGateway {
    @Volatile
    var failing = false

    @Volatile
    var rejecting = false

    private val balanceCalls = AtomicInteger()
    val reads get() = balanceCalls.get()

    override fun authorizationUrl(state: String, redirectUri: String): String = delegate.authorizationUrl(state, redirectUri)

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant =
        delegate.exchangeCode(code, redirectUri)

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> = delegate.listAccounts(grant)

    override fun fetchBalance(grant: BunqGrant, account: BunqAccountId): Money {
        balanceCalls.incrementAndGet()
        return guarded { delegate.fetchBalance(grant, account) }
    }

    override fun fetchPayments(grant: BunqGrant, account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> =
        guarded { delegate.fetchPayments(grant, account, since, limit) }

    private fun <T> guarded(call: () -> T): T = when {
        rejecting -> throw BunqGrantRejectedException()
        failing -> error("injected Bunq failure")
        else -> call()
    }
}

/** Wraps the context's own fake, so the fake approval page and the gateway still share their codes and grants. */
@TestConfiguration
class SwitchableBunqGatewayConfig {
    @Bean
    @Primary
    fun switchableBunqGateway(fake: FakeBunqGatewayAdapter) = SwitchableBunqGateway(fake)
}
