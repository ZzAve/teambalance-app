package com.github.zzave.teambalance.api.domain.model

import java.time.Instant

data class Attendance(
    val id: AttendanceId,
    val eventId: EventId,
    val userId: UserId,
    val state: AttendanceState,
    val updatedAt: Instant,
    val changedBy: UserId,
)
