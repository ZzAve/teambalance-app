package com.github.zzave.teambalance.api.infrastructure.identity

import com.github.zzave.teambalance.api.TeamBalanceIT
import io.kotest.matchers.collections.shouldBeEmpty
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.session.web.http.SessionRepositoryFilter

/**
 * ADR-0010: 1.0 uses the servlet container's in-memory HttpSession (JSESSIONID); Redis-backed
 * Spring Session is deferred. `spring-session-data-redis` is on the classpath (Phase-5 infra),
 * but Boot 4's session auto-configuration module is not, so no Spring Session store is wired.
 *
 * This guards that: if a future change pulls in `spring-boot-session`, a SessionRepositoryFilter
 * would appear and the app would silently start requiring Redis in prod. Fail here instead.
 */
class SessionStoreWiringIT : TeamBalanceIT() {

    @Autowired
    lateinit var applicationContext: ApplicationContext

    init {
        test("no Spring Session repository filter is wired — sessions are servlet HttpSession") {
            applicationContext.getBeanNamesForType(SessionRepositoryFilter::class.java).toList()
                .shouldBeEmpty()
        }
    }
}
