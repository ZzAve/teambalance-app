// Accepts either a full invite URL or a bare token. The token is the path segment after `/invite/`,
// with any trailing `?query`, `#hash`, or `/` stripped — or, if no `/invite/` marker is present, the
// trimmed input itself (someone pasted just the token).
export function parseInviteToken(input: string): string {
  const trimmed = input.trim()
  const marker = '/invite/'
  const idx = trimmed.indexOf(marker)
  const raw = idx === -1 ? trimmed : trimmed.slice(idx + marker.length)
  return raw.split(/[?#]/)[0].replace(/\/+$/, '').trim()
}
