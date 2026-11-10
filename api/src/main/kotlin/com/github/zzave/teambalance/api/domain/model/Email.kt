package com.github.zzave.teambalance.api.domain.model

import java.util.Locale

/**
 * An email address, trimmed and lowercased as a whole, so the differently-cased forms of one address
 * are one user. It is the join key between a magic-link token and the user it authenticates
 * (ADR-0011), which is why `users.email` holds only this form.
 *
 * Conversion happens only at the edges, as for [EventId] — the persistence adapters and the Wirespec mapper.
 *
 * The check is shape only, one `@` with text on both sides; whether the address receives mail is
 * what the magic link proves.
 */
@JvmInline
value class Email private constructor(val value: String) {
    override fun toString(): String = value

    companion object {
        operator fun invoke(raw: String): Email {
            val normalised = raw.trim().lowercase(Locale.ROOT)
            require(normalised.isNotEmpty()) { "Email must not be blank" }
            val parts = normalised.split('@')
            require(parts.size == 2 && parts.none(String::isEmpty)) { "Email must have the form name@domain" }
            return Email(normalised)
        }
    }
}
