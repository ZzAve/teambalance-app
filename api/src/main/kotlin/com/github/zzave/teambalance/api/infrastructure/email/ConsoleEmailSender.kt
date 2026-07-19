package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.port.EmailSender
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * Dev/test adapter: logs the magic link instead of sending a real email.
 * Active in every profile except prod, where [ScalewayTemEmailSender] takes over.
 * In e2e it is decorated by [RecordingEmailSender].
 */
@Component
@Profile("!prod")
class ConsoleEmailSender : EmailSender {
    private val log = LoggerFactory.getLogger(ConsoleEmailSender::class.java)

    override fun sendMagicLink(email: String, token: String) {
        log.info("Magic link for {}: token={}", email, token)
    }
}
