package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.SubstituteNameTakenException
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.ShirtNumber
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.EVENTS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.POSITIONS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.SUBSTITUTES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.SUBSTITUTE_ATTENDANCES
import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

/**
 * Substitutes and their attendance, tenant-schema rows (ADR-0033). Reads join the Substitute's name
 * and Position label in, so a caller gets a whole [SubstituteAttendance] from one query.
 */
@Repository
class JooqSubstituteRepositoryAdapter(
    private val dsl: DSLContext,
) : SubstituteRepository {

    override fun list(): List<Substitute> =
        dsl.substitutesWithPosition()
            .orderBy(DSL.lower(SUBSTITUTES.NAME))
            .fetch { it.toSubstitute() }

    @Transactional
    override fun create(name: DisplayName, positionId: PositionId?, createdBy: UserId): Substitute {
        val id = UUID.randomUUID()
        refusingDuplicate(NAME_INDEX, { SubstituteNameTakenException(name.value) }) {
            dsl.insertInto(SUBSTITUTES)
                .set(SUBSTITUTES.ID, id)
                .set(SUBSTITUTES.NAME, name.value)
                .set(SUBSTITUTES.POSITION_ID, positionId?.value)
                .set(SUBSTITUTES.CREATED_BY, createdBy.value)
                .execute()
        }
        return checkNotNull(findSubstitute(id)) { "Substitute $id disappeared during create" }
    }

    @Transactional
    override fun update(
        id: SubstituteId,
        name: DisplayName,
        positionId: PositionId?,
        shirtNumber: ShirtNumber?,
    ): Substitute? {
        val updated = refusingDuplicate(NAME_INDEX, { SubstituteNameTakenException(name.value) }) {
            dsl.update(SUBSTITUTES)
                .set(SUBSTITUTES.NAME, name.value)
                .set(SUBSTITUTES.POSITION_ID, positionId?.value)
                .set(SUBSTITUTES.SHIRT_NUMBER, shirtNumber?.value?.toShort())
                .where(SUBSTITUTES.ID.eq(id.value))
                .execute()
        }
        return if (updated == 0) null else findSubstitute(id.value)
    }

    override fun delete(id: SubstituteId) {
        dsl.deleteFrom(SUBSTITUTES).where(SUBSTITUTES.ID.eq(id.value)).execute()
    }

    override fun exists(id: SubstituteId): Boolean = dsl.fetchExists(SUBSTITUTES, SUBSTITUTES.ID.eq(id.value))

    override fun countEvents(id: SubstituteId): Int =
        dsl.fetchCount(SUBSTITUTE_ATTENDANCES, SUBSTITUTE_ATTENDANCES.SUBSTITUTE_ID.eq(id.value))

    /**
     * One statement both adds and updates, keyed by the (event, substitute) pair. The event's
     * technical id is looked up by its uuid inside the statement, so an unknown event inserts nothing
     * and the returned count is how the adapter tells the caller.
     */
    @Transactional
    override fun setAttendance(
        eventId: EventId,
        substituteId: SubstituteId,
        state: AttendanceState,
        changedBy: UserId,
        at: Instant,
    ): SubstituteAttendance? {
        val written = dsl.insertInto(SUBSTITUTE_ATTENDANCES)
            .columns(
                SUBSTITUTE_ATTENDANCES.EVENT_ID,
                SUBSTITUTE_ATTENDANCES.SUBSTITUTE_ID,
                SUBSTITUTE_ATTENDANCES.STATE,
                SUBSTITUTE_ATTENDANCES.CHANGED_BY,
                SUBSTITUTE_ATTENDANCES.UPDATED_AT,
            )
            .select(
                dsl.select(
                    EVENTS.ID,
                    DSL.`val`(substituteId.value, SUBSTITUTE_ATTENDANCES.SUBSTITUTE_ID),
                    DSL.`val`(state.name, SUBSTITUTE_ATTENDANCES.STATE),
                    DSL.`val`(changedBy.value, SUBSTITUTE_ATTENDANCES.CHANGED_BY),
                    DSL.`val`(at.atOffset(ZoneOffset.UTC), SUBSTITUTE_ATTENDANCES.UPDATED_AT),
                ).from(EVENTS).where(EVENTS.UUID.eq(eventId.value)),
            )
            .onConflict(SUBSTITUTE_ATTENDANCES.EVENT_ID, SUBSTITUTE_ATTENDANCES.SUBSTITUTE_ID)
            .doUpdate()
            .set(SUBSTITUTE_ATTENDANCES.STATE, DSL.excluded(SUBSTITUTE_ATTENDANCES.STATE))
            .set(SUBSTITUTE_ATTENDANCES.CHANGED_BY, DSL.excluded(SUBSTITUTE_ATTENDANCES.CHANGED_BY))
            .set(SUBSTITUTE_ATTENDANCES.UPDATED_AT, DSL.excluded(SUBSTITUTE_ATTENDANCES.UPDATED_AT))
            .execute()
        if (written == 0) return null
        return attendanceOn(listOf(eventId.value)).single { it.second.substitute.id == substituteId }.second
    }

    override fun removeAttendance(eventId: EventId, substituteId: SubstituteId): Boolean =
        dsl.deleteFrom(SUBSTITUTE_ATTENDANCES)
            .where(SUBSTITUTE_ATTENDANCES.SUBSTITUTE_ID.eq(substituteId.value))
            .and(
                SUBSTITUTE_ATTENDANCES.EVENT_ID.eq(
                    dsl.select(EVENTS.ID).from(EVENTS).where(EVENTS.UUID.eq(eventId.value)),
                ),
            )
            .execute() > 0

    override fun findAttendanceByEventIds(eventIds: List<EventId>): Map<EventId, List<SubstituteAttendance>> =
        if (eventIds.isEmpty()) {
            emptyMap()
        } else {
            attendanceOn(eventIds.map { it.value }).groupBy({ it.first }, { it.second })
        }

    private fun findSubstitute(id: UUID): Substitute? =
        dsl.substitutesWithPosition().where(SUBSTITUTES.ID.eq(id)).fetchOne { it.toSubstitute() }

    private fun attendanceOn(eventUuids: List<UUID>): List<Pair<EventId, SubstituteAttendance>> =
        dsl.select(
            EVENTS.UUID,
            SUBSTITUTES.ID,
            SUBSTITUTES.NAME,
            SUBSTITUTES.POSITION_ID,
            POSITIONS.LABEL,
            SUBSTITUTES.SHIRT_NUMBER,
            SUBSTITUTE_ATTENDANCES.STATE,
            SUBSTITUTE_ATTENDANCES.CHANGED_BY,
            SUBSTITUTE_ATTENDANCES.UPDATED_AT,
        )
            .from(SUBSTITUTE_ATTENDANCES)
            .join(EVENTS).on(EVENTS.ID.eq(SUBSTITUTE_ATTENDANCES.EVENT_ID))
            .join(SUBSTITUTES).on(SUBSTITUTES.ID.eq(SUBSTITUTE_ATTENDANCES.SUBSTITUTE_ID))
            .leftJoin(POSITIONS).on(POSITIONS.ID.eq(SUBSTITUTES.POSITION_ID))
            .where(EVENTS.UUID.`in`(eventUuids))
            .orderBy(DSL.lower(SUBSTITUTES.NAME))
            .fetch {
                EventId(it[EVENTS.UUID]) to SubstituteAttendance(
                    substitute = it.toSubstitute(),
                    state = AttendanceState.valueOf(it[SUBSTITUTE_ATTENDANCES.STATE]),
                    changedBy = UserId(it[SUBSTITUTE_ATTENDANCES.CHANGED_BY]),
                    updatedAt = it[SUBSTITUTE_ATTENDANCES.UPDATED_AT].toInstant(),
                )
            }

}

private fun DSLContext.substitutesWithPosition() =
    select(SUBSTITUTES.ID, SUBSTITUTES.NAME, SUBSTITUTES.POSITION_ID, POSITIONS.LABEL, SUBSTITUTES.SHIRT_NUMBER)
        .from(SUBSTITUTES)
        .leftJoin(POSITIONS).on(POSITIONS.ID.eq(SUBSTITUTES.POSITION_ID))

private fun Record.toSubstitute() = Substitute(
    id = SubstituteId(this[SUBSTITUTES.ID]),
    name = DisplayName(this[SUBSTITUTES.NAME]),
    positionId = this[SUBSTITUTES.POSITION_ID]?.let(::PositionId),
    position = this[POSITIONS.LABEL]?.let(::PositionLabel),
    shirtNumber = this[SUBSTITUTES.SHIRT_NUMBER]?.let { ShirtNumber(it.toInt()) },
)

// The service refuses a taken name before writing; uq_substitutes_name catches the one taken in
// between, by a concurrent create. The statement runs inside the write, so the refusal happens here
// rather than at commit and the caller hears the same SubstituteNameTakenException (409) either way.
private const val NAME_INDEX = "uq_substitutes_name"
