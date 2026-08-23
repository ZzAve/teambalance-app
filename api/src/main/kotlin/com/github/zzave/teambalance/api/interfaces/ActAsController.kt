package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.ActAsService
import com.github.zzave.teambalance.api.application.AuthorizationService
import com.github.zzave.teambalance.api.application.EnteredActAs
import com.github.zzave.teambalance.api.domain.model.ActAs as DomainActAs
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.EnterActAs
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ExitActAs
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListActAsRecords
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListPlatformTeams
import com.github.zzave.teambalance.api.interfaces.generated.model.ActAs
import com.github.zzave.teambalance.api.interfaces.generated.model.ActAsRecord
import com.github.zzave.teambalance.api.interfaces.generated.model.ActAsRecordList
import com.github.zzave.teambalance.api.interfaces.generated.model.PlatformTeamList
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

/**
 * **Act-as** (ADR-0024): the platform console's team list, entering and leaving a Team, and the
 * team-visible **Act-as Record**.
 *
 * Every gate is delegated — the platform-admin allowlist to [ActAsService], the team-scoped read to
 * [AuthorizationService] — so this controller decides nothing; error responses are mapped from the
 * thrown domain exceptions by [GlobalExceptionHandler].
 */
@RestController
class ActAsController(
    private val actAsService: ActAsService,
    private val authorizationService: AuthorizationService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : ListPlatformTeams.Handler,
    EnterActAs.Handler,
    ExitActAs.Handler,
    ListActAsRecords.Handler {

    override suspend fun listPlatformTeams(request: ListPlatformTeams.Request): ListPlatformTeams.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        return ListPlatformTeams.Response200(PlatformTeamList(actAsService.teamsToEnter(callerId).map { it.produce() }))
    }

    override suspend fun enterActAs(request: EnterActAs.Request): EnterActAs.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        val teamId = TeamId(UUID.fromString(request.body.teamId))
        return EnterActAs.Response200(actAsService.enter(callerId, teamId).produce())
    }

    override suspend fun exitActAs(request: ExitActAs.Request): ExitActAs.Response<*> {
        actAsService.exit(currentUserGateway.requireCurrentUserId())
        return ExitActAs.Response204(Unit)
    }

    /**
     * Readable by any Member of the Active Team — that is what "team-visible" means. A Platform Admin
     * currently inside the team passes the same check through their Virtual Member, so they can read
     * the record they are writing.
     */
    override suspend fun listActAsRecords(request: ListActAsRecords.Request): ListActAsRecords.Response<*> {
        val teamId = currentTeamGateway.requireCurrentTeamId()
        authorizationService.requireMember(currentUserGateway.requireCurrentUserId(), teamId)
        return ListActAsRecords.Response200(ActAsRecordList(actAsService.recordsFor(teamId).map { it.produce() }))
    }
}

// The Wirespec edge for act-as. `expiresAt` is the only part of the grant the caller needs: it drives
// nothing on the client but tells the operator how long they have.
internal fun EnteredActAs.produce() = ActAs(team = team.produce(), expiresAt = actAs.expiresAt.toString())

// The team-visible projection. Deliberately no user id and no email: the actor is the platform, and
// resolving a name would fail anyway — findMemberSummariesByUserIds joins team_members, and a
// Platform Admin is a Member of nothing (ADR-0024 §3, §4). `created_by` keeps the truth underneath.
private fun DomainActAs.produce() = ActAsRecord(
    actorKind = actorKind.name,
    enteredAt = enteredAt.toString(),
    lastActiveAt = lastActiveAt.toString(),
    exitedAt = exitedAt?.toString(),
)
