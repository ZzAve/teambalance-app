package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.exception.EventTypeNotFoundException
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventDescription
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventLocation
import com.github.zzave.teambalance.api.domain.model.EventReference
import com.github.zzave.teambalance.api.domain.model.EventReferenceText
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.HeadcountTarget
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionSlots
import com.github.zzave.teambalance.api.domain.model.PositionTarget
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENTS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_POSITION_TARGETS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_REFERENCES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENT_TYPES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.tables.records.EventsRecord
import org.jooq.DSLContext
import org.jooq.Record
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

/**
 * Events, tenant-schema rows — every query here is scoped by the routed connection. An event is
 * stored across three tables: the row, its ordered references and its roster-override position
 * targets. One call to a port method is one transaction, so a read sees one snapshot of all three, a
 * write replaces the children together with the row, and a batch commits or rolls back whole.
 */
// One method per port method plus the persist/remove primitives, which is one over detekt's stock
// ceiling. Splitting the adapter would mean splitting EventRepository, and the port is deliberately
// whole: the batch methods exist so a use case can state "these rows go together" in a single call,
// which only works while one adapter owns them all.
@Suppress("TooManyFunctions")
@Repository
class JooqEventRepositoryAdapter(
    private val dsl: DSLContext,
) : EventRepository {

    @Transactional(readOnly = true)
    override fun findById(id: EventId): Event? =
        dsl.selectFrom(EVENTS).where(EVENTS.UUID.eq(id.value)).fetch().toEvents().singleOrNull()

    @Transactional(readOnly = true)
    override fun findByIds(ids: List<EventId>): List<Event> =
        if (ids.isEmpty()) emptyList()
        else dsl.selectFrom(EVENTS).where(EVENTS.UUID.`in`(ids.map { it.value })).fetch().toEvents()

    @Transactional(readOnly = true)
    override fun findUpcoming(since: Instant): List<Event> =
        dsl.selectFrom(EVENTS)
            .where(EVENTS.START_TIME.gt(since.atOffset(ZoneOffset.UTC)))
            .orderBy(EVENTS.START_TIME.asc())
            .fetch()
            .toEvents()

    /** The cap is a SQL `LIMIT` (#310): trimming the list afterwards would already have paid for every row. */
    @Transactional(readOnly = true)
    override fun findMostRecent(limit: Int): List<Event> =
        dsl.selectFrom(EVENTS).orderBy(EVENTS.START_TIME.desc()).limit(limit).fetch().toEvents()

    @Transactional(readOnly = true)
    override fun findByRecurringGroup(group: UUID): List<Event> =
        dsl.selectFrom(EVENTS)
            .where(EVENTS.RECURRING_GROUP.eq(group))
            .orderBy(EVENTS.START_TIME.asc())
            .fetch()
            .toEvents()

    @Transactional
    override fun save(event: Event): Event = persist(event)

    @Transactional
    override fun saveAll(events: List<Event>): List<Event> = events.map { persist(it) }

    @Transactional
    override fun deleteById(id: EventId) = remove(id)

    @Transactional
    override fun deleteAllById(ids: List<EventId>) = ids.forEach { remove(it) }

    @Transactional(readOnly = true)
    override fun countTargetsForPosition(positionId: PositionId): Int =
        dsl.fetchCount(EVENT_POSITION_TARGETS, EVENT_POSITION_TARGETS.POSITION_ID.eq(positionId.value))

    private fun persist(event: Event): Event {
        val eventTypeId = dsl.select(EVENT_TYPES.ID)
            .from(EVENT_TYPES)
            .where(EVENT_TYPES.UUID.eq(event.eventType.id.value))
            .fetchOne(EVENT_TYPES.ID)
            ?: throw EventTypeNotFoundException(event.eventType.id)
        val row = event.toRecord(eventTypeId)
        val eventRowId = checkNotNull(
            dsl.insertInto(EVENTS)
                .set(row)
                .onConflict(EVENTS.UUID)
                .doUpdate()
                .set(row)
                .returning(EVENTS.ID)
                .fetchOne(),
        ).id
        dsl.deleteFrom(EVENT_REFERENCES).where(EVENT_REFERENCES.EVENT_ID.eq(eventRowId)).execute()
        dsl.deleteFrom(EVENT_POSITION_TARGETS).where(EVENT_POSITION_TARGETS.EVENT_ID.eq(eventRowId)).execute()
        insertReferences(eventRowId, event.references)
        insertTargets(eventRowId, event.rosterOverride?.positionTargets.orEmpty())
        return event
    }

    private fun insertReferences(eventRowId: Long, references: List<EventReference>) {
        if (references.isEmpty()) return
        dsl.batch(
            references.mapIndexed { index, reference ->
                dsl.insertInto(EVENT_REFERENCES)
                    .set(EVENT_REFERENCES.EVENT_ID, eventRowId)
                    .set(EVENT_REFERENCES.POSITION, index)
                    .set(EVENT_REFERENCES.TITLE, reference.title?.value)
                    .set(EVENT_REFERENCES.URL, reference.url.value)
            },
        ).execute()
    }

    private fun insertTargets(eventRowId: Long, targets: List<PositionTarget>) {
        if (targets.isEmpty()) return
        dsl.batch(
            targets.map { target ->
                dsl.insertInto(EVENT_POSITION_TARGETS)
                    .set(EVENT_POSITION_TARGETS.EVENT_ID, eventRowId)
                    .set(EVENT_POSITION_TARGETS.POSITION_ID, target.positionId.value)
                    .set(EVENT_POSITION_TARGETS.TARGET_COUNT, target.slots.value)
            },
        ).execute()
    }

    private fun remove(id: EventId) {
        val deleted = dsl.deleteFrom(EVENTS).where(EVENTS.UUID.eq(id.value)).execute()
        if (deleted == 0) throw EventNotFoundException(id)
    }

    private fun List<EventsRecord>.toEvents(): List<Event> {
        if (isEmpty()) return emptyList()
        val eventRowIds = map { it.id }
        val typesByRowId = eventTypesByRowId(map { it.eventTypeId }.distinct())
        val referencesByEvent = dsl.select(EVENT_REFERENCES.EVENT_ID, EVENT_REFERENCES.TITLE, EVENT_REFERENCES.URL)
            .from(EVENT_REFERENCES)
            .where(EVENT_REFERENCES.EVENT_ID.`in`(eventRowIds))
            .orderBy(EVENT_REFERENCES.EVENT_ID, EVENT_REFERENCES.POSITION)
            .fetchGroups(EVENT_REFERENCES.EVENT_ID)
        val targetsByEvent = dsl.select(
            EVENT_POSITION_TARGETS.EVENT_ID,
            EVENT_POSITION_TARGETS.POSITION_ID,
            EVENT_POSITION_TARGETS.TARGET_COUNT,
        )
            .from(EVENT_POSITION_TARGETS)
            .where(EVENT_POSITION_TARGETS.EVENT_ID.`in`(eventRowIds))
            .fetchGroups(EVENT_POSITION_TARGETS.EVENT_ID)
        return map { row ->
            row.toDomain(
                eventType = typesByRowId.getValue(row.eventTypeId),
                references = referencesByEvent[row.id].orEmpty().map { it.toReference() },
                positionTargets = targetsByEvent[row.id].orEmpty()
                    .map { it.toTarget() }
                    // UUID order, not database order, so the list reads as it did when read through Hibernate.
                    .sortedBy { it.positionId.value },
            )
        }
    }

    private fun eventTypesByRowId(rowIds: List<Long>): Map<Long, EventType> {
        val rows = dsl.selectFrom(EVENT_TYPES).where(EVENT_TYPES.ID.`in`(rowIds)).fetch()
        return rows.map { it.id }.zip(rows.withTargets(dsl)).toMap()
    }
}

private fun Record.toReference() = EventReference(
    title = get(EVENT_REFERENCES.TITLE)?.let(::EventReferenceText),
    url = EventReference.Url(get(EVENT_REFERENCES.URL)),
)

private fun Record.toTarget() = PositionTarget(
    positionId = PositionId(get(EVENT_POSITION_TARGETS.POSITION_ID)),
    slots = PositionSlots(get(EVENT_POSITION_TARGETS.TARGET_COUNT)),
)

private fun Event.toRecord(eventTypeId: Long) = EventsRecord().also {
    it.uuid = id.value
    it.eventTypeId = eventTypeId
    it.title = title.value
    it.description = description?.value
    it.startTime = startTime.atOffset(ZoneOffset.UTC)
    it.endTime = endTime.atOffset(ZoneOffset.UTC)
    it.location = location?.value
    it.recurringGroup = recurringGroup
    it.createdBy = createdBy.value
    it.createdAt = createdAt.atOffset(ZoneOffset.UTC)
    // The domain's own revision time, not createdAt.
    it.updatedAt = updatedAt.atOffset(ZoneOffset.UTC)
    it.rosterTrackRoster = rosterOverride?.trackRoster
    it.rosterTotalTarget = rosterOverride?.totalTarget?.value
}

private fun EventsRecord.toDomain(
    eventType: EventType,
    references: List<EventReference>,
    positionTargets: List<PositionTarget>,
) = Event(
    id = EventId(uuid),
    eventType = eventType,
    title = EventTitle(title),
    description = description?.let(::EventDescription),
    startTime = startTime.toInstant(),
    endTime = endTime.toInstant(),
    location = location?.let(::EventLocation),
    references = references,
    recurringGroup = recurringGroup,
    createdBy = UserId(createdBy),
    createdAt = createdAt.toInstant(),
    updatedAt = updatedAt.toInstant(),
    // Null trackRoster IS "no override" — this event inherits its type's default (see Event.rosterOverride).
    rosterOverride = rosterTrackRoster?.let {
        RosterRequirement(
            trackRoster = it,
            totalTarget = rosterTotalTarget?.let(::HeadcountTarget),
            positionTargets = positionTargets,
        )
    },
)
