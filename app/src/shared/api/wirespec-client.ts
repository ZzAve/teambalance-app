import { Wirespec } from './generated/Wirespec'
import { client } from './generated/client'
import { redirectToLogin, shouldRedirectToLogin } from './auth-redirect'

// Best-effort read of the `code` discriminator from an error body (GlobalExceptionHandler).
const errorCode = (body: string): string | undefined => {
  try {
    return JSON.parse(body)?.code
  } catch {
    return undefined
  }
}

// Wirespec serialization: path/query primitives go through as-is, bodies as JSON.
const serialization: Wirespec.Serialization = {
  serialize: <T>(value: T): string =>
    typeof value === 'string' ? value : JSON.stringify(value),
  deserialize: <T>(raw: string | undefined): T =>
    (raw === undefined || raw === '' ? undefined : JSON.parse(raw)) as T,
}

// Turns a Wirespec RawRequest into a fetch against the API, carrying the team context header
// and the session cookie (identity). Empty in dev/e2e → a relative URL the Vite proxy handles;
// in the split-origin prod build VITE_API_URL is `https://api.teambalance.nl` while the SPA
// lives on app.teambalance.nl. There is no mock runtime — dev talks to the real backend.
const handler = async (req: Wirespec.RawRequest): Promise<Wirespec.RawResponse> => {
  const baseUrl = import.meta.env.VITE_API_URL ?? ''
  const teamId = localStorage.getItem('teamId') ?? 'setpoint_vt'
  const query = new URLSearchParams(req.queries).toString()
  const url = `${baseUrl}/${req.path.join('/')}${query ? `?${query}` : ''}`

  const res = await fetch(url, {
    method: req.method,
    // Send the cross-subdomain session cookie (backend prod CORS sets allowCredentials=true).
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Team-Id': teamId,
      ...req.headers,
    },
    body: req.body,
  })

  const text = res.status === 204 ? '' : await res.text()

  // A teamless authenticated user (403 NO_TEAM_MEMBERSHIP) belongs on the login/onboarding path,
  // not on a data screen — bounce them there rather than surfacing a raw error.
  if (shouldRedirectToLogin({ status: res.status, code: errorCode(text), currentPath: window.location.pathname })) {
    redirectToLogin()
  }

  const headers: Record<string, string> = {}
  res.headers.forEach((value, key) => {
    headers[key] = value
  })
  return { status: res.status, headers, body: text === '' ? undefined : text }
}

export const api = client(serialization, handler)
