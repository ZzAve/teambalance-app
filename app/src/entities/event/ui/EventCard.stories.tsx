import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent, makeRoster } from '@shared/testing/event-fixtures'
import { allModes } from '../../../../.storybook/modes'
import { EventCard } from './EventCard'

// EventCard renders a TanStack Router <Link to="/events/$eventId">, which needs a router in context.
// The shared withRouter decorator supplies a minimal in-memory router so the link target resolves.
//
// `now` is a prop, so every relative-label state is a fixed render rather than a function of when
// the story happens to run — which is also what keeps the Chromatic snapshots stable.
const NOW = new Date(2026, 7, 10, 9, 0) // Monday 10 August 2026, 09:00 local
const on = (day: number, hour = 20, minute = 0) => new Date(2026, 7, day, hour, minute).toISOString()

// Token-sensitive component (ADR-0027 §3): the event-type colour chits on the card surface, so
// modes at the meta level give every state a light *and* a dark baseline.
const meta = {
  title: 'entities/event/EventCard',
  component: EventCard,
  decorators: [withRouter],
  args: { now: NOW },
  parameters: { chromatic: { modes: { light: allModes.light, dark: allModes.dark } } },
} satisfies Meta<typeof EventCard>

export default meta

type Story = StoryObj<typeof meta>

export const Populated: Story = {
  args: {
    event: makeEvent({ startTime: on(13, 14, 30), location: 'Sportcentrum Noord' }),
  },
  play: async ({ canvas }) => {
    // The date chit leads with weekday / day number / month, so the meta line needs no date.
    await expect(canvas.getByText('13')).toBeInTheDocument()
    await expect(canvas.getByText('14:30')).toBeInTheDocument()
    // The type text label stays alongside the chit's colour.
    await expect(canvas.getByText('Match')).toBeInTheDocument()
    await expect(canvas.getByText(/5 going/)).toBeInTheDocument()
    await expect(canvas.getByText(/of 8/)).toBeInTheDocument()
  },
}

// Three days out: inside the window, past the imminent band — a quiet grey label, no pill.
export const WithQuietRelativeLabel: Story = {
  args: { event: makeEvent({ startTime: on(13) }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('in 3 days')).toBeInTheDocument()
  },
}

// Tomorrow: the imminent band, so the label is the solid ink pill.
export const WithSolidRelativeLabel: Story = {
  args: { event: makeEvent({ startTime: on(11) }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tomorrow')).toBeInTheDocument()
  },
}

// Beyond RELATIVE_WINDOW_DAYS the chit's date says it better than "in 21 days" would.
export const WithoutRelativeLabel: Story = {
  args: { event: makeEvent({ startTime: on(31) }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('31')).toBeInTheDocument()
    await expect(canvas.queryByText(/^in \d+ days$/)).not.toBeInTheDocument()
    await expect(canvas.queryByText(/^(Today|Tomorrow|This weekend)$/)).not.toBeInTheDocument()
  },
}

// A social event: a different type colour tints the chit, and the text tag still names the type.
export const SocialEvent: Story = {
  args: {
    event: makeEvent({
      eventType: { id: 'et-4', name: 'Social', color: '#F4B400' },
      title: 'Season kick-off drinks',
      startTime: on(15, 21, 0),
      location: 'Café De Hoek',
      attendanceSummary: {
        attending: 11,
        maybe: 0,
        absent: 2,
        notResponded: 2,
        roleBreakdown: [],
      },
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Social')).toBeInTheDocument()
    await expect(canvas.getByText('Season kick-off drinks')).toBeInTheDocument()
    await expect(canvas.getByText(/11 going/)).toBeInTheDocument()
    // The 15th is the Saturday of the current week.
    await expect(canvas.getByText('This weekend')).toBeInTheDocument()
    // A social tracks no roster, so the card carries no status chip and no way to open a panel.
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

// The roster disclosure in place on a real card (#219): the chip sits at the end of the attendance
// row, collapsed, and the panel drops full-width beneath it. RosterDisclosure's own stories cover
// every roster state; this one proves the composition — that the card gives it room and that tapping
// the chip does not follow the card's stretched link.
export const WithRosterChip: Story = {
  args: {
    event: makeEvent({
      startTime: on(13, 14, 30),
      location: 'Sportcentrum Noord',
      roster: makeRoster({
        state: 'CRITICAL',
        openSlots: 2,
        totalAttending: 5,
        positions: [
          { id: 'pos-setter', label: 'Setter', required: 2, attending: 2 },
          { id: 'pos-libero', label: 'Libero', required: 1, attending: 0 },
          { id: 'pos-middle', label: 'Middle', required: 2, attending: 1 },
        ],
      }),
    }),
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('2 spots open')).toBeInTheDocument()
    // Collapsed on a list card until asked.
    await expect(canvas.queryByText(/the one to chase/)).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: /Show positions/ }))

    await expect(canvas.getByText('1 of 3 covered')).toBeInTheDocument()
    await expect(canvas.getByText(/still has no one/)).toBeInTheDocument()
  },
}

// Nobody has answered yet, but the team HAS members: they all sit in notResponded, so the denominator
// is real. Distinct from the zero-member card below (all counts zero).
export const NoResponses: Story = {
  args: {
    event: makeEvent({
      startTime: on(13),
      attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: 12, roleBreakdown: [] },
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/0 going/)).toBeInTheDocument()
    await expect(canvas.getByText(/of 12/)).toBeInTheDocument()
    await expect(canvas.getByText(/12 pending/)).toBeInTheDocument()
  },
}

// The zero-member state (ADR-0024 §5): an event on a team a Platform Admin created memberless and is
// still preparing. Every count is zero, so the denominator is zero — "0 going of 0" would read as
// broken, so the card says what is actually true: there is nobody on the roster yet.
export const NoMembersYet: Story = {
  args: {
    event: makeEvent({
      startTime: on(13),
      attendanceSummary: { attending: 0, maybe: 0, absent: 0, notResponded: 0, roleBreakdown: [] },
    }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No members yet')).toBeInTheDocument()
    // The broken-looking "of 0" denominator is not shown.
    await expect(canvas.queryByText(/of 0/)).not.toBeInTheDocument()
    await expect(canvas.queryByText(/going/)).not.toBeInTheDocument()
  },
}

export const WithReferences: Story = {
  args: {
    event: makeEvent({
      startTime: on(13),
      references: [
        { title: 'Nevobo', url: 'https://api.nevobo.nl/permalink/wedstrijd/2018133' },
        { title: 'Match form', url: 'https://dwf.volleybal.nl/match/42' },
        { title: 'Route', url: 'https://maps.example.com/hall' },
      ],
    }),
  },
  play: async ({ canvas, canvasElement }) => {
    // Two chips visible on the card, the third collapsed into "+1".
    await expect(canvas.getByRole('link', { name: /Nevobo/ })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: /Match form/ })).toBeInTheDocument()
    await expect(canvas.getByText('+1')).toBeInTheDocument()
    // Chips are siblings of (not nested in) the card's own <Link> anchor — no invalid <a> in <a>.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0)
  },
}

export const WithLocation: Story = {
  args: { event: makeEvent({ startTime: on(13), location: 'Sporthal De Boog' }) },
  play: async ({ canvas, canvasElement }) => {
    // The location renders as a real maps link that opens in a new tab...
    const maps = canvas.getByRole('link', { name: 'Sporthal De Boog' })
    await expect(maps).toHaveAttribute('href', expect.stringContaining('maps.google.com'))
    await expect(maps).toHaveAttribute('target', '_blank')
    // ...and it must NOT be nested inside the card's own <Link> anchor (invalid HTML — the
    // "<a> cannot contain a nested <a>" warning this fix removes). The card link and the maps
    // link are siblings; the card stays clickable via a stretched-link overlay.
    await expect(canvasElement.querySelectorAll('a a')).toHaveLength(0)
  },
}
