package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Invitation
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.Base64
import java.util.UUID

@Service
class InvitationService(
    private val invitationRepository: InvitationRepository,
    private val clock: Clock,
) {
    companion object {
        // Invite links don't expire on a timer by default in v1 — an admin rotates/expires
        // them explicitly (#38). This TTL is a long-lived backstop, not the invalidation mechanism.
        val INVITE_TTL: Duration = Duration.ofDays(365)
        private const val TOKEN_BYTE_LENGTH = 32
        private val secureRandom = SecureRandom()
    }

    /** Returns the team's existing active invite link, or generates a new one if none exists. */
    fun generateInviteLink(teamId: UUID, createdBy: UUID): Invitation {
        val now = Instant.now(clock)
        val existing = invitationRepository.findLatestByTeamId(teamId)?.takeIf { it.expiresAt.isAfter(now) }
        if (existing != null) return existing

        return invitationRepository.save(
            Invitation(
                id = UUID.randomUUID(),
                teamId = teamId,
                token = generateToken(),
                createdBy = createdBy,
                expiresAt = now.plus(INVITE_TTL),
                createdAt = now,
            ),
        )
    }

    private fun generateToken(): String {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }
}
