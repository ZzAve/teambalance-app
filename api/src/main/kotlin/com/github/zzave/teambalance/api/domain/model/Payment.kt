package com.github.zzave.teambalance.api.domain.model

import java.time.LocalDate

enum class PaymentDirection { IN, OUT }

data class Payment(
    val date: LocalDate,
    val name: PaymentName,
    val amount: Money,
    val direction: PaymentDirection,
)
