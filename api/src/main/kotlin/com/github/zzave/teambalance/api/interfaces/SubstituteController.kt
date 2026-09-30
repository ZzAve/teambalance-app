package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.SubstituteService
import com.github.zzave.teambalance.api.domain.model.AttendanceState
import com.github.zzave.teambalance.api.domain.model.PositionId
import com.github.zzave.teambalance.api.domain.model.PositionLabel
import com.github.zzave.teambalance.api.domain.model.Substitute
import com.github.zzave.teambalance.api.domain.model.SubstituteAttendance
import com.github.zzave.teambalance.api.domain.model.SubstituteId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateSubstitute
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.SetSubstituteAttendance
import com.github.zzave.teambalance.api.interfaces.generated.model.DateTimestampWithTimezone
import com.github.zzave.teambalance.api.interfaces.generated.model.MemberPosition
import com.github.zzave.teambalance.api.interfaces.generated.model.SubstituteEntry
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import com.github.zzave.teambalance.api.interfaces.generated.model.Substitute as SubstituteDto

@RestController
class SubstituteController(
    private val substituteService: SubstituteService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : CreateSubstitute.Handler,
    SetSubstituteAttendance.Handler {

    override suspend fun createSubstitute(request: CreateSubstitute.Request): CreateSubstitute.Response<*> {
        val created = substituteService.createSubstitute(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            rawName = request.body.name,
            positionId = request.body.positionId?.consumePositionId(),
        )
        return CreateSubstitute.Response201(created.produce())
    }

    override suspend fun setSubstituteAttendance(
        request: SetSubstituteAttendance.Request,
    ): SetSubstituteAttendance.Response<*> {
        val attendance = substituteService.setAttendance(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            eventId = request.path.eventId.consumeEventId(),
            substituteId = request.path.substituteId.consumeSubstituteId(),
            state = AttendanceState.valueOf(request.body.state.name),
        )
        return SetSubstituteAttendance.Response200(attendance.produce())
    }
}

private fun String.consumeSubstituteId(): SubstituteId = SubstituteId(UUID.fromString(this))

private fun Substitute.produce() = SubstituteDto(
    id = id.value.toString(),
    name = name.value,
    position = positionReference(positionId, position),
)

// internal: EventController's event payloads embed these entries.
internal fun SubstituteAttendance.produce() = SubstituteEntry(
    substituteId = substitute.id.value.toString(),
    name = substitute.name.value,
    position = positionReference(substitute.positionId, substitute.position),
    state = state.produce(),
    changedBy = changedBy.produce(),
    updatedAt = DateTimestampWithTimezone(updatedAt.toString()),
)

private fun positionReference(id: PositionId?, label: PositionLabel?) =
    id?.let { MemberPosition(id = it.produce(), label = label?.value ?: "") }
