import java.util.Properties

plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
}

// buildSrc is a separate build, so the root gradle.properties is not propagated here.
// Read it directly to keep the version a single source of truth.
val wirespecVersion: String = Properties().apply {
    rootDir.parentFile.resolve("gradle.properties").inputStream().use(::load)
}.getProperty("wirespecVersion")

dependencies {
    // Only the Wirespec SpringKotlinEmitter is needed for code generation. The artifact
    // transitively pulls Spring Framework 6.1.13, whose bundled spring-asm (ASM 9.6) caps
    // at Java 22 bytecode and would shadow Spring Boot's newer ClassReader on the shared
    // build-script classpath, breaking resolveMainClassName on Java 25 (major 69) classes.
    implementation("community.flock.wirespec.integration:spring-jvm:$wirespecVersion") {
        exclude(group = "org.springframework")
        exclude(group = "org.springframework.boot")
    }
}
