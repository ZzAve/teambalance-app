import type { CSSProperties, ReactNode } from 'react'

interface ChipProps {
  pressed: boolean
  onToggle: () => void
  activeClassName?: string
  inactiveClassName?: string
  activeStyle?: CSSProperties
  inactiveStyle?: CSSProperties
  children: ReactNode
}

/** A pill-shaped toggle button, `aria-pressed` when on. `type="button"` so it never submits a form it sits in. */
export function Chip({
  pressed,
  onToggle,
  activeClassName,
  inactiveClassName,
  activeStyle,
  inactiveStyle,
  children,
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      style={pressed ? activeStyle : inactiveStyle}
      className={[
        'shrink-0 rounded-full border px-3 py-1.5 text-caption font-semibold transition-all',
        pressed ? activeClassName : inactiveClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}
