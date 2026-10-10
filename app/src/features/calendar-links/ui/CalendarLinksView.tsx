import { useId, useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'
import type { AttendanceState, CalendarLink, CalendarLinkRequest } from '@shared/api/calendar-links'
import { Button } from '@shared/ui/button'
import { Chip } from '@shared/ui/chip'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'
import { Switch } from '@shared/ui/switch'
import { ConfirmDialog } from '@shared/ui/ConfirmDialog'
import { FormError } from '@shared/ui/FormError'
import { QueryErrorState } from '@shared/ui/QueryErrorState'
import { formatDate, linkDisplayLabel, toGoogleCalendarUrl, toWebcalUrl } from '../lib/calendar-urls'
import { optionsSummary } from '../model/options-summary'
import { ALL_ATTENDANCE_STATES, ATTENDANCE_STATE_LABELS } from '@entities/event/lib/attendance-states'
import { PRESET_OPTIONS, presetOf, type LinkOptions, type Preset } from '../model/preset'

/** The server's per-member cap, expired links included (ADR-0039). */
const MAX_LINKS = 3
/** The server's label limit. */
const MAX_LABEL_LENGTH = 50
/** What picking Partner fills an empty label with. */
const PARTNER_LABEL = 'Partner'
/** The server's calendar-name suffix limit (ADR-0040). */
const MAX_SUFFIX_LENGTH = 30

const PRESETS: { value: Preset; label: string }[] = [
  { value: 'me', label: 'Me' },
  { value: 'partner', label: 'Partner' },
  { value: 'custom', label: 'Custom' },
]

interface CalendarLinksViewProps {
  /** The Active Team's name, which a link's calendar is named after. */
  teamName: string
  /** The member's links in this team, newest first, as the server returned them. */
  links?: CalendarLink[]
  isLoading?: boolean
  isError?: boolean
  /** A create or delete is in flight. */
  isSaving?: boolean
  /** The last create or delete failed. */
  actionError?: boolean
  /** The link whose URL was just copied, so its button can say so. */
  copiedId?: string | null
  /** The link whose clipboard write the browser refused, so its URL can be copied by hand. */
  copyFailedId?: string | null
  onGenerate: (request: CalendarLinkRequest) => void
  onDelete: (id: string) => void
  onCopy: (link: CalendarLink) => void
  onRetry: () => void
}

/**
 * The member's calendar links for this team: a short explainer, the list with its per-link actions,
 * and the generate form. Prop-only; the query, the mutations, the clipboard write and the copied
 * flag live in the CalendarLinks container (ADR-0017). Owns only the create form (label, preset and
 * options) and the delete-confirm target.
 */
export function CalendarLinksView({
  teamName,
  links = [],
  isLoading,
  isError,
  isSaving,
  actionError,
  copiedId,
  copyFailedId,
  onGenerate,
  onDelete,
  onCopy,
  onRetry,
}: CalendarLinksViewProps) {
  const [label, setLabel] = useState('')
  const [options, setOptions] = useState<LinkOptions>(PRESET_OPTIONS.me)
  // Any edit makes the form Custom, even one that lands back on a preset's shape: the member chose
  // their own options, and the control should say so until they pick a preset again.
  const [customised, setCustomised] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const preset: Preset = customised ? 'custom' : presetOf(options)
  const [confirmTarget, setConfirmTarget] = useState<CalendarLink | null>(null)
  const atCap = links.length >= MAX_LINKS

  return (
    <div className="flex flex-col gap-6">
      <p className="text-small text-muted-foreground">
        Subscribe to your team's events once and your phone's calendar stays in sync. Changes can take
        up to a day to appear on Google Calendar.
      </p>

      {isLoading && <p className="text-small text-muted-foreground">Loading…</p>}
      {isError && (
        <QueryErrorState
          title="Couldn't load your calendar links"
          description="Check your connection and try again."
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && (
        <>
          {links.length === 0 ? (
            <p className="text-small text-muted-foreground">No calendar links yet.</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {links.map((link) => (
                <CalendarLinkRow
                  key={link.id}
                  link={link}
                  teamName={teamName}
                  copied={copiedId === link.id}
                  copyFailed={copyFailedId === link.id}
                  isSaving={isSaving}
                  onCopy={onCopy}
                  onRequestDelete={setConfirmTarget}
                />
              ))}
            </ul>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              onGenerate({
                label: label.trim() || undefined,
                attendanceStates: ALL_ATTENDANCE_STATES.filter((state) => options.attendanceStates.includes(state)),
                showAttendancePrefix: options.showAttendancePrefix,
                calendarNameSuffix: options.calendarNameSuffix?.trim() || undefined,
                eventTypeIds: undefined,
              })
              setLabel('')
              setOptions(PRESET_OPTIONS.me)
              setCustomised(false)
              setAdvancedOpen(false)
            }}
          >
            <PresetControl
              value={preset}
              teamName={teamName}
              disabled={atCap}
              onChange={(next) => {
                if (next === 'custom') {
                  setCustomised(true)
                  setAdvancedOpen(true)
                  return
                }
                setOptions(PRESET_OPTIONS[next])
                setCustomised(false)
                if (next === 'partner' && label.trim() === '') setLabel(PARTNER_LABEL)
                // Back to Me takes Partner's auto-filled label with it; a label the member typed stays.
                if (next === 'me' && label === PARTNER_LABEL) setLabel('')
              }}
            />

            <div className="flex flex-col gap-2">
              <Label htmlFor="calendar-link-label">Label (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="calendar-link-label"
                  value={label}
                  maxLength={MAX_LABEL_LENGTH}
                  placeholder="e.g. My phone"
                  disabled={atCap}
                  onChange={(e) => setLabel(e.target.value)}
                />
                <Button type="submit" disabled={atCap || isSaving}>
                  Generate link
                </Button>
              </div>
            </div>

            <AdvancedOptions
              open={advancedOpen}
              onOpenChange={setAdvancedOpen}
              options={options}
              teamName={teamName}
              disabled={atCap}
              onChange={(next) => {
                setOptions(next)
                setCustomised(true)
              }}
            />
            {atCap && (
              <p className="text-small text-muted-foreground">
                You have {MAX_LINKS} links, the maximum. Delete one to generate a new link.
              </p>
            )}
            {actionError && <FormError>Something went wrong. Please try again.</FormError>}
          </form>

          <ConfirmDialog
            open={confirmTarget !== null}
            title="Delete calendar link?"
            description="Every calendar subscribed with this link stops updating."
            confirmLabel="Delete link"
            onConfirm={() => {
              if (confirmTarget) onDelete(confirmTarget.id)
              setConfirmTarget(null)
            }}
            onCancel={() => setConfirmTarget(null)}
          />
        </>
      )}
    </div>
  )
}

interface PresetControlProps {
  value: Preset
  teamName: string
  disabled?: boolean
  onChange: (preset: Preset) => void
}

/** Me / Partner / Custom as a native radiogroup, the ThemeToggleView pattern, with an explainer popover. */
function PresetControl({ value, teamName, disabled, onChange }: PresetControlProps) {
  const headingId = useId()
  const groupName = useId()

  return (
    <div>
      <div className="flex items-center gap-1">
        <h3 id={headingId} className="text-small font-semibold text-muted-foreground">
          Who is this calendar for?
        </h3>
        {/* Radix Popover opens on click/tap, so it works on a phone where hover does not exist. */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="About Me and Partner"
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <Info size={16} aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2">
            <p>
              <strong>Me:</strong> everything the team schedules, with your answer marked.
            </p>
            <p>
              <strong>Partner:</strong> only events you are attending, no marks, calendar named
              &apos;{teamName} · Partner&apos;.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <div
        role="radiogroup"
        aria-labelledby={headingId}
        className="mt-2 grid grid-cols-3 gap-1 rounded-md border border-border bg-card p-1"
      >
        {PRESETS.map(({ value: option, label }) => {
          const selected = value === option
          return (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name={groupName}
                value={option}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(option)}
                className="peer sr-only"
              />
              <span
                className={[
                  'flex min-h-11 items-center justify-center rounded-lg text-caption font-semibold transition-colors',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card',
                  selected ? 'bg-blue/10 text-blue' : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

interface AdvancedOptionsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  options: LinkOptions
  teamName: string
  disabled?: boolean
  onChange: (options: LinkOptions) => void
}

function AdvancedOptions({ open, onOpenChange, options, teamName, disabled, onChange }: AdvancedOptionsProps) {
  const panelId = useId()
  const statesId = useId()

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

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-1 self-start text-small font-semibold text-muted-foreground hover:text-foreground"
      >
        Advanced
        <ChevronDown size={16} aria-hidden="true" className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {open && (
        <div id={panelId} className="flex flex-col gap-4 rounded-md border border-border p-3">
          <div className="flex flex-col gap-2">
            <p id={statesId} className="text-small font-medium">
              Include events you answered
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
                  {ATTENDANCE_STATE_LABELS[state]}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-small font-medium">Mark your answer (✓ ? ✗) on titles</span>
            <Switch
              checked={options.showAttendancePrefix}
              disabled={disabled}
              onCheckedChange={(showAttendancePrefix) => onChange({ ...options, showAttendancePrefix })}
              aria-label="Mark your answer on titles"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${panelId}-suffix`}>Calendar name suffix (optional)</Label>
            <Input
              id={`${panelId}-suffix`}
              value={options.calendarNameSuffix ?? ''}
              maxLength={MAX_SUFFIX_LENGTH}
              placeholder="e.g. Partner"
              disabled={disabled}
              onChange={(e) => onChange({ ...options, calendarNameSuffix: e.target.value || undefined })}
            />
            <p className="text-caption text-muted-foreground">
              Your calendar app shows it as &apos;{teamName}
              {options.calendarNameSuffix?.trim() ? ` · ${options.calendarNameSuffix.trim()}` : ''}&apos;.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface CalendarLinkRowProps {
  link: CalendarLink
  teamName: string
  copied: boolean
  copyFailed: boolean
  isSaving?: boolean
  onCopy: (link: CalendarLink) => void
  onRequestDelete: (link: CalendarLink) => void
}

function CalendarLinkRow({ link, teamName, copied, copyFailed, isSaving, onCopy, onRequestDelete }: CalendarLinkRowProps) {
  const name = linkDisplayLabel(link)
  const summary = optionsSummary(link, teamName)

  return (
    <li aria-label={name} className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate font-medium" title={name}>
          {name}
        </span>
        {link.expired && (
          <span className="shrink-0 rounded-full bg-red/10 px-2 py-0.5 text-caption font-semibold text-red">
            Expired
          </span>
        )}
      </div>
      <p className="text-small text-muted-foreground">
        {link.expired ? 'Expired' : 'Expires'} {formatDate(link.expiresAt)}
      </p>
      {summary && <p className="text-small text-muted-foreground">{summary}</p>}
      <div className="flex flex-wrap gap-2">
        {link.url ? (
          <>
            <Button asChild size="sm" variant="outline">
              <a href={toWebcalUrl(link.url)}>Open in Calendar</a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={toGoogleCalendarUrl(link.url)} target="_blank" rel="noopener noreferrer">
                Add to Google Calendar
              </a>
            </Button>
            <Button size="sm" variant="outline" onClick={() => onCopy(link)}>
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
          </>
        ) : (
          // A key rotation leaves a link whose token cannot be decrypted: it still counts toward the
          // cap, so it stays listed to be deleted, but there is no URL to offer.
          <p className="text-small text-muted-foreground">This link can no longer be shown.</p>
        )}
        <Button size="sm" variant="ghost" className="text-red" disabled={isSaving} onClick={() => onRequestDelete(link)}>
          Delete
        </Button>
      </div>
      {copyFailed && link.url && (
        <div className="flex flex-col gap-2">
          <FormError>Couldn't copy automatically. Copy the link below.</FormError>
          <Input
            readOnly
            aria-label={`Calendar link URL for ${name}`}
            value={link.url}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
    </li>
  )
}
