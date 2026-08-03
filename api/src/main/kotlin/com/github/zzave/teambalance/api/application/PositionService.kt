package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.PositionLabelTakenException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import java.util.UUID

private const val MAX_LABEL_LENGTH = 50

/**
 * Framework-free (ADR-0018): a plain class constructed by the composition root from its ports.
 *
 * It never carried a `@Transactional`. Each use case writes through a single port call, and the two
 * that touch more than one row ([PositionRepository.rename], [PositionRepository.delete]) already own
 * their transaction on the adapter.
 */
class PositionService(
    private val positionRepository: PositionRepository,
    private val authorizationService: AuthorizationService,
) {
    /** The team's positions. Any active member may read them; no admin check. */
    fun listPositions(teamId: UUID): List<Position> = positionRepository.listByTeam(teamId)

    /** Admin-only. Trims the label and enforces per-team case-insensitive uniqueness. */
    fun createPosition(callerId: UUID, teamId: UUID, rawLabel: String): Position {
        authorizationService.requireAdmin(callerId, teamId)
        val label = validLabel(rawLabel)
        requireUnique(teamId, label, excludingId = null)
        return positionRepository.create(teamId, label)
    }

    /** Admin-only. Renames a position of this team, keeping labels unique (excluding itself). */
    fun renamePosition(callerId: UUID, teamId: UUID, id: UUID, rawLabel: String): Position {
        authorizationService.requireAdmin(callerId, teamId)
        if (!positionRepository.existsInTeam(teamId, id)) throw PositionNotFoundException(id)
        val label = validLabel(rawLabel)
        requireUnique(teamId, label, excludingId = id)
        return positionRepository.rename(id, label)
    }

    /** Admin-only. Deletes a position; members assigned to it are silently reset to unassigned. */
    fun deletePosition(callerId: UUID, teamId: UUID, id: UUID) {
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

    private fun requireUnique(teamId: UUID, label: String, excludingId: UUID?) {
        val taken = positionRepository.listByTeam(teamId)
            .any { it.id != excludingId && it.label.equals(label, ignoreCase = true) }
        if (taken) throw PositionLabelTakenException(label)
    }
}
