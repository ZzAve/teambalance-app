package com.github.zzave.teambalance.api.infrastructure

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import java.sql.Connection
import java.sql.DriverManager
import java.sql.SQLException
import java.util.UUID

/**
 * Runs the body of V018 against a scratch schema holding just the two tables it rewrites, so the
 * duplicate check can be fed case-colliding rows that the real `public.users` could not be put back
 * into once the migration has run there. The migration names its tables unqualified, so it applies
 * to whichever schema the `search_path` points at: `public` under Flyway, the scratch schema here.
 */
class NormaliseEmailsMigrationIT : FunSpec({

    val migration = checkNotNull(javaClass.getResource("/db/migration/V018__normalise_emails.sql")).readText()

    fun inScratchSchema(block: (Connection) -> Unit) {
        val schema = "email_norm_${UUID.randomUUID().toString().replace("-", "")}"
        val postgres = TeamBalanceIT.postgres
        DriverManager.getConnection(postgres.jdbcUrl, postgres.username, postgres.password).use { connection ->
            connection.createStatement().use { statement ->
                statement.execute("CREATE SCHEMA $schema")
                statement.execute("SET search_path TO $schema")
                statement.execute("CREATE TABLE users (id UUID PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE)")
                statement.execute("CREATE TABLE magic_link_tokens (id UUID PRIMARY KEY, email VARCHAR(255) NOT NULL)")
            }
            try {
                block(connection)
            } finally {
                connection.createStatement().use { it.execute("DROP SCHEMA $schema CASCADE") }
            }
        }
    }

    fun Connection.insert(table: String, vararg emails: String) = emails.forEach { email ->
        prepareStatement("INSERT INTO $table (id, email) VALUES (?, ?)").use {
            it.setObject(1, UUID.randomUUID())
            it.setString(2, email)
            it.executeUpdate()
        }
    }

    fun Connection.emails(table: String): List<String> =
        createStatement().use { statement ->
            statement.executeQuery("SELECT email FROM $table").use { rows ->
                generateSequence { if (rows.next()) rows.getString(1) else null }.toList()
            }
        }

    test("stores every user and magic-link email trimmed and lowercased") {
        inScratchSchema { connection ->
            connection.insert("users", " Alice@Example.com", "bob@example.com")
            connection.insert("magic_link_tokens", "ALICE@example.com ", "Carol@Example.com")

            connection.createStatement().use { it.execute(migration) }

            connection.emails("users") shouldContainExactlyInAnyOrder listOf("alice@example.com", "bob@example.com")
            connection.emails("magic_link_tokens") shouldContainExactlyInAnyOrder listOf("alice@example.com", "carol@example.com")
        }
    }

    test("aborts without changing anything when two users share an address once normalised") {
        inScratchSchema { connection ->
            connection.insert("users", "Alice@Example.com", "alice@example.com ", "Bob@Example.com", "bob@example.com", "Dave@Example.com")
            connection.insert("magic_link_tokens", "Dave@Example.com")

            val failure = shouldThrow<SQLException> { connection.createStatement().use { it.execute(migration) } }

            failure.message shouldContain "alice@example.com, bob@example.com"
            connection.emails("users") shouldContainExactlyInAnyOrder
                listOf("Alice@Example.com", "Bob@Example.com", "Dave@Example.com", "alice@example.com ", "bob@example.com")
            connection.emails("magic_link_tokens") shouldBe listOf("Dave@Example.com")
        }
    }
})
