package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.ActiveTeamService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.InvitationService
import com.github.zzave.teambalance.api.application.TokenCipher
import com.github.zzave.teambalance.api.domain.port.InvitationRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import org.springframework.beans.factory.annotation.Qualifier
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
 * Reading the token secrets from configuration is this root's job: [InvitationService] takes the
 * salt as a plain constructor argument and the cipher already keyed, and neither learns where those
 * came from.
 */
@Configuration
class InvitationCompositionRoot {

    // A bean of its own so the startup re-encryption of stored links (LinkTokenAadMigration) uses the same key.
    @Bean(INVITATION_TOKEN_CIPHER)
    fun invitationTokenCipher(
        @Value("\${teambalance.invitation.token-encryption-key}") tokenEncryptionKey: String,
    ) = TokenCipher.fromBase64Key(tokenEncryptionKey, "teambalance.invitation.token-encryption-key")

    @Bean
    fun invitationService(
        invitationRepository: InvitationRepository,
        teamMemberRepository: TeamMemberRepository,
        authorizationService: AuthorizationService,
        activeTeamService: ActiveTeamService,
        clock: Clock,
        @Value("\${teambalance.invitation.token-salt}") tokenSalt: String,
        @Qualifier(INVITATION_TOKEN_CIPHER) tokenCipher: TokenCipher,
    ) = InvitationService(
        invitationRepository = invitationRepository,
        teamMemberRepository = teamMemberRepository,
        authorizationService = authorizationService,
        activeTeamService = activeTeamService,
        clock = clock,
        tokenSalt = tokenSalt,
        tokenCipher = tokenCipher,
    )

    companion object {
        const val INVITATION_TOKEN_CIPHER = "invitationTokenCipher"
    }
}
