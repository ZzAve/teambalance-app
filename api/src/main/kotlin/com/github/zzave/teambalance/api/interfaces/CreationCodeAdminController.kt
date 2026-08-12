package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.CreationCodeAdminService
import com.github.zzave.teambalance.api.domain.model.CreationCode as DomainCreationCode
import com.github.zzave.teambalance.api.domain.model.TeamCreationCode
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateCreationCode
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListCreationCodes
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RevokeCreationCode
import com.github.zzave.teambalance.api.interfaces.generated.model.CreationCode
import com.github.zzave.teambalance.api.interfaces.generated.model.CreationCodeList
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

/**
 * Platform-admin CRUD over one-time team-creation codes (#154 Slice 4). Resolves the authenticated
 * caller and delegates to [CreationCodeAdminService]; error responses are mapped from the thrown
 * domain exceptions by [GlobalExceptionHandler].
 */
@RestController
class CreationCodeAdminController(
    private val creationCodeAdminService: CreationCodeAdminService,
    private val currentUserGateway: CurrentUserGateway,
) : ListCreationCodes.Handler,
    CreateCreationCode.Handler,
    RevokeCreationCode.Handler {

    override suspend fun listCreationCodes(request: ListCreationCodes.Request): ListCreationCodes.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        val codes = creationCodeAdminService.list(callerId).map { it.toDto() }
        return ListCreationCodes.Response200(CreationCodeList(codes))
    }

    override suspend fun createCreationCode(request: CreateCreationCode.Request): CreateCreationCode.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        // A malformed expiresAt throws DateTimeParseException → 400 (GlobalExceptionHandler).
        val expiresAt = request.body.expiresAt?.let { Instant.parse(it) }
        val created = creationCodeAdminService.create(callerId, expiresAt)
        return CreateCreationCode.Response201(created.toDto())
    }

    override suspend fun revokeCreationCode(request: RevokeCreationCode.Request): RevokeCreationCode.Response<*> {
        val callerId = currentUserGateway.requireCurrentUserId()
        creationCodeAdminService.revoke(callerId, DomainCreationCode(request.path.code))
        return RevokeCreationCode.Response204(Unit)
    }
}

private fun TeamCreationCode.toDto() = CreationCode(
    code = code.value,
    createdAt = createdAt.toString(),
    expiresAt = expiresAt?.toString(),
    consumedAt = consumedAt?.toString(),
    consumedByUserId = consumedByUserId?.value?.toString(),
    createdTeamId = createdTeamId?.value?.toString(),
)
