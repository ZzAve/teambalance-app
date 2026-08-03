package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.MemberService
import com.github.zzave.teambalance.api.application.PositionService
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

    @Bean
    fun positionService(
        positionRepository: PositionRepository,
        authorizationService: AuthorizationService,
    ) = PositionService(
        positionRepository = positionRepository,
        authorizationService = authorizationService,
    )
}
