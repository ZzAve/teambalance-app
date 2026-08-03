// Deterministic, UUID-keyed avatar colour so a person keeps the same colour across every listing
// and through display-name changes. The palette are CSS-var tokens (resolved globally via
// design-tokens/tokens.css), so no avatar hex lives in component code.
const AVATAR_PALETTE = [
  'var(--color-blue)',
  'var(--color-green)',
  'var(--color-gold)',
  'var(--color-red)',
  'var(--color-purple)',
  'var(--color-orange)',
]

export function avatarColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

export function avatarInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
