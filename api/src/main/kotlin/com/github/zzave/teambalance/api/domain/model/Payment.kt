package com.github.zzave.teambalance.api.domain.model

import java.time.LocalDate

enum class PaymentDirection { IN, OUT }

/**
 * A payment read from Bunq, held in memory only (ADR-0042). [counterpartyIban] and [description] are
 * what attribution reads and are never returned by the API; [memberId] is the outcome of
 * [PaymentAttribution].
 */
data class Payment(
    val id: PaymentId,
    val date: LocalDate,
    val name: PaymentName,
    val amount: Money,
    val direction: PaymentDirection,
    val counterpartyIban: Iban? = null,
    val description: PaymentDescription? = null,
    val memberId: UserId? = null,
    val counterpartyName: PaymentName? = null,
) {
    // Keeps the IBAN, the description and the name out of logs.
    override fun toString(): String = "Payment(date=$date, amount=$amount, direction=$direction)"
}
