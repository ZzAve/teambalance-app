// PROTOTYPE — throwaway. Floating variant switcher for UI prototypes; never rendered in production.
import { useEffect } from 'react'

interface PrototypeSwitcherProps {
  variants: { key: string; name: string }[]
  current: string
  onChange: (key: string) => void
}

export function PrototypeSwitcher({ variants, current, onChange }: PrototypeSwitcherProps) {
  const index = Math.max(0, variants.findIndex((v) => v.key === current))
  const step = (delta: number) => onChange(variants[(index + delta + variants.length) % variants.length].key)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, [contenteditable]')) return
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (import.meta.env.PROD) return null

  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black px-4 py-2 text-small font-semibold text-white shadow-lg">
      <button type="button" aria-label="Previous variant" onClick={() => step(-1)}>
        ←
      </button>
      <span>
        {variants[index].key} ({variants[index].name})
      </span>
      <button type="button" aria-label="Next variant" onClick={() => step(1)}>
        →
      </button>
    </div>
  )
}
