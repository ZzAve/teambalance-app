package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.stereotype.Service
import java.util.UUID

/**
 * Team-scoped authorization checks.
 *
 * SECURITY CONTRACT — this primitive is only as safe as its arguments:
 * - [userId] MUST be the authenticated principal (from the session, e.g. `UserContext.get()`),
 *   never a user-supplied id from a request body/path/query — otherwise this is trivially bypassed.
 * - [teamId] MUST be the server-resolved tenant for that request, never a raw request parameter —
 *   otherwise a user can probe or act on teams they don't belong to (IDOR).
 *
 * The check is fail-closed: a missing, inactive, or wrong-team membership yields no role and is
 * therefore not admin.
 */
@Service
class AuthorizationService(
    private val teamMemberRepository: TeamMemberRepository,
) {
    fun isAdmin(userId: UUID, teamId: UUID): Boolean =
        teamMemberRepository.findRole(teamId, userId) == Role.ADMIN

    fun requireAdmin(userId: UUID, teamId: UUID) {
        if (!isAdmin(userId, teamId)) throw NotTeamAdminException(userId, teamId)
    }
}
