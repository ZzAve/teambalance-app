package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.infrastructure.persistence.JooqPasskeyRepositoryAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.security.web.webauthn.api.AuthenticatorTransport
import org.springframework.security.web.webauthn.api.Bytes
import org.springframework.security.web.webauthn.api.ImmutableCredentialRecord
import org.springframework.security.web.webauthn.api.ImmutablePublicKeyCose
import org.springframework.security.web.webauthn.api.PublicKeyCredentialType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.nio.ByteBuffer
import java.security.MessageDigest
import java.sql.Timestamp
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Base64
import java.util.UUID

// Ids dedicated to this spec: the Testcontainers DB is shared across specs with no per-test rollback.
private val OWNER = UUID.fromString("e1000000-0000-0000-0000-0000000000b1")
private val STRANGER = UUID.fromString("e1000000-0000-0000-0000-0000000000b2")
private val CREDENTIAL_ID = Bytes(byteArrayOf(1, 2, 3, 4))

@AutoConfigureMockMvc
class PasskeyEndpointsIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    @Autowired
    lateinit var passkeys: JooqPasskeyRepositoryAdapter

    private fun handle(user: UUID) =
        Bytes(ByteBuffer.allocate(16).putLong(user.mostSignificantBits).putLong(user.leastSignificantBits).array())

    private fun seed(withPasskey: Boolean = false) {
        tenantSchemaAdapter.provisionPlatformSchema()
        jdbcTemplate.execute("DELETE FROM public.passkeys")
        listOf(OWNER, STRANGER).forEachIndexed { i, id ->
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) VALUES ('$id'::uuid, 'passkey-endpoint-$i@test.com', 'Passkey $i') " +
                    "ON CONFLICT (id) DO NOTHING",
            )
        }
        if (withPasskey) {
            passkeys.save(
                ImmutableCredentialRecord.builder()
                    .credentialType(PublicKeyCredentialType.PUBLIC_KEY)
                    .credentialId(CREDENTIAL_ID)
                    .userEntityUserId(handle(OWNER))
                    .publicKey(ImmutablePublicKeyCose(byteArrayOf(9)))
                    .signatureCount(0)
                    .uvInitialized(true)
                    .backupEligible(false)
                    .backupState(false)
                    .transports(setOf(AuthenticatorTransport.INTERNAL))
                    .attestationObject(Bytes(byteArrayOf(5)))
                    .label("This device")
                    .created(Instant.now())
                    .build(),
            )
        }
    }

    private fun deleteCredential() = MockMvcRequestBuilders.delete("/webauthn/register/${CREDENTIAL_ID.toBase64UrlString()}")

    private fun passkeyRows() = jdbcTemplate.queryForObject("SELECT count(*) FROM public.passkeys", Int::class.java)

    // The Wirespec endpoints are suspend functions: a handled request is answered in two steps.
    private fun settled(first: ResultActions): ResultActions {
        val result = first.andReturn()
        return if (result.request.isAsyncStarted) mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(result)) else first
    }

    private fun meAs(userId: UUID): ResultActions {
        val email = jdbcTemplate.queryForObject("SELECT email FROM public.users WHERE id = ?", String::class.java, userId)
        val token = "passkey-it-${UUID.randomUUID()}"
        jdbcTemplate.update(
            "INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, created_at) VALUES (?, ?, ?, ?, now())",
            UUID.randomUUID(),
            MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(it) },
            email,
            Timestamp.from(Instant.now().plus(1, ChronoUnit.HOURS)),
        )
        val verify = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify").contentType("application/json").content("""{"token":"$token"}"""),
        ).andExpect(request().asyncStarted()).andReturn()
        val cookie = mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(verify))
            .andExpect(status().isOk).andExpect(jsonPath("$.user.passkeyCount").isNumber).andReturn().response.getCookie("SESSION")!!
        return settled(mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/me").cookie(cookie)))
    }

    init {
        test("a signed-in user gets creation options bound to this app and to them") {
            seed()
            mockMvc.perform(MockMvcRequestBuilders.post("/webauthn/register/options").with(loginAs(OWNER)))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.rp.id").value("localhost"))
                .andExpect(jsonPath("$.user.name").value("passkey-endpoint-0@test.com"))
                .andExpect(jsonPath("$.user.id").value(Base64.getUrlEncoder().withoutPadding().encodeToString(handle(OWNER).bytes)))
                .andExpect(jsonPath("$.authenticatorSelection.residentKey").value("required"))
        }

        test("creation options are refused without a session") {
            mockMvc.perform(MockMvcRequestBuilders.post("/webauthn/register/options").with(csrf()))
                .andExpect(status().isBadRequest)
        }

        test("authentication options need neither a session nor a CSRF token when sent as JSON") {
            mockMvc.perform(MockMvcRequestBuilders.post("/webauthn/authenticate/options").contentType("application/json"))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.challenge").isNotEmpty)
                .andExpect(jsonPath("$.rpId").value("localhost"))
        }

        test("the session an anonymous challenge opens expires after five minutes, not the session timeout") {
            val options = MockMvcRequestBuilders.post("/webauthn/authenticate/options").contentType("application/json")
            val sessionCookie = mockMvc.perform(options).andExpect(status().isOk).andReturn().response.getCookie("SESSION")!!
            val sessionId = String(Base64.getDecoder().decode(sessionCookie.value))

            jdbcTemplate.queryForObject(
                "SELECT max_inactive_interval FROM spring_session WHERE session_id = ?", Int::class.java, sessionId,
            ) shouldBe 300
        }

        test("authentication options sent as a form still need a CSRF token") {
            mockMvc.perform(MockMvcRequestBuilders.post("/webauthn/authenticate/options").contentType("application/x-www-form-urlencoded"))
                .andExpect(status().isForbidden)
        }

        test("a passkey login without a challenge in the session is refused and signs nobody in") {
            val response = mockMvc.perform(
                MockMvcRequestBuilders.post("/login/webauthn").contentType("application/json").content("{}"),
            ).andExpect(status().isUnauthorized).andReturn().response

            // The real server sets no SESSION cookie here (the load reads the session without opening one); MockMvc's
            // test CSRF support may add one, so this asserts the part that matters: nobody is signed in.
            val me = MockMvcRequestBuilders.get("/api/auth/me")
            settled(mockMvc.perform(response.getCookie("SESSION")?.let { me.cookie(it) } ?: me)).andExpect(status().isUnauthorized)
        }

        test("a passkey the server does not know is refused as unknown_passkey; other failures carry no body") {
            val options = MockMvcRequestBuilders.post("/webauthn/authenticate/options").contentType("application/json")
            val session = mockMvc.perform(options).andExpect(status().isOk).andReturn().response.getCookie("SESSION")!!
            val id = Bytes(byteArrayOf(9, 9, 9, 9)).toBase64UrlString()
            val assertion = """{"id":"$id","rawId":"$id","type":"public-key","clientExtensionResults":{},""" +
                """"response":{"authenticatorData":"AA","clientDataJSON":"e30","signature":"AA"}}"""

            mockMvc.perform(
                MockMvcRequestBuilders.post("/login/webauthn").cookie(session).contentType("application/json").content(assertion),
            ).andExpect(status().isUnauthorized).andExpect(jsonPath("$.error").value("unknown_passkey"))

            mockMvc.perform(MockMvcRequestBuilders.post("/login/webauthn").contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized).andExpect(content().string(""))
        }

        test("the list shows the caller's passkeys with a base64url id") {
            seed(withPasskey = true)
            settled(mockMvc.perform(MockMvcRequestBuilders.get("/api/account/passkeys").with(loginAs(OWNER))))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$[0].label").value("This device"))
                .andExpect(jsonPath("$[0].id").value(CREDENTIAL_ID.toBase64UrlString()))
        }

        test("the list needs a session") {
            seed()
            settled(mockMvc.perform(MockMvcRequestBuilders.get("/api/account/passkeys").with(csrf())))
                .andExpect(status().isUnauthorized)
        }

        test("the owner can delete a passkey") {
            seed(withPasskey = true)
            mockMvc.perform(deleteCredential().with(loginAs(OWNER)))
                .andExpect(status().isNoContent)

            passkeyRows() shouldBe 0
        }

        test("someone else cannot delete it") {
            seed(withPasskey = true)
            mockMvc.perform(deleteCredential().with(loginAs(STRANGER)))
                .andExpect(status().isForbidden)

            passkeyRows() shouldBe 1
        }

        test("/api/auth/me reports how many passkeys the caller has") {
            seed()
            meAs(OWNER).andExpect(status().isOk).andExpect(jsonPath("$.passkeyCount").value(0))

            seed(withPasskey = true)
            meAs(OWNER).andExpect(status().isOk).andExpect(jsonPath("$.passkeyCount").value(1))
        }
    }
}
