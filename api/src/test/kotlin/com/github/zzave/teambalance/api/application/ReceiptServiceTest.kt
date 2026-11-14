package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.ExpenseNotFoundException
import com.github.zzave.teambalance.api.domain.exception.InvalidReceiptException
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.ReceiptNotFoundException
import com.github.zzave.teambalance.api.domain.model.BunqAccountId
import com.github.zzave.teambalance.api.domain.model.CachedMoneyPool
import com.github.zzave.teambalance.api.domain.model.BunqConnection
import com.github.zzave.teambalance.api.domain.model.EncryptedToken
import com.github.zzave.teambalance.api.domain.model.ExpenseDescription
import com.github.zzave.teambalance.api.domain.model.Money
import com.github.zzave.teambalance.api.domain.model.MoneyPool
import com.github.zzave.teambalance.api.domain.model.MoneyPoolSettings
import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpense
import com.github.zzave.teambalance.api.domain.model.OutOfPocketExpenseId
import com.github.zzave.teambalance.api.domain.model.Payment
import com.github.zzave.teambalance.api.domain.model.PaymentDirection
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.PaymentName
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.Season
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.webpBytes
import com.github.zzave.teambalance.api.domain.port.BunqConnectionRepository
import com.github.zzave.teambalance.api.domain.port.MoneyPoolCacheGateway
import com.github.zzave.teambalance.api.domain.port.MoneyPoolSettingsRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

private val INCOME = Payment(PaymentId("101"), LocalDate.of(2026, 10, 1), PaymentName("Lisa"), Money(2_000), PaymentDirection.IN)
private val EXPENSE = Payment(PaymentId("102"), LocalDate.of(2026, 10, 2), PaymentName("Sporthal"), Money(4_500), PaymentDirection.OUT)

class ReceiptServiceTest : FunSpec({
    val directory = TeamDirectory()
    val team = directory.addTeam("Setpoint VT", "setpoint-vt")
    val admin = UserId.random()
    val member = UserId.random()
    val outsider = UserId.random()
    directory.join(admin, team, Role.ADMIN)
    directory.join(member, team)
    val authorization = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway())

    // The pool as the cache holds it: no Bunq call is made.
    fun service(
        pool: MoneyPool = MoneyPool.Connected(Money(18_750), listOf(INCOME, EXPENSE), LocalDate.of(2026, 9, 1)),
        receipts: InMemoryReceiptRepository = InMemoryReceiptRepository(),
        outOfPocketExpenses: InMemoryOutOfPocketExpenseRepository = InMemoryOutOfPocketExpenseRepository(),
    ): ReceiptService {
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
            outOfPocketExpenseRepository = outOfPocketExpenses,
            paymentAliasRepository = FixedPaymentAliases(),
            teamMemberRepository = directory.teamMemberRepository(),
            seasonRepository = FixedSeasonRepository(Season.UNSET),
            clock = Clock.fixed(Instant.parse("2026-10-11T10:00:00Z"), ZoneOffset.UTC),
        )
        return ReceiptService(receipts, moneyPool, authorization)
    }

    test("a member uploads a receipt for an expense and another member reads it") {
        val receipts = service()
        receipts.uploadReceipt(member, team, EXPENSE.id, webpBytes())
        receipts.receipt(admin, team, EXPENSE.id).bytes.toList() shouldBe webpBytes().toList()
    }

    test("a receipt is refused for an incoming payment, an unknown payment and a pool that is not connected") {
        shouldThrow<ExpenseNotFoundException> { service().uploadReceipt(member, team, INCOME.id, webpBytes()) }
        shouldThrow<ExpenseNotFoundException> { service().uploadReceipt(member, team, PaymentId("999"), webpBytes()) }
        shouldThrow<ExpenseNotFoundException> {
            service(pool = MoneyPool.Unavailable).uploadReceipt(member, team, EXPENSE.id, webpBytes())
        }
    }

    test("an out-of-pocket expense takes a receipt while Bunq is unavailable; a Bunq expense does not") {
        val expenses = InMemoryOutOfPocketExpenseRepository()
        val balls = OutOfPocketExpense(
            OutOfPocketExpenseId.random(), member, Money(1_250), LocalDate.of(2026, 10, 2), ExpenseDescription.parse("Balls"),
        )
        expenses.insert(balls)
        val receipts = service(pool = MoneyPool.Unavailable, outOfPocketExpenses = expenses)

        receipts.uploadReceipt(member, team, balls.id.paymentId, webpBytes())

        receipts.receipt(admin, team, balls.id.paymentId).bytes.toList() shouldBe webpBytes().toList()
        shouldThrow<ExpenseNotFoundException> { receipts.uploadReceipt(member, team, EXPENSE.id, webpBytes()) }
    }

    test("a receipt that is not WebP or JPEG is rejected") {
        shouldThrow<InvalidReceiptException> { service().uploadReceipt(member, team, EXPENSE.id, ByteArray(32)) }
    }

    test("any member removes a receipt; reading it afterwards is not found") {
        val receipts = service()
        receipts.uploadReceipt(admin, team, EXPENSE.id, webpBytes())

        receipts.removeReceipt(member, team, EXPENSE.id)

        shouldThrow<ReceiptNotFoundException> { receipts.receipt(member, team, EXPENSE.id) }
    }

    test("a non-member cannot read, upload or remove a receipt") {
        val store = InMemoryReceiptRepository()
        val receipts = service(receipts = store)
        receipts.uploadReceipt(member, team, EXPENSE.id, webpBytes())

        shouldThrow<NoTeamMembershipException> { receipts.receipt(outsider, team, EXPENSE.id) }
        shouldThrow<NoTeamMembershipException> { receipts.uploadReceipt(outsider, team, EXPENSE.id, webpBytes()) }
        shouldThrow<NoTeamMembershipException> { receipts.removeReceipt(outsider, team, EXPENSE.id) }
        store.receipts.keys shouldBe setOf(EXPENSE.id)
    }
})
