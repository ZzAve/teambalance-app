package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetAttendance
import com.github.zzave.teambalance.api.interfaces.generated.model.Attendance
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class AttendanceController(
    private val attendanceService: AttendanceService,
) : SetAttendance.Handler {

    override suspend fun setAttendance(request: SetAttendance.Request): SetAttendance.Response<*> {
        val eventId = UUID.fromString(request.path.eventId)
        val userId = UUID.fromString(request.path.userId)
        val state = AttendanceState.valueOf(request.body.state)

        val attendance = attendanceService.setAttendance(eventId, userId, state)
            ?: return SetAttendance.Response404(Unit)

        val displayName = attendanceService.findDisplayName(userId) ?: "Unknown"

        return SetAttendance.Response200(
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
