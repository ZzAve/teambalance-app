package com.github.zzave.teambalance.api.domain.model

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.io.File
import java.time.DayOfWeek
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.util.UUID

/**
 * CROSS-SEAM CONTRACT for the two recurrence rules that live in both Kotlin and TypeScript and must
 * stay in lockstep (ADR-0014): occurrence generation and the edit/delete split matrix. This spec and
 * its frontend twins (`app/src/**/*.contract.test.ts`) read the SAME golden fixture
 * (`contracts/recurrence-rules.golden.json`). If the Kotlin implementation drifts from the vectors,
 * `make test-api` fails; if the TypeScript one drifts, `make test-app` fails — so the wizard's instant
 * local preview can never silently disagree with the backend it mimics.
 *
 * The fixture is the single source of truth: it is NOT re-derived here. This spec only feeds each
 * vector through the real domain logic and asserts the pinned result.
 */
class RecurrenceContractTest : FunSpec({

    val fixture = loadGoldenFixture()

    test("MAX_OCCURRENCES matches the shared contract cap") {
        Recurrence.MAX_OCCURRENCES shouldBe fixture["maxOccurrences"].asInt()
    }

    context("occurrence generation matches the golden vectors") {
        fixture["occurrences"].forEach { case ->
            test(case["name"].asText()) {
                val recurrence = Recurrence(
                    frequency = RecurrenceFrequency.valueOf(case["frequency"].asText()),
                    weekdays = case["weekdays"].map { DayOfWeek.valueOf(it.asText()) }.toSet(),
                    startDate = LocalDate.parse(case["startDate"].asText()),
                    endDate = LocalDate.parse(case["endDate"].asText()),
                )
                recurrence.occurrences().map { it.toString() } shouldBe case["expected"].map { it.asText() }
            }
        }
    }

    context("the edit/delete split matrix matches the golden vectors") {
        fixture["splits"].forEach { case ->
            val name = case["name"].asText()
            val scope = EventSeriesScope.valueOf(case["scope"].asText())
            // The fixture keys occurrences by stable string ids; map them to UUIDs deterministically
            // so the backend Event model can carry them, then translate results back for comparison.
            val idByUuid = case["series"].associate { eventIdOf(it["id"].asText()) to it["id"].asText() }
            val series = case["series"].map { event(it["id"].asText(), Instant.parse(it["startTime"].asText())) }
            val currentId = eventIdOf(case["currentId"].asText())
            val expected = case["affectedIds"].map { it.asText() }

            // A scoped DELETE's affected set is exactly the ids it removes.
            test("$name — planDelete") {
                SeriesModification.planDelete(series, currentId, scope)
                    .map { idByUuid.getValue(it) } shouldBe expected
            }

            // A scoped EDIT's affected set is its `edited` occurrences — the "affects N" the UI
            // previews (the regrouped THIS-tail keeps its fields and is deliberately not "affected").
            test("$name — planEdit.edited") {
                SeriesModification.planEdit(series, currentId, scope, EDIT, TAIL_GROUP, ZoneId.of("UTC"))
                    .edited.map { idByUuid.getValue(it.id) } shouldBe expected
            }
        }
    }
})

private val OBJECT_MAPPER = ObjectMapper()
private val TAIL_GROUP: UUID = UUID.fromString("00000000-0000-0000-0000-0000000000aa")
private val EVENT_TYPE = EventType(
    id = EventTypeId(UUID.fromString("00000000-0000-0000-0000-0000000000e7")),
    name = "Training",
    color = "#225C9C",
)
private val EDIT = EventEdit(
    eventType = EVENT_TYPE,
    title = EventTitle("edited"),
    description = null,
    location = null,
    references = emptyList(),
    startTime = Instant.parse("2026-01-01T18:00:00Z"),
    endTime = Instant.parse("2026-01-01T19:30:00Z"),
)

private fun eventIdOf(id: String): EventId = EventId(UUID.nameUUIDFromBytes(id.toByteArray()))

private fun event(id: String, startTime: Instant): Event = Event(
    id = eventIdOf(id),
    eventType = EVENT_TYPE,
    title = EventTitle("Training"),
    description = null,
    startTime = startTime,
    endTime = startTime,
    location = null,
    references = emptyList(),
    recurringGroup = UUID.fromString("00000000-0000-0000-0000-000000000001"),
    createdBy = UserId(UUID.fromString("00000000-0000-0000-0000-000000000002")),
    createdAt = Instant.parse("2026-01-01T00:00:00Z"),
)

/**
 * Load the shared cross-language fixture by walking up from the test's working directory to the repo
 * root — so the exact same file backs both `make test-api` and `make test-app`, cwd-independently.
 */
private fun loadGoldenFixture(): JsonNode {
    val relative = "contracts/recurrence-rules.golden.json"
    val file = generateSequence(File(System.getProperty("user.dir")).absoluteFile) { it.parentFile }
        .map { File(it, relative) }
        .firstOrNull { it.isFile }
        ?: error("Golden fixture '$relative' not found above ${System.getProperty("user.dir")}")
    return OBJECT_MAPPER.readTree(file)
}
