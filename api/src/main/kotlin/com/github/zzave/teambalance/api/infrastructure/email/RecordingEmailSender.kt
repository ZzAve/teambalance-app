package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.application.E2eMagicLinkTokenRecorder
import com.github.zzave.teambalance.api.domain.port.EmailSender
import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * E2e-profile-only decorator: records the plaintext token in [E2eMagicLinkTokenRecorder]
 * (for the e2e support endpoint) and still logs it via [ConsoleEmailSender].
 */
@Component
@Primary
@Profile("e2e")
class RecordingEmailSender(
    private val delegate: ConsoleEmailSender,
    private val recorder: E2eMagicLinkTokenRecorder,
) : EmailSender {

    override fun sendMagicLink(email: String, token: String) {
        recorder.record(email, token)
        delegate.sendMagicLink(email, token)
    }
}
