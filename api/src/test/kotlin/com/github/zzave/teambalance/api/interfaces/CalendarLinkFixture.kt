package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.domain.model.CalendarToken
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import org.springframework.jdbc.core.JdbcTemplate
import java.sql.Timestamp
import java.time.Instant
import java.util.UUID

/**
 * The teams, members and events the calendar-link specs run against (ADR-0032).
 *
 * Shared between them because they need the *same* two-team shape — a token minted in one team must
 * be a miss under the other's slug, which needs two real tenant schemas and two sole-membership
 * users — and because the one Testcontainers database is shared with no truncation between specs, so
 * a second set of ids would be a second thing to keep from colliding. Ids are namespaced `c832…` /
 * `b832…` after this feature's ADR for exactly that reason.
 */
object CalendarLinkFixture {
    const val ALPHA_TEAM = "c8320000-0000-0000-0000-000000000001"
    const val BETA_TEAM = "c8320000-0000-0000-0000-000000000002"
    const val ALPHA_SCHEMA = "team_cal_alpha"
    const val BETA_SCHEMA = "team_cal_beta"
    const val ALPHA_SLUG = "cal-alpha"
    const val BETA_SLUG = "cal-beta"
    const val ALPHA_NAME = "Calendar Alpha"

    /** Sole member of Alpha, so the X-User-Id shim resolves their Active Team without a session. */
    const val ALPHA_MEMBER = "b8320000-0000-0000-0000-000000000001"
    const val BETA_MEMBER = "b8320000-0000-0000-0000-000000000002"

    /** Also an Alpha member; specs deactivate them to prove a departure stops the feed. */
    const val LEAVER = "b8320000-0000-0000-0000-000000000003"

    const val TRAINING = "Tuesday training"
    const val TRAINING_START = "2099-01-06T18:30:00Z"

    /** Fixed, so a spec can assert on the VEVENT's UID without reading it back first. */
    const val TRAINING_ID = "c8320000-0000-0000-0000-0000000000e1"

    fun seed(jdbc: JdbcTemplate, schemas: TenantSchemaAdapter) {
        schemas.provisionPlatformSchema()
        schemas.provisionTenantSchema(ALPHA_SCHEMA)
        schemas.provisionTenantSchema(BETA_SCHEMA)
        team(jdbc, ALPHA_TEAM, ALPHA_NAME, ALPHA_SLUG, ALPHA_SCHEMA)
        team(jdbc, BETA_TEAM, "Calendar Beta", BETA_SLUG, BETA_SCHEMA)
        user(jdbc, ALPHA_MEMBER, "cal-alpha-member@test.com", "Alpha Member")
        user(jdbc, BETA_MEMBER, "cal-beta-member@test.com", "Beta Member")
        user(jdbc, LEAVER, "cal-leaver@test.com", "Cal Leaver")
        member(jdbc, ALPHA_TEAM, ALPHA_MEMBER)
        member(jdbc, ALPHA_TEAM, LEAVER)
        member(jdbc, BETA_TEAM, BETA_MEMBER)
        // Every spec starts from no links, since the cap counts rows and the database is shared.
        jdbc.execute("DELETE FROM $ALPHA_SCHEMA.calendar_links")
        jdbc.execute("DELETE FROM $BETA_SCHEMA.calendar_links")
        seedTraining(jdbc)
    }

    /** One far-future training in Alpha, so the feed always has exactly one event to assert on. */
    private fun seedTraining(jdbc: JdbcTemplate) {
        jdbc.execute("DELETE FROM $ALPHA_SCHEMA.attendances")
        jdbc.execute("DELETE FROM $ALPHA_SCHEMA.events")
        jdbc.update(
            """
            INSERT INTO $ALPHA_SCHEMA.events
                (uuid, event_type_id, title, description, start_time, end_time, location, created_by)
            SELECT ?::uuid, et.id, ?, 'Bring a ball, and shoes', ?, ?, 'Galgenwaard; hall 1', ?::uuid
            FROM   $ALPHA_SCHEMA.event_types et WHERE et.name = 'Training'
            """,
            TRAINING_ID, TRAINING,
            Timestamp.from(Instant.parse(TRAINING_START)),
            Timestamp.from(Instant.parse("2099-01-06T20:00:00Z")),
            ALPHA_MEMBER,
        )
    }


    fun answer(jdbc: JdbcTemplate, userId: String, state: String) {
        jdbc.update(
            """
            INSERT INTO $ALPHA_SCHEMA.attendances (event_id, user_id, state, changed_by)
            SELECT e.id, ?::uuid, ?, ?::uuid FROM $ALPHA_SCHEMA.events e WHERE e.uuid = ?::uuid
            ON CONFLICT (event_id, user_id) DO UPDATE SET state = EXCLUDED.state
            """,
            userId, state, userId, TRAINING_ID,
        )
    }

    /** A stored link, minted straight into the schema so a spec can choose its expiry. */
    fun link(
        jdbc: JdbcTemplate,
        tokens: CalendarLinkTokens,
        schema: String,
        userId: String,
        expiresAt: Instant,
        label: String? = null,
    ): CalendarToken {
        val token = tokens.mint()
        jdbc.update(
            """
            INSERT INTO $schema.calendar_links
                (id, user_id, token_hash, token_encrypted, label, created_at, expires_at)
            VALUES (?::uuid, ?::uuid, ?, ?, ?, ?, ?)
            """,
            UUID.randomUUID(), userId, tokens.hash(token.value).value, tokens.conceal(token).value,
            label, Timestamp.from(Instant.now()), Timestamp.from(expiresAt),
        )
        return token
    }

    private fun team(jdbc: JdbcTemplate, id: String, name: String, slug: String, schema: String) {
        jdbc.execute(
            "INSERT INTO public.teams (id, name, slug, schema_name) " +
                "VALUES ('$id'::uuid, '$name', '$slug', '$schema') ON CONFLICT DO NOTHING",
        )
    }

    private fun user(jdbc: JdbcTemplate, id: String, email: String, name: String) {
        jdbc.execute(
            "INSERT INTO public.users (id, email, display_name) VALUES ('$id'::uuid, '$email', '$name') " +
                "ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name",
        )
    }

    /** Re-activates too: a spec that proves a departure stops the feed must not strand the next one. */
    private fun member(jdbc: JdbcTemplate, teamId: String, userId: String) {
        jdbc.execute("SELECT public.tb_add_member('$teamId'::uuid, '$userId'::uuid, 'USER', NULL)")
        jdbc.execute(
            "UPDATE public.team_members SET active = true " +
                "WHERE team_id = '$teamId'::uuid AND user_id = '$userId'::uuid",
        )
    }
}
