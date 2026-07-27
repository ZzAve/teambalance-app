type DateTimestampWithTimezone = String

enum AttendanceState {
    ATTENDING,
    MAYBE,
    ABSENT,
    NOT_RESPONDED
}

// Level-3 edit/delete scope (ADR-0014): row-reassignment + field updates over a recurring_group. Default THIS.
enum EventSeriesScope {
    THIS,
    THIS_AND_FOLLOWING,
    ALL
}

type EventTypeSummary {
    id: String,
    name: String,
    color: String?
}

type EventReference {
    title: String?,
    url: String
}

type RoleCount {
    role: String,
    attending: Integer
}

type AttendanceSummary {
    attending: Integer,
    maybe: Integer,
    absent: Integer,
    notResponded: Integer,
    roleBreakdown: RoleCount[]
}

type Event {
    id: String,
    eventType: EventTypeSummary,
    title: String,
    description: String?,
    startTime: DateTimestampWithTimezone,
    endTime: DateTimestampWithTimezone,
    location: String?,
    references: EventReference[],
    recurringGroup: String?,
    attendanceSummary: AttendanceSummary
}

type EventDetail {
    id: String,
    eventType: EventTypeSummary,
    title: String,
    description: String?,
    startTime: DateTimestampWithTimezone,
    endTime: DateTimestampWithTimezone,
    location: String?,
    references: EventReference[],
    recurringGroup: String?,
    attendanceSummary: AttendanceSummary,
    attendances: AttendanceEntry[]
}

type AttendanceEntry {
    id: String,
    userId: String,
    displayName: String,
    role: String,
    state: AttendanceState
}

type EventList {
    events: Event[]
}

type CreateEventRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    startTime: DateTimestampWithTimezone,
    endTime: DateTimestampWithTimezone,
    location: String?,
    references: EventReference[]?
}

type UpdateEventRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    startTime: DateTimestampWithTimezone,
    endTime: DateTimestampWithTimezone,
    location: String?,
    references: EventReference[]?
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

endpoint UpdateEvent PUT UpdateEventRequest /api/events/{id: String} ? {scope: EventSeriesScope?} -> {
    200 -> EventList
    404 -> Unit
}

endpoint DeleteEvent DELETE /api/events/{id: String} ? {scope: EventSeriesScope?} -> {
    204 -> Unit
    404 -> Unit
}
