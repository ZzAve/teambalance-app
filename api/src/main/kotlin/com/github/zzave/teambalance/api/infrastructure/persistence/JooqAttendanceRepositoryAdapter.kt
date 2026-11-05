package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceId
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.ATTENDANCES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENTS
import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.ZoneOffset

/**
 * One call to a port method is one transaction (ADR-0018). The event is referenced by its uuid and
 * resolved to `events.id` inside the SQL, so no write reads the event table in a separate round trip.
 */
@Repository
class JooqAttendanceRepositoryAdapter(
    private val dsl: DSLContext,
) : AttendanceRepository {

    override fun findByEventId(eventId: EventId): List<Attendance> =
        selectAttendances().where(EVENTS.UUID.eq(eventId.value)).fetch { it.toAttendance() }

    override fun findByEventIds(eventIds: List<EventId>): List<Attendance> =
        if (eventIds.isEmpty()) emptyList()
        else selectAttendances().where(EVENTS.UUID.`in`(eventIds.map { it.value })).fetch { it.toAttendance() }

    override fun findByEventIdAndUserId(eventId: EventId, userId: UserId): Attendance? =
        selectAttendances()
            .where(EVENTS.UUID.eq(eventId.value))
            .and(ATTENDANCES.USER_ID.eq(userId.value))
            .fetchOne { it.toAttendance() }

    override fun findByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<Attendance> =
        if (eventIds.isEmpty()) emptyList()
        else selectAttendances()
            .where(ATTENDANCES.USER_ID.eq(userId.value))
            .and(EVENTS.UUID.`in`(eventIds.map { it.value }))
            .fetch { it.toAttendance() }

    // Upsert on (event, member): concurrent first responses each carry their own new uuid, and all but
    // the first must update the stored row instead of failing the unique constraint. Only the
    // response itself is rewritten, so the stored row keeps its identity and the returned attendance
    // is the persisted one.
    @Transactional
    override fun save(attendance: Attendance): Attendance {
        val stored = insertForEvent(attendance)
            .onConflict(ATTENDANCES.EVENT_ID, ATTENDANCES.USER_ID)
            .doUpdate()
            .set(ATTENDANCES.STATE, DSL.excluded(ATTENDANCES.STATE))
            .set(ATTENDANCES.UPDATED_AT, DSL.excluded(ATTENDANCES.UPDATED_AT))
            .set(ATTENDANCES.CHANGED_BY, DSL.excluded(ATTENDANCES.CHANGED_BY))
            .returning(ATTENDANCES.UUID, ATTENDANCES.STATE, ATTENDANCES.UPDATED_AT, ATTENDANCES.CHANGED_BY)
            .fetchOne() ?: throw EventNotFoundException(attendance.eventId)
        return attendance.copy(
            id = AttendanceId(stored.uuid),
            state = AttendanceState.valueOf(stored.state),
            updatedAt = stored.updatedAt.toInstant(),
            changedBy = UserId(stored.changedBy),
        )
    }

    // Each row resolves its own event: a batch may span events (Bulk Attend, ADR-0020). Insert-only;
    // a row that already exists fails the batch on the uuid or (event, user) unique constraint.
    @Transactional
    override fun saveAll(attendances: List<Attendance>): List<Attendance> {
        attendances.forEach {
            if (insertForEvent(it).execute() == 0) throw EventNotFoundException(it.eventId)
        }
        return attendances
    }

    // Returns exactly the rows deleted: a repeat finds nothing, so Undo is idempotent.
    override fun deleteByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<EventId> {
        if (eventIds.isEmpty()) return emptyList()
        return dsl.deleteFrom(ATTENDANCES)
            .using(EVENTS)
            .where(ATTENDANCES.EVENT_ID.eq(EVENTS.ID))
            .and(ATTENDANCES.USER_ID.eq(userId.value))
            .and(EVENTS.UUID.`in`(eventIds.map { it.value }))
            .returningResult(EVENTS.UUID)
            .fetch { EventId(it.value1()) }
    }

    private fun selectAttendances() =
        dsl.select(
            ATTENDANCES.UUID,
            EVENTS.UUID,
            ATTENDANCES.USER_ID,
            ATTENDANCES.STATE,
            ATTENDANCES.UPDATED_AT,
            ATTENDANCES.CHANGED_BY,
        ).from(ATTENDANCES).join(EVENTS).on(ATTENDANCES.EVENT_ID.eq(EVENTS.ID))

    private fun insertForEvent(attendance: Attendance) =
        dsl.insertInto(
            ATTENDANCES,
            ATTENDANCES.UUID,
            ATTENDANCES.EVENT_ID,
            ATTENDANCES.USER_ID,
            ATTENDANCES.STATE,
            ATTENDANCES.UPDATED_AT,
            ATTENDANCES.CHANGED_BY,
        ).select(
            DSL.select(
                DSL.`val`(attendance.id.value),
                EVENTS.ID,
                DSL.`val`(attendance.userId.value),
                DSL.`val`(attendance.state.name),
                DSL.`val`(attendance.updatedAt.atOffset(ZoneOffset.UTC)),
                DSL.`val`(attendance.changedBy.value),
            ).from(EVENTS).where(EVENTS.UUID.eq(attendance.eventId.value)),
        )
}

private fun Record.toAttendance() = Attendance(
    id = AttendanceId(get(ATTENDANCES.UUID)),
    eventId = EventId(get(EVENTS.UUID)),
    userId = UserId(get(ATTENDANCES.USER_ID)),
    state = AttendanceState.valueOf(get(ATTENDANCES.STATE)),
    updatedAt = get(ATTENDANCES.UPDATED_AT).toInstant(),
    changedBy = UserId(get(ATTENDANCES.CHANGED_BY)),
)
