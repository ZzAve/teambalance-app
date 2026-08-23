package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.exception.ActAsExpiredException
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.UnauthenticatedException
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.port.ActAsGateway
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

private class FixedActAs(private val lapsed: Boolean = false) : ActAsGateway {
    override fun current(): ActAs? = null
    override fun isLapsed(): Boolean = lapsed
}

class CurrentTeamContextAdapterTest : FunSpec() {
    init {
        afterTest { CurrentTeamContext.clear() }

        test("returns the team pinned on the request by SessionTenantContextFilter") {
            val teamId = UUID.randomUUID()
            CurrentTeamContext.set(teamId)

            CurrentTeamContextAdapter(FixedCurrentUser(UserId(UUID.randomUUID())), FixedActAs()).requireCurrentTeamId() shouldBe
                TeamId(teamId)
        }

        test("no pinned team is a membership failure naming the current user, not a missing-tenant error") {
            val userId = UUID.randomUUID()

            val failure = shouldThrow<NoTeamMembershipException> {
                CurrentTeamContextAdapter(FixedCurrentUser(UserId(userId)), FixedActAs()).requireCurrentTeamId()
            }

            failure.message shouldContain userId.toString()
        }

        // A lapse is not "you may not do this" — the frontend returns the Platform Admin to the
        // console on ACT_AS_EXPIRED, and cannot tell the two apart if both arrive as the same 403.
        test("no pinned team after an act-as lapse is reported as the lapse, not as a bare denial") {
            shouldThrow<ActAsExpiredException> {
                CurrentTeamContextAdapter(FixedCurrentUser(UserId(UUID.randomUUID())), FixedActAs(lapsed = true))
                    .requireCurrentTeamId()
            }
        }

        test("no pinned team and no authenticated user surfaces the authentication failure first") {
            shouldThrow<UnauthenticatedException> {
                CurrentTeamContextAdapter(FixedCurrentUser(null), FixedActAs()).requireCurrentTeamId()
            }
        }
    }
}
