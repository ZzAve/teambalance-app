package com.github.zzave.teambalance.api.interfaces

import biweekly.ICalendar
import biweekly.Biweekly
import biweekly.ICalDataType
import biweekly.component.VEvent
import com.github.zzave.teambalance.api.application.CalendarFeed
import com.github.zzave.teambalance.api.application.CalendarFeedEntry
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import java.util.Date

/**
 * A [CalendarFeed] as iCalendar text (RFC 5545) — the wire format of the calendar-link feed.
 *
 * Deliberately one-way and deliberately small. Everything domain-specific is decided here (what a
 * subscriber is shown, and what they are *not*); biweekly only does the encoding — escaping commas,
 * semicolons and newlines, and folding long lines — which is exactly the part that is tedious to get
 * right by hand and boring to own.
 *
 * **What a feed deliberately does not carry**: no attendees, no roster, no teammate names, no alarms.
 * A calendar link is a read-only view of *your own* schedule, shared to a device rather than to a
 * person, and a subscription URL is a bearer credential — so the less it discloses if it leaks, the
 * better. Reminders are the subscriber's own business; their calendar app already does that better
 * than a feed can.
 */
object CalendarIcs {

    private const val PRODUCT_ID = "-//TeamBalance//Calendar Link//EN"


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
        val calendar = ICalendar().apply {
            setProductId(PRODUCT_ID)
            // X-WR-CALNAME rather than RFC 7986's NAME: it is what Google, Apple and Outlook actually
            // use to title a subscribed calendar, and a feed nobody can tell apart in a sidebar full
            // of calendars has failed at the one thing the name is for.
            setExperimentalProperty("X-WR-CALNAME", feed.team.name.value)
            // How soon to come back, tightening as the next event nears (RefreshCadence). Both
            // spellings on purpose: `REFRESH-INTERVAL` is the standard one (RFC 7986) and
            // `X-PUBLISHED-TTL` is what Outlook and several others actually read. Java renders a
            // Duration as ISO-8601, which RFC 5545's DURATION is a subset of.
            val refresh = feed.refresh.interval.toString()
            addExperimentalProperty("REFRESH-INTERVAL", ICalDataType.DURATION, refresh)
            addExperimentalProperty("X-PUBLISHED-TTL", refresh)
        }
        feed.entries.forEach { calendar.addEvent(it.toVEvent(feed.team.slug.value, frontendBaseUrl)) }
        return Biweekly.write(calendar).go()
    }

    private fun CalendarFeedEntry.toVEvent(slug: String, frontendBaseUrl: String): VEvent {
        val link = "$frontendBaseUrl/t/$slug/events/${event.id.value}"
        return VEvent().apply {
            // The event's own id, so a re-fetch updates the entry the subscriber already has instead
            // of adding a duplicate beside it. biweekly's VEvent() would otherwise mint a random one.
            setUid(event.id.value.toString())
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
            setDateTimeStamp(Date.from(event.updatedAt))
            setLastModified(Date.from(event.updatedAt))
            setDateStart(Date.from(event.startTime))
            setDateEnd(Date.from(event.endTime))
            setSummary(prefix(state) + event.title.value)
            event.location?.let { setLocation(it.value) }
            setDescription(listOfNotNull(event.description?.value, link).joinToString("\n\n"))
            setUrl(link)
            // Only an ABSENT event frees the slot: the subscriber told us they are not going, so it
            // must not make them look busy. Everything else — including an unanswered event — stays
            // OPAQUE, because "I haven't decided" is not "I am available".
            if (state == AttendanceState.ABSENT) setTransparency(true)
        }
    }
}
