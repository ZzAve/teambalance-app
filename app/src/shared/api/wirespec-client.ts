import { Wirespec } from './generated/Wirespec'
import { client } from './generated/client'

// Wirespec serialization: path/query primitives go through as-is, bodies as JSON.
const serialization: Wirespec.Serialization = {
  serialize: <T>(value: T): string =>
    typeof value === 'string' ? value : JSON.stringify(value),
  deserialize: <T>(raw: string | undefined): T =>
    (raw === undefined || raw === '' ? undefined : JSON.parse(raw)) as T,
}

// Turns a Wirespec RawRequest into a fetch against the same-origin API, carrying the
// team context header and the session cookie (identity). In dev the MSW worker
// intercepts these requests.
const handler = async (req: Wirespec.RawRequest): Promise<Wirespec.RawResponse> => {
  const teamId = localStorage.getItem('teamId') ?? 'setpoint_vt'
  const query = new URLSearchParams(req.queries).toString()
  const url = `/${req.path.join('/')}${query ? `?${query}` : ''}`

  const res = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'X-Team-Id': teamId,
      ...req.headers,
    },
    body: req.body,
  })

  const text = res.status === 204 ? '' : await res.text()
  const headers: Record<string, string> = {}
  res.headers.forEach((value, key) => {
    headers[key] = value
  })
  return { status: res.status, headers, body: text === '' ? undefined : text }
}

export const api = client(serialization, handler)
