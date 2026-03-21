package com.github.zzave.teambalance.api

import com.tngtech.archunit.core.importer.ClassFileImporter
import com.tngtech.archunit.core.importer.ImportOption
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses
import io.kotest.core.spec.style.FunSpec

class ArchitectureTest : FunSpec() {

    companion object {
        private val classes by lazy {
            ClassFileImporter()
                .withImportOption(ImportOption.DoNotIncludeTests())
                .importPackages("com.github.zzave.teambalance.api")
        }
    }

    init {
        test("domain must not depend on infrastructure") {
            noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("domain must not depend on interfaces") {
            noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat().resideInAPackage("..interfaces..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("domain must not depend on Spring") {
            noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat().resideInAPackage("org.springframework..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("application must not depend on infrastructure") {
            noClasses()
                .that().resideInAPackage("..application..")
                .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("application must not depend on interfaces") {
            noClasses()
                .that().resideInAPackage("..application..")
                .should().dependOnClassesThat().resideInAPackage("..interfaces..")
                .allowEmptyShould(true)
                .check(classes)
        }

        test("interfaces must not depend on infrastructure") {
            noClasses()
                .that().resideInAPackage("..interfaces..")
                .should().dependOnClassesThat().resideInAPackage("..infrastructure..")
                .allowEmptyShould(true)
                .check(classes)
        }
    }
}
