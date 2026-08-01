plugins {
    kotlin("jvm") version "2.3.0" apply false
    kotlin("plugin.spring") version "2.3.0" apply false
    kotlin("plugin.jpa") version "2.3.0" apply false
    id("org.springframework.boot") version "4.0.4" apply false
    id("io.spring.dependency-management") version "1.1.7" apply false
    id("community.flock.wirespec.plugin.gradle") version "0.19.6" apply false
    id("dev.detekt") version "2.0.0-alpha.5" apply false
}

allprojects {
    group = "app.teambalance"
    version = "0.1.0-SNAPSHOT"

    repositories {
        mavenCentral()
    }
}

// Installs the committed git hooks (.githooks) into .git/hooks so the
// pre-commit gate (`make format test e2e`) is enforced for every contributor.
val installGitHooks by tasks.registering(Copy::class) {
    description = "Installs git hooks from .githooks into .git/hooks"
    group = "git hooks"
    from(layout.projectDirectory.dir(".githooks"))
    into(layout.projectDirectory.dir(".git/hooks"))
    filePermissions { unix("0755") }
}

// Auto-install whenever anything is built, mirroring husky's `prepare` step.
subprojects {
    tasks.matching { it.name == "build" }.configureEach { dependsOn(installGitHooks) }
}
