type SetAttendanceRequest {
    state: String
}

type Attendance {
    id: String,
    eventId: String,
    userId: String,
    displayName: String,
    state: String
}

endpoint SetAttendance PUT SetAttendanceRequest /api/events/{eventId: String}/attendances/{userId: String} -> {
    200 -> Attendance
    404 -> Unit
}
