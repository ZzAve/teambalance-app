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

// The layered, position-priority status of an event's roster. Position targets decide it whenever there are any — a lineup short of a setter is short of a setter however many people are coming in total — and a headcount set alongside them shows only as the panel's secondary "X/Y going". OFF renders no panel; TALLY_ONLY renders rows but no chip.
enum RosterState {
    OFF,
    TALLY_ONLY,
    HEADCOUNT_SHORT,
    HEADCOUNT_FULL,
    LINEUP_SET,
    SPOTS_OPEN,
    CRITICAL
}

// One row of the roster panel. `required` is null for a position that is merely attended, not targeted; those rows show a plain count instead of pips. Attending beyond required is the surplus the panel renders as "+N".
type RosterPosition {
    id: String,
    label: String,
    required: Integer?,
    attending: Integer
}

// The event's roster, computed server-side so the status arithmetic has ONE tested home and the client only maps numbers to chip text, colour and pips. Rows are the positions with a target OR at least one attendee, in the position vocabulary's order; an untargeted empty position is omitted rather than rendered as a zero. `openSlots` is how many more people the DRIVING target needs — the sum of unmet position slots when positions are targeted, else the headcount shortfall. `unassignedAttending` drives the "N going haven't set a position" nudge; those attendees count toward the total but can fill no targeted slot.
type EventRoster {
    trackRoster: Boolean,
    totalTarget: Integer?,
    totalAttending: Integer,
    positions: RosterPosition[],
    unassignedAttending: Integer,
    openSlots: Integer,
    state: RosterState
}

type AttendanceSummary {
    attending: Integer,
    maybe: Integer,
    absent: Integer,
    notResponded: Integer,
    roleBreakdown: RoleCount[]
}

// `myState` is the authenticated caller's own resolved attendance. The listing already resolves every member's state for the summary, so it costs no extra query; without it the list carries only aggregate counts and the client cannot tell which events it is Not Responded on (what Bulk Attend selects over, ADR-0020). EventDetail carries it too, so an EventDetail stays an Event plus attendances - code that falls back from detail to list row depends on that.
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
    attendanceSummary: AttendanceSummary,
    myState: AttendanceState,
    rosterOverride: RosterRequirement?,
    roster: EventRoster
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
    attendances: AttendanceEntry[],
    myState: AttendanceState,
    rosterOverride: RosterRequirement?,
    roster: EventRoster
}

// `changedBy` is the user id of whoever last set this row (ADR-0003 trust-based editing, so it may be a teammate); it and `updatedAt` are null for a member with no response row (NOT_RESPONDED). The client compares `changedBy` to `userId` and only shows attribution when they differ.
type AttendanceEntry {
    id: String,
    userId: String,
    displayName: String,
    role: String,
    state: AttendanceState,
    changedBy: String?,
    updatedAt: DateTimestampWithTimezone?
}

type EventList {
    events: Event[]
}

// `rosterOverride` absent (null) means this event INHERITS its type's default, and keeps inheriting: editing that default later moves every inheriting event with it. A present override is a whole replacement of the default, never a patch of it — so there is no partial inheritance to reason about.
type CreateEventRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    startTime: DateTimestampWithTimezone,
    endTime: DateTimestampWithTimezone,
    location: String?,
    references: EventReference[]?,
    rosterOverride: RosterRequirement?
}

type UpdateEventRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    startTime: DateTimestampWithTimezone,
    endTime: DateTimestampWithTimezone,
    location: String?,
    references: EventReference[]?,
    rosterOverride: RosterRequirement?
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
