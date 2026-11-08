import { useEffect, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// PROTOTYPE ONLY. Floating variant switcher for throwaway UI prototypes (.claude/skills/prototype/UI.md).
// Deliberately styled unlike the app (inverted pill) so it never reads as part of the design.

interface PrototypeSwitcherProps<K extends string> {
  variants: { key: K; name: string }[]
  current: K
  onChange: (key: K) => void
  /** Extra prototype controls (e.g. a context toggle), rendered after the variant cycler. */
  children?: ReactNode
}

export function PrototypeSwitcher<K extends string>({ variants, current, onChange, children }: PrototypeSwitcherProps<K>) {
  const index = Math.max(0, variants.findIndex((v) => v.key === current))
  const step = (d: number) => onChange(variants[(index + d + variants.length) % variants.length].key)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el?.closest('input, textarea, [contenteditable="true"]')) return
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (import.meta.env.PROD) return null

  const btn = 'flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/15'
  return (
    <div
      className="fixed left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full bg-foreground px-1 text-small text-background shadow-lg"
      style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      <button type="button" className={btn} onClick={() => step(-1)} aria-label="Previous variant">
        <ChevronLeft size={18} />
      </button>
      <span className="min-w-36 text-center font-medium whitespace-nowrap">
        {variants[index].key} ({variants[index].name})
      </span>
      <button type="button" className={btn} onClick={() => step(1)} aria-label="Next variant">
        <ChevronRight size={18} />
      </button>
      {children}
    </div>
  )
}
