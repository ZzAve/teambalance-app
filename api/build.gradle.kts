import community.flock.wirespec.plugin.gradle.CompileWirespecTask
import community.flock.wirespec.plugin.Language

val wirespecVersion: String by project
val testcontainersVersion: String by project
val archunitVersion: String by project

plugins {
    kotlin("jvm")
    kotlin("plugin.spring")
    kotlin("plugin.jpa")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
    id("community.flock.wirespec.plugin.gradle")
    id("dev.detekt")
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Spring Session + Redis (auth infrastructure for Phase 5)
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("org.springframework.session:spring-session-data-redis")

    // Flyway
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")

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

}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

detekt {
    buildUponDefaultConfig = true
    config.setFrom(files("$projectDir/detekt.yml"))
}

// Wirespec code generation
tasks.register<CompileWirespecTask>("wirespec-kotlin") {
    description = "Compile Wirespec to Kotlin"
    group = "wirespec"
    input = layout.projectDirectory.dir("src/main/wirespec")
    output = layout.buildDirectory.dir("generated/wirespec/kotlin")
    packageName.set("com.github.zzave.teambalance.api.interfaces.generated")
    languages.set(listOf(Language.Kotlin))
    shared.set(true)
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