package com.github.zzave.teambalance.api.infrastructure.config

import com.github.zzave.teambalance.api.application.CreationCodeAdminService
import com.github.zzave.teambalance.api.application.TeamService
import com.github.zzave.teambalance.api.domain.port.PlatformAdminGateway
import com.github.zzave.teambalance.api.domain.port.TeamCreationCodeRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import com.github.zzave.teambalance.api.domain.port.TeamNotificationGateway
import com.github.zzave.teambalance.api.domain.port.TeamRegistrationGateway
import com.github.zzave.teambalance.api.domain.port.TeamRepository
import com.github.zzave.teambalance.api.domain.port.TenantProvisioningGateway
import com.github.zzave.teambalance.api.domain.port.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

/**
 * Composition root for the **team-creation** area (ADR-0018), sibling to [AuthCompositionRoot]: the
 * two ends of one lifecycle. A platform admin mints a creation code ([CreationCodeAdminService]) and
 * a teamless user redeems it into a team ([TeamService]); they meet on [TeamCreationCodeRepository],
 * which no other area touches.
 */
@Configuration
class TeamCompositionRoot {

    @Bean
    fun teamService(
        teamMemberRepository: TeamMemberRepository,
        teamRepository: TeamRepository,
        creationCodeRepository: TeamCreationCodeRepository,
        tenantProvisioningGateway: TenantProvisioningGateway,
        teamRegistrationGateway: TeamRegistrationGateway,
        userRepository: UserRepository,
        teamNotificationGateway: TeamNotificationGateway,
        clock: Clock,
    ) = TeamService(
        teamMemberRepository = teamMemberRepository,
        teamRepository = teamRepository,
        creationCodeRepository = creationCodeRepository,
        tenantProvisioningGateway = tenantProvisioningGateway,
        teamRegistrationGateway = teamRegistrationGateway,
        userRepository = userRepository,
        teamNotificationGateway = teamNotificationGateway,
        clock = clock,
    )

    @Bean
    fun creationCodeAdminService(
        creationCodeRepository: TeamCreationCodeRepository,
        platformAdminGateway: PlatformAdminGateway,
        clock: Clock,
    ) = CreationCodeAdminService(
        creationCodeRepository = creationCodeRepository,
        platformAdminGateway = platformAdminGateway,
        clock = clock,
    )
}
