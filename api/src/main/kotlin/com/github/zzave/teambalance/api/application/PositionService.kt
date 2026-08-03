package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.PositionLabelTakenException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import org.springframework.stereotype.Service
import java.util.UUID

private const val MAX_LABEL_LENGTH = 50

@Service
class PositionService(
    private val positionRepository: PositionRepository,
    private val authorizationService: AuthorizationService,
) {
    /** The team's positions. Any active member may read them; no admin check. */
    fun listPositions(teamId: TeamId): List<Position> = positionRepository.listByTeam(teamId)

    /** Admin-only. Trims the label and enforces per-team case-insensitive uniqueness. */
    fun createPosition(callerId: UserId, teamId: TeamId, rawLabel: String): Position {
        authorizationService.requireAdmin(callerId, teamId)
        val label = validLabel(rawLabel)
        requireUnique(teamId, label, excludingId = null)
        return positionRepository.create(teamId, label)
    }

    /** Admin-only. Renames a position of this team, keeping labels unique (excluding itself). */
    fun renamePosition(callerId: UserId, teamId: TeamId, id: PositionId, rawLabel: String): Position {
        authorizationService.requireAdmin(callerId, teamId)
        if (!positionRepository.existsInTeam(teamId, id)) throw PositionNotFoundException(id)
        val label = validLabel(rawLabel)
        requireUnique(teamId, label, excludingId = id)
        return positionRepository.rename(id, label)
    }

    /** Admin-only. Deletes a position; members assigned to it are silently reset to unassigned. */
    fun deletePosition(callerId: UserId, teamId: TeamId, id: PositionId) {
        authorizationService.requireAdmin(callerId, teamId)
        if (!positionRepository.existsInTeam(teamId, id)) throw PositionNotFoundException(id)
        positionRepository.delete(id)
    }

    private fun validLabel(rawLabel: String): String {
        val label = rawLabel.trim()
        require(label.isNotBlank() && label.length <= MAX_LABEL_LENGTH) {
            "Position label must be 1..$MAX_LABEL_LENGTH characters"
        }
        return label
    }

    private fun requireUnique(teamId: TeamId, label: String, excludingId: PositionId?) {
        val taken = positionRepository.listByTeam(teamId)
            .any { it.id != excludingId && it.label.equals(label, ignoreCase = true) }
        if (taken) throw PositionLabelTakenException(label)
    }
}
