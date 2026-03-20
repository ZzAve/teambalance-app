plugins {
    kotlin("jvm") version "2.3.0" apply false
    kotlin("plugin.spring") version "2.3.0" apply false
    kotlin("plugin.jpa") version "2.3.0" apply false
    id("org.springframework.boot") version "4.0.0" apply false
    id("io.spring.dependency-management") version "1.1.7" apply false
    id("community.flock.wirespec.plugin.gradle") version "0.14.3" apply false
    id("dev.detekt") version "2.0.0-alpha.2" apply false
}

allprojects {
    group = "app.teambalance"
    version = "0.1.0-SNAPSHOT"

    repositories {
        mavenCentral()
    }
}
