package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.interfaces.dto.AttendanceDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/events/{eventId}/attendances")
class AttendanceController(
    private val attendanceService: AttendanceService,
) {
    @PutMapping("/{userId}")
    fun setAttendance(
        @PathVariable eventId: UUID,
        @PathVariable userId: UUID,
        @RequestBody request: SetAttendanceRequest,
    ): ResponseEntity<AttendanceDto> {
        val state = AttendanceState.valueOf(request.state)
        val attendance = attendanceService.setAttendance(eventId, userId, state)
            ?: return ResponseEntity.notFound().build()

        val displayName = attendanceService.findDisplayName(userId) ?: "Unknown"
        return ResponseEntity.ok(
            AttendanceDto(
                id = attendance.id.toString(),
                eventId = attendance.eventId.toString(),
                userId = attendance.userId.toString(),
                displayName = displayName,
                state = attendance.state.name,
            ),
        )
    }

    data class SetAttendanceRequest(val state: String)
}
