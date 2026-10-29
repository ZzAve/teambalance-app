package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.MoneyPoolService
import com.github.zzave.teambalance.api.domain.model.BeerPrice
import com.github.zzave.teambalance.api.domain.model.BunqMeLink
import com.github.zzave.teambalance.api.domain.model.MoneyPool as DomainMoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolOverview
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings as DomainMoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.Payment as DomainPayment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection as DomainPaymentDirection
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetMoneyPool
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetMoneyPoolSettings
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.PutMoneyPoolSettings
import com.github.zzave.teambalance.api.interfaces.generated.model.MoneyPool
import com.github.zzave.teambalance.api.interfaces.generated.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.interfaces.generated.model.MoneyPoolState
import com.github.zzave.teambalance.api.interfaces.generated.model.Payment
import com.github.zzave.teambalance.api.interfaces.generated.model.PaymentDate
import com.github.zzave.teambalance.api.interfaces.generated.model.PaymentDirection
import org.springframework.web.bind.annotation.RestController

@RestController
class MoneyPoolController(
    private val moneyPoolService: MoneyPoolService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : GetMoneyPool.Handler,
    GetMoneyPoolSettings.Handler,
    PutMoneyPoolSettings.Handler {

    // Readable by any member of the current team; the tenant is resolved from the request context.
    override suspend fun getMoneyPool(request: GetMoneyPool.Request): GetMoneyPool.Response<*> =
        GetMoneyPool.Response200(moneyPoolService.getMoneyPool().produce())

    // Admin-only (enforced in MoneyPoolService); a non-admin surfaces as 403 via the handler.
    override suspend fun getMoneyPoolSettings(request: GetMoneyPoolSettings.Request): GetMoneyPoolSettings.Response<*> =
        GetMoneyPoolSettings.Response200(
            moneyPoolService.getSettings(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
            ).produce(),
        )

    override suspend fun putMoneyPoolSettings(request: PutMoneyPoolSettings.Request): PutMoneyPoolSettings.Response<*> =
        PutMoneyPoolSettings.Response200(
            moneyPoolService.updateSettings(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                settings = request.body.consume(),
            ).produce(),
        )
}

private fun MoneyPoolSettings.consume() = DomainMoneyPoolSettings(
    enabled = enabled,
    beerPrice = beerPrice?.let { BeerPrice(it) },
    bunqMeLink = bunqMeLink?.let { BunqMeLink.parse(it) },
)

private fun DomainMoneyPoolSettings.produce() = MoneyPoolSettings(
    enabled = enabled,
    beerPrice = beerPrice?.cents,
    bunqMeLink = bunqMeLink?.value,
)

private fun withoutFigures(state: MoneyPoolState, canTopUp: Boolean) =
    MoneyPool(state, balance = null, payments = null, beerPrice = null, beerCount = null, canTopUp = canTopUp)

private fun MoneyPoolOverview.produce() = pool.produce(canTopUp)

private fun DomainMoneyPool.produce(canTopUp: Boolean) = when (this) {
    DomainMoneyPool.Off -> withoutFigures(MoneyPoolState.Off, canTopUp)
    DomainMoneyPool.NotConnected -> withoutFigures(MoneyPoolState.NotConnected, canTopUp)
    DomainMoneyPool.Unavailable -> withoutFigures(MoneyPoolState.Unavailable, canTopUp)
    DomainMoneyPool.Rejected -> withoutFigures(MoneyPoolState.Rejected, canTopUp)
    is DomainMoneyPool.Connected -> MoneyPool(
        state = MoneyPoolState.Connected,
        balance = balance.cents,
        payments = payments.map { it.produce() },
        beerPrice = beerPrice?.cents,
        beerCount = beerCount?.value,
        canTopUp = canTopUp,
    )
}

private fun DomainPayment.produce() = Payment(
    date = PaymentDate(date.toString()),
    name = name.value,
    amount = amount.cents,
    direction = when (direction) {
        DomainPaymentDirection.IN -> PaymentDirection.In
        DomainPaymentDirection.OUT -> PaymentDirection.Out
    },
)
