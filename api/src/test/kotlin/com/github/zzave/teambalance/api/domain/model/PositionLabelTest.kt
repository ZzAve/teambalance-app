package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/**
 * The 50-character cap used to live in `PositionService.validLabel`, so it only applied to labels
 * arriving through create/rename. Moving it onto the type makes it hold for every label in
 * existence — including one built by the JPA mapper or a fixture — which is what these tests pin.
 *
 * The blank cases are the deliberate *non*-guard: a blank label is rejected by the service (the
 * write path), not by the type, because V003 backfilled labels from the merely-NOT-NULL `team_role`
 * column and a type-level guard would turn reading such a row into a 500 rather than a 400.
 */
class PositionLabelTest : FunSpec({

    test("accepts a label up to the cap, built directly") {
        PositionLabel("Setter").value shouldBe "Setter"
        PositionLabel("a".repeat(PositionLabel.MAX_LENGTH)).value.length shouldBe PositionLabel.MAX_LENGTH
    }

    test("renders as its bare value, so interpolated diagnostics stay readable") {
        PositionLabel("Libero").toString() shouldBe "Libero"
    }

    test("rejects a label over the cap however it is built") {
        shouldThrow<IllegalArgumentException> { PositionLabel("a".repeat(PositionLabel.MAX_LENGTH + 1)) }
    }

    test("accepts a blank label, which only a legacy row can be") {
        PositionLabel("").value shouldBe ""
    }
})
