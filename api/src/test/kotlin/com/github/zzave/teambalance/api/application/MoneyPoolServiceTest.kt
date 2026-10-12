package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.model.Season
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

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

private class FixedSeasonRepository(private val season: Season) : SeasonRepository {
    override fun get(): Season = season
    override fun save(season: Season): Season = season
}

class MoneyPoolServiceTest : FunSpec({

    fun service(
        enabled: Boolean = true,
        connected: Boolean = true,
        season: Season = Season.UNSET,
        gateway: BunqGateway = RecordingBunqGateway(),
    ) = MoneyPoolService(
        settingsRepository = object : MoneyPoolSettingsRepository {
            override fun get() = MoneyPoolSettings(enabled)
        },
        connectionRepository = object : BunqConnectionRepository {
            override fun find() = if (connected) BunqConnection(ACCOUNT) else null
        },
        seasonRepository = FixedSeasonRepository(season),
        bunqGateway = gateway,
        clock = Clock.fixed(Instant.parse("2026-10-11T10:00:00Z"), ZoneOffset.UTC),
    )

    test("is Off when the team switched the money pool off") {
        service(enabled = false).getMoneyPool() shouldBe MoneyPool.Off
    }

    test("is NotConnected when enabled but no Bunq connection exists") {
        service(connected = false).getMoneyPool() shouldBe MoneyPool.NotConnected
    }

    test("is Connected with balance and payments when Bunq answers") {
        service().getMoneyPool() shouldBe MoneyPool.Connected(Money(18_750), listOf(PAYMENT))
    }

    test("is Unavailable when Bunq fails") {
        service(gateway = RecordingBunqGateway(balanceFailure = IllegalStateException("bunq down"))).getMoneyPool() shouldBe
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
        service(gateway = RecordingBunqGateway(paymentsFailure = IllegalStateException("bunq down"))).getMoneyPool() shouldBe
            MoneyPool.Unavailable
    }

    test("is Off when the switch is off and no connection exists") {
        service(enabled = false, connected = false).getMoneyPool() shouldBe MoneyPool.Off
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
})
