package com.github.zzave.teambalance.api.infrastructure.persistence

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import java.util.UUID

const val FAULT_MEMBER_USER_ID = "c1000000-0000-0000-0000-0000000000f1"

/**
 * Fails the team-member half of a member edit for [FAULT_MEMBER_USER_ID] — the position write, which
 * a member edit performs after the display-name write and before the onboarding stamp. That places
 * the fault squarely between the two aggregates the edit touches (`users` and `team_members`), which
 * is exactly what exposes whether those writes share one transaction.
 *
 * It decorates the Spring Data repository rather than the [com.github.zzave.teambalance.api.domain.port.TeamMemberRepository]
 * port for the same reason [FaultInjectingEventRepository] does: the transaction is owned by the
 * adapter, so a fault injected *above* the adapter would fire outside its transaction and could
 * never demonstrate a rollback.
 */
class FaultInjectingTeamMemberRepository(
    private val delegate: SpringDataTeamMemberRepository,
) : SpringDataTeamMemberRepository by delegate {

    override fun assignPosition(teamId: UUID, userId: UUID, positionId: UUID?): Int {
        if (userId.toString() == FAULT_MEMBER_USER_ID) {
            throw IllegalArgumentException("injected persistence failure assigning a position to $userId")
        }
        return delegate.assignPosition(teamId, userId, positionId)
    }
}

@TestConfiguration
class FaultInjectingTeamMemberRepositoryConfig {
    @Bean
    @Primary
    fun faultInjectingTeamMemberRepository(
        @Qualifier("springDataTeamMemberRepository") delegate: SpringDataTeamMemberRepository,
    ): SpringDataTeamMemberRepository = FaultInjectingTeamMemberRepository(delegate)
}
