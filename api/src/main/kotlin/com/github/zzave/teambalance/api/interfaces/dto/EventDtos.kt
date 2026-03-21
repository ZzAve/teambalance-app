package com.github.zzave.teambalance.api.interfaces.dto

data class EventTypeSummaryDto(
    val id: String,
    val name: String,
    val color: String?,
)

data class AttendanceSummaryDto(
    val attending: Int,
    val maybe: Int,
    val absent: Int,
    val notResponded: Int,
)

data class EventDto(
    val id: String,
    val eventType: EventTypeSummaryDto,
    val title: String,
    val description: String?,
    val startTime: String,
    val endTime: String?,
    val location: String?,
    val attendanceSummary: AttendanceSummaryDto,
)

data class EventListDto(
    val events: List<EventDto>,
)

data class AttendanceEntryDto(
    val id: String,
    val userId: String,
    val displayName: String,
    val state: String,
)

data class EventDetailDto(
    val id: String,
    val eventType: EventTypeSummaryDto,
    val title: String,
    val description: String?,
    val startTime: String,
    val endTime: String?,
    val location: String?,
    val attendanceSummary: AttendanceSummaryDto,
    val attendances: List<AttendanceEntryDto>,
)

data class AttendanceDto(
    val id: String,
    val eventId: String,
    val userId: String,
    val displayName: String,
    val state: String,
)

data class EventTypeItemDto(
    val id: String,
    val name: String,
    val color: String?,
)

data class EventTypeListDto(
    val eventTypes: List<EventTypeItemDto>,
)
