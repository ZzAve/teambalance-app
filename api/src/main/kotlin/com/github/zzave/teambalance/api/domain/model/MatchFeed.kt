package com.github.zzave.teambalance.api.domain.model

import java.net.URI
import java.time.Duration
import java.time.Instant
import java.time.ZoneId

/**
 * A Nevobo poule programme feed (`programma.rss`). Only `https://api.nevobo.nl/export/poule/.../programma.rss`
 * is constructible, because the server fetches this URL: any other host or path would let an admin make the
 * server call an address of their choice.
 */
@JvmInline
value class NevoboFeedUrl(val value: String) {
    init {
        require(PATTERN.matches(value)) { "Not a Nevobo poule programme feed: $value" }
    }

    /** The last path segment before `programma.rss`, for example `regio-west-h2j-12`. */
    val poule: String get() = URI(value).path.split('/').dropLast(1).last()

    companion object {
        private val PATTERN = Regex("""https://api\.nevobo\.nl/export/poule(/[a-z0-9-]+){2,3}/programma\.rss""")
    }
}

/** A team's name as the Nevobo feed spells it, for example `Tovo HS 4`. */
@JvmInline
value class NevoboTeamName(val value: String) {
    init {
        require(value.isNotBlank()) { "Team name must not be blank" }
        require(value.length <= MAX_LENGTH) { "Team name must be at most $MAX_LENGTH characters" }
    }

    fun isNamed(name: NevoboTeamName) = name.value.trim().equals(value.trim(), ignoreCase = true)

    companion object {
        const val MAX_LENGTH = 100
    }
}

/** A match's code within its poule, for example `EA`. */
@JvmInline
value class MatchCode(val value: String) {
    init {
        require(PATTERN.matches(value)) { "Not a match code: $value" }
    }

    companion object {
        private val PATTERN = Regex("[A-Z0-9]{1,10}")
    }
}

/** A match's Nevobo permalink, for example `https://api.nevobo.nl/permalink/wedstrijd/2017987`. */
@JvmInline
value class MatchLink(val value: String)

/** Where a match is played, as the feed names the hall, for example `De Mammoet`. */
@JvmInline
value class MatchVenue(val value: String)

/** The hall with its address, for example `De Mammoet, Calslaan 101, 2804RT Gouda`. */
@JvmInline
value class MatchAddress(val value: String)

/** The team's match feed: which feed, which team in it, and when the server last read it. */
data class MatchFeedSettings(
    val url: NevoboFeedUrl,
    val teamName: NevoboTeamName,
    val lastCheckedAt: Instant?,
    val lastCheckFailed: Boolean,
)

/** One match in the feed. [code] is the match code within the poule (`EA`), [link] the Nevobo permalink. */
data class FeedMatch(
    val code: MatchCode,
    val link: MatchLink,
    val startTime: Instant,
    val homeTeam: NevoboTeamName,
    val awayTeam: NevoboTeamName,
    val venue: MatchVenue?,
    val address: MatchAddress? = null,
) {
    /** The title an event for this match gets, in the feed's own form: `Home - Away`. */
    val title: EventTitle get() = EventTitle("${homeTeam.value} - ${awayTeam.value}")

    /** The Reference to this match that an event for it carries. */
    val reference: EventReference get() = EventReference.of("Nevobo", link.value)

    fun involves(team: NevoboTeamName) = team.isNamed(homeTeam) || team.isNamed(awayTeam)

    fun opponentOf(team: NevoboTeamName) = if (team.isNamed(homeTeam)) awayTeam else homeTeam

    /**
     * True when [url] points at this match: the permalink itself, or a volleybal.nl match page whose path
     * has `/<poule>/wedstrijd/<code>`.
     */
    fun isLinkedBy(url: String, poule: String): Boolean {
        val path = runCatching { URI(url).path }.getOrNull().orEmpty()
        return url.trimEnd('/') == link.value || "/$poule/wedstrijd/${code.value}/" in "$path/"
    }
}

enum class MatchDifference { START_TIME, LOCATION, OPPONENT }

data class MatchMismatch(val event: Event, val match: FeedMatch, val differences: Set<MatchDifference>) {
    /**
     * The event with the feed's values for what differs: the start time (the event keeps its length), the
     * location (the address, else the hall) and the title (`Home - Away`). The event also gets a Reference to
     * the match when it has none, so it links exactly from then on.
     */
    fun corrected(): Event {
        val start = if (MatchDifference.START_TIME in differences) match.startTime else event.startTime
        val location = match.address?.value ?: match.venue?.value
        val linked = event.references.any { it.url.value == match.link.value }
        return event.copy(
            startTime = start,
            endTime = start.plus(Duration.between(event.startTime, event.endTime)),
            location = if (MatchDifference.LOCATION in differences && location != null) EventLocation(location) else event.location,
            title = if (MatchDifference.OPPONENT in differences) match.title else event.title,
            references = if (linked || event.references.size >= Event.MAX_REFERENCES) {
                event.references
            } else {
                event.references + match.reference
            },
        )
    }
}

data class MatchFeedFindings(val mismatches: List<MatchMismatch>, val missing: List<FeedMatch>)

/**
 * Compares the team's upcoming feed matches with its events.
 *
 * A match is linked to an event by a Reference to the match first. Without one, an event on the same local
 * date whose title names the opponent is linked. Each event is linked to one match at most. A linked event is
 * compared on start time, location (it must contain the venue name) and opponent (the title must name it).
 * A match that has not started and has no linked event is missing.
 */
object MatchFeedComparison {

    fun compare(
        matches: List<FeedMatch>,
        team: NevoboTeamName,
        poule: String,
        events: List<Event>,
        zone: ZoneId,
        now: Instant,
    ): MatchFeedFindings {
        val ours = matches.filter { it.involves(team) && !it.startTime.isBefore(now) }
        val linked = linkByReference(ours, events, poule).toMutableMap()
        ours.filter { it !in linked }.forEach { match ->
            events.firstOrNull { it !in linked.values && isSameDayAgainst(it, match, team, zone) }
                ?.let { linked[match] = it }
        }

        val mismatches = ours.mapNotNull { match ->
            val event = linked[match] ?: return@mapNotNull null
            differences(event, match, team).takeIf { it.isNotEmpty() }?.let { MatchMismatch(event, match, it) }
        }
        return MatchFeedFindings(mismatches = mismatches, missing = ours.filter { it !in linked })
    }

    private fun linkByReference(matches: List<FeedMatch>, events: List<Event>, poule: String): Map<FeedMatch, Event> =
        matches.mapNotNull { match ->
            events.firstOrNull { event -> event.references.any { match.isLinkedBy(it.url.value, poule) } }
                ?.let { match to it }
        }.toMap()

    private fun isSameDayAgainst(event: Event, match: FeedMatch, team: NevoboTeamName, zone: ZoneId) =
        event.startTime.atZone(zone).toLocalDate() == match.startTime.atZone(zone).toLocalDate() &&
            namesOpponent(event, match, team)

    private fun differences(event: Event, match: FeedMatch, team: NevoboTeamName): Set<MatchDifference> = buildSet {
        if (event.startTime != match.startTime) add(MatchDifference.START_TIME)
        if (match.venue != null && normalised(match.venue.value) !in normalised(event.location?.value.orEmpty())) {
            add(MatchDifference.LOCATION)
        }
        if (!namesOpponent(event, match, team)) add(MatchDifference.OPPONENT)
    }

    private fun namesOpponent(event: Event, match: FeedMatch, team: NevoboTeamName) =
        normalised(match.opponentOf(team).value) in normalised(event.title.value)

    private fun normalised(text: String) = text.trim().lowercase().replace(Regex("\\s+"), " ")
}
