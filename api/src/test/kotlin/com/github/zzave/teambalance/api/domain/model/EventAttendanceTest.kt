package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID

/**
 * Pure folds over the resolved attendance picture of an event (the EventAttendance projection).
 * No Spring, no DB — the lowest layer that proves the "response-row-state, else NOT_RESPONDED" rule
 * and the summary / roster / role-breakdown derivations that used to be transcribed three times in
 * AttendanceService (and re-queried per event, causing the listing N+1).
 */
class EventAttendanceTest : FunSpec({

    val eventId = UUID.randomUUID()

    fun member(name: String, position: String? = null) = TeamMember(
        userId = UUID.randomUUID(),
        displayName = name,
        role = "USER",
        positionId = null,
        position = position,
        onboarded = true,
    )

    fun TeamMember.responded(state: AttendanceState) = Attendance(
        id = UUID.randomUUID(),
        eventId = eventId,
        userId = userId,
        state = state,
        updatedAt = Instant.EPOCH,
        changedBy = userId,
    )

    test("a member with no response row resolves to NOT_RESPONDED") {
        val alice = member("Alice")

        val projection = EventAttendance.resolve(members = listOf(alice), responses = emptyList())

        projection.entries.single().state shouldBe AttendanceState.NOT_RESPONDED
    }

    test("summary counts every current member by resolved state") {
        val attending = member("A")
        val maybe = member("M")
        val silent = member("N")

        val projection = EventAttendance.resolve(
            members = listOf(attending, maybe, silent),
            responses = listOf(
                attending.responded(AttendanceState.ATTENDING),
                maybe.responded(AttendanceState.MAYBE),
            ),
        )

        projection.summary() shouldBe mapOf(
            AttendanceState.ATTENDING to 1,
            AttendanceState.MAYBE to 1,
            AttendanceState.ABSENT to 0,
            AttendanceState.NOT_RESPONDED to 1,
        )
    }

    test("a stale response from someone no longer on the roster is ignored") {
        val current = member("Current")
        val departed = member("Departed")

        val projection = EventAttendance.resolve(
            members = listOf(current),
            responses = listOf(departed.responded(AttendanceState.ATTENDING)),
        )

        projection.entries.map { it.member } shouldBe listOf(current)
        projection.summary()[AttendanceState.ATTENDING] shouldBe 0
    }

    test("role breakdown groups only ATTENDING members by position, most-attended first then alphabetical") {
        val s1 = member("S1", position = "Setter")
        val s2 = member("S2", position = "Setter")
        val libero = member("L", position = "Libero")
        val maybeSetter = member("MS", position = "Setter")
        val unpositioned = member("U", position = null)

        val projection = EventAttendance.resolve(
            members = listOf(s1, s2, libero, maybeSetter, unpositioned),
            responses = listOf(
                s1.responded(AttendanceState.ATTENDING),
                s2.responded(AttendanceState.ATTENDING),
                libero.responded(AttendanceState.ATTENDING),
                maybeSetter.responded(AttendanceState.MAYBE),
                unpositioned.responded(AttendanceState.ATTENDING),
            ),
        )

        projection.attendingRoleBreakdown() shouldBe listOf(
            "Setter" to 2,
            "Libero" to 1,
            UNASSIGNED to 1,
        )
    }

    test("responseId is the row id when responded and null when not") {
        val responded = member("R")
        val silent = member("S")
        val row = responded.responded(AttendanceState.ATTENDING)

        val projection = EventAttendance.resolve(members = listOf(responded, silent), responses = listOf(row))

        projection.entries.first { it.member == responded }.responseId shouldBe row.id
        projection.entries.first { it.member == silent }.responseId shouldBe null
    }
})
