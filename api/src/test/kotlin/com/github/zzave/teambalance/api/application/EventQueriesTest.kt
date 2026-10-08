package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceId
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionKind
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID

private class QueryFakeAttendanceRepo(private val rows: List<Attendance>) : AttendanceRepository {
    override fun findByEventId(eventId: EventId): List<Attendance> = rows.filter { it.eventId == eventId }
    override fun findByEventIds(eventIds: List<EventId>): List<Attendance> = rows.filter { it.eventId in eventIds }
    override fun findByEventIdAndUserId(eventId: EventId, userId: UserId): Attendance? = error("unused")
    override fun findByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<Attendance> = error("unused")
    override fun save(attendance: Attendance): Attendance = error("unused")
    override fun saveAll(attendances: List<Attendance>): List<Attendance> = error("unused")
    override fun deleteByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<EventId> = error("unused")
}

private class QueryFakeSubstituteRepo(
    private val attendance: Map<EventId, List<SubstituteAttendance>>,
) : SubstituteRepository {
    override fun findAttendanceByEventIds(eventIds: List<EventId>): Map<EventId, List<SubstituteAttendance>> =
        attendance.filterKeys { it in eventIds }

    override fun list(): List<Substitute> = error("unused")
    override fun create(name: DisplayName, positionId: PositionId?, createdBy: UserId): Substitute = error("unused")
    override fun update(id: SubstituteId, name: DisplayName, positionId: PositionId?): Substitute? = error("unused")
    override fun delete(id: SubstituteId) = error("unused")
    override fun exists(id: SubstituteId): Boolean = error("unused")
    override fun countEvents(id: SubstituteId): Int = error("unused")
    override fun setAttendance(
        eventId: EventId,
        substituteId: SubstituteId,
        state: AttendanceState,
        changedBy: UserId,
        at: Instant,
    ): SubstituteAttendance? = error("unused")
    override fun removeAttendance(eventId: EventId, substituteId: SubstituteId): Boolean = error("unused")
}

private class QueryFakePositionRepo(private val positions: List<Position>) : PositionRepository {
    override fun list(): List<Position> = positions

    override fun create(label: PositionLabel): Position = error("unused")
    override fun rename(id: PositionId, label: PositionLabel): Position = error("unused")
    override fun setKind(id: PositionId, kind: PositionKind): Position = error("unused")
    override fun delete(id: PositionId) = error("unused")
    override fun findById(id: PositionId): Position? = error("unused")
    override fun exists(positionId: PositionId): Boolean = error("unused")
}

class EventQueriesTest : FunSpec() {
    init {
        val teamId = TeamId(UUID.randomUUID())
        val setter = Position(PositionId(UUID.randomUUID()), PositionLabel("Setter"))
        val ann = user("Ann")
        val bob = user("Bob")
        val leaver = user("Lee")
        val directory = TeamDirectory().apply {
            register(ann, bob, leaver)
            join(ann.id, teamId)
            join(bob.id, teamId)
        }
        val scope = TeamScope(ann.id, teamId)
        val training = event("Training")
        val match = event("Match")

        fun response(event: Event, member: User, state: AttendanceState) = Attendance(
            id = AttendanceId.random(),
            eventId = event.id,
            userId = member.id,
            state = state,
            updatedAt = Instant.EPOCH,
            changedBy = member.id,
        )

        fun queries(
            responses: List<Attendance> = emptyList(),
            substitutes: Map<EventId, List<SubstituteAttendance>> = emptyMap(),
            positions: List<Position> = listOf(setter),
        ) = EventQueries(
            QueryFakeAttendanceRepo(responses),
            QueryFakeSubstituteRepo(substitutes),
            directory.teamMemberRepository(),
            QueryFakePositionRepo(positions),
        )

        test("each event comes back with its own attendance, in the order given") {
            val result = queries(
                responses = listOf(
                    response(training, ann, AttendanceState.ATTENDING),
                    response(match, ann, AttendanceState.ABSENT),
                ),
            ).attended(scope, listOf(match, training))

            result.map { it.event } shouldBe listOf(match, training)
            result.map { it.attendance.stateOf(ann.id) } shouldBe
                listOf(AttendanceState.ABSENT, AttendanceState.ATTENDING)
        }

        test("a member without a response row is Not Responded") {
            val attended = queries().attended(scope, training)

            attended.attendance.entries.map { it.member.userId to it.state }.toSet() shouldBe
                setOf(ann.id to AttendanceState.NOT_RESPONDED, bob.id to AttendanceState.NOT_RESPONDED)
        }

        test("a response from someone no longer on the roster is ignored") {
            val attended = queries(
                responses = listOf(response(training, leaver, AttendanceState.ATTENDING)),
            ).attended(scope, training)

            attended.attendance.entries.map { it.member.userId }.toSet() shouldBe setOf(ann.id, bob.id)
            attended.attendance.summary()[AttendanceState.ATTENDING] shouldBe 0
        }

        test("substitutes are attached to the event they were added to") {
            val sub = SubstituteAttendance(
                substitute = Substitute(SubstituteId(UUID.randomUUID()), DisplayName("Sam"), null, null),
                state = AttendanceState.ATTENDING,
                changedBy = ann.id,
                updatedAt = Instant.EPOCH,
            )

            val result = queries(substitutes = mapOf(training.id to listOf(sub))).attended(scope, listOf(training, match))

            result.map { it.attendance.substitutes } shouldBe listOf(listOf(sub), emptyList())
        }

        test("every event carries the same position vocabulary") {
            val result = queries().attended(scope, listOf(training, match))

            result.map { it.positions } shouldBe listOf(listOf(setter), listOf(setter))
        }

        test("the single-event form resolves that event the same way") {
            val q = queries(responses = listOf(response(training, bob, AttendanceState.MAYBE)))

            val single = q.attended(scope, training)

            single.event shouldBe training
            single.attendance.stateOf(bob.id) shouldBe AttendanceState.MAYBE
            single.positions shouldBe listOf(setter)
        }

        test("no events yields no results") {
            queries().attended(scope, emptyList()) shouldBe emptyList()
        }
    }

    private fun user(name: String) =
        User(id = UserId.random(), email = Email("${name.lowercase()}@test.com"), displayName = DisplayName(name))

    private fun event(title: String) = Event(
        id = EventId(UUID.randomUUID()),
        eventType = EventType(EventTypeId(UUID.randomUUID()), EventTypeName("Training"), null),
        title = EventTitle(title),
        description = null,
        startTime = Instant.EPOCH,
        endTime = Instant.EPOCH.plusSeconds(3600),
        location = null,
        recurringGroup = null,
        createdBy = UserId.random(),
        createdAt = Instant.EPOCH,
    )
}
