import { describe, expect, it } from 'vitest'
import type { Event } from '@shared/api/events'
import type { Member } from '@shared/api/members'
import { teamRoutes } from '@shared/lib/team-routes'
import {
  buildPaletteItems,
  filterPaletteItems,
  isPaletteShortcut,
  moveIndex,
  shortcutHint,
  type PaletteInput,
} from './palette-items'

const routes = teamRoutes('setpoint')
const NOW = new Date('2026-11-17T12:00:00Z')

function event(id: string, title: string, startTime: string, extra: Partial<Event> = {}): Event {
  return {
    id,
    title,
    startTime,
    endTime: startTime,
    eventType: { id: 'type-1', name: 'Training', color: undefined },
    location: undefined,
    description: undefined,
    myState: 'NOT_RESPONDED',
    ...extra,
  } as unknown as Event
}

function member(userId: string, displayName: string, extra: Partial<Member> = {}): Member {
  return {
    userId,
    displayName,
    role: 'USER',
    position: undefined,
    onboarded: true,
    shirtNumber: undefined,
    photoVersion: undefined,
    ...extra,
  }
}

const tabs = [
  { id: 'events', label: 'Events', to: routes.events },
  { id: 'team', label: 'Team', to: routes.team },
  { id: 'profile', label: 'Profile', to: '/account' },
]

function input(overrides: Partial<PaletteInput> = {}): PaletteInput {
  return {
    tabs,
    routes,
    isAdmin: false,
    events: [
      event('e2', 'Match vs Dynamo', '2026-11-21T19:00:00Z', { location: 'Sporthal Oost' }),
      event('e1', 'Training', '2026-11-18T19:00:00Z'),
    ],
    members: [member('u1', 'Lisa de Vries', { shirtNumber: 7 }), member('u2', 'Jan Bakker')],
    teams: [{ id: 't1', name: 'Setpoint', slug: 'setpoint' }],
    activeSlug: 'setpoint',
    now: NOW,
    ...overrides,
  }
}

describe('buildPaletteItems', () => {
  it('lists upcoming events in start order, opening the event detail', () => {
    const items = buildPaletteItems(input()).filter((i) => i.group === 'events')
    expect(items.map((i) => i.label)).toEqual(['Training', 'Match vs Dynamo'])
    expect(items[0].action).toEqual({ kind: 'navigate', to: routes.event('e1') })
  })

  it('drops events that already started', () => {
    const items = buildPaletteItems(input({ events: [event('old', 'Old', '2026-11-16T19:00:00Z')] }))
    expect(items.filter((i) => i.group === 'events' || i.group === 'actions')).toEqual([])
  })

  it('lists members, opening the member page', () => {
    const items = buildPaletteItems(input()).filter((i) => i.group === 'members')
    expect(items.map((i) => i.label)).toEqual(['Lisa de Vries', 'Jan Bakker'])
    expect(items[0].action).toEqual({ kind: 'navigate', to: routes.member('u1') })
    expect(items[0].hint).toBe('#7')
  })

  it('shows no Shirt Number hint when the API sends null for it', () => {
    const items = buildPaletteItems(input({ members: [member('u3', 'Tom', { shirtNumber: null as unknown as undefined })] }))
    expect(items.find((i) => i.group === 'members')?.hint).toBeUndefined()
  })

  it('turns the nav tabs into Go to items, plus Team settings for an admin only', () => {
    const plain = buildPaletteItems(input()).filter((i) => i.group === 'goto')
    expect(plain.map((i) => i.label)).toEqual(['Events', 'Team', 'Profile'])

    const admin = buildPaletteItems(input({ isAdmin: true })).filter((i) => i.group === 'goto')
    expect(admin.map((i) => i.label)).toEqual(['Events', 'Team', 'Profile', 'Team settings'])
    expect(admin[3].action).toEqual({ kind: 'navigate', to: routes.teamSettings })
  })

  it('offers the three answers for the next event', () => {
    const actions = buildPaletteItems(input()).filter((i) => i.group === 'actions')
    expect(actions.map((i) => i.label)).toEqual(['Going: Training', 'Maybe: Training', "Can't: Training"])
    expect(actions[1].action).toEqual({ kind: 'answer', eventId: 'e1', state: 'MAYBE' })
  })

  it('offers switching to each other team only when there is more than one', () => {
    expect(buildPaletteItems(input()).some((i) => i.id.startsWith('switch:'))).toBe(false)

    const teams = [
      { id: 't1', name: 'Setpoint', slug: 'setpoint' },
      { id: 't2', name: 'Dames 2', slug: 'dames-2' },
    ]
    const switches = buildPaletteItems(input({ teams })).filter((i) => i.id.startsWith('switch:'))
    expect(switches.map((i) => i.label)).toEqual(['Switch to Dames 2'])
    expect(switches[0].action).toEqual({ kind: 'navigate', to: teamRoutes('dames-2').events })
  })

  it('has no team-scoped items without a team', () => {
    const items = buildPaletteItems(
      input({ activeSlug: null, routes: teamRoutes(null), isAdmin: true, tabs: [tabs[2]], teams: [] }),
    )
    expect(items.map((i) => i.label)).toEqual(['Profile'])
  })
})

describe('filterPaletteItems', () => {
  const items = buildPaletteItems(input({ isAdmin: true }))

  it('returns everything in group order for an empty query', () => {
    const groups = filterPaletteItems(items, '  ').map((i) => i.group)
    expect(groups).toEqual([...groups].sort((a, b) => GROUPS.indexOf(a) - GROUPS.indexOf(b)))
    expect(groups).toHaveLength(items.length)
  })

  it('matches case- and accent-insensitively', () => {
    const labels = filterPaletteItems(items, 'LÍSA').map((i) => i.label)
    expect(labels).toEqual(['Lisa de Vries'])
  })

  it('matches on keywords such as the location', () => {
    expect(filterPaletteItems(items, 'oost').map((i) => i.label)).toEqual(['Match vs Dynamo'])
  })

  it('matches every word of the query, in any order', () => {
    expect(filterPaletteItems(items, 'vries lisa').map((i) => i.label)).toEqual(['Lisa de Vries'])
  })

  it('ranks a label prefix above a word prefix above a substring, within a group', () => {
    const ranked = filterPaletteItems(
      [
        { id: 'a', group: 'members', label: 'Maartje Stam', action: { kind: 'navigate', to: '/a' } },
        { id: 'b', group: 'members', label: 'Tom Stam', action: { kind: 'navigate', to: '/b' } },
        { id: 'c', group: 'members', label: 'Stamos', action: { kind: 'navigate', to: '/c' } },
      ],
      'stam',
    )
    expect(ranked.map((i) => i.id)).toEqual(['c', 'a', 'b'])
  })

  it('returns nothing when no item matches', () => {
    expect(filterPaletteItems(items, 'zzz')).toEqual([])
  })
})

const GROUPS = ['events', 'members', 'goto', 'actions']

describe('moveIndex', () => {
  it('moves and wraps around both ends', () => {
    expect(moveIndex(0, 1, 3)).toBe(1)
    expect(moveIndex(2, 1, 3)).toBe(0)
    expect(moveIndex(0, -1, 3)).toBe(2)
  })

  it('stays at 0 for an empty list', () => {
    expect(moveIndex(0, 1, 0)).toBe(0)
    expect(moveIndex(0, -1, 0)).toBe(0)
  })
})

describe('isPaletteShortcut', () => {
  it('is Cmd+K or Ctrl+K, nothing else', () => {
    expect(isPaletteShortcut({ key: 'k', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false })).toBe(true)
    expect(isPaletteShortcut({ key: 'K', metaKey: false, ctrlKey: true, altKey: false, shiftKey: false })).toBe(true)
    expect(isPaletteShortcut({ key: 'k', metaKey: false, ctrlKey: false, altKey: false, shiftKey: false })).toBe(false)
    expect(isPaletteShortcut({ key: 'k', metaKey: true, ctrlKey: false, altKey: false, shiftKey: true })).toBe(false)
    expect(isPaletteShortcut({ key: 'j', metaKey: true, ctrlKey: false, altKey: false, shiftKey: false })).toBe(false)
  })
})

describe('shortcutHint', () => {
  it('shows ⌘K on Apple platforms and Ctrl K elsewhere', () => {
    expect(shortcutHint('MacIntel')).toBe('⌘K')
    expect(shortcutHint('iPad')).toBe('⌘K')
    expect(shortcutHint('Win32')).toBe('Ctrl K')
    expect(shortcutHint('Linux x86_64')).toBe('Ctrl K')
  })
})
