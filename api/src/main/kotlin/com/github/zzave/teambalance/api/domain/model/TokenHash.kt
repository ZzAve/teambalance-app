package com.github.zzave.teambalance.api.domain.model

/**
 * The hex-encoded SHA-256 of a magic-link or invite token — never the plaintext, which is shown to
 * its recipient once and never stored.
 *
 * A semantic string like [Email], and the one where confusing it with the plaintext would be a
 * security bug rather than a typo: the type is what now separates "the secret the user holds" from
 * "the digest we persist and match on".
 *
 * Hashing itself stays in the service that owns the salt; this type carries the result.
 */
@JvmInline
value class TokenHash(val value: String) {
    override fun toString(): String = value
}
