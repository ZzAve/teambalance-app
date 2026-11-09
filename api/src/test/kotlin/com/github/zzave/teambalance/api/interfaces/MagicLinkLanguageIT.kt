package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.email.FakeEmailGateway
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.UUID

/** The magic-link email goes out in the recipient's stored language, else the page's (ADR-0043 §4). */
@AutoConfigureMockMvc
class MagicLinkLanguageIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var fakeEmailGateway: FakeEmailGateway

    init {
        test("a new email asked from an English page gets the English email") {
            val email = "new-en-${UUID.randomUUID()}@test.com"

            requestMagicLink(email, language = "EN")

            subjectSentTo(email) shouldBe "Your TeamBalance sign-in link"
        }

        test("a user who stored Dutch gets the Dutch email, even from an English page") {
            val email = "stored-nl-${UUID.randomUUID()}@test.com"
            jdbcTemplate.update(
                "INSERT INTO public.users (id, email, display_name, language) VALUES (?, ?, 'Stored NL', 'nl')",
                UUID.randomUUID(),
                email,
            )

            requestMagicLink(email, language = "EN")

            subjectSentTo(email) shouldBe "Je inloglink voor TeamBalance"
        }

        test("without a stored or a page language, the email is Dutch") {
            val email = "no-language-${UUID.randomUUID()}@test.com"

            requestMagicLink(email, language = null)

            subjectSentTo(email) shouldBe "Je inloglink voor TeamBalance"
        }
    }

    private fun requestMagicLink(email: String, language: String?) {
        val body = if (language == null) """{"email":"$email"}""" else """{"email":"$email","language":"$language"}"""
        val started = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/magic-link/request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
        mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
            .andExpect(MockMvcResultMatchers.status().isAccepted)
    }

    private fun subjectSentTo(email: String): String =
        fakeEmailGateway.renderedMagicLinks.last { it.first.value == email }.second.subject
}
