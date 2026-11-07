package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

private const val SPA_ORIGIN = "https://app.example.test"

/** In prod the SPA calls Spring Security's passkey endpoints cross-origin (ADR-0045). */
@AutoConfigureMockMvc
@TestPropertySource(properties = ["teambalance.cors.allowed-origins=$SPA_ORIGIN"])
class PasskeyCorsIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    private fun preflight(path: String, method: String) = mockMvc.perform(
        MockMvcRequestBuilders.options(path)
            .header("Origin", SPA_ORIGIN)
            .header("Access-Control-Request-Method", method)
            .header("Access-Control-Request-Headers", "content-type,x-xsrf-token"),
    )

    init {
        listOf("POST" to "/webauthn/authenticate/options", "POST" to "/login/webauthn", "POST" to "/webauthn/register/options",
            "POST" to "/webauthn/register", "DELETE" to "/webauthn/register/abc").forEach { (method, path) ->
            test("the SPA origin may preflight $method $path") {
                preflight(path, method)
                    .andExpect(status().isOk)
                    .andExpect(header().string("Access-Control-Allow-Origin", SPA_ORIGIN))
                    .andExpect(header().string("Access-Control-Allow-Credentials", "true"))
            }
        }
    }
}
