import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { CalendarLink } from '@shared/api/calendar-links'
import type { EventTypeItem } from '@shared/api/event-types'
import { Stack } from '@shared/testing/stack'
import { CalendarLinksView } from './CalendarLinksView'

// The prop-only calendar-links page body behind the CalendarLinks container (ADR-0017). Three
// stories (ADR-0032 §1): Data is the full list at the cap of three — a Me link, a Partner link and
// an expired Custom one limited to two types, one archived — Shells stacks loading / error / empty
// with the Me/Partner explainer open, Interactions keeps every prop-contract spy.
const FEED = 'https://api.teambalance.nl/api/calendar/setpoint-vt'
const ALL_STATES: CalendarLink['attendanceStates'] = ['ATTENDING', 'MAYBE', 'ABSENT', 'NOT_RESPONDED']

const eventType = (id: string, name: string, color: string, archived = false): EventTypeItem => ({
  id,
  name,
  color,
  archived,
  rosterDefault: { trackRoster: false, totalTarget: undefined, positionTargets: [] },
})
const TRAINING = eventType('t-training', 'Training', '#249E6C')
const MATCH = eventType('t-match', 'Match', '#225C9C')
const BEACH = eventType('t-beach', 'Beach', '#F4B400', true)
const EVENT_TYPES = [TRAINING, MATCH, BEACH]

const PHONE: CalendarLink = {
  id: 'l3',
  label: 'My phone',
  createdAt: '2026-09-01T10:00:00Z',
  expiresAt: '2027-09-01T10:00:00Z',
  expired: false,
  url: `${FEED}/token-phone.ics`,
  attendanceStates: ALL_STATES,
  showAttendancePrefix: true,
  calendarNameSuffix: undefined,
  eventTypeIds: undefined,
}

const PARTNER: CalendarLink = {
  id: 'l2',
  label: 'Partner',
  createdAt: '2026-03-14T10:00:00Z',
  expiresAt: '2027-03-14T10:00:00Z',
  expired: false,
  url: `${FEED}/token-partner.ics`,
  attendanceStates: ['ATTENDING'],
  showAttendancePrefix: false,
  calendarNameSuffix: 'Partner',
  eventTypeIds: undefined,
}

const UNLABELLED_CUSTOM: CalendarLink = {
  id: 'l1',
  label: undefined,
  createdAt: '2025-06-02T10:00:00Z',
  expiresAt: '2026-06-02T10:00:00Z',
  expired: true,
  url: `${FEED}/token-custom.ics`,
  attendanceStates: ['ATTENDING', 'MAYBE'],
  showAttendancePrefix: true,
  calendarNameSuffix: undefined,
  eventTypeIds: [BEACH.id, TRAINING.id],
}

const AT_CAP = [PHONE, PARTNER, UNLABELLED_CUSTOM]

const ME_REQUEST = {
  attendanceStates: ALL_STATES,
  showAttendancePrefix: true,
  calendarNameSuffix: undefined,
  eventTypeIds: undefined,
}

const meta = {
  title: 'features/calendar-links/CalendarLinksView',
  component: CalendarLinksView,
  args: {
    teamName: 'Setpoint VT',
    links: AT_CAP,
    eventTypes: EVENT_TYPES,
    onGenerate: fn(),
    onUpdate: fn(),
    onDelete: fn(),
    onCopy: fn(),
    onRetry: fn(),
  },
} satisfies Meta<typeof CalendarLinksView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    const row = (name: string) => within(canvas.getByRole('listitem', { name }))

    await expect(row('My phone').getByText('Expires 1 sep 2027')).toBeInTheDocument()
    // No label: the creation date names the link instead.
    await expect(row('Link from 2 jun 2025').getByText('Expired 2 jun 2026')).toBeInTheDocument()
    await expect(row('Link from 2 jun 2025').getByText('Expired', { exact: true })).toBeInTheDocument()
    await expect(row('My phone').queryByText('Expired')).not.toBeInTheDocument()

    // A link at the Me defaults looks as it always did; any other says how it differs.
    await expect(row('My phone').queryByText(/only|marks|calendar:/)).not.toBeInTheDocument()
    await expect(
      row('Partner').getByText('Going only · no ✓/✗ marks · calendar: Setpoint VT · Partner'),
    ).toBeInTheDocument()
    // Types in the team's order; an archived one is still listed, and says so.
    await expect(
      row('Link from 2 jun 2025').getByText('Training, Beach (archived) · Going, Maybe only'),
    ).toBeInTheDocument()

    // Every action on every link, no platform detection.
    await expect(row('My phone').getByRole('link', { name: 'Open in Calendar' })).toHaveAttribute(
      'href',
      'webcal://api.teambalance.nl/api/calendar/setpoint-vt/token-phone.ics',
    )
    const google = row('My phone').getByRole('link', { name: 'Add to Google Calendar' })
    await expect(google).toHaveAttribute(
      'href',
      'https://calendar.google.com/calendar/r?cid=webcal%3A%2F%2Fapi.teambalance.nl%2Fapi%2Fcalendar%2Fsetpoint-vt%2Ftoken-phone.ics',
    )
    await expect(google).toHaveAttribute('target', '_blank')
    await expect(row('Link from 2 jun 2025').getByRole('button', { name: 'Delete' })).toBeEnabled()

    // Three links (the expired one counted) is the cap.
    await expect(canvas.getByRole('button', { name: 'Generate link' })).toBeDisabled()
    await expect(canvas.getByText(/You have 3 links, the maximum/)).toBeInTheDocument()
  },
}

export const Shells: Story = {
  render: (args) => (
    <Stack
      items={{
        Loading: <CalendarLinksView {...args} isLoading />,
        Error: <CalendarLinksView {...args} isError />,
        Empty: <CalendarLinksView {...args} links={[]} />,
        'Copy refused': <CalendarLinksView {...args} links={[PHONE]} copyFailedId="l3" />,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const region = (name: string) => within(canvas.getByRole('region', { name }))

    await expect(region('Loading').getByText('Loading…')).toBeInTheDocument()
    await expect(region('Loading').queryByRole('button', { name: 'Generate link' })).not.toBeInTheDocument()

    await expect(region('Error').getByRole('alert')).toHaveTextContent("Couldn't load your calendar links")
    await expect(region('Error').queryByRole('button', { name: 'Generate link' })).not.toBeInTheDocument()

    await expect(region('Empty').getByText('No calendar links yet.')).toBeInTheDocument()
    await expect(region('Empty').getByRole('button', { name: 'Generate link' })).toBeEnabled()

    // The browser refused the clipboard write: say so, and put the URL where it can be copied by hand.
    const refused = region('Copy refused')
    await expect(refused.getByRole('alert')).toHaveTextContent("Couldn't copy automatically. Copy the link below.")
    await expect(refused.getByLabelText('Calendar link URL for My phone')).toHaveValue(PHONE.url)
    await expect(refused.getByRole('button', { name: 'Copy link' })).toBeInTheDocument()

    // Left open for the snapshot: the Me/Partner explainer is shown by no page composite.
    await userEvent.click(region('Empty').getByRole('button', { name: 'About Me and Partner' }))
    await expect(await within(document.body).findByText(/only events you are attending/)).toBeVisible()
  },
}

// Picture owned by Data and Shells — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Below the cap': <CalendarLinksView {...args} links={[PHONE, PARTNER]} copiedId="l2" />,
        'An expired link': <CalendarLinksView {...args} links={[UNLABELLED_CUSTOM]} />,
        'Save failed': <CalendarLinksView {...args} links={[PHONE]} actionError />,
        Error: <CalendarLinksView {...args} isError />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = within(canvas.getByRole('region', { name: 'Below the cap' }))
    const portal = within(document.body)

    // The copied feedback is per link: only the one the container says was copied reads "Copied!".
    await expect(
      within(region.getByRole('listitem', { name: 'Partner' })).getByRole('button', { name: 'Copied!' }),
    ).toBeInTheDocument()
    const phone = within(region.getByRole('listitem', { name: 'My phone' }))
    await userEvent.click(phone.getByRole('button', { name: 'Copy link' }))
    await expect(args.onCopy).toHaveBeenCalledWith(PHONE)

    // Cancelling the confirmation deletes nothing.
    await userEvent.click(phone.getByRole('button', { name: 'Delete' }))
    await expect(
      await portal.findByText('Every calendar subscribed with this link stops updating.'),
    ).toBeInTheDocument()
    // A fixed title: one built from the target would go blank while the dialog animates out.
    await expect(portal.getByRole('heading', { name: 'Delete calendar link?' })).toBeInTheDocument()
    await userEvent.click(portal.getByRole('button', { name: 'Cancel' }))
    await expect(args.onDelete).not.toHaveBeenCalled()

    await userEvent.click(phone.getByRole('button', { name: 'Delete' }))
    await userEvent.click(await portal.findByRole('button', { name: 'Delete link' }))
    await expect(args.onDelete).toHaveBeenCalledWith('l3')

    // Me is the default. No label is sent as none, so the server falls back to the creation date.
    await expect(region.getByRole('radio', { name: 'Me' })).toBeChecked()
    await userEvent.click(region.getByRole('button', { name: 'Generate link' }))
    await expect(args.onGenerate).toHaveBeenLastCalledWith({ label: undefined, ...ME_REQUEST })

    // Re-queried each time: a submit renders a fresh form.
    const label = () => region.getByLabelText('Label (optional)')
    await expect(label()).toHaveAttribute('maxLength', '50')
    // Enter submits the form, like the button does.
    await userEvent.type(label(), '  Work laptop {Enter}')
    await expect(args.onGenerate).toHaveBeenLastCalledWith({ label: 'Work laptop', ...ME_REQUEST })
    await expect(label()).toHaveValue('')

    // Partner: attending only, no marks, a suffixed calendar name — and the empty label prefilled.
    await userEvent.click(region.getByRole('radio', { name: 'Partner' }))
    await expect(label()).toHaveValue('Partner')
    await userEvent.click(region.getByRole('button', { name: 'Generate link' }))
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: 'Partner',
      attendanceStates: ['ATTENDING'],
      showAttendancePrefix: false,
      calendarNameSuffix: 'Partner',
    })
    // The form starts over at Me.
    await expect(region.getByRole('radio', { name: 'Me' })).toBeChecked()

    // Switching back to Me takes the auto-filled label with it, so a Me link is not named Partner.
    await userEvent.click(region.getByRole('radio', { name: 'Partner' }))
    await expect(label()).toHaveValue('Partner')
    await userEvent.click(region.getByRole('radio', { name: 'Me' }))
    await userEvent.click(region.getByRole('button', { name: 'Generate link' }))
    await expect(args.onGenerate).toHaveBeenLastCalledWith({ label: undefined, ...ME_REQUEST })

    // A label the member typed is theirs: kept when Partner is picked, and when Me is picked again.
    await userEvent.type(label(), 'Sanne')
    await userEvent.click(region.getByRole('radio', { name: 'Partner' }))
    await expect(label()).toHaveValue('Sanne')
    await userEvent.click(region.getByRole('radio', { name: 'Me' }))
    await expect(label()).toHaveValue('Sanne')
    await userEvent.clear(label())

    // Any edit under Advanced makes the form Custom, and the request carries exactly the edit.
    await userEvent.click(region.getByRole('button', { name: 'Advanced' }))
    await expect(region.getByRole('button', { name: 'Advanced' })).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(region.getByRole('button', { name: "Can't" }))
    await expect(region.getByRole('button', { name: "Can't" })).toHaveAttribute('aria-pressed', 'false')
    await expect(region.getByRole('radio', { name: 'Custom' })).toBeChecked()
    const suffix = region.getByLabelText('Calendar name suffix (optional)')
    await expect(suffix).toHaveAttribute('maxLength', '30')
    await userEvent.type(suffix, 'Work')
    await expect(region.getByText("Your calendar app shows it as 'Setpoint VT · Work'.")).toBeInTheDocument()
    await userEvent.click(region.getByRole('switch', { name: 'Mark your answer on titles' }))
    await userEvent.click(region.getByRole('button', { name: 'Generate link' }))
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: undefined,
      attendanceStates: ['ATTENDING', 'MAYBE', 'NOT_RESPONDED'],
      showAttendancePrefix: false,
      calendarNameSuffix: 'Work',
    })

    // Tapping a preset after an edit resets the options to it.
    await userEvent.click(region.getByRole('button', { name: 'Advanced' }))
    await userEvent.click(region.getByRole('button', { name: 'Maybe' }))
    await expect(region.getByRole('radio', { name: 'Custom' })).toBeChecked()
    await userEvent.click(region.getByRole('radio', { name: 'Me' }))
    await expect(region.getByRole('button', { name: 'Maybe' })).toHaveAttribute('aria-pressed', 'true')

    // Event types: every type until one is picked, then exactly the picked ones, in the team's order.
    // An archived type is not offered for a new link. Picking a type makes the link Custom.
    await expect(region.getByRole('button', { name: 'Advanced' })).toHaveAttribute('aria-expanded', 'true')
    await expect(region.getByRole('button', { name: 'All types' })).toHaveAttribute('aria-pressed', 'true')
    await expect(region.queryByRole('button', { name: 'Beach' })).not.toBeInTheDocument()
    await userEvent.click(region.getByRole('button', { name: 'Match' }))
    await expect(region.getByRole('button', { name: 'All types' })).toHaveAttribute('aria-pressed', 'false')
    await expect(region.getByRole('radio', { name: 'Custom' })).toBeChecked()
    // Deselecting the last one is every type again.
    await userEvent.click(region.getByRole('button', { name: 'Match' }))
    await expect(region.getByRole('button', { name: 'All types' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(region.getByRole('button', { name: 'Match' }))
    await userEvent.click(region.getByRole('button', { name: 'Training' }))
    await userEvent.click(region.getByRole('button', { name: 'Generate link' }))
    await expect(args.onGenerate).toHaveBeenLastCalledWith({
      label: undefined,
      ...ME_REQUEST,
      eventTypeIds: [TRAINING.id, MATCH.id],
    })

    // Editing happens in the row, in the same form, starting from the link's own preset. Cancel
    // leaves the link alone.
    const partner = () => within(region.getByRole('listitem', { name: 'Partner' }))
    await userEvent.click(phone.getByRole('button', { name: 'Edit' }))
    await userEvent.type(phone.getByLabelText('Label (optional)'), ' 2')
    await userEvent.click(phone.getByRole('button', { name: 'Cancel' }))
    await expect(args.onUpdate).not.toHaveBeenCalled()
    await expect(phone.queryByLabelText('Label (optional)')).not.toBeInTheDocument()

    // One row open at a time.
    await userEvent.click(phone.getByRole('button', { name: 'Edit' }))
    await userEvent.click(partner().getByRole('button', { name: 'Edit' }))
    await expect(phone.queryByLabelText('Label (optional)')).not.toBeInTheDocument()
    await expect(partner().getByRole('radio', { name: 'Partner' })).toBeChecked()
    await expect(partner().getByLabelText('Label (optional)')).toHaveValue('Partner')

    await userEvent.clear(partner().getByLabelText('Label (optional)'))
    await userEvent.type(partner().getByLabelText('Label (optional)'), 'Sanne')
    await userEvent.click(partner().getByRole('button', { name: 'Advanced' }))
    await userEvent.click(partner().getByRole('button', { name: 'Match' }))
    await userEvent.click(partner().getByRole('button', { name: 'Save' }))
    await expect(args.onUpdate).toHaveBeenCalledWith(
      'l2',
      {
        label: 'Sanne',
        attendanceStates: ['ATTENDING'],
        showAttendancePrefix: false,
        calendarNameSuffix: 'Partner',
        eventTypeIds: [MATCH.id],
      },
      expect.any(Function),
    )
    // The row stays open until the container says the save landed, so a failed one keeps the edits.
    await expect(partner().getByRole('button', { name: 'Save' })).toBeInTheDocument()
    const onSaved: () => void = (args.onUpdate as ReturnType<typeof fn>).mock.calls[0][2]
    onSaved()
    await expect(await partner().findByRole('button', { name: 'Edit' })).toBeInTheDocument()

    // A failed save is reported in the row being edited, not under the create form.
    const failed = within(canvas.getByRole('region', { name: 'Save failed' }))
    const failedRow = within(failed.getByRole('listitem', { name: 'My phone' }))
    await expect(failedRow.queryByRole('alert')).not.toBeInTheDocument()
    await userEvent.click(failedRow.getByRole('button', { name: 'Edit' }))
    await expect(failedRow.getByRole('alert')).toHaveTextContent('Something went wrong. Please try again.')
    await expect(failed.getAllByRole('alert')).toHaveLength(1)

    // An expired link is not edited: it serves nothing, so there is nothing to change.
    const expired = within(
      within(canvas.getByRole('region', { name: 'An expired link' })).getByRole('listitem', {
        name: 'Link from 2 jun 2025',
      }),
    )
    await expect(expired.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    await expect(expired.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()

    // The explainer opens on a click (a tap on a phone), not only on hover.
    await userEvent.click(region.getByRole('button', { name: 'About Me and Partner' }))
    await expect(
      await portal.findByText('everything the team schedules, with your answer marked.', { exact: false }),
    ).toBeInTheDocument()
    await expect(
      portal.getByText("only events you are attending, no marks, calendar named 'Setpoint VT · Partner'.", {
        exact: false,
      }),
    ).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')

    await userEvent.click(within(canvas.getByRole('region', { name: 'Error' })).getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}
