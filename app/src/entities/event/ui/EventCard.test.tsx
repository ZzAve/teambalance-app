import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import type { Event } from '@shared/api/events'
import { EventCard } from './EventCard'

// EventCard renders a TanStack Router <Link>, which needs a router context. We're
// testing the card's own rendering (the attendance summary + role-breakdown chips
// driven by the backend-computed AttendanceSummary), so we stub Link with a plain
// anchor that just renders its children — keeping the test isolated and fast.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children?: ReactNode }) => <a>{children}</a>,
}))

function makeEvent(overrides: Partial<Event['attendanceSummary']> = {}): Event {
  return {
    id: 'evt-002',
    eventType: { id: 'et-1', name: 'Match', color: '#3b82f6' },
    title: 'League Match vs Smash United',
    description: undefined,
    startTime: '2026-07-01T18:00:00+02:00',
    endTime: '2026-07-01T20:00:00+02:00',
    location: undefined,
    attendanceSummary: {
      attending: 5,
      maybe: 1,
      absent: 0,
      notResponded: 2,
      roleBreakdown: [
        { role: 'Outside Hitter', attending: 2 },
        { role: 'Libero', attending: 1 },
        { role: 'Opposite', attending: 1 },
        { role: 'Setter', attending: 1 },
      ],
      ...overrides,
    },
  }
}

describe('EventCard', () => {
  it('renders the going count and the attending-by-role chips', () => {
    render(<EventCard event={makeEvent()} />)

    expect(screen.getByText(/5 going/)).toBeInTheDocument()
    expect(screen.getByText('2 Outside Hitter')).toBeInTheDocument()
    expect(screen.getByText('1 Libero')).toBeInTheDocument()
    expect(screen.getByText('1 Opposite')).toBeInTheDocument()
    expect(screen.getByText('1 Setter')).toBeInTheDocument()
  })

  it('shows no role chips when nobody has responded yet', () => {
    render(
      <EventCard
        event={makeEvent({ attending: 0, maybe: 0, absent: 0, notResponded: 0, roleBreakdown: [] })}
      />,
    )

    expect(screen.getByText(/0 going/)).toBeInTheDocument()
    expect(screen.queryByText(/\d+\s+(Setter|Libero|Outside Hitter|Opposite)/)).not.toBeInTheDocument()
  })
})
