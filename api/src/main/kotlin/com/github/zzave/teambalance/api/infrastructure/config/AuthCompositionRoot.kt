package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.ActiveTeamService
import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
import com.github.zzave.teambalance.api.domain.port.ActAsRepository
import com.github.zzave.teambalance.api.domain.port.AuthSessionGateway
import com.github.zzave.teambalance.api.domain.port.EmailGateway
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantRoutingGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * Composition root for the **auth** area (ADR-0018), sibling to [EventCompositionRoot]: who is
 * calling ([AuthService], magic-link sign-in) and what they are allowed to do
 * ([AuthorizationService], team-scoped role checks). The two belong together because both answer a
 * question about the caller rather than about team data, and neither owns a repository the other
 * needs.
 *
 * [AuthorizationService] is the one service every other area depends on — the sibling roots take it
 * as a constructor parameter and Spring resolves it to the bean declared here.
 *
 * [ActiveTeamService] is declared here for the same reason: every other area takes it as a
 * constructor parameter rather than building a resolution path of its own (ADR-0023 §1).
 *
 * [ActAsService] joins them because it is the *second* answer to the same two questions — who is
 * calling and what may they do — and because it is [AuthorizationService]'s other source: a Platform
 * Admin's **Virtual Member** (ADR-0024 §2). Keeping the pair in one root makes it visible that there
 * are exactly two, and that both are wired at one place.
 */
@Configuration
class AuthCompositionRoot {

    @Bean
    fun activeTeamService(
        teamMemberRepository: TeamMemberRepository,
        teamRepository: TeamRepository,
        userRepository: UserRepository,
        tenantRoutingGateway: TenantRoutingGateway,
    ) = ActiveTeamService(
        teamMemberRepository = teamMemberRepository,
        teamRepository = teamRepository,
        userRepository = userRepository,
        tenantRoutingGateway = tenantRoutingGateway,
    )

    @Bean
    fun authService(
        magicLinkTokenRepository: MagicLinkTokenRepository,
        userRepository: UserRepository,
        teamMemberRepository: TeamMemberRepository,
        activeTeamService: ActiveTeamService,
        actAsService: ActAsService,
        emailGateway: EmailGateway,
        platformAdminGateway: PlatformAdminGateway,
        authSessionGateway: AuthSessionGateway,
        clock: Clock,
    ) = AuthService(
        magicLinkTokenRepository = magicLinkTokenRepository,
        userRepository = userRepository,
        teamMemberRepository = teamMemberRepository,
        activeTeamService = activeTeamService,
        actAsService = actAsService,
        emailGateway = emailGateway,
        platformAdminGateway = platformAdminGateway,
        authSessionGateway = authSessionGateway,
        clock = clock,
    )

    @Bean
    fun actAsService(
        platformAdminGateway: PlatformAdminGateway,
        actAsRepository: ActAsRepository,
        actAsGateway: ActAsGateway,
        teamRepository: TeamRepository,
        tenantRoutingGateway: TenantRoutingGateway,
        clock: Clock,
    ) = ActAsService(
        platformAdminGateway = platformAdminGateway,
        actAsRepository = actAsRepository,
        actAsGateway = actAsGateway,
        teamRepository = teamRepository,
        tenantRoutingGateway = tenantRoutingGateway,
        clock = clock,
    )

    @Bean
    fun authorizationService(teamMemberRepository: TeamMemberRepository, actAsGateway: ActAsGateway) =
        AuthorizationService(teamMemberRepository, actAsGateway)
}
