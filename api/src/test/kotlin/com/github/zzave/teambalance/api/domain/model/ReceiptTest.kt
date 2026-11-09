package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidReceiptException
import com.github.zzave.teambalance.api.domain.exception.ReceiptTooLargeException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe

class ReceiptTest : FunSpec({
    test("accepts WebP and JPEG and reports the content type") {
        Receipt(webpBytes()).contentType shouldBe "image/webp"
        Receipt(jpegBytes()).contentType shouldBe "image/jpeg"
    }

    test("rejects bytes that are not WebP or JPEG as INVALID_RECEIPT") {
        shouldThrow<InvalidReceiptException> { Receipt(ByteArray(32)) }.code shouldBe "INVALID_RECEIPT"
        shouldThrow<InvalidReceiptException> { Receipt(ByteArray(0)) }
    }

    test("accepts exactly 500 KB and rejects one byte more as RECEIPT_TOO_LARGE") {
        Receipt(jpegBytes(500 * 1024)).bytes.size shouldBe 500 * 1024
        shouldThrow<ReceiptTooLargeException> { Receipt(jpegBytes(500 * 1024 + 1)) }.code shouldBe "RECEIPT_TOO_LARGE"
    }

    test("the version changes when the image does") {
        Receipt(webpBytes(64)).version shouldBe Receipt(webpBytes(64)).version
        Receipt(webpBytes(64)).version shouldNotBe Receipt(webpBytes(65)).version
    }
})
