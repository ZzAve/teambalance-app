package com.github.zzave.teambalance.api.application

import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64

internal object SecureTokens {
    private val secureRandom = SecureRandom()

    /** [byteLength] random bytes, Base64 URL-encoded without padding. */
    fun urlSafe(byteLength: Int): String {
        val bytes = ByteArray(byteLength)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    fun sha256Hex(bytes: ByteArray): String =
        MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) }
}
