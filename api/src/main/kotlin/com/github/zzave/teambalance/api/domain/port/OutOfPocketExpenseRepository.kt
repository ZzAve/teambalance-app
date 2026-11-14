package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpense
import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpenseId
import java.time.LocalDate

/** Out-of-pocket expenses of the routed tenant schema (ADR-0048), so no method takes a team id. */
interface OutOfPocketExpenseRepository {
    /** Those dated [since] or later, the one recorded last first. */
    fun findSince(since: LocalDate): List<OutOfPocketExpense>
    fun find(id: OutOfPocketExpenseId): OutOfPocketExpense?
    fun insert(expense: OutOfPocketExpense)
    fun delete(id: OutOfPocketExpenseId)
}
