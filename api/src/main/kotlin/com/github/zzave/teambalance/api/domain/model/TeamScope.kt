package com.github.zzave.teambalance.api.domain.model

/**
 * Who is asking, and in which Team: the authenticated principal and the Active Team of one request.
 *
 * Carries no Role. A Role is looked up by `AuthorizationService` at the moment of each check, so a
 * scope can never hold a stale or elevated one.
 *
 * SECURITY CONTRACT: in production a scope is constructed only by `RequestScope`, from the
 * session's principal and the Team the request pipeline resolved. Never build one from a request
 * body, path or query. Tests construct it directly.
 */
data class TeamScope(val userId: UserId, val teamId: TeamId)
