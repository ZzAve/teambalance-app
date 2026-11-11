import { describe, expect, it } from 'vitest'
import { eventValuesFor, isHome, matchEventTypeId, opponentOf } from './match-feed'

const match = {
  code: 'EA',
  link: 'https://api.nevobo.nl/permalink/wedstrijd/1',
  startTime: '2026-11-13T18:30:00Z',
  homeTeam: 'Servylo HS 1',
  awayTeam: 'Tovo HS 4',
  venue: 'De Mammoet',
  address: 'De Mammoet, Calslaan 101, 2804RT Gouda',
}

describe('match feed helpers', () => {
  it('reads an away match from the team name, ignoring case and spaces', () => {
    expect(isHome(match, ' tovo hs 4 ')).toBe(false)
    expect(opponentOf(match, ' tovo hs 4 ')).toBe('Servylo HS 1')
  })

  it('reads a home match', () => {
    expect(isHome(match, 'Servylo HS 1')).toBe(true)
    expect(opponentOf(match, 'Servylo HS 1')).toBe('Tovo HS 4')
  })

  it('starts a match event from the feed values', () => {
    expect(eventValuesFor(match)).toEqual({
      title: 'Servylo HS 1 - Tovo HS 4',
      startTime: '2026-11-13T18:30:00Z',
      location: 'De Mammoet, Calslaan 101, 2804RT Gouda',
      references: [{ title: 'Nevobo', url: 'https://api.nevobo.nl/permalink/wedstrijd/1' }],
    })
    expect(eventValuesFor({ ...match, address: undefined }).location).toBe('De Mammoet')
  })

  it('picks the seeded Match type, else a type named like a match, never an archived one', () => {
    const training = { id: 't', name: 'Training', archived: false }
    expect(matchEventTypeId([training, { id: 'c0000000-0000-0000-0000-000000000002', name: 'Match', archived: false }])).toBe(
      'c0000000-0000-0000-0000-000000000002',
    )
    expect(matchEventTypeId([training, { id: 'w', name: 'Competitiewedstrijd', archived: false }])).toBe('w')
    expect(matchEventTypeId([training, { id: 'w', name: 'Wedstrijd', archived: true }])).toBeUndefined()
  })
})
