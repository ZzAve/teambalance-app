package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.port.EmailSender
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

/**
 * Dev/no-op adapter: logs the magic link instead of sending a real email.
 * Stand-in until a real email provider is integrated.
 */
@Component
class ConsoleEmailSender : EmailSender {
    private val log = LoggerFactory.getLogger(ConsoleEmailSender::class.java)

    override fun sendMagicLink(email: String, token: String) {
        log.info("Magic link for {}: token={}", email, token)
    }
}
