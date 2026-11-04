package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.TeamId
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

/**
 * Reversible storage for a secret token that must be shown again: the invite link (ADR-0025) and the
 * calendar link (ADR-0039). Sits beside a salted hash rather than replacing it — the hash still
 * resolves a *presented* token, and this is read only on the path where the holder asks to see their
 * own link. The Bunq grant and the stored Bunq API Context use it too.
 *
 * AES-256-GCM with a fresh 12-byte IV per encryption, stored as base64(iv || ciphertext || tag). GCM
 * because the ciphertext is authenticated: a tampered row fails to decrypt rather than yielding a
 * token that would then be handed to a member as if it were real.
 *
 * Every call names its additional authenticated data. It is not stored; it has to be the same on
 * decrypt as on encrypt, or decryption fails. There is no default, so a caller cannot forget it.
 * - The Bunq grant and the stored Bunq API Context pass [aadOf]: the team whose tenant schema holds the
 *   row and what the value is ([Purpose]). A ciphertext copied into another team's row, or from the
 *   grant column into the context column or back, does not open there.
 * - The invite link and the calendar link are not bound to anything and pass [NO_AAD] explicitly. That
 *   is the same as no AAD at all, so the values stored before the AAD existed keep opening.
 *
 * Deliberately typed on the plaintext `String`, not on one token type: each caller wraps its own value
 * ([com.github.zzave.teambalance.api.domain.model.InviteToken],
 * [com.github.zzave.teambalance.api.domain.model.CalendarToken], [com.github.zzave.teambalance.api.domain.model.BunqGrant])
 * one line away, and a second copy of this class per kind would be a second copy of the crypto. Each
 * caller supplies its own key — the keys are siblings, never shared, so compromising one does not read
 * the other.
 */
class TokenCipher(private val key: SecretKeySpec) {

    enum class Purpose(internal val label: String) { BUNQ_GRANT("bunq-grant"), BUNQ_API_CONTEXT("bunq-api-context") }

    companion object {
        private const val IV_LENGTH = 12
        private const val TAG_BIT_LENGTH = 128
        private const val KEY_BYTE_LENGTH = 32
        private val secureRandom = SecureRandom()

        /** For the values that are not bound to a team (the invite and calendar links). Same bytes as no AAD at all. */
        val NO_AAD = ByteArray(0)

        /**
         * The one place that turns a team and a purpose into AAD bytes, so every caller binds to the same ones: the
         * purpose label, a colon and the team's UUID. The UUID is taken from the value, not from [TeamId.toString],
         * so a change of how a team id is displayed cannot change what the stored rows were bound to.
         */
        fun aadOf(teamId: TeamId, purpose: Purpose): ByteArray = "${purpose.label}:${teamId.value}".toByteArray(Charsets.UTF_8)

        /**
         * Reads a base64-encoded 256-bit key. Rejects anything else loudly at startup: a key of the
         * wrong length is a deployment mistake that must not surface later as a runtime failure on
         * a member's first click. [property] names the setting in the message, so the operator is
         * told which of the sibling keys is wrong.
         */
        fun fromBase64Key(encodedKey: String, property: String): TokenCipher {
            val keyBytes = runCatching { Base64.getDecoder().decode(encodedKey.trim()) }
                .getOrElse { error("$property must be valid base64") }
            require(keyBytes.size == KEY_BYTE_LENGTH) {
                "$property must decode to $KEY_BYTE_LENGTH bytes, was ${keyBytes.size}"
            }
            return TokenCipher(SecretKeySpec(keyBytes, "AES"))
        }
    }

    fun encrypt(plaintext: String, aad: ByteArray): EncryptedToken {
        val iv = ByteArray(IV_LENGTH).also { secureRandom.nextBytes(it) }
        val ciphertext = cipher(Cipher.ENCRYPT_MODE, iv, aad).doFinal(plaintext.toByteArray())
        return EncryptedToken(Base64.getEncoder().encodeToString(iv + ciphertext))
    }

    fun decrypt(encrypted: EncryptedToken, aad: ByteArray): String {
        val raw = Base64.getDecoder().decode(encrypted.value)
        val iv = raw.copyOfRange(0, IV_LENGTH)
        val ciphertext = raw.copyOfRange(IV_LENGTH, raw.size)
        return String(cipher(Cipher.DECRYPT_MODE, iv, aad).doFinal(ciphertext))
    }

    private fun cipher(mode: Int, iv: ByteArray, aad: ByteArray): Cipher =
        Cipher.getInstance("AES/GCM/NoPadding").apply {
            init(mode, key, GCMParameterSpec(TAG_BIT_LENGTH, iv))
            updateAAD(aad)
        }
}
