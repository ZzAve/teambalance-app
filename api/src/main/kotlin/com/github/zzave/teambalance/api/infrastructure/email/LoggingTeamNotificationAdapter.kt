package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.port.TeamNotificationGateway
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * Dev/test/e2e [TeamNotificationGateway]: logs the notifications instead of sending real email. Active in every
 * profile except prod, where [ScalewayTeamNotificationAdapter] takes over. Mirrors [ConsoleEmailAdapter].
 */
@Component
@Profile("!prod")
class LoggingTeamNotificationAdapter : TeamNotificationGateway {
    private val log = LoggerFactory.getLogger(LoggingTeamNotificationAdapter::class.java)

    override fun teamCreated(founderEmail: String, teamName: String, teamSlug: String) {
        log.info("Team-created notification for {}: team '{}' ({})", founderEmail, teamName, teamSlug)
    }

    override fun creationCodeConsumed(teamName: String, teamSlug: String, founderEmail: String) {
        log.info("Creation-code-consumed audit: team '{}' ({}) created by {}", teamName, teamSlug, founderEmail)
    }
}
