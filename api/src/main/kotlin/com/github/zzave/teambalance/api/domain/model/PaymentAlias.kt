package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidPaymentAliasException
import java.util.Locale
import java.util.UUID

@JvmInline
value class PaymentAliasId(val value: UUID) {
    override fun toString(): String = value.toString()

    companion object {
        fun random() = PaymentAliasId(UUID.randomUUID())
    }
}

/** A name a payer shows up under on Bunq: trimmed, 1..[MAX_LENGTH] characters. Compared without regard to case. */
@JvmInline
value class PaymentAliasName private constructor(val value: String) {
    override fun toString(): String = "PaymentAliasName"

    companion object {
        const val MAX_LENGTH = 100
        private val WHITE_SPACE = Regex("\\s+")

        /** What two names are compared by: capitals and the amount of white space do not matter. */
        fun keyOf(raw: String): String = raw.trim().replace(WHITE_SPACE, " ").lowercase(Locale.ROOT)

        fun parse(raw: String): PaymentAliasName =
            parseOrNull(raw) ?: throw InvalidPaymentAliasException("A payment alias name must be 1..$MAX_LENGTH characters")

        fun parseOrNull(raw: String): PaymentAliasName? =
            raw.trim().replace(WHITE_SPACE, " ").takeIf { it.length in 1..MAX_LENGTH }?.let(::PaymentAliasName)
    }
}

/** How a member appears on Bunq payments (ADR-0045): a name, an IBAN or both. */
data class PaymentAlias(
    val id: PaymentAliasId,
    val userId: UserId,
    val name: PaymentAliasName?,
    val iban: Iban?,
) {
    // Name and IBAN are personal data and must not reach logs (ADR-0045).
    override fun toString(): String = "PaymentAlias(id=$id)"

    init {
        if (name == null && iban == null) throw InvalidPaymentAliasException("A payment alias needs a name, an IBAN or both")
    }
}
