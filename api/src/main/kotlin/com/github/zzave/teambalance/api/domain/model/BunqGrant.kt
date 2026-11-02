package com.github.zzave.teambalance.api.domain.model

/**
 * The plaintext OAuth access token Bunq issued to the platform for one team's account. Held only for
 * the length of a call to Bunq; at rest it is an [EncryptedToken]. [toString] is masked so it cannot
 * reach a log line.
 */
@JvmInline
value class BunqGrant(val accessToken: String) {
    override fun toString(): String = "BunqGrant(****)"
}
