package com.github.zzave.teambalance.api.domain.exception

import java.util.UUID

sealed class TeambalanceException(message: String) : RuntimeException(message)

sealed class NotFoundException(message: String) : TeambalanceException(message)

class EventNotFoundException(id: UUID) : NotFoundException("Event not found: $id")

class EventTypeNotFoundException(id: UUID) : NotFoundException("EventType not found: $id")

class AttendanceNotFoundException(eventId: UUID, userId: UUID) :
    NotFoundException("Attendance not found for event $eventId and user $userId")
