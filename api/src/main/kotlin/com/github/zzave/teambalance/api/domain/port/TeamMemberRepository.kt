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

    /**
     * Team id and schema for this team and this user, from ONE row. Null covers both "no such team"
     * and "not yours", indistinguishably, so the team id space cannot be probed (ADR-0023 §1).
     */
    fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting?

    /** Null for none and for several: with several there is no defensible pick (ADR-0023 §3). */
    fun findSoleTenantRouting(userId: UserId): TenantRouting?

    /**
     * Joins the user to the team at [role], whether or not they were a member before. A previously
     * removed member comes back at [role], never at their old one. If they are already an active member
     * the call promotes them to [role] when it is higher (an ADMIN handover link makes an existing USER
     * an ADMIN) and is otherwise a no-op.
     *
     * The ordinary accept path passes [Role.USER]; the single-use ADMIN handover link (ADR-0024 §5)
     * passes [Role.ADMIN], which is how a memberless team gets its first Admin.
     */
    fun addMember(teamId: TeamId, userId: UserId, role: Role = Role.USER)

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
