package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidSlugException
import com.github.zzave.teambalance.api.domain.exception.InvalidTeamNameException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/**
 * Validation of a team's name and *user-supplied* slug (#158: validated, not derived). The schema name
 * is fed straight into `SET search_path`, so the slug format check is the security-critical
 * sanitisation boundary: the whitelist `^[a-z0-9]+(-[a-z0-9]+)*$` is what keeps the derived identifier
 * injection-safe, and the ≤58 length cap keeps `team_` + slug within Postgres' 63-byte limit.
 */
class TeamNamingTest : FunSpec() {
    init {
        test("keeps the trimmed name and the verbatim slug, deriving only the team_ schema name") {
            val names = TeamNaming.validate("  Setpoint VT  ", "setpoint-vt")
            names.name shouldBe "Setpoint VT"
            names.slug shouldBe "setpoint-vt"
            names.schemaName shouldBe "team_setpoint_vt"
        }

        test("a single-segment slug needs no substitution") {
            TeamNaming.validate("Setpoint", "setpoint").schemaName shouldBe "team_setpoint"
        }

        test("keeps digits and a purely numeric slug") {
            TeamNaming.validate("2024 Squad", "2024").schemaName shouldBe "team_2024"
        }

        test("the derived schema always matches the injection-safe whitelist") {
            Regex("^team_[a-z0-9_]+$").matches(TeamNaming.validate("A B C", "a-b-c").schemaName) shouldBe true
        }

        test("rejects a blank name with INVALID_NAME") {
            shouldThrow<InvalidTeamNameException> { TeamNaming.validate("   ", "valid-slug") }
        }

        test("rejects a name longer than the 100-char column limit with INVALID_NAME") {
            shouldThrow<InvalidTeamNameException> { TeamNaming.validate("a".repeat(101), "valid-slug") }
        }

        test("rejects uppercase, spaces, underscores, and other non-slug characters") {
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "Setpoint") }
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "set point") }
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "set_point") }
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "set!") }
        }

        test("rejects leading, trailing, and doubled hyphens and an empty slug") {
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "-setpoint") }
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "setpoint-") }
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "set--point") }
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "") }
        }

        test("accepts a 58-char slug (schema exactly 63 bytes) but rejects 59") {
            TeamNaming.validate("Team", "a".repeat(58)).schemaName.toByteArray().size shouldBe 63
            shouldThrow<InvalidSlugException> { TeamNaming.validate("Team", "a".repeat(59)) }
        }
    }
}
