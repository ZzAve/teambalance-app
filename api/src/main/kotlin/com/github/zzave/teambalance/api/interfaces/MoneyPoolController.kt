package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.MoneyPoolService
import com.github.zzave.teambalance.api.domain.model.MoneyPool as DomainMoneyPool
import com.github.zzave.teambalance.api.domain.model.Payment as DomainPayment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection as DomainPaymentDirection
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetMoneyPool
import com.github.zzave.teambalance.api.interfaces.generated.model.MoneyPool
import com.github.zzave.teambalance.api.interfaces.generated.model.MoneyPoolState
import com.github.zzave.teambalance.api.interfaces.generated.model.Payment
import com.github.zzave.teambalance.api.interfaces.generated.model.PaymentDirection
import org.springframework.web.bind.annotation.RestController

@RestController
class MoneyPoolController(
    private val moneyPoolService: MoneyPoolService,
) : GetMoneyPool.Handler {

    // Readable by any member of the current team; the tenant is resolved from the request context.
    override suspend fun getMoneyPool(request: GetMoneyPool.Request): GetMoneyPool.Response<*> =
        GetMoneyPool.Response200(moneyPoolService.getMoneyPool().produce())
}

private fun DomainMoneyPool.produce() = when (this) {
    DomainMoneyPool.Off -> MoneyPool(MoneyPoolState.Off, balance = null, payments = null)
    DomainMoneyPool.NotConnected -> MoneyPool(MoneyPoolState.NotConnected, balance = null, payments = null)
    DomainMoneyPool.Unavailable -> MoneyPool(MoneyPoolState.Unavailable, balance = null, payments = null)
    is DomainMoneyPool.Connected -> MoneyPool(
        state = MoneyPoolState.Connected,
        balance = balance.cents,
        payments = payments.map { it.produce() },
    )
}

private fun DomainPayment.produce() = Payment(
    date = date.toString(),
    name = name.value,
    amount = amount.cents,
    direction = when (direction) {
        DomainPaymentDirection.IN -> PaymentDirection.In
        DomainPaymentDirection.OUT -> PaymentDirection.Out
    },
)
