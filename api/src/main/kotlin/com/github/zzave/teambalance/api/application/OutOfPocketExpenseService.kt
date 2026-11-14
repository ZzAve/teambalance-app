package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.ExpenseNotFoundException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.MoneyPoolNotReadableException
import com.github.zzave.teambalance.api.domain.model.ExpenseDescription
import com.github.zzave.teambalance.api.domain.model.Money
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
 * Out-of-pocket expenses (ADR-0048). A member records, changes and deletes their own; an Admin does so for
 * any member. [MoneyPoolService.getMoneyPool] lists them among the payments. They need no Bunq Connection:
 * only a pool that is switched off refuses them.
 */
class OutOfPocketExpenseService(
    private val expenseRepository: OutOfPocketExpenseRepository,
    private val receiptRepository: ReceiptRepository,
    private val moneyPoolService: MoneyPoolService,
    private val authorizationService: AuthorizationService,
    private val teamMemberRepository: TeamMemberRepository,
    private val clock: Clock,
) {
    /** What a member enters about an expense. [date] must be inside the history the pool shows, so the expense is visible afterwards. */
    data class Details(val paidBy: UserId, val amount: Money, val date: LocalDate, val description: ExpenseDescription)

    fun record(callerId: UserId, teamId: TeamId, details: Details): OutOfPocketExpense {
        requireMayManage(callerId, teamId, details.paidBy)
        requireMemberOfTeam(teamId, details.paidBy)
        return expenseOf(OutOfPocketExpenseId.random(), callerId, teamId, details).also(expenseRepository::insert)
    }

    /**
     * The caller must be allowed to manage the expense as it is stored, and as it becomes: a member cannot
     * hand their expense to someone else. A payer who left the team stays when [Details.paidBy] is unchanged.
     */
    fun update(callerId: UserId, teamId: TeamId, paymentId: PaymentId, details: Details): OutOfPocketExpense {
        val stored = manageable(callerId, teamId, paymentId)
        if (details.paidBy != stored.paidBy) {
            requireMayManage(callerId, teamId, details.paidBy)
            requireMemberOfTeam(teamId, details.paidBy)
        }
        return expenseOf(stored.id, callerId, teamId, details).also(expenseRepository::update)
    }

    /** Removes the receipt with it. */
    fun delete(callerId: UserId, teamId: TeamId, paymentId: PaymentId) {
        val expense = manageable(callerId, teamId, paymentId)
        expenseRepository.delete(expense.id)
        receiptRepository.delete(paymentId)
    }

    /** The stored expense [paymentId], which the caller may change. An id that is a Bunq payment's is not found. */
    private fun manageable(callerId: UserId, teamId: TeamId, paymentId: PaymentId): OutOfPocketExpense {
        authorizationService.requireMember(callerId, teamId)
        val expense = OutOfPocketExpenseId.of(paymentId)?.let(expenseRepository::find) ?: throw ExpenseNotFoundException(paymentId)
        requireMayManage(callerId, teamId, expense.paidBy)
        return expense
    }

    private fun expenseOf(id: OutOfPocketExpenseId, callerId: UserId, teamId: TeamId, details: Details): OutOfPocketExpense {
        val historyStart = moneyPoolService.getMoneyPool(teamId, callerId).historyStart ?: throw MoneyPoolNotReadableException()
        // IllegalArgumentException is a 400 at the edge.
        require(!details.date.isAfter(LocalDate.now(clock))) { "The date cannot be in the future" }
        require(!details.date.isBefore(historyStart)) { "The date cannot be before $historyStart" }
        return OutOfPocketExpense(id, details.paidBy, details.amount, details.date, details.description)
    }

    private fun requireMayManage(callerId: UserId, teamId: TeamId, paidBy: UserId) {
        if (callerId == paidBy) {
            authorizationService.requireMember(callerId, teamId)
        } else {
            authorizationService.requireAdmin(callerId, teamId)
        }
    }

    // A Platform Admin acting as the team has no team_members row, so an expense cannot be theirs.
    private fun requireMemberOfTeam(teamId: TeamId, paidBy: UserId) {
        teamMemberRepository.findRole(teamId, paidBy) ?: throw MemberNotFoundException(paidBy)
    }
}
