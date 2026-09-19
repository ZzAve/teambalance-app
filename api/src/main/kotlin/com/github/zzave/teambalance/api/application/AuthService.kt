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

/** What a pending Invite Link became on the sign-in that carried it (#342). */
enum class InviteOutcome { JOINED, UNAVAILABLE }

/**
 * A verified magic link: the signed-in user, and what became of the Invite Link the sign-in was
 * requested from. [inviteOutcome] is null for an ordinary login that carried no invite.
 */
data class MagicLinkSignIn(val user: User, val inviteOutcome: InviteOutcome?)

class AuthService(
    private val magicLinkTokenRepository: MagicLinkTokenRepository,
    private val userRepository: UserRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val activeTeamService: ActiveTeamService,
    private val actAsService: ActAsService,
    private val invitationService: InvitationService,
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

    /**
     * Sends a magic link, remembering the Invite Link it was requested from (#342).
     *
     * Returns false, having sent nothing, when [inviteToken] names no live invitation. Resolving the
     * invite here rather than on the click is what lets a dead link be refused while the joiner is
     * still looking at the invite page, instead of after an email round trip. The refusal is
     * deliberately no more specific than that: like accept, it does not separate unknown from expired.
     *
     * Storing the resolved id rather than the token keeps the emailed link a pure identity credential.
     * An Invite Link is reusable and lives until an admin rotates it, while this magic link is
     * single-use and expires in [TOKEN_TTL], so writing the token into the email would have left a
     * long-lived join credential sitting in every joiner's mailbox.
     */
    fun requestMagicLink(email: Email, inviteToken: String? = null): Boolean {
        val invitationId = if (inviteToken == null) {
            null
        } else {
            invitationService.findPendingInvitation(inviteToken) ?: return false
        }

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
                invitationId = invitationId,
            ),
        )
        emailGateway.sendMagicLink(email, token)
        return true
    }

    fun findUserById(id: UserId): User? = userRepository.findById(id)

    /** The has-any-team gate signal on `/auth/me`. Which one is *active* is a separate question. */
    fun findTeamsFor(userId: UserId): List<TeamSummary> = activeTeamService.teamsOf(userId)

    /**
     * Identity-shaped ("who is this caller, here?"), unlike [AuthorizationService], which answers
     * "may this caller do X on team Y?". The Active Team is an argument because a caller with several
     * memberships has several Roles, and only the active one is theirs for this request.
     */
    fun findRoleIn(teamId: TeamId, userId: UserId): Role? = teamMemberRepository.findRole(teamId, userId)

    /**
     * Opens the session and returns the Active Team pinned for it, or null if none resolved.
     *
     * Any open **Act-as** is closed first (ADR-0024): the grant outlives a session by design — it is
     * a durable, time-boxed record — but a fresh sign-in must not *resume* one, or act-as stops being
     * a mode you enter and becomes one you find yourself in. Same reasoning as `pinLanding` clearing
     * the routing unconditionally: a sign-in inherits nothing.
     */
    fun startSession(userId: UserId): TeamId? {
        authSessionGateway.startSession(userId)
        actAsService.exit(userId)
        return activeTeamService.pinLanding(userId)
    }

    /** The caller behind the current session, or null when unauthenticated — what `/auth/me` answers on. */
    fun currentUser(): User? = authSessionGateway.currentUserId()?.let(::findUserById)

    /** Signs the caller out by dropping their session, leaving any Team they were acting inside. */
    fun endSession() {
        authSessionGateway.currentUserId()?.let(actAsService::exit)
        authSessionGateway.endSession()
    }

    fun isPlatformAdmin(userId: UserId): Boolean = platformAdminGateway.isPlatformAdmin(userId.value)

    /**
     * Verifies a magic link and, when it was requested from an Invite Link, joins the team (#342).
     *
     * Accepting here is what makes the invite survive the trip: the browser that clicks the emailed
     * link need not be the one that started at `/invite/:token`, because the only thing that travels
     * is the URL, and the pending invitation hangs off the record it names.
     *
     * The accept sits **outside** the atomic consume-and-resolve pair and **before** the session
     * starts. Outside, because an invitation that expired or was rotated inside the link's 15 minutes
     * is an ordinary outcome, not a reason to refuse a valid proof of identity — landing signed in but
     * teamless has its own onboarding hub, so it no longer withholds the session (amends ADR-0008).
     * Before, because accepting remembers the joined Team as the caller's last active one, which is
     * what [startSession]'s landing pin then reads (ADR-0023 §4); reversed, the two would disagree.
     */
    fun verifyMagicLink(token: String): MagicLinkSignIn? {
        val now = clock.instant()
        val record = magicLinkTokenRepository.findByTokenHash(hash(token))
            ?.takeIf { it.usedAt == null && it.expiresAt.isAfter(now) }
            ?: return null

        // Consuming the token and resolving (creating if absent) the user is one atomic unit: a
        // failure to create the user must not burn the single-use token. No display name is collected
        // at magic-link signup, so derive a placeholder from the email for a first-time sign-in.
        val user = magicLinkTokenRepository.consumeAndResolveUser(
            consumedToken = record.copy(usedAt = now),
            displayName = DisplayName(record.email.value.substringBefore("@")),
        )

        val outcome = record.invitationId?.let { invitationId ->
            invitationService.acceptPendingInvitation(invitationId, user.id)
                ?.let { InviteOutcome.JOINED }
                ?: InviteOutcome.UNAVAILABLE
        }
        return MagicLinkSignIn(user = user, inviteOutcome = outcome)
    }

    private fun generateToken(): String {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH)
        secureRandom.nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    private fun hash(token: String): TokenHash =
        TokenHash(MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(it) })
}
