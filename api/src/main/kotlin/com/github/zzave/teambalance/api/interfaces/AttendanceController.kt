package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.domain.model.AttendanceId
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.UNASSIGNED
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetAttendance
import com.github.zzave.teambalance.api.interfaces.generated.model.Attendance
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class AttendanceController(
    private val attendanceService: AttendanceService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : SetAttendance.Handler {

    override suspend fun setAttendance(request: SetAttendance.Request): SetAttendance.Response<*> {
        val teamId = currentTeamGateway.requireCurrentTeamId()
        val eventId = request.path.eventId.consumeEventId()
        val userId = UUID.fromString(request.path.userId)
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
                userId = attendance.userId.toString(),
                displayName = member?.displayName ?: "Unknown",
                role = member?.position ?: UNASSIGNED,
                state = attendance.state.name,
            )
        )
    }
}

// The Wirespec edge for a response row's identity — the contract still carries a bare UUID string.
// internal so EventController's attendance entries convert the same way.
internal fun AttendanceId.produce(): String = value.toString()
