package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.CalendarLinkLabel
import com.github.zzave.teambalance.api.domain.model.CalendarLinkOptions
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantContext
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SCHEMA
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.LEAVER
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Instant
import java.util.UUID

/**
 * The edit path at the port (ADR-0040): one call that loads the owned row, replaces its label and
 * options, and saves. Proven against a real schema because the failure it guards is a merge: a
 * save of a row deleted in the meantime would insert it again.
 */
class CalendarLinkUpdateIT : TeamBalanceIT() {

    @Autowired
    lateinit var calendarLinkRepository: CalendarLinkRepository

    @Autowired
    lateinit var calendarLinkTokens: CalendarLinkTokens

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("an edit replaces the label and options and keeps the token and dates") {
            val stored = savedLink()

            val updated = inTenant {
                calendarLinkRepository.updateOwned(stored.id, member(), CalendarLinkLabel("Renamed"), PARTNER)
            }

            updated?.label shouldBe CalendarLinkLabel("Renamed")
            updated?.options shouldBe PARTNER
            val reread = inTenant { calendarLinkRepository.findByUser(member()).single() }
            reread.options shouldBe PARTNER
            reread.tokenHash shouldBe stored.tokenHash
            reread.encryptedToken shouldBe stored.encryptedToken
        }

        test("an edit of a link deleted in the meantime returns null, and the link stays gone") {
            val stored = savedLink()
            inTenant { calendarLinkRepository.deleteOwned(stored.id, member()) } shouldBe true

            inTenant { calendarLinkRepository.updateOwned(stored.id, member(), null, PARTNER) }.shouldBeNull()

            inTenant { calendarLinkRepository.findByUser(member()) }.size shouldBe 0
        }

        test("an edit by another member returns null and leaves the link as it was") {
            val stored = savedLink()

            inTenant {
                calendarLinkRepository.updateOwned(stored.id, UserId(UUID.fromString(LEAVER)), null, PARTNER)
            }.shouldBeNull()

            inTenant { calendarLinkRepository.findByUser(member()).single() }.options shouldBe CalendarLinkOptions()
        }
    }

    private fun savedLink(): CalendarLink {
        val token = calendarLinkTokens.mint()
        val now = Instant.now()
        val link = CalendarLink(
            id = CalendarLinkId.random(),
            userId = member(),
            tokenHash = calendarLinkTokens.hash(token.value),
            encryptedToken = calendarLinkTokens.conceal(token),
            label = null,
            createdAt = now,
            expiresAt = now.plus(CalendarLink.TTL),
        )
        inTenant { calendarLinkRepository.saveWithinCap(link, CalendarLink.MAX_PER_MEMBER) } shouldBe true
        return link
    }

    private fun member() = UserId(UUID.fromString(ALPHA_MEMBER))

    private fun <T> inTenant(block: () -> T): T {
        TenantContext.set(ALPHA_SCHEMA)
        try {
            return block()
        } finally {
            TenantContext.clear()
        }
    }

    private companion object {
        val PARTNER = CalendarLinkOptions(
            attendanceStates = setOf(AttendanceState.ATTENDING),
            showAttendancePrefix = false,
        )
    }
}
