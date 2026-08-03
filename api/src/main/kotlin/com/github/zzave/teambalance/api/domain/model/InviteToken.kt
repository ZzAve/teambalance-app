package com.github.zzave.teambalance.api.domain.model

/**
 * The plaintext invite token — the secret shown to the admin once and never persisted (only its
 * [TokenHash] is stored). The counterpart to [TokenHash]: this is "the secret the user holds",
 * that is "the digest we persist and match on".
 *
 * [toString] is deliberately masked so the plaintext can never leak into a log line, an exception
 * message, or a debugger's default rendering. [value] is the only way to reach the real token, used
 * at the single Wirespec edge where it is handed back to the caller once.
 */
@JvmInline
value class InviteToken(val value: String) {
    override fun toString(): String = "InviteToken(****)"
}
