package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.domain.model.CalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantContext
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_MEMBER
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture.ALPHA_SCHEMA
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Instant
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.atomic.AtomicInteger

private const val CONTENDERS = 8

/**
 * The three-link cap, against real concurrency — the only place it can be proven.
 *
 * `CalendarLinkService` used to count and then save. At READ COMMITTED two near-simultaneous creates
 * from one member both read the same count and both proceeded, so a double-click could leave four
 * year-long credentials where the cap allows three. The invariant now travels with the write
 * (`saveWithinCap`), held by a transaction-scoped advisory lock keyed on the member — and this is the
 * spec that says the lock is load-bearing: remove it and the assertions below go above three.
 *
 * Deliberately at the port rather than through MockMvc: one port call is the unit of atomicity, so
 * that is the seam worth hammering, and it keeps the race out of the servlet stack.
 */
class CalendarLinkCapIT : TeamBalanceIT() {

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

        test("eight simultaneous creates for one member leave exactly three links") {
            val accepted = raceToCreate(CONTENDERS)

            accepted shouldBe CalendarLink.MAX_PER_MEMBER
            storedCount() shouldBe CalendarLink.MAX_PER_MEMBER.toLong()
        }

        // The refusal is not a one-off: once the cap is reached it stays reached, however the attempts
        // arrive. A member who deletes one gets exactly one slot back.
        test("the cap holds across a second race, and a delete frees exactly one slot") {
            raceToCreate(CONTENDERS) shouldBe CalendarLink.MAX_PER_MEMBER
            raceToCreate(CONTENDERS) shouldBe 0

            val victim = inTenant { calendarLinkRepository.findByUser(member()).first().id }
            inTenant { calendarLinkRepository.deleteOwned(victim, member()) } shouldBe true

            raceToCreate(CONTENDERS) shouldBe 1
            storedCount() shouldBe CalendarLink.MAX_PER_MEMBER.toLong()
        }
    }

    // --- helpers ---------------------------------------------------------------------------------

    /**
     * Fires [contenders] creates at once and returns how many were accepted.
     *
     * Raw threads started after the tenant is bound, not a pool: `TenantContext` is an
     * `InheritableThreadLocal`, so a thread inherits the schema at *creation*, and a pooled thread may
     * predate it. The latch is what makes the attempts actually overlap rather than queue.
     */
    private fun raceToCreate(contenders: Int): Int {
        val accepted = AtomicInteger()
        val start = CountDownLatch(1)
        TenantContext.set(ALPHA_SCHEMA)
        val threads = try {
            (1..contenders).map {
                Thread {
                    start.await()
                    if (calendarLinkRepository.saveWithinCap(freshLink(), CalendarLink.MAX_PER_MEMBER)) {
                        accepted.incrementAndGet()
                    }
                }.apply { start() }
            }
        } finally {
            TenantContext.clear()
        }
        start.countDown()
        threads.forEach { it.join() }
        return accepted.get()
    }

    private fun freshLink(): CalendarLink {
        val token = calendarLinkTokens.mint()
        val now = Instant.now()
        return CalendarLink(
            id = CalendarLinkId.random(),
            userId = member(),
            tokenHash = calendarLinkTokens.hash(token.value),
            encryptedToken = calendarLinkTokens.conceal(token),
            label = null,
            createdAt = now,
            expiresAt = now.plus(CalendarLink.TTL),
        )
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

    private fun storedCount(): Long =
        jdbcTemplate.queryForObject(
            "SELECT count(*) FROM $ALPHA_SCHEMA.calendar_links WHERE user_id = ?::uuid",
            Long::class.java,
            ALPHA_MEMBER,
        )!!
}
