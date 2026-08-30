package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.CannotArchiveLastEventTypeException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNameTakenException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.exception.MigrationTargetInvalidException
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository

/**
 * Event types and the roster defaults they carry (#219).
 *
 * Framework-free like its siblings (ADR-0018): one call to a port method is one transaction, so a
 * use case that must write several rows as a unit hands them over in a single call.
 */
class EventTypeService(
    private val eventTypeRepository: EventTypeRepository,
    private val positionRepository: PositionRepository,
    private val authorizationService: AuthorizationService,
) {
    /**
     * The team's event types. Archived ones are excluded unless [includeArchived] — that exclusion is
     * the whole mechanism of archiving: the type vanishes from every picker while the events holding
     * it keep rendering with it.
     */
    fun findAll(includeArchived: Boolean = false): List<EventType> =
        eventTypeRepository.findAll().filter { includeArchived || !it.archived }

    fun findById(id: EventTypeId): EventType? = eventTypeRepository.findById(id)

    /** Admin-only. Names are unique per team, case-insensitively — the same rule positions follow. */
    fun createEventType(
        callerId: UserId,
        teamId: TeamId,
        name: EventTypeName,
        color: HexColor?,
        rosterDefault: RosterRequirement,
    ): EventType {
        authorizationService.requireAdmin(callerId, teamId)
        requireNotBlank(name)
        requireNameFree(name, excludingId = null)
        requireKnownPositions(rosterDefault)
        return eventTypeRepository.create(name = name, color = color, rosterDefault = rosterDefault)
    }

    /**
     * Admin-only. A whole replacement of the type's editable fields. Editing the roster default here
     * is what moves every *inheriting* event with it — the events resolve their requirement on read,
     * so nothing is rewritten and nothing needs to be.
     */
    fun updateEventType(
        callerId: UserId,
        teamId: TeamId,
        id: EventTypeId,
        name: EventTypeName,
        color: HexColor?,
        rosterDefault: RosterRequirement,
    ): EventType {
        authorizationService.requireAdmin(callerId, teamId)
        val existing = eventTypeRepository.findById(id) ?: throw EventTypeNotFoundException(id)
        requireNotBlank(name)
        requireNameFree(name, excludingId = existing.id)
        requireKnownPositions(rosterDefault)
        return eventTypeRepository.update(id = id, name = name, color = color, rosterDefault = rosterDefault)
    }

    /**
     * Admin-only. Archives a type, optionally moving its events onto another **active** type first.
     *
     * Archiving is destructive in the sense that matters to a team — the type disappears from the
     * pickers — but never to data: an [com.github.zzave.teambalance.api.domain.model.Event]'s type is
     * non-null, so this can neither orphan nor cascade-delete an event. Without a migration target
     * the existing events simply keep the archived type and keep rendering with it.
     *
     * The last active type cannot be archived: with none left, creating an event becomes impossible
     * and the team is stuck with no way out through the UI.
     */
    fun archiveEventType(
        callerId: UserId,
        teamId: TeamId,
        id: EventTypeId,
        migrateEventsTo: EventTypeId?,
    ): EventType {
        authorizationService.requireAdmin(callerId, teamId)
        val target = eventTypeRepository.findById(id) ?: throw EventTypeNotFoundException(id)
        if (target.archived) return target

        val remainingActive = findAll().filterNot { it.id == id }
        if (remainingActive.isEmpty()) throw CannotArchiveLastEventTypeException()
        migrateEventsTo?.let { requireValidMigrationTarget(it, from = id, activeTypes = remainingActive) }

        // One call, one transaction: the reassignment and the archive commit together, so a failure
        // can never leave events pointing at a type that is already hidden from every picker.
        return eventTypeRepository.archive(id = id, migrateEventsTo = migrateEventsTo)
    }

    /** Admin-only. Puts an archived type back in the pickers — the counterpart that makes it a soft delete. */
    fun unarchiveEventType(callerId: UserId, teamId: TeamId, id: EventTypeId): EventType {
        authorizationService.requireAdmin(callerId, teamId)
        val existing = eventTypeRepository.findById(id) ?: throw EventTypeNotFoundException(id)
        if (!existing.archived) return existing
        // A name freed up while the type was archived may since have been taken by a new one.
        requireNameFree(existing.name, excludingId = existing.id)
        return eventTypeRepository.unarchive(id)
    }

    // The length cap lives on EventTypeName itself (so it holds however a name arrives); "not blank"
    // is a write-path rule, exactly as it is for a position label.
    private fun requireNotBlank(name: EventTypeName) {
        require(name.value.isNotBlank()) { "Event type name must not be blank" }
    }

    // Archived types are included: two types may not share a name even when one of them is hidden,
    // or unarchiving would silently produce a duplicate the pickers cannot tell apart.
    private fun requireNameFree(name: EventTypeName, excludingId: EventTypeId?) {
        val taken = eventTypeRepository.findAll()
            .any { it.id != excludingId && it.name.value.equals(name.value, ignoreCase = true) }
        if (taken) throw EventTypeNameTakenException(name.value)
    }

    private fun requireValidMigrationTarget(target: EventTypeId, from: EventTypeId, activeTypes: List<EventType>) {
        if (target == from) throw MigrationTargetInvalidException("an event type cannot be migrated to itself")
        if (activeTypes.none { it.id == target }) {
            // Unknown or archived, which are the same thing to an admin picking from a list of active
            // types: either way the events would land somewhere they cannot be found again.
            throw MigrationTargetInvalidException("the migration target must be an active event type")
        }
    }

    // Mirrors EventService.requireKnownPositions, and for the same reason: the foreign key on
    // event_type_position_targets.position_id is what actually keeps an unknown position out, but it
    // would surface as a 500. This turns it into the declared 400 (UNKNOWN_ROSTER_POSITION) before
    // the write is attempted. Takes no team id since ADR-0025 — the tenant schema is the team.
    private fun requireKnownPositions(requirement: RosterRequirement) {
        if (requirement.positionTargets.isEmpty()) return
        val known: Set<PositionId> = positionRepository.list().map { it.id }.toSet()
        requirement.positionTargets.firstOrNull { it.positionId !in known }
            ?.let { throw com.github.zzave.teambalance.api.domain.exception.UnknownRosterPositionException(it.positionId) }
    }
}
