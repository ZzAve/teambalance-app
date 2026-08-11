package com.github.zzave.teambalance.api.domain.model

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

class PlatformAdminAllowlistTest : FunSpec({

    test("matching is whitespace-trimmed and case-insensitive on both sides") {
        val allowlist = PlatformAdminAllowlist(listOf(" Admin@TeamBalance.NL "))

        allowlist.contains("admin@teambalance.nl") shouldBe true
        allowlist.contains("  ADMIN@teambalance.NL ") shouldBe true
    }

    test("an empty allowlist admits nobody — fail-closed default") {
        PlatformAdminAllowlist(emptyList()).contains("admin@teambalance.nl") shouldBe false
    }

    test("blank entries are dropped, so a trailing comma cannot admit a blank email") {
        val allowlist = PlatformAdminAllowlist(listOf("admin@teambalance.nl", "", "   "))

        allowlist.contains("") shouldBe false
        allowlist.contains("   ") shouldBe false
        allowlist.all() shouldBe setOf("admin@teambalance.nl")
    }

    test("all() exposes the normalised, de-duplicated recipients") {
        PlatformAdminAllowlist(listOf("A@b.nl", "a@B.nl", "c@d.nl")).all() shouldBe setOf("a@b.nl", "c@d.nl")
    }
})
