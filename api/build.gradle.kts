import community.flock.wirespec.integration.spring.kotlin.emit.SpringKotlinEmitter
import community.flock.wirespec.plugin.gradle.CompileWirespecTask
import community.flock.wirespec.plugin.Language
import org.springframework.boot.gradle.tasks.aot.ProcessAot
import org.springframework.boot.gradle.tasks.run.BootRun

val wirespecVersion: String by project
val testcontainersVersion: String by project
val archunitVersion: String by project
val flockDetektVersion: String by project

plugins {
    kotlin("jvm")
    kotlin("plugin.spring")
    kotlin("plugin.jpa")
    id("org.springframework.boot")
    // Spring AOT on the JVM (NOT native image): registers the `aot` source set + `processAot`
    // task and makes `bootJar` package the AOT-generated bean definitions. The artifact still
    // runs with `java -jar`; AOT is switched on at runtime via `-Dspring.aot.enabled=true`
    // (see api/Dockerfile). Startup-time optimization Phase 2.
    id("org.springframework.boot.aot")
    id("io.spring.dependency-management")
    id("community.flock.wirespec.plugin.gradle")
    id("dev.detekt")
}

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    // RestClient auto-configuration (the RestClient.Builder bean + spring.http.client.* timeouts).
    // Boot 4 split this out of starter-web; the prod ScalewayTemEmailSender needs the builder bean.
    implementation("org.springframework.boot:spring-boot-restclient")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Spring Session backed by JDBC (Postgres): keeps authenticated sessions out of the JVM heap so
    // they survive a container restart / cold start / redeploy on Scaleway Serverless (min-instances=0).
    // Boot 4 moved session auto-configuration out of spring-boot-autoconfigure into a dedicated module,
    // so the raw spring-session-jdbc lib is NOT auto-wired — this starter pulls the lib *and* the
    // spring-boot-session-jdbc auto-config that registers the session repository filter.
    implementation("org.springframework.boot:spring-boot-starter-session-jdbc")

    // Flyway
    api("org.flywaydb:flyway-core")
    api("org.flywaydb:flyway-database-postgresql")

    // Database
    runtimeOnly("org.postgresql:postgresql")

    // Kotlin
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

    // Caching
    implementation("com.github.ben-manes.caffeine:caffeine")

    // Wirespec runtime
    implementation("community.flock.wirespec.integration:spring-jvm:$wirespecVersion")
    // Wirespec 0.19's Spring integration uses Jackson 3; Spring Boot ships Jackson 3
    // databind but not its Kotlin module, which WirespecJackson3Configuration requires.
    implementation("tools.jackson.module:jackson-module-kotlin")

    // Testing — Kotest
    val kotestVersion: String by project
    val kotestSpringExtensionVersion: String by project
    testImplementation("io.kotest:kotest-runner-junit5:$kotestVersion")
    testImplementation("io.kotest:kotest-assertions-core:$kotestVersion")
    testImplementation("io.kotest.extensions:kotest-extensions-spring:$kotestSpringExtensionVersion")

    // Testing — Spring + Testcontainers
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation(platform("org.testcontainers:testcontainers-bom:$testcontainersVersion"))
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:testcontainers")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")

    // Testing — ArchUnit
    testImplementation("com.tngtech.archunit:archunit-junit5:$archunitVersion")

    // flock-detekt hexagonal-architecture rulesets (issue #18)
    detektPlugins("community.flock:hexagonal-detekt-rules:$flockDetektVersion")
}

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ TEMPORARY alpha.1 bridge — remove as a unit when flock-detekt ships a build │
// │ compiled against detekt 2.0.0-alpha.2+. See ADR-0018.                       │
// │                                                                             │
// │ flock-detekt 1.1.0 is compiled against detekt 2.0.0-alpha.1 and references  │
// │ dev.detekt.api.RuleSet$Id, which alpha.2 removed — so on alpha.2 its rules  │
// │ fail to load (NoClassDefFoundError). We therefore pin the detekt PLUGIN to  │
// │ alpha.1 (root build.gradle.kts) and bridge the two resulting frictions:     │
// │                                                                             │
// │ 1. io.spring.dependency-management force-aligns every kotlin-* artifact —    │
// │    including kotlin-compiler-embeddable on detekt's own isolated runtime     │
// │    classpath — to the project's Kotlin 2.3.0, so detekt aborts with          │
// │    "compiled with Kotlin 2.2.20 but currently running with 2.3.0". Pin       │
// │    detekt's OWN classpath back to detekt's supported Kotlin; the project     │
// │    itself stays on 2.3.0. (https://detekt.dev/docs/gettingstarted/gradle)    │
// │ 2. detekt's pinned 2.2.20 compiler only accepts JVM targets up to 24, but    │
// │    this module's toolchain is Java 25. detekt only parses sources, so cap    │
// │    the analysis JVM target at the highest value it accepts.                  │
// │                                                                             │
// │ To migrate: bump the plugin to alpha.2 + flockDetektVersion to the new       │
// │ release, then delete this whole block. detekt.yml stays unchanged.          │
// └───────────────────────────────────────────────────────────────────────────┘
configurations.matching { it.name == "detekt" }.all {
    resolutionStrategy.eachDependency {
        if (requested.group == "org.jetbrains.kotlin") {
            useVersion(dev.detekt.gradle.plugin.getSupportedKotlinVersion())
        }
    }
}
tasks.withType<dev.detekt.gradle.Detekt>().configureEach {
    jvmTarget = "24"
}
tasks.withType<dev.detekt.gradle.DetektCreateBaselineTask>().configureEach {
    jvmTarget = "24"
}

java {
    toolchain {
        val javaVersion: String by project
        languageVersion = JavaLanguageVersion.of(javaVersion)
    }
}
kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// Spring AOT bean-definition generation must see the SAME bean set that prod runs with, because
// AOT freezes the profile-conditional bean graph at build time. Prod activates the @Profile("prod")
// `ScalewayTemEmailSender` (and drops the dev/test ConsoleEmailSender); without the prod profile
// active here, that bean definition would simply not be generated and prod boot would have no
// EmailSender. So we run `processAot` under `spring.profiles.active=prod`.
//
// This is safe without prod secrets or a live DB: AOT runs `refreshForAotProcessing`, which only
// prepares/inspects bean *definitions* and evaluates auto-config conditions. It does NOT instantiate
// singletons, so it never resolves the @Value secrets (INVITATION_TOKEN_SALT, SCALEWAY_TEM_*),
// builds the RestClient, opens Hikari, or runs Flyway. `processAot` is a JavaExec task, so the
// profile is passed as an ordinary system property.
tasks.named<ProcessAot>("processAot") {
    systemProperty("spring.profiles.active", "prod")
}

// Applying the AOT plugin puts the `aot` source-set output on the main runtime classpath, which
// drags `processAot` (a prod-profile run) into `bootRun`'s task graph — so every local `make api`
// would pay AOT processing even though bootRun launches the plain (non-AOT) main classes under the
// dev profile. AOT is purely a packaging concern for us (bootJar → prod container), so strip the
// AOT output from the dev-run classpath to keep the inner loop fast and unmistakably non-AOT.
tasks.named<BootRun>("bootRun") {
    // Rebuild the run classpath from just the plain main output + resolved runtime dependencies.
    // (main.runtimeClasspath carries a task dependency on `processAot`, and FileCollection.minus
    // would keep that `builtBy` edge — so we reconstruct instead of subtract.)
    classpath = files(sourceSets.main.get().output, configurations.named("runtimeClasspath"))
}

detekt {
    buildUponDefaultConfig = true
    config.setFrom(files("$projectDir/detekt.yml"))
    // Existing hexagonal-rule violations are captured here so the build stays green while
    // the refactor sub-issues (#19-#23) burn them down. New violations still fail the build.
    baseline = file("$projectDir/detekt-baseline.xml")
}

// Enforce the hexagonal rules on production sources only. Test code legitimately wires
// adapters across layers (this mirrors ArchUnit's DoNotIncludeTests), and the generated
// Wirespec sources under build/ are contract code we never hand-edit — analysing either
// would only produce noise. Applied to both the check and the baseline-creation tasks so
// their file sets stay identical.
tasks.withType<dev.detekt.gradle.Detekt>().configureEach {
    setSource(files("src/main/kotlin"))
}
tasks.withType<dev.detekt.gradle.DetektCreateBaselineTask>().configureEach {
    setSource(files("src/main/kotlin"))
}

// Wirespec code generation
tasks.register<CompileWirespecTask>("wirespec-kotlin") {
    description = "Compile Wirespec to Kotlin"
    group = "wirespec"
    input = layout.projectDirectory.dir("src/main/wirespec")
    output = layout.buildDirectory.dir("generated/wirespec/kotlin")
    packageName.set("com.github.zzave.teambalance.api.interfaces.generated")
    emitterClass.set(SpringKotlinEmitter::class.java)
    shared.set(false)
    strict.set(true)
}

tasks.register<CompileWirespecTask>("wirespec-typescript") {
    description = "Compile Wirespec to TypeScript"
    group = "wirespec"
    input = layout.projectDirectory.dir("src/main/wirespec")
    output = rootProject.layout.projectDirectory.dir("app/src/shared/api/generated")
    languages.set(listOf(Language.TypeScript))
    shared.set(true)
    strict.set(true)
}

sourceSets {
    main {
        kotlin {
            srcDir(layout.buildDirectory.dir("generated/wirespec/kotlin"))
        }
    }
}

tasks.named("compileKotlin") {
    dependsOn("wirespec-kotlin")
}

// Regenerate the TypeScript client as part of the build so the frontend (app/) always
// compiles against the current contract — the generated sources are gitignored and not
// committed, so CI must produce them before `npm run build`.
tasks.named("build") {
    dependsOn("wirespec-typescript")
}
