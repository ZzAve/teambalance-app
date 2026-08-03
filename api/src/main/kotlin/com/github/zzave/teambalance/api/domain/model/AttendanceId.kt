package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/**
 * The identity of an [Attendance] row. Same shape and the same edges-only conversion as [EventId],
 * which documents the pattern.
 */
@JvmInline
value class AttendanceId(val value: UUID) {
    override fun toString(): String = value.toString()

    companion object {
        /** Mints an identity for a response that has not been persisted yet. */
        fun random(): AttendanceId = AttendanceId(UUID.randomUUID())
    }
}
