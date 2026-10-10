package com.github.zzave.teambalance.api.domain.model

import java.time.Duration
import java.time.Instant
import java.util.UUID

/** The identity of a [CalendarLink]. Same edges-only conversion as [EventId], which documents it. */
@JvmInline
value class CalendarLinkId(val value: UUID) {
    override fun toString(): String = value.toString()

    companion object {
        fun random() = CalendarLinkId(UUID.randomUUID())
    }
}

/**
 * What a member calls one of their calendar links ("Phone", "Work laptop") — how they tell three
 * otherwise-identical URLs apart when deciding which to delete. Optional, and trimmed: a label of
 * spaces is no label.
 */
@JvmInline
value class CalendarLinkLabel(val value: String) {
    init {
        require(value.length <= MAX_LENGTH) { "A calendar link label may be at most $MAX_LENGTH characters" }
        require(value.isNotBlank()) { "A calendar link label may not be blank" }
    }

    override fun toString(): String = value

    companion object {
        const val MAX_LENGTH = 50

        /** The label a caller typed, or null when they typed nothing meaningful. */
        fun ofNullable(raw: String?): CalendarLinkLabel? = raw?.trim()?.takeIf { it.isNotBlank() }?.let(::CalendarLinkLabel)
    }
}

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
 * The subscription URL a calendar client is pointed at — a [CalendarToken] in the only form anything
 * can use it in, which is why the token is never served on its own.
 *
 * [toString] is masked like [CalendarToken]'s, and for the same reason: the token is *in* this string,
 * so a URL in a log line is a live subscription anyone with log access can add to their calendar.
 */
@JvmInline
value class CalendarFeedUrl(val value: String) {
    override fun toString(): String = "CalendarFeedUrl(****)"
}

/**
 * A **Calendar link**: one member's personal, unauthenticated webcal subscription to one team's
 * events (ADR-0039).
 *
 * Belongs to a (user, team) membership — the team is the tenant schema the row lives in, so it is not
 * a column here. The token is persisted twice over, exactly as an [Invitation]'s is since ADR-0025:
 * as a salted [TokenHash], which the feed matches a presented token on, and as an [EncryptedToken],
 * which is what lets the member be shown their URL again rather than only once.
 *
 * Created explicitly, expires [TTL] later, and is never renewed. Its label and [options] can be
 * replaced, its token and expiry cannot (ADR-0040); otherwise it can only be deleted. An expired row
 * is deliberately kept: it still counts toward [MAX_PER_MEMBER], so a member who cannot create a
 * fourth can see the three that are in the way.
 *
 * Personalised by its [options] (ADR-0040).
 */
data class CalendarLink(
    val id: CalendarLinkId,
    val userId: UserId,
    val tokenHash: TokenHash,
    val encryptedToken: EncryptedToken,
    val label: CalendarLinkLabel?,
    val createdAt: Instant,
    val expiresAt: Instant,
    val options: CalendarLinkOptions = CalendarLinkOptions(),
) {
    /** Whether this link still serves a feed at [now]. Expiry is exclusive of the instant itself. */
    fun isLiveAt(now: Instant): Boolean = expiresAt.isAfter(now)

    companion object {
        /**
         * One year, from creation, with no renewal. Long enough that a member sets a calendar up and
         * forgets about it for a season or two; short enough that a URL leaked into a shared calendar
         * or a browser history stops working without anyone having to notice and revoke it.
         */
        val TTL: Duration = Duration.ofDays(365)

        /**
         * Three per member per team, counting expired ones. A cap rather than no cap because every
         * live link is a standing credential; three rather than one because a phone, a laptop and a
         * work calendar is an ordinary thing to want, and expired rows count so the cap cannot be
         * quietly widened by waiting.
         */
        const val MAX_PER_MEMBER = 3
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
