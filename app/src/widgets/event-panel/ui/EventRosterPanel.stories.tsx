import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import type { AttendanceEntry } from '@shared/api/events'
import { withRouter } from '@shared/testing/router-decorator'
import { makeEvent, makeRoster, NO_ROSTER } from '@shared/testing/event-fixtures'
import { allModes } from '../../../../.storybook/modes'
import { EventRosterPanel, MEMBER_CAP } from './EventRosterPanel'

// What the card's roster disclosure opens onto: the position pips, or the team (ADR-0030 §5). The
// view is one global preference switched from the bar at the foot of the panel; `Keep open` is the
// second. Prop-only (ADR-0017) — the store is wired in by the events route.
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
    onViewChange: fn(),
    defaultExpanded: false,
    onDefaultExpandedChange: fn(),
    currentUserId: 'u-lib',
    detailHref: '/t/setpoint-vt/events/evt-002',
  },
  parameters: { chromatic: { modes: { light: allModes.light, dark: allModes.dark } } },
} satisfies Meta<typeof EventRosterPanel>

export default meta

type Story = StoryObj<typeof meta>

// ── The two views ────────────────────────────────────────────────────────────────────────────────

export const PipsView: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Positions', { selector: 'span' })).toBeInTheDocument()
    // The pips view names no one.
    await expect(canvas.queryByText('Sanne')).not.toBeInTheDocument()
  },
}

export const MembersView: Story = {
  args: { view: 'members' },
  play: async ({ canvas }) => {
    // Grouped by position, non-responders included and named (the whole point of the payload change).
    await expect(canvas.getByText('Sanne')).toBeInTheDocument()
    await expect(canvas.getByText('Uwe')).toBeInTheDocument()
    await expect(canvas.getByText('Awaiting')).toBeInTheDocument()
    // The viewer's own row is marked.
    await expect(canvas.getByText('You')).toBeInTheDocument()
  },
}

// ── The switch — prove the callback, not just the render (ADR-0030 §5) ───────────────────────────

export const SwitchingToMembersIsReported: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('button', { name: 'Positions' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'People' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('members')
  },
}

export const SwitchingBackToPipsIsReported: Story = {
  args: { view: 'members' },
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('button', { name: 'People' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Positions' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('pips')
  },
}

export const KeepOpenIsReported: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const keepOpen = canvas.getByRole('button', { name: 'Keep open' })
    await expect(keepOpen).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(keepOpen)
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(true)
  },
}

export const KeepOpenAlreadyOn: Story = {
  args: { defaultExpanded: true },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Keep open' }))
    await expect(args.onDefaultExpandedChange).toHaveBeenCalledWith(false)
  },
}

// ── The cap (ADR-0030 §7) ────────────────────────────────────────────────────────────────────────

// Uncapped, one card on the member view is a screenful and the list stops being a list. 18 members:
// 15 on the card, the rest behind a link to the event.
export const MemberListIsCappedAt15: Story = {
  args: { view: 'members', event: makeEvent({ roster: makeRoster(), attendances: BIG_TEAM }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(`Member ${MEMBER_CAP}`)).toBeInTheDocument()
    await expect(canvas.queryByText(`Member ${MEMBER_CAP + 1}`)).not.toBeInTheDocument()

    const seeAll = canvas.getByRole('link', { name: /See all 18/ })
    await expect(seeAll).toHaveAttribute('href', '/t/setpoint-vt/events/evt-002')
  },
}

// At or below the cap there is nothing behind a link, so no link.
export const NoSeeAllLinkUnderTheCap: Story = {
  args: { view: 'members' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link', { name: /See all/ })).not.toBeInTheDocument()
  },
}

// ── Read-only on the card (#271 ⑫) ───────────────────────────────────────────────────────────────

// Editing a teammate's attendance lives on detail-page rows only. Reusing AttendeeList here must not
// extend that to the list page — so the rows carry the answer as a fact, with nothing to open.
export const MemberListIsReadOnly: Story = {
  args: { view: 'members' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sanne')).toBeInTheDocument()
    // No per-row disclosure…
    await expect(canvas.queryByRole('button', { name: /Change .*'s answer/ })).not.toBeInTheDocument()
    // …and therefore no three-way control anywhere in the panel.
    await expect(canvas.queryByRole('button', { name: /^Going$/ })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: /^Can't$/ })).not.toBeInTheDocument()
  },
}

// ── The social (#324 cause 3) ────────────────────────────────────────────────────────────────────

// Tracking off: there are no pips to draw, so the panel is its people whatever the preference says —
// which is what finally gives a social something to expand to. No view switch: the other view would
// be blank.
export const SocialAlwaysShowsMembers: Story = {
  args: {
    view: 'pips',
    event: makeEvent({ roster: makeRoster({ ...NO_ROSTER, totalAttending: 4 }), attendances: TEAM }),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sanne')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Positions' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'People' })).not.toBeInTheDocument()
    // `Keep open` is still offered — it applies to every card.
    await expect(canvas.getByRole('button', { name: 'Keep open' })).toBeInTheDocument()
  },
}
