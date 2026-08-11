package com.github.zzave.teambalance.api.domain.model

import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.util.UUID

/**
 * The concrete field values a scoped edit carries onto its affected occurrences (ADR-0014).
 *
 * The date-carrying part of [startTime]/[endTime] is honoured verbatim only for a single-occurrence
 * ([EventSeriesScope.THIS]) edit — the one scope allowed to move an occurrence's calendar date. A
 * bulk scope takes only the wall-clock **time-of-day** and the **duration** from them and keeps each
 * occurrence's own date, so a changed time-of-day propagates but the per-occurrence date never does.
 */
data class EventEdit(
    val eventType: EventType,
    val title: EventTitle,
    val description: EventDescription?,
    val location: String?,
    val references: List<EventReference>,
    val startTime: Instant,
    val endTime: Instant,
)

/**
 * The result of planning a scoped edit: [edited] are the occurrences the edit's fields were applied
 * to (the "affected N" the UI previews); [regrouped] are occurrences only moved to a new group with
 * their fields intact (the detached tail of a [EventSeriesScope.THIS] edit). Their union is the full
 * set of rows to persist.
 */
data class SeriesEditPlan(
    val edited: List<Event>,
    val regrouped: List<Event>,
) {
    val toPersist: List<Event> get() = edited + regrouped
}

/**
 * Pure row-reassignment + field-update logic for the Level-3 edit/delete scopes (ADR-0014,
 * Decision 4). No Spring, no DB, no clock — mints nothing itself (the caller supplies a fresh tail
 * group) so the split matrix is exhaustively unit-testable. The transactional apply (load the group,
 * validate the season, save/delete the rows) is the service's job.
 */
object SeriesModification {

    /**
     * Plans a scoped edit of [targetId] within [series] (all rows sharing the target's group, any
     * order). [newTailGroup] is the freshly-minted group for a detached tail; [zone] resolves the
     * wall-clock time-of-day for bulk scopes. Occurrences left entirely untouched are omitted.
     *
     *  - **THIS** → the target detaches (`group = null`) with the edit applied, its date free to
     *    move; every occurrence *after* it moves to [newTailGroup] with its fields intact; the
     *    occurrences *before* are untouched. Three disconnected things.
     *  - **THIS_AND_FOLLOWING** → the target + every following occurrence move to [newTailGroup] with
     *    the edit applied (each keeps its own date); the occurrences before are untouched.
     *  - **ALL** → every occurrence gets the edit (each keeps its own date); the group is unchanged.
     */
    fun planEdit(
        series: List<Event>,
        targetId: EventId,
        scope: EventSeriesScope,
        edit: EventEdit,
        newTailGroup: UUID,
        zone: ZoneId,
    ): SeriesEditPlan {
        val ordered = series.sortedBy { it.startTime }
        val idx = ordered.indexOfFirst { it.id == targetId }
        require(idx >= 0) { "target $targetId is not part of the series" }
        val target = ordered[idx]

        return when (scope) {
            EventSeriesScope.THIS -> SeriesEditPlan(
                edited = listOf(target.applyMoved(edit, group = null)),
                regrouped = ordered.drop(idx + 1).map { it.copy(recurringGroup = newTailGroup) },
            )

            EventSeriesScope.THIS_AND_FOLLOWING -> {
                // With no occurrences before the target, the "tail" is the whole series — there is
                // nothing to split away from, so keep the existing group (null for a standalone
                // event) rather than mint a pointless new group of identical membership.
                val tailGroup = if (idx > 0) newTailGroup else target.recurringGroup
                SeriesEditPlan(
                    edited = ordered.drop(idx).map { it.applyBulk(edit, group = tailGroup, zone = zone) },
                    regrouped = emptyList(),
                )
            }

            EventSeriesScope.ALL -> SeriesEditPlan(
                edited = ordered.map { it.applyBulk(edit, group = it.recurringGroup, zone = zone) },
                regrouped = emptyList(),
            )
        }
    }

    /**
     * The ids to delete for a scoped delete of [targetId] within [series]. A delete **never splits**
     * — survivors keep their group untouched (ADR-0014, Decision 4).
     *
     *  - **THIS** → just the target.
     *  - **THIS_AND_FOLLOWING** → the target and every later occurrence.
     *  - **ALL** → every occurrence in the group.
     */
    fun planDelete(
        series: List<Event>,
        targetId: EventId,
        scope: EventSeriesScope,
    ): List<EventId> {
        val ordered = series.sortedBy { it.startTime }
        val idx = ordered.indexOfFirst { it.id == targetId }
        require(idx >= 0) { "target $targetId is not part of the series" }

        return when (scope) {
            EventSeriesScope.THIS -> listOf(targetId)
            EventSeriesScope.THIS_AND_FOLLOWING -> ordered.drop(idx).map { it.id }
            EventSeriesScope.ALL -> ordered.map { it.id }
        }
    }

    // A single occurrence moving freely: start/end are taken verbatim, so its calendar date may move.
    private fun Event.applyMoved(edit: EventEdit, group: UUID?): Event =
        copy(
            eventType = edit.eventType,
            title = edit.title,
            description = edit.description,
            location = edit.location,
            references = edit.references,
            startTime = edit.startTime,
            endTime = edit.endTime,
            recurringGroup = group,
        )

    // A bulk-affected occurrence: keep its own calendar date, but re-anchor to the edit's wall-clock
    // time-of-day and apply the edit's duration — so a time change propagates, a date change does not.
    private fun Event.applyBulk(edit: EventEdit, group: UUID?, zone: ZoneId): Event {
        val timeOfDay = edit.startTime.atZone(zone).toLocalTime()
        val duration = Duration.between(edit.startTime, edit.endTime)
        val newStart = OccurrenceSchedule.startInstant(startTime.atZone(zone).toLocalDate(), timeOfDay, zone)
        return copy(
            eventType = edit.eventType,
            title = edit.title,
            description = edit.description,
            location = edit.location,
            references = edit.references,
            startTime = newStart,
            endTime = newStart.plus(duration),
            recurringGroup = group,
        )
    }
}
