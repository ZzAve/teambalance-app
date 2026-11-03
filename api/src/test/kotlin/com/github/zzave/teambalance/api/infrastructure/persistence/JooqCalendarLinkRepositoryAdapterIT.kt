package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarLinkOptions
import com.github.zzave.teambalance.api.domain.model.EventTypeId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantContext
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.BETA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.MATCH_TYPE
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.TRAINING_TYPE
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

private val OWNER = UserId(UUID.fromString(ALPHA_MEMBER))

class JooqCalendarLinkRepositoryAdapterIT : TeamBalanceIT() {

    @Autowired
    lateinit var links: CalendarLinkRepository

    @Autowired
    lateinit var tokens: CalendarLinkTokens

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("a saved link reads back by member and by token hash with its states and types") {
            val link = link(
                CalendarLinkOptions(
                    attendanceStates = setOf(AttendanceState.ATTENDING, AttendanceState.MAYBE),
                    eventTypeIds = setOf(EventTypeId(UUID.fromString(MATCH_TYPE))),
                    showAttendancePrefix = false,
                ),
            )

            inAlpha { links.saveWithinCap(link, CalendarLink.MAX_PER_MEMBER) } shouldBe true

            inAlpha { links.findByUser(OWNER) } shouldBe listOf(link)
            inAlpha { links.findByTokenHash(link.tokenHash) } shouldBe link
        }

        test("updating replaces the child rows instead of adding to them") {
            val link = link(
                CalendarLinkOptions(
                    attendanceStates = setOf(AttendanceState.ATTENDING),
                    eventTypeIds = setOf(EventTypeId(UUID.fromString(MATCH_TYPE))),
                ),
            )
            inAlpha { links.saveWithinCap(link, CalendarLink.MAX_PER_MEMBER) }
            val replacement = CalendarLinkOptions(
                attendanceStates = setOf(AttendanceState.ABSENT, AttendanceState.NOT_RESPONDED),
                eventTypeIds = setOf(EventTypeId(UUID.fromString(TRAINING_TYPE))),
                calendarNameSuffix = null,
            )

            val updated = inAlpha { links.updateOwned(link.id, OWNER, null, replacement) }

            updated shouldBe link.copy(options = replacement)
            inAlpha { links.findByTokenHash(link.tokenHash) } shouldBe updated
            childRowCount("calendar_link_attendance_states", link.id) shouldBe 2
            childRowCount("calendar_link_event_types", link.id) shouldBe 1
        }

        test("updating to no event types clears the allowlist, which reads as every type") {
            val link = link(CalendarLinkOptions(eventTypeIds = setOf(EventTypeId(UUID.fromString(MATCH_TYPE)))))
            inAlpha { links.saveWithinCap(link, CalendarLink.MAX_PER_MEMBER) }

            inAlpha { links.updateOwned(link.id, OWNER, null, CalendarLinkOptions(eventTypeIds = null)) }

            inAlpha { links.findByTokenHash(link.tokenHash) }?.options?.eventTypeIds shouldBe null
            childRowCount("calendar_link_event_types", link.id) shouldBe 0
        }

        test("someone else's link is neither updated nor deleted") {
            val link = link(CalendarLinkOptions())
            inAlpha { links.saveWithinCap(link, CalendarLink.MAX_PER_MEMBER) }
            val stranger = UserId(UUID.fromString(CalendarLinkFixture.LEAVER))

            inAlpha { links.updateOwned(link.id, stranger, null, CalendarLinkOptions(showAttendancePrefix = false)) } shouldBe null
            inAlpha { links.deleteOwned(link.id, stranger) } shouldBe false

            inAlpha { links.findByTokenHash(link.tokenHash) } shouldBe link
        }

        test("deleting a link removes its child rows") {
            val link = link(CalendarLinkOptions(eventTypeIds = setOf(EventTypeId(UUID.fromString(MATCH_TYPE)))))
            inAlpha { links.saveWithinCap(link, CalendarLink.MAX_PER_MEMBER) }

            inAlpha { links.deleteOwned(link.id, OWNER) } shouldBe true

            childRowCount("calendar_link_attendance_states", link.id) shouldBe 0
            childRowCount("calendar_link_event_types", link.id) shouldBe 0
        }

        test("a link and its child rows are invisible under another tenant") {
            val link = link(CalendarLinkOptions(eventTypeIds = setOf(EventTypeId(UUID.fromString(MATCH_TYPE)))))
            inAlpha { links.saveWithinCap(link, CalendarLink.MAX_PER_MEMBER) }

            inTenant(BETA_SCHEMA) { links.findByTokenHash(link.tokenHash) } shouldBe null
            inTenant(BETA_SCHEMA) { links.findByUser(OWNER) } shouldBe emptyList()
            jdbcTemplate.queryForObject("SELECT count(*) FROM $BETA_SCHEMA.calendar_link_event_types", Long::class.java) shouldBe 0L
        }
    }

    private fun link(options: CalendarLinkOptions): CalendarLink {
        val token = tokens.mint()
        // Microsecond precision, because that is what the columns store.
        val now = Instant.now().truncatedTo(ChronoUnit.MICROS)
        return CalendarLink(
            id = CalendarLinkId.random(),
            userId = OWNER,
            tokenHash = tokens.hash(token.value),
            encryptedToken = tokens.conceal(token),
            label = null,
            createdAt = now,
            expiresAt = now.plus(CalendarLink.TTL),
            options = options,
        )
    }

    private fun childRowCount(table: String, id: CalendarLinkId): Long =
        jdbcTemplate.queryForObject("SELECT count(*) FROM $ALPHA_SCHEMA.$table WHERE link_id = ?::uuid", Long::class.java, id.toString())!!

    private fun <T> inAlpha(block: () -> T): T = inTenant(ALPHA_SCHEMA, block)

    private fun <T> inTenant(schema: String, block: () -> T): T {
        TenantContext.set(schema)
        try {
            return block()
        } finally {
            TenantContext.clear()
        }
    }
}
