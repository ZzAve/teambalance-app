package com.github.zzave.teambalance.api.infrastructure.nevobo

import com.github.zzave.teambalance.api.application.MatchFeedService
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

/**
 * Asks every team's match feed to check itself while the backend runs (ADR-0047). It does not start the
 * backend: a container that is scaled to zero runs no check, and the next one that runs catches up, because
 * each feed stores when it was last checked and [MatchFeedService.checkIfDue] skips a feed that is not due.
 */
@Component
@EnableScheduling
@ConditionalOnProperty("teambalance.match-feed.scheduler-enabled", havingValue = "true", matchIfMissing = true)
class MatchFeedScheduler(
    private val teamRepository: TeamRepository,
    private val tenantScopeGateway: TenantScopeGateway,
    private val matchFeedService: MatchFeedService,
) {
    private val log = LoggerFactory.getLogger(MatchFeedScheduler::class.java)

    @Scheduled(
        initialDelayString = "\${teambalance.match-feed.poll-initial-delay:PT1M}",
        fixedDelayString = "\${teambalance.match-feed.poll-interval:PT1H}",
    )
    @Suppress("TooGenericExceptionCaught")
    fun checkDueFeeds() {
        teamRepository.findAll().forEach { team ->
            val routing = teamRepository.findTenantRoutingUnchecked(team.id) ?: return@forEach
            try {
                tenantScopeGateway.within(routing) { matchFeedService.checkIfDue() }
            } catch (e: RuntimeException) {
                log.error("Match feed check failed for team {}", team.slug.value, e)
            }
        }
    }
}
