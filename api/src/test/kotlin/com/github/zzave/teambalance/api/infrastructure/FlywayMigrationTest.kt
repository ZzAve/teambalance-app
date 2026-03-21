package com.github.zzave.teambalance.api.infrastructure

import com.github.zzave.teambalance.api.TeamBalanceIT

class FlywayMigrationTest : TeamBalanceIT() {

    init {
        test("flyway migrations run successfully") {
            // If we get here, Spring Boot started and Flyway ran all migrations
        }
    }
}
