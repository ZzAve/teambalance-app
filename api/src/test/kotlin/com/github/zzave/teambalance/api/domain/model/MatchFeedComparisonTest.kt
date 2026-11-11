package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.time.ZoneId
import java.util.UUID

class MatchFeedComparisonTest : FunSpec({

    val zone = ZoneId.of("Europe/Amsterdam")
    val now = Instant.parse("2026-11-11T12:00:00Z")
    val us = NevoboTeamName("Tovo HS 4")

    val away = FeedMatch(
        code = MatchCode("EA"),
        link = MatchLink("https://api.nevobo.nl/permalink/wedstrijd/2017987"),
        startTime = Instant.parse("2026-11-13T18:30:00Z"),
        homeTeam = NevoboTeamName("Servylo HS 1"),
        awayTeam = NevoboTeamName("Tovo HS 4"),
        venue = MatchVenue("De Mammoet"),
    )
    val home = FeedMatch(
        code = MatchCode("AD"),
        link = MatchLink("https://api.nevobo.nl/permalink/wedstrijd/2017818"),
        startTime = Instant.parse("2026-11-20T18:30:00Z"),
        homeTeam = NevoboTeamName("Tovo HS 4"),
        awayTeam = NevoboTeamName("UVV-Sphynx HS 2"),
        venue = MatchVenue("Zuilen"),
    )
    val otherTeams = FeedMatch(
        code = MatchCode("FI"),
        link = MatchLink("https://api.nevobo.nl/permalink/wedstrijd/2018064"),
        startTime = Instant.parse("2026-11-13T18:30:00Z"),
        homeTeam = NevoboTeamName("Inter Rijswijk HS 6"),
        awayTeam = NevoboTeamName("VollinGo HS 5"),
        venue = MatchVenue("De Altis"),
    )

    fun compare(matches: List<FeedMatch>, events: List<Event>) =
        MatchFeedComparison.compare(matches, us, POULE, events, zone, now)

    test("an event that agrees with its match gives no finding") {
        val event = matchEvent("Servylo HS 1 - Tovo HS 4", away.startTime, "De Mammoet, Gouda")

        val findings = compare(listOf(away), listOf(event))

        findings.mismatches.shouldBeEmpty()
        findings.missing.shouldBeEmpty()
    }

    test("matches of other teams in the poule are ignored") {
        compare(listOf(otherTeams), emptyList()).missing.shouldBeEmpty()
    }

    test("a match with no event is missing") {
        compare(listOf(away, home), emptyList()).missing shouldBe listOf(away, home)
    }

    test("a match that has already started is not missing") {
        val started = away.copy(startTime = now.minusSeconds(60))
        compare(listOf(started), emptyList()).missing.shouldBeEmpty()
    }

    test("a reference to the permalink links the event, and every difference is reported") {
        val event = matchEvent(
            title = "Training",
            start = away.startTime.plusSeconds(3600 * 24),
            location = "Sporthal Zuid",
            references = listOf(EventReference.of("Nevobo", away.link.value)),
        )

        val findings = compare(listOf(away), listOf(event))

        findings.missing.shouldBeEmpty()
        findings.mismatches shouldBe listOf(
            MatchMismatch(
                event,
                away,
                setOf(MatchDifference.START_TIME, MatchDifference.LOCATION, MatchDifference.OPPONENT),
            ),
        )
    }

    test("a reference to the volleybal.nl match page links the event by poule and match code") {
        val event = matchEvent(
            title = "vs Servylo HS 1",
            start = away.startTime.plusSeconds(1800),
            location = "De Mammoet",
            references = listOf(EventReference.of(null, "$VOLLEYBAL_NL/competitie-seniorencompetitie-1/$POULE/wedstrijd/EA/1/1")),
        )

        compare(listOf(away), listOf(event)).mismatches shouldBe listOf(
            MatchMismatch(event, away, setOf(MatchDifference.START_TIME)),
        )
    }

    test("the same match code in another poule does not link") {
        val event = matchEvent(
            title = "Servylo HS 1 - Tovo HS 4",
            start = away.startTime.plusSeconds(3600 * 48),
            location = "De Mammoet",
            references = listOf(EventReference.of(null, "$VOLLEYBAL_NL/x/regio-west-d1a-3/wedstrijd/EA/1/1")),
        )

        val findings = compare(listOf(away), listOf(event))

        findings.mismatches.shouldBeEmpty()
        findings.missing shouldBe listOf(away)
    }

    test("without a reference, the same local date and the opponent in the title link the event") {
        val event = matchEvent("Uit bij servylo hs 1", away.startTime.plusSeconds(3600), null)

        compare(listOf(away), listOf(event)).mismatches shouldBe listOf(
            MatchMismatch(event, away, setOf(MatchDifference.START_TIME, MatchDifference.LOCATION)),
        )
    }

    test("without a reference, an event on another date does not link") {
        val event = matchEvent("Servylo HS 1 - Tovo HS 4", away.startTime.plusSeconds(3600 * 24), "De Mammoet")

        compare(listOf(away), listOf(event)).missing shouldBe listOf(away)
    }

    test("one event links to one match only") {
        val sameDay = home.copy(
            code = MatchCode("ZZ"),
            link = MatchLink("https://api.nevobo.nl/permalink/wedstrijd/1"),
            startTime = away.startTime,
            awayTeam = NevoboTeamName("Servylo HS 1"),
        )
        val event = matchEvent("Servylo HS 1 - Tovo HS 4", away.startTime, "De Mammoet")

        val findings = compare(listOf(away, sameDay), listOf(event))

        findings.mismatches.shouldBeEmpty()
        findings.missing shouldBe listOf(sameDay)
    }

    test("the corrected event takes the feed's start, address and title, keeps its length, and links the match") {
        val match = away.copy(address = MatchAddress("De Mammoet, Calslaan 101, 2804RT Gouda"))
        val event = matchEvent("Uitwedstrijd", away.startTime.plusSeconds(3600), "Sporthal Zuid")
        val mismatch = MatchMismatch(
            event,
            match,
            setOf(MatchDifference.START_TIME, MatchDifference.LOCATION, MatchDifference.OPPONENT),
        )

        val corrected = mismatch.corrected()

        corrected.startTime shouldBe away.startTime
        corrected.endTime shouldBe away.startTime.plusSeconds(7200)
        corrected.location shouldBe EventLocation("De Mammoet, Calslaan 101, 2804RT Gouda")
        corrected.title shouldBe EventTitle("Servylo HS 1 - Tovo HS 4")
        corrected.references shouldBe listOf(EventReference.of("Nevobo", away.link.value))
        compare(listOf(match), listOf(corrected)).mismatches.shouldBeEmpty()
    }

    test("the corrected event changes only what differs and does not add the link twice") {
        val link = EventReference.of("Wedstrijd", away.link.value)
        val event = matchEvent("Servylo HS 1 - Tovo HS 4", away.startTime.plusSeconds(1800), "Sporthal Zuid", listOf(link))

        val corrected = MatchMismatch(event, away, setOf(MatchDifference.START_TIME)).corrected()

        corrected.startTime shouldBe away.startTime
        corrected.location shouldBe EventLocation("Sporthal Zuid")
        corrected.title shouldBe event.title
        corrected.references shouldBe listOf(link)
    }

    test("location compare ignores case and extra spaces") {
        val event = matchEvent("Servylo HS 1 - Tovo HS 4", away.startTime, "  de   MAMMOET  ")

        compare(listOf(away), listOf(event)).mismatches.shouldBeEmpty()
    }
})

private const val POULE = "regio-west-h2j-12"
private const val VOLLEYBAL_NL = "https://www.volleybal.nl/competitie/poule/regio-west"

private val EVENT_TYPE = EventType(
    id = EventTypeId(UUID.fromString("00000000-0000-0000-0000-0000000000e7")),
    name = EventTypeName("Match"),
    color = HexColor("#225C9C"),
)

private fun matchEvent(
    title: String,
    start: Instant,
    location: String?,
    references: List<EventReference> = emptyList(),
) = Event(
    id = EventId(UUID.randomUUID()),
    eventType = EVENT_TYPE,
    title = EventTitle(title),
    description = null,
    startTime = start,
    endTime = start.plusSeconds(7200),
    location = location?.let(::EventLocation),
    references = references,
    recurringGroup = null,
    createdBy = UserId(UUID.fromString("00000000-0000-0000-0000-000000000002")),
    createdAt = Instant.parse("2026-01-01T00:00:00Z"),
)
