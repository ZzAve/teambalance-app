package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceId
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.HeadcountTarget
import com.github.zzave.teambalance.api.domain.model.Position
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.PositionSlots
import com.github.zzave.teambalance.api.domain.model.PositionTarget
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.RosterRequirement
import com.github.zzave.teambalance.api.domain.model.RosterState
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamMember
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.SubstituteRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID

private class RecordingAttendanceRepo(private val rows: List<Attendance>) : AttendanceRepository {
    var batchCalls = 0
    var singleCalls = 0

    override fun findByEventId(eventId: EventId): List<Attendance> {
        singleCalls++
        return rows.filter { it.eventId == eventId }
    }

    override fun findByEventIds(eventIds: List<EventId>): List<Attendance> {
        batchCalls++
        return rows.filter { it.eventId in eventIds }
    }

    override fun findByEventIdAndUserId(eventId: EventId, userId: UserId): Attendance? = error("unused")
    override fun findByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<Attendance> = error("unused")
    override fun save(attendance: Attendance): Attendance = error("unused")
    override fun saveAll(attendances: List<Attendance>): List<Attendance> = error("unused")
    override fun deleteByUserIdAndEventIds(userId: UserId, eventIds: List<EventId>): List<EventId> = error("unused")
    override fun deleteByEventId(eventId: EventId) = error("unused")
}

private class SubstitutesOnEvents(private val byEvent: Map<EventId, List<SubstituteAttendance>>) : SubstituteRepository {
    override fun findAttendanceByEventIds(eventIds: List<EventId>): Map<EventId, List<SubstituteAttendance>> =
        byEvent.filterKeys { it in eventIds }

    override fun list(): List<Substitute> = error("unused")
    override fun create(name: DisplayName, positionId: PositionId?, createdBy: UserId): Substitute = error("unused")
    override fun update(
        id: SubstituteId,
        name: DisplayName,
        positionId: PositionId?,
        shirtNumber: com.github.zzave.teambalance.api.domain.model.ShirtNumber?,
    ): Substitute? = error("unused")
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

private class FixedPositions(private val positions: List<Position>) : PositionRepository {
    override fun list(): List<Position> = positions
    override fun create(label: PositionLabel): Position = error("unused")
    override fun rename(id: PositionId, label: PositionLabel): Position = error("unused")
    override fun setKind(id: PositionId, kind: com.github.zzave.teambalance.api.domain.model.PositionKind): Position =
        error("unused")
    override fun delete(id: PositionId) = error("unused")
    override fun findById(id: PositionId): Position? = error("unused")
    override fun exists(positionId: PositionId): Boolean = error("unused")
}

class EventResolverTest : FunSpec() {
    init {
        val teamId = TeamId(UUID.randomUUID())
        val setter = Position(PositionId(UUID.randomUUID()), PositionLabel("Setter"))
        val libero = Position(PositionId(UUID.randomUUID()), PositionLabel("Libero"))
        val anna = member("Anna", setter)
        val bram = member("Bram", libero)
        val cleo = member("Cleo", null)

        fun event(requirement: RosterRequirement) = Event(
            id = EventId(UUID.randomUUID()),
            eventType = EventType(EventTypeId(UUID.randomUUID()), EventTypeName("Training"), null, rosterDefault = requirement),
            title = EventTitle("Training"),
            description = null,
            startTime = Instant.parse("2026-09-01T18:00:00Z"),
            endTime = Instant.parse("2026-09-01T20:00:00Z"),
            location = null,
            recurringGroup = null,
            createdBy = anna.userId,
            createdAt = Instant.EPOCH,
        )

        fun answer(event: Event, who: TeamMember, state: AttendanceState) = Attendance(
            id = AttendanceId.random(),
            eventId = event.id,
            userId = who.userId,
            state = state,
            updatedAt = Instant.EPOCH,
            changedBy = who.userId,
        )

        fun resolver(
            members: List<TeamMember>,
            rows: List<Attendance> = emptyList(),
            substitutes: Map<EventId, List<SubstituteAttendance>> = emptyMap(),
            attendanceRepo: RecordingAttendanceRepo = RecordingAttendanceRepo(rows),
        ) = EventResolver(
            attendanceRepository = attendanceRepo,
            substituteRepository = SubstitutesOnEvents(substitutes),
            teamMemberRepository = object : TeamMemberRepository by TeamDirectory().teamMemberRepository() {
                override fun findByTeamId(teamId: TeamId): List<TeamMember> = members
            },
            positionRepository = FixedPositions(listOf(setter, libero)),
        )

        test("a current Member with no response is Not Responded") {
            val training = event(RosterRequirement(trackRoster = true))

            val resolved = resolver(listOf(anna)).resolve(teamId, training)

            resolved.attendance.stateOf(anna.userId) shouldBe AttendanceState.NOT_RESPONDED
            resolved.attendance.summary().getValue(AttendanceState.NOT_RESPONDED) shouldBe 1
        }

        test("a departed Member's response drops out") {
            val training = event(RosterRequirement(trackRoster = true))
            val rows = listOf(answer(training, anna, AttendanceState.ATTENDING), answer(training, bram, AttendanceState.ATTENDING))

            val resolved = resolver(members = listOf(anna), rows = rows).resolve(teamId, training)

            resolved.attendance.entries.map { it.member.userId } shouldBe listOf(anna.userId)
            resolved.roster.totalAttending.value shouldBe 1
        }

        test("an attending Substitute fills a spot but does not count toward the expected total") {
            val training = event(RosterRequirement(trackRoster = true, totalTarget = HeadcountTarget(2)))
            val substitute = SubstituteAttendance(
                substitute = Substitute(SubstituteId(UUID.randomUUID()), DisplayName("Sam"), libero.id, libero.label),
                state = AttendanceState.ATTENDING,
                changedBy = anna.userId,
                updatedAt = Instant.EPOCH,
            )

            val resolved = resolver(
                members = listOf(anna, bram),
                rows = listOf(answer(training, anna, AttendanceState.ATTENDING)),
                substitutes = mapOf(training.id to listOf(substitute)),
            ).resolve(teamId, training)

            resolved.roster.totalAttending.value shouldBe 2
            resolved.roster.substituteAttending.value shouldBe 1
            resolved.attendance.summary().values.sum() shouldBe 2
            resolved.roster.state shouldBe RosterState.HEADCOUNT_FULL
        }

        test("position targets win over a headcount") {
            val training = event(
                RosterRequirement(
                    trackRoster = true,
                    totalTarget = HeadcountTarget(1),
                    positionTargets = listOf(PositionTarget(libero.id, PositionSlots(1))),
                ),
            )

            val resolved = resolver(
                members = listOf(anna, bram, cleo),
                rows = listOf(answer(training, anna, AttendanceState.ATTENDING)),
            ).resolve(teamId, training)

            resolved.roster.state shouldBe RosterState.CRITICAL
        }

        test("the list form reads the response rows once for all events") {
            val events = (1..3).map { event(RosterRequirement(trackRoster = true)) }
            val attendanceRepo = RecordingAttendanceRepo(listOf(answer(events[1], anna, AttendanceState.MAYBE)))

            val resolved = resolver(members = listOf(anna), attendanceRepo = attendanceRepo).resolveAll(teamId, events)

            attendanceRepo.batchCalls shouldBe 1
            attendanceRepo.singleCalls shouldBe 0
            resolved.map { it.event.id } shouldBe events.map { it.id }
            resolved.map { it.attendance.stateOf(anna.userId) } shouldBe
                listOf(AttendanceState.NOT_RESPONDED, AttendanceState.MAYBE, AttendanceState.NOT_RESPONDED)
        }
    }

    private fun member(name: String, position: Position?) = TeamMember(
        userId = UserId.random(),
        displayName = DisplayName(name),
        permission = Role.USER,
        positionId = position?.id,
        position = position?.label,
        onboarded = true,
    )
}
