# ADR-0018: Enforce hexagonal architecture in the build with flock-detekt

- Status: Accepted
- Date: 2026-07-31

## Context

The frontend already fails the build on any cross-layer import (eslint-plugin-boundaries).
The backend enforces only **dependency direction** between layers — a bytecode-based ArchUnit
test (`ArchitectureTest.kt`) — and nothing **inside** each layer. The domain can drift into
framework imports, model fields stay raw primitives, ports/adapters get named inconsistently,
and business logic leaks across layers. Architecture depends on reviewer vigilance, not on the
build.

Worse, bytecode analysis has blind spots. `interfaces/AuthController` imports
`infrastructure.identity.SessionKeys`, yet ArchUnit's "interfaces must not depend on
infrastructure" rule stays green: `SessionKeys.USER_ID` is a `const val`, which the Kotlin
compiler **inlines**, leaving no bytecode reference for ArchUnit to see. A source-based analyzer
catches it.

We want the build to be the source of architectural truth: domain **and** application genuinely
framework-free, ports/adapters named consistently, identifiers and meaningful strings modeled as
value objects — mapped to primitives only at the edges.

## Decision

### 1. Adopt flock-detekt's five hexagonal rulesets as build-breaking errors

Add `community.flock:hexagonal-detekt-rules` as a `detektPlugins` dependency and enable all five
rulesets in `api/detekt.yml` with `config.warningsAsErrors: true`:

- **hexagonal-domain** — `DomainNoPrimitiveObsession`, `DomainNoFrameworkImports`,
  `DomainMustBeImmutable`, `ValueClassMustHaveJvmInline` (+ opt-in `DomainModelMustBeStandalone`,
  left off — `DomainNoFrameworkImports` already covers the deny side).
- **hexagonal-port** — `PortMustBeInterface`, `PortNamingConvention`, `PortsInDomainOnly`.
- **hexagonal-adapter** — `AdapterMustImplementPort`, `AdapterNamingConvention`,
  `AdapterCannotDependOnAdapter`.
- **hexagonal-dependency** — `DomainCannotDependOnAdapters`, `DomainCannotDependOnApi`,
  `ApiCannotDependOnAdapters`, `ApiCannotDependOnPorts`.
- **hexagonal-layering** — `DtoOnlyInAdaptersOrApi`, `NoServiceInApiOrAdapter`.

The Arrow (typed-error) rulesets are **not** adopted; error handling stays exception-based
(`TeambalanceException`).

Analysis runs on **production sources only** (`src/main/kotlin`) — test code legitimately wires
adapters across layers (this mirrors ArchUnit's `DoNotIncludeTests()`), and the generated Wirespec
sources under `build/` are contract code we never hand-edit.

### 2. Package-token mapping (codebase-specific, and the subtle part)

flock matches package **segments** (bounded by dots: `.token.`, `endsWith(.token)`, …). Every
class here lives under `com.github.zzave.teambalance.api.*`, so the literal token **`api` matches
every file** and must never appear in config. The mapping:

| flock token     | our layer(s)              | rationale                                        |
|-----------------|---------------------------|--------------------------------------------------|
| `domain`        | `domain` **+ `application`** | both must be framework-free (this epic's core) |
| `port`          | `domain.port`             | ports are interfaces owned by the domain         |
| `adapter`       | `infrastructure`          | JPA/Bunq/email/identity adapters                 |
| `api` (inbound) | **`interfaces`**          | controllers — the driving side; **not** `api`    |

Port suffixes accept `Repository` and `Gateway` (our ports are `*Repository`; #19 introduces
`*Gateway`). Adapter patterns are `.*Adapter` / `.*Impl` (a `*Repository` is a *port*, not an
adapter, so it is deliberately excluded from the adapter patterns).

### 3. Temporary alpha.1 compatibility bridge

flock-detekt 1.1.0 is compiled against detekt **2.0.0-alpha.1** and references
`dev.detekt.api.RuleSet$Id`, a class **removed in alpha.2** (which this repo runs). A compatibility
spike settled the go/no-go:

| Attempt                                   | Result                                                              |
|-------------------------------------------|--------------------------------------------------------------------|
| flock on detekt **alpha.2** (repo default) | ❌ `NoClassDefFoundError: dev.detekt.api.RuleSet$Id` — rules won't load |
| Pin detekt down to **alpha.1**            | ❌ `detekt was compiled with Kotlin 2.2.20 but running with 2.3.0`  |
| alpha.1 **+ detekt-runtime Kotlin pin + jvmTarget=24** | ✅ rules resolve, load, run, and fire            |

The bridge (all isolated to detekt's own tooling — the app stays on Kotlin 2.3):

1. Pin the **detekt plugin** to `2.0.0-alpha.1` (matches flock's binary API).
2. Pin `kotlin-compiler-embeddable` **on detekt's isolated `detekt` classpath** back to detekt's
   supported version, so `io.spring.dependency-management` can't force it to 2.3.0
   (per <https://detekt.dev/docs/gettingstarted/gradle#dependencies>).
3. Cap the Detekt tasks' `jvmTarget` at `24` (detekt's pinned compiler's max; it only parses).

**Migration:** when flock ships a build compiled against detekt 2.0.0-alpha.2+, bump the plugin to
alpha.2 and `flockDetektVersion` to the new release, then delete the bridge block. `detekt.yml` is
unchanged. (The alpha.2-compatible flock build is being requested upstream.) flock is a
single-maintainer repo; if the upstream bump stalls, the fallback is to vendor flock's rule sources
recompiled against alpha.2.

**Konsist was the pre-committed fallback** and was verified to compile and run under this repo's
Kotlin 2.3 / Java 25 toolchain. It is **not** adopted: it is test-based (assertions in Kotest), with
no detekt baseline, no `warningsAsErrors`, and no per-category rule config — so it does not fit the
"exemptions-as-config, zero baseline" definition of done (see §4 and #24). flock keeps everything in
one detekt pipeline.

### 4. Existing violations baselined; exemptions belong in rule config, not the baseline

A detekt baseline (`api/detekt-baseline.xml`, 59 entries) captures today's production violations so
the build stays green while the refactor waves (#19–#23) burn them down. **The baseline is temporary
scaffolding, not the end state.** Deliberate, permanent exemptions live in **versioned rule config**,
never a grandfathered baseline. This is proven reachable: `DomainNoPrimitiveObsession.allowedPrimitives`
exempts a specific primitive (e.g. `String`: 24 → 1 findings) while the rule **stays active** and
still catches other primitives (`Boolean`, …). #24 deletes ArchUnit, removes the baseline entirely,
and moves any surviving exemptions into rule config.

## Consequences

- **59 production violations** are baselined now, concentrated where the epic expects them:
  `DomainNoPrimitiveObsession` (24) and `DomainNoFrameworkImports` in `application` (16) —
  the framework-strip (#20/#21/#80) and value-object (#22/#23) waves erase these baseline entries.
- **Source-based beats bytecode-based** for this: flock catches the `const val` inlining case above
  that ArchUnit silently passes. #24 retires ArchUnit so there is a single source of truth.
- The alpha.1 pin is **detekt-tooling-only and temporary**; production code, tests, and runtime stay
  on Kotlin 2.3 / detekt-free.
- **New guardrail is live now**: a forbidden framework import added to a domain/application class
  fails `:api:detekt` immediately (verified), independent of the baseline.
