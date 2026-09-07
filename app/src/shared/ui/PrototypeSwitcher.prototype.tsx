/**
 * PROTOTYPE — throwaway. Do not ship. (#271 gap, follow-up to #275)
 *
 * Floating variant switcher: ← / label / →, cycling the `?variant=` search param. Deliberately
 * high-contrast so it reads as scaffolding rather than part of the design under evaluation.
 * Hidden unless DEV, so a stray merge cannot show it to a user.
 */
import { useEffect } from 'react'

interface PrototypeSwitcherProps {
  variants: string[]
  names?: Record<string, string>
  current: string
  onChange: (variant: string) => void
}

export function PrototypeSwitcher({ variants, names, current, onChange }: PrototypeSwitcherProps) {
  const index = Math.max(0, variants.indexOf(current))
  const step = (delta: number) => onChange(variants[(index + delta + variants.length) % variants.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el as HTMLElement)?.isContentEditable) return
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/90 px-1.5 py-1.5 text-white shadow-2xl ring-1 ring-white/20">
      <button onClick={() => step(-1)} className="rounded-full px-3 py-1 text-lg leading-none hover:bg-white/15" aria-label="Previous variant">←</button>
      <span className="min-w-[13rem] text-center text-xs font-bold tabular-nums">
        {current}{names?.[current] ? ` · ${names[current]}` : ''}
      </span>
      <button onClick={() => step(1)} className="rounded-full px-3 py-1 text-lg leading-none hover:bg-white/15" aria-label="Next variant">→</button>
    </div>
  )
}
