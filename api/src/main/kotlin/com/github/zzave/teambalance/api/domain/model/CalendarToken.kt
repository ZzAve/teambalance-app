package com.github.zzave.teambalance.api.domain.model

/**
 * The plaintext calendar-link token — the secret in a member's webcal URL, and the only thing standing
 * between a stranger and that member's view of their team's schedule. The exact counterpart of
 * [InviteToken]: this is "the secret the holder presents", [TokenHash] is "the digest the feed matches
 * on", [EncryptedToken] is "the recoverable copy the member is shown again".
 *
 * [toString] is masked for the same reason [InviteToken]'s is — a token that lands in a log line is a
 * token anyone with log access can subscribe to.
 */
@JvmInline
value class CalendarToken(val value: String) {
    override fun toString(): String = "CalendarToken(****)"
}
