package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.SchemaName

/**
 * Creates a team's tenant schema and migrates it to head. Idempotent: provisioning an already-current
 * schema is a no-op, so create-team can retry safely and the startup runner can re-run it every boot.
 *
 * The application layer depends on this port rather than the infrastructure `TenantSchemaAdapter`
 * directly (hexagonal boundary — application must not import infrastructure).
 */
interface TenantProvisioningGateway {
    fun provisionTenant(schemaName: SchemaName)
}
