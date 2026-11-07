package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.PaymentAliasService
import com.github.zzave.teambalance.api.application.PaymentClaimService
import com.github.zzave.teambalance.api.domain.model.PaymentAlias as DomainPaymentAlias
import com.github.zzave.teambalance.api.domain.model.PaymentAliasId
import com.github.zzave.teambalance.api.domain.model.PaymentId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ClaimPayment
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreatePaymentAlias
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DeletePaymentAlias
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListPaymentAliases
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdatePaymentAlias
import com.github.zzave.teambalance.api.interfaces.generated.model.PaymentAlias
import com.github.zzave.teambalance.api.interfaces.generated.model.PaymentAliasList
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

/** Owner-or-Admin rules are enforced in [PaymentAliasService]; a refusal surfaces as 403 via the handler. */
@RestController
class PaymentAliasController(
    private val paymentAliasService: PaymentAliasService,
    private val paymentClaimService: PaymentClaimService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : ListPaymentAliases.Handler,
    CreatePaymentAlias.Handler,
    UpdatePaymentAlias.Handler,
    DeletePaymentAlias.Handler,
    ClaimPayment.Handler {

    override suspend fun listPaymentAliases(request: ListPaymentAliases.Request): ListPaymentAliases.Response<*> =
        ListPaymentAliases.Response200(
            PaymentAliasList(
                paymentAliasService.list(
                    callerId = currentUserGateway.requireCurrentUserId(),
                    teamId = currentTeamGateway.requireCurrentTeamId(),
                    ownerId = request.path.userId.consumeUserId(),
                ).map { it.produce() },
            ),
        )

    override suspend fun createPaymentAlias(request: CreatePaymentAlias.Request): CreatePaymentAlias.Response<*> =
        CreatePaymentAlias.Response201(
            paymentAliasService.create(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                ownerId = request.path.userId.consumeUserId(),
                name = request.body.name,
                iban = request.body.iban,
            ).produce(),
        )

    override suspend fun updatePaymentAlias(request: UpdatePaymentAlias.Request): UpdatePaymentAlias.Response<*> =
        UpdatePaymentAlias.Response200(
            paymentAliasService.update(
                callerId = currentUserGateway.requireCurrentUserId(),
                teamId = currentTeamGateway.requireCurrentTeamId(),
                ownerId = request.path.userId.consumeUserId(),
                id = PaymentAliasId(UUID.fromString(request.path.aliasId)),
                name = request.body.name,
                iban = request.body.iban,
                clearIban = request.body.clearIban ?: false,
            ).produce(),
        )

    // Answers with the masked IBAN only, like every alias response.
    override suspend fun claimPayment(request: ClaimPayment.Request): ClaimPayment.Response<*> {
        val alias = paymentClaimService.claim(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            paymentId = PaymentId(request.path.paymentId),
            targetId = request.body.userId.consumeUserId(),
            useName = request.body.useName,
            useIban = request.body.useIban,
        )
        return ClaimPayment.Response201(alias.produce())
    }

    override suspend fun deletePaymentAlias(request: DeletePaymentAlias.Request): DeletePaymentAlias.Response<*> {
        paymentAliasService.delete(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            ownerId = request.path.userId.consumeUserId(),
            id = PaymentAliasId(UUID.fromString(request.path.aliasId)),
        )
        return DeletePaymentAlias.Response204
    }
}

private fun DomainPaymentAlias.produce() =
    PaymentAlias(id = id.toString(), name = name?.value, ibanMasked = iban?.masked(), hasIban = iban != null)
