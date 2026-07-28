package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.CurrentTeamProvider
import com.github.zzave.teambalance.api.application.CurrentUserProvider
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.UNASSIGNED
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetAttendance
import com.github.zzave.teambalance.api.interfaces.generated.model.Attendance
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class AttendanceController(
    private val attendanceService: AttendanceService,
    private val currentUserProvider: CurrentUserProvider,
    private val currentTeamProvider: CurrentTeamProvider,
) : SetAttendance.Handler {

    override suspend fun setAttendance(request: SetAttendance.Request): SetAttendance.Response<*> {
        val teamId = currentTeamProvider.requireCurrentTeamId()
        val eventId = UUID.fromString(request.path.eventId)
        val userId = UUID.fromString(request.path.userId)
        val state = AttendanceState.valueOf(request.body.state)

        val attendance = attendanceService.setAttendance(
            teamId = teamId,
            eventId = eventId,
            userId = userId,
            state = state,
            changedBy = currentUserProvider.requireCurrentUserId(),
        ) ?: return SetAttendance.Response404(Unit)

        val member = attendanceService.findMember(userId)

        return SetAttendance.Response200(
            Attendance(
                id = attendance.id.toString(),
                eventId = attendance.eventId.toString(),
                userId = attendance.userId.toString(),
                displayName = member?.displayName ?: "Unknown",
                role = member?.position ?: UNASSIGNED,
                state = attendance.state.name,
            )
        )
    }
}
