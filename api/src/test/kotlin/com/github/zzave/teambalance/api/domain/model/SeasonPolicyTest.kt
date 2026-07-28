package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.EventOutsideSeasonException
import io.kotest.assertions.throwables.shouldNotThrowAny
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.util.UUID

/**
 * Pure "what to check, and when" logic for the season bound (ADR-0014). No Spring, no DB, no clock —
 * the lowest layer that proves each write shape checks the right starts: a create checks its single
 * new start; a recurring batch checks every generated date (first-offender); a scoped edit checks
 * only the occurrences whose start actually MOVED, grandfathering the rest. [Season.allows] is the
 * predicate underneath; these tests pin which dates the policy feeds it.
 */
class SeasonPolicyTest : FunSpec({

    val zone = ZoneId.of("Europe/Amsterdam")
    val training = EventType(id = UUID.randomUUID(), name = "Training", color = "#123456")

    // A configured autumn window: 2026-09-01 .. 2026-09-30 inclusive.
    val season = Season(start = LocalDate.of(2026, 9, 1), end = LocalDate.of(2026, 9, 30))
    val policy = SeasonPolicy(season, zone)

    // A start at 20:30 local on the given date (the civil time humans read).
    fun startOn(date: String): Instant =
        LocalDate.parse(date).atTime(LocalTime.of(20, 30)).atZone(zone).toInstant()

    fun event(id: UUID, start: Instant, group: UUID? = null): Event =
        Event(
            id = id,
            eventType = training,
            title = "Weekly Training",
            description = null,
            startTime = start,
            endTime = start.plus(Duration.ofMinutes(90)),
            location = "Gym",
            references = emptyList(),
            recurringGroup = group,
            createdBy = UUID.randomUUID(),
            createdAt = Instant.parse("2026-01-01T00:00:00Z"),
        )

    // ── CREATE (single new start) ────────────────────────────────────────────

    test("requireCreatable allows a start inside the window") {
        shouldNotThrowAny { policy.requireCreatable(startOn("2026-09-15")) }
    }

    test("requireCreatable rejects a start outside the window with the offending date") {
        val ex = shouldThrow<EventOutsideSeasonException> { policy.requireCreatable(startOn("2026-10-01")) }
        ex.message shouldBe "Event start 2026-10-01 falls outside the configured season"
    }

    // ── BATCH CREATE (every generated date) ──────────────────────────────────

    test("requireAllCreatable allows a batch entirely inside the window") {
        shouldNotThrowAny {
            policy.requireAllCreatable(listOf(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 8), LocalDate.of(2026, 9, 30)))
        }
    }

    test("requireAllCreatable rejects the batch on the FIRST out-of-window date (so no row is written)") {
        // Two dates are out of window; the exception must name the first offender, not the last.
        val ex = shouldThrow<EventOutsideSeasonException> {
            policy.requireAllCreatable(
                listOf(LocalDate.of(2026, 9, 8), LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 8)),
            )
        }
        ex.message shouldBe "Event start 2026-10-01 falls outside the configured season"
    }

    // ── SCOPED EDIT (only moved starts; grandfather the rest) ─────────────────

    test("requireEditable grandfathers an ALL title-only edit: no start moves, so nothing is checked") {
        // A whole series sitting OUTSIDE a shrunk window, edited without moving any start.
        val out1 = event(UUID.randomUUID(), startOn("2026-10-06"))
        val out2 = event(UUID.randomUUID(), startOn("2026-10-13"))
        val originalStarts = mapOf(out1.id to out1.startTime, out2.id to out2.startTime)
        // toPersist carries the same starts (only the title changed upstream) — grandfathered.
        val plan = SeriesEditPlan(edited = listOf(out1, out2), regrouped = emptyList())

        shouldNotThrowAny { policy.requireEditable(plan, originalStarts) }
    }

    test("requireEditable rejects an occurrence whose start MOVED outside the window") {
        val original = event(UUID.randomUUID(), startOn("2026-09-15"))
        val originalStarts = mapOf(original.id to original.startTime)
        // The edit moved this occurrence's start out of the window.
        val moved = original.copy(startTime = startOn("2026-10-15"))
        val plan = SeriesEditPlan(edited = listOf(moved), regrouped = emptyList())

        val ex = shouldThrow<EventOutsideSeasonException> { policy.requireEditable(plan, originalStarts) }
        ex.message shouldBe "Event start 2026-10-15 falls outside the configured season"
    }

    test("requireEditable checks moved starts but grandfathers unchanged ones in the same plan") {
        // One occurrence keeps its (out-of-window) start; another moves, but moves to INSIDE the window.
        val kept = event(UUID.randomUUID(), startOn("2026-10-06"))
        val original = event(UUID.randomUUID(), startOn("2026-09-01"))
        val originalStarts = mapOf(kept.id to kept.startTime, original.id to original.startTime)
        val moved = original.copy(startTime = startOn("2026-09-20"))
        val plan = SeriesEditPlan(edited = listOf(kept, moved), regrouped = emptyList())

        // kept is out of window but unchanged (grandfathered); moved is inside — so nothing is rejected.
        shouldNotThrowAny { policy.requireEditable(plan, originalStarts) }
    }

    test("requireEditable checks the regrouped tail's moved starts too, not just edited ones") {
        // A regrouped tail row that was somehow moved out of window is still validated.
        val original = event(UUID.randomUUID(), startOn("2026-09-15"))
        val originalStarts = mapOf(original.id to original.startTime)
        val movedTail = original.copy(startTime = startOn("2026-10-20"), recurringGroup = UUID.randomUUID())
        val plan = SeriesEditPlan(edited = emptyList(), regrouped = listOf(movedTail))

        val ex = shouldThrow<EventOutsideSeasonException> { policy.requireEditable(plan, originalStarts) }
        ex.message shouldBe "Event start 2026-10-20 falls outside the configured season"
    }

    // ── UNCONFIGURED SEASON (both bounds null) allows everything ──────────────

    test("an unconfigured season allows every create, batch, and moved edit") {
        val unset = SeasonPolicy(Season.UNSET, zone)
        val original = event(UUID.randomUUID(), startOn("2026-09-15"))
        val moved = original.copy(startTime = startOn("1999-01-01"))

        shouldNotThrowAny {
            unset.requireCreatable(startOn("1999-01-01"))
            unset.requireAllCreatable(listOf(LocalDate.of(1999, 1, 1), LocalDate.of(2999, 12, 31)))
            unset.requireEditable(SeriesEditPlan(listOf(moved), emptyList()), mapOf(original.id to original.startTime))
        }
    }

    // ── Instant → date resolution happens in the supplied civil zone ──────────

    test("a start is resolved to a calendar date in the clock zone, not UTC") {
        // 2026-09-30T23:00Z is 2026-10-01 01:00 in Amsterdam (summer, +02:00) — one day PAST the
        // window end. Resolving in UTC would wrongly read 2026-09-30 (inside); the zone rejects it.
        val ex = shouldThrow<EventOutsideSeasonException> {
            policy.requireCreatable(Instant.parse("2026-09-30T23:00:00Z"))
        }
        ex.message shouldBe "Event start 2026-10-01 falls outside the configured season"
    }

    test("the zone can also pull a start INTO the window that UTC would exclude") {
        // 2026-08-31T23:00Z is 2026-09-01 01:00 in Amsterdam — the first day of the window.
        // In UTC it would read 2026-08-31 (before the start) and be rejected; the zone allows it.
        shouldNotThrowAny { policy.requireCreatable(Instant.parse("2026-08-31T23:00:00Z")) }
    }
})
