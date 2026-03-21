package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
class AttendanceController(
    private val attendanceService: AttendanceService,
    private val teamMemberRepository: TeamMemberRepository,
) {
    @PutMapping("/api/events/{eventId}/attendances/{userId}")
    fun setAttendance(
        @PathVariable eventId: UUID,
        @PathVariable userId: UUID,
        @RequestBody request: SetAttendanceRequest,
    ): ResponseEntity<Map<String, Any>> {
        val state = AttendanceState.valueOf(request.state)
        val attendance = attendanceService.setAttendance(eventId, userId, state)
            ?: return ResponseEntity.notFound().build()

        val displayName = teamMemberRepository.findDisplayName(userId) ?: "Unknown"
        return ResponseEntity.ok(
            mapOf(
                "id" to attendance.id.toString(),
                "eventId" to attendance.eventId.toString(),
                "userId" to attendance.userId.toString(),
                "displayName" to displayName,
                "state" to attendance.state.name,
            ),
        )
    }

    data class SetAttendanceRequest(val state: String)
}
