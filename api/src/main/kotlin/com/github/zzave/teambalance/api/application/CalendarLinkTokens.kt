package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.CalendarToken
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.TokenHash
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64

/**
 * How a calendar-link token is minted, matched and shown again — the one place that knows all three,
 * so the feed and the management API can never disagree about what a token is (ADR-0032).
 *
 * The same twofold storage ADR-0025 gave the invite link: [hash] is what the feed matches a presented
 * token on, and is irreversible; [conceal]/[reveal] are the recoverable copy behind the member's own
 * "show me my link" read. A subscriber presenting a token therefore never causes a decryption.
 *
 * Its salt and its [TokenCipher] key are calendar-link-specific siblings of the invitation ones, never
 * shared with them: one leaked secret must not read the other kind of link.
 */
class CalendarLinkTokens(
    // App-wide secret mixed into the stored hash, from teambalance.calendar-link.token-salt.
    private val salt: String,
    private val cipher: TokenCipher,
) {
    /** 256 bits from [SecureRandom], base64url so it survives a path segment unescaped. */
    fun mint(): CalendarToken {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH).also { secureRandom.nextBytes(it) }
        return CalendarToken(Base64.getUrlEncoder().withoutPadding().encodeToString(bytes))
    }

    /**
     * Salted SHA-256, hex-encoded — the token's identity for lookup, taking the *presented* string so
     * a caller cannot accidentally hash something it has already decided is a real token.
     */
    fun hash(presented: String): TokenHash =
        TokenHash(
            MessageDigest.getInstance("SHA-256")
                .digest((salt + presented).toByteArray())
                .joinToString("") { "%02x".format(it) },
        )

    fun conceal(token: CalendarToken): EncryptedToken = cipher.encrypt(token.value)

    fun reveal(encrypted: EncryptedToken): CalendarToken = CalendarToken(cipher.decrypt(encrypted))

    private companion object {
        const val TOKEN_BYTE_LENGTH = 32
        val secureRandom = SecureRandom()
    }
}
