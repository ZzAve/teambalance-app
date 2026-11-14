package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Language
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * Dev/test adapter: logs the magic link instead of sending a real email.
 * Active in every profile except prod, where [ScalewayTemEmailAdapter] takes over.
 * In e2e it is decorated by [RecordingEmailAdapter].
 */
@Component
@Profile("!prod")
class ConsoleEmailAdapter : EmailGateway {
    private val log = LoggerFactory.getLogger(ConsoleEmailAdapter::class.java)

    override fun sendMagicLink(email: Email, token: String, language: Language) {
        log.info("Magic link for {} ({}): token={}", email, language, token)
    }

    override fun sendTeamRequested(adminEmail: String, requesterEmail: Email, teamName: String, purpose: String) {
        log.info("Team request for admin {}: {} asks for '{}': {}", adminEmail, requesterEmail, teamName, purpose)
    }

    override fun sendTeamRequestReceived(to: Email, teamName: String, purpose: String, language: Language) {
        log.info("Team request received for {} ({}): '{}'", to, language, teamName)
    }

    override fun sendTeamRequestApproved(to: Email, teamName: String, code: CreationCode, language: Language) {
        log.info("Team request approved for {} ({}): '{}' code={}", to, language, teamName, code.value)
    }

    override fun sendTeamRequestRejected(to: Email, teamName: String, reason: String?, language: Language) {
        log.info("Team request rejected for {} ({}): '{}' reason={}", to, language, teamName, reason)
    }
}
