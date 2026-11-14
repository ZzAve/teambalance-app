package com.github.zzave.teambalance.api.domain.model

import java.time.LocalDate
import java.util.UUID

/**
 * An expense a member paid for the team with their own money (ADR-0048). The app stores it; Bunq never
 * sees it. The money pool shows it as one [Payment] that is an expense and a contribution of [paidBy]
 * of the same amount, so the balance does not change.
 */
data class OutOfPocketExpense(
    val id: OutOfPocketExpenseId,
    val paidBy: UserId,
    val amount: Money,
    val date: LocalDate,
    val description: ExpenseDescription,
) {
    init {
        require(amount.cents in 1..MAX_CENTS) { "The amount must be between 1 and $MAX_CENTS cents" }
    }

    fun toPayment() = Payment(
        id = id.paymentId,
        date = date,
        name = PaymentName(description.value),
        amount = amount,
        direction = PaymentDirection.OUT,
        memberId = paidBy,
        outOfPocket = true,
    )

    companion object {
        const val MAX_CENTS = 1_000_000L
    }
}

/** Shares the id space of [PaymentId] under a prefix no Bunq id has, so a [Receipt] is stored under it like under any payment. */
@JvmInline
value class OutOfPocketExpenseId(val value: UUID) {
    val paymentId: PaymentId get() = PaymentId(PREFIX + value)

    override fun toString(): String = value.toString()

    companion object {
        private const val PREFIX = "oop-"

        fun random() = OutOfPocketExpenseId(UUID.randomUUID())

        /** Null when [paymentId] is not the id of an out-of-pocket expense. */
        fun of(paymentId: PaymentId): OutOfPocketExpenseId? =
            paymentId.value.takeIf { it.startsWith(PREFIX) }
                ?.let { runCatching { UUID.fromString(it.removePrefix(PREFIX)) }.getOrNull() }
                ?.let(::OutOfPocketExpenseId)
    }
}

/** What the money was spent on: trimmed, 1..[MAX_LENGTH] characters. */
@JvmInline
value class ExpenseDescription private constructor(val value: String) {
    override fun toString(): String = "ExpenseDescription"

    companion object {
        const val MAX_LENGTH = 100

        fun parse(raw: String): ExpenseDescription {
            val trimmed = raw.trim()
            require(trimmed.length in 1..MAX_LENGTH) { "The description must be 1..$MAX_LENGTH characters" }
            return ExpenseDescription(trimmed)
        }
    }
}
