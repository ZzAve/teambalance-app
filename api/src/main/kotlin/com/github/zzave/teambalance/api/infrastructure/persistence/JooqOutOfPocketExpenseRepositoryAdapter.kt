package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.ExpenseDescription
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpense
import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpenseId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.OutOfPocketExpenseRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.OUT_OF_POCKET_EXPENSES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.tables.records.OutOfPocketExpensesRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
class JooqOutOfPocketExpenseRepositoryAdapter(
    private val dsl: DSLContext,
) : OutOfPocketExpenseRepository {

    override fun findSince(since: LocalDate): List<OutOfPocketExpense> =
        dsl.selectFrom(OUT_OF_POCKET_EXPENSES)
            .where(OUT_OF_POCKET_EXPENSES.PAID_ON.ge(since))
            .orderBy(OUT_OF_POCKET_EXPENSES.CREATED_AT.desc())
            .fetch { it.toDomain() }

    override fun find(id: OutOfPocketExpenseId): OutOfPocketExpense? =
        dsl.selectFrom(OUT_OF_POCKET_EXPENSES)
            .where(OUT_OF_POCKET_EXPENSES.ID.eq(id.value))
            .fetchOne { it.toDomain() }

    override fun insert(expense: OutOfPocketExpense) {
        dsl.insertInto(OUT_OF_POCKET_EXPENSES)
            .set(OUT_OF_POCKET_EXPENSES.ID, expense.id.value)
            .set(OUT_OF_POCKET_EXPENSES.PAID_BY, expense.paidBy.value)
            .set(OUT_OF_POCKET_EXPENSES.AMOUNT_CENTS, expense.amount.cents)
            .set(OUT_OF_POCKET_EXPENSES.PAID_ON, expense.date)
            .set(OUT_OF_POCKET_EXPENSES.DESCRIPTION, expense.description.value)
            .execute()
    }

    override fun update(expense: OutOfPocketExpense) {
        dsl.update(OUT_OF_POCKET_EXPENSES)
            .set(OUT_OF_POCKET_EXPENSES.PAID_BY, expense.paidBy.value)
            .set(OUT_OF_POCKET_EXPENSES.AMOUNT_CENTS, expense.amount.cents)
            .set(OUT_OF_POCKET_EXPENSES.PAID_ON, expense.date)
            .set(OUT_OF_POCKET_EXPENSES.DESCRIPTION, expense.description.value)
            .where(OUT_OF_POCKET_EXPENSES.ID.eq(expense.id.value))
            .execute()
    }

    override fun delete(id: OutOfPocketExpenseId) {
        dsl.deleteFrom(OUT_OF_POCKET_EXPENSES).where(OUT_OF_POCKET_EXPENSES.ID.eq(id.value)).execute()
    }

    private fun OutOfPocketExpensesRecord.toDomain() = OutOfPocketExpense(
        id = OutOfPocketExpenseId(id),
        paidBy = UserId(paidBy),
        amount = Money(amountCents),
        date = paidOn,
        description = ExpenseDescription.parse(description),
    )
}
