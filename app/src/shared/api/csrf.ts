// The API's CSRF check (ADR-0012): it sets an `XSRF-TOKEN` cookie, readable by script, and refuses a
// mutating request that does not echo it as the `X-XSRF-TOKEN` header. In prod the cookie is scoped to
// `.teambalance.nl`, so this page on app.teambalance.nl can read what api.teambalance.nl set.
const COOKIE = 'XSRF-TOKEN'
const HEADER = 'X-XSRF-TOKEN'
const UNCHECKED_METHODS = ['GET', 'HEAD', 'OPTIONS', 'TRACE']

export function csrfHeaders(method: string, cookie: string = document.cookie): Record<string, string> {
  if (UNCHECKED_METHODS.includes(method.toUpperCase())) return {}
  const token = cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1)
  return token ? { [HEADER]: decodeURIComponent(token) } : {}
}
