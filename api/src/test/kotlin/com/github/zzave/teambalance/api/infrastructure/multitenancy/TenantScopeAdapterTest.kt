package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

class TenantScopeAdapterTest : FunSpec() {
    private val adapter = TenantScopeAdapter()
    private val scoped = TenantRouting(TeamId(UUID.randomUUID()), SchemaName("team_scoped"))
    private val requestTeam = UUID.randomUUID()

    init {
        afterTest {
            TenantContext.clear()
            CurrentTeamContext.clear()
        }

        test("routes the block to the given tenant and team") {
            adapter.within(scoped) {
                TenantContext.get() shouldBe "team_scoped"
                CurrentTeamContext.get() shouldBe scoped.teamId.value
            }
        }

        test("restores the tenant and team the request was routed to") {
            TenantContext.set("team_request")
            CurrentTeamContext.set(requestTeam)

            adapter.within(scoped) { }

            TenantContext.get() shouldBe "team_request"
            CurrentTeamContext.get() shouldBe requestTeam
        }

        test("leaves no tenant behind when the request had none") {
            adapter.within(scoped) { }

            TenantContext.isSet() shouldBe false
            CurrentTeamContext.get() shouldBe null
        }

        test("restores the request's tenant when the block throws, and lets the failure through") {
            TenantContext.set("team_request")
            CurrentTeamContext.set(requestTeam)

            shouldThrow<IllegalStateException> { adapter.within(scoped) { error("boom") } }

            TenantContext.get() shouldBe "team_request"
            CurrentTeamContext.get() shouldBe requestTeam
        }

        test("returns what the block returns") {
            adapter.within(scoped) { 42 } shouldBe 42
        }
    }
}
