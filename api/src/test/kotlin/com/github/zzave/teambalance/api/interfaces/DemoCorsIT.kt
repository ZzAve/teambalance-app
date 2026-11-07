package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.HttpHeaders
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

/**
 * The demo image runs the pure `prod` profile with `TEAMBALANCE_CORS_ALLOWED_ORIGINS=https://demo.teambalance.nl`
 * (api/Dockerfile, demo stage). The property below is the same override: it replaces prod's origin list, so the
 * demo accepts its own host (the container sees http behind the TLS edge, so Spring treats the same-host POST as
 * cross-origin) and refuses prod's origins.
 */
@ActiveProfiles("prod", inheritProfiles = false)
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "teambalance.cors.allowed-origins=https://demo.teambalance.nl",
        "teambalance.demo.enabled=true",
        "teambalance.email.send=false",
        "teambalance.bunq.environment=fake",
        "teambalance.invitation.token-salt=demo-cors-salt",
        "teambalance.invitation.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1zbW9rZS1rZXktMzJieXQ=",
        "teambalance.calendar-link.token-salt=demo-cors-calendar-salt",
        "teambalance.calendar-link.token-encryption-key=cHJvZC1zbW9rZS1jYWxlbmRhci1rZXktMzJieXRlcyE=",
        "teambalance.bunq.token-encryption-key=dGVhbWJhbGFuY2UtcHJvZC1idW5xLXNtb2tlLWtleTE=",
        "teambalance.email.api-key=demo-cors-key",
        "teambalance.email.project-id=demo-cors-project",
        "teambalance.internal.api-key=demo-cors-internal-key",
    ],
)
class DemoCorsIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    init {
        test("the demo host may start a guest session cross-origin with credentials") {
            preflight("https://demo.teambalance.nl")
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(
                    MockMvcResultMatchers.header()
                        .string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://demo.teambalance.nl"),
                )
                .andExpect(
                    MockMvcResultMatchers.header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"),
                )
        }

        test("prod's app origin is refused by the demo") {
            preflight("https://app.teambalance.nl").andExpect(MockMvcResultMatchers.status().isForbidden)
        }

        test("prod's landing-page origin is refused by the demo") {
            preflight("https://teambalance.nl").andExpect(MockMvcResultMatchers.status().isForbidden)
        }
    }

    private fun preflight(origin: String) = mockMvc.perform(
        MockMvcRequestBuilders.options("/api/demo/session")
            .header(HttpHeaders.ORIGIN, origin)
            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Content-Type"),
    )
}
