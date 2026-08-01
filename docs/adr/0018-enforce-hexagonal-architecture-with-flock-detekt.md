# ADR-0018: Enforce hexagonal architecture in the build with flock-detekt

- Status: Accepted
- Date: 2026-08-01

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

Add `community.flock:hexagonal-detekt-rules` as a `detektPlugins` dependency and switch on all five
rulesets in `api/detekt.yml`:

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

These rules report at severity `error` on their own, so a violation fails `:api:detekt` without
setting `config.warningsAsErrors`. That flag is deliberately left at its existing value (`false`):
flipping it would also promote detekt's *own* style warnings to build failures, which is a separate
decision with nothing to do with hexagonal enforcement.

The rules apply to production code only: each ruleset carries
`excludes: ['**/src/test/**']`, mirroring ArchUnit's `DoNotIncludeTests()` — test code legitimately
wires adapters across layers. Test sources stay covered by detekt's ordinary style rules, which is
why the exclusion sits on the rulesets rather than on the `detekt` task's source set. Generated
Wirespec sources live under `build/` and are outside detekt's source set already.

### 2. Configuration is activation, not duplication

Every flock rule is **inactive until switched on** — the rulesets ship default config as a jar
resource, but detekt does not load it at runtime, so a ruleset that is not named in `detekt.yml`
silently does nothing. The `active: true` lines are therefore load-bearing.

Rule **properties** are a different matter: flock's built-in defaults already describe this codebase
(port packages, port suffixes `Port`/`Repository`/`Gateway`/`Client`, adapter packages incl.
`infrastructure`, adapter patterns, the forbidden-framework-import list, DTO and service suffixes),
so `detekt.yml` does not restate them. Restating a default only creates a second copy to keep in
sync with upstream. Exactly **two** package tokens are overridden, and only because our layer names
differ from what flock's defaults assume — see §3.

### 3. Package-token mapping (codebase-specific, and the subtle part)

flock matches package **segments** (bounded by dots: `.token.`, `endsWith(.token)`, …). Every
class here lives under `com.github.zzave.teambalance.api.*`, so the literal token **`api` matches
every file** and must never appear in config. The mapping:

| flock token     | our layer(s)                | overridden? | rationale                                       |
|-----------------|-----------------------------|-------------|-------------------------------------------------|
| `domain`        | `domain` **+ `application`** | yes         | both must be framework-free (this epic's core)  |
| `api` (inbound) | **`interfaces`**             | yes         | controllers — the driving side; **not** `api`   |
| `port`          | `domain.port`                | no          | default `['port', 'ports']` already matches     |
| `adapter`       | `infrastructure`             | no          | default already includes `infrastructure`       |

### 4. Engine compatibility

detekt 2.0 is pre-release and breaks its rule-provider API between alphas, so each flock release
only loads on the engines it was compiled against (flock 1.2.0 ↔ detekt 2.0.0-alpha.4–alpha.5).
This repo therefore moves from detekt `2.0.0-alpha.2` to **`2.0.0-alpha.5`** alongside flock
**1.2.0**. The engine analyses sources with its own embedded Kotlin (2.4.0); the project stays on
Kotlin 2.3.

One line of build glue is required, and it is a detekt-wide issue rather than a flock one:
`io.spring.dependency-management` force-aligns every `kotlin-*` artifact to the project's Kotlin
version, including on detekt's isolated `detekt` classpath, and the engine hard-refuses to start on
a Kotlin version other than its own. `api/build.gradle.kts` pins that configuration back to
`dev.detekt.gradle.plugin.getSupportedKotlinVersion()` — the engine's own answer, so it stays
correct across upgrades. This is the workaround detekt documents at
<https://detekt.dev/docs/gettingstarted/gradle#dependencies>.

**Konsist was the pre-committed fallback** and was verified to compile and run under this repo's
Kotlin / Java toolchain. It is **not** adopted: it is test-based (assertions in Kotest), with no
detekt baseline, no `warningsAsErrors`, and no per-category rule config — so it does not fit the
"exemptions-as-config, zero baseline" definition of done (see §5). flock keeps everything in one
detekt pipeline.

### 5. Existing violations baselined; exemptions belong in rule config, not the baseline

A detekt baseline (`api/detekt-baseline.xml`, 59 entries) captures today's production violations so
the build stays green while the refactor waves burn them down. **The baseline is temporary
scaffolding, not the end state.** Deliberate, permanent exemptions live in **versioned rule config**,
never a grandfathered baseline. This is proven reachable: `DomainNoPrimitiveObsession.allowedPrimitives`
exempts a specific primitive (e.g. `String`: 24 → 1 findings) while the rule **stays active** and
still catches other primitives. The final sub-issue of this epic deletes ArchUnit, removes the
baseline entirely, and moves any surviving exemptions into rule config.

## Consequences

- **59 production violations** are baselined now, concentrated where the epic expects them:
  `DomainNoPrimitiveObsession` (24), `DomainNoFrameworkImports` in `application` (16),
  `PortsInDomainOnly` (9), `AdapterCannotDependOnAdapter` (6), and four singles — the framework-strip
  and value-object waves erase these baseline entries.
- **Source-based beats bytecode-based** for this: flock catches the `const val` inlining case above
  that ArchUnit silently passes. ArchUnit is retired at the end of the epic so there is a single
  source of truth.
- **detekt is pinned to a pre-release engine.** Upgrading detekt now means checking flock's
  compatibility matrix first; a mismatched pair fails loudly at task start
  (`NoClassDefFoundError` / "compiled with Kotlin x but running with y"), not silently.
- **New guardrail is live now**: a forbidden framework import added to a domain/application class
  fails `:api:detekt` immediately (verified), independent of the baseline.
