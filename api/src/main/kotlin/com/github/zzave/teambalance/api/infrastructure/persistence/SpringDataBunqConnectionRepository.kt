package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.infrastructure.persistence.entity.BunqConnectionJpaEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface SpringDataBunqConnectionRepository : JpaRepository<BunqConnectionJpaEntity, Short> {

    // Writes the account column of the row holding this grant and nothing else, so a disconnect or a
    // reconnect that landed since the grant was read is not undone. Returns the rows changed (0 or 1).
    @Modifying(clearAutomatically = true)
    @Query("UPDATE BunqConnectionJpaEntity c SET c.bunqAccountId = :accountId WHERE c.id = :id AND c.accessTokenEncrypted = :grant")
    fun pickAccount(id: Short, accountId: String, grant: String): Int
}
