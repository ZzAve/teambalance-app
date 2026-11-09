package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.util.UUID

class DemoProtectionTest : FunSpec({
    val protection = DemoProtection.ofDemoTeam()
    val sanne = DemoPersona.MEMBER.userId
    val kees = DemoPersona.ADMIN.userId

    test("both personas are protected in the demo team") {
        protection.protects(DemoPersona.TEAM_ID, sanne) shouldBe true
        protection.protects(DemoPersona.TEAM_ID, kees) shouldBe true
    }

    test("another member of the demo team is not protected") {
        protection.protects(DemoPersona.TEAM_ID, UserId(UUID.randomUUID())) shouldBe false
    }

    test("a persona's id in another team is not protected") {
        protection.protects(TeamId(UUID.randomUUID()), sanne) shouldBe false
    }
})
