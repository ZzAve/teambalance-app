package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.application.E2eMagicLinkTokenRecorder
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * E2e-profile-only decorator: records the plaintext token in [E2eMagicLinkTokenRecorder]
 * (for the e2e support endpoint) and still logs it via [ConsoleEmailAdapter].
 */
@Component
@Primary
@Profile("e2e")
class RecordingEmailAdapter(
    private val delegate: ConsoleEmailAdapter,
    private val recorder: E2eMagicLinkTokenRecorder,
) : EmailGateway {

    override fun sendMagicLink(email: Email, token: String) {
        recorder.record(email.value, token)
        delegate.sendMagicLink(email, token)
    }
}
