package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidTeamNameException

/** A validated team name with its derived URL slug and tenant schema identifier. */
data class TeamNames(
    val name: String,
    val slug: String,
    val schemaName: String,
)

/**
 * Pure, framework-free derivation of a team's slug and tenant schema name from a raw display name.
 *
 * The schema name is interpolated into `CREATE SCHEMA` / `SET search_path`, so this is the injection
 * boundary: the derivation only ever emits `[a-z0-9_]`, and the result is asserted against a strict
 * whitelist before it leaves this class. Length is capped at Postgres' 63-byte identifier limit and
 * over-long names are rejected (never truncated — a truncated schema_name would no longer match the
 * schema actually created, silently breaking tenant routing).
 */
object TeamNaming {
    const val MAX_NAME_LENGTH = 100
    const val MAX_SCHEMA_BYTES = 63

    private const val SCHEMA_PREFIX = "team_"
    private val NON_SLUG_CHARS = Regex("[^a-z0-9]+")
    private val SAFE_SCHEMA = Regex("^team_[a-z0-9_]+$")

    fun derive(rawName: String): TeamNames {
        val name = validatedName(rawName)
        val slug = slugOf(name)
        val schemaName = schemaNameFor(name, slug)
        return TeamNames(name = name, slug = slug, schemaName = schemaName)
    }

    private fun validatedName(rawName: String): String {
        val name = rawName.trim()
        if (name.isBlank()) {
            throw InvalidTeamNameException("Team name must not be blank")
        }
        if (name.length > MAX_NAME_LENGTH) {
            throw InvalidTeamNameException("Team name must be at most $MAX_NAME_LENGTH characters")
        }
        return name
    }

    private fun slugOf(name: String): String {
        val slug = name.lowercase().replace(NON_SLUG_CHARS, "-").trim('-')
        if (slug.isEmpty()) {
            throw InvalidTeamNameException("Team name '$name' has no characters usable for a URL slug")
        }
        return slug
    }

    private fun schemaNameFor(name: String, slug: String): String {
        val schemaName = SCHEMA_PREFIX + slug.replace('-', '_')
        if (schemaName.toByteArray(Charsets.UTF_8).size > MAX_SCHEMA_BYTES) {
            throw InvalidTeamNameException(
                "Team name '$name' derives a schema longer than $MAX_SCHEMA_BYTES bytes — choose a shorter name",
            )
        }
        // Defensive: the derivation above can only emit [a-z0-9_], but assert the injection-safety
        // invariant explicitly so any future change to the slug rules can't silently weaken it.
        require(SAFE_SCHEMA.matches(schemaName)) { "derived schema '$schemaName' is not a safe identifier" }
        return schemaName
    }
}
