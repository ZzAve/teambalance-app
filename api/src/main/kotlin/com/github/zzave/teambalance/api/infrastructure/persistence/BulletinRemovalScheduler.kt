package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.application.BulletinService
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

/**
 * Removes for good, in every team, the Bulletin Board Posts deleted more than 14 days ago (ADR-0048).
 * It runs only while the backend runs; a backend scaled to zero removes them on its next run, so a
 * deleted Post can stay a little longer than 14 days, never shorter.
 */
@Component
@EnableScheduling
@ConditionalOnProperty("teambalance.bulletin.removal-scheduler-enabled", havingValue = "true", matchIfMissing = true)
class BulletinRemovalScheduler(
    private val teamRepository: TeamRepository,
    private val tenantScopeGateway: TenantScopeGateway,
    private val bulletinService: BulletinService,
) {
    private val log = LoggerFactory.getLogger(BulletinRemovalScheduler::class.java)

    @Scheduled(initialDelayString = "PT5M", fixedDelayString = "PT6H")
    @Suppress("TooGenericExceptionCaught")
    fun removeExpiredPosts() {
        teamRepository.findAll().forEach { team ->
            val routing = teamRepository.findTenantRoutingUnchecked(team.id) ?: return@forEach
            try {
                tenantScopeGateway.within(routing) { bulletinService.removeExpiredPosts() }
            } catch (e: RuntimeException) {
                log.error("Bulletin post removal failed for team {}", team.slug.value, e)
            }
        }
    }
}
