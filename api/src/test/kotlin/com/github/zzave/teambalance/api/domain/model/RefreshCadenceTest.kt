package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Duration
import java.time.Instant

private val NOW: Instant = Instant.parse("2026-10-01T12:00:00Z")

private fun cadenceWithEventIn(away: Duration) = RefreshCadence.before(NOW.plus(away), NOW)

/**
 * How often a subscribed calendar is told to come back (ADR-0032). Pure banding, so it is pinned
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

    // The three reference points the bands were specified by.
    context("the bands tighten as an event approaches") {
        test("three days out: twelve hours") {
            cadenceWithEventIn(Duration.ofDays(3)) shouldBe RefreshCadence.RELAXED
            RefreshCadence.RELAXED.interval shouldBe Duration.ofHours(12)
        }
        test("two days out: six hours") {
            cadenceWithEventIn(Duration.ofDays(2)) shouldBe RefreshCadence.CLOSING
            RefreshCadence.CLOSING.interval shouldBe Duration.ofHours(6)
        }
        test("one day out: one hour") {
            cadenceWithEventIn(Duration.ofDays(1)) shouldBe RefreshCadence.IMMINENT
            RefreshCadence.IMMINENT.interval shouldBe Duration.ofHours(1)
        }
    }

    // Boundaries are inclusive from below: a band starts *at* its threshold, so "three days away"
    // is relaxed and a minute inside three days is not.
    context("each boundary belongs to the calmer band") {
        test("a minute short of three days has already tightened") {
            cadenceWithEventIn(Duration.ofDays(3).minusMinutes(1)) shouldBe RefreshCadence.CLOSING
        }
        test("a minute short of two days has tightened again") {
            cadenceWithEventIn(Duration.ofDays(2).minusMinutes(1)) shouldBe RefreshCadence.IMMINENT
        }
    }

    // The 1-2 day stretch was not given a band of its own; it rides with the imminent one.
    test("a day and a half out is imminent, not closing") {
        cadenceWithEventIn(Duration.ofHours(36)) shouldBe RefreshCadence.IMMINENT
    }

    test("an event about to start is as imminent as it gets") {
        cadenceWithEventIn(Duration.ofMinutes(10)) shouldBe RefreshCadence.IMMINENT
    }

    // Defensive rather than reachable — the feed only ever offers it a future start — but "the event
    // already began" must not wrap round to the relaxed end of the table.
    test("a start that has already passed does not fall back to relaxed") {
        RefreshCadence.before(NOW.minus(Duration.ofHours(2)), NOW) shouldBe RefreshCadence.IMMINENT
    }

    // Java renders a Duration as ISO-8601, which RFC 5545's DURATION is a subset of. CalendarIcs
    // writes the interval straight out, so a band that did not render as `PT..H` would be malformed.
    test("every band renders as an RFC 5545 duration") {
        RefreshCadence.entries.map { it.interval.toString() } shouldBe listOf("PT12H", "PT6H", "PT1H")
    }
})
