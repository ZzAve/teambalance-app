package com.github.zzave.teambalance.api.infrastructure.bunq

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.engine.spec.tempdir
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import java.io.File
import java.nio.file.Files
import java.nio.file.attribute.PosixFilePermissions

private const val OWNER_ONLY = "rw-------"
private const val CALLBACK = "/api/bunq/oauth/callback"

private fun File.mode() = PosixFilePermissions.toString(Files.getPosixFilePermissions(toPath()))

class BunqSandboxSupportTest : FunSpec({

    context("a private file") {
        test("a new file holds the content and is readable by its owner only") {
            val file = File(tempdir(), "secret")

            writePrivately(file, "content")

            file.readText() shouldBe "content"
            file.mode() shouldBe OWNER_ONLY
        }

        test("an existing file with a wider mode is narrowed and replaced") {
            val file = File(tempdir(), "secret").apply { writeText("old") }
            Files.setPosixFilePermissions(file.toPath(), PosixFilePermissions.fromString("rw-r--r--"))

            writePrivately(file, "new")

            file.readText() shouldBe "new"
            file.mode() shouldBe OWNER_ONLY
        }
    }

    context("the origins of the app, taken from the redirect URL") {
        test("a tunnel URL is both the API and the frontend origin") {
            val origins = AppOrigins.of("https://bunq-dev.example.com$CALLBACK")

            origins.api shouldBe "https://bunq-dev.example.com"
            origins.frontend shouldBe "https://bunq-dev.example.com"
        }

        test("a localhost URL keeps the API port and sends the frontend to the Vite dev server") {
            val origins = AppOrigins.of("http://localhost:8080$CALLBACK")

            origins.api shouldBe "http://localhost:8080"
            origins.frontend shouldBe "http://localhost:5173"
        }

        test("a path other than the callback path is refused") {
            val refusal = shouldThrow<IllegalArgumentException> { AppOrigins.of("https://bunq-dev.example.com/callback") }

            refusal.message!! shouldContain CALLBACK
        }

        test("a query is refused") {
            shouldThrow<IllegalArgumentException> { AppOrigins.of("https://bunq-dev.example.com$CALLBACK?x=1") }
        }

        test("plain http is refused for any host but localhost") {
            val refusal = shouldThrow<IllegalArgumentException> { AppOrigins.of("http://bunq-dev.example.com$CALLBACK") }

            refusal.message!! shouldContain "https"
        }
    }
})
