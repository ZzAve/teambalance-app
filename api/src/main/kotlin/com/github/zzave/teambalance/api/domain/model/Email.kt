package com.github.zzave.teambalance.api.domain.model

/**
 * An email address. Unlike the identifiers, this is a *semantic string*: it is the join key between
 * a magic-link token and the user it authenticates (and, per ADR-0011, between a Google identity and
 * the same user), so a value that merely "is a String" says nothing about whether it is the right
 * one.
 *
 * Conversion happens only at the edges, as for [EventId] — the JPA mapper and the Wirespec mapper.
 *
 * Deliberately no validation or normalisation (case folding, trimming) here: this refactor must not
 * change observable behaviour, and today two differently-cased addresses are two different users.
 * Making them one is a behavioural decision that belongs with the Google Sign-In join key, not with
 * an architecture refactor — but the type is now the one place to put it.
 */
@JvmInline
value class Email(val value: String) {
    override fun toString(): String = value
}
