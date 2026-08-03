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
// so the pre-commit gate (`make yolo test`) is enforced for every contributor.
// The destination is resolved via `git rev-parse --git-path hooks` rather than
// hardcoded to `.git/hooks`: in a linked worktree `.git` is a file pointing at
// the shared common dir, so hooks live elsewhere. git's own answer is correct
// for both a normal checkout and a worktree. Uses the config-cache-safe
// providers.exec API; a missing git binary or non-repo build yields blank
// output and the task skips instead of failing.
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
