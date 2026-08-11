package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Email
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

    override fun sendMagicLink(email: Email, token: String) {
        log.info("Magic link for {}: token={}", email, token)
    }
}
