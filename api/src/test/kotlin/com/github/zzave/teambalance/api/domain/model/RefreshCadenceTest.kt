package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Duration
import java.time.Instant

private val NOW: Instant = Instant.parse("2026-10-01T12:00:00Z")

private fun cadenceWithEventIn(away: Duration) = RefreshCadence.before(NOW.plus(away), NOW)

/**
 * How often a subscribed calendar is told to come back (ADR-0039). Pure banding, so it is pinned
 * here rather than through the feed: the only thing that can be wrong is which side of a boundary a
 * given distance falls on, and that is exactly what a table of cases says out loud.
 */
class RefreshCadenceTest : FunSpec({

    context("a quiet calendar asks for the relaxed cadence") {
        test("nothing coming up at all") {
            RefreshCadence.before(null, NOW) shouldBe RefreshCadence.RELAXED
        }
        test("the next event is a fortnight away") {
            cadenceWithEventIn(Duration.ofDays(14)) shouldBe RefreshCadence.RELAXED
        }
    }

    // The four reference points the bands are specified by.
    context("the bands tighten as an event approaches") {
        test("three days out: twelve hours") {
            cadenceWithEventIn(Duration.ofDays(3)) shouldBe RefreshCadence.RELAXED
            RefreshCadence.RELAXED.interval shouldBe Duration.ofHours(12)
        }
        test("inside three days: six hours") {
            cadenceWithEventIn(Duration.ofHours(36)) shouldBe RefreshCadence.CLOSING
            RefreshCadence.CLOSING.interval shouldBe Duration.ofHours(6)
        }
        test("inside thirty-six hours: three hours") {
            cadenceWithEventIn(Duration.ofHours(12)) shouldBe RefreshCadence.NEAR
            RefreshCadence.NEAR.interval shouldBe Duration.ofHours(3)
        }
        test("inside twelve hours: one hour") {
            cadenceWithEventIn(Duration.ofHours(11)) shouldBe RefreshCadence.IMMINENT
            RefreshCadence.IMMINENT.interval shouldBe Duration.ofHours(1)
        }
    }

    // Boundaries are inclusive from below: a band starts *at* its threshold, so "three days away"
    // is relaxed and a minute inside three days is not.
    context("each boundary belongs to the calmer band") {
        test("a minute short of three days has already tightened") {
            cadenceWithEventIn(Duration.ofDays(3).minusMinutes(1)) shouldBe RefreshCadence.CLOSING
        }
        test("a minute short of thirty-six hours has tightened again") {
            cadenceWithEventIn(Duration.ofHours(36).minusMinutes(1)) shouldBe RefreshCadence.NEAR
        }
        test("a minute short of twelve hours is as tight as it gets") {
            cadenceWithEventIn(Duration.ofHours(12).minusMinutes(1)) shouldBe RefreshCadence.IMMINENT
        }
    }

    test("an event about to start is imminent") {
        cadenceWithEventIn(Duration.ofMinutes(10)) shouldBe RefreshCadence.IMMINENT
    }

    // Defensive rather than reachable — the feed only ever offers it a future start — but "the event
    // already began" must not wrap round to the relaxed end of the table.
    test("a start that has already passed does not fall back to relaxed") {
        RefreshCadence.before(NOW.minus(Duration.ofHours(2)), NOW) shouldBe RefreshCadence.IMMINENT
    }

    // Java renders a Duration as ISO-8601, which RFC 5545's DURATION is a subset of. CalendarIcs
    // writes the interval straight out, so a band that did not render as `PT..H` would be malformed.
    test("every band renders as an RFC 5545 duration, loosest first") {
        RefreshCadence.entries.map { it.interval.toString() } shouldBe listOf("PT12H", "PT6H", "PT3H", "PT1H")
    }
})
