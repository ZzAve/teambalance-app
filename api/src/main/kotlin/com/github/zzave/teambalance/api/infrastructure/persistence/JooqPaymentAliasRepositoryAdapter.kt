package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.exception.PaymentAliasTakenException
import com.github.zzave.teambalance.api.domain.model.Iban
import com.github.zzave.teambalance.api.domain.model.PaymentAlias
import com.github.zzave.teambalance.api.domain.model.PaymentAliasId
import com.github.zzave.teambalance.api.domain.model.PaymentAliasName
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PaymentAliasRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.MEMBER_PAYMENT_ALIASES
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.tables.records.MemberPaymentAliasesRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository

/** Payment aliases, tenant-schema rows (ADR-0046), scoped by the routed connection like the other tenant adapters. */
@Repository
class JooqPaymentAliasRepositoryAdapter(
    private val dsl: DSLContext,
) : PaymentAliasRepository {

    override fun findByUser(userId: UserId): List<PaymentAlias> =
        dsl.selectFrom(MEMBER_PAYMENT_ALIASES)
            .where(MEMBER_PAYMENT_ALIASES.USER_ID.eq(userId.value))
            .orderBy(MEMBER_PAYMENT_ALIASES.ID)
            .fetch { it.toDomain() }

    override fun findAll(): List<PaymentAlias> = dsl.selectFrom(MEMBER_PAYMENT_ALIASES).fetch { it.toDomain() }

    override fun insert(alias: PaymentAlias) {
        refusingTaken {
            dsl.insertInto(MEMBER_PAYMENT_ALIASES)
                .set(MEMBER_PAYMENT_ALIASES.ID, alias.id.value)
                .set(MEMBER_PAYMENT_ALIASES.USER_ID, alias.userId.value)
                .set(MEMBER_PAYMENT_ALIASES.NAME, alias.name?.value)
                .set(MEMBER_PAYMENT_ALIASES.IBAN, alias.iban?.value)
                .execute()
        }
    }

    override fun update(alias: PaymentAlias): Boolean =
        refusingTaken {
            dsl.update(MEMBER_PAYMENT_ALIASES)
                .set(MEMBER_PAYMENT_ALIASES.NAME, alias.name?.value)
                .set(MEMBER_PAYMENT_ALIASES.IBAN, alias.iban?.value)
                .where(MEMBER_PAYMENT_ALIASES.ID.eq(alias.id.value))
                .and(MEMBER_PAYMENT_ALIASES.USER_ID.eq(alias.userId.value))
                .execute() == 1
        }

    override fun delete(userId: UserId, id: PaymentAliasId): Boolean =
        dsl.deleteFrom(MEMBER_PAYMENT_ALIASES)
            .where(MEMBER_PAYMENT_ALIASES.ID.eq(id.value))
            .and(MEMBER_PAYMENT_ALIASES.USER_ID.eq(userId.value))
            .execute() == 1

    private inline fun <T> refusingTaken(block: () -> T): T =
        refusingDuplicate(NAME_INDEX, ::PaymentAliasTakenException) {
            refusingDuplicate(IBAN_INDEX, ::PaymentAliasTakenException, block)
        }

    private fun MemberPaymentAliasesRecord.toDomain() = PaymentAlias(
        id = PaymentAliasId(id),
        userId = UserId(userId),
        name = name?.let(PaymentAliasName::parse),
        iban = iban?.let(Iban::parse),
    )

    private companion object {
        const val NAME_INDEX = "member_payment_aliases_name_key"
        const val IBAN_INDEX = "member_payment_aliases_iban_key"
    }
}
