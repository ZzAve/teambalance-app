package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Email
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import java.util.concurrent.ConcurrentHashMap

/**
 * E2e-profile-only store of the last plaintext magic-link token per email.
 *
 * The database only holds the SHA-256 hash, so full-stack e2e tests cannot recover the
 * token from the DB. The infrastructure email adapter records the plaintext here at send
 * time, and the e2e support endpoint exposes it to Playwright. Never active outside the
 * `e2e` profile.
 */
@Component
@Profile("e2e")
class E2eMagicLinkTokenRecorder {
    private val tokensByEmail = ConcurrentHashMap<Email, String>()

    fun record(email: Email, token: String) {
        tokensByEmail[email] = token
    }

    fun lastTokenFor(email: Email): String? = tokensByEmail[email]
}
