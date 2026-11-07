package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.ReceiptService
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.model.Receipt
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Receipts on expenses. Outside the Wirespec contract for the same reason as [PhotoController]: the bodies
 * are image bytes. `Payment.receiptVersion` in the contract says which receipt exists; clients request it as
 * `?v=<receiptVersion>`, so the immutable cache header is safe. Uploads are judged by their content and read
 * up to one byte past the limit.
 */
@RestController
class ReceiptController(
    private val receiptService: ReceiptService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) {
    @GetMapping(RECEIPT_PATH)
    fun receipt(@PathVariable paymentId: String): ResponseEntity<ByteArray> {
        val receipt = receiptService.receipt(caller(), team(), PaymentId(paymentId))
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(receipt.contentType))
            .header(HttpHeaders.CACHE_CONTROL, "private, max-age=31536000, immutable")
            .body(receipt.bytes)
    }

    @PutMapping(RECEIPT_PATH)
    fun uploadReceipt(@PathVariable paymentId: String, request: HttpServletRequest): ResponseEntity<Void> {
        val bytes = request.inputStream.readNBytes(Receipt.MAX_BYTES + 1)
        receiptService.uploadReceipt(caller(), team(), PaymentId(paymentId), bytes)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping(RECEIPT_PATH)
    fun removeReceipt(@PathVariable paymentId: String): ResponseEntity<Void> {
        receiptService.removeReceipt(caller(), team(), PaymentId(paymentId))
        return ResponseEntity.noContent().build()
    }

    private fun caller() = currentUserGateway.requireCurrentUserId()

    private fun team() = currentTeamGateway.requireCurrentTeamId()

    private companion object {
        const val RECEIPT_PATH = "/api/team/money-pool/payments/{paymentId}/receipt"
    }
}
