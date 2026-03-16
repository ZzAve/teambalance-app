package app.teambalance

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TeamBalanceApplication

fun main(args: Array<String>) {
    runApplication<TeamBalanceApplication>(*args)
}
