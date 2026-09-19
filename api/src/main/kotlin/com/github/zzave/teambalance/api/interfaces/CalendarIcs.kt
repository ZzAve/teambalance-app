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
     * How often a client should come back. Both spellings on purpose: `REFRESH-INTERVAL` is the
     * standard one (RFC 7986) and `X-PUBLISHED-TTL` is what Outlook and several others actually read.
     */
    private const val REFRESH_INTERVAL = "PT1H"

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
            addExperimentalProperty("REFRESH-INTERVAL", ICalDataType.DURATION, REFRESH_INTERVAL)
            addExperimentalProperty("X-PUBLISHED-TTL", REFRESH_INTERVAL)
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
            // Fixed, not `now()`: DTSTAMP is inside the body the ETag is derived from, so a wall-clock
            // value would make every response a fresh ETag and defeat the 304 the feed exists to serve.
            setDateTimeStamp(Date.from(event.createdAt))
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
