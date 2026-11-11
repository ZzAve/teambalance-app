package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Language
import com.github.zzave.teambalance.api.domain.port.EmailGateway

class FakeEmailGateway : EmailGateway {
    val sentMagicLinks = mutableListOf<Pair<Email, String>>()

    /** The email as the real adapters would render it, so an IT can read what the recipient got. */
    val renderedMagicLinks = mutableListOf<Pair<Email, RenderedEmail>>()

    /** Every team-request mail as the real adapter would render it, keyed by the recipient address. */
    val renderedTeamRequestMails = java.util.concurrent.CopyOnWriteArrayList<Pair<String, RenderedEmail>>()

    private val baseUrl = "http://localhost"

    override fun sendMagicLink(email: Email, token: String, language: Language) {
        sentMagicLinks.add(email to token)
        renderedMagicLinks.add(email to MagicLinkEmail.render(MagicLinkEmail.url(baseUrl, token), language))
    }

    override fun sendTeamRequested(adminEmail: String, requesterEmail: Email, teamName: String, purpose: String) {
        val adminUrl = TeamRequestEmails.adminCreationCodesUrl(baseUrl)
        renderedTeamRequestMails += adminEmail to TeamRequestEmails.requested(requesterEmail.value, teamName, purpose, adminUrl)
    }

    override fun sendTeamRequestReceived(to: Email, teamName: String, purpose: String, language: Language) {
        renderedTeamRequestMails += to.value to TeamRequestEmails.received(teamName, purpose, language)
    }

    override fun sendTeamRequestApproved(to: Email, teamName: String, code: CreationCode, language: Language) {
        val url = TeamRequestEmails.createTeamUrl(baseUrl, code.value, teamName)
        renderedTeamRequestMails += to.value to TeamRequestEmails.approved(teamName, url, language)
    }

    override fun sendTeamRequestRejected(to: Email, teamName: String, reason: String?, language: Language) {
        renderedTeamRequestMails += to.value to TeamRequestEmails.rejected(teamName, reason, language)
    }
}
