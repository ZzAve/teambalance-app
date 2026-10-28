package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.PaymentName
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

private val TODAY = LocalDate.of(2026, 10, 11)
private val ACCOUNT = BunqAccountId("any")
private val TEAMKAS = BunqAccountId("fake-account-1")
private val PRIVE = BunqAccountId("fake-account-2")

class FakeBunqGatewayAdapterTest : FunSpec({
    val adapter = FakeBunqGatewayAdapter(Clock.fixed(Instant.parse("2026-10-11T10:00:00Z"), ZoneOffset.UTC), "http://localhost:8080")

    test("payments are dated relative to today, newest first") {
        val dates = adapter.fetchPayments(ACCOUNT, TODAY.minusDays(90), 200).map { it.date }
        dates.first() shouldBe TODAY.minusDays(5)
        dates shouldBe dates.sortedDescending()
    }

    test("a payment dated exactly on since is included") {
        adapter.fetchPayments(ACCOUNT, TODAY.minusDays(12), 200).last().date shouldBe TODAY.minusDays(12)
    }

    test("a payment dated before since is excluded") {
        adapter.fetchPayments(ACCOUNT, TODAY.minusDays(11), 200).map { it.date } shouldBe
            listOf(TODAY.minusDays(5), TODAY.minusDays(7))
    }

    test("each account serves its own balance") {
        adapter.fetchBalance(TEAMKAS) shouldBe Money(18_750)
        adapter.fetchBalance(PRIVE) shouldBe Money(4_235)
    }

    test("each account serves its own payments") {
        val teamkas = adapter.fetchPayments(TEAMKAS, TODAY.minusDays(90), 200).map { it.name }
        val prive = adapter.fetchPayments(PRIVE, TODAY.minusDays(90), 200).map { it.name }

        prive.first() shouldBe PaymentName("Albert Heijn")
        prive.intersect(teamkas.toSet()) shouldBe emptySet()
    }

    test("an account the fake does not know reads as Teamkas") {
        adapter.fetchBalance(ACCOUNT) shouldBe adapter.fetchBalance(TEAMKAS)
        adapter.fetchPayments(ACCOUNT, TODAY.minusDays(90), 200) shouldBe adapter.fetchPayments(TEAMKAS, TODAY.minusDays(90), 200)
    }

    test("limit keeps the newest payments") {
        adapter.fetchPayments(ACCOUNT, TODAY.minusDays(90), 2).map { it.date } shouldBe
            listOf(TODAY.minusDays(5), TODAY.minusDays(7))
    }
})
