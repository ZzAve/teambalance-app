package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.BunqGrantRejectedException
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
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.BunqGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import com.github.zzave.teambalance.api.domain.port.SeasonRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.util.Base64

private val ADMIN = UserId.random()
private val MEMBER = UserId.random()

private val ACCOUNT = BunqAccountId("account-1")
private val TODAY = LocalDate.of(2026, 10, 11)
private val GRANT_CIPHER = TokenCipher.fromBase64Key(Base64.getEncoder().encodeToString(ByteArray(32) { it.toByte() }), "test-key")
private const val GRANT_TOKEN = "grant-token"
private val PAYMENT = Payment(LocalDate.of(2026, 10, 1), PaymentName("Lisa"), Money(2_000), PaymentDirection.IN)

private class RecordingBunqGateway(
    private val balanceFailure: Exception? = null,
    private val paymentsFailure: Exception? = null,
) : BunqGateway {
    var calls = 0
    val grantsUsed = mutableListOf<BunqGrant>()
    var requestedSince: LocalDate? = null
    var requestedLimit: Int? = null

    override fun authorizationUrl(state: String, redirectUri: String): String = error("not used")

    override fun exchangeCode(code: BunqAuthorizationCode, redirectUri: String): BunqGrant = error("not used")

    override fun listAccounts(grant: BunqGrant): List<BunqAccount> = error("not used")

    override fun fetchBalance(grant: BunqGrant, account: BunqAccountId): Money {
        calls++
        grantsUsed += grant
        balanceFailure?.let { throw it }
        return Money(18_750)
    }

    override fun fetchPayments(grant: BunqGrant, account: BunqAccountId, since: LocalDate, limit: Int): List<Payment> {
        calls++
        grantsUsed += grant
        paymentsFailure?.let { throw it }
        requestedSince = since
        requestedLimit = limit
        return listOf(PAYMENT)
    }
}

/** Asks the loader every time, and notes what it answered and for whom. */
private class PassThroughCache : MoneyPoolCacheGateway {
    val readFor = mutableListOf<Pair<TeamId, BunqAccountId>>()
    val loaded = mutableListOf<MoneyPool>()

    override fun read(teamId: TeamId, account: BunqAccountId, load: () -> MoneyPool): MoneyPool {
        readFor += teamId to account
        return load().also { loaded += it }
    }

    override fun evict(teamId: TeamId) = error("not used")
}

/** Remembers the first answer per key for good. */
private class RememberingCache : MoneyPoolCacheGateway {
    private val remembered = mutableMapOf<Pair<TeamId, BunqAccountId>, MoneyPool>()

    override fun read(teamId: TeamId, account: BunqAccountId, load: () -> MoneyPool): MoneyPool =
        remembered.getOrPut(teamId to account, load)

    override fun evict(teamId: TeamId) = error("not used")
}

/** Holds a value from an earlier read: the loader is never asked. */
private class HoldingCache(private val held: MoneyPool) : MoneyPoolCacheGateway {
    override fun read(teamId: TeamId, account: BunqAccountId, load: () -> MoneyPool): MoneyPool = held

    override fun evict(teamId: TeamId) = error("not used")
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
        storedGrant: EncryptedToken = GRANT_CIPHER.encrypt(GRANT_TOKEN),
        season: Season = Season.UNSET,
        gateway: BunqGateway = RecordingBunqGateway(),
        settings: MoneyPoolSettings = MoneyPoolSettings(enabled),
        settingsRepository: MoneyPoolSettingsRepository = InMemorySettingsRepository(settings),
        cache: MoneyPoolCacheGateway = PassThroughCache(),
    ) = MoneyPoolService(
        settingsRepository = settingsRepository,
        connectionRepository = object : BunqConnectionRepository {
            override fun find() = if (connected) {
                BunqConnection(
                    accountId = ACCOUNT.takeIf { accountPicked },
                    grant = storedGrant,
                    connectedBy = ADMIN,
                    connectedAt = Instant.EPOCH,
                )
            } else {
                null
            }

            override fun save(connection: BunqConnection) = error("not used")

            override fun pickAccount(accountId: BunqAccountId, ifGrant: EncryptedToken) = error("not used")

            override fun delete() = error("not used")
        },
        seasonRepository = FixedSeasonRepository(season),
        bunqGateway = gateway,
        grantCipher = GRANT_CIPHER,
        clock = Clock.fixed(Instant.parse("2026-10-11T10:00:00Z"), ZoneOffset.UTC),
        authorizationService = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway()),
        cache = cache,
    )

    test("is Off when the team switched the money pool off") {
        service(enabled = false).getMoneyPool(team).pool shouldBe MoneyPool.Off
    }

    test("is NotConnected when enabled but no Bunq connection exists") {
        service(connected = false).getMoneyPool(team).pool shouldBe MoneyPool.NotConnected
    }

    test("is NotConnected when connected but no account is picked yet, and Bunq is not called") {
        val gateway = RecordingBunqGateway()

        service(accountPicked = false, gateway = gateway).getMoneyPool(team).pool shouldBe MoneyPool.NotConnected

        gateway.calls shouldBe 0
    }

    test("is Connected with balance and payments when Bunq answers") {
        service().getMoneyPool(team).pool shouldBe MoneyPool.Connected(Money(18_750), listOf(PAYMENT))
    }

    test("is Unavailable when Bunq fails") {
        service(gateway = RecordingBunqGateway(balanceFailure = IllegalStateException("bunq down"))).getMoneyPool(team).pool shouldBe
            MoneyPool.Unavailable
    }

    test("reads Bunq with the decrypted stored grant") {
        val gateway = RecordingBunqGateway()

        service(gateway = gateway).getMoneyPool(team)

        gateway.grantsUsed shouldBe listOf(BunqGrant(GRANT_TOKEN), BunqGrant(GRANT_TOKEN))
    }

    test("is Rejected when Bunq rejects the grant on the balance call") {
        service(gateway = RecordingBunqGateway(balanceFailure = BunqGrantRejectedException())).getMoneyPool(team).pool shouldBe
            MoneyPool.Rejected
    }

    test("is Rejected when Bunq rejects the grant on the payments call") {
        service(gateway = RecordingBunqGateway(paymentsFailure = BunqGrantRejectedException())).getMoneyPool(team).pool shouldBe
            MoneyPool.Rejected
    }

    test("is Rejected when the stored grant does not decrypt, and Bunq is not called") {
        val gateway = RecordingBunqGateway()

        service(gateway = gateway, storedGrant = EncryptedToken("not-a-grant")).getMoneyPool(team).pool shouldBe MoneyPool.Rejected

        gateway.calls shouldBe 0
    }

    test("is Rejected when the stored grant was encrypted under another key") {
        val otherKey = TokenCipher.fromBase64Key(Base64.getEncoder().encodeToString(ByteArray(32) { 7 }), "other-key")
        val gateway = RecordingBunqGateway()

        service(gateway = gateway, storedGrant = otherKey.encrypt(GRANT_TOKEN)).getMoneyPool(team).pool shouldBe MoneyPool.Rejected

        gateway.calls shouldBe 0
    }

    test("a value the cache holds is served without a Bunq call and without opening the stored grant") {
        val gateway = RecordingBunqGateway()
        val held = MoneyPool.Connected(Money(500), listOf(PAYMENT))

        val service = service(gateway = gateway, storedGrant = EncryptedToken("not-a-grant"), cache = HoldingCache(held))

        service.getMoneyPool(team).pool shouldBe held
        gateway.calls shouldBe 0
        gateway.grantsUsed shouldBe emptyList()
    }

    test("the cache is asked for the team and the picked account") {
        val cache = PassThroughCache()

        service(cache = cache).getMoneyPool(team)

        cache.readFor shouldBe listOf(team to ACCOUNT)
    }

    test("the cache is not asked when Off, NotConnected or no account is picked") {
        val cache = PassThroughCache()

        service(enabled = false, cache = cache).getMoneyPool(team)
        service(connected = false, cache = cache).getMoneyPool(team)
        service(accountPicked = false, cache = cache).getMoneyPool(team)

        cache.readFor shouldBe emptyList()
    }

    test("a price changed after the value was cached shows on the next read") {
        val settings = InMemorySettingsRepository(MoneyPoolSettings(enabled = true, beerPrice = BeerPrice(270)))
        val gateway = RecordingBunqGateway()
        val service = service(settingsRepository = settings, gateway = gateway, cache = RememberingCache())
        service.getMoneyPool(team).pool shouldBe
            MoneyPool.Connected(Money(18_750), listOf(PAYMENT), beerPrice = BeerPrice(270), beerCount = BeerCount(69))

        settings.settings = MoneyPoolSettings(enabled = true, beerPrice = BeerPrice(300))

        service.getMoneyPool(team).pool shouldBe
            MoneyPool.Connected(Money(18_750), listOf(PAYMENT), beerPrice = BeerPrice(300), beerCount = BeerCount(62))
        gateway.calls shouldBe 2
    }

    test("a failed decrypt is handed to the cache as Rejected, a Bunq failure as Unavailable, a fresh read as Connected") {
        val cache = PassThroughCache()

        service(storedGrant = EncryptedToken("not-a-grant"), cache = cache).getMoneyPool(team)
        service(gateway = RecordingBunqGateway(balanceFailure = BunqGrantRejectedException()), cache = cache).getMoneyPool(team)
        service(gateway = RecordingBunqGateway(balanceFailure = IllegalStateException("bunq down")), cache = cache).getMoneyPool(team)
        service(cache = cache).getMoneyPool(team)

        cache.loaded shouldBe listOf(
            MoneyPool.Rejected,
            MoneyPool.Rejected,
            MoneyPool.Unavailable,
            MoneyPool.Connected(Money(18_750), listOf(PAYMENT)),
        )
    }

    test("reads payments since the season start when the season has one") {
        val gateway = RecordingBunqGateway()
        service(season = Season(start = LocalDate.of(2026, 9, 1), end = null), gateway = gateway).getMoneyPool(team)
        gateway.requestedSince shouldBe LocalDate.of(2026, 9, 1)
    }

    test("reads the last 90 days when the season has no start") {
        val gateway = RecordingBunqGateway()
        service(gateway = gateway).getMoneyPool(team)
        gateway.requestedSince shouldBe TODAY.minusDays(90)
    }

    test("asks Bunq for at most 200 payments") {
        val gateway = RecordingBunqGateway()
        service(gateway = gateway).getMoneyPool(team)
        gateway.requestedLimit shouldBe 200
    }

    test("is Unavailable when only the payments call fails") {
        service(gateway = RecordingBunqGateway(paymentsFailure = IllegalStateException("bunq down"))).getMoneyPool(team).pool shouldBe
            MoneyPool.Unavailable
    }

    test("is Off when the switch is off and no connection exists") {
        service(enabled = false, connected = false).getMoneyPool(team).pool shouldBe MoneyPool.Off
    }

    test("does not call Bunq when Off or NotConnected") {
        val gateway = RecordingBunqGateway()
        service(enabled = false, gateway = gateway).getMoneyPool(team)
        service(connected = false, gateway = gateway).getMoneyPool(team)
        gateway.calls shouldBe 0
    }

    test("falls back to the last 90 days when the season has not started yet") {
        val gateway = RecordingBunqGateway()
        service(season = Season(start = TODAY.plusDays(30), end = null), gateway = gateway).getMoneyPool(team)
        gateway.requestedSince shouldBe TODAY.minusDays(90)
    }

    test("reports the beer price and the whole beers the balance buys when Connected") {
        val pool = service(settings = MoneyPoolSettings(enabled = true, beerPrice = BeerPrice(270))).getMoneyPool(team).pool
        pool shouldBe MoneyPool.Connected(Money(18_750), listOf(PAYMENT), beerPrice = BeerPrice(270), beerCount = BeerCount(69))
    }

    test("reports no beer price or count when the team set no price") {
        val pool = service().getMoneyPool(team).pool as MoneyPool.Connected
        pool.beerPrice shouldBe null
        pool.beerCount shouldBe null
    }

    test("members can top up once the pool is on and a bunq.me link is set, in any state") {
        val link = BunqMeLink.parse("bunq.me/setpointvt")
        service(settings = MoneyPoolSettings(true, bunqMeLink = link)).getMoneyPool(team).canTopUp shouldBe true
        service(connected = false, settings = MoneyPoolSettings(true, bunqMeLink = link)).getMoneyPool(team).canTopUp shouldBe true
        service(settings = MoneyPoolSettings(true)).getMoneyPool(team).canTopUp shouldBe false
        service(settings = MoneyPoolSettings(false, bunqMeLink = link)).getMoneyPool(team).canTopUp shouldBe false
    }

    test("a stored link that is not a bunq.me page does not allow top-up") {
        val stored = BunqMeLink.restore("https://old.example/legacy")
        service(settings = MoneyPoolSettings(true, bunqMeLink = stored)).getMoneyPool(team).canTopUp shouldBe false
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
