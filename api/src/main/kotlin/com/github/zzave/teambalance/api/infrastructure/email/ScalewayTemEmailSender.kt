package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.port.EmailSender
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Profile
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

/**
 * Production [EmailSender]: sends the magic-link login email via the Scaleway
 * Transactional Email (TEM) REST API. Blocking call on the request's (virtual) thread;
 * a non-2xx response propagates (RestClient's default), failing the login request.
 */
@Component
@Profile("prod")
class ScalewayTemEmailSender(
    @Value("\${teambalance.frontend-base-url}") private val frontendBaseUrl: String,
    @Value("\${teambalance.email.from-name}") private val fromName: String,
    @Value("\${teambalance.email.from-address}") private val fromAddress: String,
    @Value("\${teambalance.email.api-key}") private val apiKey: String,
    @Value("\${teambalance.email.project-id}") private val projectId: String,
    @Value("\${teambalance.email.region}") private val region: String,
    restClientBuilder: RestClient.Builder,
) : EmailSender {

    private val restClient = restClientBuilder.build()

    override fun sendMagicLink(email: Email, token: String) {
        val payload = MagicLinkEmail.render(MagicLinkEmail.url(frontendBaseUrl, token)).externalize(
            from = TemAddress(email = fromAddress, name = fromName),
            to = TemAddress(email = email.value),
            projectId = projectId,
        )
        restClient.post()
            .uri("https://api.scaleway.com/transactional-email/v1alpha1/regions/{region}/emails", region)
            .header("X-Auth-Token", apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .body(payload)
            .retrieve()
            .toBodilessEntity()
    }
}
