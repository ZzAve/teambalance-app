import { useEffect, useSyncExternalStore } from 'react'

/**
 * PROTOTYPE — throwaway. The floating variant switcher from `.claude/skills/prototype/UI.md`.
 *
 * Reads `?variant=` from the URL, cycles it with the arrows or ← / → keys, and never renders in a
 * production build, so a stray merge can't ship it. Lives on the prototype branch only.
 */

const EVENT = 'tb-proto-variant'

function readVariant(keys: readonly string[]): string {
  const v = new URLSearchParams(window.location.search).get('variant')
  return v && keys.includes(v) ? v : keys[0]
}

function writeVariant(v: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('variant', v)
  window.history.replaceState(window.history.state, '', url)
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('popstate', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('popstate', cb)
  }
}

/** The current variant key; re-renders when the switcher (or back/forward) changes it. */
export function usePrototypeVariant<K extends string>(keys: readonly K[]): K {
  return useSyncExternalStore(subscribe, () => readVariant(keys) as K, () => keys[0])
}

interface PrototypeSwitcherProps<K extends string> {
  variants: readonly { key: K; name: string }[]
}

export function PrototypeSwitcher<K extends string>({ variants }: PrototypeSwitcherProps<K>) {
  const keys = variants.map((v) => v.key)
  const current = usePrototypeVariant(keys)
  const index = keys.indexOf(current)
  const step = (delta: number) => writeVariant(keys[(index + delta + keys.length) % keys.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!import.meta.env.DEV) return null

  return (
    <div
      role="toolbar"
      aria-label="Prototype variant"
      className="fixed left-1/2 z-[500] flex -translate-x-1/2 items-center gap-2 rounded-full bg-black px-2 py-1.5 font-mono text-xs text-white shadow-[0_6px_24px_rgba(0,0,0,0.4)] ring-2 ring-fuchsia-500"
      style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
    >
      <button type="button" onClick={() => step(-1)} className="h-7 w-7 rounded-full hover:bg-white/15" aria-label="Previous variant">
        ←
      </button>
      <span className="min-w-[10rem] text-center">
        <strong>{current}</strong> · {variants[index]?.name}
      </span>
      <button type="button" onClick={() => step(1)} className="h-7 w-7 rounded-full hover:bg-white/15" aria-label="Next variant">
        →
      </button>
    </div>
  )
}
