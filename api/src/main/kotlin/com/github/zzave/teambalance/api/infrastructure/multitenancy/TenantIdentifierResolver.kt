package com.github.zzave.teambalance.api.infrastructure.multitenancy

import org.hibernate.context.spi.CurrentTenantIdentifierResolver

/**
 * Tells Hibernate which schema the current request's connection should be switched to.
 * Delegates to [TenantContext], which SessionTenantContextFilter populates per-request.
 *
 * When no tenant is resolved we route to [TenantContext.NO_TENANT_SCHEMA] (fail closed) rather than
 * `public`: platform entities are schema-qualified and stay reachable, while any tenant-scoped table
 * access with no resolved tenant fails loudly instead of silently reading/writing the platform schema.
 */
class TenantIdentifierResolver : CurrentTenantIdentifierResolver<String> {
    override fun resolveCurrentTenantIdentifier(): String =
        if (TenantContext.isSet()) TenantContext.get() else TenantContext.NO_TENANT_SCHEMA

    override fun validateExistingCurrentSessions(): Boolean = true
}
