package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.PlatformAdminAllowlist
import com.github.zzave.teambalance.api.domain.port.TeamNotifier
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

/**
 * Production [TeamNotifier]: sends the create-team notifications via the Scaleway TEM API, reusing the
 * same transport as [ScalewayTemEmailSender]. Fire-and-forget — every failure is caught and logged so a
 * mail hiccup can never fail a committed team creation. The audit mail goes to the
 * [PlatformAdminAllowlist]; with no admins configured it is silently skipped.
 */
@Component
@Primary
@Profile("prod")
class ScalewayTeamNotifier(
    private val email: EmailProperties,
    private val platformAdmins: PlatformAdminAllowlist,
    restClientBuilder: RestClient.Builder,
) : TeamNotifier {
    private val log = LoggerFactory.getLogger(ScalewayTeamNotifier::class.java)
    private val restClient = restClientBuilder.build()
    private val from = TemAddress(email = email.fromAddress, name = email.fromName)

    override fun teamCreated(founderEmail: String, teamName: String, teamSlug: String) {
        send(
            recipients = listOf(TemAddress(email = founderEmail)),
            rendered = TeamNotificationEmails.teamCreated(teamName),
            description = "team-created to $founderEmail",
        )
    }

    override fun creationCodeConsumed(teamName: String, teamSlug: String, founderEmail: String) {
        val recipients = platformAdmins.all().map { TemAddress(email = it) }
        if (recipients.isEmpty()) return
        send(
            recipients = recipients,
            rendered = TeamNotificationEmails.creationCodeConsumed(teamName, teamSlug, founderEmail),
            description = "creation-code-consumed audit for '$teamSlug'",
        )
    }

    @Suppress("TooGenericExceptionCaught")
    private fun send(recipients: List<TemAddress>, rendered: RenderedEmail, description: String) {
        try {
            val payload = TemSendEmailRequest(
                from = from,
                to = recipients,
                subject = rendered.subject,
                text = rendered.text,
                html = rendered.html,
                projectId = email.projectId,
            )
            restClient.post()
                .uri("https://api.scaleway.com/transactional-email/v1alpha1/regions/{region}/emails", email.region)
                .header("X-Auth-Token", email.apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity()
        } catch (e: Exception) {
            // Fire-and-forget: a failed notification must never fail the (already committed) creation.
            log.warn("TeamNotifier send failed ({}) — ignored", description, e)
        }
    }
}
