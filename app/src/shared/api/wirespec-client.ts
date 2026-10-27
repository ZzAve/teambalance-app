import { Wirespec } from './generated/Wirespec'
import { client } from './generated/Client'
import { redirectToLogin, shouldRedirectToLogin } from './auth-redirect'
import { isActAsExpired, returnToConsole } from './act-as-redirect'
import { csrfHeaders } from './csrf'

// Best-effort read of the `code` discriminator from an error body (GlobalExceptionHandler).
const errorCode = (body: string): string | undefined => {
  try {
    return JSON.parse(body)?.code
  } catch {
    return undefined
  }
}

// Wirespec serialization: path/query primitives go through as-is, bodies as JSON.
const asText = <T>(value: T): string => (typeof value === 'string' ? value : JSON.stringify(value))
const fromText = <T>(raw: string | undefined): T => (raw === undefined || raw === '' ? undefined : JSON.parse(raw)) as T

const serialization: Wirespec.Serialization = {
  serializeBody: <T>(value: T): Uint8Array => new TextEncoder().encode(asText(value)),
  deserializeBody: <T>(raw: Uint8Array): T => fromText<T>(new TextDecoder().decode(raw)),
  serializePath: asText,
  deserializePath: fromText,
  serializeParam: <T>(value: T): string[] =>
    value === undefined ? [] : (Array.isArray(value) ? value : [value]).map(asText),
  deserializeParam: <T>(values: string[]): T => fromText<T>(values[0]),
}

// Turns a Wirespec RawRequest into a fetch against the API, carrying the session cookie (identity)
// and, on a mutating request, the CSRF header. Empty in dev/e2e → a relative URL the Vite proxy handles;
// in the split-origin prod build VITE_API_URL is `https://api.teambalance.nl` while the SPA
// lives on app.teambalance.nl. There is no mock runtime — dev talks to the real backend.
const transport = async (req: Wirespec.RawRequest): Promise<Wirespec.RawResponse> => {
  const baseUrl = import.meta.env.VITE_API_URL ?? ''
  const queries = new URLSearchParams()
  Object.entries(req.queries).forEach(([name, values]) => values.forEach((value) => queries.append(name, value)))
  const query = queries.toString()
  const url = `${baseUrl}/${req.path.join('/')}${query ? `?${query}` : ''}`

  const res = await fetch(url, {
    method: req.method,
    // Send the cross-subdomain session cookie (backend prod CORS sets allowCredentials=true).
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...csrfHeaders(req.method),
      ...Object.fromEntries(Object.entries(req.headers).map(([name, values]) => [name, values.join(', ')])),
    },
    body: req.body as Uint8Array<ArrayBuffer> | undefined,
  })

  const text = res.status === 204 ? '' : await res.text()

  const code = errorCode(text)

  // A lapsed act-as is checked BEFORE the teamless bounce: a Platform Admin whose box ran out is
  // teamless by construction (ADR-0024 §3), and belongs on the console, not on the login screen.
  if (isActAsExpired({ status: res.status, code })) {
    returnToConsole()
  } else if (shouldRedirectToLogin({ status: res.status, code, currentPath: window.location.pathname })) {
    // A teamless authenticated user (403 NO_TEAM_MEMBERSHIP) belongs on the login/onboarding path,
    // not on a data screen — bounce them there rather than surfacing a raw error.
    redirectToLogin()
  }

  const headers: Record<string, string[]> = Object.fromEntries([...res.headers].map(([name, value]) => [name, [value]]))
  return { statusCode: res.status, headers, body: text === '' ? undefined : new TextEncoder().encode(text) }
}

const generated = client(serialization, { transport })

// The generated client drops the body of a status the contract declares as Unit, but callers read the
// { code } the error handlers send on those statuses. Each call gets its own client, so the raw
// response it received is at hand to restore that body.
type Api = typeof generated
type Call = (...args: unknown[]) => Promise<{ body?: unknown }>
const UNMATCHED_STATUS = 'Cannot match response with status:'

export const api = Object.fromEntries(
  Object.keys(generated).map((name) => [
    name,
    async (...args: unknown[]) => {
      let raw: Wirespec.RawResponse | undefined
      const scoped = client(serialization, { transport: async (req) => (raw = await transport(req)) })
      const res = await (scoped as unknown as Record<string, Call>)[name](...args).catch((error: unknown) => {
        // The generated message leaves out the status it could not match; callers and logs need it.
        if (error instanceof Error && error.message === UNMATCHED_STATUS && raw) {
          throw new Error(`${UNMATCHED_STATUS} ${raw.statusCode}`, { cause: error })
        }
        throw error
      })
      return res.body === undefined && raw?.body
        ? { ...res, body: fromText(new TextDecoder().decode(raw.body)) }
        : res
    },
  ]),
) as Api
