package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.InviteToken
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

/**
 * Reversible storage for the invite token (ADR-0025). Sits beside the salted hash rather than
 * replacing it: the hash still resolves a presented token on the accept path, and this is read on
 * exactly one path — the admin asking to see their team's current link.
 *
 * AES-256-GCM with a fresh 12-byte IV per encryption, stored as base64(iv || ciphertext || tag). GCM
 * because the ciphertext is authenticated: a tampered row fails to decrypt rather than yielding a
 * token that would then be handed to an admin as if it were real.
 *
 * The key is an app-wide secret supplied by the environment (INVITATION_TOKEN_ENCRYPTION_KEY), a
 * sibling of the existing token salt; this class takes it already-decoded and never learns where it
 * came from.
 */
class InviteTokenCipher(private val key: SecretKeySpec) {

    companion object {
        private const val IV_LENGTH = 12
        private const val TAG_BIT_LENGTH = 128
        private const val KEY_BYTE_LENGTH = 32
        private val secureRandom = SecureRandom()

        /**
         * Reads a base64-encoded 256-bit key. Rejects anything else loudly at startup: a key of the
         * wrong length is a deployment mistake that must not surface later as a runtime failure on
         * an admin's first click.
         */
        fun fromBase64Key(encodedKey: String): InviteTokenCipher {
            val keyBytes = runCatching { Base64.getDecoder().decode(encodedKey.trim()) }
                .getOrElse { error("teambalance.invitation.token-encryption-key must be valid base64") }
            require(keyBytes.size == KEY_BYTE_LENGTH) {
                "teambalance.invitation.token-encryption-key must decode to $KEY_BYTE_LENGTH bytes, " +
                    "was ${keyBytes.size}"
            }
            return InviteTokenCipher(SecretKeySpec(keyBytes, "AES"))
        }
    }

    fun encrypt(token: InviteToken): EncryptedToken {
        val iv = ByteArray(IV_LENGTH).also { secureRandom.nextBytes(it) }
        val ciphertext = cipher(Cipher.ENCRYPT_MODE, iv).doFinal(token.value.toByteArray())
        return EncryptedToken(Base64.getEncoder().encodeToString(iv + ciphertext))
    }

    fun decrypt(encrypted: EncryptedToken): InviteToken {
        val raw = Base64.getDecoder().decode(encrypted.value)
        val iv = raw.copyOfRange(0, IV_LENGTH)
        val ciphertext = raw.copyOfRange(IV_LENGTH, raw.size)
        return InviteToken(String(cipher(Cipher.DECRYPT_MODE, iv).doFinal(ciphertext)))
    }

    private fun cipher(mode: Int, iv: ByteArray): Cipher =
        Cipher.getInstance("AES/GCM/NoPadding").apply {
            init(mode, key, GCMParameterSpec(TAG_BIT_LENGTH, iv))
        }
}
