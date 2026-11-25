package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.MoneyPoolService
import com.github.zzave.teambalance.api.application.OutOfPocketExpenseService
import com.github.zzave.teambalance.api.domain.model.BeerPrice
import com.github.zzave.teambalance.api.domain.model.BunqMeLink
import com.github.zzave.teambalance.api.domain.model.ExpenseDescription
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool as DomainMoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolOverview
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings as DomainMoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.Payment as DomainPayment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection as DomainPaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DeleteOutOfPocketExpense
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetMoneyPool
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.GetMoneyPoolSettings
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.PutMoneyPoolSettings
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RecordOutOfPocketExpense
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdateOutOfPocketExpense
import com.github.zzave.teambalance.api.interfaces.generated.model.MoneyPool
import com.github.zzave.teambalance.api.interfaces.generated.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.interfaces.generated.model.MoneyPoolState
import com.github.zzave.teambalance.api.interfaces.generated.model.OutOfPocketExpenseRequest
import com.github.zzave.teambalance.api.interfaces.generated.model.Payment
import com.github.zzave.teambalance.api.interfaces.generated.model.PaymentDate
import com.github.zzave.teambalance.api.interfaces.generated.model.PaymentDirection
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
class MoneyPoolController(
    private val moneyPoolService: MoneyPoolService,
    private val outOfPocketExpenseService: OutOfPocketExpenseService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : GetMoneyPool.Handler,
    GetMoneyPoolSettings.Handler,
    PutMoneyPoolSettings.Handler,
    RecordOutOfPocketExpense.Handler,
    UpdateOutOfPocketExpense.Handler,
    DeleteOutOfPocketExpense.Handler {

    // Readable by any member of the current team; the tenant is resolved from the request context.
    override suspend fun getMoneyPool(request: GetMoneyPool.Request): GetMoneyPool.Response<*> =
        GetMoneyPool.Response200(
            moneyPoolService.getMoneyPool(currentTeamGateway.requireCurrentTeamId(), currentUserGateway.requireCurrentUserId()).produce(),
        )

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

    // Who may record or change for whom is enforced in OutOfPocketExpenseService; a refusal surfaces as 403 via the handler.
    override suspend fun recordOutOfPocketExpense(request: RecordOutOfPocketExpense.Request): RecordOutOfPocketExpense.Response<*> =
        RecordOutOfPocketExpense.Response201(
            outOfPocketExpenseService.record(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                details = request.body.consume(),
            ).toPayment().produce(receiptVersion = null),
        )

    // The answer leaves the receipt version out: the client reads it from the pool, which it fetches again.
    override suspend fun updateOutOfPocketExpense(request: UpdateOutOfPocketExpense.Request): UpdateOutOfPocketExpense.Response<*> =
        UpdateOutOfPocketExpense.Response200(
            outOfPocketExpenseService.update(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                paymentId = PaymentId(request.path.paymentId),
                details = request.body.consume(),
            ).toPayment().produce(receiptVersion = null),
        )

    override suspend fun deleteOutOfPocketExpense(request: DeleteOutOfPocketExpense.Request): DeleteOutOfPocketExpense.Response<*> {
        outOfPocketExpenseService.delete(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            paymentId = PaymentId(request.path.paymentId),
        )
        return DeleteOutOfPocketExpense.Response204
    }
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

private fun OutOfPocketExpenseRequest.consume() = OutOfPocketExpenseService.Details(
    paidBy = userId.consumeUserId(),
    amount = Money(amount),
    date = LocalDate.parse(date.value),
    description = ExpenseDescription.parse(description),
)

private fun MoneyPoolOverview.produce(): MoneyPool {
    val connected = pool as? DomainMoneyPool.Connected
    return MoneyPool(
        state = when (pool) {
            DomainMoneyPool.Off -> MoneyPoolState.Off
            DomainMoneyPool.NotConnected -> MoneyPoolState.NotConnected
            DomainMoneyPool.Unavailable -> MoneyPoolState.Unavailable
            DomainMoneyPool.Rejected -> MoneyPoolState.Rejected
            is DomainMoneyPool.Connected -> MoneyPoolState.Connected
        },
        balance = connected?.balance?.cents,
        payments = payments.takeIf { pool != DomainMoneyPool.Off }?.map { it.produce(receiptVersions[it.id]) },
        beerPrice = connected?.beerPrice?.cents,
        beerCount = connected?.beerCount?.value,
        canTopUp = canTopUp,
        // Only a connected pool shows figures that can be older than Bunq's.
        refreshing = refreshing && connected != null,
    )
}

private fun DomainPayment.produce(receiptVersion: String?) = Payment(
    id = id.value,
    date = PaymentDate(date.toString()),
    name = name.value,
    amount = amount.cents,
    direction = when (direction) {
        DomainPaymentDirection.IN -> PaymentDirection.In
        DomainPaymentDirection.OUT -> PaymentDirection.Out
    },
    receiptVersion = receiptVersion,
    memberId = memberId?.produce(),
    counterpartyName = counterpartyName?.value,
    outOfPocket = outOfPocket,
)
