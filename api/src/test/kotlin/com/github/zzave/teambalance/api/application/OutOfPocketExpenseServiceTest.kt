package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.ExpenseNotFoundException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.MoneyPoolNotReadableException
import com.github.zzave.teambalance.api.domain.exception.MoneyPoolUnavailableException
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.CachedMoneyPool
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpense
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.model.Receipt
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.webpBytes
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

private val TODAY = LocalDate.of(2026, 10, 11)
private val HISTORY_START = LocalDate.of(2026, 9, 1)
private val BUNQ_EXPENSE = Payment(PaymentId("102"), LocalDate.of(2026, 10, 2), PaymentName("Sporthal"), Money(4_500), PaymentDirection.OUT)

class OutOfPocketExpenseServiceTest : FunSpec({
    val directory = TeamDirectory()
    val team = directory.addTeam("Setpoint VT", "setpoint-vt")
    val admin = UserId.random()
    val member = UserId.random()
    val otherMember = UserId.random()
    val outsider = UserId.random()
    directory.join(admin, team, Role.ADMIN)
    directory.join(member, team)
    directory.join(otherMember, team)
    val authorization = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway())

    class Fixture(pool: MoneyPool) {
        val expenses = InMemoryOutOfPocketExpenseRepository()
        val receipts = InMemoryReceiptRepository()
        val moneyPool = MoneyPoolService(
            settingsRepository = object : MoneyPoolSettingsRepository {
                override fun get() = MoneyPoolSettings(enabled = true)
                override fun save(settings: MoneyPoolSettings) = error("not used")
            },
            connectionRepository = object : BunqConnectionRepository {
                override fun find() = BunqConnection(BunqAccountId("account-1"), EncryptedToken("grant"), admin, Instant.EPOCH)
                override fun save(connection: BunqConnection) = error("not used")
                override fun pickAccount(accountId: BunqAccountId, ifGrant: EncryptedToken) = error("not used")
                override fun delete() = error("not used")
            },
            authorizationService = authorization,
            cache = object : MoneyPoolCacheGateway {
                override fun read(teamId: TeamId, account: BunqAccountId) = CachedMoneyPool(pool, refreshing = false)
                override fun evict(teamId: TeamId) = error("not used")
            },
            receiptRepository = receipts,
            outOfPocketExpenseRepository = expenses,
            paymentAliasRepository = FixedPaymentAliases(),
            teamMemberRepository = directory.teamMemberRepository(),
        )
        val service = OutOfPocketExpenseService(
            expenseRepository = expenses,
            receiptRepository = receipts,
            moneyPoolService = moneyPool,
            authorizationService = authorization,
            teamMemberRepository = directory.teamMemberRepository(),
            clock = Clock.fixed(Instant.parse("2026-10-11T10:00:00Z"), ZoneOffset.UTC),
        )

        fun record(
            caller: UserId = member,
            paidBy: UserId = caller,
            cents: Long = 1_250,
            date: LocalDate = TODAY,
            description: String = "Balls",
        ): OutOfPocketExpense = service.record(caller, team, paidBy, Money(cents), date, description)
    }

    fun fixture(pool: MoneyPool = MoneyPool.Connected(Money(18_750), listOf(BUNQ_EXPENSE), HISTORY_START)) = Fixture(pool)

    test("a member records an expense they paid; the pool lists it for them and the balance is the same") {
        val fixture = fixture()

        val recorded = fixture.record(description = "  Balls ")

        val pool = fixture.moneyPool.getMoneyPool(team, otherMember).pool as MoneyPool.Connected
        pool.payments.first() shouldBe Payment(
            recorded.id.paymentId, TODAY, PaymentName("Balls"), Money(1_250), PaymentDirection.OUT,
            memberId = member, outOfPocket = true,
        )
        pool.balance shouldBe Money(18_750)
    }

    test("an Admin records for another member; a member cannot, and neither can someone outside the team") {
        val fixture = fixture()

        fixture.record(caller = admin, paidBy = member).paidBy shouldBe member
        shouldThrow<NotTeamAdminException> { fixture.record(caller = member, paidBy = otherMember) }
        shouldThrow<NoTeamMembershipException> { fixture.record(caller = outsider) }
        shouldThrow<MemberNotFoundException> { fixture.record(caller = admin, paidBy = outsider) }
        fixture.expenses.expenses.size shouldBe 1
    }

    test("an amount outside 1 to 1000000 cents, an empty or too long description and a date outside the pool's history are refused") {
        val fixture = fixture()

        shouldThrow<IllegalArgumentException> { fixture.record(cents = 0) }
        shouldThrow<IllegalArgumentException> { fixture.record(cents = 1_000_001) }
        shouldThrow<IllegalArgumentException> { fixture.record(description = "   ") }
        shouldThrow<IllegalArgumentException> { fixture.record(description = "x".repeat(101)) }
        shouldThrow<IllegalArgumentException> { fixture.record(date = TODAY.plusDays(1)) }
        shouldThrow<IllegalArgumentException> { fixture.record(date = HISTORY_START.minusDays(1)) }
        fixture.record(cents = 1_000_000, date = HISTORY_START, description = "x".repeat(100))
        fixture.expenses.expenses.size shouldBe 1
    }

    test("nothing is recorded while the pool is not connected") {
        shouldThrow<MoneyPoolUnavailableException> { fixture(MoneyPool.Unavailable).record() }
        shouldThrow<MoneyPoolNotReadableException> { fixture(MoneyPool.Rejected).record() }
    }

    test("the member who paid deletes the expense, and its receipt goes with it") {
        val fixture = fixture()
        val recorded = fixture.record()
        fixture.receipts.save(recorded.id.paymentId, Receipt(webpBytes()))

        fixture.service.delete(member, team, recorded.id.paymentId)

        fixture.expenses.expenses.shouldBeEmpty()
        fixture.receipts.receipts shouldBe emptyMap()
    }

    test("an Admin deletes a member's expense; another member cannot") {
        val fixture = fixture()
        val recorded = fixture.record()

        shouldThrow<NotTeamAdminException> { fixture.service.delete(otherMember, team, recorded.id.paymentId) }
        fixture.expenses.expenses.size shouldBe 1
        fixture.service.delete(admin, team, recorded.id.paymentId)
        fixture.expenses.expenses.shouldBeEmpty()
    }

    test("a Bunq payment and an unknown id cannot be deleted") {
        val fixture = fixture()
        fixture.receipts.save(BUNQ_EXPENSE.id, Receipt(webpBytes()))

        shouldThrow<ExpenseNotFoundException> { fixture.service.delete(admin, team, BUNQ_EXPENSE.id) }
        shouldThrow<ExpenseNotFoundException> { fixture.service.delete(admin, team, PaymentId("oop-not-a-uuid")) }
        fixture.receipts.receipts.keys shouldBe setOf(BUNQ_EXPENSE.id)
    }
})
