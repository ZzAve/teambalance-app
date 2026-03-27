const API_BASE = '/api'

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const teamId = localStorage.getItem('teamId') ?? 'setpoint_vt'
  const userId = localStorage.getItem('userId') ?? ''

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Team-Id': teamId,
      'X-User-Id': userId,
      ...options.headers,
    },
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}
