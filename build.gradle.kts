plugins {
    kotlin("jvm") version "2.4.10" apply false
    kotlin("plugin.spring") version "2.4.10" apply false
    kotlin("plugin.jpa") version "2.4.10" apply false
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

// Installs the committed git hooks (.githooks) into the repository's hooks dir
// so the pre-commit gate is enforced for every contributor. The destination is 
// resolved via `git rev-parse --git-path hooks` rather than
// hardcoded to `.git/hooks` to support worktrees
val resolvedHooksDir: String = providers.exec {
    isIgnoreExitValue = true
    workingDir = layout.projectDirectory.asFile
    commandLine("git", "rev-parse", "--git-path", "hooks")
}.standardOutput.asText.get().trim()

// Blank output means no git binary or not a git repo (e.g. a source archive
// build): skip wiring the task entirely rather than fabricating a `.git` dir.
if (resolvedHooksDir.isNotBlank()) {
    val installGitHooks by tasks.registering(Copy::class) {
        description = "Installs git hooks from .githooks into the git-resolved hooks dir"
        group = "git hooks"
        from(layout.projectDirectory.dir(".githooks"))
        into(resolvedHooksDir)
        filePermissions { unix("0755") }
    }

    // Auto-install whenever anything is built, mirroring husky's `prepare` step.
    subprojects {
        tasks.matching { it.name == "build" }.configureEach { dependsOn(installGitHooks) }
    }
}
