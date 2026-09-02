package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.DisplayName
import com.github.zzave.teambalance.api.domain.model.Email
import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.model.Slug
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.TenantRouting
import com.github.zzave.teambalance.api.domain.model.User
import com.github.zzave.teambalance.api.domain.model.UserId
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import java.util.UUID

class ActiveTeamServiceTest : FunSpec() {
    init {
        val member = UserId.random()
        val memberUser = User(id = member, email = Email("member@example.com"), displayName = DisplayName("Member"))

        fun fixture(): Triple<TeamDirectory, RecordingTenantRoutingGateway, ActiveTeamService> {
            val directory = TeamDirectory()
            val gateway = RecordingTenantRoutingGateway()
            return Triple(directory, gateway, directory.activeTeamService(gateway, memberUser))
        }

        context("resolving where a caller lands with no Team named") {
            test("a sole membership is the landing Team, without anything remembered") {
                val (directory, _, service) = fixture()
                val setpoint = directory.addTeam("Setpoint VT", "setpoint-vt")
                directory.join(member, setpoint)

                service.resolveLanding(member)?.teamId shouldBe setpoint
            }

            test("a teamless caller lands nowhere - no silent default tenant") {
                val (_, _, service) = fixture()

                service.resolveLanding(member).shouldBeNull()
            }

            test("two memberships and nothing remembered resolve to nothing, never an arbitrary pick") {
                val (directory, _, service) = fixture()
                directory.join(member, directory.addTeam("Setpoint VT", "setpoint-vt"))
                directory.join(member, directory.addTeam("Tovo Heren 5", "tovo-heren-5"))

                service.resolveLanding(member).shouldBeNull()
            }

            test("the remembered Team wins over the other memberships") {
                val (directory, gateway, service) = fixture()
                val setpoint = directory.addTeam("Setpoint VT", "setpoint-vt")
                val tovo = directory.addTeam("Tovo Heren 5", "tovo-heren-5")
                directory.join(member, setpoint)
                directory.join(member, tovo)
                directory.activeTeamService(gateway, memberUser).activate(member, tovo)

                service.resolveLanding(member)?.teamId shouldBe tovo
            }

            // Sessions slide for four weeks (ADR-0015), long enough to outlive the membership.
            test("a remembered Team whose membership was revoked is not trusted") {
                val (directory, gateway, service) = fixture()
                val setpoint = directory.addTeam("Setpoint VT", "setpoint-vt")
                val tovo = directory.addTeam("Tovo Heren 5", "tovo-heren-5")
                directory.join(member, setpoint)
                directory.join(member, tovo)
                service.activate(member, tovo)
                gateway.writes.clear()

                directory.leave(member, tovo)

                // Not a fallback: with the remembered Team gone, a sole membership is defensible.
                service.resolveLanding(member)?.teamId shouldBe setpoint
            }

            test("a revoked remembered Team with several left standing forces a choice again") {
                val (directory, _, service) = fixture()
                val a = directory.addTeam("Alpha", "alpha")
                val b = directory.addTeam("Bravo", "bravo")
                val c = directory.addTeam("Charlie", "charlie")
                listOf(a, b, c).forEach { directory.join(member, it) }
                service.activate(member, c)
                directory.leave(member, c)

                service.resolveLanding(member).shouldBeNull()
            }
        }

        context("switching") {
            test("activating a Team the caller is a Member of remembers it and re-pins the routing") {
                val (directory, gateway, service) = fixture()
                val setpoint = directory.addTeam("Setpoint VT", "setpoint-vt")
                val tovo = directory.addTeam("Tovo Heren 5", "tovo-heren-5")
                directory.join(member, setpoint)
                directory.join(member, tovo)

                service.activate(member, tovo).shouldNotBeNull().teamId shouldBe tovo

                directory.rememberedTeamOf(member) shouldBe tovo
                gateway.lastPinned.shouldNotBeNull().schemaName shouldBe directory.schemaOf(tovo)
            }

            test("every switch re-pins, so the memo can never be left holding the previous tenant") {
                val (directory, gateway, service) = fixture()
                val setpoint = directory.addTeam("Setpoint VT", "setpoint-vt")
                val tovo = directory.addTeam("Tovo Heren 5", "tovo-heren-5")
                directory.join(member, setpoint)
                directory.join(member, tovo)

                service.activate(member, setpoint)
                service.activate(member, tovo)
                service.activate(member, setpoint)

                gateway.pins.map { it.teamId } shouldContainExactly listOf(setpoint, tovo, setpoint)
            }

            test("activating a Team the caller is NOT a Member of changes nothing") {
                val (directory, gateway, service) = fixture()
                val mine = directory.addTeam("Setpoint VT", "setpoint-vt")
                val theirs = directory.addTeam("Someone Else", "someone-else")
                directory.join(member, mine)
                service.activate(member, mine)
                gateway.writes.clear()

                service.activate(member, theirs).shouldBeNull()

                gateway.pins.shouldBeEmpty()
                directory.rememberedTeamOf(member) shouldBe mine
            }

            test("a Team that does not exist at all is refused the same way") {
                val (directory, _, service) = fixture()
                directory.join(member, directory.addTeam("Setpoint VT", "setpoint-vt"))

                service.activate(member, TeamId(UUID.randomUUID())).shouldBeNull()
            }
        }

        context("switching by slug - what a shared /t/:slug link performs") {
            test("a slug the caller is entitled to switches and hands back the Team") {
                val (directory, gateway, service) = fixture()
                val tovo = directory.addTeam("Tovo Heren 5", "tovo-heren-5")
                directory.join(member, tovo)

                service.activateBySlug(member, Slug("tovo-heren-5")).shouldNotBeNull().id shouldBe tovo
                gateway.lastPinned.shouldNotBeNull().teamId shouldBe tovo
            }

            test("a real slug the caller may not have, and an unknown slug, are both just null") {
                val (directory, _, service) = fixture()
                directory.join(member, directory.addTeam("Setpoint VT", "setpoint-vt"))
                directory.addTeam("Someone Else", "someone-else")

                service.activateBySlug(member, Slug("someone-else")).shouldBeNull()
                service.activateBySlug(member, Slug("no-such-team")).shouldBeNull()
            }
        }

        context("listing the caller's Teams") {
            test("lists every active membership by name") {
                val (directory, _, service) = fixture()
                directory.join(member, directory.addTeam("Tovo Heren 5", "tovo-heren-5"))
                directory.join(member, directory.addTeam("Setpoint VT", "setpoint-vt"))

                service.teamsOf(member).map { it.name.value } shouldContainExactly
                    listOf("Setpoint VT", "Tovo Heren 5")
            }

            test("a teamless caller has no Teams") {
                val (_, _, service) = fixture()

                service.teamsOf(member).shouldBeEmpty()
            }
        }

        context("pinning at sign-in") {
            test("pins the landing Team and reports it") {
                val (directory, gateway, service) = fixture()
                val setpoint = directory.addTeam("Setpoint VT", "setpoint-vt")
                directory.join(member, setpoint)

                service.pinLanding(member) shouldBe setpoint
                gateway.lastPinned.shouldNotBeNull().teamId shouldBe setpoint
            }

            test("pins nothing for a caller with several Teams and none remembered") {
                val (directory, gateway, service) = fixture()
                directory.join(member, directory.addTeam("Alpha", "alpha"))
                directory.join(member, directory.addTeam("Bravo", "bravo"))

                service.pinLanding(member).shouldBeNull()
                gateway.pins.shouldBeEmpty()
            }

            // A shared phone, or a second magic link in the same browser: the pin is conditional,
            // the clear is not, or the new caller inherits the previous caller's tenant.
            test("clears any routing already on the session, even when it pins nothing after") {
                val (directory, gateway, service) = fixture()
                directory.join(member, directory.addTeam("Alpha", "alpha"))
                directory.join(member, directory.addTeam("Bravo", "bravo"))
                gateway.pinRouting(
                    TenantRouting(teamId = TeamId(UUID.randomUUID()), schemaName = SchemaName("team_someone_else")),
                )

                service.pinLanding(member).shouldBeNull()

                gateway.pinned.shouldBeNull()
            }

            test("clears before it pins, so a sole membership still lands correctly") {
                val (directory, gateway, service) = fixture()
                val alpha = directory.addTeam("Alpha", "alpha")
                directory.join(member, alpha)
                gateway.pinRouting(
                    TenantRouting(teamId = TeamId(UUID.randomUUID()), schemaName = SchemaName("team_someone_else")),
                )

                service.pinLanding(member) shouldBe alpha

                gateway.pinned.shouldNotBeNull().teamId shouldBe alpha
            }
        }
    }
}
