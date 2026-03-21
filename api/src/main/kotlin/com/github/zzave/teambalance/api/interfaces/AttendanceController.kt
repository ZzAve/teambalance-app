package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.interfaces.generated.Attendance
import com.github.zzave.teambalance.api.interfaces.generated.SetAttendanceEndpoint
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class AttendanceController(
    private val attendanceService: AttendanceService,
) : SetAttendanceEndpoint.Handler {

    override suspend fun setAttendance(request: SetAttendanceEndpoint.Request): SetAttendanceEndpoint.Response<*> {
        val eventId = UUID.fromString(request.path.eventId)
        val userId = UUID.fromString(request.path.userId)
        val state = AttendanceState.valueOf(request.body.state)

        val attendance = attendanceService.setAttendance(eventId, userId, state)
            ?: return SetAttendanceEndpoint.Response404(Unit)

        val displayName = attendanceService.findDisplayName(userId) ?: "Unknown"

        return SetAttendanceEndpoint.Response200(
            Attendance(
                id = attendance.id.toString(),
                eventId = attendance.eventId.toString(),
                userId = attendance.userId.toString(),
                displayName = displayName,
                state = attendance.state.name,
            )
        )
    }
}
