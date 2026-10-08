package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.CalendarFeedService
import com.github.zzave.teambalance.api.application.CalendarLinkService
import com.github.zzave.teambalance.api.application.CalendarLinkTokens
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.CalendarLinkRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * Composition root for the **calendar-link** area (ADR-0018): the member-facing management surface and
 * the session-less feed it addresses. Its own root rather than part of the event area because a
 * calendar link is a credential — it carries a salted token hash and its own encryption key, which the
 * event services know nothing about.
 *
 * Reading those secrets from configuration is this root's job, exactly as [InvitationCompositionRoot]
 * does for the invite link: [CalendarLinkTokens] arrives already salted and already keyed, and the
 * services never learn where either came from.
 */
@Configuration
class CalendarLinkCompositionRoot {

    @Bean
    fun calendarLinkTokens(
        @Value("\${teambalance.calendar-link.token-salt}") tokenSalt: String,
        @Value("\${teambalance.calendar-link.token-encryption-key}") tokenEncryptionKey: String,
    ) = CalendarLinkTokens(
        salt = tokenSalt,
        cipher = TokenCipher.fromBase64Key(tokenEncryptionKey, "teambalance.calendar-link.token-encryption-key"),
    )

    @Bean
    fun calendarLinkService(
        calendarLinkRepository: CalendarLinkRepository,
        teamRepository: TeamRepository,
        authorizationService: AuthorizationService,
        actAsGateway: ActAsGateway,
        calendarLinkTokens: CalendarLinkTokens,
        clock: Clock,
        @Value("\${teambalance.api-base-url}") apiBaseUrl: String,
    ) = CalendarLinkService(
        calendarLinkRepository = calendarLinkRepository,
        teamRepository = teamRepository,
        authorizationService = authorizationService,
        actAsGateway = actAsGateway,
        tokens = calendarLinkTokens,
        clock = clock,
        apiBaseUrl = apiBaseUrl.trimEnd('/'),
    )

    @Bean
    fun calendarFeedService(
        teamRepository: TeamRepository,
        teamMemberRepository: TeamMemberRepository,
        calendarLinkRepository: CalendarLinkRepository,
        eventRepository: EventRepository,
        attendanceRepository: AttendanceRepository,
        calendarLinkTokens: CalendarLinkTokens,
        clock: Clock,
    ) = CalendarFeedService(
        teamRepository = teamRepository,
        teamMemberRepository = teamMemberRepository,
        calendarLinkRepository = calendarLinkRepository,
        eventRepository = eventRepository,
        attendanceRepository = attendanceRepository,
        tokens = calendarLinkTokens,
        clock = clock,
    )
}
