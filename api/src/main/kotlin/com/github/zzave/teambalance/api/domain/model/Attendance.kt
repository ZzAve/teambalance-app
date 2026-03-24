package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Attendance(
    val id: UUID,
    val eventId: UUID,
    val userId: UUID,
    val state: AttendanceState,
    val updatedAt: Instant,
)
