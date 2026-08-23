package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CannotChangeOwnRoleException
import com.github.zzave.teambalance.api.domain.exception.LastAdminException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NameTakenException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import java.time.Clock
import java.time.Instant

private const val MAX_DISPLAY_NAME_LENGTH = 100

class MemberService(
    private val userRepository: UserRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val positionRepository: PositionRepository,
    private val authorizationService: AuthorizationService,
    private val clock: Clock,
) {
    fun getMember(teamId: TeamId, userId: UserId): TeamMember =
        teamMemberRepository.findByTeamId(teamId).firstOrNull { it.userId == userId }
            ?: throw MemberNotFoundException(userId)

    fun listMembers(teamId: TeamId): List<TeamMember> = teamMemberRepository.findByTeamId(teamId)

    /**
     * Renames the caller within their team. Self-only — the controller enforces that [userId] is the
     * authenticated principal. The name is trimmed and must stay unique within the team
     * (case-insensitive), ignoring the caller's own current name so a no-op rename is allowed.
     */
    fun updateOwnDisplayName(teamId: TeamId, userId: UserId, rawName: String): TeamMember {
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
        callerId: UserId,
        teamId: TeamId,
        targetUserId: UserId,
        rawName: String,
        role: Role,
        positionId: PositionId? = null,
    ): TeamMember {
        if (callerId != targetUserId) authorizationService.requireAdmin(callerId, teamId)

        val currentRole = teamMemberRepository.findRole(teamId, targetUserId)
            ?: throw MemberNotFoundException(targetUserId)
        val roleChanged = role != currentRole
        guardRoleChange(callerId, targetUserId, teamId, currentRole, role, roleChanged)
        requirePositionInThisTeam(positionId)
        val name = normalizeAndValidateName(teamId, targetUserId, rawName)

        teamMemberRepository.applyMemberEdit(teamId, targetUserId, name, role, positionId)
        return getMember(teamId, targetUserId)
    }

    // A role change may neither elevate the caller's own role nor remove the team's last admin.
    private fun guardRoleChange(
        callerId: UserId,
        targetUserId: UserId,
        teamId: TeamId,
        currentRole: Role,
        newRole: Role,
        roleChanged: Boolean,
    ) {
        if (!roleChanged) return
        if (callerId == targetUserId && newRole == Role.ADMIN) throw CannotChangeOwnRoleException(callerId)
        if (currentRole == Role.ADMIN && newRole == Role.USER && teamMemberRepository.countAdmins(teamId) <= 1) {
            throw LastAdminException(teamId)
        }
    }

    // A non-null position must exist in this tenant; null clears the assignment. Takes no team id
    // since ADR-0025: the routed schema is what makes a position "this team's", so there is nothing
    // left to compare it against — an id from another team is simply not a row this can see.
    private fun requirePositionInThisTeam(positionId: PositionId?) {
        if (positionId != null && !positionRepository.exists(positionId)) {
            throw PositionNotFoundException(positionId)
        }
    }

    /**
     * Completes the caller's one-time onboarding: applies the member's own display name and position
     * and stamps onboarded_at, as one unit. Role is left untouched — onboarding never changes it.
     * Idempotent: re-running keeps the member onboarded and simply re-applies name/position. The
     * controller enforces that [userId] is the authenticated principal (self-only).
     */
    fun completeOnboarding(userId: UserId, teamId: TeamId, rawName: String, positionId: PositionId?): TeamMember {
        val currentRole = teamMemberRepository.findRole(teamId, userId)
            ?: throw MemberNotFoundException(userId)
        requirePositionInThisTeam(positionId)
        val name = normalizeAndValidateName(teamId, userId, rawName)

        teamMemberRepository.applyMemberEdit(teamId, userId, name, currentRole, positionId, Instant.now(clock))
        return getMember(teamId, userId)
    }

    /** Soft-removes a member. Admin-only, and refuses to remove the team's last remaining admin. */
    fun removeMember(callerId: UserId, teamId: TeamId, targetUserId: UserId) {
        authorizationService.requireAdmin(callerId, teamId)
        val targetRole = teamMemberRepository.findRole(teamId, targetUserId)
            ?: throw MemberNotFoundException(targetUserId)
        if (targetRole == Role.ADMIN && teamMemberRepository.countAdmins(teamId) <= 1) {
            throw LastAdminException(teamId)
        }
        teamMemberRepository.deactivate(teamId, targetUserId)
    }

    // Validates and normalizes a display name without writing: trims, checks length, and enforces
    // per-team case-insensitive uniqueness (excluding the target so a no-op rename is allowed).
    private fun normalizeAndValidateName(teamId: TeamId, targetUserId: UserId, rawName: String): DisplayName {
        val name = rawName.trim()
        require(name.isNotBlank() && name.length <= MAX_DISPLAY_NAME_LENGTH) {
            "Display name must be 1..$MAX_DISPLAY_NAME_LENGTH characters"
        }
        val taken = teamMemberRepository.findByTeamId(teamId)
            .any { it.userId != targetUserId && it.displayName.value.equals(name, ignoreCase = true) }
        if (taken) throw NameTakenException(name)
        return DisplayName(name)
    }

    // A single-aggregate write (users only), so it needs no cross-aggregate boundary — used by the
    // self-rename path where role and position are untouched.
    private fun applyDisplayName(teamId: TeamId, targetUserId: UserId, rawName: String) {
        val name = normalizeAndValidateName(teamId, targetUserId, rawName)
        val user = userRepository.findById(targetUserId) ?: throw MemberNotFoundException(targetUserId)
        userRepository.save(user.copy(displayName = name))
    }
}
