package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.exception.SubstituteNotFoundException
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import java.time.Clock

/**
 * The Team's Substitutes and calling them in for an Event (ADR-0033). Every write here is open to
 * any Member, which matches trust-based attendance editing (ADR-0003); only managing the list itself
 * (rename, change Position, remove) is an Admin action.
 */
class SubstituteService(
    private val substituteRepository: SubstituteRepository,
    private val positionRepository: PositionRepository,
    private val authorizationService: AuthorizationService,
    private val clock: Clock,
) {
    /** The Team's list, for the picker. Any Member may read it. */
    fun listSubstitutes(callerId: UserId, teamId: TeamId): List<Substitute> {
        authorizationService.requireMember(callerId, teamId)
        return substituteRepository.list()
    }

    fun createSubstitute(callerId: UserId, teamId: TeamId, rawName: String, positionId: PositionId?): Substitute {
        authorizationService.requireMember(callerId, teamId)
        val name = validName(rawName)
        requireKnownPosition(positionId)
        return substituteRepository.create(name, positionId, callerId)
    }

    /** Admin-only. Saves the name and the Position together; a null [positionId] clears it. */
    fun updateSubstitute(
        callerId: UserId,
        teamId: TeamId,
        id: SubstituteId,
        rawName: String,
        positionId: PositionId?,
    ): Substitute {
        authorizationService.requireAdmin(callerId, teamId)
        if (!substituteRepository.exists(id)) throw SubstituteNotFoundException(id)
        val name = validName(rawName)
        requireKnownPosition(positionId)
        return substituteRepository.update(id, name, positionId)
    }

    fun setAttendance(
        callerId: UserId,
        teamId: TeamId,
        eventId: EventId,
        substituteId: SubstituteId,
        state: AttendanceState,
    ): SubstituteAttendance {
        authorizationService.requireMember(callerId, teamId)
        require(state != AttendanceState.NOT_RESPONDED) { "A substitute is never Not Responded" }
        if (!substituteRepository.exists(substituteId)) throw SubstituteNotFoundException(substituteId)
        return substituteRepository.setAttendance(eventId, substituteId, state, callerId, clock.instant())
            ?: throw EventNotFoundException(eventId)
    }

    /** Takes the Substitute off the Event; they stay on the Team's list. */
    fun removeAttendance(callerId: UserId, teamId: TeamId, eventId: EventId, substituteId: SubstituteId) {
        authorizationService.requireMember(callerId, teamId)
        if (!substituteRepository.removeAttendance(eventId, substituteId)) throw SubstituteNotFoundException(substituteId)
    }

    private fun validName(rawName: String): DisplayName {
        val name = rawName.trim()
        require(name.isNotBlank()) { "Substitute name must not be blank" }
        require(name.length <= MAX_NAME_LENGTH) { "Substitute name must be at most $MAX_NAME_LENGTH characters" }
        return DisplayName(name)
    }

    private fun requireKnownPosition(positionId: PositionId?) {
        if (positionId != null && !positionRepository.exists(positionId)) throw PositionNotFoundException(positionId)
    }

    private companion object {
        // The width of `substitutes.name`.
        const val MAX_NAME_LENGTH = 100
    }
}
