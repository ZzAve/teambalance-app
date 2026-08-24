package com.github.zzave.teambalance.api.domain.model

/**
 * A kind of event (Training, Match, Social) and the team-wide roster it implies.
 *
 * [rosterDefault] is where a team says "a Match needs 2 setters and 12 people"; an individual event
 * inherits it dynamically unless it carries its own [Event.rosterOverride]. Editing the default
 * therefore moves every inheriting event with it, which is the point — a team changes its lineup
 * shape once, not once per training.
 *
 * [archived] is a soft delete. Deleting a type outright is not an option: [Event.eventType] is
 * non-null, so a hard delete would either orphan or cascade away real events. An archived type is
 * hidden from the create/edit pickers while every event already holding it keeps rendering with it.
 */
data class EventType(
    val id: EventTypeId,
    val name: EventTypeName,
    val color: HexColor?,
    val archived: Boolean = false,
    val rosterDefault: RosterRequirement = RosterRequirement.OFF,
)
