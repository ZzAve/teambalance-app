package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.ExpenseNotFoundException
import com.github.zzave.teambalance.api.domain.exception.ReceiptNotFoundException
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.Receipt
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.ReceiptRepository

/**
 * Receipts on the money pool's expenses (ADR-0044). Any member reads, uploads, replaces or removes one.
 * Which expenses have a receipt reaches members through [MoneyPoolService.getMoneyPool].
 */
class ReceiptService(
    private val receiptRepository: ReceiptRepository,
    private val moneyPoolService: MoneyPoolService,
    private val authorizationService: AuthorizationService,
) {
    fun receipt(callerId: UserId, teamId: TeamId, paymentId: PaymentId): Receipt {
        authorizationService.requireMember(callerId, teamId)
        return receiptRepository.find(paymentId) ?: throw ReceiptNotFoundException(paymentId)
    }

    /** Only for an expense the pool shows now, so receipts cannot be stored under made-up ids. */
    fun uploadReceipt(callerId: UserId, teamId: TeamId, paymentId: PaymentId, bytes: ByteArray) {
        authorizationService.requireMember(callerId, teamId)
        val receipt = Receipt(bytes)
        val pool = moneyPoolService.getMoneyPool(teamId).pool
        val isExpense = pool is MoneyPool.Connected && pool.payments.any { it.id == paymentId && it.direction == PaymentDirection.OUT }
        if (!isExpense) throw ExpenseNotFoundException(paymentId)
        receiptRepository.save(paymentId, receipt)
    }

    fun removeReceipt(callerId: UserId, teamId: TeamId, paymentId: PaymentId) {
        authorizationService.requireMember(callerId, teamId)
        receiptRepository.delete(paymentId)
    }
}
