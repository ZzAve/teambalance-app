package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.MemberService
import com.github.zzave.teambalance.api.application.PositionService
import com.github.zzave.teambalance.api.domain.port.EventRepository
import com.github.zzave.teambalance.api.domain.port.EventTypeRepository
import com.github.zzave.teambalance.api.domain.port.PositionRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * Composition root for the **membership** area (ADR-0018), sibling to [EventCompositionRoot]: the
 * team roster and the positions its members are assigned to. The two services share the area because
 * a position exists to be held by a member — [MemberService] resolves one through
 * [PositionRepository] on every edit.
 */
@Configuration
class MembershipCompositionRoot {

    @Bean
    fun memberService(
        userRepository: UserRepository,
        teamMemberRepository: TeamMemberRepository,
        positionRepository: PositionRepository,
        authorizationService: AuthorizationService,
        clock: Clock,
    ) = MemberService(
        userRepository = userRepository,
        teamMemberRepository = teamMemberRepository,
        positionRepository = positionRepository,
        authorizationService = authorizationService,
        clock = clock,
    )

    // No event ports here any more (ADR-0026). Deleting a position used to have to reach into the
    // event area to clear the roster targets naming it, because those tenant rows referenced a
    // platform position and no foreign key could span the two schemas. Positions are tenant rows
    // now, so the cascade is a constraint and this service is back to knowing only about positions.
    @Bean
    fun positionService(
        positionRepository: PositionRepository,
        eventTypeRepository: EventTypeRepository,
        eventRepository: EventRepository,
        teamMemberRepository: TeamMemberRepository,
        authorizationService: AuthorizationService,
    ) = PositionService(
        positionRepository = positionRepository,
        eventTypeRepository = eventTypeRepository,
        eventRepository = eventRepository,
        teamMemberRepository = teamMemberRepository,
        authorizationService = authorizationService,
    )
}
