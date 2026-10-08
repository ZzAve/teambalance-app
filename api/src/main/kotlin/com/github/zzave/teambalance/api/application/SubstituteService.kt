package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.exception.PositionNotFoundException
import com.github.zzave.teambalance.api.domain.exception.SubstituteNameTakenException
import com.github.zzave.teambalance.api.domain.exception.SubstituteNotFoundException
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.model.UsageCount
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
    fun listSubstitutes(scope: TeamScope): List<Substitute> {
        authorizationService.requireMember(scope)
        return substituteRepository.list()
    }

    fun createSubstitute(scope: TeamScope, rawName: String, positionId: PositionId?): Substitute {
        authorizationService.requireMember(scope)
        val name = validName(rawName, excluding = null)
        requireKnownPosition(positionId)
        return substituteRepository.create(name, positionId, scope.userId)
    }

    /** Admin-only. Saves the name and the Position together; a null [positionId] clears it. */
    fun updateSubstitute(
        scope: TeamScope,
        id: SubstituteId,
        rawName: String,
        positionId: PositionId?,
    ): Substitute {
        authorizationService.requireAdmin(scope)
        val name = validName(rawName, excluding = id)
        requireKnownPosition(positionId)
        return substituteRepository.update(id, name, positionId) ?: throw SubstituteNotFoundException(id)
    }

    /** Admin-only: the remove dialog states how many Events the removal takes the Substitute off. */
    fun substituteEventCount(scope: TeamScope, id: SubstituteId): UsageCount {
        authorizationService.requireAdmin(scope)
        if (!substituteRepository.exists(id)) throw SubstituteNotFoundException(id)
        return UsageCount(substituteRepository.countEvents(id))
    }

    /** Admin-only, and final: there is no restore. The Substitute leaves every Event, past ones included. */
    fun deleteSubstitute(scope: TeamScope, id: SubstituteId) {
        authorizationService.requireAdmin(scope)
        if (!substituteRepository.exists(id)) throw SubstituteNotFoundException(id)
        substituteRepository.delete(id)
    }

    fun setAttendance(
        scope: TeamScope,
        eventId: EventId,
        substituteId: SubstituteId,
        state: AttendanceState,
    ): SubstituteAttendance {
        authorizationService.requireMember(scope)
        require(state != AttendanceState.NOT_RESPONDED) { "A substitute is never Not Responded" }
        if (!substituteRepository.exists(substituteId)) throw SubstituteNotFoundException(substituteId)
        return substituteRepository.setAttendance(eventId, substituteId, state, scope.userId, clock.instant())
            ?: throw EventNotFoundException(eventId)
    }

    /** Takes the Substitute off the Event; they stay on the Team's list. */
    fun removeAttendance(scope: TeamScope, eventId: EventId, substituteId: SubstituteId) {
        authorizationService.requireMember(scope)
        if (!substituteRepository.removeAttendance(eventId, substituteId)) throw SubstituteNotFoundException(substituteId)
    }

    // Trimmed, 1..MAX_NAME_LENGTH, and unique on the list ignoring case, so the picker never shows two
    // rows nobody can tell apart. [excluding] lets a Substitute keep their own name through a rename.
    private fun validName(rawName: String, excluding: SubstituteId?): DisplayName {
        val name = rawName.trim()
        require(name.isNotBlank()) { "Substitute name must not be blank" }
        require(name.length <= MAX_NAME_LENGTH) { "Substitute name must be at most $MAX_NAME_LENGTH characters" }
        val taken = substituteRepository.list().any { it.id != excluding && it.name.value.equals(name, ignoreCase = true) }
        if (taken) throw SubstituteNameTakenException(name)
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
