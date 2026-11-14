package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.ExpenseNotFoundException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.MoneyPoolNotReadableException
import com.github.zzave.teambalance.api.domain.exception.MoneyPoolUnavailableException
import com.github.zzave.teambalance.api.domain.model.ExpenseDescription
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpense
import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpenseId
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.OutOfPocketExpenseRepository
import com.github.zzave.teambalance.api.domain.port.ReceiptRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import java.time.Clock
import java.time.LocalDate

/**
 * Out-of-pocket expenses (ADR-0048). A member records and deletes their own; an Admin does so for any
 * member. [MoneyPoolService.getMoneyPool] shows them among the payments.
 */
class OutOfPocketExpenseService(
    private val expenseRepository: OutOfPocketExpenseRepository,
    private val receiptRepository: ReceiptRepository,
    private val moneyPoolService: MoneyPoolService,
    private val authorizationService: AuthorizationService,
    private val teamMemberRepository: TeamMemberRepository,
    private val clock: Clock,
) {
    /**
     * Only while the pool is connected, and only for a date inside the history the pool shows, so a
     * recorded expense is always visible afterwards.
     */
    @Suppress("LongParameterList")
    fun record(
        callerId: UserId,
        teamId: TeamId,
        paidBy: UserId,
        amount: Money,
        date: LocalDate,
        description: String,
    ): OutOfPocketExpense {
        requireMayManage(callerId, teamId, paidBy)
        // The payer must have a team_members row, which a Platform Admin acting as the team does not.
        teamMemberRepository.findRole(teamId, paidBy) ?: throw MemberNotFoundException(paidBy)
        val historyStart = historyStartOfPool(callerId, teamId)
        // IllegalArgumentException is a 400 at the edge.
        require(!date.isAfter(LocalDate.now(clock))) { "The date cannot be in the future" }
        require(!date.isBefore(historyStart)) { "The date cannot be before $historyStart" }
        return OutOfPocketExpense(OutOfPocketExpenseId.random(), paidBy, amount, date, ExpenseDescription.parse(description))
            .also(expenseRepository::insert)
    }

    /** Removes the receipt with it. An id that is a Bunq payment's is not found. */
    fun delete(callerId: UserId, teamId: TeamId, paymentId: PaymentId) {
        authorizationService.requireMember(callerId, teamId)
        val expense = OutOfPocketExpenseId.of(paymentId)?.let(expenseRepository::find) ?: throw ExpenseNotFoundException(paymentId)
        requireMayManage(callerId, teamId, expense.paidBy)
        expenseRepository.delete(expense.id)
        receiptRepository.delete(paymentId)
    }

    private fun historyStartOfPool(callerId: UserId, teamId: TeamId): LocalDate =
        when (val pool = moneyPoolService.getMoneyPool(teamId, callerId).pool) {
            is MoneyPool.Connected -> pool.historyStart
            MoneyPool.Unavailable -> throw MoneyPoolUnavailableException()
            MoneyPool.Off, MoneyPool.NotConnected, MoneyPool.Rejected -> throw MoneyPoolNotReadableException()
        }

    private fun requireMayManage(callerId: UserId, teamId: TeamId, paidBy: UserId) {
        if (callerId == paidBy) {
            authorizationService.requireMember(callerId, teamId)
        } else {
            authorizationService.requireAdmin(callerId, teamId)
        }
    }
}
