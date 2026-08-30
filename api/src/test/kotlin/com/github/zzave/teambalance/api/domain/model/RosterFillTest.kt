package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

private fun position(label: String) = Position(PositionId(UUID.randomUUID()), PositionLabel(label))

/**
 * The roster fill arithmetic — the single tested place where targets plus attendance become a
 * status. The client maps these numbers to chip text, colour and pips and counts nothing itself, so
 * every rule the panel depends on is pinned here rather than in a component.
 */
class RosterFillTest : FunSpec() {
    init {
        val setter = position("Setter")
        val libero = position("Libero")
        val middle = position("Middle")
        val all = listOf(setter, libero, middle)

        fun fill(
            requirement: RosterRequirement,
            attending: Map<PositionId?, Int> = emptyMap(),
            positions: List<Position> = all,
        ) = RosterFill.of(requirement, attending, positions)

        fun targets(vararg pairs: Pair<Position, Int>) =
            pairs.map { (p, n) -> PositionTarget(p.id, PositionSlots(n)) }

        // ── trackRoster off ───────────────────────────────────────────────────

        // A social. Not a roster event, so there is nothing to render — not even an empty panel.
        test("tracking off yields no rows and no status, whoever is attending") {
            val result = fill(RosterRequirement.OFF, mapOf(setter.id to 3, null to 1))

            result.state shouldBe RosterState.OFF
            result.trackRoster shouldBe false
            result.positions shouldBe emptyList()
            result.openSlots.value shouldBe 0
        }

        // Even off, the headcount is still the truth about who is coming — the card's attendance row
        // shows it regardless, and the panel is what's suppressed.
        test("tracking off still reports the attending totals") {
            val result = fill(RosterRequirement.OFF, mapOf(setter.id to 3, null to 1))

            result.totalAttending.value shouldBe 4
            result.unassignedAttending.value shouldBe 1
        }

        // ── tally only ────────────────────────────────────────────────────────

        // The state trackRoster exists to express: tracking on, nothing required. A training that
        // wants to see who is coming per position without anything to fall short of.
        test("tracking on with no targets is a tally: rows for attendees, no status number") {
            val result = fill(RosterRequirement(trackRoster = true), mapOf(setter.id to 2, libero.id to 1))

            result.state shouldBe RosterState.TALLY_ONLY
            result.openSlots.value shouldBe 0
            result.positions.map { it.position.label.value } shouldBe listOf("Setter", "Libero")
            result.positions.map { it.required } shouldBe listOf(null, null)
            result.positions.map { it.attending.value } shouldBe listOf(2, 1)
        }

        test("a tally with nobody attending has no rows at all") {
            val result = fill(RosterRequirement(trackRoster = true))

            result.state shouldBe RosterState.TALLY_ONLY
            result.positions shouldBe emptyList()
        }

        // ── headcount only ────────────────────────────────────────────────────

        test("a lone total target short of its mark is HEADCOUNT_SHORT, openSlots the shortfall") {
            val result = fill(
                RosterRequirement(trackRoster = true, totalTarget = HeadcountTarget(8)),
                mapOf(setter.id to 4, null to 2),
            )

            result.state shouldBe RosterState.HEADCOUNT_SHORT
            result.openSlots.value shouldBe 2
            result.totalAttending.value shouldBe 6
        }

        test("a lone total target exactly met is HEADCOUNT_FULL") {
            val result = fill(RosterRequirement(trackRoster = true, totalTarget = HeadcountTarget(6)), mapOf(setter.id to 6))

            result.state shouldBe RosterState.HEADCOUNT_FULL
            result.openSlots.value shouldBe 0
        }

        // Over-filled reads as full, never as a negative shortfall.
        test("a lone total target exceeded is HEADCOUNT_FULL with no negative openSlots") {
            val result = fill(RosterRequirement(trackRoster = true, totalTarget = HeadcountTarget(6)), mapOf(setter.id to 9))

            result.state shouldBe RosterState.HEADCOUNT_FULL
            result.openSlots.value shouldBe 0
        }

        test("unassigned attendees count toward the headcount") {
            val result = fill(RosterRequirement(trackRoster = true, totalTarget = HeadcountTarget(4)), mapOf(null to 4))

            result.state shouldBe RosterState.HEADCOUNT_FULL
            result.unassignedAttending.value shouldBe 4
        }

        // ── per-position ──────────────────────────────────────────────────────

        test("every targeted position covered is LINEUP_SET") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 2, libero to 1)),
                mapOf(setter.id to 2, libero.id to 1),
            )

            result.state shouldBe RosterState.LINEUP_SET
            result.openSlots.value shouldBe 0
        }

        test("a short but non-empty position is SPOTS_OPEN, openSlots summing every gap") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 3, libero to 2)),
                mapOf(setter.id to 1, libero.id to 1),
            )

            result.state shouldBe RosterState.SPOTS_OPEN
            result.openSlots.value shouldBe 3
        }

        // The red case: somebody has to be chased, and it is not the same as "generally short".
        test("a targeted position with nobody at all is CRITICAL") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 2, libero to 1)),
                mapOf(setter.id to 2),
            )

            result.state shouldBe RosterState.CRITICAL
            result.openSlots.value shouldBe 1
            result.positions.single { it.position == libero }.isEmptyAndRequired shouldBe true
        }

        test("nobody attending at all, with targets set, is CRITICAL") {
            val result = fill(RosterRequirement(trackRoster = true, positionTargets = targets(setter to 2)))

            result.state shouldBe RosterState.CRITICAL
            result.openSlots.value shouldBe 2
            result.totalAttending.value shouldBe 0
        }

        // Surplus is per-position and must never quietly pay for a gap somewhere else: five setters
        // do not cover the missing libero.
        test("over-fill at one position never masks a gap at another") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 2, libero to 2)),
                mapOf(setter.id to 5, libero.id to 1),
            )

            result.state shouldBe RosterState.SPOTS_OPEN
            result.openSlots.value shouldBe 1
            result.positions.single { it.position == setter }.openSlots.value shouldBe 0
        }

        test("an over-filled position reports its surplus as attending beyond required") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 2)),
                mapOf(setter.id to 5),
            )

            result.positions.single().surplus shouldBe 3
            result.state shouldBe RosterState.LINEUP_SET
        }

        // ── layering: positions beat the total ────────────────────────────────

        // The locked rule: position targets drive the chip. A met headcount must not make a missing
        // setter read as "all good".
        test("a met total target does not rescue a short lineup") {
            val result = fill(
                RosterRequirement(
                    trackRoster = true,
                    totalTarget = HeadcountTarget(6),
                    positionTargets = targets(setter to 2, libero to 1),
                ),
                mapOf(setter.id to 2, middle.id to 8),
            )

            result.state shouldBe RosterState.CRITICAL
            result.totalAttending.value shouldBe 10
            // The total is still reported, as the panel's secondary "X/Y going" line.
            result.totalTarget shouldBe HeadcountTarget(6)
            // …and openSlots stays the lineup's gap, not the (already satisfied) headcount's.
            result.openSlots.value shouldBe 1
        }

        test("an unmet total target does not spoil a complete lineup") {
            val result = fill(
                RosterRequirement(
                    trackRoster = true,
                    totalTarget = HeadcountTarget(12),
                    positionTargets = targets(setter to 1),
                ),
                mapOf(setter.id to 1),
            )

            result.state shouldBe RosterState.LINEUP_SET
            result.openSlots.value shouldBe 0
        }

        // ── rows: which positions show ────────────────────────────────────────

        // No wall of `0/—`: an untargeted position nobody holds is simply not a row.
        test("an untargeted position with no attendees is omitted") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 2)),
                mapOf(setter.id to 2),
            )

            result.positions.map { it.position } shouldBe listOf(setter)
        }

        test("an untargeted position with attendees is shown as a plain count") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 2)),
                mapOf(setter.id to 2, middle.id to 1),
            )

            val row = result.positions.single { it.position == middle }
            row.required shouldBe null
            row.attending.value shouldBe 1
            row.openSlots.value shouldBe 0
        }

        test("a targeted position with no attendees is shown, because that is the gap") {
            val result = fill(RosterRequirement(trackRoster = true, positionTargets = targets(libero to 1)))

            result.positions.map { it.position } shouldBe listOf(libero)
        }

        // Rows follow the vocabulary's own order, not the order targets happen to be stored in.
        test("rows render in the position vocabulary's order") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(middle to 1, setter to 1)),
                mapOf(libero.id to 1),
            )

            result.positions.map { it.position.label.value } shouldBe listOf("Setter", "Libero", "Middle")
        }

        // ── unassigned ────────────────────────────────────────────────────────

        // Unassigned attendees are a nudge ("N going haven't set a position"), not a roster row: they
        // feed the headcount but cannot cover a targeted slot, since nobody knows what they'd play.
        test("unassigned attendees feed the total but never fill a targeted slot") {
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 2)),
                mapOf(setter.id to 1, null to 4),
            )

            result.unassignedAttending.value shouldBe 4
            result.totalAttending.value shouldBe 5
            result.openSlots.value shouldBe 1
            result.state shouldBe RosterState.SPOTS_OPEN
            result.positions.map { it.position } shouldBe listOf(setter)
        }

        // ── stale targets ─────────────────────────────────────────────────────

        // The delete cascade and the write-time check both aim to prevent this, but neither is a
        // transaction the other shares. If one ever does slip through, it must render as nothing —
        // not as a permanently unfillable slot, and above all not as a CRITICAL nobody can clear.
        test("a target naming a position outside the vocabulary is ignored entirely") {
            val ghost = position("Deleted")
            val result = fill(
                RosterRequirement(trackRoster = true, positionTargets = targets(setter to 1, ghost to 2)),
                mapOf(setter.id to 1),
                positions = all,
            )

            result.positions.map { it.position } shouldBe listOf(setter)
            result.openSlots.value shouldBe 0
            result.state shouldBe RosterState.LINEUP_SET
        }
    }
}
