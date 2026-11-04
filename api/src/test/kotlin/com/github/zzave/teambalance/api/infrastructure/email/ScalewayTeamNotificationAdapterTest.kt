package com.github.zzave.teambalance.api.infrastructure.email

import com.github.zzave.teambalance.api.domain.model.PlatformAdminAllowlist
import io.kotest.core.spec.style.FunSpec
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.web.client.RestClient

class ScalewayTeamNotificationAdapterTest : FunSpec({
    test("with sending switched off (stg), nothing goes to TEM") {
        val builder = RestClient.builder()
        val server = MockRestServiceServer.bindTo(builder).build()
        val adapter = ScalewayTeamNotificationAdapter(
            email = EmailProperties(
                fromName = "TeamBalance",
                fromAddress = "noreply@teambalance.nl",
                apiKey = "secret-key",
                projectId = "project-42",
                region = "fr-par",
                send = false,
            ),
            platformAdmins = PlatformAdminAllowlist(listOf("admin@example.com")),
            restClientBuilder = builder,
        )

        adapter.teamCreated("founder@example.com", "Setpoint VT", "setpoint-vt")
        adapter.creationCodeConsumed("Setpoint VT", "setpoint-vt", "founder@example.com")

        server.verify()
    }
})
