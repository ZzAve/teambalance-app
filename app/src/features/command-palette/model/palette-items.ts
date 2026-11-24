import type { Event } from '@shared/api/events'
import type { Member } from '@shared/api/members'
import type { AuthenticatedUser } from '@shared/api/auth'
import { teamRoutes, type TeamRoutes } from '@shared/lib/team-routes'
import { formatLocale, i18n } from '@shared/i18n/i18n'

/** Display order of the groups; filtering keeps it. */
export const PALETTE_GROUPS = ['events', 'members', 'goto', 'actions'] as const
export type PaletteGroup = (typeof PALETTE_GROUPS)[number]

export type AnswerState = 'ATTENDING' | 'MAYBE' | 'ABSENT'

export type PaletteAction =
  | { kind: 'navigate'; to: string }
  | { kind: 'answer'; eventId: string; state: AnswerState }

export interface PaletteItem {
  id: string
  group: PaletteGroup
  label: string
  /** Secondary text on the right: the event's date, a Shirt Number. */
  hint?: string
  /** Searched too, but not shown: event type, location, position. */
  keywords?: string
  action: PaletteAction
}

export interface PaletteInput {
  /** The nav tabs as useNavTabs gives them, so the teamless and money-off rules stay in one place. */
  tabs: { id: string; label: string; to: string }[]
  routes: TeamRoutes
  isAdmin: boolean
  /** Upcoming events; any already started are dropped here. */
  events: Event[]
  members: Member[]
  teams: AuthenticatedUser['teams']
  /** Null outside a Team (or parked on onboarding): only the tabs are offered then. */
  activeSlug: string | null
  now: Date
}

const ANSWERS: AnswerState[] = ['ATTENDING', 'MAYBE', 'ABSENT']

const when = (iso: string) =>
  new Date(iso).toLocaleString(formatLocale(), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

export function buildPaletteItems(input: PaletteInput): PaletteItem[] {
  const { tabs, routes, isAdmin, members, teams, activeSlug, now } = input
  const goto: PaletteItem[] = tabs.map((tab) => ({
    id: `goto:${tab.id}`,
    group: 'goto',
    label: tab.label,
    action: { kind: 'navigate', to: tab.to },
  }))
  if (activeSlug === null) return goto

  const upcoming = input.events
    .filter((e) => new Date(e.startTime).getTime() >= now.getTime())
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  const next = upcoming[0]

  return [
    ...upcoming.map<PaletteItem>((e) => ({
      id: `event:${e.id}`,
      group: 'events',
      label: e.title,
      hint: when(e.startTime),
      keywords: [e.eventType.name, e.location].filter(Boolean).join(' '),
      action: { kind: 'navigate', to: routes.event(e.id) },
    })),
    ...members.map<PaletteItem>((m) => ({
      id: `member:${m.userId}`,
      group: 'members',
      label: m.displayName,
      // The JSON carries null for "none", whatever the generated type says.
      hint: m.shirtNumber == null ? undefined : `#${m.shirtNumber}`,
      keywords: m.position?.label,
      action: { kind: 'navigate', to: routes.member(m.userId) },
    })),
    ...goto,
    ...(isAdmin
      ? [{ id: 'goto:team-settings', group: 'goto', label: i18n.t('palette.teamSettings'), action: { kind: 'navigate', to: routes.teamSettings } } satisfies PaletteItem]
      : []),
    ...(next
      ? ANSWERS.map<PaletteItem>((state) => ({
          id: `answer:${state}`,
          group: 'actions',
          label: i18n.t('palette.answer', { answer: i18n.t(`attendance.word.${state}`), event: next.title }),
          hint: when(next.startTime),
          action: { kind: 'answer', eventId: next.id, state },
        }))
      : []),
    ...(teams.length > 1
      ? teams
          .filter((team) => team.slug !== activeSlug)
          .map<PaletteItem>((team) => ({
            id: `switch:${team.slug}`,
            group: 'actions',
            label: i18n.t('palette.switchTeam', { team: team.name }),
            action: { kind: 'navigate', to: teamRoutes(team.slug).events },
          }))
      : []),
  ]
}

/** Lower case, accents stripped, so "lísa" finds "Lisa". */
const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

/** 0 label prefix, 1 word prefix in the label, 2 anywhere; null when a query word is missing. */
function score(item: PaletteItem, query: string, words: string[]): number | null {
  const label = fold(item.label)
  const haystack = `${label} ${fold(item.keywords ?? '')}`
  if (!words.every((w) => haystack.includes(w))) return null
  if (label.startsWith(query)) return 0
  if (label.split(/\s+/).some((w) => w.startsWith(words[0]))) return 1
  return 2
}

/** The items matching `query`, grouped in PALETTE_GROUPS order, best match first within a group. */
export function filterPaletteItems(items: PaletteItem[], query: string): PaletteItem[] {
  const q = fold(query.trim())
  const words = q.split(/\s+/).filter(Boolean)
  return items
    .map((item, index) => ({ item, index, score: words.length === 0 ? 0 : score(item, q, words) }))
    .filter((r): r is typeof r & { score: number } => r.score !== null)
    .sort(
      (a, b) =>
        PALETTE_GROUPS.indexOf(a.item.group) - PALETTE_GROUPS.indexOf(b.item.group) ||
        a.score - b.score ||
        a.index - b.index,
    )
    .map((r) => r.item)
}

/** The active option after an arrow key, wrapping at both ends. */
export function moveIndex(current: number, delta: number, length: number): number {
  if (length === 0) return 0
  return (current + delta + length) % length
}

type ShortcutKeys = Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey'>

export function isPaletteShortcut(e: ShortcutKeys): boolean {
  return e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey
}

/** The hint in the sidebar search field; `platform` is navigator.platform. */
export function shortcutHint(platform: string): string {
  return /Mac|iPhone|iPad/.test(platform) ? '⌘K' : 'Ctrl K'
}
