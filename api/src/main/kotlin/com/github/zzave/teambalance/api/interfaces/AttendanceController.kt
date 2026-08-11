package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.domain.model.AttendanceId
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.MemberAttendance
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.UNASSIGNED
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetAttendance
import com.github.zzave.teambalance.api.interfaces.generated.model.Attendance
import com.github.zzave.teambalance.api.interfaces.generated.model.AttendanceEntry
import com.github.zzave.teambalance.api.interfaces.generated.model.AttendanceState as GeneratedAttendanceState
import com.github.zzave.teambalance.api.interfaces.generated.model.AttendanceSummary
import com.github.zzave.teambalance.api.interfaces.generated.model.RoleCount
import org.springframework.web.bind.annotation.RestController

@RestController
class AttendanceController(
    private val attendanceService: AttendanceService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : SetAttendance.Handler {

    override suspend fun setAttendance(request: SetAttendance.Request): SetAttendance.Response<*> {
        val teamId = currentTeamGateway.requireCurrentTeamId()
        val eventId = request.path.eventId.consumeEventId()
        val userId = request.path.userId.consumeUserId()
        val state = AttendanceState.valueOf(request.body.state)

        val attendance = attendanceService.setAttendance(
            teamId = teamId,
            eventId = eventId,
            userId = userId,
            state = state,
            changedBy = currentUserGateway.requireCurrentUserId(),
        ) ?: return SetAttendance.Response404(Unit)

        val member = attendanceService.findMember(userId)

        return SetAttendance.Response200(
            Attendance(
                id = attendance.id.produce(),
                eventId = attendance.eventId.produce(),
                userId = attendance.userId.produce(),
                displayName = member?.displayName?.value ?: "Unknown",
                role = (member?.position ?: UNASSIGNED).value,
                state = attendance.state.name,
            )
        )
    }
}

// The Wirespec edge for a response row's identity — the contract still carries a bare UUID string.
// internal so EventController's attendance entries convert the same way.
internal fun AttendanceId.produce(): String = value.toString()

// The rest of the attendance Wirespec edge. It lives here rather than in EventController.kt — where
// it grew, because the event payloads embed the roster — so that all attendance-shaped mapping sits
// in one file next to the identity edge above. internal: EventController's event payloads call it.
internal fun MemberAttendance.produce() = AttendanceEntry(
    // A responded member keys off their real row; a not-responded member falls back to their user id.
    id = responseId?.produce() ?: member.userId.produce(),
    userId = member.userId.produce(),
    displayName = member.displayName.value,
    role = (member.position ?: UNASSIGNED).value,
    state = state.produce(),
)

internal fun Map<AttendanceState, Int>.produce(roleBreakdown: List<Pair<PositionLabel, Int>>) =
    AttendanceSummary(
        attending = (this[AttendanceState.ATTENDING] ?: 0).toLong(),
        maybe = (this[AttendanceState.MAYBE] ?: 0).toLong(),
        absent = (this[AttendanceState.ABSENT] ?: 0).toLong(),
        notResponded = (this[AttendanceState.NOT_RESPONDED] ?: 0).toLong(),
        roleBreakdown = roleBreakdown.map { (role, count) ->
            RoleCount(role = role.value, attending = count.toLong())
        },
    )

internal fun AttendanceState.produce() = GeneratedAttendanceState.valueOf(name)
