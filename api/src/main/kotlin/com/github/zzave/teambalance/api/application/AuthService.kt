package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.port.EmailSender
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.stereotype.Service
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.Base64
import java.util.UUID

@Service
class AuthService(
    private val magicLinkTokenRepository: MagicLinkTokenRepository,
    private val userRepository: UserRepository,
    private val emailSender: EmailSender,
    private val clock: Clock,
) {
    companion object {
        val TOKEN_TTL: Duration = Duration.ofMinutes(15)
        private const val TOKEN_BYTE_LENGTH = 32
        private val secureRandom = SecureRandom()
    }

    fun requestMagicLink(email: String) {
        val token = generateToken()
        val now = clock.instant()
        magicLinkTokenRepository.save(
            MagicLinkToken(
                id = UUID.randomUUID(),
                tokenHash = hash(token),
                email = email,
                expiresAt = now.plus(TOKEN_TTL),
                usedAt = null,
                createdAt = now,
            ),
        )
        emailSender.sendMagicLink(email, token)
    }

    fun findUserById(id: UUID): User? = userRepository.findById(id)

    fun verifyMagicLink(token: String): User? {
        val now = clock.instant()
        val record = magicLinkTokenRepository.findByTokenHash(hash(token))
            ?.takeIf { it.usedAt == null && it.expiresAt.isAfter(now) }
            ?: return null
        magicLinkTokenRepository.save(record.copy(usedAt = now))

        return userRepository.findByEmail(record.email)
            ?: userRepository.save(
                User(
                    id = UUID.randomUUID(),
                    email = record.email,
                    // No display name is collected at magic-link signup; derive a placeholder from the email.
                    displayName = record.email.substringBefore("@"),
                ),
            )
    }

    private fun generateToken(): String {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    private fun hash(token: String): String =
        MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(it) }
}
