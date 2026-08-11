package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidSlugException
import com.github.zzave.teambalance.api.domain.exception.InvalidTeamNameException

/** A validated team name with its user-chosen URL slug and the derived tenant schema identifier. */
data class TeamNames(
    val name: TeamName,
    val slug: String,
    val schemaName: String,
)

/**
 * Pure, framework-free validation of a team's name and *user-supplied* slug (#158: the slug is
 * validated, not derived — the caller owns the address). The tenant schema name is the one thing still
 * derived, from the already-validated slug.
 *
 * The schema name is interpolated into `CREATE SCHEMA` / `SET search_path`, so the slug is the injection
 * boundary: it is accepted only if it matches the strict whitelist `^[a-z0-9]+(-[a-z0-9]+)*$`, so
 * `team_` + slug (hyphens → underscores) can only ever be `[a-z0-9_]`. The slug is capped at 58 chars so
 * that identifier stays within Postgres' 63-byte limit — over-long slugs are rejected, never truncated
 * (a truncated schema_name would no longer match the schema actually created, breaking tenant routing).
 */
object TeamNaming {
    const val MAX_NAME_LENGTH = 100

    // "team_" (5 bytes) + 58 = 63, exactly Postgres' identifier limit.
    const val MAX_SLUG_LENGTH = 58

    private const val SCHEMA_PREFIX = "team_"
    private val SLUG_FORMAT = Regex("^[a-z0-9]+(-[a-z0-9]+)*$")
    private val SAFE_SCHEMA = Regex("^team_[a-z0-9_]+$")

    fun validate(rawName: String, rawSlug: String): TeamNames {
        val name = validatedName(rawName)
        val slug = validatedSlug(rawSlug)
        val schemaName = SCHEMA_PREFIX + slug.replace('-', '_')
        // Defensive: the format check above already guarantees this, but assert the injection-safety
        // invariant explicitly so any future change to the slug rules can't silently weaken it.
        require(SAFE_SCHEMA.matches(schemaName)) { "derived schema '$schemaName' is not a safe identifier" }
        return TeamNames(name = name, slug = slug, schemaName = schemaName)
    }

    // The name's three clauses stay together here rather than moving onto [TeamName]: they are one
    // rule set (trim, then non-blank, then the column cap) raising one typed failure. See TeamName.
    private fun validatedName(rawName: String): TeamName {
        val name = rawName.trim()
        if (name.isBlank()) {
            throw InvalidTeamNameException("Team name must not be blank")
        }
        if (name.length > MAX_NAME_LENGTH) {
            throw InvalidTeamNameException("Team name must be at most $MAX_NAME_LENGTH characters")
        }
        return TeamName(name)
    }

    private fun validatedSlug(rawSlug: String): String {
        if (rawSlug.length > MAX_SLUG_LENGTH) {
            throw InvalidSlugException("Team address must be at most $MAX_SLUG_LENGTH characters")
        }
        if (!SLUG_FORMAT.matches(rawSlug)) {
            throw InvalidSlugException("Team address must be lowercase letters, numbers, and single hyphens")
        }
        return rawSlug
    }
}
