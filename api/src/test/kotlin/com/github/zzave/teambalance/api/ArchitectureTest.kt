package com.github.zzave.teambalance.api

import com.tngtech.archunit.core.importer.ClassFileImporter
import com.tngtech.archunit.core.importer.ImportOption
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses
import org.junit.jupiter.api.Test

class ArchitectureTest {

    companion object {
        private val classes by lazy {
            ClassFileImporter()
                .withImportOption(ImportOption.DoNotIncludeTests())
                .importPackages("com.github.zzave.teambalance.api")
        }
    }

    @Test
    fun `domain must not depend on infrastructure`() {
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .allowEmptyShould(true)
            .check(classes)
    }

    @Test
    fun `domain must not depend on interfaces`() {
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAPackage("..interfaces..")
            .allowEmptyShould(true)
            .check(classes)
    }

    @Test
    fun `domain must not depend on Spring`() {
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAPackage("org.springframework..")
            .allowEmptyShould(true)
            .check(classes)
    }

    @Test
    fun `application must not depend on infrastructure`() {
        noClasses()
            .that().resideInAPackage("..application..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .allowEmptyShould(true)
            .check(classes)
    }

    @Test
    fun `application must not depend on interfaces`() {
        noClasses()
            .that().resideInAPackage("..application..")
            .should().dependOnClassesThat().resideInAPackage("..interfaces..")
            .allowEmptyShould(true)
            .check(classes)
    }

    @Test
    fun `interfaces must not depend on infrastructure`() {
        noClasses()
            .that().resideInAPackage("..interfaces..")
            .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
            .allowEmptyShould(true)
            .check(classes)
    }
}
