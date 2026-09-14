import { useEffect, useState } from 'react'
import { LayoutList, LayoutGrid, Users } from 'lucide-react'
import type { ComponentType } from 'react'
import { SectionLabel } from '@shared/ui/SectionLabel'
import type { PanelView } from '../model/panel-preferences'

interface PanelViewMenuProps {
  view: PanelView
  onViewChange: (view: PanelView) => void
  defaultExpanded: boolean
  onDefaultExpandedChange: (defaultExpanded: boolean) => void
}

const VIEWS: { value: PanelView; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { value: 'pips', label: 'Positions', Icon: LayoutGrid },
  { value: 'members', label: 'People', Icon: Users },
]

/**
 * The events page's view control: an icon button beside `Filters` that opens a small popover holding
 * the two panel preferences — which view a card's roster panel opens onto, and whether it starts
 * open (ADR-0030 §5 and §6, as amended).
 *
 * **Why it is here rather than inside the panel**, which is where §5 first put it: both settings are
 * one global choice, and a control drawn once per open card reads as a per-card one however the
 * state is actually held. It also charged every open panel a row of chrome for a setting a member
 * touches once. The page header is where the scope is legible — beside the other page-level control,
 * at no vertical cost — and the list behind the popover still re-renders live, so the result is as
 * visible as it was from inside the panel.
 *
 * **Its own trigger, not a section inside `Filters`**, for the reason §3 draws the line at all: a
 * filter is "where was I" and this is "how do I like this". One popover holding both would be the
 * taxonomy the ADR spent a decision separating.
 *
 * No dot on the trigger, unlike `Filters`. A dot there warns that the list may be hiding events; a
 * non-default view hides nothing — the panel plainly shows what it shows.
 *
 * Prop-only apart from the popover's own open state: the preferences live in `event-panel-store`.
 */
export function PanelViewMenu({
  view,
  onViewChange,
  defaultExpanded,
  onDefaultExpandedChange,
}: PanelViewMenuProps) {
  const [open, setOpen] = useState(false)

  // Escape has to be caught on the document: focus stays on the trigger, which is a sibling of the
  // popover, so a handler on the panel itself would never see the key. Same as EventFiltersView.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="relative">
      <button
        aria-label="View options"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground"
      >
        <LayoutList size={16} />
      </button>

      {open && (
        <>
          {/* Click-outside catcher. Not focusable — Escape and the trigger are the keyboard paths. */}
          <div className="fixed inset-0 z-40 bg-black/20" aria-hidden="true" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-label="View options"
            className="card-shadow-hover absolute right-0 top-12 z-50 w-[248px] origin-top-right rounded-lg border border-border/60 bg-card p-3.5"
          >
            <div role="group" aria-labelledby="panel-view-heading">
              <SectionLabel as="h3" id="panel-view-heading" className="mb-2.5">
                Card panel shows
              </SectionLabel>
              <div className="flex flex-wrap gap-2">
                {VIEWS.map(({ value, label, Icon }) => {
                  const isActive = view === value
                  return (
                    <button
                      key={value}
                      aria-pressed={isActive}
                      onClick={() => onViewChange(value)}
                      className={[
                        'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption font-semibold transition-all',
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
            </div>

            <div className="-mx-3.5 my-3.5 h-px bg-border/60" />

            <div className="flex items-center justify-between gap-2.5">
              <div>
                <div className="text-small font-semibold">Keep panels open</div>
                <div className="mt-0.5 text-caption text-muted-foreground">
                  {defaultExpanded ? 'On — every card starts open' : 'Off — tap to open a card'}
                </div>
              </div>
              <button
                role="switch"
                aria-checked={defaultExpanded}
                aria-label="Keep panels open"
                onClick={() => onDefaultExpandedChange(!defaultExpanded)}
                className={[
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                  defaultExpanded ? 'bg-green' : 'bg-muted-foreground/30',
                ].join(' ')}
              >
                <span
                  className={[
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left] duration-200',
                    defaultExpanded ? 'left-[22px]' : 'left-0.5',
                  ].join(' ')}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
