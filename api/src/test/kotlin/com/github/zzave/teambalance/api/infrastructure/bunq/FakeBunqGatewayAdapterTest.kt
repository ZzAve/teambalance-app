package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.PaymentName
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

private val TODAY = LocalDate.of(2026, 10, 11)
private val ACCOUNT = BunqAccountId("any")
private val GRANT = BunqGrant("fake:test")
private const val REDIRECT = "http://localhost:8080/api/bunq/oauth/callback"
private val TEAMKAS = BunqAccountId("fake-account-1")
private val PRIVE = BunqAccountId("fake-account-2")

class FakeBunqGatewayAdapterTest : FunSpec({
    val adapter = FakeBunqGatewayAdapter(Clock.fixed(Instant.parse("2026-10-11T10:00:00Z"), ZoneOffset.UTC), "http://localhost:8080")

    test("payments are dated relative to today, newest first") {
        val dates = adapter.fetchPayments(GRANT, ACCOUNT, TODAY.minusDays(90), 200).map { it.date }
        dates.first() shouldBe TODAY.minusDays(5)
        dates shouldBe dates.sortedDescending()
    }

    test("a payment dated exactly on since is included") {
        adapter.fetchPayments(GRANT, ACCOUNT, TODAY.minusDays(12), 200).last().date shouldBe TODAY.minusDays(12)
    }

    test("a payment dated before since is excluded") {
        adapter.fetchPayments(GRANT, ACCOUNT, TODAY.minusDays(11), 200).map { it.date } shouldBe
            listOf(TODAY.minusDays(5), TODAY.minusDays(7))
    }

    test("each account serves its own balance") {
        adapter.fetchBalance(GRANT, TEAMKAS) shouldBe Money(18_750)
        adapter.fetchBalance(GRANT, PRIVE) shouldBe Money(4_235)
    }

    test("each account serves its own payments") {
        val teamkas = adapter.fetchPayments(GRANT, TEAMKAS, TODAY.minusDays(90), 200).map { it.name }
        val prive = adapter.fetchPayments(GRANT, PRIVE, TODAY.minusDays(90), 200).map { it.name }

        prive.first() shouldBe PaymentName("Albert Heijn")
        prive.intersect(teamkas.toSet()) shouldBe emptySet()
    }

    test("an account the fake does not know reads as Teamkas") {
        adapter.fetchBalance(GRANT, ACCOUNT) shouldBe adapter.fetchBalance(GRANT, TEAMKAS)
        adapter.fetchPayments(GRANT, ACCOUNT, TODAY.minusDays(90), 200) shouldBe
            adapter.fetchPayments(GRANT, TEAMKAS, TODAY.minusDays(90), 200)
    }

    test("limit keeps the newest payments") {
        adapter.fetchPayments(GRANT, ACCOUNT, TODAY.minusDays(90), 2).map { it.date } shouldBe
            listOf(TODAY.minusDays(5), TODAY.minusDays(7))
    }

    fun grantFor(login: String) = adapter.exchangeCode(BunqAuthorizationCode(adapter.issueCode(login)), REDIRECT)

    test("revoking a login rejects balance, payments and accounts for each of its grants") {
        val first = grantFor("revoke-jan")
        val second = grantFor("revoke-jan")

        adapter.revoke("revoke-jan")

        listOf(first, second).forEach { grant ->
            shouldThrow<BunqGrantRejectedException> { adapter.fetchBalance(grant, TEAMKAS) }
            shouldThrow<BunqGrantRejectedException> { adapter.fetchPayments(grant, TEAMKAS, TODAY.minusDays(90), 200) }
            shouldThrow<BunqGrantRejectedException> { adapter.listAccounts(grant) }
        }
    }

    test("a grant issued after the revoke is accepted") {
        grantFor("revoke-piet")
        adapter.revoke("revoke-piet")

        val reconnected = grantFor("revoke-piet")

        adapter.fetchBalance(reconnected, TEAMKAS) shouldBe Money(18_750)
        adapter.listAccounts(reconnected).size shouldBe 2
    }

    test("revoking a login leaves another login's grants alone") {
        val klaas = grantFor("revoke-klaas")
        grantFor("revoke-sanne")

        adapter.revoke("revoke-sanne")

        adapter.fetchBalance(klaas, TEAMKAS) shouldBe Money(18_750)
    }

    test("a grant the fake never issued is accepted") {
        adapter.fetchBalance(BunqGrant("fake:test"), TEAMKAS) shouldBe Money(18_750)
        adapter.listAccounts(BunqGrant("fake:test")).size shouldBe 2
    }
})
