package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CalendarFeed
import com.github.zzave.teambalance.api.application.CalendarFeedEntry
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import java.time.Instant
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

/**
 * A [CalendarFeed] as iCalendar text (RFC 5545) — the wire format of the calendar-link feed.
 *
 * Deliberately one-way and deliberately small: the feed is write-only, so there is no parser, and it
 * emits ten event properties with no recurrence, timezones or alarms. The encoding is the four
 * functions below — [escapeText], [utc], [property] and [fold] — and is asserted on the emitted text
 * in `CalendarIcsTest` and `CalendarIcsEncodingTest`.
 *
 * **What a feed deliberately does not carry**: no attendees, no roster, no teammate names, no alarms.
 * A calendar link is a read-only view of *your own* schedule, shared to a device rather than to a
 * person, and a subscription URL is a bearer credential — so the less it discloses if it leaks, the
 * better. Reminders are the subscriber's own business; their calendar app already does that better
 * than a feed can.
 */
object CalendarIcs {

    private const val PRODUCT_ID = "-//TeamBalance//Calendar Link//EN"
    private const val MAX_LINE_OCTETS = 75
    private const val CRLF = "\r\n"
    private val UTC_BASIC: DateTimeFormatter =
        DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'").withZone(ZoneOffset.UTC)
    private val NEWLINE = Regex("\r\n|\r|\n")

    /**
     * The member's own answer, worn on the title so a glance at the week says who is in. A prefix
     * rather than a colour or a category because it is the one decoration every calendar client
     * renders identically. [AttendanceState.NOT_RESPONDED] gets none — a bare title is the honest
     * rendering of "you haven't answered", and a symbol for it would be noise on every new event.
     */
    private fun prefix(state: AttendanceState) = when (state) {
        AttendanceState.ATTENDING -> "✓ "
        AttendanceState.MAYBE -> "? "
        AttendanceState.ABSENT -> "✗ "
        AttendanceState.NOT_RESPONDED -> ""
    }

    fun render(feed: CalendarFeed, frontendBaseUrl: String): String {
        // How soon to come back, tightening as the next event nears (RefreshCadence). Both spellings
        // on purpose: `REFRESH-INTERVAL` is the standard one (RFC 7986) and `X-PUBLISHED-TTL` is what
        // Outlook and several others actually read. Java renders a Duration as ISO-8601, which
        // RFC 5545's DURATION is a subset of.
        val refresh = feed.refresh.interval.toString()
        val lines = buildList {
            add(property("BEGIN", value = "VCALENDAR"))
            add(property("VERSION", value = "2.0"))
            add(property("PRODID", value = PRODUCT_ID))
            // X-WR-CALNAME rather than RFC 7986's NAME: it is what Google, Apple and Outlook actually
            // use to title a subscribed calendar, and a feed nobody can tell apart in a sidebar full
            // of calendars has failed at the one thing the name is for.
            //
            // A suffix (ADR-0040) tells two feeds of one team apart — the member's own and the one
            // shared with a partner.
            //
            // Not escapeText: clients and parsers treat an X- value as raw, so `\,` would show as a
            // backslash in the sidebar. Only a newline is escaped, so a name cannot start a new line.
            add(property("X-WR-CALNAME", value = calendarName(feed).replace(NEWLINE) { "\\n" }))
            add(property("REFRESH-INTERVAL", mapOf("VALUE" to "DURATION"), refresh))
            add(property("X-PUBLISHED-TTL", value = refresh))
            feed.entries.forEach {
                addAll(it.toVEvent(feed.team.slug.value, frontendBaseUrl, feed.options.showAttendancePrefix))
            }
            add(property("END", value = "VCALENDAR"))
        }
        return lines.joinToString("") { fold(it) + CRLF }
    }

    private fun calendarName(feed: CalendarFeed): String =
        listOfNotNull(feed.team.name.value, feed.options.calendarNameSuffix?.value).joinToString(" · ")

    private fun CalendarFeedEntry.toVEvent(slug: String, frontendBaseUrl: String, showPrefix: Boolean): List<String> {
        val link = "$frontendBaseUrl/t/$slug/events/${event.id.value}"
        // Off for a link shared with someone else (ADR-0040): the marks are the member's own.
        val title = if (showPrefix) prefix(state) + event.title.value else event.title.value
        return listOfNotNull(
            property("BEGIN", value = "VEVENT"),
            // The event's own id, so a re-fetch updates the entry the subscriber already has instead
            // of adding a duplicate beside it.
            property("UID", value = event.id.value.toString()),
            // The event's own revision time, twice over. On an object with no METHOD, RFC 5545 gives
            // DTSTAMP the meaning "when the information in this component was last revised", and
            // LAST-MODIFIED says the same thing in the property clients more often read. Together they
            // are how a calendar app decides that the component it already holds under this UID is
            // stale — so a rescheduled training actually moves in the subscriber's week.
            //
            // Still not `now()`: it is a property of the event, so it is stable between edits, and the
            // ETag derived from this body keeps serving 304s until something really changes.
            //
            // No SEQUENCE. It counts revisions, and nothing here counts them; a number synthesised
            // from a timestamp would be a lie that also overflows. Its actual job is iTIP scheduling
            // (METHOD:REQUEST with ATTENDEEs), which a published read-only feed is not.
            property("DTSTAMP", value = utc(event.updatedAt)),
            property("LAST-MODIFIED", value = utc(event.updatedAt)),
            property("DTSTART", value = utc(event.startTime)),
            property("DTEND", value = utc(event.endTime)),
            property("SUMMARY", value = escapeText(title)),
            event.location?.let { property("LOCATION", value = escapeText(it.value)) },
            property(
                "DESCRIPTION",
                value = escapeText(listOfNotNull(event.description?.value, link).joinToString("\n\n")),
            ),
            property("URL", value = link),
            // Only an ABSENT event frees the slot: the subscriber told us they are not going, so it
            // must not make them look busy. Everything else — including an unanswered event — stays
            // OPAQUE, because "I haven't decided" is not "I am available".
            if (state == AttendanceState.ABSENT) property("TRANSP", value = "TRANSPARENT") else null,
            property("END", value = "VEVENT"),
        )
    }

    /**
     * RFC 5545 §3.3.11 TEXT. The backslash goes first, or the backslashes the later replacements add
     * would be escaped a second time.
     */
    internal fun escapeText(value: String): String = value
        .replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace(NEWLINE) { "\\n" }

    /** RFC 5545 §3.3.5 DATE-TIME in UTC ("form #2"): basic ISO 8601, always with a `Z`. */
    internal fun utc(instant: Instant): String = UTC_BASIC.format(instant)

    internal fun property(name: String, params: Map<String, String> = emptyMap(), value: String): String =
        name + params.entries.joinToString("") { (key, param) -> ";$key=$param" } + ":" + value

    /**
     * RFC 5545 §3.1: no line longer than 75 octets excluding the line break. Counted in UTF-8
     * octets, not characters, so the ✓/✗ prefixes and accented titles stay inside the limit; a
     * continuation line starts with one space, which counts toward its 75; and the break only ever
     * falls between code points, so no UTF-8 sequence is split.
     */
    internal fun fold(line: String): String {
        val folded = StringBuilder()
        var lineOctets = 0
        var index = 0
        while (index < line.length) {
            val codePoint = line.codePointAt(index)
            val octets = String(Character.toChars(codePoint)).toByteArray(Charsets.UTF_8).size
            if (lineOctets + octets > MAX_LINE_OCTETS) {
                folded.append(CRLF).append(' ')
                lineOctets = 1
            }
            folded.appendCodePoint(codePoint)
            lineOctets += octets
            index += Character.charCount(codePoint)
        }
        return folded.toString()
    }
}
