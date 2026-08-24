package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.PositionLabelTakenException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PositionRepository

class PositionService(
    private val positionRepository: PositionRepository,
    private val authorizationService: AuthorizationService,
) {
    /**
     * The team's positions. Any active member may read them; no admin check.
     *
     * Takes no team id since ADR-0026: positions are tenant rows, so the resolved schema is already
     * the team. The write paths below still take one — not to find rows, but to authorize.
     */
    fun listPositions(): List<Position> = positionRepository.list()

    /** Admin-only. Trims the label and enforces per-team case-insensitive uniqueness. */
    fun createPosition(callerId: UserId, teamId: TeamId, rawLabel: String): Position {
        authorizationService.requireAdmin(callerId, teamId)
        val label = validLabel(rawLabel)
        requireUnique(label, excludingId = null)
        return positionRepository.create(label)
    }

    /** Admin-only. Renames a position of this team, keeping labels unique (excluding itself). */
    fun renamePosition(callerId: UserId, teamId: TeamId, id: PositionId, rawLabel: String): Position {
        authorizationService.requireAdmin(callerId, teamId)
        if (!positionRepository.exists(id)) throw PositionNotFoundException(id)
        val label = validLabel(rawLabel)
        requireUnique(label, excludingId = id)
        return positionRepository.rename(id, label)
    }

    /**
     * Admin-only. Deletes a position. Everything that referenced it goes with it, and none of that is
     * this method's work any more (ADR-0026): members assigned to it become Unassigned via
     * `member_profiles`' ON DELETE SET NULL, and the position drops out of every event type's roster
     * default and every event's roster override via those tables' ON DELETE CASCADE.
     *
     * That used to be three ordered writes in this service, in a deliberate order — targets first,
     * because a deleted position still named by a live target is unrecoverable while the reverse is
     * merely re-runnable. The ordering mattered because each was its own transaction and no foreign
     * key could span the platform/tenant boundary. Now that positions are tenant rows alongside the
     * things that name them, one statement does all of it atomically.
     */
    fun deletePosition(callerId: UserId, teamId: TeamId, id: PositionId) {
        authorizationService.requireAdmin(callerId, teamId)
        if (!positionRepository.exists(id)) throw PositionNotFoundException(id)
        positionRepository.delete(id)
    }

    // Normalization + "not blank" stay here, on the write path; the length cap now lives on
    // PositionLabel itself, so it also holds for labels the JPA mapper builds (see its KDoc).
    private fun validLabel(rawLabel: String): PositionLabel {
        val label = rawLabel.trim()
        require(label.isNotBlank()) { "Position label must not be blank" }
        return PositionLabel(label)
    }

    private fun requireUnique(label: PositionLabel, excludingId: PositionId?) {
        val taken = positionRepository.list()
            .any { it.id != excludingId && it.label.value.equals(label.value, ignoreCase = true) }
        if (taken) throw PositionLabelTakenException(label.value)
    }
}
