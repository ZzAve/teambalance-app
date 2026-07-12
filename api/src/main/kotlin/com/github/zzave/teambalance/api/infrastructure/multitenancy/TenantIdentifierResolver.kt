package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.hibernate.context.spi.CurrentTenantIdentifierResolver

/**
 * Tells Hibernate which schema the current request's connection should be switched to.
 * Delegates to [TenantContext], which SessionTenantContextFilter populates per-request.
 */
class TenantIdentifierResolver : CurrentTenantIdentifierResolver<String> {
    override fun resolveCurrentTenantIdentifier(): String = TenantContext.get()

    override fun validateExistingCurrentSessions(): Boolean = true
}
