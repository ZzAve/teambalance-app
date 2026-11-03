package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.domain.exception.EventNotFoundException
import com.github.zzave.teambalance.api.domain.model.Attendance
import com.github.zzave.teambalance.api.domain.model.AttendanceId
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.EventId
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.TenantScopeGateway
import com.github.zzave.teambalance.api.infrastructure.multitenancy.TenantSchemaAdapter
import com.github.zzave.teambalance.api.interfaces.CalendarLinkFixture
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.shouldBe
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

private val ROUTING = TenantRouting(
    TeamId(UUID.fromString(CalendarLinkFixture.ALPHA_TEAM)),
    SchemaName(CalendarLinkFixture.ALPHA_SCHEMA),
)
private val TRAINING = EventId(UUID.fromString(CalendarLinkFixture.TRAINING_ID))
private val MEMBER = UserId(UUID.fromString(CalendarLinkFixture.ALPHA_MEMBER))

/** Event references are resolved to `events.id` inside the SQL; these specs cover what the controller ITs do not reach. */
class JooqAttendanceRepositoryAdapterIT : TeamBalanceIT() {

    @Autowired
    lateinit var attendances: AttendanceRepository

    @Autowired
    lateinit var tenants: TenantScopeGateway

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var tenantSchemaAdapter: TenantSchemaAdapter

    init {
        beforeTest { CalendarLinkFixture.seed(jdbcTemplate, tenantSchemaAdapter) }

        test("saving the same attendance again updates the response in place") {
            val first = attendance(TRAINING, AttendanceState.ATTENDING)
            tenants.within(ROUTING) { attendances.save(first) }

            val changed = first.copy(state = AttendanceState.ABSENT, updatedAt = first.updatedAt.plusSeconds(60))
            tenants.within(ROUTING) { attendances.save(changed) }

            tenants.within(ROUTING) { attendances.findByEventId(TRAINING) } shouldBe listOf(changed)
        }

        test("concurrent first responses for the same event and member leave one row and no failure") {
            val writers = 20
            val ready = CountDownLatch(writers)
            val go = CountDownLatch(1)
            val pool = Executors.newFixedThreadPool(writers)
            val results = (1..writers).map {
                pool.submit<Attendance> {
                    ready.countDown()
                    go.await()
                    tenants.within(ROUTING) { attendances.save(attendance(TRAINING, AttendanceState.ATTENDING)) }
                }
            }
            ready.await()
            go.countDown()
            val saved = results.map { it.get(30, TimeUnit.SECONDS) }
            pool.shutdown()

            val stored = tenants.within(ROUTING) { attendances.findByEventId(TRAINING) }
            stored.size shouldBe 1
            saved.forEach { it.id shouldBe stored.single().id }
        }

        test("saving for an unknown event fails and writes nothing") {
            val unknown = EventId.random()

            shouldThrow<EventNotFoundException> {
                tenants.within(ROUTING) { attendances.save(attendance(unknown, AttendanceState.MAYBE)) }
            }
        }

        test("a bulk save naming an unknown event rolls back the rows before it") {
            val valid = attendance(TRAINING, AttendanceState.ATTENDING)

            shouldThrow<EventNotFoundException> {
                tenants.within(ROUTING) {
                    attendances.saveAll(listOf(valid, attendance(EventId.random(), AttendanceState.ATTENDING)))
                }
            }

            tenants.within(ROUTING) { attendances.findByEventId(TRAINING) } shouldBe emptyList()
        }

        test("deleting returns only the events whose rows existed") {
            val otherEvent = EventId.random()
            CalendarLinkFixture.extraEvent(
                jdbcTemplate, Instant.parse("2099-02-01T18:00:00Z"), id = otherEvent.value.toString(),
            )
            tenants.within(ROUTING) { attendances.save(attendance(TRAINING, AttendanceState.ATTENDING)) }

            val deleted = tenants.within(ROUTING) {
                attendances.deleteByUserIdAndEventIds(MEMBER, listOf(TRAINING, otherEvent, EventId.random()))
            }

            deleted shouldContainExactlyInAnyOrder listOf(TRAINING)
            tenants.within(ROUTING) { attendances.findByEventId(TRAINING) } shouldBe emptyList()
        }
    }

    private fun attendance(eventId: EventId, state: AttendanceState) = Attendance(
        id = AttendanceId.random(),
        eventId = eventId,
        userId = MEMBER,
        state = state,
        updatedAt = Instant.now().truncatedTo(ChronoUnit.MICROS),
        changedBy = MEMBER,
    )
}
