package com.github.zzave.teambalance.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TeamBalanceApplication

fun main(args: Array<String>) {
    runApplication<TeamBalanceApplication>(*args)
}
