package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidTeamNameException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/**
 * Pure derivation of a team's slug + tenant schema name from a raw display name. The schema name is
 * fed straight into `SET search_path`, so this is the security-critical sanitisation boundary: the
 * whitelist regex `^team_[a-z0-9_]+$` is what makes the derived identifier injection-safe.
 */
class TeamNamingTest : FunSpec() {
    init {
        test("lowercases and hyphenates a simple name into slug + team_ schema") {
            val names = TeamNaming.derive("Setpoint VT")
            names.name shouldBe "Setpoint VT"
            names.slug shouldBe "setpoint-vt"
            names.schemaName shouldBe "team_setpoint_vt"
        }

        test("collapses runs of non-alphanumeric characters into a single hyphen") {
            TeamNaming.derive("  Ajax   //  Amsterdam!! ").let {
                it.slug shouldBe "ajax-amsterdam"
                it.schemaName shouldBe "team_ajax_amsterdam"
            }
        }

        test("trims leading and trailing separators from the slug") {
            TeamNaming.derive("--Rockets--").slug shouldBe "rockets"
        }

        test("maps accented and non-ascii characters through the separator (never into the identifier)") {
            // é / ü are not [a-z0-9]; they must not leak into the schema identifier.
            TeamNaming.derive("Café Zürich 4").let {
                it.slug shouldBe "caf-z-rich-4"
                it.schemaName shouldBe "team_caf_z_rich_4"
            }
        }

        test("keeps digits and treats a purely numeric name as valid") {
            TeamNaming.derive("2024").let {
                it.slug shouldBe "2024"
                it.schemaName shouldBe "team_2024"
            }
        }

        test("derived schema always matches the injection-safe whitelist") {
            Regex("^team_[a-z0-9_]+$").matches(TeamNaming.derive("A B C 1").schemaName) shouldBe true
        }

        test("rejects a blank name") {
            shouldThrow<InvalidTeamNameException> { TeamNaming.derive("   ") }
        }

        test("rejects a name with no slug-usable characters") {
            shouldThrow<InvalidTeamNameException> { TeamNaming.derive("!!! @#$ %^&") }
        }

        test("rejects a name longer than the 100-char column limit") {
            shouldThrow<InvalidTeamNameException> { TeamNaming.derive("a".repeat(101)) }
        }

        test("rejects a name whose derived schema would exceed 63 bytes (never truncates)") {
            // 60 'a's → schema "team_" + 60 = 65 bytes > 63. Must reject, not silently truncate.
            shouldThrow<InvalidTeamNameException> { TeamNaming.derive("a".repeat(60)) }
        }

        test("accepts a name whose derived schema is exactly at the 63-byte limit") {
            // "team_" (5) + 58 = 63 bytes exactly.
            TeamNaming.derive("a".repeat(58)).schemaName.toByteArray().size shouldBe 63
        }
    }
}
