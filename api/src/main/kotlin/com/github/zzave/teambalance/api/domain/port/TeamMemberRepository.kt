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
     * The tenant routing (team id + schema) for **this** team and this user, resolved from ONE row,
     * or null when they have no active membership of it (ADR-0023 §1). The team id is an input, not a
     * discovery: this asks "resolve this team for this user, and verify they may have it" — it never
     * picks a team on the caller's behalf.
     *
     * Null is the *only* failure mode, and it covers both "no such team" and "not yours" — the caller
     * cannot tell them apart, so the team id space cannot be probed.
     */
    fun findTenantRouting(teamId: TeamId, userId: UserId): TenantRouting?

    /**
     * The tenant routing of the user's **only** active membership, or null when they have none — or
     * more than one. Deliberately not "their first team": with several memberships there is no
     * defensible pick, so this answers null and the Active Team has to be chosen explicitly
     * (ADR-0023 §3). This is what replaced the `ORDER BY team_id LIMIT 1` that used to choose by UUID.
     */
    fun findSoleTenantRouting(userId: UserId): TenantRouting?

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
