package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.collections.shouldNotContain
import io.kotest.matchers.shouldBe
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.util.UUID

/**
 * Pure split/reassignment matrix for the Level-3 edit/delete scopes (ADR-0014, Decision 4). No
 * Spring, no DB, no clock — the lowest layer that proves the group reassignments, the "affected"
 * set, that a bulk scope keeps each occurrence's own date while propagating the time-of-day, and
 * that a delete never splits. First / middle / last occurrences are all covered.
 */
class SeriesModificationTest : FunSpec({

    val zone = ZoneId.of("Europe/Amsterdam")
    val training = EventType(id = EventTypeId(UUID.randomUUID()), name = "Training", color = "#123456")
    val match = EventType(id = EventTypeId(UUID.randomUUID()), name = "Match", color = "#abcdef")
    val originalGroup = UUID.randomUUID()
    val tailGroup = UUID.fromString("00000000-0000-0000-0000-0000000000aa")

    // A four-occurrence weekly series: Tuesdays 20:30 local, 90 minutes, sharing one group.
    fun occurrence(date: String, group: UUID? = originalGroup): Event {
        val start = LocalDate.parse(date).atTime(LocalTime.of(20, 30)).atZone(zone).toInstant()
        return Event(
            id = EventId(UUID.nameUUIDFromBytes(date.toByteArray())),
            eventType = training,
            title = EventTitle("Weekly Training"),
            description = EventDescription("old"),
            startTime = start,
            endTime = start.plus(Duration.ofMinutes(90)),
            location = "Gym",
            references = emptyList(),
            recurringGroup = group,
            createdBy = UserId.random(),
            createdAt = Instant.parse("2026-01-01T00:00:00Z"),
        )
    }

    val d1 = occurrence("2026-09-01")
    val d2 = occurrence("2026-09-08")
    val d3 = occurrence("2026-09-15")
    val d4 = occurrence("2026-09-22")
    // Deliberately unsorted, to prove the planner orders by start time itself.
    val series = listOf(d3, d1, d4, d2)

    // An edit that changes the type/title/description/location and moves the time-of-day 20:30 → 19:00,
    // keeping the 90-minute duration. Its date (on d2, 2026-09-08) is only honoured for THIS.
    fun editOn(date: String = "2026-09-08", time: LocalTime = LocalTime.of(19, 0)): EventEdit {
        val start = LocalDate.parse(date).atTime(time).atZone(zone).toInstant()
        return EventEdit(
            eventType = match,
            title = EventTitle("Friendly Match"),
            description = EventDescription("new"),
            location = "Sportcampus",
            references = emptyList(),
            startTime = start,
            endTime = start.plus(Duration.ofMinutes(90)),
        )
    }

    fun timeOfDay(instant: Instant): LocalTime = instant.atZone(zone).toLocalTime()
    fun localDate(instant: Instant): LocalDate = instant.atZone(zone).toLocalDate()

    // ── EDIT / THIS ─────────────────────────────────────────────────────────

    test("edit THIS on a middle occurrence detaches it, regroups the tail, leaves the head untouched") {
        val plan = SeriesModification.planEdit(series, d2.id, EventSeriesScope.THIS, editOn(), tailGroup, zone)

        // Only d2 is edited; it detaches from any group.
        plan.edited.map { it.id } shouldContainExactly listOf(d2.id)
        val editedD2 = plan.edited.single()
        editedD2.recurringGroup shouldBe null
        editedD2.title shouldBe EventTitle("Friendly Match")
        editedD2.eventType shouldBe match
        // THIS may move the date/time verbatim — 2026-09-08 19:00.
        localDate(editedD2.startTime) shouldBe LocalDate.parse("2026-09-08")
        timeOfDay(editedD2.startTime) shouldBe LocalTime.of(19, 0)

        // Everything after d2 (d3, d4) moves to the fresh tail group, fields intact.
        plan.regrouped.map { it.id } shouldContainExactly listOf(d3.id, d4.id)
        plan.regrouped.forEach {
            it.recurringGroup shouldBe tailGroup
            it.title shouldBe EventTitle("Weekly Training")
        }
        // d1 (before) is untouched — absent from the plan entirely.
        plan.toPersist.map { it.id } shouldContainExactly listOf(d2.id, d3.id, d4.id)
    }

    test("edit THIS on the first occurrence regroups the whole tail and detaches only the first") {
        val plan = SeriesModification.planEdit(series, d1.id, EventSeriesScope.THIS, editOn(date = "2026-09-01"), tailGroup, zone)

        plan.edited.map { it.id } shouldContainExactly listOf(d1.id)
        plan.edited.single().recurringGroup shouldBe null
        plan.regrouped.map { it.id } shouldContainExactly listOf(d2.id, d3.id, d4.id)
        plan.regrouped.forEach { it.recurringGroup shouldBe tailGroup }
    }

    test("edit THIS on the last occurrence detaches it and leaves no tail to regroup") {
        val plan = SeriesModification.planEdit(series, d4.id, EventSeriesScope.THIS, editOn(date = "2026-09-22"), tailGroup, zone)

        plan.edited.map { it.id } shouldContainExactly listOf(d4.id)
        plan.edited.single().recurringGroup shouldBe null
        plan.regrouped.shouldBeEmpty()
    }

    // ── EDIT / THIS_AND_FOLLOWING ───────────────────────────────────────────

    test("edit THIS_AND_FOLLOWING moves target+following to a new group, keeps the head, propagates time not date") {
        val plan = SeriesModification.planEdit(series, d2.id, EventSeriesScope.THIS_AND_FOLLOWING, editOn(), tailGroup, zone)

        // d2, d3, d4 are all edited and land in the new tail group.
        plan.edited.map { it.id } shouldContainExactly listOf(d2.id, d3.id, d4.id)
        plan.regrouped.shouldBeEmpty()
        plan.edited.forEach {
            it.recurringGroup shouldBe tailGroup
            it.title shouldBe EventTitle("Friendly Match")
            // Time-of-day propagates to every affected occurrence…
            timeOfDay(it.startTime) shouldBe LocalTime.of(19, 0)
        }
        // …but each keeps its OWN calendar date — the date does not propagate.
        localDate(plan.edited[0].startTime) shouldBe LocalDate.parse("2026-09-08")
        localDate(plan.edited[1].startTime) shouldBe LocalDate.parse("2026-09-15")
        localDate(plan.edited[2].startTime) shouldBe LocalDate.parse("2026-09-22")
        // Duration is preserved (19:00 + 90m = 20:30).
        plan.edited.forEach { Duration.between(it.startTime, it.endTime) shouldBe Duration.ofMinutes(90) }
        // d1 (before the target) is left untouched.
        plan.toPersist.map { it.id } shouldNotContain d1.id
    }

    // ── EDIT / ALL ──────────────────────────────────────────────────────────

    test("edit ALL applies to every occurrence, keeps the original group, keeps each own date") {
        val plan = SeriesModification.planEdit(series, d2.id, EventSeriesScope.ALL, editOn(), tailGroup, zone)

        plan.edited.map { it.id } shouldContainExactly listOf(d1.id, d2.id, d3.id, d4.id)
        plan.regrouped.shouldBeEmpty()
        plan.edited.forEach {
            // The group is unchanged — no split.
            it.recurringGroup shouldBe originalGroup
            it.title shouldBe EventTitle("Friendly Match")
            timeOfDay(it.startTime) shouldBe LocalTime.of(19, 0)
        }
        localDate(plan.edited[0].startTime) shouldBe LocalDate.parse("2026-09-01")
        localDate(plan.edited[3].startTime) shouldBe LocalDate.parse("2026-09-22")
    }

    test("edit ALL that does not change the time-of-day leaves every start exactly where it was") {
        // Same 20:30 as the originals — grandfathering hinges on the start being genuinely unchanged.
        val plan = SeriesModification.planEdit(
            series, d2.id, EventSeriesScope.ALL, editOn(time = LocalTime.of(20, 30)), tailGroup, zone,
        )
        plan.edited.forEach { edited ->
            val original = series.single { it.id == edited.id }
            edited.startTime shouldBe original.startTime
        }
    }

    // ── DELETE (never splits) ───────────────────────────────────────────────

    test("delete THIS removes only the target and never touches the survivors' group") {
        SeriesModification.planDelete(series, d2.id, EventSeriesScope.THIS) shouldContainExactly listOf(d2.id)
    }

    test("delete THIS_AND_FOLLOWING removes the target and every later occurrence") {
        SeriesModification.planDelete(series, d2.id, EventSeriesScope.THIS_AND_FOLLOWING) shouldContainExactly
            listOf(d2.id, d3.id, d4.id)
    }

    test("delete ALL removes every occurrence in the group") {
        SeriesModification.planDelete(series, d3.id, EventSeriesScope.ALL) shouldContainExactly
            listOf(d1.id, d2.id, d3.id, d4.id)
    }

    // ── Standalone (group-less) event behaves as a one-occurrence series ─────

    test("a standalone event edits only itself regardless of scope, staying group-less") {
        val standalone = occurrence("2026-12-01", group = null)
        val edit = editOn(date = "2026-12-01")
        EventSeriesScope.entries.forEach { scope ->
            val plan = SeriesModification.planEdit(listOf(standalone), standalone.id, scope, edit, tailGroup, zone)
            plan.edited.map { it.id } shouldContainExactly listOf(standalone.id)
            plan.regrouped.shouldBeEmpty()
            plan.edited.single().recurringGroup shouldBe null
        }
    }

    test("an unknown target id is rejected") {
        shouldThrow<IllegalArgumentException> {
            SeriesModification.planEdit(series, EventId(UUID.randomUUID()), EventSeriesScope.THIS, editOn(), tailGroup, zone)
        }
        shouldThrow<IllegalArgumentException> {
            SeriesModification.planDelete(series, EventId(UUID.randomUUID()), EventSeriesScope.ALL)
        }
    }
})
