package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.SecureTokens
import jakarta.servlet.http.Cookie
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

/**
 * A real signed-in session for specs that need requests carried by the session cookie rather than
 * the X-User-Id shim. Requires the platform schema to be provisioned.
 */
object MagicLinkSessionFixture {
    /** The user the magic link resolved to, plus the session cookies to carry. */
    class SignedIn(val userId: UUID, val cookies: Array<Cookie>)

    fun signIn(mockMvc: MockMvc, jdbc: JdbcTemplate, email: String): SignedIn {
        val rawToken = "session-${UUID.randomUUID()}"
        jdbc.update(
            """
            INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, used_at, created_at)
            VALUES (?, ?, ?, ?, NULL, now())
            """,
            UUID.randomUUID(),
            SecureTokens.sha256Hex(rawToken.toByteArray()),
            email,
            Timestamp.from(Instant.now().plusSeconds(900)),
        )
        val response = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"token":"$rawToken"}"""),
        )
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn().response
        val userId = UUID.fromString(
            Regex("\"id\":\"([^\"]+)\"").find(response.contentAsString)!!.groupValues[1],
        )
        return SignedIn(userId, response.cookies)
    }
}
