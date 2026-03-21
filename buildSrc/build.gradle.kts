plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("community.flock.wirespec.integration:spring-jvm:0.14.3")
    implementation("community.flock.wirespec.compiler:core-jvm:0.14.3")
}
