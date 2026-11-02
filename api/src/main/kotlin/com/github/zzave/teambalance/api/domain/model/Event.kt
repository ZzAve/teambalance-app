package com.github.zzave.teambalance.api.domain.model

import java.time.Instant
import java.util.UUID

data class Event(
    val id: EventId,
    val eventType: EventType,
    val title: EventTitle,
    val description: EventDescription?,
    val startTime: Instant,
    val endTime: Instant,
    val location: EventLocation?,
    val references: List<EventReference> = emptyList(),
    val recurringGroup: UUID?,
    val createdBy: UserId,
    val createdAt: Instant,
    /**
     * When this occurrence was last revised, defaulting to [createdAt] for one never edited.
     *
     * Exists for the calendar-link feed (ADR-0039), which has to tell a subscriber's calendar app
     * whether a component it already holds has changed. RFC 5545 gives that job to `DTSTAMP` on an
     * object with no `METHOD` — "the date and time that the information associated with the calendar
     * component was last revised" — so a feed built from [createdAt] tells every client that a
     * rescheduled training is the same version it already had.
     *
     * Stamped by the service that owns the clock, not by the database: time is injected everywhere
     * here precisely so a test can fix it.
     */
    val updatedAt: Instant = createdAt,
    /**
     * This occurrence's own roster requirement, or null to **inherit** [eventType]'s
     * [EventType.rosterDefault] — and to keep inheriting it, so a later edit of the default moves
     * this event too. That dynamic inheritance is what lets a recurring series follow its type
     * without rewriting every occurrence.
     *
     * When set, it is a **whole replacement** of the default, never a patch of it: there is no
     * per-position partial inheritance to reason about, so "what does this event need?" has exactly
     * one answer and one place to look.
     */
    val rosterOverride: RosterRequirement? = null,
) {
    /**
     * What this event actually needs: its own [rosterOverride], or its type's default when it has
     * none. Resolved on every read rather than copied at write time — that is what makes the
     * inheritance dynamic, so editing a type's default moves every inheriting event with it.
     *
     * The single answer to "what does this event require?", so no caller has to remember the
     * precedence or get it subtly wrong.
     */
    val effectiveRosterRequirement: RosterRequirement get() = rosterOverride ?: eventType.rosterDefault

    init {
        require(references.size <= MAX_REFERENCES) {
            "An event may have at most $MAX_REFERENCES references"
        }
    }

    companion object {
        const val MAX_REFERENCES = 10
    }
}
