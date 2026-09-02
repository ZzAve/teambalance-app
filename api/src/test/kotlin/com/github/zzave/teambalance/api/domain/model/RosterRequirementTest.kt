package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

private fun positionId() = PositionId(UUID.randomUUID())

/**
 * The roster requirement's own rules — the ones that must hold however the value arrives (an admin
 * form, a JPA row, a test fixture), which is why they live on the value object rather than in a
 * request validator that only the HTTP path would run through.
 */
class RosterRequirementTest : FunSpec() {
    init {
        test("tracking off with no targets is the default, and is a legitimate value") {
            RosterRequirement.OFF.trackRoster shouldBe false
            RosterRequirement.OFF.totalTarget shouldBe null
            RosterRequirement.OFF.positionTargets shouldBe emptyList()
        }

        // The whole reason trackRoster is a flag and not "are there any targets": these two are
        // different states, and the client renders them differently (a tally panel vs. no panel).
        test("tracking on with no targets is distinct from tracking off") {
            val tally = RosterRequirement(trackRoster = true)
            val off = RosterRequirement(trackRoster = false)

            tally.positionTargets shouldBe off.positionTargets
            tally.totalTarget shouldBe off.totalTarget
            (tally == off) shouldBe false
        }

        // Targets survive the toggle so an admin who switches tracking off and on again gets their
        // lineup back rather than an empty form.
        test("targets are kept while tracking is off") {
            val setter = positionId()
            val requirement = RosterRequirement(
                trackRoster = false,
                totalTarget = HeadcountTarget(12),
                positionTargets = listOf(PositionTarget(setter, PositionSlots(2))),
            )

            requirement.targetFor(setter) shouldBe PositionSlots(2)
            requirement.totalTarget shouldBe HeadcountTarget(12)
        }

        test("the two axes are independent - either may be set without the other") {
            RosterRequirement(trackRoster = true, totalTarget = HeadcountTarget(12)).positionTargets shouldBe emptyList()
            RosterRequirement(
                trackRoster = true,
                positionTargets = listOf(PositionTarget(positionId(), PositionSlots(2))),
            ).totalTarget shouldBe null
        }

        test("targetFor answers null for a position the roster does not target") {
            val requirement = RosterRequirement(
                trackRoster = true,
                positionTargets = listOf(PositionTarget(positionId(), PositionSlots(2))),
            )

            requirement.targetFor(positionId()) shouldBe null
        }

        test("withoutPosition drops only that position's target - how a deleted position leaves") {
            val setter = positionId()
            val libero = positionId()
            val requirement = RosterRequirement(
                trackRoster = true,
                totalTarget = HeadcountTarget(12),
                positionTargets = listOf(PositionTarget(setter, PositionSlots(2)), PositionTarget(libero, PositionSlots(1))),
            )

            val after = requirement.withoutPosition(setter)

            after.targetFor(setter) shouldBe null
            after.targetFor(libero) shouldBe PositionSlots(1)
            after.totalTarget shouldBe HeadcountTarget(12)
        }

        test("withoutPosition of an untargeted position changes nothing") {
            val requirement = RosterRequirement(
                trackRoster = true,
                positionTargets = listOf(PositionTarget(positionId(), PositionSlots(2))),
            )

            requirement.withoutPosition(positionId()) shouldBe requirement
        }

        // A target of zero is the *absence* of a target, not a target of nothing — storing one would
        // put a row on the panel that is permanently, meaninglessly "covered". The absence is modelled
        // by having no PositionTarget at all, so the count itself starts at one.
        test("a position's slot count must be at least one") {
            shouldThrow<IllegalArgumentException> { PositionSlots(0) }
            shouldThrow<IllegalArgumentException> { PositionSlots(-1) }
        }

        test("a position's slot count is capped, so a fat-fingered number is rejected not drawn") {
            PositionSlots(PositionSlots.MAX).value shouldBe PositionSlots.MAX
            shouldThrow<IllegalArgumentException> { PositionSlots(PositionSlots.MAX + 1) }
        }

        test("a headcount target must be at least one and is capped") {
            HeadcountTarget(1).value shouldBe 1
            HeadcountTarget(HeadcountTarget.MAX).value shouldBe HeadcountTarget.MAX
            shouldThrow<IllegalArgumentException> { HeadcountTarget(0) }
            shouldThrow<IllegalArgumentException> { HeadcountTarget(-3) }
            shouldThrow<IllegalArgumentException> { HeadcountTarget(HeadcountTarget.MAX + 1) }
        }

        // Two targets for one position would make targetFor's answer depend on list order, and the
        // storage (a map keyed by position) cannot represent it anyway.
        test("a position may be targeted at most once") {
            val setter = positionId()

            shouldThrow<IllegalArgumentException> {
                RosterRequirement(
                    trackRoster = true,
                    positionTargets = listOf(PositionTarget(setter, PositionSlots(2)), PositionTarget(setter, PositionSlots(3))),
                )
            }
        }

        test("the number of targeted positions is capped") {
            val tooMany = (0..RosterRequirement.MAX_POSITION_TARGETS).map { PositionTarget(positionId(), PositionSlots(1)) }

            shouldThrow<IllegalArgumentException> { RosterRequirement(trackRoster = true, positionTargets = tooMany) }
        }
    }
}
