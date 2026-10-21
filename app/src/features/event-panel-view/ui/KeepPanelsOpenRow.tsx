import { Switch } from '@shared/ui/switch'

interface KeepPanelsOpenRowProps {
  defaultExpanded: boolean
  onDefaultExpandedChange: (defaultExpanded: boolean) => void
}

/**
 * The panel preference — whether a card's roster panel starts open (ADR-0030 §6) — as a switch row.
 * The events page puts it last in the open filters (ADR-0030 §3).
 *
 * It is one page-wide setting, so it sits in the page header's control rather than inside each
 * panel: a control drawn once per open card reads as a per-card one, and charges every open panel a
 * row for a setting a member touches once.
 *
 * Prop-only: the preference lives in `event-panel-store`.
 */
export function KeepPanelsOpenRow({ defaultExpanded, onDefaultExpandedChange }: KeepPanelsOpenRowProps) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <div>
        <div className="text-small font-semibold">Keep panels open</div>
        <div className="mt-0.5 text-caption text-muted-foreground">
          {defaultExpanded ? 'On — every card starts open' : 'Off — tap to open a card'}
        </div>
      </div>
      <Switch checked={defaultExpanded} onCheckedChange={onDefaultExpandedChange} aria-label="Keep panels open" />
    </div>
  )
}
