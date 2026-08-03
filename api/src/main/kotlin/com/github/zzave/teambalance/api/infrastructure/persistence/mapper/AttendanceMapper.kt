package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.AttendanceJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity

fun AttendanceJpaEntity.internalize() = Attendance(
    id = uuid,
    eventId = EventId(event.uuid),
    userId = userId,
    state = AttendanceState.valueOf(state),
    updatedAt = updatedAt,
    changedBy = changedBy,
)

fun Attendance.externalize(event: EventJpaEntity, dbId: Long = 0) = AttendanceJpaEntity(
    id = dbId,
    uuid = id,
    event = event,
    userId = userId,
    state = state.name,
    updatedAt = updatedAt,
    changedBy = changedBy,
)
