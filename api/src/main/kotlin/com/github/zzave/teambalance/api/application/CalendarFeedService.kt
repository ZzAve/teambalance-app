package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.Event
import com.github.zzave.teambalance.api.domain.model.RefreshCadence
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamSummary
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import java.time.Clock
import java.time.Duration
import java.time.Instant

/** One event as the subscriber's calendar will show it: the event, and *their* answer to it. */
data class CalendarFeedEntry(val event: Event, val state: AttendanceState)

/**
 * Everything the subscribed calendar is told: whose team this is, what is on, and how soon to ask
 * again.
 *
 * [refresh] is carried rather than derived here because it depends on *now*, which a description of
 * what is being served has no business holding.
 */
data class CalendarFeed(
    val team: TeamSummary,
    val entries: List<CalendarFeedEntry>,
    val refresh: RefreshCadence,
)

/**
 * The session-less half of **Calendar links** (ADR-0032): resolve a webcal URL to one member's view of
 * one team's schedule, from the token alone.
 *
 * Nothing here trusts the caller beyond the token. Team, link, liveness and *current* membership are
 * each re-established per request, and every failure among them returns the same `null` — which the
 * controller turns into the same 404 — so the feed cannot be used to learn whether a team, a slug or a
 * token exists.
 *
 * The one thing it does not re-establish is the tenant schema: that is already bound by
 * `CalendarFeedTenantFilter` before this runs, which is what makes the token lookup below scoped to
 * the team the slug named.
 */
class CalendarFeedService(
    private val teamRepository: TeamRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val calendarLinkRepository: CalendarLinkRepository,
    private val eventRepository: EventRepository,
    private val attendanceRepository: AttendanceRepository,
    private val tokens: CalendarLinkTokens,
    private val clock: Clock,
) {
    /**
     * The feed [presentedToken] names under [slug], or null if it names none.
     *
     * Membership is checked **last and always**, against `team_members` rather than against anything
     * carried on the link: a member who leaves the team stops receiving its schedule on their next
     * refresh, without anyone having to remember to delete their links.
     */
    fun feed(slug: Slug, presentedToken: String): CalendarFeed? {
        val now = clock.instant()
        val team = teamRepository.findBySlug(slug) ?: return null
        return subscriber(team, presentedToken, now)?.let {
            val entries = entriesFor(it, now)
            CalendarFeed(team, entries, RefreshCadence.before(nextStart(entries, now), now))
        }
    }

    /**
     * Who the presented token speaks for in [team], or null if it speaks for nobody. Three ways to be
     * nobody — no such token *here*, a token past its year, an owner who has left — and all three land
     * in the same null on purpose.
     *
     * The token is looked up in the tenant schema the slug resolved to, so one minted for another team
     * is simply absent: cross-team access is a miss, not a comparison somebody had to remember to write.
     */
    private fun subscriber(team: TeamSummary, presentedToken: String, now: Instant): UserId? =
        calendarLinkRepository.findByTokenHash(tokens.hash(presentedToken))
            ?.takeIf { it.isLiveAt(now) }
            ?.userId
            ?.takeIf { teamMemberRepository.findRole(team.id, it) != null }

    private fun entriesFor(userId: UserId, now: Instant): List<CalendarFeedEntry> {
        val events = eventRepository.findUpcoming(now.minus(HISTORY_WINDOW))
        val states = attendanceRepository.findByUserIdAndEventIds(userId, events.map { it.id })
            .associate { it.eventId to it.state }
        return events.map { CalendarFeedEntry(it, states[it.id] ?: AttendanceState.NOT_RESPONDED) }
    }

    /**
     * The soonest Event still ahead of the subscriber, which is what sets the refresh cadence. Taken
     * by minimum rather than by position: the feed reaches back thirty days, so its first entry is
     * usually one that has already happened.
     */
    private fun nextStart(entries: List<CalendarFeedEntry>, now: Instant): Instant? =
        entries.map { it.event.startTime }.filter { it.isAfter(now) }.minOrNull()

    private companion object {
        /**
         * How far back the feed reaches. A subscribed calendar is a record as well as a plan — "was I
         * at that training?" is a real question a month later — and a window keeps a feed that is
         * fetched hourly from growing with every season the team plays.
         */
        val HISTORY_WINDOW: Duration = Duration.ofDays(30)
    }
}
