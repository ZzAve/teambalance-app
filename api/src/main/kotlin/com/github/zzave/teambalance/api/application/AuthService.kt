package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.EmailSender
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.Base64
import java.util.UUID

class AuthService(
    private val magicLinkTokenRepository: MagicLinkTokenRepository,
    private val userRepository: UserRepository,
    private val teamRepository: TeamRepository,
    private val emailSender: EmailSender,
    private val clock: Clock,
) {
    companion object {
        val TOKEN_TTL: Duration = Duration.ofMinutes(15)
        private const val TOKEN_BYTE_LENGTH = 32
        private val secureRandom = SecureRandom()
    }

    fun requestMagicLink(email: Email) {
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

    fun findUserById(id: UserId): User? = userRepository.findById(id)

    /** The team the user belongs to, or null if teamless — the has-a-team gate signal on `/auth/me`. */
    fun findTeamFor(userId: UserId): TeamSummary? = teamRepository.findByUserId(userId.value)

    fun verifyMagicLink(token: String): User? {
        val now = clock.instant()
        val record = magicLinkTokenRepository.findByTokenHash(hash(token))
            ?.takeIf { it.usedAt == null && it.expiresAt.isAfter(now) }
            ?: return null

        // Consuming the token and resolving (creating if absent) the user is one atomic unit: a
        // failure to create the user must not burn the single-use token. No display name is collected
        // at magic-link signup, so derive a placeholder from the email for a first-time sign-in.
        return magicLinkTokenRepository.consumeAndResolveUser(
            consumedToken = record.copy(usedAt = now),
            displayName = record.email.value.substringBefore("@"),
        )
    }

    private fun generateToken(): String {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    private fun hash(token: String): TokenHash =
        TokenHash(MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(it) })
}
