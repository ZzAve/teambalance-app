package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.Email
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import org.hamcrest.Matchers.containsString
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers.header
import org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath
import org.springframework.test.web.client.match.MockRestRequestMatchers.method
import org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo
import org.springframework.test.web.client.response.MockRestResponseCreators.withServerError
import org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientResponseException

class ScalewayTemEmailSenderTest : FunSpec() {

    private fun sender(builder: RestClient.Builder) = ScalewayTemEmailSender(
        frontendBaseUrl = "https://app.teambalance.nl",
        emailProperties = EmailProperties(
            fromName = "TeamBalance",
            fromAddress = "login@teambalance.nl",
            apiKey = "secret-key",
            projectId = "project-42",
            region = "fr-par",
        ),
        restClientBuilder = builder,
    )

    init {
        test("sends the magic link to TEM: region endpoint, auth header, and payload") {
            val builder = RestClient.builder()
            val server = MockRestServiceServer.bindTo(builder).build()
            server.expect(requestTo("https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("X-Auth-Token", "secret-key"))
                .andExpect(jsonPath("$.from.email").value("login@teambalance.nl"))
                .andExpect(jsonPath("$.to[0].email").value("speler@example.com"))
                .andExpect(jsonPath("$.project_id").value("project-42"))
                .andExpect(jsonPath("$.text").value(containsString("/auth/verify?token=tok-123")))
                .andExpect(jsonPath("$.html").value(containsString("/auth/verify?token=tok-123")))
                .andRespond(withSuccess("""{"message_id":"m-1"}""", MediaType.APPLICATION_JSON))

            sender(builder).sendMagicLink(Email("speler@example.com"), "tok-123")

            server.verify()
        }

        test("a non-2xx TEM response propagates so the login request fails") {
            val builder = RestClient.builder()
            val server = MockRestServiceServer.bindTo(builder).build()
            server.expect(requestTo("https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails"))
                .andRespond(withServerError())

            shouldThrow<RestClientResponseException> {
                sender(builder).sendMagicLink(Email("speler@example.com"), "tok-123")
            }

            server.verify()
        }
    }
}
