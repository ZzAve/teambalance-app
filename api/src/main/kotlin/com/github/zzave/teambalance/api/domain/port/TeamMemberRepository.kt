package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.UserId
import java.time.Instant
import java.util.UUID

interface TeamMemberRepository {
    fun findByTeamId(teamId: UUID): List<TeamMember>
    fun findDisplayName(userId: UserId): String?
    fun findMembersByUserIds(userIds: Set<UserId>): Map<UserId, TeamMember>

    /** The user's role on the team, or null if they have no active membership there. */
    fun findRole(teamId: UUID, userId: UserId): Role?

    /** The team the user actively belongs to, or null if they have no team (v1: one team per user). */
    fun findTeamId(userId: UserId): UUID?

    /** Joins the user to the team as a USER. No-op if already an active member of this team. */
    fun addMember(teamId: UUID, userId: UserId)

    /** Sets the permission [role] for an active member. */
    fun updateRole(teamId: UUID, userId: UserId, role: Role)

    /** Soft-removes a member from the team by setting active=false. */
    fun deactivate(teamId: UUID, userId: UserId)

    /** Assigns [positionId] to an active member, or clears the assignment when null. */
    fun assignPosition(teamId: UUID, userId: UserId, positionId: PositionId?)

    /** Stamps onboarded_at=[at] for an active member, marking their one-time onboarding complete. */
    fun markOnboarded(teamId: UUID, userId: UserId, at: Instant)

    /** Number of active ADMIN members on the team. */
    fun countAdmins(teamId: UUID): Int
}
