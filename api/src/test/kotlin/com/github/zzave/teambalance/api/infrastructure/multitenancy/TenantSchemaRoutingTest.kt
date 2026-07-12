package com.github.zzave.teambalance.api.infrastructure.multitenancy

import com.github.zzave.teambalance.api.TeamBalanceIT
import com.github.zzave.teambalance.api.infrastructure.persistence.SpringDataEventTypeRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.EventTypeJpaEntity
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldNotContain
import org.springframework.beans.factory.annotation.Autowired
import java.time.Instant
import java.util.UUID

class TenantSchemaRoutingTest : TeamBalanceIT() {

    @Autowired
    lateinit var tenantSchemaManager: TenantSchemaManager

    @Autowired
    lateinit var eventTypeRepository: SpringDataEventTypeRepository

    init {
        test("JPA writes land in the tenant schema resolved from TenantContext and are isolated per schema") {
            tenantSchemaManager.provisionTenantSchema("team_alpha")
            tenantSchemaManager.provisionTenantSchema("team_beta")

            val alphaOnlyName = "Alpha-only-${UUID.randomUUID()}"

            withTenant("team_alpha") {
                eventTypeRepository.save(
                    EventTypeJpaEntity(uuid = UUID.randomUUID(), name = alphaOnlyName, color = "#fff", createdAt = Instant.now()),
                )
            }

            withTenant("team_beta") {
                eventTypeRepository.findAll().map { it.name }
            } shouldNotContain alphaOnlyName

            withTenant("team_alpha") {
                eventTypeRepository.findAll().map { it.name }
            } shouldContain alphaOnlyName
        }
    }

    private fun <T> withTenant(schema: String, block: () -> T): T {
        TenantContext.set(schema)
        try {
            return block()
        } finally {
            TenantContext.clear()
        }
    }
}
