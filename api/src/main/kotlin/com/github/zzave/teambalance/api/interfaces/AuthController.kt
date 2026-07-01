package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.AuthService
import com.github.zzave.teambalance.api.infrastructure.identity.SessionKeys
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RequestMagicLink
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.VerifyMagicLink
import com.github.zzave.teambalance.api.interfaces.generated.model.AuthenticatedUser
import jakarta.servlet.http.HttpServletRequest
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val authService: AuthService,
    private val httpServletRequest: HttpServletRequest,
) : RequestMagicLink.Handler,
    VerifyMagicLink.Handler {

    override suspend fun requestMagicLink(request: RequestMagicLink.Request): RequestMagicLink.Response<*> {
        authService.requestMagicLink(request.body.email)
        return RequestMagicLink.Response202(Unit)
    }

    override suspend fun verifyMagicLink(request: VerifyMagicLink.Request): VerifyMagicLink.Response<*> {
        val user = authService.verifyMagicLink(request.body.token) ?: return VerifyMagicLink.Response401(Unit)
        httpServletRequest.session.setAttribute(SessionKeys.USER_ID, user.id.toString())
        return VerifyMagicLink.Response200(
            AuthenticatedUser(id = user.id.toString(), email = user.email, displayName = user.displayName),
        )
    }
}
