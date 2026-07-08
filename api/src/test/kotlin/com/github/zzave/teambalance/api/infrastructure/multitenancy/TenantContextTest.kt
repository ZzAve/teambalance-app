package com.github.zzave.teambalance.api.infrastructure.multitenancy

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class TenantContextTest : FunSpec() {

    init {
        afterTest { TenantContext.clear() }

        test("unset context has no silent fallback: isSet is false even though get() returns public") {
            TenantContext.isSet() shouldBe false
            TenantContext.get() shouldBe "public"
        }

        test("set context is reported as set and returned as-is") {
            TenantContext.set("team_acme")

            TenantContext.isSet() shouldBe true
            TenantContext.get() shouldBe "team_acme"
        }

        test("clear resets to the unset state") {
            TenantContext.set("team_acme")

            TenantContext.clear()

            TenantContext.isSet() shouldBe false
            TenantContext.get() shouldBe "public"
        }
    }
}
