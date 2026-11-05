// The API's CSRF check (ADR-0012): it sets an `XSRF-TOKEN` cookie, readable by script, and refuses a
// mutating request that does not echo it as the `X-XSRF-TOKEN` header. In prod the cookie is scoped to
// `.teambalance.nl`, so this page on app.teambalance.nl can read what api.teambalance.nl set.
// The demo build serves SPA and API from one host and renames the cookie (VITE_XSRF_COOKIE, ADR-0043).
const COOKIE = import.meta.env.VITE_XSRF_COOKIE || 'XSRF-TOKEN'
const HEADER = 'X-XSRF-TOKEN'
const UNCHECKED_METHODS = ['GET', 'HEAD', 'OPTIONS', 'TRACE']

export function csrfHeaders(
  method: string,
  cookie: string = document.cookie,
  cookieName: string = COOKIE,
): Record<string, string> {
  if (UNCHECKED_METHODS.includes(method.toUpperCase())) return {}
  const token = cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1)
  return token ? { [HEADER]: decodeURIComponent(token) } : {}
}
