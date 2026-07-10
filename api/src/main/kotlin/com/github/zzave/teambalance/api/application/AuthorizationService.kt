package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Service
import java.util.UUID

private const val ADMIN_ROLE = "ADMIN"

@Service
class AuthorizationService(
    private val teamMemberRepository: TeamMemberRepository,
) {
    fun isAdmin(userId: UUID, teamId: UUID): Boolean =
        teamMemberRepository.findRole(teamId, userId) == ADMIN_ROLE

    fun requireAdmin(userId: UUID, teamId: UUID) {
        if (!isAdmin(userId, teamId)) throw NotTeamAdminException(userId, teamId)
    }
}
