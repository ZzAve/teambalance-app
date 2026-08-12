package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldNotContain

/**
 * A creation code is the one value in the rollout that is a *credential* rather than a display
 * string, so these tests pin the two decisions that follow from that: [CreationCode.toString] masks,
 * and construction does not validate.
 */
class CreationCodeTest : FunSpec() {
    init {
        // The masking is the point of the type: a creation code is a bearer credential, so anyone who
        // reads it in a log line can create a team with it. [value] is the deliberate reach-through.
        test("toString masks the code so it cannot leak into a log line or a stack trace") {
            val code = CreationCode("K7QM-9FX4-P2HR")

            code.toString() shouldBe "CreationCode(****)"
            "code=$code" shouldNotContain "K7QM"
            code.value shouldBe "K7QM-9FX4-P2HR"
        }

        // Deliberately unguarded — see the KDoc. Codes arrive verbatim from the founder and are matched
        // as-is in SQL; the e2e seed's 'E2E-CREATE-TEAM' has neither the minted shape nor its groups,
        // and a construction-time guard would reject a row the database happily stores.
        test("accepts any string, including seeded codes that do not match the minted shape") {
            CreationCode("E2E-CREATE-TEAM").value shouldBe "E2E-CREATE-TEAM"
            CreationCode("").value shouldBe ""
        }
    }
}
