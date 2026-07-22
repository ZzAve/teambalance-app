package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CannotChangeOwnRoleException
import com.github.zzave.teambalance.api.domain.exception.LastAdminException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NameTakenException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.stereotype.Service
import java.util.UUID

private const val MAX_DISPLAY_NAME_LENGTH = 100

@Service
class MemberService(
    private val userRepository: UserRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val positionRepository: PositionRepository,
    private val authorizationService: AuthorizationService,
) {
    fun getMember(teamId: UUID, userId: UUID): TeamMember =
        teamMemberRepository.findByTeamId(teamId).firstOrNull { it.userId == userId }
            ?: throw MemberNotFoundException(userId)

    fun listMembers(teamId: UUID): List<TeamMember> = teamMemberRepository.findByTeamId(teamId)

    /**
     * Renames the caller within their team. Self-only — the controller enforces that [userId] is the
     * authenticated principal. The name is trimmed and must stay unique within the team
     * (case-insensitive), ignoring the caller's own current name so a no-op rename is allowed.
     */
    fun updateOwnDisplayName(teamId: UUID, userId: UUID, rawName: String): TeamMember {
        applyDisplayName(teamId, userId, rawName)
        return getMember(teamId, userId)
    }

    /**
     * Edits a member's display name and role. Self-edits (caller == target) skip the admin check so a
     * member can still rename themselves; editing anyone else requires the caller to be a team admin.
     * Role changes are guarded: a caller may not elevate their own role, and the team must always keep
     * at least one admin. A non-null [positionId] must identify a position of this team; null clears the
     * assignment (the backend is lenient — "required when positions exist" is a frontend concern). All
     * guards are checked before any write so a rejected change leaves the name untouched.
     */
    fun updateMember(
        callerId: UUID,
        teamId: UUID,
        targetUserId: UUID,
        rawName: String,
        role: Role,
        positionId: UUID? = null,
    ): TeamMember {
        if (callerId != targetUserId) authorizationService.requireAdmin(callerId, teamId)

        val currentRole = teamMemberRepository.findRole(teamId, targetUserId)
            ?: throw MemberNotFoundException(targetUserId)
        val roleChanged = role != currentRole
        if (roleChanged) {
            if (callerId == targetUserId && role == Role.ADMIN) throw CannotChangeOwnRoleException(callerId)
            if (currentRole == Role.ADMIN && role == Role.USER && teamMemberRepository.countAdmins(teamId) <= 1) {
                throw LastAdminException(teamId)
            }
        }
        if (positionId != null && !positionRepository.existsInTeam(teamId, positionId)) {
            throw PositionNotFoundException(positionId)
        }

        applyDisplayName(teamId, targetUserId, rawName)
        if (roleChanged) teamMemberRepository.updateRole(teamId, targetUserId, role)
        teamMemberRepository.assignPosition(teamId, targetUserId, positionId)
        return getMember(teamId, targetUserId)
    }

    /** Soft-removes a member. Admin-only, and refuses to remove the team's last remaining admin. */
    fun removeMember(callerId: UUID, teamId: UUID, targetUserId: UUID) {
        authorizationService.requireAdmin(callerId, teamId)
        val targetRole = teamMemberRepository.findRole(teamId, targetUserId)
            ?: throw MemberNotFoundException(targetUserId)
        if (targetRole == Role.ADMIN && teamMemberRepository.countAdmins(teamId) <= 1) {
            throw LastAdminException(teamId)
        }
        teamMemberRepository.deactivate(teamId, targetUserId)
    }

    // Trims, validates length, enforces per-team case-insensitive uniqueness (excluding the target so a
    // no-op rename is allowed), then persists the name on the user record.
    private fun applyDisplayName(teamId: UUID, targetUserId: UUID, rawName: String) {
        val name = rawName.trim()
        require(name.isNotBlank() && name.length <= MAX_DISPLAY_NAME_LENGTH) {
            "Display name must be 1..$MAX_DISPLAY_NAME_LENGTH characters"
        }
        val taken = teamMemberRepository.findByTeamId(teamId)
            .any { it.userId != targetUserId && it.displayName.equals(name, ignoreCase = true) }
        if (taken) throw NameTakenException(name)

        val user = userRepository.findById(targetUserId) ?: throw MemberNotFoundException(targetUserId)
        userRepository.save(user.copy(displayName = name))
    }
}
