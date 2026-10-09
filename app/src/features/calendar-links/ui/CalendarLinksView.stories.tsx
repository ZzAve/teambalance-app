import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type { CalendarLink } from '@shared/api/calendar-links'
import { Stack } from '@shared/testing/stack'
import { CalendarLinksView } from './CalendarLinksView'

// The prop-only calendar-links page body behind the CalendarLinks container (ADR-0017). Three
// stories (ADR-0032 §1): Data is the full list at the cap of three with one expired, Shells
// stacks loading / error / empty, Interactions keeps every prop-contract spy.
const FEED = 'https://api.teambalance.nl/api/calendar/setpoint-vt'

const PHONE: CalendarLink = {
  id: 'l3',
  label: 'My phone',
  createdAt: '2026-09-01T10:00:00Z',
  expiresAt: '2027-09-01T10:00:00Z',
  expired: false,
  url: `${FEED}/token-phone.ics`,
}

const UNLABELLED: CalendarLink = {
  id: 'l2',
  label: undefined,
  createdAt: '2026-03-14T10:00:00Z',
  expiresAt: '2027-03-14T10:00:00Z',
  expired: false,
  url: `${FEED}/token-unlabelled.ics`,
}

const OLD_LAPTOP: CalendarLink = {
  id: 'l1',
  label: 'Old laptop',
  createdAt: '2025-06-02T10:00:00Z',
  expiresAt: '2026-06-02T10:00:00Z',
  expired: true,
  url: `${FEED}/token-laptop.ics`,
}

const AT_CAP = [PHONE, UNLABELLED, OLD_LAPTOP]

const meta = {
  title: 'features/calendar-links/CalendarLinksView',
  component: CalendarLinksView,
  args: { links: AT_CAP, onGenerate: fn(), onDelete: fn(), onCopy: fn(), onRetry: fn() },
} satisfies Meta<typeof CalendarLinksView>

export default meta

type Story = StoryObj<typeof meta>

export const Data: Story = {
  play: async ({ canvas }) => {
    const row = (name: string) => within(canvas.getByRole('listitem', { name }))

    await expect(row('My phone').getByText('Expires 1 sep 2027')).toBeInTheDocument()
    // No label: the creation date names the link instead.
    await expect(row('Link from 14 mrt 2026').getByText('Expires 14 mrt 2027')).toBeInTheDocument()
    await expect(row('Old laptop').getByText('Expired')).toBeInTheDocument()
    await expect(row('My phone').queryByText('Expired')).not.toBeInTheDocument()

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
    await expect(row('Old laptop').getByRole('button', { name: 'Delete' })).toBeEnabled()

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
  play: async ({ canvas }) => {
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
  },
}

// Picture owned by Data and Shells — behavioural only (ADR-0032 §1).
export const Interactions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stack
      items={{
        'Below the cap': <CalendarLinksView {...args} links={[PHONE, UNLABELLED]} copiedId="l2" />,
        Error: <CalendarLinksView {...args} isError />,
      }}
    />
  ),
  play: async ({ canvas, userEvent, args }) => {
    const region = within(canvas.getByRole('region', { name: 'Below the cap' }))
    const portal = within(document.body)

    // The copied feedback is per link: only the one the container says was copied reads "Copied!".
    await expect(
      within(region.getByRole('listitem', { name: 'Link from 14 mrt 2026' })).getByRole('button', { name: 'Copied!' }),
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

    // No label is sent as none, so the server falls back to the creation date.
    await userEvent.click(region.getByRole('button', { name: 'Generate link' }))
    await expect(args.onGenerate).toHaveBeenLastCalledWith(undefined)

    const label = region.getByLabelText('Label (optional)')
    await expect(label).toHaveAttribute('maxLength', '50')
    // Enter submits the form, like the button does.
    await userEvent.type(label, '  Work laptop {Enter}')
    await expect(args.onGenerate).toHaveBeenLastCalledWith('Work laptop')
    await expect(label).toHaveValue('')

    await userEvent.click(within(canvas.getByRole('region', { name: 'Error' })).getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalled()
  },
}
