package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CalendarLinkService
import com.github.zzave.teambalance.api.application.IssuedCalendarLink
import com.github.zzave.teambalance.api.domain.model.CalendarLinkId
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateCalendarLink
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DeleteCalendarLink
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListCalendarLinks
import com.github.zzave.teambalance.api.interfaces.generated.model.CalendarLinkList
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import com.github.zzave.teambalance.api.interfaces.generated.model.CalendarLink as CalendarLinkDto

/**
 * The member-facing management of **Calendar links** (ADR-0039) — create, list, delete your own
 * subscription URLs for your Active Team. The feed those URLs address is [CalendarFeedController]'s,
 * and is the one endpoint in the pair that is not authenticated.
 */
@RestController
class CalendarLinkController(
    private val calendarLinkService: CalendarLinkService,
    private val requestScope: RequestScope,
) : ListCalendarLinks.Handler,
    CreateCalendarLink.Handler,
    DeleteCalendarLink.Handler {

    override suspend fun listCalendarLinks(request: ListCalendarLinks.Request): ListCalendarLinks.Response<*> {
        val links = calendarLinkService.listLinks(requestScope.teamScope())
        return ListCalendarLinks.Response200(CalendarLinkList(links.map { it.toDto() }))
    }

    override suspend fun createCalendarLink(request: CreateCalendarLink.Request): CreateCalendarLink.Response<*> {
        val created = calendarLinkService.createLink(
            scope = requestScope.teamScope(),
            rawLabel = request.body.label,
        )
        return CreateCalendarLink.Response201(created.toDto())
    }

    override suspend fun deleteCalendarLink(request: DeleteCalendarLink.Request): DeleteCalendarLink.Response<*> {
        calendarLinkService.deleteLink(
            scope = requestScope.teamScope(),
            id = CalendarLinkId(UUID.fromString(request.path.id)),
        )
        return DeleteCalendarLink.Response204(Unit)
    }
}

private fun IssuedCalendarLink.toDto() = CalendarLinkDto(
    id = id.value.toString(),
    label = label?.value,
    createdAt = createdAt.toString(),
    expiresAt = expiresAt.toString(),
    expired = expired,
    url = url?.value,
)
