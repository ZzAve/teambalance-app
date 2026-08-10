package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.UnauthenticatedException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import java.util.UUID

private class FixedCurrentUser(private val userId: UserId?) : CurrentUserGateway {
    override fun getCurrentUserId(): UserId? = userId
    override fun requireCurrentUserId(): UserId = userId ?: throw UnauthenticatedException("No user in context")
}

class CurrentTeamContextAdapterTest : FunSpec() {
    init {
        afterTest { CurrentTeamContext.clear() }

        test("returns the team pinned on the request by SessionTenantContextFilter") {
            val teamId = UUID.randomUUID()
            CurrentTeamContext.set(teamId)

            CurrentTeamContextAdapter(FixedCurrentUser(UserId(UUID.randomUUID()))).requireCurrentTeamId() shouldBe
                TeamId(teamId)
        }

        test("no pinned team is a membership failure naming the current user, not a missing-tenant error") {
            val userId = UUID.randomUUID()

            val failure = shouldThrow<NoTeamMembershipException> {
                CurrentTeamContextAdapter(FixedCurrentUser(UserId(userId))).requireCurrentTeamId()
            }

            failure.message shouldContain userId.toString()
        }

        test("no pinned team and no authenticated user surfaces the authentication failure first") {
            shouldThrow<UnauthenticatedException> {
                CurrentTeamContextAdapter(FixedCurrentUser(null)).requireCurrentTeamId()
            }
        }
    }
}
