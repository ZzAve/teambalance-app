package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.identity.loginAs
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

private const val ADMIN = "d1000000-0000-0000-0000-0000000000a1"
private const val LISA = "d1000000-0000-0000-0000-0000000000a2"
private const val TOM = "d1000000-0000-0000-0000-0000000000a3"
private const val TEAM_ID = "b1000000-0000-0000-0000-0000000000aa"
private const val TEAM_SCHEMA = "team_alias_it"
private const val NL_IBAN = "NL91ABNA0417164300"
private const val DE_IBAN = "DE89370400440532013000"
private const val BE_IBAN = "BE68539007547034"

/** Who may read and write a member's payment aliases (ADR-0045), and the rules on what they hold. */
@AutoConfigureMockMvc
class PaymentAliasControllerIT : TeamBalanceIT() {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { seedTeam() }

        test("the owner creates, lists, updates and deletes their own aliases; the IBAN is stored normalised") {
            val id = create(LISA, LISA, """{"name":" L. de Vries ","iban":"nl91 abna 0417 1643 00"}""")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("L. de Vries"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.ibanMasked").value("NL91 •••• •••• ••43 00"))
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString(NL_IBAN))))
                .idOf()

            call(get(LISA), LISA)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.aliases.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.aliases[0].id").value(id))
                .andExpect(MockMvcResultMatchers.jsonPath("$.aliases[0].hasIban").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.aliases[0].ibanMasked").value("NL91 •••• •••• ••43 00"))
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString(NL_IBAN))))

            call(put(LISA, id, """{"name":"","iban":"$DE_IBAN"}"""), LISA)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.ibanMasked").value("DE89 •••• •••• •••• ••30 00"))
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString(DE_IBAN))))

            call(MockMvcRequestBuilders.delete("/api/members/$LISA/payment-aliases/$id"), LISA)
                .andExpect(MockMvcResultMatchers.status().isNoContent)
            call(get(LISA), LISA).andExpect(MockMvcResultMatchers.jsonPath("$.aliases.length()").value(0))
        }

        test("the IBAN is write-only: an update without iban keeps it, clearIban removes it, and an alias cannot end up empty") {
            val id = create(LISA, LISA, """{"name":"Lisa B.","iban":"$NL_IBAN"}""").idOf()

            call(put(LISA, id, """{"name":"Lisa Bakker"}"""), LISA)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.hasIban").value(true))
            storedIban(id) shouldBe NL_IBAN

            call(put(LISA, id, """{"name":null}"""), LISA).andExpect(MockMvcResultMatchers.jsonPath("$.hasIban").value(true))
            storedIban(id) shouldBe NL_IBAN

            call(put(LISA, id, """{"name":"Lisa Bakker","clearIban":true}"""), LISA)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.hasIban").value(false))
                .andExpect(MockMvcResultMatchers.jsonPath("$.ibanMasked").doesNotExist())
            storedIban(id) shouldBe null

            call(put(LISA, id, """{"name":"","clearIban":true}"""), LISA).andExpect(MockMvcResultMatchers.status().isBadRequest)
            call(put(LISA, id, """{"iban":"$DE_IBAN","clearIban":true}"""), LISA).andExpect(MockMvcResultMatchers.status().isBadRequest)
            storedIban(id) shouldBe null
        }

        test("the name works like the IBAN: omitted keeps it, an empty name clears it") {
            val id = create(LISA, LISA, """{"name":"Lisa B.","iban":"$NL_IBAN"}""").idOf()

            call(put(LISA, id, """{"iban":"$DE_IBAN"}"""), LISA)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Lisa B."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.ibanMasked").value("DE89 •••• •••• •••• ••30 00"))
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString(DE_IBAN))))
            storedIban(id) shouldBe DE_IBAN

            call(put(LISA, id, """{"name":"  "}"""), LISA)
                .andExpect(MockMvcResultMatchers.status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").doesNotExist())
                .andExpect(MockMvcResultMatchers.jsonPath("$.hasIban").value(true))

            call(put(LISA, id, """{"name":"","clearIban":true}"""), LISA).andExpect(MockMvcResultMatchers.status().isBadRequest)
        }

        test("an Admin reads and writes another member's aliases") {
            val id = create(ADMIN, LISA, """{"name":"Lisa B."}""")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .idOf()

            call(get(LISA), ADMIN).andExpect(MockMvcResultMatchers.jsonPath("$.aliases[0].name").value("Lisa B."))
            call(put(LISA, id, """{"name":"Lisa Bakker"}"""), ADMIN).andExpect(MockMvcResultMatchers.status().isOk)
            call(MockMvcRequestBuilders.delete("/api/members/$LISA/payment-aliases/$id"), ADMIN)
                .andExpect(MockMvcResultMatchers.status().isNoContent)
        }

        test("another member who is not an Admin gets 403 on every endpoint and nothing changes") {
            val id = create(LISA, LISA, """{"name":"Lisa B.","iban":"$NL_IBAN"}""").idOf()

            call(get(LISA), TOM).andExpect(MockMvcResultMatchers.status().isForbidden)
            create(TOM, LISA, """{"name":"Mine now"}""").andExpect(MockMvcResultMatchers.status().isForbidden)
            call(put(LISA, id, """{"name":"Hijacked"}"""), TOM).andExpect(MockMvcResultMatchers.status().isForbidden)
            call(MockMvcRequestBuilders.delete("/api/members/$LISA/payment-aliases/$id"), TOM)
                .andExpect(MockMvcResultMatchers.status().isForbidden)

            call(get(LISA), LISA)
                .andExpect(MockMvcResultMatchers.jsonPath("$.aliases.length()").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.aliases[0].name").value("Lisa B."))
        }

        test("the 403 body carries no alias data") {
            create(LISA, LISA, """{"name":"Lisa B.","iban":"$NL_IBAN"}""")
            call(get(LISA), TOM)
                .andExpect(MockMvcResultMatchers.status().isForbidden)
                .andExpect(MockMvcResultMatchers.content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString(NL_IBAN))))
        }

        test("an Admin asking for a user who is not a member gets 404") {
            call(get("d1000000-0000-0000-0000-0000000000ff"), ADMIN).andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("an alias is reachable only through its owner: another owner's alias id is 404") {
            val id = create(LISA, LISA, """{"name":"Lisa B."}""").idOf()

            call(put(ADMIN, id, """{"name":"Other"}"""), ADMIN).andExpect(MockMvcResultMatchers.status().isNotFound)
            call(MockMvcRequestBuilders.delete("/api/members/$ADMIN/payment-aliases/$id"), ADMIN)
                .andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        test("a bad IBAN is 400 INVALID_IBAN and stores nothing") {
            create(LISA, LISA, """{"iban":"NL91ABNA0417164301"}""")
                .andExpect(MockMvcResultMatchers.status().isBadRequest)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("INVALID_IBAN"))
            call(get(LISA), LISA).andExpect(MockMvcResultMatchers.jsonPath("$.aliases.length()").value(0))
        }

        test("an alias with neither name nor IBAN, or a name over 100 characters, is 400") {
            create(LISA, LISA, """{}""").andExpect(MockMvcResultMatchers.status().isBadRequest)
            create(LISA, LISA, """{"name":"  ","iban":null}""").andExpect(MockMvcResultMatchers.status().isBadRequest)
            create(LISA, LISA, """{"name":"${"x".repeat(101)}"}""").andExpect(MockMvcResultMatchers.status().isBadRequest)
        }

        test("the same name, without regard to case, cannot be claimed twice in the team: 409") {
            create(LISA, LISA, """{"name":"Lisa B."}""").andExpect(MockMvcResultMatchers.status().isCreated)

            create(TOM, TOM, """{"name":"lisa b."}""")
                .andExpect(MockMvcResultMatchers.status().isConflict)
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("PAYMENT_ALIAS_TAKEN"))
        }

        test("a name is stored with its white space collapsed, so a differently spaced name is the same name: 409") {
            create(LISA, LISA, """{"name":"Lisa   de  Vries"}""")
                .andExpect(MockMvcResultMatchers.status().isCreated)
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Lisa de Vries"))

            create(TOM, TOM, """{"name":"lisa de vries"}""").andExpect(MockMvcResultMatchers.status().isConflict)
        }

        test("the same IBAN cannot be claimed twice in the team, however it is written: 409") {
            create(LISA, LISA, """{"iban":"$NL_IBAN"}""").andExpect(MockMvcResultMatchers.status().isCreated)

            create(TOM, TOM, """{"iban":"nl91abna0417164300"}""").andExpect(MockMvcResultMatchers.status().isConflict)
        }

        test("an update that takes another member's name or IBAN is 409, and keeping one's own is fine") {
            create(LISA, LISA, """{"name":"Lisa B.","iban":"$NL_IBAN"}""")
            val tom = create(TOM, TOM, """{"name":"Tom B.","iban":"$DE_IBAN"}""").idOf()

            call(put(TOM, tom, """{"name":"LISA B."}"""), TOM).andExpect(MockMvcResultMatchers.status().isConflict)
            call(put(TOM, tom, """{"iban":"$NL_IBAN"}"""), TOM).andExpect(MockMvcResultMatchers.status().isConflict)
            call(put(TOM, tom, """{"name":"Tom B.","iban":"$BE_IBAN"}"""), TOM).andExpect(MockMvcResultMatchers.status().isOk)
            call(put(TOM, tom, """{"name":"tom b.","iban":"$BE_IBAN"}"""), TOM).andExpect(MockMvcResultMatchers.status().isOk)
        }

        test("a member can hold several aliases") {
            create(LISA, LISA, """{"name":"Lisa B."}""").andExpect(MockMvcResultMatchers.status().isCreated)
            create(LISA, LISA, """{"name":"Partner van Lisa","iban":"$NL_IBAN"}""").andExpect(MockMvcResultMatchers.status().isCreated)

            call(get(LISA), LISA).andExpect(MockMvcResultMatchers.jsonPath("$.aliases.length()").value(2))
        }

        test("removing a member from the team deletes their aliases") {
            create(LISA, LISA, """{"name":"Lisa B.","iban":"$NL_IBAN"}""")

            call(MockMvcRequestBuilders.delete("/api/members/$LISA"), ADMIN).andExpect(MockMvcResultMatchers.status().isNoContent)

            jdbcTemplate.queryForObject("SELECT count(*) FROM $TEAM_SCHEMA.member_payment_aliases", Long::class.java) shouldBe 0L
        }

        test("without a session the endpoints answer 401") {
            mockMvc.perform(MockMvcRequestBuilders.get("/api/members/$LISA/payment-aliases"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized)
        }
    }

    private fun storedIban(id: String): String? =
        jdbcTemplate.queryForObject("SELECT iban FROM $TEAM_SCHEMA.member_payment_aliases WHERE id = ?::uuid", String::class.java, id)

    private fun get(owner: String) = MockMvcRequestBuilders.get("/api/members/$owner/payment-aliases")

    private fun put(owner: String, id: String, json: String) =
        MockMvcRequestBuilders.put("/api/members/$owner/payment-aliases/$id").contentType(MediaType.APPLICATION_JSON).content(json)

    private fun create(caller: String, owner: String, json: String) =
        call(
            MockMvcRequestBuilders.post("/api/members/$owner/payment-aliases").contentType(MediaType.APPLICATION_JSON).content(json),
            caller,
        )

    private fun call(builder: MockHttpServletRequestBuilder, userId: String): ResultActions =
        mockMvc.perform(builder.with(loginAs(userId)))
            .andExpect(MockMvcResultMatchers.request().asyncStarted())
            .andReturn()
            .let { mockMvc.perform(MockMvcRequestBuilders.asyncDispatch(it)) }

    private fun ResultActions.idOf(): String =
        Regex(""""id":"([^"]+)"""").find(andReturn().response.contentAsString)!!.groupValues[1]

    // The Testcontainers DB is shared and not rolled back between tests, so the team is rebuilt for each test.
    private fun seedTeam() {
        tenantSchemaAdapter.provisionPlatformSchema()
        tenantSchemaAdapter.provisionTenantSchema(TEAM_SCHEMA)
        jdbcTemplate.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$TEAM_ID'::uuid, 'Alias IT Team', 'alias-it-team', '$TEAM_SCHEMA') ON CONFLICT DO NOTHING",
        )
        jdbcTemplate.execute("DELETE FROM public.team_members WHERE team_id = '$TEAM_ID'::uuid")
        jdbcTemplate.execute("DELETE FROM $TEAM_SCHEMA.member_payment_aliases")
        listOf(ADMIN to "ADMIN", LISA to "USER", TOM to "USER").forEach { (id, role) ->
            jdbcTemplate.execute(
                "INSERT INTO public.users (id, email, display_name) VALUES ('$id'::uuid, '$id@alias-it.test', 'U $id') " +
                    "ON CONFLICT (id) DO NOTHING",
            )
            jdbcTemplate.execute("SELECT public.tb_add_member('$TEAM_ID'::uuid, '$id'::uuid, '$role', 'Setter')")
        }
    }
}
