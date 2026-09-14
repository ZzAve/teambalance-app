import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { Stack } from '@shared/testing/stack'
import { EventRosterPanel, MEMBER_CAP } from './EventRosterPanel'

// What the card's roster disclosure opens onto: the position pips, or the team (ADR-0030 §5). The
// view is one global preference, now set from the page header (`PanelViewMenu`) rather than from
// inside the panel — so this component is content only, with no preference chrome of its own. The
// stories for the control itself live next to it. Prop-only (ADR-0017), and with no callback props
// at all — there is nothing here for a click to report, so this file has no Interactions story.
//
// Rendered inside the events page composite (EventsPageView), so per the ownership rule
// (ADR-0031 §3) its Data story is behavioural only — the composite's own picture already shows this
// panel, open, in context.
//
// Two-story shape (ADR-0031 §1):
//   1. Data — the pips view, disableSnapshot (picture owned by the page).
//   2. Shells — the member view, the cap, read-only and the social fallback, stacked in one frame —
//      this picture stays, since the composite's default frame cannot show an open panel at all.
const att = (
  userId: string,
  displayName: string,
  role: string,
  overrides: Partial<AttendanceEntry> = {},
): AttendanceEntry => ({
  id: userId,
  userId,
  displayName,
  role,
  state: 'ATTENDING',
  changedBy: undefined,
  updatedAt: undefined,
  ...overrides,
})

// Matches makeRoster(): Setter 2/2, Libero 1/1, Middle 1 of 2 — with one member who never answered,
// which is exactly what the list payload now carries and the detail page always did.
const TEAM: AttendanceEntry[] = [
  att('u-set1', 'Sanne', 'Setter'),
  att('u-set2', 'Sofia', 'Setter', { state: 'MAYBE' }),
  att('u-lib', 'Lars', 'Libero'),
  att('u-mid1', 'Milan', 'Middle'),
  att('u-mid2', 'Mees', 'Middle', { state: 'ABSENT' }),
  att('u-un', 'Uwe', 'Unassigned', { state: 'NOT_RESPONDED' }),
]

// A club side well past the cap (ADR-0030 §7): 18 members, so three are behind the see-all link.
const BIG_TEAM: AttendanceEntry[] = Array.from({ length: 18 }, (_, i) =>
  att(`u-${i}`, `Member ${i + 1}`, 'Unassigned', { state: i % 3 === 0 ? 'NOT_RESPONDED' : 'ATTENDING' }),
)

const TRACKED = makeEvent({ roster: makeRoster(), attendances: TEAM })

const meta = {
  title: 'widgets/event-panel/EventRosterPanel',
  component: EventRosterPanel,
  decorators: [withRouter],
  args: {
    event: TRACKED,
    view: 'pips',
    currentUserId: 'u-lib',
    detailHref: '/t/setpoint-vt/events/evt-002',
  },
} satisfies Meta<typeof EventRosterPanel>

export default meta

type Story = StoryObj<typeof meta>

// Picture owned by the page composite (pages/EventsPageView) — behavioural only (ADR-0031 §3).
export const Data: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Positions', { selector: 'span' })).toBeInTheDocument()
    // The pips view names no one.
    await expect(canvas.queryByText('Sanne')).not.toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        // Grouped by position, non-responders included and named (the whole point of the payload
        // change). The viewer's own row is marked.
        'Member view': <EventRosterPanel {...args} view="members" />,
        // Uncapped, one card on the member view is a screenful and the list stops being a list. 18
        // members: 15 on the card, the rest behind a link to the event.
        'Member list is capped at 15': (
          <EventRosterPanel {...args} view="members" event={makeEvent({ roster: makeRoster(), attendances: BIG_TEAM })} />
        ),
        // At or below the cap there is nothing behind a link, so no link.
        'No see-all link under the cap': <EventRosterPanel {...args} view="members" />,
        // Editing a teammate's attendance lives on detail-page rows only. Reusing AttendeeList here
        // must not extend that to the list page — so the rows carry the answer as a fact, with
        // nothing to open.
        'Member list is read-only': <EventRosterPanel {...args} view="members" />,
        // Tracking off: there are no pips to draw, so the panel is its people whatever the
        // preference says — which is what finally gives a social something to expand to (#324
        // cause 3). It no longer has to suppress a view switch to manage that, because there is no
        // switch on a card any more.
        'Social always shows members': (
          <EventRosterPanel
            {...args}
            view="pips"
            event={makeEvent({ roster: makeRoster({ ...NO_ROSTER, totalAttending: 4 }), attendances: TEAM })}
          />
        ),
      }}
    />
  ),
  play: async ({ canvas }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Member view').getByText('Sanne')).toBeInTheDocument()
    await expect(region('Member view').getByText('Uwe')).toBeInTheDocument()
    await expect(region('Member view').getByText('Awaiting')).toBeInTheDocument()
    await expect(region('Member view').getByText('You')).toBeInTheDocument()

    await expect(
      region('Member list is capped at 15').getByText(`Member ${MEMBER_CAP}`),
    ).toBeInTheDocument()
    await expect(
      region('Member list is capped at 15').queryByText(`Member ${MEMBER_CAP + 1}`),
    ).not.toBeInTheDocument()
    await expect(
      region('Member list is capped at 15').getByRole('link', { name: /See all 18/ }),
    ).toHaveAttribute('href', '/t/setpoint-vt/events/evt-002')

    await expect(
      region('No see-all link under the cap').queryByRole('link', { name: /See all/ }),
    ).not.toBeInTheDocument()

    await expect(region('Member list is read-only').getByText('Sanne')).toBeInTheDocument()
    // No per-row disclosure…
    await expect(
      region('Member list is read-only').queryByRole('button', { name: /Change .*'s answer/ }),
    ).not.toBeInTheDocument()
    // …and therefore no three-way control anywhere in the panel.
    await expect(
      region('Member list is read-only').queryByRole('button', { name: /^Going$/ }),
    ).not.toBeInTheDocument()
    await expect(
      region('Member list is read-only').queryByRole('button', { name: /^Can't$/ }),
    ).not.toBeInTheDocument()

    await expect(region('Social always shows members').getByText('Sanne')).toBeInTheDocument()
    // Even asked for pips, it shows people — there are none to draw.
    await expect(region('Social always shows members').queryByText('Positions')).not.toBeInTheDocument()
  },
}
