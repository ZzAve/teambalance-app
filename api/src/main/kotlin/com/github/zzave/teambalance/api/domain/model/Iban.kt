package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidIbanException
import java.util.Locale

/**
 * An IBAN in its normal form: capitals, no spaces. [parse] checks the ISO 13616 shape and the mod-97
 * check digits; there is no list of countries, so a country Bunq does not use is accepted.
 */
@JvmInline
value class Iban private constructor(val value: String) {
    // Not the value: an IBAN is personal data and must not reach logs (ADR-0046).
    override fun toString(): String = "Iban"

    /**
     * What any response may show of an IBAN (ADR-0046): country and check digits and the last four
     * characters, the rest as bullets, in groups of four: `NL02 •••• •••• ••67 89`.
     */
    fun masked(): String =
        (value.take(VISIBLE_START) + MASK.repeat(value.length - VISIBLE_START - VISIBLE_END) + value.takeLast(VISIBLE_END))
            .chunked(GROUP).joinToString(" ")

    companion object {
        private val SHAPE = Regex("[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}")
        private const val MODULUS = 97
        private const val MASK = "\u2022"
        private const val VISIBLE_START = 4
        private const val VISIBLE_END = 4
        private const val GROUP = 4
        private const val RADIX = 36
        private const val COUNTRY_AND_CHECK_DIGITS = 4
        private const val DIGIT_SHIFT = 10
        private const val LETTER_SHIFT = 100

        fun parse(raw: String): Iban = parseOrNull(raw) ?: throw InvalidIbanException()

        fun parseOrNull(raw: String): Iban? {
            val normal = raw.filterNot(Char::isWhitespace).uppercase(Locale.ROOT)
            return if (SHAPE.matches(normal) && hasValidChecksum(normal)) Iban(normal) else null
        }

        // The first four characters move to the end and letters become 10..35; the number must be 1 mod 97.
        private fun hasValidChecksum(iban: String): Boolean =
            (iban.drop(COUNTRY_AND_CHECK_DIGITS) + iban.take(COUNTRY_AND_CHECK_DIGITS))
                .fold(0) { rest, c -> (rest * (if (c.isDigit()) DIGIT_SHIFT else LETTER_SHIFT) + Character.digit(c, RADIX)) % MODULUS } == 1
    }
}
