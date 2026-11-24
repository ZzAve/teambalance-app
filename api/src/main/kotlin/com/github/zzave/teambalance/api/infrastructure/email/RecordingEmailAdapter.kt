package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.application.E2eMagicLinkTokenRecorder
import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Language
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

    override fun sendMagicLink(email: Email, token: String, language: Language) {
        recorder.record(email, token)
        delegate.sendMagicLink(email, token, language)
    }

    // Only the magic-link token is recorded for the e2e support endpoint; the team-request mails pass through.
    override fun sendTeamRequested(adminEmail: String, requesterEmail: Email, teamName: String, purpose: String) =
        delegate.sendTeamRequested(adminEmail, requesterEmail, teamName, purpose)

    override fun sendTeamRequestReceived(to: Email, teamName: String, purpose: String, language: Language) =
        delegate.sendTeamRequestReceived(to, teamName, purpose, language)

    override fun sendTeamRequestApproved(to: Email, teamName: String, code: CreationCode, language: Language) =
        delegate.sendTeamRequestApproved(to, teamName, code, language)

    override fun sendTeamRequestRejected(to: Email, teamName: String, reason: String?, language: Language) =
        delegate.sendTeamRequestRejected(to, teamName, reason, language)
}
