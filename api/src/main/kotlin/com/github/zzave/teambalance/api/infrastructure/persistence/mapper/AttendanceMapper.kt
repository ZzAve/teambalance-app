package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.AttendanceJpaEntity

fun AttendanceJpaEntity.toDomain() = Attendance(
    id = id,
    eventId = eventId,
    userId = userId,
    state = AttendanceState.valueOf(state),
    updatedAt = updatedAt,
)

fun Attendance.toJpaEntity() = AttendanceJpaEntity(
    id = id,
    eventId = eventId,
    userId = userId,
    state = state.name,
    updatedAt = updatedAt,
)
