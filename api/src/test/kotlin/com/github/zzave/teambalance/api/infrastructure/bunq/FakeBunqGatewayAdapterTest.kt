package com.github.zzave.teambalance.api.infrastructure.bunq

import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqAuthorizationCode
import com.github.zzave.teambalance.api.domain.model.BunqGrant
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldStartWith
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

private val TODAY = LocalDate.of(2026, 10, 11)
private val ACCOUNT = BunqAccountId("any")
private val GRANT = BunqGrant("any")
private const val REDIRECT = "http://localhost:8080/api/bunq/oauth/callback"

class FakeBunqGatewayAdapterTest : FunSpec({
    val adapter = FakeBunqGatewayAdapter(Clock.fixed(Instant.parse("2026-10-11T10:00:00Z"), ZoneOffset.UTC), "http://localhost:8080/")

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

    test("limit keeps the newest payments") {
        adapter.fetchPayments(GRANT, ACCOUNT, TODAY.minusDays(90), 2).map { it.date } shouldBe
            listOf(TODAY.minusDays(5), TODAY.minusDays(7))
    }

    test("the authorization URL points at the fake approval page and carries the state and callback") {
        adapter.authorizationUrl("st ate", REDIRECT) shouldBe
            "http://localhost:8080/internal/fake-bunq/authorize?state=st+ate&redirect_uri=" +
            "http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fbunq%2Foauth%2Fcallback"
    }

    test("a code is exchanged once, for a grant that lists the fake accounts") {
        val code = BunqAuthorizationCode(adapter.issueCode("jan"))

        val grant = adapter.exchangeCode(code, REDIRECT)

        grant.accessToken shouldStartWith "fake:jan:"
        adapter.listAccounts(grant).map { it.name.value } shouldBe listOf("Teamkas", "Privé")
        shouldThrow<BunqGrantRejectedException> { adapter.exchangeCode(code, REDIRECT) }
    }

    test("an unknown code is rejected") {
        shouldThrow<BunqGrantRejectedException> { adapter.exchangeCode(BunqAuthorizationCode("never-issued"), REDIRECT) }
    }

    test("revoking a login rejects its grants everywhere, and not another login's, nor a later grant") {
        val janGrant = adapter.exchangeCode(BunqAuthorizationCode(adapter.issueCode("revoke-jan")), REDIRECT)
        val piet = adapter.exchangeCode(BunqAuthorizationCode(adapter.issueCode("revoke-piet")), REDIRECT)

        adapter.revoke("revoke-jan")

        shouldThrow<BunqGrantRejectedException> { adapter.listAccounts(janGrant) }
        shouldThrow<BunqGrantRejectedException> { adapter.fetchBalance(janGrant, ACCOUNT) }
        shouldThrow<BunqGrantRejectedException> { adapter.fetchPayments(janGrant, ACCOUNT, TODAY.minusDays(90), 200) }
        adapter.listAccounts(piet).size shouldBe 2
        val reconnected = adapter.exchangeCode(BunqAuthorizationCode(adapter.issueCode("revoke-jan")), REDIRECT)
        adapter.listAccounts(reconnected).size shouldBe 2
    }
})
