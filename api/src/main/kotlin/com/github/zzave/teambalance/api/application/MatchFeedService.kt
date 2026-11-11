package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.MatchFeedUnavailableException
import com.github.zzave.teambalance.api.domain.exception.UnknownFeedTeamException
import com.github.zzave.teambalance.api.domain.model.MatchFeedComparison
import com.github.zzave.teambalance.api.domain.model.MatchFeedFindings
import com.github.zzave.teambalance.api.domain.model.MatchFeedSettings
import com.github.zzave.teambalance.api.domain.model.NevoboFeedUrl
import com.github.zzave.teambalance.api.domain.model.NevoboTeamName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.MatchFeedGateway
import com.github.zzave.teambalance.api.domain.port.MatchFeedRepository
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.Duration

data class MatchFeedStatus(val settings: MatchFeedSettings, val findings: MatchFeedFindings)

/**
 * The team's Nevobo match feed (ADR-0047): an admin picks a poule feed and the team's name in it, the server
 * reads the feed again once [checkInterval] has passed, and the admin sees where the team's events differ
 * from it. Findings are computed when read, so an event that is edited to agree stops showing at once.
 */
class MatchFeedService(
    private val repository: MatchFeedRepository,
    private val gateway: MatchFeedGateway,
    private val eventRepository: EventRepository,
    private val authorizationService: AuthorizationService,
    private val clock: Clock,
    private val checkInterval: Duration,
) {
    private val log = LoggerFactory.getLogger(MatchFeedService::class.java)

    /** The team names in [url], so the admin can pick one instead of typing it. */
    fun teamsInFeed(callerId: UserId, teamId: TeamId, url: NevoboFeedUrl): List<String> {
        authorizationService.requireAdmin(callerId, teamId)
        return gateway.fetch(url).flatMap { listOf(it.homeTeam.value, it.awayTeam.value) }.distinct().sorted()
    }

    fun configure(callerId: UserId, teamId: TeamId, url: NevoboFeedUrl, teamName: NevoboTeamName): MatchFeedStatus {
        authorizationService.requireAdmin(callerId, teamId)
        val matches = gateway.fetch(url)
        if (matches.none { it.involves(teamName) }) throw UnknownFeedTeamException(teamName.value)
        repository.save(url, teamName, matches, clock.instant())
        return statusOf(repository.find()!!)
    }

    fun remove(callerId: UserId, teamId: TeamId) {
        authorizationService.requireAdmin(callerId, teamId)
        repository.delete()
    }

    /** Null when the team has no match feed. */
    fun status(callerId: UserId, teamId: TeamId): MatchFeedStatus? {
        authorizationService.requireAdmin(callerId, teamId)
        return repository.find()?.let(::statusOf)
    }

    /**
     * Reads the current team's feed again when its last check is older than [checkInterval]. Runs in the
     * team's tenant, without a caller: the scheduler calls it for every team.
     */
    fun checkIfDue() {
        val now = clock.instant()
        if (!repository.claimCheck(now, dueBefore = now.minus(checkInterval))) return
        val settings = repository.find() ?: return
        try {
            repository.recordSuccess(gateway.fetch(settings.url))
        } catch (e: MatchFeedUnavailableException) {
            log.warn("Match feed check failed for {}: {}", settings.url.value, e.message)
            repository.recordFailure()
        }
    }

    private fun statusOf(settings: MatchFeedSettings): MatchFeedStatus {
        val now = clock.instant()
        val findings = MatchFeedComparison.compare(
            matches = repository.matches(),
            team = settings.teamName,
            poule = settings.url.poule,
            events = eventRepository.findUpcoming(now.minus(Duration.ofDays(1))),
            zone = clock.zone,
            now = now,
        )
        return MatchFeedStatus(settings, findings)
    }
}
