package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import java.time.Instant
import java.util.UUID

// Cohesive data-access surface for team_members; the member-management feature grew it past the
// default 11-function limit. Splitting a single port/adapter would be artificial.
@Suppress("TooManyFunctions")
interface TeamMemberRepository {
    fun findByTeamId(teamId: UUID): List<TeamMember>
    fun findDisplayName(userId: UUID): String?
    fun findMembersByUserIds(userIds: Set<UUID>): Map<UUID, TeamMember>

    /** The user's role on the team, or null if they have no active membership there. */
    fun findRole(teamId: UUID, userId: UUID): Role?

    /** The team the user actively belongs to, or null if they have no team (v1: one team per user). */
    fun findTeamId(userId: UUID): UUID?

    /** Joins the user to the team as a USER. No-op if already an active member of this team. */
    fun addMember(teamId: UUID, userId: UUID)

    /** Sets the permission [role] for an active member. */
    fun updateRole(teamId: UUID, userId: UUID, role: Role)

    /** Soft-removes a member from the team by setting active=false. */
    fun deactivate(teamId: UUID, userId: UUID)

    /** Assigns [positionId] to an active member, or clears the assignment when null. */
    fun assignPosition(teamId: UUID, userId: UUID, positionId: UUID?)

    /**
     * Applies a validated member edit — display name, [role], [positionId], and (when
     * [markOnboardedAt] is non-null) the one-time onboarding stamp — as ONE unit. The display name
     * lands on `users` while the rest land on `team_members`, so this is one of the two operations
     * whose atomicity spans two aggregates: the caller states the intent in a single port call and
     * the adapter makes it atomic. All guards are the caller's responsibility and run before this.
     */
    fun applyMemberEdit(
        teamId: UUID,
        userId: UUID,
        displayName: String,
        role: Role,
        positionId: UUID?,
        markOnboardedAt: Instant? = null,
    )

    /** Stamps onboarded_at=[at] for an active member, marking their one-time onboarding complete. */
    fun markOnboarded(teamId: UUID, userId: UUID, at: Instant)

    /** Number of active ADMIN members on the team. */
    fun countAdmins(teamId: UUID): Int
}
