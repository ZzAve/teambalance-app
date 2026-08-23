package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.MagicLinkToken
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.TokenHash
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AuthSessionGateway
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
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
    private val teamMemberRepository: TeamMemberRepository,
    private val activeTeamService: ActiveTeamService,
    private val emailGateway: EmailGateway,
    private val platformAdminGateway: PlatformAdminGateway,
    private val authSessionGateway: AuthSessionGateway,
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
        emailGateway.sendMagicLink(email, token)
    }

    fun findUserById(id: UserId): User? = userRepository.findById(id)

    /**
     * Every Team the user is an active Member of — the has-any-team gate signal on `/auth/me`. Plural
     * since #143: membership of several Teams is ordinary, and which one is *active* is a separate
     * question, answered by the Active Team ([ActiveTeamService]) rather than by this list's order.
     */
    fun findTeamsFor(userId: UserId): List<TeamSummary> = activeTeamService.teamsOf(userId)

    /**
     * The user's Role **in their Active Team**, or null when no Team is active for this request — the
     * `role` field of the authenticated-user payload. Identity-shaped ("who is this caller, here?"),
     * unlike [AuthorizationService], which answers "may this caller do X on team Y?". Takes the Active
     * Team as an argument rather than resolving one: with several memberships a caller has several
     * Roles, and only the active one is theirs for this request.
     */
    fun findRoleIn(teamId: TeamId, userId: UserId): Role? = teamMemberRepository.findRole(teamId, userId)

    /**
     * Signs [userId] in: opens their session, then pins the Active Team they land in (team id + schema
     * from one row, so the tenant lookup can't diverge or race) and returns it. Null when nothing could
     * be resolved — a teamless user, or one with several Teams and none remembered, who is asked to
     * choose instead of being given an arbitrary one.
     */
    fun startSession(userId: UserId): TeamId? {
        authSessionGateway.startSession(userId)
        return activeTeamService.pinLanding(userId)
    }

    /** The caller behind the current session, or null when unauthenticated — what `/auth/me` answers on. */
    fun currentUser(): User? = authSessionGateway.currentUserId()?.let(::findUserById)

    /** Signs the caller out by dropping their session. */
    fun endSession() = authSessionGateway.endSession()

    fun isPlatformAdmin(userId: UserId): Boolean = platformAdminGateway.isPlatformAdmin(userId.value)

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
            displayName = DisplayName(record.email.value.substringBefore("@")),
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
