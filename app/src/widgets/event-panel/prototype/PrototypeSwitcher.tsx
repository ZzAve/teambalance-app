import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, FlaskConical } from 'lucide-react'
import { VARIANTS, type PrototypeVariant } from './PrototypeLineupPanel'

/**
 * PROTOTYPE — throwaway. The floating variant switcher: left/right arrows (and the ← → keys) cycle
 * `?variant=`, so every variant is a shareable, reload-stable URL.
 *
 * Loud and obviously not part of the design being judged, and it never renders outside a dev build.
 */

interface PrototypeSwitcherProps {
  variant: PrototypeVariant
  demo: boolean
  onVariantChange: (variant: PrototypeVariant) => void
  onDemoChange: (demo: boolean) => void
}

export function PrototypeSwitcher({ variant, demo, onVariantChange, onDemoChange }: PrototypeSwitcherProps) {
  const index = Math.max(0, VARIANTS.findIndex((v) => v.key === variant))
  const step = (delta: number) => onVariantChange(VARIANTS[(index + delta + VARIANTS.length) % VARIANTS.length].key)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      // Never steal the arrow keys from something being typed into.
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (e.key === 'ArrowLeft') step(-1)
      if (e.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full bg-slate-900 py-1 pl-1 pr-2 text-white shadow-xl ring-1 ring-white/20">
        <button
          type="button"
          aria-label="Previous variant"
          onClick={() => step(-1)}
          className="flex size-8 items-center justify-center rounded-full hover:bg-white/15"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="flex items-center gap-1.5 px-1 text-xs font-semibold tabular-nums">
          <FlaskConical size={13} className="text-amber-300" />
          {VARIANTS[index].key} · {VARIANTS[index].name}
        </span>
        <button
          type="button"
          aria-label="Next variant"
          onClick={() => step(1)}
          className="flex size-8 items-center justify-center rounded-full hover:bg-white/15"
        >
          <ChevronRight size={16} />
        </button>
        <span className="mx-1 h-5 w-px bg-white/25" />
        <button
          type="button"
          aria-pressed={demo}
          onClick={() => onDemoChange(!demo)}
          title="Swap the real squad for a 18-person demo squad (edits stay in memory)"
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${demo ? 'bg-amber-300 text-slate-900' : 'bg-white/15 text-white/80'}`}
        >
          demo
        </button>
      </div>
    </div>
  )
}
