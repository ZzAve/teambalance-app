package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Email
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

    override fun sendMagicLink(email: Email, token: String) {
        val payload = MagicLinkEmail.render(MagicLinkEmail.url(frontendBaseUrl, token)).externalize(
            from = TemAddress(email = emailProperties.fromAddress, name = emailProperties.fromName),
            to = TemAddress(email = email.value),
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
