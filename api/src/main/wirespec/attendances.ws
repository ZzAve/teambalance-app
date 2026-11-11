type SetAttendanceRequest {
    state: AttendanceState
}

type Attendance {
    id: String,
    eventId: String,
    userId: String,
    displayName: String,
    role: String,
    state: AttendanceState,
    changedBy: String,
    updatedAt: DateTimestampWithTimezone
}

endpoint SetAttendance PUT SetAttendanceRequest /api/events/{eventId: String}/attendances/{userId: String} -> {
    200 -> Attendance
    404 -> Unit
}

// Bulk Attend (ADR-0020): a top-level batch resource - the operation spans events, so none can host it. The client names the exact ids; the server creates a row iff the member has none and the event has not started.
type BulkAttendanceRequest {
    userId: String,
    eventIds: String[],
    state: AttendanceState
}

// Undo is a reciprocal DELETE, not a second POST: the non-destructive guard on POST would skip the now-ATTENDING rows Undo has to reach.
type BulkAttendanceUndoRequest {
    userId: String,
    eventIds: String[]
}

// The ids actually written (or deleted), a subset of those requested since a race may have filled a blank since the list loaded. The client feeds these back as the Undo payload.
type BulkAttendanceResult {
    eventIds: String[]
}

endpoint BulkAttend POST BulkAttendanceRequest /api/attendances/batch -> {
    200 -> BulkAttendanceResult
}

endpoint BulkUndoAttend DELETE BulkAttendanceUndoRequest /api/attendances/batch -> {
    200 -> BulkAttendanceResult
}

// Admin-only. Deletes every member's response row on one event, so each member reads as NOT_RESPONDED again (for example after the date moved). Substitutes stay on the event.
endpoint ResetAttendance DELETE /api/events/{eventId: String}/attendances -> {
    204 -> Unit
    404 -> Unit
}
