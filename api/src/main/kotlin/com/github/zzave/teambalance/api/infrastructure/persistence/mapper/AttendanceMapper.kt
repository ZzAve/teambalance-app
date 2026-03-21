package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.AttendanceJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity

fun AttendanceJpaEntity.toDomain() = Attendance(
    id = uuid,
    eventId = event.uuid,
    userId = userId,
    state = AttendanceState.valueOf(state),
    updatedAt = updatedAt,
)

fun Attendance.toJpaEntity(event: EventJpaEntity) = AttendanceJpaEntity(
    uuid = id,
    event = event,
    userId = userId,
    state = state.name,
    updatedAt = updatedAt,
)
