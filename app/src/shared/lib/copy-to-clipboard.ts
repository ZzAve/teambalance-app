import { useState } from 'react'

/**
 * Writes `text` to the clipboard and says whether it worked. The write is refused on an insecure
 * origin, without permission and in some in-app browsers, so callers get a boolean to show a fallback
 * on instead of an unhandled rejection.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * The outcome of the last copy: the key of what was copied, or of what the browser refused. A screen
 * with several copy buttons passes each one's own key; a screen with one can leave it out.
 */
export function useCopyToClipboard() {
  const [last, setLast] = useState<{ key: string; ok: boolean } | null>(null)
  return {
    copiedKey: last?.ok ? last.key : null,
    failedKey: last && !last.ok ? last.key : null,
    copy: async (text: string, key = '') => setLast({ key, ok: await copyToClipboard(text) }),
    reset: () => setLast(null),
  }
}
