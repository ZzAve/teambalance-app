package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidPhotoException
import com.github.zzave.teambalance.api.domain.exception.PhotoTooLargeException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe

fun webpBytes(size: Int = 32): ByteArray =
    "RIFF".toByteArray() + ByteArray(4) + "WEBPVP8 ".toByteArray() + ByteArray(size - 16)

fun jpegBytes(size: Int = 32): ByteArray =
    byteArrayOf(0xFF.toByte(), 0xD8.toByte(), 0xFF.toByte(), 0xE0.toByte()) + ByteArray(size - 4)

class PhotoTest : FunSpec({
    test("accepts WebP and reports its content type") {
        Photo(webpBytes()).contentType shouldBe "image/webp"
    }

    test("accepts JPEG and reports its content type") {
        Photo(jpegBytes()).contentType shouldBe "image/jpeg"
    }

    test("rejects PNG bytes as INVALID_PHOTO") {
        val png = byteArrayOf(0x89.toByte(), 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A) + ByteArray(32)
        shouldThrow<InvalidPhotoException> { Photo(png) }.code shouldBe "INVALID_PHOTO"
    }

    test("rejects a RIFF container that is not WebP") {
        val wav = "RIFF".toByteArray() + ByteArray(4) + "WAVEfmt ".toByteArray()
        shouldThrow<InvalidPhotoException> { Photo(wav) }
    }

    test("rejects empty bytes as INVALID_PHOTO") {
        shouldThrow<InvalidPhotoException> { Photo(ByteArray(0)) }.code shouldBe "INVALID_PHOTO"
    }

    test("rejects bytes shorter than the header as INVALID_PHOTO") {
        shouldThrow<InvalidPhotoException> { Photo("RIFF".toByteArray()) }
    }

    test("accepts exactly 200 KB") {
        Photo(webpBytes(200 * 1024)).bytes.size shouldBe 200 * 1024
        Photo(jpegBytes(200 * 1024)).bytes.size shouldBe 200 * 1024
    }

    test("rejects 200 KB + 1 as PHOTO_TOO_LARGE") {
        shouldThrow<PhotoTooLargeException> { Photo(webpBytes(200 * 1024 + 1)) }.code shouldBe "PHOTO_TOO_LARGE"
    }

    test("the same bytes give the same version, different bytes a different one") {
        Photo(webpBytes()).version shouldBe Photo(webpBytes()).version
        Photo(webpBytes()).version.length shouldBe 16
        Photo(webpBytes()).version shouldNotBe Photo(webpBytes(40)).version
    }
})
