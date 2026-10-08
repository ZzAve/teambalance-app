import type { Position } from '@entities/position/api/positions'
import type { RosterRequirement } from '@shared/api/event-types'
import { Input } from '@shared/ui/input'
import { SectionLabel } from '@shared/ui/SectionLabel'
import { Switch } from '@shared/ui/switch'

interface RosterRequirementEditorProps {
  value: RosterRequirement
  positions: Position[]
  disabled?: boolean
  onChange: (next: RosterRequirement) => void
  /** Distinguishes the field ids when two editors are on screen at once. */
  idPrefix: string
}

/**
 * Edits one roster requirement: the tracking switch, the total headcount, and a count per position.
 *
 * Shared by the event-type default and the per-event override, because they are the same value and
 * must be authored the same way — two editors would be two chances to disagree about what a blank
 * field means.
 *
 * Blank and zero both mean "no target", and the requirement carries neither: a total is dropped to
 * undefined, and a position simply gets no entry. That is what the server does with a zero too, so
 * the form and the API agree without the form having to know the rule twice.
 */
export function RosterRequirementEditor({
  value,
  positions,
  disabled,
  onChange,
  idPrefix,
}: RosterRequirementEditorProps) {
  const targetFor = (positionId: string) =>
    value.positionTargets.find((t) => t.positionId === positionId)?.count

  const setTotal = (raw: string) => {
    const n = Number.parseInt(raw, 10)
    onChange({ ...value, totalTarget: Number.isFinite(n) && n > 0 ? n : undefined })
  }

  const setPositionTarget = (positionId: string, raw: string) => {
    const n = Number.parseInt(raw, 10)
    const others = value.positionTargets.filter((t) => t.positionId !== positionId)
    onChange({
      ...value,
      positionTargets:
        Number.isFinite(n) && n > 0 ? [...others, { positionId, count: n }] : others,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-small font-semibold">Track roster</div>
          <div className="mt-0.5 text-caption text-muted-foreground">
            {value.trackRoster
              ? 'On — the card shows who is covering which position'
              : 'Off — no roster panel on the card'}
          </div>
        </div>
        <Switch
          checked={value.trackRoster}
          disabled={disabled}
          aria-label="Track roster"
          // Targets are kept when tracking goes off, so switching it back on restores the lineup
          // instead of handing back an empty form. The server keeps them for the same reason.
          onCheckedChange={(trackRoster) => onChange({ ...value, trackRoster })}
        />
      </div>

      {/* Hidden rather than disabled when tracking is off: there is nothing to configure, and a
          greyed-out form invites fiddling with settings that have no effect. */}
      {value.trackRoster && (
        <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={`${idPrefix}-total`} className="text-small">
              People needed in total
              <span className="ml-1 text-caption text-muted-foreground">(optional)</span>
            </label>
            <Input
              id={`${idPrefix}-total`}
              type="number"
              min={0}
              max={200}
              inputMode="numeric"
              className="w-20"
              disabled={disabled}
              value={value.totalTarget ?? ''}
              placeholder="—"
              onChange={(e) => setTotal(e.target.value)}
            />
          </div>

          {positions.length === 0 ? (
            <p className="text-small text-muted-foreground">
              Add positions below to require a specific lineup.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <SectionLabel as="p">Per position</SectionLabel>
              {positions.map((position) => (
                <div key={position.id} className="flex items-center justify-between gap-3">
                  <label htmlFor={`${idPrefix}-pos-${position.id}`} className="truncate text-small">
                    {position.label}
                  </label>
                  <Input
                    id={`${idPrefix}-pos-${position.id}`}
                    type="number"
                    min={0}
                    max={99}
                    inputMode="numeric"
                    className="w-20"
                    disabled={disabled}
                    value={targetFor(position.id) ?? ''}
                    placeholder="—"
                    onChange={(e) => setPositionTarget(position.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
