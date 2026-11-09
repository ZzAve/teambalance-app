package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.MoneyPoolNotReadableException
import com.github.zzave.teambalance.api.domain.exception.MoneyPoolUnavailableException
import com.github.zzave.teambalance.api.domain.exception.PaymentNotClaimableException
import com.github.zzave.teambalance.api.domain.exception.PaymentNotFoundException
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentAlias
import com.github.zzave.teambalance.api.domain.model.PaymentClaim
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId

/**
 * "That's mine" (ADR-0046): records a payment alias from the counterparty of a payment in the money pool.
 * The payment is found by its id in the pool as the money pool service reports it, so the IBAN is read
 * on the server and never reaches the client. Who may add an alias for whom is decided by
 * [PaymentAliasService.requireMayManage]: a member for themselves, an Admin for any member.
 */
class PaymentClaimService(
    private val moneyPoolService: MoneyPoolService,
    private val paymentAliasService: PaymentAliasService,
) {
    fun claim(
        callerId: UserId,
        teamId: TeamId,
        paymentId: PaymentId,
        targetId: UserId,
        useName: Boolean?,
        useIban: Boolean?,
    ): PaymentAlias {
        paymentAliasService.requireMayManage(callerId, teamId, targetId)
        // An unattributed payment is shown unchanged to every viewer, so the caller's view is enough.
        val payment = paymentsOf(callerId, teamId).firstOrNull { it.id == paymentId } ?: throw PaymentNotFoundException(paymentId)
        if (payment.direction != PaymentDirection.IN || payment.memberId != null) throw PaymentNotClaimableException()
        return paymentAliasService.add(PaymentClaim.aliasOf(targetId, payment, useName, useIban))
    }

    private fun paymentsOf(callerId: UserId, teamId: TeamId): List<Payment> =
        when (val pool = moneyPoolService.getMoneyPool(teamId, callerId).pool) {
            is MoneyPool.Connected -> pool.payments
            MoneyPool.Unavailable -> throw MoneyPoolUnavailableException()
            MoneyPool.Off, MoneyPool.NotConnected, MoneyPool.Rejected -> throw MoneyPoolNotReadableException()
        }
}
