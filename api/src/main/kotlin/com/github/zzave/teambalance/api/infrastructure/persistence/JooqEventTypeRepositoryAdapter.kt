package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HeadcountTarget
import com.github.zzave.teambalance.api.domain.model.HexColor
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionSlots
import com.github.zzave.teambalance.api.domain.model.PositionTarget
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENTS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_TYPES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_TYPE_POSITION_TARGETS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.tables.records.EventTypesRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Clock
import java.time.ZoneOffset
import java.util.UUID

/**
 * Event types, tenant-schema rows — every query here is scoped by the routed connection. A type is
 * stored across two tables: the row and its roster default's position targets. One call to a port
 * method is one transaction, so reads see one snapshot of both and writes replace the targets
 * together with the row.
 */
@Suppress("TooManyFunctions") // One per port method; splitting the port to satisfy a count would be artificial.
@Repository
class JooqEventTypeRepositoryAdapter(
    private val dsl: DSLContext,
    private val clock: Clock,
) : EventTypeRepository {

    @Transactional(readOnly = true)
    override fun findAll(): List<EventType> =
        dsl.selectFrom(EVENT_TYPES).orderBy(EVENT_TYPES.ID.asc()).fetch().withTargets(dsl)

    @Transactional(readOnly = true)
    override fun findById(id: EventTypeId): EventType? =
        dsl.selectFrom(EVENT_TYPES).where(EVENT_TYPES.UUID.eq(id.value)).fetch().withTargets(dsl).singleOrNull()

    @Transactional
    override fun create(name: EventTypeName, color: HexColor?, rosterDefault: RosterRequirement): EventType {
        val row = checkNotNull(
            dsl.insertInto(EVENT_TYPES)
                .set(EVENT_TYPES.UUID, UUID.randomUUID())
                .set(EVENT_TYPES.NAME, name.value)
                .set(EVENT_TYPES.COLOR, color?.value)
                .set(EVENT_TYPES.ARCHIVED, false)
                .set(EVENT_TYPES.TRACK_ROSTER, rosterDefault.trackRoster)
                .set(EVENT_TYPES.TOTAL_TARGET, rosterDefault.totalTarget?.value)
                .set(EVENT_TYPES.CREATED_AT, clock.instant().atOffset(ZoneOffset.UTC))
                .returning()
                .fetchOne(),
        )
        insertTargets(row.id, rosterDefault.positionTargets)
        return listOf(row).withTargets(dsl).single()
    }

    @Transactional
    override fun update(
        id: EventTypeId,
        name: EventTypeName,
        color: HexColor?,
        rosterDefault: RosterRequirement,
    ): EventType {
        val row = dsl.update(EVENT_TYPES)
            .set(EVENT_TYPES.NAME, name.value)
            .set(EVENT_TYPES.COLOR, color?.value)
            .set(EVENT_TYPES.TRACK_ROSTER, rosterDefault.trackRoster)
            .set(EVENT_TYPES.TOTAL_TARGET, rosterDefault.totalTarget?.value)
            .where(EVENT_TYPES.UUID.eq(id.value))
            .returning()
            .fetchOne() ?: throw EventTypeNotFoundException(id)
        dsl.deleteFrom(EVENT_TYPE_POSITION_TARGETS).where(EVENT_TYPE_POSITION_TARGETS.EVENT_TYPE_ID.eq(row.id)).execute()
        insertTargets(row.id, rosterDefault.positionTargets)
        return listOf(row).withTargets(dsl).single()
    }

    /** Reassign-then-archive in ONE transaction: events never point at a type that is already hidden. */
    @Transactional
    override fun archive(id: EventTypeId, migrateEventsTo: EventTypeId?): EventType {
        val technicalId = technicalIdOf(id) ?: throw EventTypeNotFoundException(id)
        migrateEventsTo?.let { target ->
            val targetTechnicalId = technicalIdOf(target) ?: throw EventTypeNotFoundException(target)
            dsl.update(EVENTS)
                .set(EVENTS.EVENT_TYPE_ID, targetTechnicalId)
                .where(EVENTS.EVENT_TYPE_ID.eq(technicalId))
                .execute()
        }
        return setArchived(id, true)
    }

    @Transactional
    override fun unarchive(id: EventTypeId): EventType = setArchived(id, false)

    @Transactional(readOnly = true)
    override fun countTargetsForPosition(positionId: PositionId): Int =
        dsl.fetchCount(EVENT_TYPE_POSITION_TARGETS, EVENT_TYPE_POSITION_TARGETS.POSITION_ID.eq(positionId.value))

    private fun technicalIdOf(id: EventTypeId): Long? =
        dsl.select(EVENT_TYPES.ID).from(EVENT_TYPES).where(EVENT_TYPES.UUID.eq(id.value)).fetchOne(EVENT_TYPES.ID)

    private fun setArchived(id: EventTypeId, archived: Boolean): EventType =
        dsl.update(EVENT_TYPES)
            .set(EVENT_TYPES.ARCHIVED, archived)
            .where(EVENT_TYPES.UUID.eq(id.value))
            .returning()
            .fetchOne()
            ?.let { listOf(it).withTargets(dsl).single() }
            ?: throw EventTypeNotFoundException(id)

    private fun insertTargets(eventTypeId: Long, targets: List<PositionTarget>) {
        if (targets.isEmpty()) return
        dsl.batch(
            targets.map { target ->
                dsl.insertInto(EVENT_TYPE_POSITION_TARGETS)
                    .set(EVENT_TYPE_POSITION_TARGETS.EVENT_TYPE_ID, eventTypeId)
                    .set(EVENT_TYPE_POSITION_TARGETS.POSITION_ID, target.positionId.value)
                    .set(EVENT_TYPE_POSITION_TARGETS.TARGET_COUNT, target.slots.value)
            },
        ).execute()
    }
}

private fun EventTypesRecord.toDomain(positionTargets: List<PositionTarget>) = EventType(
    id = EventTypeId(uuid),
    name = EventTypeName(name),
    color = color?.let(::HexColor),
    archived = archived,
    rosterDefault = RosterRequirement(
        trackRoster = trackRoster,
        totalTarget = totalTarget?.let(::HeadcountTarget),
        positionTargets = positionTargets,
    ),
)

/** The domain types for [this] rows, with their position targets read in one grouped query. */
internal fun List<EventTypesRecord>.withTargets(dsl: DSLContext): List<EventType> {
    if (isEmpty()) return emptyList()
    val targetsByType = dsl.select(
        EVENT_TYPE_POSITION_TARGETS.EVENT_TYPE_ID,
        EVENT_TYPE_POSITION_TARGETS.POSITION_ID,
        EVENT_TYPE_POSITION_TARGETS.TARGET_COUNT,
    )
        .from(EVENT_TYPE_POSITION_TARGETS)
        .where(EVENT_TYPE_POSITION_TARGETS.EVENT_TYPE_ID.`in`(map { it.id }))
        .fetchGroups(EVENT_TYPE_POSITION_TARGETS.EVENT_TYPE_ID)
    return map { type ->
        type.toDomain(
            targetsByType[type.id].orEmpty()
                .map {
                    PositionTarget(
                        positionId = PositionId(it[EVENT_TYPE_POSITION_TARGETS.POSITION_ID]),
                        slots = PositionSlots(it[EVENT_TYPE_POSITION_TARGETS.TARGET_COUNT]),
                    )
                }
                // UUID order, not database order, so the list reads as it did when read through Hibernate.
                .sortedBy { it.positionId.value },
        )
    }
}
