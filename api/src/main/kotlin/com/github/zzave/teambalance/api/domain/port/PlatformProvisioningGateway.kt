package com.github.zzave.teambalance.api.domain.port

/** Migrates the platform (`public`) schema to head. The demo reset runs it on the schema it has just recreated. */
interface PlatformProvisioningGateway {
    fun provisionPlatformSchema()
}
