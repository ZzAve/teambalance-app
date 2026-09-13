import { LayoutGrid, Users } from 'lucide-react'
import type { ComponentType } from 'react'
import type { PanelView } from '../model/panel-preferences'

interface PanelPreferencesBarProps {
  /** Null on an event with no lineup to draw: there is only one view, so there is nothing to pick. */
  view: PanelView | null
  onViewChange: (view: PanelView) => void
  defaultExpanded: boolean
  onDefaultExpandedChange: (defaultExpanded: boolean) => void
}

const VIEWS: { value: PanelView; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { value: 'pips', label: 'Positions', Icon: LayoutGrid },
  { value: 'members', label: 'People', Icon: Users },
]

/**
 * The panel's own footer: which view it shows, and whether it starts open. Both are one *global*
 * preference each, not per card (ADR-0030 §5) — which of the two you think in is a taste, and a
 * per-card switch would persist a great deal of state for one.
 *
 * It lives inside the panel rather than in the filter popover for the same reason: a display switch
 * belongs where its result is visible. Prop-only; the store is wired in by the events route.
 */
export function PanelPreferencesBar({
  view,
  onViewChange,
  defaultExpanded,
  onDefaultExpandedChange,
}: PanelPreferencesBarProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-2.5">
      {view !== null && (
        <div className="flex gap-1" role="group" aria-label="Panel view">
          {VIEWS.map(({ value, label, Icon }) => {
            const isActive = view === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onViewChange(value)}
                className={[
                  'flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors',
                  isActive
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground',
                ].join(' ')}
              >
                <Icon size={12} />
                {label}
              </button>
            )
          })}
        </div>
      )}

      <button
        type="button"
        aria-pressed={defaultExpanded}
        onClick={() => onDefaultExpandedChange(!defaultExpanded)}
        className={[
          'ml-auto shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors',
          defaultExpanded ? 'border-blue bg-blue/10 text-blue' : 'border-border text-muted-foreground',
        ].join(' ')}
      >
        Keep open
      </button>
    </div>
  )
}
