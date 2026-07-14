package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import java.util.UUID

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
}
