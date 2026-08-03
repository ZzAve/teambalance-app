package com.github.zzave.teambalance.api.infrastructure.persistence.mapper

import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceId
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.AttendanceJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventJpaEntity

fun AttendanceJpaEntity.internalize() = Attendance(
    id = AttendanceId(uuid),
    eventId = EventId(event.uuid),
    userId = UserId(userId),
    state = AttendanceState.valueOf(state),
    updatedAt = updatedAt,
    changedBy = UserId(changedBy),
)

fun Attendance.externalize(event: EventJpaEntity, dbId: Long = 0) = AttendanceJpaEntity(
    id = dbId,
    uuid = id.value,
    event = event,
    userId = userId.value,
    state = state.name,
    updatedAt = updatedAt,
    changedBy = changedBy.value,
)
