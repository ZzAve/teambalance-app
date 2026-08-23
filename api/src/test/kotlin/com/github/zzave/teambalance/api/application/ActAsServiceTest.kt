package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotPlatformAdminException
import com.github.zzave.teambalance.api.domain.exception.TeamNotFoundException
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeInstanceOf
import io.kotest.core.spec.style.FunSpec
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

/** A clock the test moves by hand, so the 60-minute box is exercised rather than waited out. */
private class MovableClock(var now: Instant) : Clock() {
    override fun instant(): Instant = now
    override fun getZone() = ZoneOffset.UTC
    override fun withZone(zone: java.time.ZoneId): Clock = this
    fun advance(by: Duration) {
        now = now.plus(by)
    }
}

class ActAsServiceTest : FunSpec() {
    init {
        val operator = UserId.random()
        val outsider = UserId.random()
        val start = Instant.parse("2026-08-23T10:00:00Z")

        data class Fixture(
            val directory: TeamDirectory,
            val episodes: InMemoryActAsRepository,
            val routing: RecordingTenantRoutingGateway,
            val clock: MovableClock,
            val service: ActAsService,
        )

        fun fixture(): Fixture {
            val directory = TeamDirectory()
            val episodes = InMemoryActAsRepository()
            val routing = RecordingTenantRoutingGateway()
            val clock = MovableClock(start)
            return Fixture(
                directory,
                episodes,
                routing,
                clock,
                directory.actAsService(routing, episodes, clock, setOf(operator)),
            )
        }

        context("entering a Team") {
            test("a Platform Admin enters a Team they are a Member of nothing in") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")

                val entered = f.service.enter(operator, dames5)

                entered.team.name.value shouldBe "Dames 5"
                entered.actAs.teamId shouldBe dames5
                entered.actAs.userId shouldBe operator
                entered.actAs.expiresAt shouldBe start.plus(ActAs.ACT_AS_TTL)
            }

            // The whole security story, invariant 2: the roster, the attendance denominator, the
            // Position breakdown and the Hall of Shame never see a Virtual Member (ADR-0024 §2).
            test("entering writes NO membership") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")

                f.service.enter(operator, dames5)

                f.directory.membershipsOf(operator).shouldBeEmpty()
            }

            test("the tenant is pinned through the same gateway an ordinary switch uses") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")

                f.service.enter(operator, dames5)

                // Clear before pin, so entering can never inherit a previous caller's tenant.
                f.routing.writes shouldContainExactly listOf(null, f.directory.tenantRoutingOf(dames5))
            }

            test("a caller who is not on the platform-admin allowlist cannot enter") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")

                shouldThrow<NotPlatformAdminException> { f.service.enter(outsider, dames5) }

                f.episodes.all().shouldBeEmpty()
                f.routing.writes.shouldBeEmpty()
            }

            test("a Team that does not exist is a 404, and opens nothing") {
                val f = fixture()

                shouldThrow<TeamNotFoundException> { f.service.enter(operator, TeamId(UUID.randomUUID())) }

                f.episodes.all().shouldBeEmpty()
            }

            test("entering a second Team closes the first — one open grant, so the banner can't lie") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                val heren3 = f.directory.addTeam("Heren 3", "heren-3")

                val first = f.service.enter(operator, dames5)
                f.clock.advance(Duration.ofMinutes(5))
                val second = f.service.enter(operator, heren3)

                f.episodes.findOpenFor(operator)?.id shouldBe second.actAs.id
                f.episodes.all().single { it.id == first.actAs.id }.exitedAt shouldBe f.clock.now
            }
        }

        context("carrying the grant from request to request") {
            test("an entered grant resolves Active, with the routing its work lands in") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                f.service.enter(operator, dames5)

                val resolved = f.service.resolve(operator).shouldBeInstanceOf<ActAsResolution.Active>()

                resolved.actAs.teamId shouldBe dames5
                resolved.routing shouldBe f.directory.tenantRoutingOf(dames5)
            }

            test("a caller who never entered resolves None — act-as is not a property you carry") {
                val f = fixture()
                f.directory.addTeam("Dames 5", "dames-5")

                f.service.resolve(operator) shouldBe ActAsResolution.None
            }

            test("activity slides the box; the grant survives work, not idleness") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                f.service.enter(operator, dames5)

                f.clock.advance(Duration.ofMinutes(59))
                f.service.resolve(operator).shouldBeInstanceOf<ActAsResolution.Active>()
                f.clock.advance(Duration.ofMinutes(59))

                f.service.resolve(operator).shouldBeInstanceOf<ActAsResolution.Active>()
                f.episodes.findOpenFor(operator)?.expiresAt shouldBe f.clock.now.plus(ActAs.ACT_AS_TTL)
            }

            // The trap: the session's memoized tenant routing is never re-verified, so expiry has to
            // be the grant's own and has to be checked here, on every request (ADR-0024 §4).
            test("sixty idle minutes lapse the grant, and a lapse resolves to NO tenant") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                f.service.enter(operator, dames5)

                f.clock.advance(ActAs.ACT_AS_TTL.plusSeconds(1))

                f.service.resolve(operator).shouldBeInstanceOf<ActAsResolution.Lapsed>()
            }

            test("a lapse keeps saying Lapsed — every request in between, not just the first") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                f.service.enter(operator, dames5)
                f.clock.advance(ActAs.ACT_AS_TTL.plusSeconds(1))

                f.service.resolve(operator).shouldBeInstanceOf<ActAsResolution.Lapsed>()
                f.service.resolve(operator).shouldBeInstanceOf<ActAsResolution.Lapsed>()
            }

            test("a lapsed grant is never slid back to life") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                val entered = f.service.enter(operator, dames5)
                f.clock.advance(ActAs.ACT_AS_TTL.plusSeconds(1))

                f.service.resolve(operator)

                f.episodes.findOpenFor(operator)?.expiresAt shouldBe entered.actAs.expiresAt
            }
        }

        context("leaving") {
            test("exit closes the episode and drops the tenant") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                f.service.enter(operator, dames5)
                f.clock.advance(Duration.ofMinutes(10))

                f.service.exit(operator)

                f.episodes.findOpenFor(operator).shouldBeNull()
                f.episodes.all().single().exitedAt shouldBe f.clock.now
                f.routing.pinned.shouldBeNull()
                f.service.resolve(operator) shouldBe ActAsResolution.None
            }

            // A lapsed operator must be able to tidy up; refusing would strand them mid-lapse.
            test("exiting after a lapse closes the episode rather than refusing") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                f.service.enter(operator, dames5)
                f.clock.advance(ActAs.ACT_AS_TTL.plusSeconds(1))

                f.service.exit(operator)

                f.service.resolve(operator) shouldBe ActAsResolution.None
            }

            // The record has to say what happened, not when the operator got round to admitting it:
            // an episode that lapsed at lunchtime did not run until the evening.
            test("closing a lapsed episode ends it at its last activity, not at the moment of closing") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                f.service.enter(operator, dames5)
                f.clock.advance(Duration.ofMinutes(20))
                f.service.resolve(operator)
                val lastActive = f.clock.now
                f.clock.advance(Duration.ofHours(6))

                f.service.exit(operator)

                f.episodes.all().single().exitedAt shouldBe lastActive
            }

            test("exiting without having entered is a no-op, not an error") {
                val f = fixture()

                f.service.exit(operator)

                f.episodes.all().shouldBeEmpty()
            }
        }

        context("the console") {
            test("lists every Team, not only the ones anybody is a Member of") {
                val f = fixture()
                f.directory.addTeam("Heren 3", "heren-3")
                f.directory.addTeam("Dames 5", "dames-5")

                f.service.teamsToEnter(operator).map { it.name.value } shouldContainExactly
                    listOf("Dames 5", "Heren 3")
            }

            test("is closed to anyone off the allowlist") {
                val f = fixture()

                shouldThrow<NotPlatformAdminException> { f.service.teamsToEnter(outsider) }
            }
        }

        context("the Act-as Record") {
            test("keeps the real user id underneath while rendering the actor generically") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                f.service.enter(operator, dames5)

                val record = f.service.recordsFor(dames5).single()

                record.userId shouldBe operator
                record.actorKind.name shouldBe "PLATFORM_ADMIN"
            }

            test("is scoped to its Team — another Team's episodes are not its business") {
                val f = fixture()
                val dames5 = f.directory.addTeam("Dames 5", "dames-5")
                val heren3 = f.directory.addTeam("Heren 3", "heren-3")
                f.service.enter(operator, dames5)

                f.service.recordsFor(heren3).shouldBeEmpty()
                f.service.recordsFor(dames5).shouldNotBeNull()
            }
        }
    }
}
