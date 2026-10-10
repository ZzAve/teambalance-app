package com.github.zzave.teambalance.api.domain.model

/**
 * What a [CalendarLink]'s calendar is called after the team name — "Tovo Dames 5 · Partner" — so a
 * subscriber holding two of a team's feeds can tell them apart in a sidebar (ADR-0040). Optional and
 * trimmed, like [CalendarLinkLabel].
 */
@JvmInline
value class CalendarNameSuffix(val value: String) {
    init {
        require(value.length <= MAX_LENGTH) { "A calendar name suffix may be at most $MAX_LENGTH characters" }
        require(value.isNotBlank()) { "A calendar name suffix may not be blank" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 30

        /** The suffix a caller typed, or null when they typed nothing meaningful. */
        fun ofNullable(raw: String?): CalendarNameSuffix? = raw?.trim()?.takeIf { it.isNotBlank() }?.let(::CalendarNameSuffix)
    }
}

/**
 * What a [CalendarLink]'s feed carries and how it is shown (ADR-0040): only events whose subscriber's
 * own answer is in [attendanceStates] and whose type is in [eventTypeIds], titles wearing the answer
 * prefix only when [showAttendancePrefix] is on, and [calendarNameSuffix] appended to the calendar's
 * name.
 *
 * [eventTypeIds] null means every type, including types created after the link; a set is an explicit
 * allowlist, so a type created later is left out until the member edits the link. Archived types are
 * never filtered out by archiving alone: an event of an archived type is still shown wherever its
 * type is allowed.
 *
 * The defaults are the "Me" shape a link had before the options existed, so an option a request
 * leaves out means what it meant before.
 */
data class CalendarLinkOptions(
    val attendanceStates: Set<AttendanceState> = AttendanceState.entries.toSet(),
    val eventTypeIds: Set<EventTypeId>? = null,
    val showAttendancePrefix: Boolean = true,
    val calendarNameSuffix: CalendarNameSuffix? = null,
) {
    init {
        // An empty set would be a link that serves an empty calendar forever.
        require(attendanceStates.isNotEmpty()) { "A calendar link must include at least one attendance state" }
        require(eventTypeIds == null || eventTypeIds.isNotEmpty()) {
            "A calendar link's event types must be every type or at least one"
        }
    }

    /** Whether an event of [type] the subscriber answered [state] belongs in the feed. */
    fun includes(type: EventTypeId, state: AttendanceState): Boolean =
        state in attendanceStates && (eventTypeIds == null || type in eventTypeIds)
}
