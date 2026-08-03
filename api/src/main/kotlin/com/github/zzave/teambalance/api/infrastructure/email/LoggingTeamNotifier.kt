package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.port.TeamNotifier
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * Dev/test/e2e [TeamNotifier]: logs the notifications instead of sending real email. Active in every
 * profile except prod, where [ScalewayTeamNotifier] takes over. Mirrors [ConsoleEmailSender].
 */
@Component
@Profile("!prod")
class LoggingTeamNotifier : TeamNotifier {
    private val log = LoggerFactory.getLogger(LoggingTeamNotifier::class.java)

    override fun teamCreated(founderEmail: String, teamName: String, teamSlug: String) {
        log.info("Team-created notification for {}: team '{}' ({})", founderEmail, teamName, teamSlug)
    }

    override fun creationCodeConsumed(teamName: String, teamSlug: String, founderEmail: String) {
        log.info("Creation-code-consumed audit: team '{}' ({}) created by {}", teamName, teamSlug, founderEmail)
    }
}
