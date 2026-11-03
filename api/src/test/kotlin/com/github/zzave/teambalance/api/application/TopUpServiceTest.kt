package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotUnderActAsException
import com.github.zzave.teambalance.api.domain.exception.TopUpUnavailableException
import com.github.zzave.teambalance.api.domain.model.ActAs
import com.github.zzave.teambalance.api.domain.model.ActAsId
import com.github.zzave.teambalance.api.domain.model.ActorKind
import com.github.zzave.teambalance.api.domain.model.BunqMeLink
import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TopUpAmount
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Instant

private val MEMBER = UserId.random()

class TopUpServiceTest : FunSpec({

    val directory = TeamDirectory()
    val team = directory.addTeam("Setpoint VT", "setpoint-vt")
    directory.join(MEMBER, team, Role.USER)
    val members = object : TeamMemberRepository by directory.teamMemberRepository() {
        override fun findDisplayName(userId: UserId) = DisplayName("Lisa")
    }

    fun service(settings: MoneyPoolSettings, actAs: ActAs? = null) = TopUpService(
        settingsRepository = object : MoneyPoolSettingsRepository {
            override fun get() = settings
            override fun save(settings: MoneyPoolSettings) = settings
        },
        teamRepository = directory.teamRepository(),
        teamMemberRepository = members,
        actAsGateway = FakeActAsGateway(actAs),
    )

    val link = BunqMeLink.parse("bunq.me/setpointvt")

    test("builds the link from the stored page, the amount and the encoded description") {
        service(MoneyPoolSettings(true, bunqMeLink = link)).topUpLink(MEMBER, team, TopUpAmount(20)) shouldBe
            "https://bunq.me/setpointvt/20/TeamBalance%20%C2%B7%20Setpoint%20VT%20%C2%B7%20Lisa%20%C2%B7%20$MEMBER"
    }

    test("is unavailable when the pool is off or no link is set") {
        shouldThrow<TopUpUnavailableException> {
            service(MoneyPoolSettings(false, bunqMeLink = link)).topUpLink(MEMBER, team, TopUpAmount(20))
        }
        shouldThrow<TopUpUnavailableException> {
            service(MoneyPoolSettings(true)).topUpLink(MEMBER, team, TopUpAmount(20))
        }
    }

    test("is unavailable when the stored link is not a bunq.me page") {
        val stored = BunqMeLink.restore("https://evil.example/x")
        shouldThrow<TopUpUnavailableException> {
            service(MoneyPoolSettings(true, bunqMeLink = stored)).topUpLink(MEMBER, team, TopUpAmount(20))
        }
    }

    test("is refused under act-as, which would attribute the payment to a non-member") {
        val now = Instant.parse("2026-10-11T10:00:00Z")
        val grant = ActAs(ActAsId.random(), team, MEMBER, ActorKind.PLATFORM_ADMIN, now, now, now.plusSeconds(3600), null)
        shouldThrow<NotUnderActAsException> {
            service(MoneyPoolSettings(true, bunqMeLink = link), actAs = grant).topUpLink(MEMBER, team, TopUpAmount(20))
        }
    }
})
