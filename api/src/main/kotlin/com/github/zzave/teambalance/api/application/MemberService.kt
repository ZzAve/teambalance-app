package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NameTakenException
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.stereotype.Service
import java.util.UUID

private const val MAX_DISPLAY_NAME_LENGTH = 100

@Service
class MemberService(
    private val userRepository: UserRepository,
    private val teamMemberRepository: TeamMemberRepository,
) {
    fun getMember(teamId: UUID, userId: UUID): TeamMember =
        teamMemberRepository.findByTeamId(teamId).firstOrNull { it.userId == userId }
            ?: throw MemberNotFoundException(userId)

    /**
     * Renames the caller within their team. Self-only — the controller enforces that [userId] is the
     * authenticated principal. The name is trimmed and must stay unique within the team
     * (case-insensitive), ignoring the caller's own current name so a no-op rename is allowed.
     */
    fun updateOwnDisplayName(teamId: UUID, userId: UUID, rawName: String): TeamMember {
        val name = rawName.trim()
        require(name.isNotBlank() && name.length <= MAX_DISPLAY_NAME_LENGTH) {
            "Display name must be 1..$MAX_DISPLAY_NAME_LENGTH characters"
        }
        val taken = teamMemberRepository.findByTeamId(teamId)
            .any { it.userId != userId && it.displayName.equals(name, ignoreCase = true) }
        if (taken) throw NameTakenException(name)

        val user = userRepository.findById(userId) ?: throw MemberNotFoundException(userId)
        userRepository.save(user.copy(displayName = name))
        return getMember(teamId, userId)
    }
}
