package com.github.zzave.teambalance.api.domain.model

/**
 * An invite token under AES-256-GCM — the form in which it is persisted so an admin can be shown
 * their team's current link again (ADR-0025).
 *
 * The third member of the token trio, and the one that makes the other two make sense: [InviteToken]
 * is the secret the admin holds, [TokenHash] is the irreversible digest the accept path matches on,
 * and this is the recoverable copy the admin-only read path decrypts. Deliberately *not* used for
 * lookup — the hash keeps that job, so a joiner presenting a token never causes a decryption.
 *
 * [toString] is masked for the same reason [InviteToken]'s is: this is one key away from plaintext,
 * so it must not land in a log line or a debugger's default rendering either.
 */
@JvmInline
value class EncryptedToken(val value: String) {
    override fun toString(): String = "EncryptedToken(****)"
}
