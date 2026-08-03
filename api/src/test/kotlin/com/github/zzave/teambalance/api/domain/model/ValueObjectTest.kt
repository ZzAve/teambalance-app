package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import java.util.UUID

/**
 * The contract shared by every value object rolled out in #23, following the one [EventIdTest] pins
 * for the tracer. Wrapping, unwrapping and equality come free from `@JvmInline`; what does not is
 * the [toString] override, which a future edit could delete without breaking compilation, and the
 * `random()` factory. Both are pinned here once for all of them rather than in a spec per type.
 *
 * The edges themselves — request -> VO -> persistence -> VO -> response, with the wire format and
 * the database column unchanged — are proven by the existing controller ITs, which this refactor
 * leaves untouched.
 */
class ValueObjectTest : FunSpec({

    test("a value object renders as its bare value, so interpolated diagnostics stay readable") {
        val uuid = UUID.randomUUID()

        AttendanceId(uuid).toString() shouldBe uuid.toString()
        EventTypeId(uuid).toString() shouldBe uuid.toString()
    }

    test("an identifier factory mints a fresh identity for a row that does not exist yet") {
        AttendanceId.random() shouldNotBe AttendanceId.random()
    }
})
