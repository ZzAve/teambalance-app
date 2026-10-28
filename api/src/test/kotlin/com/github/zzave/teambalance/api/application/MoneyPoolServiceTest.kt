package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.BeerCount
import com.github.zzave.teambalance.api.domain.model.BeerPrice
import com.github.zzave.teambalance.api.domain.model.BunqAccount
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.BunqMeLink
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.Season
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

private val ADMIN = UserId.random()
private val MEMBER = UserId.random()

private val ACCOUNT = BunqAccountId("account-1")
private val TODAY = LocalDate.of(2026, 10, 11)
private val PAYMENT = Payment(LocalDate.of(2026, 10, 1), PaymentName("Lisa"), Money(2_000), PaymentDirection.IN)

private class RecordingBunqGateway(
    private val balanceFailure: Exception? = null,
    private val paymentsFailure: Exception? = null,
) : BunqGateway {
    var calls = 0
    var requestedSince: LocalDate? = null
    var requestedLimit: Int? = null

    override fun authorizationUrl(state: String, redirectUri: String): String = error("not used")

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant = error("not used")

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> = error("not used")

    override fun fetchBalance(account: BunqAccountId): Money {
        calls++
        balanceFailure?.let { throw it }
        return Money(18_750)
    }

    override fun fetchPayments(account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> {
        calls++
        paymentsFailure?.let { throw it }
        requestedSince = since
        requestedLimit = limit
        return listOf(PAYMENT)
    }
}

private class InMemorySettingsRepository(var settings: MoneyPoolSettings) : MoneyPoolSettingsRepository {
    override fun get() = settings
    override fun save(settings: MoneyPoolSettings): MoneyPoolSettings = settings.also { this.settings = it }
}

private class FixedSeasonRepository(private val season: Season) : SeasonRepository {
    override fun get(): Season = season
    override fun save(season: Season): Season = season
}

class MoneyPoolServiceTest : FunSpec({

    val directory = TeamDirectory()
    val team = directory.addTeam("Setpoint VT", "setpoint-vt")
    directory.join(ADMIN, team, Role.ADMIN)
    directory.join(MEMBER, team, Role.USER)

    fun service(
        enabled: Boolean = true,
        connected: Boolean = true,
        accountPicked: Boolean = true,
        season: Season = Season.UNSET,
        gateway: BunqGateway = RecordingBunqGateway(),
        settings: MoneyPoolSettings = MoneyPoolSettings(enabled),
        settingsRepository: MoneyPoolSettingsRepository = InMemorySettingsRepository(settings),
    ) = MoneyPoolService(
        settingsRepository = settingsRepository,
        connectionRepository = object : BunqConnectionRepository {
            override fun find() = if (connected) {
                BunqConnection(
                    accountId = ACCOUNT.takeIf { accountPicked },
                    grant = EncryptedToken("not-read-by-reads"),
                    connectedBy = ADMIN,
                    connectedAt = Instant.EPOCH,
                )
            } else {
                null
            }

            override fun save(connection: BunqConnection) = error("not used")

            override fun delete() = error("not used")
        },
        seasonRepository = FixedSeasonRepository(season),
        bunqGateway = gateway,
        clock = Clock.fixed(Instant.parse("2026-10-11T10:00:00Z"), ZoneOffset.UTC),
        authorizationService = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway()),
    )

    test("is Off when the team switched the money pool off") {
        service(enabled = false).getMoneyPool().pool shouldBe MoneyPool.Off
    }

    test("is NotConnected when enabled but no Bunq connection exists") {
        service(connected = false).getMoneyPool().pool shouldBe MoneyPool.NotConnected
    }

    test("is NotConnected when connected but no account is picked yet, and Bunq is not called") {
        val gateway = RecordingBunqGateway()

        service(accountPicked = false, gateway = gateway).getMoneyPool().pool shouldBe MoneyPool.NotConnected

        gateway.calls shouldBe 0
    }

    test("is Connected with balance and payments when Bunq answers") {
        service().getMoneyPool().pool shouldBe MoneyPool.Connected(Money(18_750), listOf(PAYMENT))
    }

    test("is Unavailable when Bunq fails") {
        service(gateway = RecordingBunqGateway(balanceFailure = IllegalStateException("bunq down"))).getMoneyPool().pool shouldBe
            MoneyPool.Unavailable
    }

    test("reads payments since the season start when the season has one") {
        val gateway = RecordingBunqGateway()
        service(season = Season(start = LocalDate.of(2026, 9, 1), end = null), gateway = gateway).getMoneyPool()
        gateway.requestedSince shouldBe LocalDate.of(2026, 9, 1)
    }

    test("reads the last 90 days when the season has no start") {
        val gateway = RecordingBunqGateway()
        service(gateway = gateway).getMoneyPool()
        gateway.requestedSince shouldBe TODAY.minusDays(90)
    }

    test("asks Bunq for at most 200 payments") {
        val gateway = RecordingBunqGateway()
        service(gateway = gateway).getMoneyPool()
        gateway.requestedLimit shouldBe 200
    }

    test("is Unavailable when only the payments call fails") {
        service(gateway = RecordingBunqGateway(paymentsFailure = IllegalStateException("bunq down"))).getMoneyPool().pool shouldBe
            MoneyPool.Unavailable
    }

    test("is Off when the switch is off and no connection exists") {
        service(enabled = false, connected = false).getMoneyPool().pool shouldBe MoneyPool.Off
    }

    test("does not call Bunq when Off or NotConnected") {
        val gateway = RecordingBunqGateway()
        service(enabled = false, gateway = gateway).getMoneyPool()
        service(connected = false, gateway = gateway).getMoneyPool()
        gateway.calls shouldBe 0
    }

    test("falls back to the last 90 days when the season has not started yet") {
        val gateway = RecordingBunqGateway()
        service(season = Season(start = TODAY.plusDays(30), end = null), gateway = gateway).getMoneyPool()
        gateway.requestedSince shouldBe TODAY.minusDays(90)
    }

    test("reports the beer price and the whole beers the balance buys when Connected") {
        val pool = service(settings = MoneyPoolSettings(enabled = true, beerPrice = BeerPrice(270))).getMoneyPool().pool
        pool shouldBe MoneyPool.Connected(Money(18_750), listOf(PAYMENT), beerPrice = BeerPrice(270), beerCount = BeerCount(69))
    }

    test("reports no beer price or count when the team set no price") {
        val pool = service().getMoneyPool().pool as MoneyPool.Connected
        pool.beerPrice shouldBe null
        pool.beerCount shouldBe null
    }

    test("members can top up once the pool is on and a bunq.me link is set, in any state") {
        val link = BunqMeLink.parse("bunq.me/setpointvt")
        service(settings = MoneyPoolSettings(true, bunqMeLink = link)).getMoneyPool().canTopUp shouldBe true
        service(connected = false, settings = MoneyPoolSettings(true, bunqMeLink = link)).getMoneyPool().canTopUp shouldBe true
        service(settings = MoneyPoolSettings(true)).getMoneyPool().canTopUp shouldBe false
        service(settings = MoneyPoolSettings(false, bunqMeLink = link)).getMoneyPool().canTopUp shouldBe false
    }

    test("a stored link that is not a bunq.me page does not allow top-up") {
        val stored = BunqMeLink.restore("https://old.example/legacy")
        service(settings = MoneyPoolSettings(true, bunqMeLink = stored)).getMoneyPool().canTopUp shouldBe false
    }

    test("tells whether the switch is on") {
        service(enabled = true).isEnabled() shouldBe true
        service(enabled = false).isEnabled() shouldBe false
    }

    test("an admin reads the settings") {
        val settings = MoneyPoolSettings(true, BeerPrice(270), BunqMeLink.parse("bunq.me/setpointvt"))
        service(settings = settings).getSettings(ADMIN, team) shouldBe settings
    }

    test("a member cannot read the settings") {
        shouldThrow<NotTeamAdminException> { service().getSettings(MEMBER, team) }
    }

    test("an admin replaces the settings, clearing what is left out") {
        val repository = InMemorySettingsRepository(MoneyPoolSettings(true, BeerPrice(270), BunqMeLink.parse("bunq.me/a")))
        val replacement = MoneyPoolSettings(enabled = false)
        service(settingsRepository = repository).updateSettings(ADMIN, team, replacement) shouldBe replacement
        repository.settings shouldBe replacement
    }

    test("a member cannot replace the settings") {
        val repository = InMemorySettingsRepository(MoneyPoolSettings(true))
        shouldThrow<NotTeamAdminException> {
            service(settingsRepository = repository).updateSettings(MEMBER, team, MoneyPoolSettings(false))
        }
        repository.settings shouldBe MoneyPoolSettings(true)
    }
})
