package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.Receipt

/** Receipts on expenses, one per payment, scoped by the routed tenant schema like the Team Photo. */
interface ReceiptRepository {
    fun find(paymentId: PaymentId): Receipt?

    /** The version of each of [paymentIds] that has a receipt, without reading the image bytes. */
    fun findVersions(paymentIds: Collection<PaymentId>): Map<PaymentId, String>
    fun save(paymentId: PaymentId, receipt: Receipt)
    fun delete(paymentId: PaymentId)
}
