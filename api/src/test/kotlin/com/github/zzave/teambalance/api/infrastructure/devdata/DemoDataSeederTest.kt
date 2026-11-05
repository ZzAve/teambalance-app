package com.github.zzave.teambalance.api.infrastructure.devdata

import com.github.zzave.teambalance.api.domain.model.SchemaName
import com.github.zzave.teambalance.api.domain.port.TenantProvisioningGateway
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import org.springframework.boot.DefaultApplicationArguments
import org.springframework.jdbc.datasource.SimpleDriverDataSource

class DemoDataSeederTest : FunSpec({
    test("seeds nothing unless teambalance.demo-data.enabled is set (prod's default)") {
        val provisioned = mutableListOf<SchemaName>()
        val gateway = object : TenantProvisioningGateway {
            override fun provisionTenant(schemaName: SchemaName) {
                provisioned += schemaName
            }
        }

        DemoDataSeeder(gateway, SimpleDriverDataSource(), enabled = false).run(DefaultApplicationArguments())

        provisioned.shouldBeEmpty()
    }
})
