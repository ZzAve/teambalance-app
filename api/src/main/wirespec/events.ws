type EventTypeSummary {
    id: String,
    name: String,
    color: String?
}

type AttendanceSummary {
    attending: Integer,
    maybe: Integer,
    absent: Integer,
    notResponded: Integer
}

type Event {
    id: String,
    eventType: EventTypeSummary,
    title: String,
    description: String?,
    startTime: String,
    endTime: String?,
    location: String?,
    attendanceSummary: AttendanceSummary
}

type EventDetail {
    id: String,
    eventType: EventTypeSummary,
    title: String,
    description: String?,
    startTime: String,
    endTime: String?,
    location: String?,
    attendanceSummary: AttendanceSummary,
    attendances: AttendanceEntry[]
}

type AttendanceEntry {
    id: String,
    userId: String,
    displayName: String,
    state: String
}

type EventList {
    events: Event[]
}

type CreateEventRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    startTime: String,
    endTime: String?,
    location: String?
}

type UpdateEventRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    startTime: String,
    endTime: String?,
    location: String?
}

endpoint ListEvents GET /api/events ? {include-past: Boolean} -> {
    200 -> EventList
}

endpoint CreateEvent POST CreateEventRequest /api/events -> {
    201 -> Event
}

endpoint GetEvent GET /api/events/{id: String} -> {
    200 -> EventDetail
    404 -> Unit
}

endpoint UpdateEvent PUT UpdateEventRequest /api/events/{id: String} -> {
    200 -> Event
    404 -> Unit
}

endpoint DeleteEvent DELETE /api/events/{id: String} -> {
    204 -> Unit
    404 -> Unit
}
