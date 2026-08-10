package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.domain.port.EmailSender
import com.github.zzave.teambalance.api.domain.port.MagicLinkTokenRepository
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamRepository
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
 */
@Configuration
class AuthCompositionRoot {

    @Bean
    fun authService(
        magicLinkTokenRepository: MagicLinkTokenRepository,
        userRepository: UserRepository,
        teamRepository: TeamRepository,
        emailSender: EmailSender,
        platformAdminGateway: PlatformAdminGateway,
        clock: Clock,
    ) = AuthService(
        magicLinkTokenRepository = magicLinkTokenRepository,
        userRepository = userRepository,
        teamRepository = teamRepository,
        emailSender = emailSender,
        platformAdminGateway = platformAdminGateway,
        clock = clock,
    )

    @Bean
    fun authorizationService(teamMemberRepository: TeamMemberRepository) = AuthorizationService(teamMemberRepository)
}
