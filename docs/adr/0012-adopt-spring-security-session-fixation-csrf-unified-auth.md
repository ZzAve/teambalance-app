# ADR-0012: Adopt Spring Security — session fixation, CSRF, unified auth chain

- Status: Accepted
- Date: 2026-07-14
- See also: ADR-0008, ADR-0010, ADR-0011, ADR-0022, ADR-0039
- Amended: 2026-10-10 (CSRF for the cross-origin SPA, sessions in JDBC, the public list; see below)

## Context

Three concrete gaps in the current hand-rolled filter model warranted adopting Spring Security:
(1) session IDs are never rotated on login (session fixation risk);
(2) there is no CSRF stance for the cookie-session SPA;
(3) the forthcoming Google Sign-In work introduces a second auth method — a unified `SecurityFilterChain` entry point is preferable to a second bespoke filter bolted on top.

> **Update (ADR-0034):** Google Sign-In was subsequently dropped for good. Driver (3) is void, but the decision stands on drivers (1) and (2); the unified filter chain is where a future passkey provider would slot in, the way Google would have.

CORS is not a driver — `WebMvcConfigurer.addCorsMappings` suffices, and the app currently relies on same-origin (Vite proxy in dev, same host in prod).

> **Amended (2026-10-10):** not true in prod. The SPA on `app.teambalance.nl` calls the API on `api.teambalance.nl` cross-origin. CORS is still not a driver, but the split origin shapes the CSRF decision; see the amendment below.

## Decision

**Adopt Spring Security as a security harness; wrap rather than replace the existing auth infrastructure.**

The four hand-rolled filters (`SessionUserContextFilter`, `UserFilter`, `SessionTenantContextFilter`, `TenantFilter`) migrate into the `SecurityFilterChain` at their existing order positions. `UserContext` and `TenantContext`/`CurrentTeamContext` ThreadLocals stay as the app's internal identity mechanism — application and domain layers are untouched. `SessionUserContextFilter` additionally populates the `SecurityContext` with a minimal `Authentication`, bridging the session model to Spring Security's auth check.

**Session fixation:** `SessionFixationProtectionStrategy` rotates the session ID at login time (magic-link verify, and future Google verify). ADR-0010's in-memory `HttpSession` is fully compatible; Redis stays deferred. *(Amended: sessions are JDBC-backed since ADR-0022; see below.)*

**CSRF:** `CookieCsrfTokenRepository.withHttpOnlyFalse()`. The SPA reads the `XSRF-TOKEN` cookie and echoes it as `X-XSRF-TOKEN` on mutating requests. Auth and invite endpoints (`/api/auth/**`, `/api/invitations/**`) are CSRF-exempt — they are called pre-session and cannot carry a token. *(Amended: only the two magic-link endpoints are exempt; see below.)*

**Endpoint authorization:** Strict default — `.anyRequest().authenticated()` — with explicit `permitAll()` carve-outs for the auth and invite surface. Unauthenticated requests to any other endpoint are rejected at the security layer before reaching application code.

**Test infrastructure:** The `X-User-Id`/`X-Team-Id` header shim (`UserFilter`, `TenantFilter`) is replaced by a test DSL (`loginAs(user)` or equivalent) that encapsulates Spring Security test support (`SecurityMockMvcRequestPostProcessors`). This is the single seam for test identity injection; mutating test requests include CSRF tokens via the same helper.

## Consequences

- Spring Security must land **before** the Google Sign-In work; the Google plan's implementation approach changes from a bespoke filter to an `AuthenticationProvider`/filter inside the `SecurityFilterChain`.
- ADR-0010's in-memory session deferral is unaffected — session fixation protection does not require Redis or Spring Session.
- Method-level `@PreAuthorize` authorization is out of scope; not required by the three named drivers.
- Spring Security's default security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` on HTTPS) are enabled as a side effect.
- All mutating integration tests gain a CSRF token requirement; the test DSL absorbs this at the call site.

## Amendment (2026-10-10): CSRF for a cross-origin SPA, rotation on JDBC sessions, and the public list

Written when the harness was built (#73), against what had changed since July: sessions moved to Postgres
(ADR-0022), Google Sign-In was dropped (ADR-0034), and the calendar feed became the first session-less
endpoint that is not about signing in (ADR-0039).

### CSRF: a parent-domain cookie the SPA echoes (option A)

The SPA (`app.teambalance.nl`) and the API (`api.teambalance.nl`) are different origins on the same
registrable site. A cookie the API sets for its own host cannot be read by script on the SPA's host, so
the plain double-submit setup above does not work as written in prod.

**Decision:** `CookieCsrfTokenRepository.withHttpOnlyFalse()`, with the `XSRF-TOKEN` cookie scoped to the
parent domain `teambalance.nl` in prod (`teambalance.csrf.cookie-domain`), so the SPA can read it, and
given the session cookie's flags (`Secure`, `SameSite=Lax`). In dev and e2e the property is unset and the
cookie is host-only; the SPA is same-origin there behind the Vite proxy. The SPA reads the cookie and
sends it as `X-XSRF-TOKEN` on every non-GET request (`app/src/shared/api/csrf.ts`).

- **Raw token, not a masked one.** Spring Security's default request handler expects the BREACH-masked
  token it renders into pages. The SPA sends the raw cookie value, so the chain uses Spring Security's SPA
  configuration (`csrf.spa()`): a header is compared as-is.
- **The cookie is issued on every response that lacks one.** The repository only writes the cookie when
  something reads the token, and a GET never does, so a small filter after `CsrfFilter` reads it. Without
  it the SPA would have nothing to echo on its first mutating request after sign-in.
- **Only the two magic-link endpoints are exempt**, `POST /api/auth/magic-link/request` and `/verify`.
  The login and verify pages skip the session probe, so in a fresh browser (a magic link opened on
  another device, ADR-0031) the magic-link request or verify can be the very first call to the API, with
  no cookie yet to echo. Neither acts on an existing session: request only sends an email, and verify
  replaces whatever session the caller had (below). Logout, invitation accept and everything else need
  the token. The invite endpoints are not exempt, as the original text had them: invite preview no longer
  exists, and accept runs on a signed-in session.

Rejected alternative: making the SPA fetch the token before its first POST. It adds a round trip and an
endpoint whose only job is to set a cookie, to protect two requests that carry no session authority.

### Session fixation on JDBC sessions

The "in-memory `HttpSession`" wording above is out of date: sessions are Spring Session JDBC (ADR-0022).
Rotation happens in `AuthSessionGatewayAdapter.startSession`, the one place a session gains a user: the
session the request arrived with is invalidated and a new one is created, through the Spring Session
request wrapper, so the old ID is deleted from `SPRING_SESSION` and stops working. A new session rather
than `changeSessionId()`, so nothing from before sign-in carries over and the new session's creation time,
which the absolute lifetime cap counts from (ADR-0015), is the sign-in.

### The chain

- **Wrap, not replace, as decided.** `SessionUserContextFilter`, `SessionTenantContextFilter`,
  `RateLimitFilter` and `CalendarFeedTenantFilter` run inside the chain in their old relative order,
  before Spring Security's anonymous-authentication step. `RateLimitFilter` moved too: it keys
  invitation accept on the signed-in user, so it has to keep running after the user filter.
  `SessionUserContextFilter` also sets a minimal `Authentication`, which is what the authorization rule
  reads. `InternalEndpointGuardFilter` stays outside, ahead of everything, in prod.
- **Nothing is stored on the session by Spring Security.** The security context is rebuilt from the
  session's `userId` on every request, and the request cache is off, so an unauthenticated request never
  creates a session row.
- **Public routes** (`permitAll`), checked against every handler that does not call
  `requireCurrentUserId()`: under `/api/auth/` (request, verify, `/me`, logout), `/api/ping`, under
  `/api/calendar/` (the webcal feed, ADR-0039), under `/internal/actuator/` (prod's boundary for these is
  `InternalEndpointGuardFilter`) and under `/internal/e2e/` (e2e profile only). ASYNC and ERROR dispatches
  are permitted: they belong to a request the REQUEST dispatch already authorized. Everything else needs a
  session and gets a bare 401 from the chain. One handler, `GET /api/team/season`, did not check for a user
  itself; it used to fail on the missing tenant and now gets that 401.
- **CORS** runs inside the chain (`cors(withDefaults())` over the existing `WebConfig` mapping), so a
  preflight is answered before the authorization rule sees it.

### Test identity

The `X-User-Id` / `X-Team-Id` header filters are gone. Tests call `loginAs(userId, tenant?)`, which starts
a real session in the JDBC store (so identity goes through `SessionUserContextFilter` as in prod), writes
the optional tenant pin as the session's tenant-routing memo, and adds a CSRF token.
