package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CalendarFeed
import com.github.zzave.teambalance.api.application.CalendarFeedEntry
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.EventDescription
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.EventLocation
import com.github.zzave.teambalance.api.domain.model.EventTitle
import com.github.zzave.teambalance.api.domain.model.EventType
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.EventTypeName
import com.github.zzave.teambalance.api.domain.model.RefreshCadence
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TeamName
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.UserId
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.string.shouldNotContain
import java.time.Instant
import java.util.UUID

private const val FRONTEND = "https://app.teambalance.nl"
private val EVENT_ID = UUID.fromString("11111111-2222-3333-4444-555555555555")

private val TEAM = TeamSummary(
    id = TeamId(UUID.fromString("a1111111-0000-0000-0000-000000000001")),
    name = TeamName("Tovo Dames 5"),
    slug = Slug("tovo-dames-5"),
)

private fun event(
    title: String = "Training",
    description: String? = null,
    location: String? = "Galgenwaard",
    start: Instant = Instant.parse("2026-10-01T18:30:00Z"),
    end: Instant = Instant.parse("2026-10-01T20:00:00Z"),
) = Event(
    id = EventId(EVENT_ID),
    eventType = EventType(
        id = EventTypeId(UUID.randomUUID()),
        name = EventTypeName("Training"),
        color = null,
    ),
    title = EventTitle(title),
    description = description?.let(::EventDescription),
    startTime = start,
    endTime = end,
    location = location?.let(::EventLocation),
    recurringGroup = null,
    createdBy = UserId(UUID.randomUUID()),
    createdAt = Instant.parse("2026-09-01T09:00:00Z"),
)

private fun feed(entries: List<CalendarFeedEntry>, refresh: RefreshCadence = RefreshCadence.RELAXED) =
    CalendarFeed(TEAM, entries, refresh)

private fun render(
    state: AttendanceState = AttendanceState.NOT_RESPONDED,
    event: Event = event(),
    refresh: RefreshCadence = RefreshCadence.RELAXED,
) = CalendarIcs.render(feed(listOf(CalendarFeedEntry(event, state)), refresh), FRONTEND)

/**
 * The wire format of the calendar-link feed (ADR-0032). These assertions are what a subscriber's
 * calendar app actually reads, so they are written against the emitted text rather than against a
 * biweekly object graph — the bugs worth catching here (a missing `Z`, an unescaped comma, a
 * TRANSP on the wrong state) all live in the encoding, not in the model.
 */
class CalendarIcsTest : FunSpec({

    test("the calendar is named after the team, so it is findable in a sidebar of calendars") {
        render() shouldContain "X-WR-CALNAME:Tovo Dames 5"
    }

    // Which band applies is RefreshCadenceTest's business; what matters here is that whichever one
    // the feed carries is written out, in both spellings, as a well-formed DURATION.
    context("the calendar advertises how often to come back") {
        listOf(
            RefreshCadence.RELAXED to "PT12H",
            RefreshCadence.CLOSING to "PT6H",
            RefreshCadence.IMMINENT to "PT1H",
        ).forEach { (cadence, iso) ->
            test("$cadence is written in both spellings clients read") {
                val ics = render(refresh = cadence)
                ics shouldContain "REFRESH-INTERVAL;VALUE=DURATION:$iso"
                ics shouldContain "X-PUBLISHED-TTL:$iso"
            }
        }
    }

    test("it is a well-formed calendar with one event per entry") {
        val ics = render()
        ics shouldContain "BEGIN:VCALENDAR"
        ics shouldContain "VERSION:2.0"
        ics shouldContain "BEGIN:VEVENT"
        ics shouldContain "END:VCALENDAR"
    }

    // The event's own id, so an hourly refetch updates the entry in place instead of stacking a
    // duplicate beside it every hour.
    test("the event carries the event id as its UID") {
        render() shouldContain "UID:$EVENT_ID"
    }

    // Written as UTC instants, not as local wall time with a VTIMEZONE: the domain holds Instants,
    // the team's own zone is not modelled, and a `Z` means the same thing in every client.
    test("start and end are written as UTC instants") {
        val ics = render()
        ics shouldContain "DTSTART:20261001T183000Z"
        ics shouldContain "DTEND:20261001T200000Z"
    }

    // DTSTAMP is inside the body the ETag hashes, so a wall-clock value would make every response a
    // new ETag and the 304 path would never fire.
    test("the timestamp is stable across renders, so the ETag can be") {
        render() shouldBe render()
    }

    context("the member's own answer is worn on the title") {
        test("attending") { render(AttendanceState.ATTENDING) shouldContain "SUMMARY:✓ Training" }
        test("maybe") { render(AttendanceState.MAYBE) shouldContain "SUMMARY:? Training" }
        test("absent") { render(AttendanceState.ABSENT) shouldContain "SUMMARY:✗ Training" }
        test("not responded gets no prefix at all") {
            render(AttendanceState.NOT_RESPONDED) shouldContain "SUMMARY:Training"
        }
    }

    context("only an absent event frees the subscriber's time") {
        test("absent is transparent") { render(AttendanceState.ABSENT) shouldContain "TRANSP:TRANSPARENT" }
        // "I haven't decided" is not "I am available", so an unanswered event still blocks the slot.
        listOf(AttendanceState.ATTENDING, AttendanceState.MAYBE, AttendanceState.NOT_RESPONDED).forEach { state ->
            test("$state is not") { render(state) shouldNotContain "TRANSP:TRANSPARENT" }
        }
    }

    test("the location comes across") {
        render() shouldContain "LOCATION:Galgenwaard"
    }

    test("an event without a location simply has none") {
        render(event = event(location = null)) shouldNotContain "LOCATION:"
    }

    test("the entry links back to the event page, both as URL and in the description") {
        val ics = unfolded(render())
        ics shouldContain "URL:https://app.teambalance.nl/t/tovo-dames-5/events/$EVENT_ID"
        ics shouldContain "DESCRIPTION:https://app.teambalance.nl/t/tovo-dames-5/events/$EVENT_ID"
    }

    test("an event with a description keeps it, with the link appended below") {
        // \n is the iCalendar escape for a newline; the blank line between prose and link is two.
        unfolded(render(event = event(description = "Bring your own ball"))) shouldContain
            "DESCRIPTION:Bring your own ball\\n\\nhttps://app.teambalance.nl/t/tovo-dames-5/events/$EVENT_ID"
    }

    // Commas, semicolons and newlines are structural in iCalendar. Unescaped, a title like
    // "Match vs. Taurus, away" splits one property into two values and the entry renders wrong.
    context("text that would otherwise break the format is escaped") {
        test("a comma in the title") {
            unfolded(render(event = event(title = "Match vs Taurus, away"))) shouldContain
                "SUMMARY:Match vs Taurus\\, away"
        }
        test("a semicolon in the location") {
            unfolded(render(event = event(location = "Hall 1; door B"))) shouldContain "LOCATION:Hall 1\\; door B"
        }
        test("a newline in the description") {
            unfolded(render(event = event(description = "Line one\nLine two"))) shouldContain
                "DESCRIPTION:Line one\\nLine two"
        }
    }

    // Deliberately absent (ADR-0032): a subscription URL is a bearer credential shared to a device,
    // so it carries the subscriber's own schedule and nothing about anybody else.
    test("no roster, no attendees and no alarms are disclosed") {
        val ics = CalendarIcs.render(feed(listOf(CalendarFeedEntry(event(), AttendanceState.ATTENDING))), FRONTEND)
        ics shouldNotContain "ATTENDEE"
        ics shouldNotContain "ORGANIZER"
        ics shouldNotContain "BEGIN:VALARM"
    }

    test("a team with nothing on still renders a valid, empty calendar") {
        val ics = CalendarIcs.render(feed(emptyList()), FRONTEND)
        ics shouldContain "BEGIN:VCALENDAR"
        ics shouldNotContain "BEGIN:VEVENT"
    }
})

// iCalendar folds lines at 75 octets with a CRLF + single space. Undo that before asserting on a
// property's whole value, or an assertion fails on where the wrapping happened rather than on content.
private fun unfolded(ics: String) = ics.replace("\r\n ", "").replace("\n ", "")
