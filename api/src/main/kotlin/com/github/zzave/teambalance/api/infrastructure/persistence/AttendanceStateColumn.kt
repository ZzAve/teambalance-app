package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.AttendanceState

// The stored form of an attendance state. toDbValue lists every constant, so adding one breaks the build
// here. An unknown stored value is corrupt data, not a client error.
internal fun AttendanceState.toDbValue(): String = when (this) {
    AttendanceState.ATTENDING -> "ATTENDING"
    AttendanceState.MAYBE -> "MAYBE"
    AttendanceState.ABSENT -> "ABSENT"
    AttendanceState.NOT_RESPONDED -> "NOT_RESPONDED"
}

internal fun String.toAttendanceState(): AttendanceState = when (this) {
    "ATTENDING" -> AttendanceState.ATTENDING
    "MAYBE" -> AttendanceState.MAYBE
    "ABSENT" -> AttendanceState.ABSENT
    "NOT_RESPONDED" -> AttendanceState.NOT_RESPONDED
    else -> error("Unknown attendance state in the database: '$this'")
}
