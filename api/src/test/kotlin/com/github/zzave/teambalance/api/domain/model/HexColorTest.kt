package com.github.zzave.teambalance.api.domain.model

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/**
 * Pure validation for the one guarded value class of the #207 rollout. The type IS the guard, so
 * holding a [HexColor] anywhere in the domain is proof the value is a renderable CSS colour.
 *
 * The values below are the ones that actually exist: `#249E6C` is seeded by
 * `V002__seed_event_types.sql` (upper case), while the test fixtures use lower case — so the guard
 * has to accept both. Everything wider than six digits is rejected on shape *and* would not fit the
 * `VARCHAR(7)` column.
 */
class HexColorTest : FunSpec({

    test("accepts a six-digit hex triplet in either case") {
        HexColor("#249E6C").value shouldBe "#249E6C"
        HexColor("#abcdef").value shouldBe "#abcdef"
        HexColor("#000000").value shouldBe "#000000"
    }

    test("renders as its bare value, so interpolated diagnostics stay readable") {
        HexColor("#249E6C").toString() shouldBe "#249E6C"
    }

    test("rejects a value without the leading hash") {
        shouldThrow<IllegalArgumentException> { HexColor("249E6C") }
    }

    test("rejects shorthand, alpha and over-long triplets") {
        shouldThrow<IllegalArgumentException> { HexColor("#abc") }
        shouldThrow<IllegalArgumentException> { HexColor("#249E6CFF") }
    }

    test("rejects a non-hex digit and a named colour") {
        shouldThrow<IllegalArgumentException> { HexColor("#24ZZ6C") }
        shouldThrow<IllegalArgumentException> { HexColor("red") }
    }

    test("rejects a blank value") {
        shouldThrow<IllegalArgumentException> { HexColor("") }
        shouldThrow<IllegalArgumentException> { HexColor("   ") }
    }
})
