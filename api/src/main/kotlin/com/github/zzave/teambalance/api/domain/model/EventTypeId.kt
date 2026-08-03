package com.github.zzave.teambalance.api.domain.model

import java.util.UUID

/**
 * The identity of an [EventType]. Same shape and the same edges-only conversion as [EventId], which
 * documents the pattern.
 *
 * No `random()` factory: event types are reference data seeded per team, so the domain reads their
 * identity and never mints one — unlike [EventId] or [AttendanceId], which name a row that has no
 * database record yet.
 */
@JvmInline
value class EventTypeId(val value: UUID) {
    override fun toString(): String = value.toString()
}
