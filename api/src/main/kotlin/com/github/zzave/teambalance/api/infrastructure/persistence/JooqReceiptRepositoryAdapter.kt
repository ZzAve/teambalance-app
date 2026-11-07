package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.Receipt
import com.github.zzave.teambalance.api.domain.port.ReceiptRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.PAYMENT_RECEIPTS
import org.jooq.DSLContext
import org.jooq.impl.DSL.excluded
import org.springframework.stereotype.Repository
import java.time.OffsetDateTime
import java.time.ZoneOffset

@Repository
class JooqReceiptRepositoryAdapter(
    private val dsl: DSLContext,
) : ReceiptRepository {
    override fun find(paymentId: PaymentId): Receipt? =
        dsl.select(PAYMENT_RECEIPTS.IMAGE)
            .from(PAYMENT_RECEIPTS)
            .where(PAYMENT_RECEIPTS.PAYMENT_ID.eq(paymentId.value))
            .fetchOne(PAYMENT_RECEIPTS.IMAGE)
            ?.let(::Receipt)

    override fun findVersions(paymentIds: Collection<PaymentId>): Map<PaymentId, String> =
        if (paymentIds.isEmpty()) {
            emptyMap()
        } else {
            dsl.select(PAYMENT_RECEIPTS.PAYMENT_ID, PAYMENT_RECEIPTS.VERSION)
                .from(PAYMENT_RECEIPTS)
                .where(PAYMENT_RECEIPTS.PAYMENT_ID.`in`(paymentIds.map { it.value }))
                .fetch { PaymentId(it.value1()) to it.value2() }
                .toMap()
        }

    override fun save(paymentId: PaymentId, receipt: Receipt) {
        dsl.insertInto(PAYMENT_RECEIPTS)
            .set(PAYMENT_RECEIPTS.PAYMENT_ID, paymentId.value)
            .set(PAYMENT_RECEIPTS.IMAGE, receipt.bytes)
            .set(PAYMENT_RECEIPTS.VERSION, receipt.version)
            .set(PAYMENT_RECEIPTS.UPDATED_AT, OffsetDateTime.now(ZoneOffset.UTC))
            .onConflict(PAYMENT_RECEIPTS.PAYMENT_ID)
            .doUpdate()
            .set(PAYMENT_RECEIPTS.IMAGE, excluded(PAYMENT_RECEIPTS.IMAGE))
            .set(PAYMENT_RECEIPTS.VERSION, excluded(PAYMENT_RECEIPTS.VERSION))
            .set(PAYMENT_RECEIPTS.UPDATED_AT, excluded(PAYMENT_RECEIPTS.UPDATED_AT))
            .execute()
    }

    override fun delete(paymentId: PaymentId) {
        dsl.deleteFrom(PAYMENT_RECEIPTS).where(PAYMENT_RECEIPTS.PAYMENT_ID.eq(paymentId.value)).execute()
    }
}
