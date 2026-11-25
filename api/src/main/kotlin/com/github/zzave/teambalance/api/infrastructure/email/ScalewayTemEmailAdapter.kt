package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.CreationCode
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.Language
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Profile
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

/**
 * Production [EmailGateway]: sends the magic-link login email via the Scaleway
 * Transactional Email (TEM) REST API. Blocking call on the request's (virtual) thread;
 * a non-2xx response propagates (RestClient's default), failing the login request.
 */
@Component
@Profile("prod")
class ScalewayTemEmailAdapter(
    @Value("\${teambalance.frontend-base-url}") private val frontendBaseUrl: String,
    private val emailProperties: EmailProperties,
    restClientBuilder: RestClient.Builder,
) : EmailGateway {

    private val restClient = restClientBuilder.build()
    private val console = ConsoleEmailAdapter()

    override fun sendMagicLink(email: Email, token: String, language: Language) {
        if (!emailProperties.send) return console.sendMagicLink(email, token, language)
        send(MagicLinkEmail.render(MagicLinkEmail.url(frontendBaseUrl, token), language), email.value)
    }

    override fun sendTeamRequested(adminEmail: String, requesterEmail: Email, teamName: String, purpose: String) {
        if (!emailProperties.send) return console.sendTeamRequested(adminEmail, requesterEmail, teamName, purpose)
        val adminUrl = TeamRequestEmails.adminCreationCodesUrl(frontendBaseUrl)
        send(TeamRequestEmails.requested(requesterEmail.value, teamName, purpose, adminUrl), adminEmail)
    }

    override fun sendTeamRequestReceived(to: Email, teamName: String, purpose: String, language: Language) {
        if (!emailProperties.send) return console.sendTeamRequestReceived(to, teamName, purpose, language)
        send(TeamRequestEmails.received(teamName, purpose, language), to.value)
    }

    override fun sendTeamRequestApproved(to: Email, teamName: String, code: CreationCode, language: Language) {
        if (!emailProperties.send) return console.sendTeamRequestApproved(to, teamName, code, language)
        val url = TeamRequestEmails.createTeamUrl(frontendBaseUrl, code.value, teamName)
        send(TeamRequestEmails.approved(teamName, url, language), to.value)
    }

    override fun sendTeamRequestRejected(to: Email, teamName: String, reason: String?, language: Language) {
        if (!emailProperties.send) return console.sendTeamRequestRejected(to, teamName, reason, language)
        send(TeamRequestEmails.rejected(teamName, reason, language), to.value)
    }

    private fun send(rendered: RenderedEmail, to: String) {
        val payload = rendered.externalize(
            from = TemAddress(email = emailProperties.fromAddress, name = emailProperties.fromName),
            to = TemAddress(email = to),
            projectId = emailProperties.projectId,
        )
        restClient.post()
            .uri(
                "https://api.scaleway.com/transactional-email/v1alpha1/regions/{region}/emails",
                emailProperties.region,
            )
            .header("X-Auth-Token", emailProperties.apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .body(payload)
            .retrieve()
            .toBodilessEntity()
    }
}
