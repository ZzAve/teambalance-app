# ADR-0012: Adopt Spring Security — session fixation, CSRF, unified auth chain

- Status: Accepted
- Date: 2026-07-14
- See also: ADR-0008, ADR-0010, ADR-0011

## Context

Three concrete gaps in the current hand-rolled filter model warranted adopting Spring Security:
(1) session IDs are never rotated on login (session fixation risk);
(2) there is no CSRF stance for the cookie-session SPA;
(3) the forthcoming Google Sign-In work introduces a second auth method — a unified `SecurityFilterChain` entry point is preferable to a second bespoke filter bolted on top.

CORS is not a driver — `WebMvcConfigurer.addCorsMappings` suffices, and the app currently relies on same-origin (Vite proxy in dev, same host in prod).

## Decision

**Adopt Spring Security as a security harness; wrap rather than replace the existing auth infrastructure.**

The four hand-rolled filters (`SessionUserContextFilter`, `UserFilter`, `SessionTenantContextFilter`, `TenantFilter`) migrate into the `SecurityFilterChain` at their existing order positions. `UserContext` and `TenantContext`/`CurrentTeamContext` ThreadLocals stay as the app's internal identity mechanism — application and domain layers are untouched. `SessionUserContextFilter` additionally populates the `SecurityContext` with a minimal `Authentication`, bridging the session model to Spring Security's auth check.

**Session fixation:** `SessionFixationProtectionStrategy` rotates the session ID at login time (magic-link verify, and future Google verify). ADR-0010's in-memory `HttpSession` is fully compatible; Redis stays deferred.

**CSRF:** `CookieCsrfTokenRepository.withHttpOnlyFalse()`. The SPA reads the `XSRF-TOKEN` cookie and echoes it as `X-XSRF-TOKEN` on mutating requests. Auth and invite endpoints (`/api/auth/**`, `/api/invitations/**`) are CSRF-exempt — they are called pre-session and cannot carry a token.

**Endpoint authorization:** Strict default — `.anyRequest().authenticated()` — with explicit `permitAll()` carve-outs for the auth and invite surface. Unauthenticated requests to any other endpoint are rejected at the security layer before reaching application code.

**Test infrastructure:** The `X-User-Id`/`X-Team-Id` header shim (`UserFilter`, `TenantFilter`) is replaced by a test DSL (`loginAs(user)` or equivalent) that encapsulates Spring Security test support (`SecurityMockMvcRequestPostProcessors`). This is the single seam for test identity injection; mutating test requests include CSRF tokens via the same helper.

## Consequences

- Spring Security must land **before** the Google Sign-In work; the Google plan's implementation approach changes from a bespoke filter to an `AuthenticationProvider`/filter inside the `SecurityFilterChain`.
- ADR-0010's in-memory session deferral is unaffected — session fixation protection does not require Redis or Spring Session.
- Method-level `@PreAuthorize` authorization is out of scope; not required by the three named drivers.
- Spring Security's default security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` on HTTPS) are enabled as a side effect.
- All mutating integration tests gain a CSRF token requirement; the test DSL absorbs this at the call site.
