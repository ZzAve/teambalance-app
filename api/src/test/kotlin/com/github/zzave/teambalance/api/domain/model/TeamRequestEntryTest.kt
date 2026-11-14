package com.github.zzave.teambalance.api.domain.model

import com.github.zzave.teambalance.api.domain.exception.InvalidTeamRequestTextException
import com.github.zzave.teambalance.api.domain.exception.InvalidTeamNameException
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.util.UUID

class TeamRequestEntryTest : FunSpec() {
    init {
        test("purpose is trimmed") {
            TeamRequestPurpose("  Volleyball  ").value shouldBe "Volleyball"
        }

        test("a blank purpose is rejected with INVALID_PURPOSE") {
            shouldThrow<InvalidTeamRequestTextException> { TeamRequestPurpose("   ") }.code shouldBe
                "INVALID_PURPOSE"
        }

        test("a purpose of 1000 characters is accepted, 1001 is rejected") {
            TeamRequestPurpose("a".repeat(1000)).value.length shouldBe 1000
            shouldThrow<InvalidTeamRequestTextException> { TeamRequestPurpose("a".repeat(1001)) }
        }

        test("a blank or missing reason is no reason, a long one is rejected with INVALID_REASON") {
            TeamRequestReason.ofOrNull(null) shouldBe null
            TeamRequestReason.ofOrNull("  ") shouldBe null
            TeamRequestReason.ofOrNull(" too busy ")?.value shouldBe "too busy"
            TeamRequestReason.ofOrNull("a".repeat(500))?.value?.length shouldBe 500
            shouldThrow<InvalidTeamRequestTextException> { TeamRequestReason.ofOrNull("a".repeat(501)) }.code shouldBe
                "INVALID_REASON"
        }

        test("the team name follows the TeamNaming rules") {
            TeamNaming.validatedName("  Spikers ").value shouldBe "Spikers"
            shouldThrow<InvalidTeamNameException> { TeamNaming.validatedName("  ") }
            shouldThrow<InvalidTeamNameException> { TeamNaming.validatedName("a".repeat(101)) }
        }

        test("the code is usable only while unconsumed and unexpired") {
            val now = Instant.parse("2026-01-10T00:00:00Z")
            fun request(code: TeamCreationCode?) = TeamRequestEntry(
                id = UUID.randomUUID(),
                requesterId = UserId.random(),
                requesterEmail = Email("a@b.nl"),
                teamName = TeamName("T"),
                purpose = TeamRequestPurpose("p"),
                status = TeamRequestStatus.APPROVED,
                rejectReason = null,
                requestedAt = now,
                decidedAt = now,
                creationCode = code,
            )
            fun code(expiresAt: Instant?, consumedAt: Instant? = null) =
                TeamCreationCode(CreationCode("X"), now, expiresAt, consumedAt, null, null)

            request(code(now.plusSeconds(1))).usableCode(now) shouldBe CreationCode("X")
            request(code(now)).usableCode(now) shouldBe null
            request(code(now.plusSeconds(1), consumedAt = now)).usableCode(now) shouldBe null
            request(null).usableCode(now) shouldBe null
        }
    }
}
