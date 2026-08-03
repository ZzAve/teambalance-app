package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AttendanceService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.domain.port.AttendanceRepository
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * Composition root for the **attendance** area (ADR-0018), sibling to [EventCompositionRoot]: the one
 * place that knows both this application service and the adapters satisfying its ports.
 */
@Configuration
class AttendanceCompositionRoot {

    @Bean
    fun attendanceService(
        attendanceRepository: AttendanceRepository,
        eventRepository: EventRepository,
        teamMemberRepository: TeamMemberRepository,
        authorizationService: AuthorizationService,
        clock: Clock,
    ) = AttendanceService(
        attendanceRepository = attendanceRepository,
        eventRepository = eventRepository,
        teamMemberRepository = teamMemberRepository,
        authorizationService = authorizationService,
        clock = clock,
    )
}
