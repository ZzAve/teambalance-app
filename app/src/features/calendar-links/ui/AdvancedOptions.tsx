import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { AttendanceState } from '@shared/api/calendar-links'
import type { EventTypeItem } from '@shared/api/event-types'
import { Chip } from '@shared/ui/chip'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Switch } from '@shared/ui/switch'
import { ALL_ATTENDANCE_STATES } from '@entities/event/lib/attendance-states'
import { ATTENDANCE_WORDS } from '@entities/event/lib/attendance-words'
import { EventTypeChip } from '@entities/event/ui/EventTypeChip'
import type { LinkOptions } from '../model/preset'

/** The server's calendar-name suffix limit (ADR-0040). */
const MAX_SUFFIX_LENGTH = 30

interface AdvancedOptionsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  options: LinkOptions
  teamName: string
  /** The types a member may pick, in the team's order. */
  eventTypes: EventTypeItem[]
  disabled?: boolean
  onChange: (options: LinkOptions) => void
}

export function AdvancedOptions({
  open,
  onOpenChange,
  options,
  teamName,
  eventTypes,
  disabled,
  onChange,
}: AdvancedOptionsProps) {
  const { t } = useTranslation()
  const panelId = useId()
  const statesId = useId()
  const typesId = useId()

  const toggleState = (state: AttendanceState) => {
    const included = options.attendanceStates.includes(state)
    // The server refuses an empty set: a link that serves nothing is not a link.
    if (included && options.attendanceStates.length === 1) return
    onChange({
      ...options,
      attendanceStates: included
        ? options.attendanceStates.filter((s) => s !== state)
        : [...options.attendanceStates, state],
    })
  }

  // No explicit list is every type, new ones included; deselecting the last picked type is that again.
  const toggleType = (typeId: string) => {
    const picked = options.eventTypeIds ?? []
    const next = picked.includes(typeId) ? picked.filter((id) => id !== typeId) : [...picked, typeId]
    onChange({ ...options, eventTypeIds: next.length > 0 ? next : undefined })
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-1 self-start text-small font-semibold text-muted-foreground hover:text-foreground"
      >
        {t('calendarLinks.advanced')}
        <ChevronDown size={16} aria-hidden="true" className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {open && (
        <div id={panelId} className="flex flex-col gap-4 rounded-md border border-border p-3">
          <div className="flex flex-col gap-2">
            <p id={statesId} className="text-small font-medium">
              {t('calendarLinks.includeAnswered')}
            </p>
            <div role="group" aria-labelledby={statesId} className="flex flex-wrap gap-2">
              {ALL_ATTENDANCE_STATES.map((state) => (
                <Chip
                  key={state}
                  pressed={options.attendanceStates.includes(state)}
                  disabled={disabled}
                  onToggle={() => toggleState(state)}
                  activeClassName="border-blue bg-blue/10 text-blue"
                  inactiveClassName="border-border text-muted-foreground"
                >
                  {ATTENDANCE_WORDS[state].word}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p id={typesId} className="text-small font-medium">
              {t('calendarLinks.includeTypes')}
            </p>
            <div role="group" aria-labelledby={typesId} className="flex flex-wrap gap-2">
              <Chip
                pressed={options.eventTypeIds === undefined}
                disabled={disabled}
                onToggle={() => onChange({ ...options, eventTypeIds: undefined })}
                activeClassName="border-blue bg-blue/10 text-blue"
                inactiveClassName="border-border text-muted-foreground"
              >
                {t('calendarLinks.allTypes')}
              </Chip>
              {eventTypes.map((type) => (
                <EventTypeChip
                  key={type.id}
                  type={type}
                  pressed={options.eventTypeIds?.includes(type.id) ?? false}
                  disabled={disabled}
                  onToggle={() => toggleType(type.id)}
                />
              ))}
            </div>
            <p className="text-caption text-muted-foreground">
              {options.eventTypeIds === undefined
                ? t('calendarLinks.laterIncluded')
                : t('calendarLinks.laterExcluded')}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-small font-medium">{t('calendarLinks.markAnswer')}</span>
            <Switch
              checked={options.showAttendancePrefix}
              disabled={disabled}
              onCheckedChange={(showAttendancePrefix) => onChange({ ...options, showAttendancePrefix })}
              aria-label={t('calendarLinks.markAnswerLabel')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${panelId}-suffix`}>{t('calendarLinks.suffix')}</Label>
            <Input
              id={`${panelId}-suffix`}
              value={options.calendarNameSuffix ?? ''}
              maxLength={MAX_SUFFIX_LENGTH}
              placeholder={t('calendarLinks.suffixPlaceholder')}
              disabled={disabled}
              onChange={(e) => onChange({ ...options, calendarNameSuffix: e.target.value || undefined })}
            />
            <p className="text-caption text-muted-foreground">
              {t('calendarLinks.shownAs', {
                name: options.calendarNameSuffix?.trim() ? `${teamName} · ${options.calendarNameSuffix.trim()}` : teamName,
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
