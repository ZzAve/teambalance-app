package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MemberProfileJpaEntity
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import java.util.UUID

const val FAULT_MEMBER_USER_ID = "c1000000-0000-0000-0000-0000000000f1"

/**
 * Fails the position half of a member edit for [FAULT_MEMBER_USER_ID] — the write a member edit
 * performs after the display name and before the onboarding stamp, so the fault lands squarely
 * between the aggregates the edit touches.
 *
 * Since ADR-0026 that is a stronger claim than it used to be: the display name is written to
 * `public.team_members` in the PLATFORM schema and the profile to `member_profiles` in the TENANT
 * schema, so this now proves the edit is one transaction *across the schema boundary*, not merely
 * across two tables.
 *
 * It decorates the Spring Data repository rather than the
 * [com.github.zzave.teambalance.api.domain.port.TeamMemberRepository] port for the same reason
 * [FaultInjectingEventRepository] does: the transaction is owned by the adapter, so a fault injected
 * *above* the adapter would fire outside its transaction and could never demonstrate a rollback.
 */
class FaultInjectingMemberProfileRepository(
    private val delegate: SpringDataMemberProfileRepository,
) : SpringDataMemberProfileRepository by delegate {

    override fun <S : MemberProfileJpaEntity> save(entity: S): S {
        if (entity.userId.toString() == FAULT_MEMBER_USER_ID) {
            throw IllegalArgumentException("injected persistence failure assigning a position to ${entity.userId}")
        }
        return delegate.save(entity)
    }

    /**
     * Clearing is the same write from the transaction's point of view, and an edit that sends no
     * position takes this branch rather than [save] — so injecting only on save would silently stop
     * exercising the very path the member-edit specs drive.
     */
    override fun deleteById(id: UUID) {
        if (id.toString() == FAULT_MEMBER_USER_ID) {
            throw IllegalArgumentException("injected persistence failure clearing the position of $id")
        }
        delegate.deleteById(id)
    }
}

@TestConfiguration
class FaultInjectingTeamMemberRepositoryConfig {
    @Bean
    @Primary
    fun faultInjectingMemberProfileRepository(
        @Qualifier("springDataMemberProfileRepository") delegate: SpringDataMemberProfileRepository,
    ): SpringDataMemberProfileRepository = FaultInjectingMemberProfileRepository(delegate)
}
