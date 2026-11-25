package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.application.TokenCipher.Purpose
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.TeamId
import org.slf4j.LoggerFactory

/**
 * The one place that seals a team's Bunq grant for storage and opens it again, bound to the team and to
 * [Purpose.BUNQ_GRANT] (ADR-0042).
 */
class BunqGrantSeal(private val cipher: TokenCipher) {

    fun seal(grant: BunqGrant, teamId: TeamId): EncryptedToken =
        cipher.encrypt(grant.accessToken, TokenCipher.aadOf(teamId, Purpose.BUNQ_GRANT))

    /**
     * Null when the stored grant does not decrypt: a rotated key, a damaged row, a row made for another team, or a row
     * made before grants were bound to their team. Logs the exception's class name only, never its message.
     */
    @Suppress("TooGenericExceptionCaught")
    fun open(stored: EncryptedToken, teamId: TeamId): BunqGrant? =
        try {
            BunqGrant(cipher.decrypt(stored, TokenCipher.aadOf(teamId, Purpose.BUNQ_GRANT)))
        } catch (e: Exception) {
            log.warn("Decrypting the Bunq grant failed: ${e.javaClass.simpleName}")
            null
        }

    private val log = LoggerFactory.getLogger(BunqGrantSeal::class.java)
}
