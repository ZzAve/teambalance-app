// Recurring events Phase 2 (ADR-0014): one create materializes N concrete events sharing a group.
enum RecurrenceFrequency {
    WEEKLY,
    BIWEEKLY
}

enum Weekday {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}

// Generation rule used only at create time; startDate/endDate are inclusive ISO-8601 calendar dates.
type RecurrenceRule {
    frequency: RecurrenceFrequency,
    weekdays: Weekday[],
    startDate: String,
    endDate: String
}

// Base fields carry a local time-of-day (HH:mm) + duration so each occurrence keeps its wall-clock time across DST.
type CreateRecurringEventsRequest {
    eventTypeId: String,
    title: String,
    description: String?,
    location: String?,
    timeOfDay: String,
    durationMinutes: Integer,
    recurrence: RecurrenceRule
}

type RecurringEventSeries {
    recurringGroup: String,
    events: Event[]
}

endpoint CreateRecurringEvents POST CreateRecurringEventsRequest /api/recurring-events -> {
    201 -> RecurringEventSeries
    403 -> Unit
    422 -> Unit
}
