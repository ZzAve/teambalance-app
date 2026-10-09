package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.EventQueries
import com.github.zzave.teambalance.api.application.EventService
import com.github.zzave.teambalance.api.domain.model.EventDescription
import com.github.zzave.teambalance.api.domain.model.EventLocation
import com.github.zzave.teambalance.api.domain.model.Recurrence
import com.github.zzave.teambalance.api.domain.model.RecurrenceFrequency as DomainRecurrenceFrequency
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateRecurringEvents
import com.github.zzave.teambalance.api.interfaces.generated.model.RecurrenceFrequency
import com.github.zzave.teambalance.api.interfaces.generated.model.RecurringEventSeries
import com.github.zzave.teambalance.api.interfaces.generated.model.Weekday
import org.springframework.web.bind.annotation.RestController
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalTime
import java.util.UUID

@RestController
class RecurringEventController(
    private val eventService: EventService,
    private val eventQueries: EventQueries,
    private val requestScope: RequestScope,
) : CreateRecurringEvents.Handler {

    // Admin-only, mirroring single-event create — enforced in EventService.createRecurringEvents.
    // Season/cap/empty violations surface as 422 via the GlobalExceptionHandler; a non-admin as 403.
    override suspend fun createRecurringEvents(request: CreateRecurringEvents.Request): CreateRecurringEvents.Response<*> {
        val scope = requestScope.teamScope()

        val body = request.body
        val series = eventService.createRecurringEvents(
            scope = scope,
            eventTypeId = body.eventTypeId.consumeEventTypeId(),
            title = body.title.consumeEventTitle(),
            description = body.description?.let(::EventDescription),
            location = body.location?.let(::EventLocation),
            timeOfDay = LocalTime.parse(body.timeOfDay),
            durationMinutes = body.durationMinutes,
            references = body.references.internalize(),
            recurrence = body.recurrence.consume(),
        )

        return CreateRecurringEvents.Response201(
            RecurringEventSeries(
                recurringGroup = series.recurringGroup.toString(),
                events = eventQueries.attended(scope, series.events).map { it.produce(scope.userId) },
            ),
        )
    }
}

private fun com.github.zzave.teambalance.api.interfaces.generated.model.RecurrenceRule.consume() =
    Recurrence(
        frequency = frequency.consume(),
        weekdays = weekdays.map { it.consume() }.toSet(),
        startDate = LocalDate.parse(startDate),
        endDate = LocalDate.parse(endDate),
    )

private fun RecurrenceFrequency.consume() = when (this) {
    RecurrenceFrequency.WEEKLY -> DomainRecurrenceFrequency.WEEKLY
    RecurrenceFrequency.BIWEEKLY -> DomainRecurrenceFrequency.BIWEEKLY
}

private fun Weekday.consume() = when (this) {
    Weekday.MONDAY -> DayOfWeek.MONDAY
    Weekday.TUESDAY -> DayOfWeek.TUESDAY
    Weekday.WEDNESDAY -> DayOfWeek.WEDNESDAY
    Weekday.THURSDAY -> DayOfWeek.THURSDAY
    Weekday.FRIDAY -> DayOfWeek.FRIDAY
    Weekday.SATURDAY -> DayOfWeek.SATURDAY
    Weekday.SUNDAY -> DayOfWeek.SUNDAY
}
