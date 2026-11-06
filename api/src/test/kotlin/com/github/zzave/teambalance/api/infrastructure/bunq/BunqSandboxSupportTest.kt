package com.github.zzave.teambalance.api.infrastructure.bunq

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.engine.spec.tempdir
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import java.io.File
import java.nio.file.Files
import java.util.concurrent.TimeUnit
import java.nio.file.attribute.PosixFilePermissions

private const val OWNER_ONLY = "rw-------"
private const val CALLBACK = "/api/bunq/oauth/callback"

private val shellAvailable = runCatching { ProcessBuilder("sh", "-c", "true").start().waitFor(1, TimeUnit.MINUTES) }.getOrDefault(false)

/** What `sh` reads back for [name] after sourcing an `export` line made with [shellQuoted] from [value]. */
private fun sourcedBy(dir: File, name: String, value: String): String {
    val envFile = File(dir, "env").apply { writeText("export $name=${shellQuoted(value)}\n") }
    val shell = ProcessBuilder("sh", "-c", ". \"\$0\" && printf %s \"\$$name\"", envFile.path).redirectErrorStream(true).start()
    val output = shell.inputStream.readBytes().decodeToString()
    shell.waitFor(1, TimeUnit.MINUTES) shouldBe true
    return output
}

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

    context("a shell word") {
        test("a plain value goes between single quotes") {
            shellQuoted("sandbox") shouldBe "'sandbox'"
        }

        test("a single quote is closed, escaped and reopened") {
            shellQuoted("it's") shouldBe """'it'\''s'"""
        }

        test("a command substitution stays inside the quotes") {
            shellQuoted("\$(id)") shouldBe "'\$(id)'"
        }

        test("sh reads back the value that was quoted, and runs nothing").config(enabled = shellAvailable) {
            val dir = tempdir()
            val marker = File(dir, "ran")
            val values = listOf(
                "plain",
                "it's",
                "'\$(touch ${marker.path})'",
                "\$(touch ${marker.path})",
                "`touch ${marker.path}`",
                "a; touch ${marker.path}",
                "two\nlines",
                "back\\slash \"double\"",
            )

            values.forEach { sourcedBy(dir, "TEAMBALANCE_TEST_VALUE", it) shouldBe it }

            marker.exists() shouldBe false
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
