package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import java.time.Instant
import java.util.UUID

// Cohesive data-access surface for team_members; the member-management feature grew it past the
// default 11-function limit. Splitting a single port/adapter would be artificial.
@Suppress("TooManyFunctions")
interface TeamMemberRepository {
    fun findByTeamId(teamId: TeamId): List<TeamMember>
    fun findDisplayName(userId: UserId): DisplayName?
    fun findMembersByUserIds(userIds: Set<UserId>): Map<UserId, TeamMember>

    /** The user's role on the team, or null if they have no active membership there. */
    fun findRole(teamId: TeamId, userId: UserId): Role?

    /** The team the user actively belongs to, or null if they have no team (v1: one team per user). */
    fun findTeamId(userId: UserId): TeamId?

    /**
     * The user's tenant routing (team id + schema) resolved from ONE row, or null if they have no
     * active team. Lets the login path pin both onto the session together so authenticated requests
     * read them back instead of racing to memoize them. Null-safe for a teamless user.
     */
    fun findTenantRouting(userId: UserId): TenantRouting?

    /** Joins the user to the team as a USER. No-op if already an active member of this team. */
    fun addMember(teamId: TeamId, userId: UserId)

    /** Sets the permission [role] for an active member. */
    fun updateRole(teamId: TeamId, userId: UserId, role: Role)

    /** Soft-removes a member from the team by setting active=false. */
    fun deactivate(teamId: TeamId, userId: UserId)

    /** Assigns [positionId] to an active member, or clears the assignment when null. */
    fun assignPosition(teamId: TeamId, userId: UserId, positionId: PositionId?)

    /**
     * Applies a validated member edit — display name, [role], [positionId], and (when
     * [markOnboardedAt] is non-null) the one-time onboarding stamp — as ONE unit. The display name
     * lands on `users` while the rest land on `team_members`, so this is one of the two operations
     * whose atomicity spans two aggregates: the caller states the intent in a single port call and
     * the adapter makes it atomic. All guards are the caller's responsibility and run before this.
     */
    fun applyMemberEdit(
        teamId: TeamId,
        userId: UserId,
        displayName: DisplayName,
        role: Role,
        positionId: PositionId?,
        markOnboardedAt: Instant? = null,
    )

    /** Stamps onboarded_at=[at] for an active member, marking their one-time onboarding complete. */
    fun markOnboarded(teamId: TeamId, userId: UserId, at: Instant)

    /** Number of active ADMIN members on the team. */
    fun countAdmins(teamId: TeamId): Int
}
