package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.RosterRequirement

interface EventTypeRepository {
    /** Every type, archived included — callers decide what to hide. */
    fun findAll(): List<EventType>
    fun findById(id: EventTypeId): EventType?

    fun create(name: EventTypeName, color: HexColor?, rosterDefault: RosterRequirement): EventType

    /** Replaces the type's editable fields. Archived state is not among them — see [archive]. */
    fun update(id: EventTypeId, name: EventTypeName, color: HexColor?, rosterDefault: RosterRequirement): EventType

    /**
     * Archives [id], first reassigning every event of that type to [migrateEventsTo] when given.
     *
     * ONE call, so the reassignment and the archive commit together — a partial failure must never
     * leave events pointing at a type that is already hidden from every picker.
     */
    fun archive(id: EventTypeId, migrateEventsTo: EventTypeId?): EventType

    fun unarchive(id: EventTypeId): EventType

    /** How many events currently hold this type — what the archive dialog reports before migrating. */
    fun countEventsOfType(id: EventTypeId): Int

    /** How many type roster defaults name [positionId] — half of the position-delete warning. */
    fun countTargetsForPosition(positionId: PositionId): Int

}
