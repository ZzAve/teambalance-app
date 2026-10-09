package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.SecureTokens
import com.github.zzave.teambalance.api.domain.model.Photo
import com.github.zzave.teambalance.api.domain.model.jpegBytes
import com.github.zzave.teambalance.api.domain.model.webpBytes
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.HttpHeaders
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.sql.Timestamp
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

// Ids dedicated to this spec: the Testcontainers DB is shared across specs with no per-test rollback.
private const val ADMIN_ID = "d0000000-0000-0000-0000-0000000000b1"
private const val MEMBER_ID = "d0000000-0000-0000-0000-0000000000b2"
private const val OTHER_ID = "d0000000-0000-0000-0000-0000000000b3"
private const val TEAMLESS_ID = "d0000000-0000-0000-0000-0000000000b4"
private const val TEAM_ID = "b0000000-0000-0000-0000-0000000000bb"
private const val TEAM_SCHEMA = "team_photo_it"
private const val IMMUTABLE_CACHE = "private, max-age=31536000, immutable"

@AutoConfigureMockMvc
class PhotoControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    private fun seed() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema(TEAM_SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Photo IT Team', 'photo-it-team', '$TEAM_SCHEMA') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("DELETE FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid")
        listOf(ADMIN_ID, MEMBER_ID, OTHER_ID, TEAMLESS_ID).forEachIndexed { i, id ->
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) VALUES ('$id'::uuid, 'photo-$i@test.com', 'Photo $i') " +
                    "ON CONFLICT (id) DO NOTHING",
            )
        }
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$ADMIN_ID'::uuid, 'ADMIN', 'Setter')")
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$MEMBER_ID'::uuid, 'USER', 'Libero')")
        jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$OTHER_ID'::uuid, 'USER', 'Setter')")
        jdbcTemplate.execute("DELETE FROM $TEAM_SCHEMA.member_photos")
        jdbcTemplate.execute(
            "DELETE FROM public.personal_photos WHERE user_id IN " +
                "('$ADMIN_ID'::uuid, '$MEMBER_ID'::uuid, '$OTHER_ID'::uuid, '$TEAMLESS_ID'::uuid)",
        )
    }

    private fun send(builder: MockHttpServletRequestBuilder, userId: String, body: ByteArray? = null): ResultActions {
        builder.header("X-User-Id", userId)
        if (body != null) builder.content(body).contentType("image/webp")
        return mockMvc.perform(builder)
    }

    // The Wirespec endpoints are suspend functions, so MockMvc answers them in two steps.
    private fun sendAsync(builder: MockHttpServletRequestBuilder, userId: String): ResultActions {
        val started = mockMvc.perform(builder.header("X-User-Id", userId))
            .andExpect(request().asyncStarted()).andReturn()
        return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
    }

    // /api/auth/me reads the session, not the X-User-Id test shim, so sign in through a magic link.
    private fun meAs(userId: String): ResultActions {
        val email = jdbcTemplate.queryForObject("SELECT email FROM public.users WHERE id = ?::uuid", String::class.java, userId)
        val token = "photo-it-${UUID.randomUUID()}"
        jdbcTemplate.update(
            "INSERT INTO public.magic_link_tokens (id, token_hash, email, expires_at, created_at) " +
                "VALUES (?, ?, ?, ?, now())",
            UUID.randomUUID(),
            SecureTokens.sha256Hex(token.toByteArray()),
            email,
            Timestamp.from(Instant.now().plus(1, ChronoUnit.HOURS)),
        )
        val verify = mockMvc.perform(
            MockMvcRequestBuilders.post("/api/auth/magic-link/verify").contentType("application/json")
                .content("""{"token":"$token"}"""),
        ).andExpect(request().asyncStarted()).andReturn()
        val cookie = mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(verify))
            .andExpect(status().isOk).andReturn().response.cookies.first()
        val started = mockMvc.perform(MockMvcRequestBuilders.get("/api/auth/me").cookie(cookie))
            .andExpect(request().asyncStarted()).andReturn()
        return mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(started))
    }

    private fun putTeamPhoto(userId: String, body: ByteArray) =
        send(MockMvcRequestBuilders.put("/api/members/me/photo"), userId, body)

    private fun getTeamPhoto(callerId: String, ownerId: String) =
        send(MockMvcRequestBuilders.get("/api/members/$ownerId/photo"), callerId)

    private fun deleteTeamPhoto(callerId: String, ownerId: String) =
        send(MockMvcRequestBuilders.delete("/api/members/$ownerId/photo"), callerId)

    private fun photoVersionOf(ownerId: String): String? {
        val body = sendAsync(MockMvcRequestBuilders.get("/api/members"), ADMIN_ID)
            .andExpect(status().isOk).andReturn().response.contentAsString
        val root = tools.jackson.module.kotlin.jacksonObjectMapper().readTree(body)
        val node = root["members"].first { it["userId"].asString() == ownerId }["photoVersion"]
        return node?.takeIf { !it.isNull }?.asString()
    }

    init {
        test("PUT then GET returns the same bytes as image/webp with an immutable private cache header") {
            seed()
            val bytes = webpBytes(64)
            putTeamPhoto(MEMBER_ID, bytes).andExpect(status().isNoContent)

            val response = getTeamPhoto(OTHER_ID, MEMBER_ID)
                .andExpect(status().isOk)
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "image/webp"))
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, IMMUTABLE_CACHE))
                .andReturn().response
            response.contentAsByteArray.toList() shouldBe bytes.toList()
        }

        test("a JPEG upload round-trips as image/jpeg") {
            seed()
            val bytes = jpegBytes(64)
            putTeamPhoto(MEMBER_ID, bytes).andExpect(status().isNoContent)

            val response = getTeamPhoto(MEMBER_ID, MEMBER_ID)
                .andExpect(status().isOk)
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "image/jpeg"))
                .andReturn().response
            response.contentAsByteArray.toList() shouldBe bytes.toList()
        }

        test("GET of a member without a Team Photo is 404") {
            seed()
            getTeamPhoto(OTHER_ID, MEMBER_ID).andExpect(status().isNotFound)
        }

        test("the roster shows photoVersion once a Team Photo exists") {
            seed()
            photoVersionOf(MEMBER_ID) shouldBe null
            putTeamPhoto(MEMBER_ID, webpBytes(64)).andExpect(status().isNoContent)
            photoVersionOf(MEMBER_ID) shouldBe Photo(webpBytes(64)).version
        }

        test("PNG bytes are rejected with 400 INVALID_PHOTO") {
            seed()
            val png = byteArrayOf(0x89.toByte(), 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A) + ByteArray(32)
            putTeamPhoto(MEMBER_ID, png)
                .andExpect(status().isBadRequest)
                .andExpect(jsonPath("$.code").value("INVALID_PHOTO"))
        }

        test("200 KB is accepted, 200 KB + 1 is rejected with 400 PHOTO_TOO_LARGE") {
            seed()
            putTeamPhoto(MEMBER_ID, webpBytes(200 * 1024)).andExpect(status().isNoContent)
            putTeamPhoto(MEMBER_ID, webpBytes(200 * 1024 + 1))
                .andExpect(status().isBadRequest)
                .andExpect(jsonPath("$.code").value("PHOTO_TOO_LARGE"))
        }

        test("an admin removes another member's Team Photo and photoVersion becomes null") {
            seed()
            putTeamPhoto(MEMBER_ID, webpBytes(64)).andExpect(status().isNoContent)

            deleteTeamPhoto(ADMIN_ID, MEMBER_ID).andExpect(status().isNoContent)
            photoVersionOf(MEMBER_ID) shouldBe null
        }

        test("a plain member removing another member's Team Photo is 403") {
            seed()
            putTeamPhoto(MEMBER_ID, webpBytes(64)).andExpect(status().isNoContent)

            deleteTeamPhoto(OTHER_ID, MEMBER_ID).andExpect(status().isForbidden)
            getTeamPhoto(OTHER_ID, MEMBER_ID).andExpect(status().isOk)
        }

        test("a member removes their own Team Photo") {
            seed()
            putTeamPhoto(MEMBER_ID, webpBytes(64)).andExpect(status().isNoContent)
            deleteTeamPhoto(MEMBER_ID, MEMBER_ID).andExpect(status().isNoContent)
            getTeamPhoto(MEMBER_ID, MEMBER_ID).andExpect(status().isNotFound)
        }

        test("the Personal Photo can be uploaded, read and removed by a user with no team") {
            seed()
            val bytes = webpBytes(48)
            send(MockMvcRequestBuilders.put("/api/account/photo"), TEAMLESS_ID, bytes).andExpect(status().isNoContent)

            val response = send(MockMvcRequestBuilders.get("/api/account/photo"), TEAMLESS_ID)
                .andExpect(status().isOk)
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "image/webp"))
                .andExpect(header().string(HttpHeaders.CACHE_CONTROL, IMMUTABLE_CACHE))
                .andReturn().response
            response.contentAsByteArray.toList() shouldBe bytes.toList()

            send(MockMvcRequestBuilders.delete("/api/account/photo"), TEAMLESS_ID).andExpect(status().isNoContent)
            send(MockMvcRequestBuilders.get("/api/account/photo"), TEAMLESS_ID).andExpect(status().isNotFound)
        }

        test("an invalid Personal Photo is rejected with 400 INVALID_PHOTO") {
            seed()
            send(MockMvcRequestBuilders.put("/api/account/photo"), TEAMLESS_ID, ByteArray(40))
                .andExpect(status().isBadRequest)
                .andExpect(jsonPath("$.code").value("INVALID_PHOTO"))
        }

        test("/api/auth/me reports personalPhotoVersion") {
            seed()
            meAs(MEMBER_ID).andExpect(status().isOk).andExpect(jsonPath("$.personalPhotoVersion").doesNotExist())

            send(MockMvcRequestBuilders.put("/api/account/photo"), MEMBER_ID, webpBytes(48)).andExpect(status().isNoContent)
            meAs(MEMBER_ID)
                .andExpect(status().isOk)
                .andExpect(jsonPath("$.personalPhotoVersion").value(Photo(webpBytes(48)).version))
        }

        test("copying the Personal Photo gives the Team Photo the same bytes") {
            seed()
            val bytes = webpBytes(48)
            send(MockMvcRequestBuilders.put("/api/account/photo"), MEMBER_ID, bytes).andExpect(status().isNoContent)
            send(MockMvcRequestBuilders.post("/api/members/me/photo/from-personal"), MEMBER_ID)
                .andExpect(status().isNoContent)

            getTeamPhoto(OTHER_ID, MEMBER_ID).andExpect(status().isOk).andReturn().response
                .contentAsByteArray.toList() shouldBe bytes.toList()
        }

        test("copying without a Personal Photo is 404") {
            seed()
            send(MockMvcRequestBuilders.post("/api/members/me/photo/from-personal"), MEMBER_ID)
                .andExpect(status().isNotFound)
        }

        test("removing a member discards their Team Photo, and re-adding starts without one") {
            seed()
            putTeamPhoto(MEMBER_ID, webpBytes(64)).andExpect(status().isNoContent)

            sendAsync(MockMvcRequestBuilders.delete("/api/members/$MEMBER_ID"), ADMIN_ID).andExpect(status().isNoContent)
            jdbcTemplate.queryForObject("SELECT COUNT(*) FROM $TEAM_SCHEMA.member_photos", Int::class.java) shouldBe 0

            jdbcTemplate.execute(
                "UPDATE public.team_members SET active = true WHERE team_id = '$TEAM_ID'::uuid AND user_id = '$MEMBER_ID'::uuid",
            )
            photoVersionOf(MEMBER_ID) shouldBe null
        }
    }
}
