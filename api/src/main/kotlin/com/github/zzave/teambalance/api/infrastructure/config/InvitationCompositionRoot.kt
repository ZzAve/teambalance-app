package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.InvitationService
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * Composition root for the **invitation** area (ADR-0018), sibling to [MembershipCompositionRoot]:
 * minting, rotating and accepting the links by which someone joins a team. Its own root rather than
 * part of the membership area because an invite link is a credential — it carries a salted token
 * hash and an admin-only mint path that the roster services know nothing about.
 *
 * Reading the token salt from configuration is this root's job: [InvitationService] takes the secret
 * as a plain constructor argument and never learns where it came from.
 */
@Configuration
class InvitationCompositionRoot {

    @Bean
    fun invitationService(
        invitationRepository: InvitationRepository,
        teamMemberRepository: TeamMemberRepository,
        authorizationService: AuthorizationService,
        clock: Clock,
        @Value("\${teambalance.invitation.token-salt}") tokenSalt: String,
    ) = InvitationService(
        invitationRepository = invitationRepository,
        teamMemberRepository = teamMemberRepository,
        authorizationService = authorizationService,
        clock = clock,
        tokenSalt = tokenSalt,
    )
}
